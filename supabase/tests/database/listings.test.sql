-- Listings: creation, visibility, locking, AVS checks on submit, availability, revise, archive and delete.
begin;
create extension if not exists pgtap with schema extensions;
select plan(59);

-- Fixtures (as postgres): a verified pet shop owned by `owner`, a pending seller owned by `newbie`, and a stranger.
insert into auth.users (id, email, aud, role)
values
	('00000000-0000-0000-0000-0000000000d1', 'owner@test.local', 'authenticated', 'authenticated'),
	('00000000-0000-0000-0000-0000000000d2', 'stranger@test.local', 'authenticated', 'authenticated'),
	('00000000-0000-0000-0000-0000000000d3', 'newbie@test.local', 'authenticated', 'authenticated');

insert into public.sellers (id, seller_type, display_name, legal_name, uen, licence_no, licence_expires_on, area_id,
	verification_status)
values
	('cccccccc-0000-0000-0000-000000000001', 'pet_shop', 'Test Pets', 'Test Pets Pte. Ltd.', '202399991T', 'AS24A09991',
		current_date + 100, (select id from public.areas where slug = 'bedok'), 'verified'),
	('cccccccc-0000-0000-0000-000000000002', 'pet_shop', 'New Pets', 'New Pets Pte. Ltd.', '202399992T', 'AS24A09992',
		current_date + 100, (select id from public.areas where slug = 'bedok'), 'pending');
insert into public.seller_members (seller_id, user_id)
values
	('cccccccc-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d1'),
	('cccccccc-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000000d3');
insert into public.seller_species (seller_id, species_id)
select id, (select id from public.species where slug = 'dog') from public.sellers where id::text like 'cccccccc%';

-- A cat breed, to test species checks.
insert into public.breeds (species_id, slug, name)
values ((select id from public.species where slug = 'cat'), 'test-cat', 'Test Cat');

-- Owner ------------------------------------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);

select lives_ok(
	$$ select set_config('test.id', public.create_listing('cccccccc-0000-0000-0000-000000000001', 'dogs')::text, true) $$,
	'members can create a draft'
);
select results_eq(
	$$ select status, vertical from public.listings where id = current_setting('test.id')::uuid $$,
	$$ values ('draft'::text, 'animal'::text) $$,
	'new listings are animal drafts'
);
select is(
	(select source from public.pet_listing_private where listing_id = current_setting('test.id')::uuid), null,
	'pet shops choose their source; it is not assumed'
);
select throws_ok(
	$$ select public.create_listing('aaaaaaaa-0000-0000-0000-000000000001', 'dogs') $$,
	'P0001', 'not_a_member', 'cannot create listings for another seller'
);
select throws_ok(
	$$ select public.create_listing('cccccccc-0000-0000-0000-000000000001', 'cats') $$,
	'P0001', 'category_unavailable', 'coming-soon categories cannot be used'
);
select throws_ok(
	$$ insert into public.listings (seller_id, category_id) values ('cccccccc-0000-0000-0000-000000000001', 1) $$,
	'42501', null, 'listings cannot be inserted directly'
);
select throws_ok(
	$$ update public.listings set status = 'published' where id = current_setting('test.id')::uuid $$,
	'42501', null, 'status cannot be written directly'
);
select throws_ok(
	$$ update public.listings set price_cents = 0 where id = current_setting('test.id')::uuid $$,
	'23514', null, 'prices must be positive'
);
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'missing_details', 'submitting needs the details'
);

-- Fill everything in, with a Part 1 breed first.
update public.listings set title = 'Lovely test puppy', price_cents = 350000 where id = current_setting('test.id')::uuid;
update public.pet_listing_details set
	breed_id = (select id from public.breeds where slug = 'akita'), sex = 'female', colour = 'Red',
	date_of_birth = current_date - 70, ready_date = current_date
where listing_id = current_setting('test.id')::uuid;
update public.pet_listing_private set microchip_no = '900085000009999', source = 'licensed_breeder',
	source_licence_no = 'BR25001'
where listing_id = current_setting('test.id')::uuid;

select throws_ok(
	$$ update public.pet_listing_details set breed_id = (select id from public.breeds where slug = 'test-cat')
		where listing_id = current_setting('test.id')::uuid $$,
	'P0001', 'breed_species_mismatch', 'breeds must match the category species'
);
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'restricted_breed', 'Specified Dog Part 1 breeds cannot be listed'
);
update public.pet_listing_details set breed_id = (select id from public.breeds where slug = 'golden-retriever'),
	cross_breed_id = (select id from public.breeds where slug = 'tosa')
where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'restricted_breed', 'crosses with a Part 1 breed cannot be listed'
);
update public.pet_listing_details set cross_breed_id = null, ready_date = current_date - 20
where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'too_young_at_handover', 'animals cannot go home before 9 weeks'
);
update public.pet_listing_details set date_of_birth = current_date + 1 where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_dates', 'birth dates cannot be in the future'
);
update public.pet_listing_details set date_of_birth = current_date - 70, ready_date = current_date
where listing_id = current_setting('test.id')::uuid;

select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'vaccinations_incomplete', 'two vaccinations are needed'
);
insert into public.pet_health_records (listing_id, kind, given_on, product)
values
	(current_setting('test.id')::uuid, 'vaccination', current_date - 28, 'Nobivac DHP'),
	(current_setting('test.id')::uuid, 'vaccination', current_date - 3, 'Nobivac DHPPi');
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'vaccinations_incomplete', 'the last vaccination needs 7 days before handover'
);
update public.pet_health_records set given_on = current_date - 14
where listing_id = current_setting('test.id')::uuid and given_on = current_date - 3;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'deworming_incomplete', 'two dewormings are needed'
);
insert into public.pet_health_records (listing_id, kind, given_on, product)
values
	(current_setting('test.id')::uuid, 'deworming', current_date - 56, 'Drontal'),
	(current_setting('test.id')::uuid, 'deworming', current_date - 42, 'Drontal');
select throws_ok(
	$$ insert into public.pet_health_records (listing_id, kind, given_on, product)
		values (current_setting('test.id')::uuid, 'deworming', current_date - 100, 'Drontal');
		select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_dates', 'health records cannot predate the birth date'
);
delete from public.pet_health_records where listing_id = current_setting('test.id')::uuid and given_on = current_date - 100;

-- Source rules for pet shops.
update public.pet_listing_private set source = 'bred_on_premises' where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_source', 'pet shops cannot sell animals they bred'
);
update public.pet_listing_private set source = 'licensed_breeder', source_licence_no = null
where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_source', 'licensed-breeder sources need the breeder licence number'
);
update public.pet_listing_private set source = 'imported', import_permit_no = 'IMP-2026-001',
	arrival_date = current_date - 1
where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_source', 'imported animals need 72 hours after arrival'
);
update public.pet_listing_private set arrival_date = current_date - 10 where listing_id = current_setting('test.id')::uuid;
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'missing_photos', 'at least one photo is required'
);
select public.add_listing_image(current_setting('test.id')::uuid, current_setting('test.id') || '/photo.webp', 1600, 1200);
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'missing_vaccination_card', 'the vaccination card is required'
);
insert into public.listing_documents (listing_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
values (current_setting('test.id')::uuid, 'vaccination_card', current_setting('test.id') || '/card.pdf', 'card.pdf',
	'application/pdf', 100, '00000000-0000-0000-0000-0000000000d1');
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'P0001', 'missing_import_permit', 'imported animals need the import permit'
);
update public.pet_listing_private set source = 'licensed_breeder', source_licence_no = 'BR25001', import_permit_no = null,
	arrival_date = null
where listing_id = current_setting('test.id')::uuid;

select lives_ok(
	$$ select public.submit_listing_for_review(current_setting('test.id')::uuid) $$,
	'a complete listing can be submitted'
);
select results_eq(
	$$ select status, submitted_at is not null from public.listings where id = current_setting('test.id')::uuid $$,
	$$ values ('pending_review'::text, true) $$,
	'submitting sends the listing for review'
);

-- Locked while pending.
select throws_ok(
	$$ update public.listings set title = 'Changed title' where id = current_setting('test.id')::uuid $$,
	'P0001', 'listing_locked', 'listings cannot be edited while in review'
);
select throws_ok(
	$$ update public.pet_listing_details set colour = 'Blue' where listing_id = current_setting('test.id')::uuid $$,
	'P0001', 'listing_locked', 'details cannot be edited while in review'
);
select throws_ok(
	$$ insert into public.pet_health_records (listing_id, kind, given_on, product)
		values (current_setting('test.id')::uuid, 'deworming', current_date - 1, 'Drontal') $$,
	'P0001', 'listing_locked', 'health records cannot be added while in review'
);
delete from public.listings where id = current_setting('test.id')::uuid;
select is(
	(select count(*)::int from public.listings where id = current_setting('test.id')::uuid), 1,
	'submitted listings cannot be deleted'
);
select throws_ok(
	$$ select public.archive_listing(current_setting('test.id')::uuid) $$,
	'P0001', 'invalid_transition', 'listings in review cannot be archived'
);

-- Strangers and anonymous visitors see nothing before publication.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select is((select count(*)::int from public.listings where id = current_setting('test.id')::uuid), 0,
	'other users cannot see a listing in review');
select is((select count(*)::int from public.pet_health_records where listing_id = current_setting('test.id')::uuid), 0,
	'or its health records');
select throws_ok(
	$$ select public.set_listing_availability(current_setting('test.id')::uuid, 'sold') $$,
	'P0001', 'not_a_member', 'other users cannot change availability'
);

-- Published (by an admin in PR 6; here as postgres).
reset role;
update public.listings set status = 'published', published_at = now() where id = current_setting('test.id')::uuid;

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.listings where id = current_setting('test.id')::uuid), 1,
	'anonymous visitors see published listings');
select is((select count(*)::int from public.pet_listing_details where listing_id = current_setting('test.id')::uuid), 1,
	'and their details');
select is((select count(*)::int from public.pet_health_records where listing_id = current_setting('test.id')::uuid), 4,
	'and their health records');
select throws_ok($$ select * from public.pet_listing_private $$, '42501', null,
	'anonymous visitors cannot read microchips or sources');
select is((select count(*)::int from public.listings where status = 'draft'), 0, 'anonymous visitors never see drafts');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select is((select count(*)::int from public.pet_listing_private where listing_id = current_setting('test.id')::uuid), 0,
	'other users cannot read private details of a public listing');
select is((select count(*)::int from public.listing_documents where listing_id = current_setting('test.id')::uuid), 0,
	'or its documents');

-- Availability and revising, as the owner.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select lives_ok(
	$$ select public.set_listing_availability(current_setting('test.id')::uuid, 'reserved') $$, 'owners can mark reserved'
);
select lives_ok(
	$$ select public.set_listing_availability(current_setting('test.id')::uuid, 'published') $$,
	'and available again'
);
select throws_ok(
	$$ select public.set_listing_availability(current_setting('test.id')::uuid, 'pending_review') $$,
	'P0001', 'invalid_transition', 'availability only moves between published, reserved and sold'
);
select lives_ok($$ select public.revise_listing(current_setting('test.id')::uuid) $$, 'owners can revise a live listing');
select is((select status from public.listings where id = current_setting('test.id')::uuid), 'draft',
	'revising returns the listing to draft');
select lives_ok($$ update public.listings set title = 'Revised test puppy' where id = current_setting('test.id')::uuid $$,
	'a revised listing can be edited');
delete from public.listings where id = current_setting('test.id')::uuid;
select is((select count(*)::int from public.listings where id = current_setting('test.id')::uuid), 1,
	'a draft that was submitted before cannot be deleted');

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.listings where id = current_setting('test.id')::uuid), 0,
	'a revised listing leaves the marketplace');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select lives_ok($$ select public.archive_listing(current_setting('test.id')::uuid) $$, 'owners can archive');
select throws_ok(
	$$ select public.revise_listing(current_setting('test.id')::uuid) $$, 'P0001', 'invalid_transition',
	'archived listings cannot be revised'
);

select lives_ok(
	$$ select set_config('test.scratch', public.create_listing('cccccccc-0000-0000-0000-000000000001', 'dogs')::text, true) $$,
	'owners can start another draft'
);
delete from public.listings where id = current_setting('test.scratch')::uuid;
select is((select count(*)::int from public.listings where id = current_setting('test.scratch')::uuid), 0,
	'a draft that was never submitted can be deleted');

-- Unverified sellers prepare drafts but cannot submit.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d3","role":"authenticated"}', true);
select lives_ok(
	$$ select set_config('test.newbie', public.create_listing('cccccccc-0000-0000-0000-000000000002', 'dogs')::text, true) $$,
	'unverified sellers can create drafts'
);
select throws_ok(
	$$ select public.submit_listing_for_review(current_setting('test.newbie')::uuid) $$,
	'P0001', 'seller_cannot_list', 'unverified sellers cannot submit'
);

-- The seeded breeder listing passes every rule; breeders cannot claim another source.
reset role;
update public.listings set status = 'draft' where id = 'bbbbbbbb-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
update public.pet_listing_private set source = 'licensed_breeder', source_licence_no = 'BR25002'
where listing_id = 'bbbbbbbb-0000-0000-0000-000000000001';
select throws_ok(
	$$ select public.submit_listing_for_review('bbbbbbbb-0000-0000-0000-000000000001') $$,
	'P0001', 'invalid_source', 'breeders can only sell animals they bred'
);
update public.pet_listing_private set source = 'bred_on_premises', source_licence_no = null
where listing_id = 'bbbbbbbb-0000-0000-0000-000000000001';
select public.add_listing_image('bbbbbbbb-0000-0000-0000-000000000001',
	'bbbbbbbb-0000-0000-0000-000000000001/photo.webp', 1600, 1200);
select lives_ok(
	$$ select public.submit_listing_for_review('bbbbbbbb-0000-0000-0000-000000000001') $$,
	'the seeded breeder listing satisfies every rule'
);

-- Suspending a seller hides their listings; detail rows only attach to animal listings.
reset role;
update public.listings set status = 'published' where id = 'bbbbbbbb-0000-0000-0000-000000000001';
update public.sellers set verification_status = 'suspended' where id = 'aaaaaaaa-0000-0000-0000-000000000001';
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is(
	(select count(*)::int from public.listings where seller_id = 'aaaaaaaa-0000-0000-0000-000000000001'), 0,
	'a suspended seller''s listings are hidden'
);
reset role;
insert into public.listings (id, seller_id, category_id)
values ('cccccccc-1111-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001',
	(select id from public.categories where slug = 'accessories'));
select throws_ok(
	$$ insert into public.pet_listing_details (listing_id) values ('cccccccc-1111-0000-0000-000000000001') $$,
	'23503', null, 'pet details cannot attach to a non-animal listing'
);

select * from finish();
rollback;
