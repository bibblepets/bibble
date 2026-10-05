-- Listing photos: the 5-photo cap, positions, reordering, locking, visibility and Storage policies.
begin;
create extension if not exists pgtap with schema extensions;
select plan(22);

insert into auth.users (id, email, aud, role)
values ('00000000-0000-0000-0000-0000000000f2', 'stranger@test.local', 'authenticated', 'authenticated');

-- dave (pet shop) starts a draft.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);
select set_config('test.id', public.create_listing('aaaaaaaa-0000-0000-0000-000000000002', 'dogs')::text, true);

select throws_ok(
	$$ select public.add_listing_image(current_setting('test.id')::uuid, 'elsewhere/x.webp', 10, 10) $$,
	'23514', null, 'photos must sit in the listing''s folder'
);
select lives_ok(
	$$ select public.add_listing_image(current_setting('test.id')::uuid, current_setting('test.id') || '/' || n || '.webp', 1600, 1200)
		from generate_series(1, 5) n $$,
	'members can add five photos'
);
select results_eq(
	$$ select position::int from public.listing_images where listing_id = current_setting('test.id')::uuid order by position $$,
	$$ values (0), (1), (2), (3), (4) $$,
	'photos take the next positions'
);
select throws_ok(
	$$ select public.add_listing_image(current_setting('test.id')::uuid, current_setting('test.id') || '/6.webp', 10, 10) $$,
	'P0001', 'too_many_images', 'a sixth photo is refused'
);
select throws_ok(
	$$ insert into public.listing_images (listing_id, storage_path, position, width, height)
		values (current_setting('test.id')::uuid, current_setting('test.id') || '/direct.webp', 0, 1, 1) $$,
	'42501', null, 'photos cannot be inserted directly'
);

-- Remove the second photo: the rest close up.
select is(
	public.remove_listing_image((select id from public.listing_images
		where listing_id = current_setting('test.id')::uuid and position = 1)),
	current_setting('test.id') || '/2.webp', 'removing returns the storage path to delete'
);
select results_eq(
	$$ select storage_path, position::int from public.listing_images
		where listing_id = current_setting('test.id')::uuid order by position $$,
	$$ values (current_setting('test.id') || '/1.webp', 0), (current_setting('test.id') || '/3.webp', 1),
		(current_setting('test.id') || '/4.webp', 2), (current_setting('test.id') || '/5.webp', 3) $$,
	'positions close the gap'
);

-- Reorder: the last photo becomes the cover.
select lives_ok(
	$$ select public.reorder_listing_images(current_setting('test.id')::uuid, array(
		select id from public.listing_images where listing_id = current_setting('test.id')::uuid
		order by position desc)) $$,
	'members can reorder photos'
);
select is(
	(select storage_path from public.listing_images where listing_id = current_setting('test.id')::uuid and position = 0),
	current_setting('test.id') || '/5.webp', 'the first photo in the new order is the cover'
);
select throws_ok(
	$$ select public.reorder_listing_images(current_setting('test.id')::uuid, array(
		select id from public.listing_images where listing_id = current_setting('test.id')::uuid limit 2)) $$,
	'P0001', 'invalid_image_order', 'reordering must include every photo'
);
select throws_ok(
	$$ select public.reorder_listing_images(current_setting('test.id')::uuid, array[gen_random_uuid(), gen_random_uuid(),
		gen_random_uuid(), gen_random_uuid()]) $$,
	'P0001', 'invalid_image_order', 'reordering only accepts this listing''s photos'
);

-- Storage: uploads only into editable listings of your own.
select lives_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
		values ('listing-images', current_setting('test.id') || '/up.webp', '44444444-4444-4444-4444-444444444444') $$,
	'members can upload photos to a draft'
);
select throws_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
		values ('listing-images', 'bbbbbbbb-0000-0000-0000-000000000004/up.webp', '44444444-4444-4444-4444-444444444444') $$,
	'42501', null, 'members cannot upload photos to a live listing'
);
select throws_ok(
	$$ insert into storage.objects (bucket_id, name, owner_id)
		values ('listing-images', 'bbbbbbbb-0000-0000-0000-000000000001/up.webp', '44444444-4444-4444-4444-444444444444') $$,
	'42501', null, 'members cannot upload photos to another seller''s listing'
);

-- Strangers and anonymous visitors can't touch or see draft photos.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select throws_ok(
	$$ select public.add_listing_image(current_setting('test.id')::uuid, current_setting('test.id') || '/x.webp', 1, 1) $$,
	'P0001', 'not_a_member', 'other users cannot add photos'
);
select is((select count(*)::int from public.listing_images where listing_id = current_setting('test.id')::uuid), 0,
	'other users cannot see draft photos');

-- Locked once it's not a draft; public once live.
reset role;
update public.listings set status = 'published' where id = current_setting('test.id')::uuid;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);
select throws_ok(
	$$ select public.remove_listing_image((select id from public.listing_images
		where listing_id = current_setting('test.id')::uuid limit 1)) $$,
	'P0001', 'listing_locked', 'photos cannot be removed from a live listing'
);
select throws_ok(
	$$ select public.add_listing_image(current_setting('test.id')::uuid, current_setting('test.id') || '/late.webp', 1, 1) $$,
	'P0001', 'listing_locked', 'photos cannot be added to a live listing'
);
select throws_ok(
	$$ select public.remove_listing_image(gen_random_uuid()) $$, 'P0001', 'image_not_found', 'unknown photos are reported'
);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.listing_images where listing_id = current_setting('test.id')::uuid), 4,
	'anonymous visitors see a live listing''s photos');

reset role;
select is((select public from storage.buckets where id = 'listing-images'), true, 'the photo bucket is public');
select is(
	(select file_size_limit from storage.buckets where id = 'listing-images'), 5242880::bigint, 'photos are capped at 5 MB'
);

select * from finish();
rollback;
