-- Sellers: creation, visibility, column grants, locking, submission and seller_can_list().
-- Runs in a transaction that is rolled back, against the seeded local database.
begin;
create extension if not exists pgtap with schema extensions;
select plan(39);

-- Test users: owner and stranger are new; carol (3333…) is the seeded platform admin.
insert into auth.users (id, email, aud, role)
values
	('00000000-0000-0000-0000-0000000000a1', 'owner@test.local', 'authenticated', 'authenticated'),
	('00000000-0000-0000-0000-0000000000a2', 'stranger@test.local', 'authenticated', 'authenticated');

-- Act as the owner.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select lives_ok($$ select public.create_seller('breeder', array['dog']) $$, 'a user can create a seller');
select throws_ok(
	$$ select public.create_seller('pet_shop', array['dog']) $$, 'P0001', 'seller_already_exists',
	'a user can only have one seller'
);
select throws_ok(
	$$ insert into public.sellers (seller_type) values ('breeder') $$, '42501', null, 'sellers cannot be inserted directly'
);

select is(
	(select verification_status from public.sellers s join public.seller_members m on m.seller_id = s.id
		where m.user_id = '00000000-0000-0000-0000-0000000000a1'),
	'incomplete', 'a new seller starts incomplete and is visible to its owner'
);
select is(
	(select contact_email from public.seller_private_details),
	'owner@test.local', 'private details are created with the account email'
);
-- Remember the id for later steps (readable by the owner).
select set_config('test.seller_id', (select seller_id::text from public.seller_members), true);
select is(
	(select count(*)::int from public.seller_species where seller_id = current_setting('test.seller_id')::uuid), 1,
	'licensed species are recorded'
);


select throws_ok(
	$$ update public.sellers set verification_status = 'verified' $$, '42501', null,
	'members cannot set verification_status'
);
select ok(
	not has_column_privilege('authenticated', 'public.sellers', 'slug', 'UPDATE'),
	'members cannot set the slug'
);
select throws_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'P0001', 'missing_business_details', 'submitting needs business details'
);

update public.sellers set
	display_name = 'Owner''s Dogs', legal_name = 'Owner Dogs Pte. Ltd.', uen = '202399999Z', licence_no = 'BR29999',
	licence_expires_on = current_date + 30,
	planning_area_id = (select id from public.planning_areas where slug = 'bedok');

select throws_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'P0001', 'missing_contact_details', 'submitting needs contact details'
);

update public.seller_private_details set address_line1 = '1 Test Road', postal_code = '460001', contact_phone = '+6591234567';

select throws_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'P0001', 'missing_documents', 'submitting needs both documents'
);

select lives_ok(
	$$ insert into public.seller_documents (seller_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
	values
		(current_setting('test.seller_id')::uuid, 'avs_licence', current_setting('test.seller_id') || '/licence.pdf',
			'licence.pdf', 'application/pdf', 1000, '00000000-0000-0000-0000-0000000000a1'),
		(current_setting('test.seller_id')::uuid, 'acra_bizfile', current_setting('test.seller_id') || '/bizfile.pdf',
			'bizfile.pdf', 'application/pdf', 1000, '00000000-0000-0000-0000-0000000000a1') $$,
	'members can record documents'
);
select throws_ok(
	$$ insert into public.seller_documents (seller_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
	values (current_setting('test.seller_id')::uuid, 'avs_licence', 'someone-else/licence.pdf', 'x.pdf',
		'application/pdf', 1, '00000000-0000-0000-0000-0000000000a1') $$,
	'23514', null, 'document paths must sit in the seller''s folder'
);

select lives_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'a complete seller can be submitted'
);
select results_eq(
	$$ select verification_status, slug like 'owner-s-dogs-%' from public.sellers
		where id = current_setting('test.seller_id')::uuid $$,
	$$ values ('pending'::text, true) $$,
	'submitting sets pending and a slug from the display name'
);
select throws_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'P0001', 'already_submitted', 'a pending seller cannot be resubmitted'
);

-- Once submitted, verified details are locked; the rest stays editable.
select throws_ok(
	$$ update public.sellers set uen = '202300000A' $$, 'P0001', 'seller_details_locked', 'UEN is locked once submitted'
);
select throws_ok(
	$$ update public.sellers set licence_no = 'BR20000' $$, 'P0001', 'seller_details_locked',
	'licence number is locked once submitted'
);
select throws_ok(
	$$ delete from public.seller_species $$, 'P0001', 'seller_details_locked', 'licensed species are locked once submitted'
);
select lives_ok($$ update public.sellers set about = 'Updated bio' $$, 'the bio stays editable');

-- A stranger sees none of it.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is(
	(select count(*)::int from public.sellers where id = current_setting('test.seller_id')::uuid), 0,
	'other users cannot see a pending seller'
);
select is((select count(*)::int from public.seller_private_details), 0, 'other users cannot see private details');
select is((select count(*)::int from public.seller_documents), 0, 'other users cannot see documents');
select is(
	(select count(*)::int from public.seller_members where seller_id = current_setting('test.seller_id')::uuid), 0,
	'other users cannot see memberships'
);
select throws_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'P0001', 'not_a_member', 'only members can submit'
);
select throws_ok(
	$$ select public.create_seller('breeder', array['cat']) $$, 'P0001', 'invalid_species',
	'sellers cannot be licensed for inactive species'
);
-- RLS turns another user's update into a no-op; checked below as postgres.
select lives_ok(
	$$ update public.sellers set about = 'hijacked' where id = current_setting('test.seller_id')::uuid $$,
	'an update by another user runs without error'
);

-- Anonymous visitors.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is(
	(select count(*)::int from public.sellers where id = current_setting('test.seller_id')::uuid), 0,
	'anonymous users cannot see a pending seller'
);
select is((select count(*)::int from public.sellers where slug = 'pawsome-kennels'), 1, 'anonymous users see verified sellers');
select throws_ok(
	$$ select * from public.seller_private_details $$, '42501', null, 'anonymous users cannot read private details at all'
);

-- The platform admin sees everything.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);

select is(
	(select count(*)::int from public.sellers where id = current_setting('test.seller_id')::uuid), 1, 'admins see pending sellers'
);
select is(
	(select count(*)::int from public.seller_documents where seller_id = current_setting('test.seller_id')::uuid), 2,
	'admins see documents'
);

-- seller_can_list(): verified, in-date licence, licensed and active species.
reset role;
select set_config('test.dog', (select id::text from public.species where slug = 'dog'), true);
select set_config('test.cat', (select id::text from public.species where slug = 'cat'), true);

select is(
	(select about from public.sellers where id = current_setting('test.seller_id')::uuid), 'Updated bio',
	'other users cannot update a seller'
);
select ok(
	not public.seller_can_list(current_setting('test.seller_id')::uuid, current_setting('test.dog')::smallint),
	'a pending seller cannot list'
);
update public.sellers set verification_status = 'verified' where id = current_setting('test.seller_id')::uuid;
select ok(
	public.seller_can_list(current_setting('test.seller_id')::uuid, current_setting('test.dog')::smallint),
	'a verified seller can list a licensed species'
);
select ok(
	not public.seller_can_list(current_setting('test.seller_id')::uuid, current_setting('test.cat')::smallint),
	'a seller cannot list a species they are not licensed for'
);
update public.sellers set licence_expires_on = current_date - 1 where id = current_setting('test.seller_id')::uuid;
select ok(
	not public.seller_can_list(current_setting('test.seller_id')::uuid, current_setting('test.dog')::smallint),
	'an expired licence blocks listing'
);
update public.sellers set licence_expires_on = current_date + 30, verification_status = 'suspended'
	where id = current_setting('test.seller_id')::uuid;
select ok(
	not public.seller_can_list(current_setting('test.seller_id')::uuid, current_setting('test.dog')::smallint),
	'a suspended seller cannot list'
);

select throws_ok(
	$$ update public.sellers set verification_status = 'pending', uen = null
		where id = current_setting('test.seller_id')::uuid $$,
	'23514', null, 'a submitted seller must have every business detail'
);

select * from finish();
rollback;
