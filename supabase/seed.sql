-- Local development seed data. Runs on `supabase db reset`; never applied to hosted projects.
-- Dev users (password for all: password123). Profiles are created by the on_auth_user_created trigger.

with dev_users (id, email, display_name) as (
	values
		('11111111-1111-1111-1111-111111111111'::uuid, 'alice@bibble.test', 'Alice'),
		('22222222-2222-2222-2222-222222222222'::uuid, 'bob@bibble.test', 'Bob')
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
