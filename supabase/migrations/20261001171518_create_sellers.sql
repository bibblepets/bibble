-- Seller accounts: licensed businesses that can list animals, their members, private details and verification
-- documents. Sellers write through the functions below and a narrow set of column grants; admins verify them
-- (admin screens arrive separately).

----------------------------------------------------------------------------------------------------
-- Reference data
----------------------------------------------------------------------------------------------------

create table public.areas (
	id smallint generated always as identity primary key,
	slug text not null unique,
	name text not null unique,
	region text not null check (region in ('central', 'east', 'north', 'north_east', 'west'))
);

comment on table public.areas is 'Areas of Singapore (URA Master Plan 2019 planning areas) and their region. Public location for sellers and listings.';

insert into public.areas (slug, name, region)
values
	('bishan', 'Bishan', 'central'),
	('bukit-merah', 'Bukit Merah', 'central'),
	('bukit-timah', 'Bukit Timah', 'central'),
	('downtown-core', 'Downtown Core', 'central'),
	('geylang', 'Geylang', 'central'),
	('kallang', 'Kallang', 'central'),
	('marina-east', 'Marina East', 'central'),
	('marina-south', 'Marina South', 'central'),
	('marine-parade', 'Marine Parade', 'central'),
	('museum', 'Museum', 'central'),
	('newton', 'Newton', 'central'),
	('novena', 'Novena', 'central'),
	('orchard', 'Orchard', 'central'),
	('outram', 'Outram', 'central'),
	('queenstown', 'Queenstown', 'central'),
	('river-valley', 'River Valley', 'central'),
	('rochor', 'Rochor', 'central'),
	('singapore-river', 'Singapore River', 'central'),
	('southern-islands', 'Southern Islands', 'central'),
	('straits-view', 'Straits View', 'central'),
	('tanglin', 'Tanglin', 'central'),
	('toa-payoh', 'Toa Payoh', 'central'),
	('bedok', 'Bedok', 'east'),
	('changi', 'Changi', 'east'),
	('changi-bay', 'Changi Bay', 'east'),
	('pasir-ris', 'Pasir Ris', 'east'),
	('paya-lebar', 'Paya Lebar', 'east'),
	('tampines', 'Tampines', 'east'),
	('central-water-catchment', 'Central Water Catchment', 'north'),
	('lim-chu-kang', 'Lim Chu Kang', 'north'),
	('mandai', 'Mandai', 'north'),
	('sembawang', 'Sembawang', 'north'),
	('simpang', 'Simpang', 'north'),
	('sungei-kadut', 'Sungei Kadut', 'north'),
	('woodlands', 'Woodlands', 'north'),
	('yishun', 'Yishun', 'north'),
	('ang-mo-kio', 'Ang Mo Kio', 'north_east'),
	('hougang', 'Hougang', 'north_east'),
	('north-eastern-islands', 'North-Eastern Islands', 'north_east'),
	('punggol', 'Punggol', 'north_east'),
	('seletar', 'Seletar', 'north_east'),
	('sengkang', 'Sengkang', 'north_east'),
	('serangoon', 'Serangoon', 'north_east'),
	('boon-lay', 'Boon Lay', 'west'),
	('bukit-batok', 'Bukit Batok', 'west'),
	('bukit-panjang', 'Bukit Panjang', 'west'),
	('choa-chu-kang', 'Choa Chu Kang', 'west'),
	('clementi', 'Clementi', 'west'),
	('jurong-east', 'Jurong East', 'west'),
	('jurong-west', 'Jurong West', 'west'),
	('pioneer', 'Pioneer', 'west'),
	('tengah', 'Tengah', 'west'),
	('tuas', 'Tuas', 'west'),
	('western-islands', 'Western Islands', 'west'),
	('western-water-catchment', 'Western Water Catchment', 'west');

create table public.species (
	id smallint generated always as identity primary key,
	slug text not null unique,
	name text not null,
	-- Whether sellers can be licensed for and list this species yet. Inactive species show as "coming soon".
	is_active boolean not null default false
);

comment on table public.species is 'Animal species the marketplace knows about. Activating one is a data change.';

insert into public.species (slug, name, is_active)
values ('dog', 'Dogs', true), ('cat', 'Cats', false);

alter table public.areas enable row level security;
alter table public.species enable row level security;

create policy "Areas are viewable by everyone"
	on public.areas for select
	to anon, authenticated
	using (true);

create policy "Species are viewable by everyone"
	on public.species for select
	to anon, authenticated
	using (true);

revoke all on public.areas, public.species from anon, authenticated;
grant select on public.areas, public.species to anon, authenticated;

----------------------------------------------------------------------------------------------------
-- Platform admins
----------------------------------------------------------------------------------------------------

create table public.platform_admins (
	user_id uuid primary key references auth.users (id) on delete cascade,
	created_at timestamptz not null default now()
);

comment on table public.platform_admins is 'Bibble staff who verify sellers and review listings. Granted via SQL only.';

-- No policies: only reachable through is_platform_admin().
alter table public.platform_admins enable row level security;
revoke all on public.platform_admins from anon, authenticated;

create function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (select 1 from public.platform_admins where user_id = (select auth.uid()));
$$;

----------------------------------------------------------------------------------------------------
-- Sellers
----------------------------------------------------------------------------------------------------

create table public.sellers (
	id uuid primary key default gen_random_uuid(),
	-- Set on first submission, from the display name. Public URL segment.
	slug text unique,
	-- Only 'business' sellers can be created for now; 'individual' is reserved for services.
	entity_type text not null default 'business' check (entity_type in ('business', 'individual')),
	seller_type text not null check (seller_type in ('pet_shop', 'breeder')),
	display_name text check (char_length(display_name) between 1 and 80),
	legal_name text check (char_length(legal_name) between 1 and 160),
	uen text unique check (uen ~ '^[0-9A-Z]{9,10}$'),
	licence_no text check (licence_no ~ '^[0-9A-Z]{5,12}$'),
	licence_expires_on date,
	about text check (char_length(about) <= 1000),
	area_id smallint references public.areas (id),
	verification_status text not null default 'incomplete'
		check (verification_status in ('incomplete', 'pending', 'verified', 'rejected', 'suspended')),
	submitted_at timestamptz,
	verified_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	-- Business details may be filled in step by step, but must all be present once submitted.
	constraint sellers_complete_when_submitted check (
		verification_status = 'incomplete'
		or (
			display_name is not null
			and legal_name is not null
			and uen is not null
			and licence_no is not null
			and licence_expires_on is not null
			and area_id is not null
		)
	)
);

comment on table public.sellers is
	'Businesses that sell on Bibble. Publicly visible once verified. Format rules for UEN and licence numbers live in the app (lib/sellers/schema.ts).';

create index sellers_area_id_idx on public.sellers (area_id);

create table public.seller_members (
	seller_id uuid not null references public.sellers (id) on delete cascade,
	user_id uuid not null references auth.users (id) on delete cascade,
	role text not null default 'owner' check (role in ('owner', 'staff')),
	created_at timestamptz not null default now(),
	primary key (seller_id, user_id),
	-- One seller account per user for now. Dropping this later is backwards-compatible.
	constraint seller_members_one_seller_per_user unique (user_id)
);

comment on table public.seller_members is 'Users who can manage a seller account.';

create table public.seller_private_details (
	seller_id uuid primary key references public.sellers (id) on delete cascade,
	address_line1 text check (char_length(address_line1) between 1 and 120),
	address_line2 text check (char_length(address_line2) <= 120),
	postal_code text check (postal_code ~ '^[0-9]{6}$'),
	contact_phone text check (contact_phone ~ '^\+65[3689][0-9]{7}$'),
	contact_email text check (contact_email ~ '^[^@\s]+@[^@\s]+$'),
	updated_at timestamptz not null default now()
);

comment on table public.seller_private_details is 'Premises address and contact details. Seller members and admins only.';

create table public.seller_species (
	seller_id uuid not null references public.sellers (id) on delete cascade,
	species_id smallint not null references public.species (id),
	primary key (seller_id, species_id)
);

comment on table public.seller_species is 'Species the seller''s AVS licence covers, as checked by admins.';

create index seller_species_species_id_idx on public.seller_species (species_id);

create table public.seller_documents (
	id uuid primary key default gen_random_uuid(),
	seller_id uuid not null references public.sellers (id) on delete cascade,
	kind text not null check (kind in ('avs_licence', 'acra_bizfile')),
	-- Object name in the seller-documents bucket: <seller_id>/<file>.
	storage_path text not null unique,
	file_name text not null check (char_length(file_name) between 1 and 255),
	content_type text not null check (content_type in ('application/pdf', 'image/jpeg', 'image/png')),
	size_bytes integer not null check (size_bytes between 1 and 10485760),
	uploaded_by uuid not null references auth.users (id),
	created_at timestamptz not null default now(),
	constraint seller_documents_path_in_seller_folder check (storage_path like seller_id::text || '/%')
);

comment on table public.seller_documents is 'Verification documents. The newest row per kind is current; rows are never deleted.';

create index seller_documents_seller_id_kind_idx on public.seller_documents (seller_id, kind, created_at desc);
create index seller_documents_uploaded_by_idx on public.seller_documents (uploaded_by);

create trigger sellers_set_updated_at
	before update on public.sellers
	for each row execute function public.set_updated_at();

create trigger seller_private_details_set_updated_at
	before update on public.seller_private_details
	for each row execute function public.set_updated_at();

----------------------------------------------------------------------------------------------------
-- Helpers
----------------------------------------------------------------------------------------------------

create function public.is_seller_member(target_seller_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (
		select 1 from public.seller_members
		where seller_id = target_seller_id and user_id = (select auth.uid())
	);
$$;

-- Whether the seller may put up listings for the species: verified, licence in date, and licensed for it.
create function public.seller_can_list(target_seller_id uuid, target_species_id smallint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (
		select 1
		from public.sellers s
		join public.seller_species ss on ss.seller_id = s.id
		join public.species sp on sp.id = ss.species_id
		where s.id = target_seller_id
			and ss.species_id = target_species_id
			and sp.is_active
			and s.verification_status = 'verified'
			and s.licence_expires_on >= current_date
	);
$$;

----------------------------------------------------------------------------------------------------
-- Locking: once submitted, the details an admin verifies can only be changed by an admin
----------------------------------------------------------------------------------------------------
-- The guards apply to app users (the authenticated role). Migrations, the service role and security definer
-- functions run as other roles and are trusted to check permissions themselves.

create function public.sellers_guard_locked_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	if old.verification_status in ('pending', 'verified', 'suspended')
		and (
			new.seller_type is distinct from old.seller_type
			or new.legal_name is distinct from old.legal_name
			or new.uen is distinct from old.uen
			or new.licence_no is distinct from old.licence_no
		)
		and current_user = 'authenticated'
		and not public.is_platform_admin()
	then
		raise exception 'seller_details_locked'
			using hint = 'Business type, legal name, UEN and licence number can only be changed by Bibble once submitted.';
	end if;
	return new;
end;
$$;

create trigger sellers_guard_locked_fields
	before update on public.sellers
	for each row execute function public.sellers_guard_locked_fields();

create function public.seller_species_guard_locked()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
	target uuid := coalesce(new.seller_id, old.seller_id);
begin
	if current_user = 'authenticated' and not public.is_platform_admin() and exists (
		select 1 from public.sellers
		where id = target and verification_status in ('pending', 'verified', 'suspended')
	) then
		raise exception 'seller_details_locked'
			using hint = 'Licensed species can only be changed by Bibble once submitted.';
	end if;
	return coalesce(new, old);
end;
$$;

create trigger seller_species_guard_locked
	before insert or delete on public.seller_species
	for each row execute function public.seller_species_guard_locked();

----------------------------------------------------------------------------------------------------
-- Writes that span tables or change status
----------------------------------------------------------------------------------------------------

-- Creates the caller's seller account (status 'incomplete') with its owner membership and private details.
create function public.create_seller(p_seller_type text, p_species text[])
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
	caller uuid := (select auth.uid());
	new_seller_id uuid;
	species_ids smallint[];
begin
	if caller is null then
		raise exception 'not_authenticated';
	end if;
	if exists (select 1 from public.seller_members where user_id = caller) then
		raise exception 'seller_already_exists';
	end if;

	select array_agg(id) into species_ids
	from public.species
	where slug = any (p_species) and is_active;

	if coalesce(cardinality(species_ids), 0) = 0
		or cardinality(species_ids) <> cardinality(array(select distinct unnest(p_species)))
	then
		raise exception 'invalid_species';
	end if;

	insert into public.sellers (seller_type) values (p_seller_type) returning id into new_seller_id;
	insert into public.seller_members (seller_id, user_id, role) values (new_seller_id, caller, 'owner');
	insert into public.seller_private_details (seller_id, contact_email)
	select new_seller_id, email from auth.users where id = caller;
	insert into public.seller_species (seller_id, species_id) select new_seller_id, unnest(species_ids);

	return new_seller_id;
end;
$$;

-- Moves an incomplete or rejected seller to 'pending' once every detail and both documents are present.
create function public.submit_seller_for_verification(p_seller_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	seller public.sellers;
	details public.seller_private_details;
begin
	if not public.is_seller_member(p_seller_id) then
		raise exception 'not_a_member';
	end if;

	select * into seller from public.sellers where id = p_seller_id for update;
	if seller.verification_status not in ('incomplete', 'rejected') then
		raise exception 'already_submitted';
	end if;

	if seller.display_name is null or seller.legal_name is null or seller.uen is null or seller.licence_no is null
		or seller.licence_expires_on is null or seller.area_id is null
	then
		raise exception 'missing_business_details';
	end if;
	if seller.licence_expires_on < current_date then
		raise exception 'licence_expired';
	end if;

	select * into details from public.seller_private_details where seller_id = p_seller_id;
	if details.address_line1 is null or details.postal_code is null or details.contact_phone is null
		or details.contact_email is null
	then
		raise exception 'missing_contact_details';
	end if;

	if not exists (select 1 from public.seller_species where seller_id = p_seller_id) then
		raise exception 'missing_species';
	end if;

	if (select count(distinct kind) from public.seller_documents where seller_id = p_seller_id) < 2 then
		raise exception 'missing_documents';
	end if;

	update public.sellers
	set
		verification_status = 'pending',
		submitted_at = now(),
		slug = coalesce(
			slug,
			trim(both '-' from left(regexp_replace(lower(seller.display_name), '[^a-z0-9]+', '-', 'g'), 60))
				|| '-' || left(replace(p_seller_id::text, '-', ''), 6)
		)
	where id = p_seller_id;
end;
$$;

-- Internal helpers and trigger functions aren't callable directly.
revoke execute on function public.sellers_guard_locked_fields() from public, anon, authenticated;
revoke execute on function public.seller_species_guard_locked() from public, anon, authenticated;
revoke execute on function public.create_seller(text, text[]) from public, anon;
revoke execute on function public.submit_seller_for_verification(uuid) from public, anon;
revoke execute on function public.is_platform_admin() from public;
revoke execute on function public.is_seller_member(uuid) from public;
revoke execute on function public.seller_can_list(uuid, smallint) from public;
grant execute on function public.is_platform_admin() to anon, authenticated;
grant execute on function public.is_seller_member(uuid) to anon, authenticated;
grant execute on function public.seller_can_list(uuid, smallint) to anon, authenticated;
grant execute on function public.create_seller(text, text[]) to authenticated;
grant execute on function public.submit_seller_for_verification(uuid) to authenticated;

----------------------------------------------------------------------------------------------------
-- Row level security and column grants
----------------------------------------------------------------------------------------------------

alter table public.sellers enable row level security;
alter table public.seller_members enable row level security;
alter table public.seller_private_details enable row level security;
alter table public.seller_species enable row level security;
alter table public.seller_documents enable row level security;

-- Supabase grants every privilege by default; start from nothing and grant what each role needs.
revoke all on public.sellers, public.seller_members, public.seller_private_details, public.seller_species,
	public.seller_documents from anon, authenticated;

-- Sellers: rows are created by create_seller(); status, slug and timestamps are set by functions only.
grant select on public.sellers to anon, authenticated;
grant update (
	seller_type, display_name, legal_name, uen, licence_no, licence_expires_on, about, area_id
) on public.sellers to authenticated;

create policy "Verified sellers are viewable by everyone"
	on public.sellers for select
	to anon, authenticated
	using (verification_status = 'verified');

create policy "Members and admins can view their sellers"
	on public.sellers for select
	to authenticated
	using (public.is_seller_member(id) or public.is_platform_admin());

create policy "Members can update their seller"
	on public.sellers for update
	to authenticated
	using (public.is_seller_member(id))
	with check (public.is_seller_member(id));

-- Members
grant select on public.seller_members to authenticated;

create policy "Users can view their own memberships"
	on public.seller_members for select
	to authenticated
	using (user_id = (select auth.uid()) or public.is_platform_admin());

-- Private details: the row is created by create_seller().
grant select on public.seller_private_details to authenticated;
grant update (address_line1, address_line2, postal_code, contact_phone, contact_email)
	on public.seller_private_details to authenticated;

create policy "Members and admins can view private details"
	on public.seller_private_details for select
	to authenticated
	using (public.is_seller_member(seller_id) or public.is_platform_admin());

create policy "Members can update private details"
	on public.seller_private_details for update
	to authenticated
	using (public.is_seller_member(seller_id))
	with check (public.is_seller_member(seller_id));

-- Species: readable wherever the seller is; editable by members until submitted (see trigger).
grant select on public.seller_species to anon, authenticated;
grant insert, delete on public.seller_species to authenticated;

create policy "Seller species are viewable with the seller"
	on public.seller_species for select
	to anon, authenticated
	using (exists (select 1 from public.sellers s where s.id = seller_id));

create policy "Members can add licensed species"
	on public.seller_species for insert
	to authenticated
	with check (
		public.is_seller_member(seller_id)
		and exists (select 1 from public.species sp where sp.id = species_id and sp.is_active)
	);

create policy "Members can remove licensed species"
	on public.seller_species for delete
	to authenticated
	using (public.is_seller_member(seller_id));

-- Documents: append-only.
grant select, insert on public.seller_documents to authenticated;

create policy "Members and admins can view documents"
	on public.seller_documents for select
	to authenticated
	using (public.is_seller_member(seller_id) or public.is_platform_admin());

create policy "Members can record their documents"
	on public.seller_documents for insert
	to authenticated
	with check (public.is_seller_member(seller_id) and uploaded_by = (select auth.uid()));

----------------------------------------------------------------------------------------------------
-- Storage: private bucket for verification documents
----------------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('seller-documents', 'seller-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Objects live under <seller_id>/. No update or delete policies: uploads are append-only.
create policy "Seller members can upload documents"
	on storage.objects for insert
	to authenticated
	with check (
		bucket_id = 'seller-documents'
		and (storage.foldername(name))[1] in (
			select seller_id::text from public.seller_members where user_id = (select auth.uid())
		)
	);

create policy "Seller members and admins can read documents"
	on storage.objects for select
	to authenticated
	using (
		bucket_id = 'seller-documents'
		and (
			(storage.foldername(name))[1] in (
				select seller_id::text from public.seller_members where user_id = (select auth.uid())
			)
			or public.is_platform_admin()
		)
	);
