-- Listings: a shared core table for every vertical, with per-vertical detail tables (animals first), health records,
-- private details and documents. Status changes go through functions that enforce category policy and AVS rules.

----------------------------------------------------------------------------------------------------
-- Reference data
----------------------------------------------------------------------------------------------------

create table public.categories (
	id smallint generated always as identity primary key,
	slug text not null unique,
	name text not null,
	-- lucide icon name for the category bar.
	icon text not null,
	sort_order smallint not null,
	status text not null check (status in ('active', 'coming_soon', 'hidden')),
	vertical text not null check (vertical in ('animal', 'service', 'product')),
	listing_type text check (listing_type in ('sale', 'adoption')),
	species_id smallint references public.species (id),
	requires_review boolean not null default true,
	constraint categories_animal_shape check (vertical <> 'animal' or listing_type is not null)
);

comment on table public.categories is
	'What a listing is and where it shows up: vertical, species, sale or adoption, and whether admins review it.';

insert into public.categories (slug, name, icon, sort_order, status, vertical, listing_type, species_id)
values
	('dogs', 'Dogs', 'dog', 1, 'active', 'animal', 'sale', (select id from public.species where slug = 'dog')),
	('cats', 'Cats', 'cat', 2, 'coming_soon', 'animal', 'sale', (select id from public.species where slug = 'cat')),
	('adoption', 'Adoption', 'heart-handshake', 3, 'coming_soon', 'animal', 'adoption', null),
	('accessories', 'Accessories', 'shopping-bag', 4, 'coming_soon', 'product', null, null),
	('services', 'Services', 'scissors', 5, 'coming_soon', 'service', null, null);

create table public.breeds (
	id smallint generated always as identity primary key,
	species_id smallint not null references public.species (id),
	slug text not null,
	name text not null,
	-- null until the official HDB list is loaded; nothing is shown to buyers before then.
	hdb_approved boolean,
	-- AVS specified dogs: 1 = may not be sold, 2 = sold with conditions. Applies to crosses too.
	specified_part smallint check (specified_part in (1, 2)),
	unique (species_id, slug)
);

comment on table public.breeds is 'Breeds per species, with AVS specified-dog status.';

insert into public.breeds (species_id, slug, name, specified_part)
select (select id from public.species where slug = 'dog'), slug, name, part
from (
	values
		('affenpinscher', 'Affenpinscher', null::smallint),
		('afghan-hound', 'Afghan Hound', null),
		('airedale-terrier', 'Airedale Terrier', null),
		('akita', 'Akita', 1),
		('alaskan-malamute', 'Alaskan Malamute', null),
		('american-cocker-spaniel', 'American Cocker Spaniel', null),
		('american-pit-bull-terrier', 'American Pit Bull Terrier', 1),
		('american-staffordshire-terrier', 'American Staffordshire Terrier', 1),
		('australian-cattle-dog', 'Australian Cattle Dog', null),
		('australian-shepherd', 'Australian Shepherd', null),
		('basenji', 'Basenji', null),
		('basset-hound', 'Basset Hound', null),
		('beagle', 'Beagle', null),
		('bearded-collie', 'Bearded Collie', null),
		('belgian-shepherd-groenendael', 'Belgian Shepherd (Groenendael)', 2),
		('belgian-shepherd-malinois', 'Belgian Shepherd (Malinois)', 2),
		('belgian-shepherd-tervuren', 'Belgian Shepherd (Tervuren)', 2),
		('bernese-mountain-dog', 'Bernese Mountain Dog', null),
		('bichon-frise', 'Bichon Frise', null),
		('bloodhound', 'Bloodhound', null),
		('boerboel', 'Boerboel', 1),
		('border-collie', 'Border Collie', null),
		('border-terrier', 'Border Terrier', null),
		('borzoi', 'Borzoi', null),
		('boston-terrier', 'Boston Terrier', null),
		('boxer', 'Boxer', null),
		('bull-terrier', 'Bull Terrier', 2),
		('bulldog', 'Bulldog', null),
		('bullmastiff', 'Bullmastiff', 2),
		('cairn-terrier', 'Cairn Terrier', null),
		('cardigan-welsh-corgi', 'Cardigan Welsh Corgi', null),
		('cavalier-king-charles-spaniel', 'Cavalier King Charles Spaniel', null),
		('chihuahua', 'Chihuahua', null),
		('chinese-crested', 'Chinese Crested', null),
		('chow-chow', 'Chow Chow', null),
		('cocker-spaniel', 'Cocker Spaniel', null),
		('dachshund', 'Dachshund', null),
		('dalmatian', 'Dalmatian', null),
		('dobermann', 'Dobermann', 2),
		('dogo-argentino', 'Dogo Argentino', 1),
		('east-european-shepherd', 'East European Shepherd', 2),
		('english-springer-spaniel', 'English Springer Spaniel', null),
		('fila-brasileiro', 'Fila Brasileiro', 1),
		('finnish-spitz', 'Finnish Spitz', null),
		('french-bulldog', 'French Bulldog', null),
		('german-shepherd', 'German Shepherd', 2),
		('german-shorthaired-pointer', 'German Shorthaired Pointer', null),
		('german-spitz', 'German Spitz', null),
		('giant-schnauzer', 'Giant Schnauzer', null),
		('golden-retriever', 'Golden Retriever', null),
		('great-dane', 'Great Dane', null),
		('greyhound', 'Greyhound', null),
		('havanese', 'Havanese', null),
		('irish-setter', 'Irish Setter', null),
		('irish-wolfhound', 'Irish Wolfhound', null),
		('italian-greyhound', 'Italian Greyhound', null),
		('jack-russell-terrier', 'Jack Russell Terrier', null),
		('japanese-chin', 'Japanese Chin', null),
		('japanese-spitz', 'Japanese Spitz', null),
		('keeshond', 'Keeshond', null),
		('labrador-retriever', 'Labrador Retriever', null),
		('lhasa-apso', 'Lhasa Apso', null),
		('maltese', 'Maltese', null),
		('mastiff', 'Mastiff', 2),
		('miniature-pinscher', 'Miniature Pinscher', null),
		('miniature-schnauzer', 'Miniature Schnauzer', null),
		('neapolitan-mastiff', 'Neapolitan Mastiff', 1),
		('newfoundland', 'Newfoundland', null),
		('norfolk-terrier', 'Norfolk Terrier', null),
		('norwich-terrier', 'Norwich Terrier', null),
		('old-english-sheepdog', 'Old English Sheepdog', null),
		('papillon', 'Papillon', null),
		('pekingese', 'Pekingese', null),
		('pembroke-welsh-corgi', 'Pembroke Welsh Corgi', null),
		('perro-de-presa-canario', 'Perro de Presa Canario', 1),
		('pomeranian', 'Pomeranian', null),
		('poodle-miniature', 'Poodle (Miniature)', null),
		('poodle-standard', 'Poodle (Standard)', null),
		('poodle-toy', 'Poodle (Toy)', null),
		('pug', 'Pug', null),
		('rhodesian-ridgeback', 'Rhodesian Ridgeback', null),
		('rough-collie', 'Rough Collie', null),
		('rottweiler', 'Rottweiler', 2),
		('saint-bernard', 'Saint Bernard', null),
		('saluki', 'Saluki', null),
		('samoyed', 'Samoyed', null),
		('schipperke', 'Schipperke', null),
		('schnauzer', 'Schnauzer (Standard)', null),
		('scottish-terrier', 'Scottish Terrier', null),
		('shar-pei', 'Shar Pei', null),
		('shetland-sheepdog', 'Shetland Sheepdog', null),
		('shiba-inu', 'Shiba Inu', null),
		('shih-tzu', 'Shih Tzu', null),
		('siberian-husky', 'Siberian Husky', null),
		('silky-terrier', 'Silky Terrier', null),
		-- Singapore's local mixed-breed dogs.
		('singapore-special', 'Singapore Special', null),
		('staffordshire-bull-terrier', 'Staffordshire Bull Terrier', 1),
		('tibetan-mastiff', 'Tibetan Mastiff', 2),
		('tibetan-spaniel', 'Tibetan Spaniel', null),
		('tibetan-terrier', 'Tibetan Terrier', null),
		('tosa', 'Tosa', 1),
		('weimaraner', 'Weimaraner', null),
		('welsh-terrier', 'Welsh Terrier', null),
		('west-highland-white-terrier', 'West Highland White Terrier', null),
		('whippet', 'Whippet', null),
		('yorkshire-terrier', 'Yorkshire Terrier', null)
) as dog_breeds (slug, name, part);

create index breeds_species_id_idx on public.breeds (species_id);

alter table public.categories enable row level security;
alter table public.breeds enable row level security;
revoke all on public.categories, public.breeds from anon, authenticated;
grant select on public.categories, public.breeds to anon, authenticated;

create policy "Categories are viewable by everyone"
	on public.categories for select
	to anon, authenticated
	using (true);

create policy "Breeds are viewable by everyone"
	on public.breeds for select
	to anon, authenticated
	using (true);


----------------------------------------------------------------------------------------------------
-- Listings
----------------------------------------------------------------------------------------------------

create table public.listings (
	id uuid primary key default gen_random_uuid(),
	seller_id uuid not null references public.sellers (id) on delete cascade,
	category_id smallint not null references public.categories (id),
	-- Copied from the category on insert; lets detail tables be tied to one vertical by foreign key.
	vertical text not null check (vertical in ('animal', 'service', 'product')),
	title text check (char_length(title) between 5 and 80),
	description text check (char_length(description) <= 2000),
	price_cents integer check (price_cents between 1 and 100000000),
	currency text not null default 'SGD' check (currency = 'SGD'),
	status text not null default 'draft' check (
		status in (
			'draft', 'pending_review', 'changes_requested', 'published', 'reserved', 'sold', 'rejected', 'suspended',
			'archived'
		)
	),
	submitted_at timestamptz,
	published_at timestamptz,
	status_changed_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (id, vertical)
);

comment on table public.listings is
	'What every listing has in common. Details live in a per-vertical table; location comes from the seller.';

create index listings_seller_id_idx on public.listings (seller_id);
create index listings_category_id_idx on public.listings (category_id);
create index listings_status_published_at_idx on public.listings (status, published_at desc);

create table public.pet_listing_details (
	listing_id uuid primary key,
	vertical text not null default 'animal' check (vertical = 'animal'),
	breed_id smallint references public.breeds (id),
	-- Second parent breed for crosses, e.g. Cavalier King Charles Spaniel x Poodle.
	cross_breed_id smallint references public.breeds (id),
	sex text check (sex in ('male', 'female')),
	date_of_birth date,
	-- Earliest date the animal can go home.
	ready_date date,
	colour text check (char_length(colour) between 1 and 40),
	weight_kg numeric(4, 1) check (weight_kg > 0 and weight_kg <= 150),
	height_cm numeric(4, 1) check (height_cm > 0 and height_cm <= 120),
	sterilised boolean not null default false,
	constraint pet_listing_details_cross_differs check (cross_breed_id <> breed_id),
	foreign key (listing_id, vertical) references public.listings (id, vertical) on delete cascade
);

comment on table public.pet_listing_details is 'Public details of an animal listing.';

create index pet_listing_details_breed_id_idx on public.pet_listing_details (breed_id);
create index pet_listing_details_cross_breed_id_idx on public.pet_listing_details (cross_breed_id);

create table public.pet_listing_private (
	listing_id uuid primary key references public.listings (id) on delete cascade,
	microchip_no text check (microchip_no ~ '^[0-9]{15}$'),
	source text check (source in ('bred_on_premises', 'licensed_breeder', 'imported')),
	-- The licensed breeder a pet shop sourced the animal from.
	source_licence_no text check (source_licence_no ~ '^[0-9A-Z]{5,12}$'),
	import_permit_no text check (char_length(import_permit_no) between 1 and 40),
	arrival_date date
);

comment on table public.pet_listing_private is 'Microchip and sourcing details for admin checks. Members and admins only.';

create table public.pet_health_records (
	id uuid primary key default gen_random_uuid(),
	listing_id uuid not null references public.listings (id) on delete cascade,
	kind text not null check (kind in ('vaccination', 'deworming')),
	given_on date not null,
	product text not null check (char_length(product) between 1 and 80),
	clinic text check (char_length(clinic) between 1 and 120),
	created_at timestamptz not null default clock_timestamp()
);

comment on table public.pet_health_records is 'Vaccinations and dewormings. Public with the listing.';

create index pet_health_records_listing_id_idx on public.pet_health_records (listing_id, kind, given_on);

create table public.listing_documents (
	id uuid primary key default gen_random_uuid(),
	listing_id uuid not null references public.listings (id) on delete cascade,
	kind text not null check (kind in ('vaccination_card', 'import_permit')),
	-- Object name in the listing-documents bucket: <listing_id>/<file>.
	storage_path text not null unique,
	file_name text not null check (char_length(file_name) between 1 and 255),
	content_type text not null check (content_type in ('application/pdf', 'image/jpeg', 'image/png')),
	size_bytes integer not null check (size_bytes between 1 and 10485760),
	uploaded_by uuid not null references auth.users (id),
	created_at timestamptz not null default now(),
	constraint listing_documents_path_in_listing_folder check (storage_path like listing_id::text || '/%')
);

comment on table public.listing_documents is 'Documents for admin review. The newest row per kind is current; rows are never deleted.';

create index listing_documents_listing_id_kind_idx on public.listing_documents (listing_id, kind, created_at desc);
create index listing_documents_uploaded_by_idx on public.listing_documents (uploaded_by);

create trigger listings_set_updated_at
	before update on public.listings
	for each row execute function public.set_updated_at();

----------------------------------------------------------------------------------------------------
-- Helpers
----------------------------------------------------------------------------------------------------

create function public.is_listing_member(p_listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (
		select 1
		from public.listings l
		join public.seller_members m on m.seller_id = l.seller_id
		where l.id = p_listing_id and m.user_id = (select auth.uid())
	);
$$;

-- Whether the listing is on the marketplace: published, reserved or sold, from a verified seller.
create function public.is_listing_public(p_listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (
		select 1
		from public.listings l
		join public.sellers s on s.id = l.seller_id
		where l.id = p_listing_id
			and l.status in ('published', 'reserved', 'sold')
			and s.verification_status = 'verified'
	);
$$;

create function public.is_listing_editable(p_listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (select 1 from public.listings where id = p_listing_id and status in ('draft', 'changes_requested'));
$$;

----------------------------------------------------------------------------------------------------
-- Integrity and locking
----------------------------------------------------------------------------------------------------

-- Copies the vertical from the category so detail tables can only attach to matching listings.
create function public.listings_set_vertical()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	select vertical into new.vertical from public.categories where id = new.category_id;
	return new;
end;
$$;

create trigger listings_set_vertical
	before insert on public.listings
	for each row execute function public.listings_set_vertical();

-- Breeds must belong to the listing category's species.
create function public.pet_listing_details_check_breeds()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
	v_species_id smallint;
begin
	select c.species_id into v_species_id
	from public.listings l
	join public.categories c on c.id = l.category_id
	where l.id = new.listing_id;

	if exists (
		select 1 from public.breeds b
		where b.id in (new.breed_id, new.cross_breed_id) and b.species_id is distinct from v_species_id
	) then
		raise exception 'breed_species_mismatch';
	end if;
	return new;
end;
$$;

create trigger pet_listing_details_check_breeds
	before insert or update of breed_id, cross_breed_id on public.pet_listing_details
	for each row execute function public.pet_listing_details_check_breeds();

-- App users can only change a listing and its parts while it's a draft or has changes requested. Published listings
-- are revised with revise_listing(). Like the seller locks, this applies to the authenticated role only.
create function public.listings_guard_locked()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	if current_user = 'authenticated' and old.status not in ('draft', 'changes_requested') then
		raise exception 'listing_locked';
	end if;
	return new;
end;
$$;

create trigger listings_guard_locked
	before update on public.listings
	for each row execute function public.listings_guard_locked();

create function public.listing_parts_guard_locked()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	if current_user = 'authenticated' and not public.is_listing_editable(coalesce(new.listing_id, old.listing_id)) then
		raise exception 'listing_locked';
	end if;
	return coalesce(new, old);
end;
$$;

create trigger pet_listing_details_guard_locked
	before update on public.pet_listing_details
	for each row execute function public.listing_parts_guard_locked();

create trigger pet_listing_private_guard_locked
	before update on public.pet_listing_private
	for each row execute function public.listing_parts_guard_locked();

create trigger pet_health_records_guard_locked
	before insert or update or delete on public.pet_health_records
	for each row execute function public.listing_parts_guard_locked();

create trigger listing_documents_guard_locked
	before insert on public.listing_documents
	for each row execute function public.listing_parts_guard_locked();

----------------------------------------------------------------------------------------------------
-- Status changes
----------------------------------------------------------------------------------------------------

-- Creates a draft listing in a category, with its empty detail rows. Unverified sellers can prepare drafts.
create function public.create_listing(p_seller_id uuid, p_category text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_category public.categories;
	v_listing_id uuid;
begin
	if not public.is_seller_member(p_seller_id) then
		raise exception 'not_a_member';
	end if;

	select * into v_category from public.categories where slug = p_category;
	-- Only animal listings have a details table so far.
	if not found or v_category.status <> 'active' or v_category.vertical <> 'animal' then
		raise exception 'category_unavailable';
	end if;

	insert into public.listings (seller_id, category_id) values (p_seller_id, v_category.id) returning id into v_listing_id;
	insert into public.pet_listing_details (listing_id) values (v_listing_id);
	insert into public.pet_listing_private (listing_id, source)
	select v_listing_id, case when s.seller_type = 'breeder' then 'bred_on_premises' end
	from public.sellers s where s.id = p_seller_id;

	return v_listing_id;
end;
$$;

-- Checks a draft against category policy and AVS rules, then sends it for review (or publishes it, for categories
-- that don't need review). Raises a code naming the first rule that fails.
create function public.submit_listing_for_review(p_listing_id uuid)
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

-- Takes a published or reserved listing back to draft so it can be edited. It leaves the marketplace until approved.
create function public.revise_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	if not public.is_listing_member(p_listing_id) then
		raise exception 'not_a_member';
	end if;
	update public.listings
	set status = 'draft', status_changed_at = now()
	where id = p_listing_id and status in ('published', 'reserved');
	if not found then
		raise exception 'invalid_transition';
	end if;
end;
$$;

-- Marks a live listing reserved, available again, or sold. No review needed.
create function public.set_listing_availability(p_listing_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_listing public.listings;
begin
	if not public.is_listing_member(p_listing_id) then
		raise exception 'not_a_member';
	end if;

	select * into v_listing from public.listings where id = p_listing_id for update;
	if not (
		(p_status = 'reserved' and v_listing.status = 'published')
		or (p_status = 'published' and v_listing.status = 'reserved')
		or (p_status = 'sold' and v_listing.status in ('published', 'reserved'))
	) then
		raise exception 'invalid_transition';
	end if;
	if not exists (select 1 from public.sellers where id = v_listing.seller_id and verification_status = 'verified') then
		raise exception 'seller_cannot_list';
	end if;

	update public.listings set status = p_status, status_changed_at = now() where id = p_listing_id;
end;
$$;

-- Takes a listing off the marketplace for good. Not while an admin is reviewing it.
create function public.archive_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	if not public.is_listing_member(p_listing_id) then
		raise exception 'not_a_member';
	end if;
	update public.listings
	set status = 'archived', status_changed_at = now()
	where id = p_listing_id and status not in ('pending_review', 'archived');
	if not found then
		raise exception 'invalid_transition';
	end if;
end;
$$;

revoke execute on function public.listings_set_vertical() from public, anon, authenticated;
revoke execute on function public.pet_listing_details_check_breeds() from public, anon, authenticated;
revoke execute on function public.listings_guard_locked() from public, anon, authenticated;
revoke execute on function public.listing_parts_guard_locked() from public, anon, authenticated;
revoke execute on function public.is_listing_member(uuid) from public;
revoke execute on function public.is_listing_public(uuid) from public;
revoke execute on function public.is_listing_editable(uuid) from public;
revoke execute on function public.create_listing(uuid, text) from public, anon;
revoke execute on function public.submit_listing_for_review(uuid) from public, anon;
revoke execute on function public.revise_listing(uuid) from public, anon;
revoke execute on function public.set_listing_availability(uuid, text) from public, anon;
revoke execute on function public.archive_listing(uuid) from public, anon;
grant execute on function public.is_listing_member(uuid) to anon, authenticated;
grant execute on function public.is_listing_public(uuid) to anon, authenticated;
grant execute on function public.is_listing_editable(uuid) to anon, authenticated;
grant execute on function public.create_listing(uuid, text) to authenticated;
grant execute on function public.submit_listing_for_review(uuid) to authenticated;
grant execute on function public.revise_listing(uuid) to authenticated;
grant execute on function public.set_listing_availability(uuid, text) to authenticated;
grant execute on function public.archive_listing(uuid) to authenticated;

----------------------------------------------------------------------------------------------------
-- Row level security and grants
----------------------------------------------------------------------------------------------------

alter table public.listings enable row level security;
alter table public.pet_listing_details enable row level security;
alter table public.pet_listing_private enable row level security;
alter table public.pet_health_records enable row level security;
alter table public.listing_documents enable row level security;

revoke all on public.listings, public.pet_listing_details, public.pet_listing_private, public.pet_health_records,
	public.listing_documents from anon, authenticated;

-- Listings: created by create_listing(); status and timestamps change only through the functions above.
grant select on public.listings to anon, authenticated;
grant update (title, description, price_cents) on public.listings to authenticated;
grant delete on public.listings to authenticated;

create policy "Public listings are viewable by everyone"
	on public.listings for select
	to anon, authenticated
	using (
		status in ('published', 'reserved', 'sold')
		and exists (select 1 from public.sellers s where s.id = seller_id and s.verification_status = 'verified')
	);

create policy "Members and admins can view their listings"
	on public.listings for select
	to authenticated
	using (public.is_seller_member(seller_id) or public.is_platform_admin());

create policy "Members can update their listings"
	on public.listings for update
	to authenticated
	using (public.is_seller_member(seller_id))
	with check (public.is_seller_member(seller_id));

create policy "Members can delete drafts that were never submitted"
	on public.listings for delete
	to authenticated
	using (public.is_seller_member(seller_id) and status = 'draft' and submitted_at is null);

-- Public details.
grant select on public.pet_listing_details to anon, authenticated;
grant update (breed_id, cross_breed_id, sex, date_of_birth, ready_date, colour, weight_kg, height_cm, sterilised)
	on public.pet_listing_details to authenticated;

create policy "Details of public listings are viewable by everyone"
	on public.pet_listing_details for select
	to anon, authenticated
	using (public.is_listing_public(listing_id));

create policy "Members and admins can view listing details"
	on public.pet_listing_details for select
	to authenticated
	using (public.is_listing_member(listing_id) or public.is_platform_admin());

create policy "Members can update listing details"
	on public.pet_listing_details for update
	to authenticated
	using (public.is_listing_member(listing_id))
	with check (public.is_listing_member(listing_id));

-- Private details.
grant select on public.pet_listing_private to authenticated;
grant update (microchip_no, source, source_licence_no, import_permit_no, arrival_date)
	on public.pet_listing_private to authenticated;

create policy "Members and admins can view private listing details"
	on public.pet_listing_private for select
	to authenticated
	using (public.is_listing_member(listing_id) or public.is_platform_admin());

create policy "Members can update private listing details"
	on public.pet_listing_private for update
	to authenticated
	using (public.is_listing_member(listing_id))
	with check (public.is_listing_member(listing_id));

-- Health records.
grant select on public.pet_health_records to anon, authenticated;
grant insert, delete on public.pet_health_records to authenticated;
grant update (kind, given_on, product, clinic) on public.pet_health_records to authenticated;

create policy "Health records of public listings are viewable by everyone"
	on public.pet_health_records for select
	to anon, authenticated
	using (public.is_listing_public(listing_id));

create policy "Members and admins can view health records"
	on public.pet_health_records for select
	to authenticated
	using (public.is_listing_member(listing_id) or public.is_platform_admin());

create policy "Members can add health records"
	on public.pet_health_records for insert
	to authenticated
	with check (public.is_listing_member(listing_id));

create policy "Members can update health records"
	on public.pet_health_records for update
	to authenticated
	using (public.is_listing_member(listing_id))
	with check (public.is_listing_member(listing_id));

create policy "Members can remove health records"
	on public.pet_health_records for delete
	to authenticated
	using (public.is_listing_member(listing_id));

-- Documents: append-only.
grant select, insert on public.listing_documents to authenticated;

create policy "Members and admins can view listing documents"
	on public.listing_documents for select
	to authenticated
	using (public.is_listing_member(listing_id) or public.is_platform_admin());

create policy "Members can record listing documents"
	on public.listing_documents for insert
	to authenticated
	with check (public.is_listing_member(listing_id) and uploaded_by = (select auth.uid()));

----------------------------------------------------------------------------------------------------
-- Storage: private bucket for listing documents
----------------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-documents', 'listing-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Objects live under <listing_id>/. No update or delete policies: uploads are append-only.
create policy "Seller members can upload listing documents"
	on storage.objects for insert
	to authenticated
	with check (
		bucket_id = 'listing-documents'
		and (storage.foldername(name))[1] in (
			select l.id::text
			from public.listings l
			join public.seller_members m on m.seller_id = l.seller_id
			where m.user_id = (select auth.uid())
		)
	);

create policy "Seller members and admins can read listing documents"
	on storage.objects for select
	to authenticated
	using (
		bucket_id = 'listing-documents'
		and (
			(storage.foldername(name))[1] in (
				select l.id::text
				from public.listings l
				join public.seller_members m on m.seller_id = l.seller_id
				where m.user_id = (select auth.uid())
			)
			or public.is_platform_admin()
		)
	);
