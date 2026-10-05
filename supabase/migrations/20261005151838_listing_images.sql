-- Listing photos: up to 5 per listing, in a public bucket. Photos are part of the listing, so they can only change while
-- it's a draft (or has changes requested) and are reviewed with it. Submitting now needs at least one photo.

create table public.listing_images (
	id uuid primary key default gen_random_uuid(),
	listing_id uuid not null references public.listings (id) on delete cascade,
	-- Object name in the listing-images bucket: <listing_id>/<file>.
	storage_path text not null unique,
	-- 0 is the cover. Unique per listing and 0–4, which caps a listing at 5 photos.
	position smallint not null check (position between 0 and 4),
	width integer not null check (width between 1 and 4000),
	height integer not null check (height between 1 and 4000),
	created_at timestamptz not null default now(),
	constraint listing_images_path_in_listing_folder check (storage_path like listing_id::text || '/%'),
	-- Deferred so a reorder can swap positions within one statement.
	constraint listing_images_position_unique unique (listing_id, position) deferrable initially deferred
);

comment on table public.listing_images is 'Listing photos in display order; position 0 is the cover. Written only by the functions below.';

alter table public.listing_images enable row level security;
revoke all on public.listing_images from anon, authenticated;
grant select on public.listing_images to anon, authenticated;

create policy "Photos of public listings are viewable by everyone"
	on public.listing_images for select
	to anon, authenticated
	using (public.is_listing_public(listing_id));

create policy "Members and admins can view listing photos"
	on public.listing_images for select
	to authenticated
	using (public.is_listing_member(listing_id) or public.is_platform_admin());

----------------------------------------------------------------------------------------------------
-- Writes
----------------------------------------------------------------------------------------------------

-- Shared checks for photo changes: the caller is a member and the listing can be edited.
create function public.listing_images_guard(p_listing_id uuid)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
	if not public.is_listing_member(p_listing_id) then
		raise exception 'not_a_member';
	end if;
	if not public.is_listing_editable(p_listing_id) then
		raise exception 'listing_locked';
	end if;
end;
$$;

-- Adds a photo the browser has uploaded, after the existing ones. Returns its id.
create function public.add_listing_image(p_listing_id uuid, p_storage_path text, p_width integer, p_height integer)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_position smallint;
	v_id uuid;
begin
	perform public.listing_images_guard(p_listing_id);
	-- Serialise concurrent uploads to the same listing.
	perform 1 from public.listings where id = p_listing_id for update;

	select count(*) into v_position from public.listing_images where listing_id = p_listing_id;
	if v_position >= 5 then
		raise exception 'too_many_images';
	end if;

	insert into public.listing_images (listing_id, storage_path, position, width, height)
	values (p_listing_id, p_storage_path, v_position, p_width, p_height)
	returning id into v_id;
	return v_id;
end;
$$;

-- Removes a photo and closes the gap, so positions stay 0..n-1. Returns the storage path for the caller to delete.
create function public.remove_listing_image(p_image_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_image public.listing_images;
begin
	select * into v_image from public.listing_images where id = p_image_id;
	if not found then
		raise exception 'image_not_found';
	end if;
	perform public.listing_images_guard(v_image.listing_id);

	delete from public.listing_images where id = p_image_id;
	update public.listing_images
	set position = position - 1
	where listing_id = v_image.listing_id and position > v_image.position;
	return v_image.storage_path;
end;
$$;

-- Puts a listing's photos in the given order; the first becomes the cover. Must list every photo exactly once.
create function public.reorder_listing_images(p_listing_id uuid, p_image_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	perform public.listing_images_guard(p_listing_id);

	if cardinality(p_image_ids) <> (select count(*) from public.listing_images where listing_id = p_listing_id)
		or cardinality(p_image_ids) <> cardinality(array(select distinct unnest(p_image_ids)))
		or exists (
			select 1 from unnest(p_image_ids) as given (id)
			where not exists (select 1 from public.listing_images i where i.id = given.id and i.listing_id = p_listing_id)
		)
	then
		raise exception 'invalid_image_order';
	end if;

	update public.listing_images i
	set position = ordered.ordinality - 1
	from unnest(p_image_ids) with ordinality as ordered (id, ordinality)
	where i.id = ordered.id;
end;
$$;

revoke execute on function public.listing_images_guard(uuid) from public, anon, authenticated;
revoke execute on function public.add_listing_image(uuid, text, integer, integer) from public, anon;
revoke execute on function public.remove_listing_image(uuid) from public, anon;
revoke execute on function public.reorder_listing_images(uuid, uuid[]) from public, anon;
grant execute on function public.add_listing_image(uuid, text, integer, integer) to authenticated;
grant execute on function public.remove_listing_image(uuid) to authenticated;
grant execute on function public.reorder_listing_images(uuid, uuid[]) to authenticated;

----------------------------------------------------------------------------------------------------
-- Submitting needs at least one photo
----------------------------------------------------------------------------------------------------

-- Checks a draft against category policy and AVS rules, then sends it for review (or publishes it, for categories
-- that don't need review). Raises a code naming the first rule that fails.
create or replace function public.submit_listing_for_review(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	-- AVS thresholds (see .claude/plans/research-sg-pet-sale-rules.md). Change them here only.
	c_min_handover_days constant integer := 63; -- puppies go home at 9 weeks or older
	c_vaccination_rest_days constant integer := 7; -- rest after the last vaccination before sale
	c_import_rest_days constant integer := 3; -- 72 hours after an imported animal arrives
	c_min_vaccinations constant integer := 2;
	c_min_dewormings constant integer := 2;

	v_listing public.listings;
	v_category public.categories;
	v_seller public.sellers;
	v_details public.pet_listing_details;
	v_private public.pet_listing_private;
	v_vaccinations integer;
	v_last_vaccination date;
begin
	if not public.is_listing_member(p_listing_id) then
		raise exception 'not_a_member';
	end if;

	select * into v_listing from public.listings where id = p_listing_id for update;
	if v_listing.status not in ('draft', 'changes_requested') then
		raise exception 'invalid_transition';
	end if;

	select * into v_category from public.categories where id = v_listing.category_id;
	select * into v_seller from public.sellers where id = v_listing.seller_id;
	if not public.seller_can_list(v_seller.id, v_category.species_id) then
		raise exception 'seller_cannot_list';
	end if;

	select * into v_details from public.pet_listing_details where listing_id = p_listing_id;
	select * into v_private from public.pet_listing_private where listing_id = p_listing_id;

	if v_listing.title is null or v_listing.price_cents is null or v_details.breed_id is null or v_details.sex is null
		or v_details.date_of_birth is null or v_details.ready_date is null or v_details.colour is null
		or v_private.microchip_no is null or v_private.source is null
	then
		raise exception 'missing_details';
	end if;

	if v_details.date_of_birth > current_date or v_details.ready_date < v_details.date_of_birth
		or exists (
			select 1 from public.pet_health_records
			where listing_id = p_listing_id and (given_on < v_details.date_of_birth or given_on > current_date)
		)
	then
		raise exception 'invalid_dates';
	end if;

	if exists (
		select 1 from public.breeds
		where id in (v_details.breed_id, v_details.cross_breed_id) and specified_part = 1
	) then
		raise exception 'restricted_breed';
	end if;

	if v_details.ready_date < v_details.date_of_birth + c_min_handover_days then
		raise exception 'too_young_at_handover';
	end if;

	select count(*), max(given_on) into v_vaccinations, v_last_vaccination
	from public.pet_health_records where listing_id = p_listing_id and kind = 'vaccination';
	if v_vaccinations < c_min_vaccinations or v_last_vaccination + c_vaccination_rest_days > v_details.ready_date then
		raise exception 'vaccinations_incomplete';
	end if;

	if (select count(*) from public.pet_health_records where listing_id = p_listing_id and kind = 'deworming')
		< c_min_dewormings
	then
		raise exception 'deworming_incomplete';
	end if;

	-- Breeders may only sell animals they bred; pet shops buy from licensed breeders or import legally.
	if not (
		(v_seller.seller_type = 'breeder' and v_private.source = 'bred_on_premises')
		or (v_seller.seller_type = 'pet_shop' and v_private.source = 'licensed_breeder'
			and v_private.source_licence_no is not null)
		or (v_seller.seller_type = 'pet_shop' and v_private.source = 'imported'
			and v_private.import_permit_no is not null and v_private.arrival_date is not null
			and v_private.arrival_date <= current_date
			and v_details.ready_date >= v_private.arrival_date + c_import_rest_days)
	) then
		raise exception 'invalid_source';
	end if;

	if not exists (select 1 from public.listing_images where listing_id = p_listing_id) then
		raise exception 'missing_photos';
	end if;

	if not exists (select 1 from public.listing_documents where listing_id = p_listing_id and kind = 'vaccination_card') then
		raise exception 'missing_vaccination_card';
	end if;
	if v_private.source = 'imported'
		and not exists (select 1 from public.listing_documents where listing_id = p_listing_id and kind = 'import_permit')
	then
		raise exception 'missing_import_permit';
	end if;

	update public.listings
	set
		status = case when v_category.requires_review then 'pending_review' else 'published' end,
		submitted_at = now(),
		published_at = case when v_category.requires_review then published_at else now() end,
		status_changed_at = now()
	where id = p_listing_id;
end;
$$;

----------------------------------------------------------------------------------------------------
-- Storage: public bucket for listing photos
----------------------------------------------------------------------------------------------------

-- Public reads come straight from the CDN; object names are random, so draft photos aren't discoverable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "Seller members can upload photos to editable listings"
	on storage.objects for insert
	to authenticated
	with check (
		bucket_id = 'listing-images'
		and (storage.foldername(name))[1] in (
			select l.id::text
			from public.listings l
			join public.seller_members m on m.seller_id = l.seller_id
			where m.user_id = (select auth.uid()) and l.status in ('draft', 'changes_requested')
		)
	);

-- Storage needs a select policy to delete through the API.
create policy "Seller members can see their listing photo objects"
	on storage.objects for select
	to authenticated
	using (
		bucket_id = 'listing-images'
		and (storage.foldername(name))[1] in (
			select l.id::text
			from public.listings l
			join public.seller_members m on m.seller_id = l.seller_id
			where m.user_id = (select auth.uid())
		)
	);

create policy "Seller members can delete photos from editable listings"
	on storage.objects for delete
	to authenticated
	using (
		bucket_id = 'listing-images'
		and (storage.foldername(name))[1] in (
			select l.id::text
			from public.listings l
			join public.seller_members m on m.seller_id = l.seller_id
			where m.user_id = (select auth.uid()) and l.status in ('draft', 'changes_requested')
		)
	);
