-- Local development seed data. Runs on `supabase db reset`; never applied to hosted projects.
-- Dev users (password for all: password123). Profiles are created by the on_auth_user_created trigger.
-- alice: verified breeder. bob: plain buyer. carol: platform admin. dave: verified pet shop.

with dev_users (id, email, display_name) as (
	values
		('11111111-1111-1111-1111-111111111111'::uuid, 'alice@bibble.test', 'Alice'),
		('22222222-2222-2222-2222-222222222222'::uuid, 'bob@bibble.test', 'Bob'),
		('33333333-3333-3333-3333-333333333333'::uuid, 'carol@bibble.test', 'Carol'),
		('44444444-4444-4444-4444-444444444444'::uuid, 'dave@bibble.test', 'Dave')
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
