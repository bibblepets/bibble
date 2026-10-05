-- Storage policies for the private listing-documents bucket. The test creates its own listing so its folder starts
-- empty, whatever uploads a local database already holds.
begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

insert into auth.users (id, email, aud, role)
values ('00000000-0000-0000-0000-0000000000e2', 'stranger@test.local', 'authenticated', 'authenticated');

select is((select public from storage.buckets where id = 'listing-documents'), false, 'the bucket is private');

-- dave owns the seeded pet shop; he starts a fresh draft for this test.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);
select set_config('test.id', public.create_listing('aaaaaaaa-0000-0000-0000-000000000002', 'dogs')::text, true);
select lives_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
	values ('listing-documents', current_setting('test.id') || '/card.pdf', '44444444-4444-4444-4444-444444444444') $$,
	'members can upload into their listing''s folder'
);
select throws_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
	values ('listing-documents', 'bbbbbbbb-0000-0000-0000-000000000001/sneaky.pdf', '44444444-4444-4444-4444-444444444444') $$,
	'42501', null, 'members cannot upload into another seller''s listing'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e2","role":"authenticated"}', true);
select is(
	(select count(*)::int from storage.objects where bucket_id = 'listing-documents'
		and name like current_setting('test.id') || '/%'),
	0, 'other users cannot read the files'
);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is(
	(select count(*)::int from storage.objects where bucket_id = 'listing-documents'), 0,
	'anonymous users cannot read any files'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
select is(
	(select count(*)::int from storage.objects where bucket_id = 'listing-documents'
		and name like current_setting('test.id') || '/%'),
	1, 'admins can read listing files'
);

select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);
update storage.objects set name = name || '.renamed' where bucket_id = 'listing-documents';
select set_config('storage.allow_delete_query', 'true', true);
delete from storage.objects where bucket_id = 'listing-documents';
reset role;
select is(
	(select name from storage.objects where bucket_id = 'listing-documents'
		and name like current_setting('test.id') || '/%'),
	current_setting('test.id') || '/card.pdf', 'members cannot rename or delete uploads'
);

select * from finish();
rollback;
