-- Local development seed data. Runs on `supabase db reset`; never applied to hosted projects.
-- Dev users (password for all: password123). Profiles are created by the on_auth_user_created trigger.
-- alice: verified breeder. bob: plain buyer. carol: platform admin. dave: verified pet shop.
-- eve: pet shop awaiting verification (its document rows have no files behind them locally).

with dev_users (id, email, display_name) as (
	values
		('11111111-1111-1111-1111-111111111111'::uuid, 'alice@bibble.test', 'Alice'),
		('22222222-2222-2222-2222-222222222222'::uuid, 'bob@bibble.test', 'Bob'),
		('33333333-3333-3333-3333-333333333333'::uuid, 'carol@bibble.test', 'Carol'),
		('44444444-4444-4444-4444-444444444444'::uuid, 'dave@bibble.test', 'Dave'),
		('55555555-5555-5555-5555-555555555555'::uuid, 'eve@bibble.test', 'Eve')
),
inserted as (
	insert into auth.users (
		instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
		raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
		confirmation_token, email_change, email_change_token_new, recovery_token
	)
	select
		'00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
		extensions.crypt('password123', extensions.gen_salt('bf')), now(),
		'{"provider":"email","providers":["email"]}', jsonb_build_object('display_name', display_name), now(), now(),
		'', '', '', ''
	from dev_users
	returning id, email
)
insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
	gen_random_uuid(), id, id::text,
	jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
	'email', now(), now(), now()
from inserted;

-- Platform admin.
insert into public.platform_admins (user_id) values ('33333333-3333-3333-3333-333333333333');

-- Verified sellers, licensed for dogs, with licences valid for a year.
insert into public.sellers (
	id, slug, seller_type, display_name, legal_name, uen, licence_no, licence_expires_on, about, area_id,
	verification_status, submitted_at, verified_at
)
values
	(
		'aaaaaaaa-0000-0000-0000-000000000001', 'pawsome-kennels', 'breeder', 'Pawsome Kennels', 'Pawsome Kennels Pte. Ltd.',
		'202301234K', 'BR25001', current_date + 365, 'Family-run breeder of small companion dogs.',
		(select id from public.areas where slug = 'lim-chu-kang'), 'verified', now(), now()
	),
	(
		'aaaaaaaa-0000-0000-0000-000000000002', 'happy-paws-pet-shop', 'pet_shop', 'Happy Paws Pet Shop',
		'Happy Paws Trading', '53123456A', 'AS24A00123', current_date + 365, 'Neighbourhood pet shop since 2012.',
		(select id from public.areas where slug = 'tampines'), 'verified', now(), now()
	);

insert into public.seller_members (seller_id, user_id, role)
values
	('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'owner'),
	('aaaaaaaa-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'owner');

insert into public.seller_private_details (seller_id, address_line1, postal_code, contact_phone, contact_email)
values
	('aaaaaaaa-0000-0000-0000-000000000001', '59 Sungei Tengah Road', '699012', '+6591234567', 'alice@bibble.test'),
	('aaaaaaaa-0000-0000-0000-000000000002', '201 Tampines Street 21, #01-1101', '521201', '+6567891234', 'dave@bibble.test');

insert into public.seller_species (seller_id, species_id)
select seller_id, (select id from public.species where slug = 'dog')
from (values ('aaaaaaaa-0000-0000-0000-000000000001'::uuid), ('aaaaaaaa-0000-0000-0000-000000000002'::uuid)) v (seller_id);

-- A seller awaiting verification, so the admin queue has something in it locally.
insert into public.sellers (
	id, seller_type, display_name, legal_name, uen, licence_no, licence_expires_on, about, area_id,
	verification_status, submitted_at
)
values (
	'aaaaaaaa-0000-0000-0000-000000000003', 'pet_shop', 'Furry Friends', 'Furry Friends Pte. Ltd.', '202455555E',
	'AS25C01234', current_date + 300, 'Puppies from licensed breeders.',
	(select id from public.areas where slug = 'bedok'), 'pending', now() - interval '1 day'
);

insert into public.seller_members (seller_id, user_id, role)
values ('aaaaaaaa-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'owner');

insert into public.seller_private_details (seller_id, address_line1, postal_code, contact_phone, contact_email)
values ('aaaaaaaa-0000-0000-0000-000000000003', '12 Bedok North Street 1', '460012', '+6598765432', 'eve@bibble.test');

insert into public.seller_species (seller_id, species_id)
values ('aaaaaaaa-0000-0000-0000-000000000003', (select id from public.species where slug = 'dog'));

insert into public.seller_documents (seller_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
values
	(
		'aaaaaaaa-0000-0000-0000-000000000003', 'avs_licence', 'aaaaaaaa-0000-0000-0000-000000000003/seed-licence.pdf',
		'avs-licence.pdf', 'application/pdf', 1024, '55555555-5555-5555-5555-555555555555'
	),
	(
		'aaaaaaaa-0000-0000-0000-000000000003', 'acra_bizfile', 'aaaaaaaa-0000-0000-0000-000000000003/seed-bizfile.pdf',
		'acra-bizfile.pdf', 'application/pdf', 2048, '55555555-5555-5555-5555-555555555555'
	);

-- Listings: alice (breeder) and dave (pet shop) have dogs on the marketplace, plus one of dave's drafts.
-- Dates are relative to today so the puppies stay a realistic age. Vaccination cards are rows only (no files).
insert into public.listings (
	id, seller_id, category_id, title, description, price_cents, status, submitted_at, published_at
)
select
	v.id::uuid, v.seller_id::uuid, (select id from public.categories where slug = 'dogs'), v.title, v.description,
	v.price_cents, v.status, case when v.status <> 'draft' then now() - interval '3 days' end,
	case when v.status <> 'draft' then now() - interval '2 days' end
from (
	values
		('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Playful Shih Tzu boy',
			'Gentle, well-socialised Shih Tzu raised in our family kennel. Used to children and household sounds.',
			380000, 'published'),
		('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Cavapoo girl, family-raised',
			'Affectionate Cavalier x Toy Poodle cross with a soft apricot coat. Low-shedding and great with families.',
			450000, 'published'),
		('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Pomeranian boy, bright orange',
			'Confident little Pomeranian who loves people. Parents can be viewed at our licensed premises.',
			420000, 'reserved'),
		('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000002', 'Golden Retriever puppy',
			'Sweet-natured Golden Retriever from a licensed local breeder. Microchipped, vaccinated and dewormed.',
			360000, 'published'),
		('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000002', 'Red Toy Poodle',
			'Lively Toy Poodle with a rich red coat. Comes with vaccination records and a care pack.', 480000, 'sold'),
		('bbbbbbbb-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000002', 'Corgi puppy', null, null, 'draft')
) as v (id, seller_id, title, description, price_cents, status);

insert into public.pet_listing_details (listing_id, breed_id, cross_breed_id, sex, date_of_birth, ready_date, colour, weight_kg)
select
	v.id::uuid, (select id from public.breeds where slug = v.breed), (select id from public.breeds where slug = v.cross_breed),
	v.sex, current_date - v.age_days, current_date - v.age_days + v.ready_after_days, v.colour, v.weight_kg
from (
	values
		('bbbbbbbb-0000-0000-0000-000000000001', 'shih-tzu', null, 'male', 70, 70, 'Gold and white', 2.1),
		('bbbbbbbb-0000-0000-0000-000000000002', 'cavalier-king-charles-spaniel', 'poodle-toy', 'female', 68, 70, 'Apricot', 2.4),
		('bbbbbbbb-0000-0000-0000-000000000003', 'pomeranian', null, 'male', 75, 75, 'Orange', 1.3),
		('bbbbbbbb-0000-0000-0000-000000000004', 'golden-retriever', null, 'female', 72, 72, 'Golden', 6.5),
		('bbbbbbbb-0000-0000-0000-000000000005', 'poodle-toy', null, 'male', 80, 70, 'Red', 1.8),
		('bbbbbbbb-0000-0000-0000-000000000006', 'pembroke-welsh-corgi', null, 'female', 40, null, null, null)
) as v (id, breed, cross_breed, sex, age_days, ready_after_days, colour, weight_kg);

insert into public.pet_listing_private (listing_id, microchip_no, source, source_licence_no)
values
	('bbbbbbbb-0000-0000-0000-000000000001', '900085000000001', 'bred_on_premises', null),
	('bbbbbbbb-0000-0000-0000-000000000002', '900085000000002', 'bred_on_premises', null),
	('bbbbbbbb-0000-0000-0000-000000000003', '900085000000003', 'bred_on_premises', null),
	('bbbbbbbb-0000-0000-0000-000000000004', '900085000000004', 'licensed_breeder', 'BR25001'),
	('bbbbbbbb-0000-0000-0000-000000000005', '900085000000005', 'licensed_breeder', 'BR25001'),
	('bbbbbbbb-0000-0000-0000-000000000006', null, null, null);

-- Two vaccinations and two dewormings for every listing on the marketplace.
insert into public.pet_health_records (listing_id, kind, given_on, product, clinic)
select d.listing_id, r.kind, d.date_of_birth + r.at_days, r.product, 'Mount Pleasant Vet Centre'
from public.pet_listing_details d
join public.listings l on l.id = d.listing_id
cross join (
	values
		('deworming', 14, 'Drontal Puppy'),
		('deworming', 28, 'Drontal Puppy'),
		('vaccination', 42, 'Nobivac DHP'),
		('vaccination', 56, 'Nobivac DHPPi')
) as r (kind, at_days, product)
where l.status <> 'draft';

insert into public.listing_documents (listing_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
select
	l.id, 'vaccination_card', l.id || '/seed-vaccination-card.pdf', 'vaccination-card.pdf', 'application/pdf', 1024,
	m.user_id
from public.listings l
join public.seller_members m on m.seller_id = l.seller_id
where l.status <> 'draft';
