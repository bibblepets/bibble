-- Storage policies for the private seller-documents bucket. Checks are scoped to this test's seller folder, since a
-- local database may hold uploads from e2e runs.
begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

insert into auth.users (id, email, aud, role)
values
	('00000000-0000-0000-0000-0000000000b1', 'owner@test.local', 'authenticated', 'authenticated'),
	('00000000-0000-0000-0000-0000000000b2', 'stranger@test.local', 'authenticated', 'authenticated');

select is(
	(select public from storage.buckets where id = 'seller-documents'), false, 'the documents bucket is private'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select set_config('test.seller_id', public.create_seller('pet_shop', array['dog'])::text, true);

select lives_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
	values ('seller-documents', current_setting('test.seller_id') || '/licence.pdf', '00000000-0000-0000-0000-0000000000b1') $$,
	'members can upload into their seller''s folder'
);
select throws_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
	values ('seller-documents', 'aaaaaaaa-0000-0000-0000-000000000001/sneaky.pdf', '00000000-0000-0000-0000-0000000000b1') $$,
	'42501', null, 'members cannot upload into another seller''s folder'
);
select is(
	(select count(*)::int from storage.objects where bucket_id = 'seller-documents'), 1, 'members can read their own files'
);

-- Uploads are append-only: no update or delete policies, so these touch nothing.
update storage.objects set name = name || '.renamed' where bucket_id = 'seller-documents';
-- The Storage API sets this flag before deleting; RLS still decides which rows it may delete.
select set_config('storage.allow_delete_query', 'true', true);
delete from storage.objects where bucket_id = 'seller-documents';

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);

select is(
	(select count(*)::int from storage.objects where bucket_id = 'seller-documents'), 0, 'other users cannot read the files'
);
select throws_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
	values ('seller-documents', current_setting('test.seller_id') || '/fake.pdf', '00000000-0000-0000-0000-0000000000b2') $$,
	'42501', null, 'other users cannot upload into the seller''s folder'
);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is(
	(select count(*)::int from storage.objects where bucket_id = 'seller-documents'), 0, 'anonymous users cannot read the files'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
select is(
	(select count(*)::int from storage.objects
		where bucket_id = 'seller-documents' and name like current_setting('test.seller_id') || '/%'),
	1, 'admins can read every seller''s files'
);

reset role;
select is(
	(select name from storage.objects
		where bucket_id = 'seller-documents' and name like current_setting('test.seller_id') || '/%'),
	current_setting('test.seller_id') || '/licence.pdf', 'members cannot rename or delete uploads'
);

select * from finish();
rollback;
