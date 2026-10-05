-- Admin decisions on sellers: transitions, permissions, audit trail and what sellers can see of it.
begin;
create extension if not exists pgtap with schema extensions;
select plan(32);

-- A fresh owner with a submitted seller; carol (3333…) is the seeded admin.
insert into auth.users (id, email, aud, role)
values
	('00000000-0000-0000-0000-0000000000c1', 'owner@test.local', 'authenticated', 'authenticated'),
	('00000000-0000-0000-0000-0000000000c2', 'stranger@test.local', 'authenticated', 'authenticated');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);
select set_config('test.seller_id', public.create_seller('breeder', array['dog'])::text, true);
update public.sellers set
	display_name = 'Review Dogs', legal_name = 'Review Dogs Pte. Ltd.', uen = '202388888R', licence_no = 'BR28888',
	licence_expires_on = current_date + 90, area_id = (select id from public.areas where slug = 'yishun');
update public.seller_private_details
	set address_line1 = '1 Yishun Road', postal_code = '760001', contact_phone = '+6591112222';
insert into public.seller_documents (seller_id, kind, storage_path, file_name, content_type, size_bytes, uploaded_by)
values
	(current_setting('test.seller_id')::uuid, 'avs_licence', current_setting('test.seller_id') || '/l.pdf', 'l.pdf',
		'application/pdf', 10, '00000000-0000-0000-0000-0000000000c1'),
	(current_setting('test.seller_id')::uuid, 'acra_bizfile', current_setting('test.seller_id') || '/b.pdf', 'b.pdf',
		'application/pdf', 10, '00000000-0000-0000-0000-0000000000c1');
select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid);

-- Owners can't review themselves or read the audit table.
select throws_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'approved', null, null,
		public.seller_approval_checklist()) $$,
	'P0001', 'not_an_admin', 'non-admins cannot review sellers'
);
select throws_ok(
	$$ select public.admin_correct_seller(current_setting('test.seller_id')::uuid, 'breeder', 'X', '202300000A',
		'BR20000', array['dog'], 'note') $$,
	'P0001', 'not_an_admin', 'non-admins cannot correct sellers'
);
select is((select count(*)::int from public.admin_seller_status_counts()), 0, 'non-admins get no status counts');
select is((select count(*)::int from public.admin_seller_owner(current_setting('test.seller_id')::uuid)), 0,
	'non-admins cannot look up seller owners');
select is((select count(*)::int from public.get_seller_feedback(current_setting('test.seller_id')::uuid)), 0,
	'there is no feedback before a decision');

-- The admin works the queue.
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);

select is(
	(select total::int from public.admin_seller_status_counts() where status = 'pending') >= 1, true,
	'admins see status counts'
);
select results_eq(
	$$ select email, display_name from public.admin_seller_owner(current_setting('test.seller_id')::uuid) $$,
	$$ values ('owner@test.local'::text, null::text) $$,
	'admins can look up the owner'
);
select throws_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'approved', null, null,
		array['avs_registry']) $$,
	'P0001', 'checklist_incomplete', 'approving needs the whole checklist'
);
select throws_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'rejected', '   ') $$,
	'P0001', 'message_required', 'rejecting needs a message'
);
select throws_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'suspended', 'Nope') $$,
	'P0001', 'invalid_transition', 'a pending seller cannot be suspended'
);
select throws_ok(
	$$ select public.review_seller(gen_random_uuid(), 'rejected', 'Nope') $$,
	'P0001', 'seller_not_found', 'unknown sellers are reported'
);

-- Reject, then the seller resubmits.
select lives_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'rejected',
		' Licence not found in the AVS registry. ', 'Checked registry 1 Oct') $$,
	'admins can reject with a message'
);
select is(
	(select verification_status from public.sellers where id = current_setting('test.seller_id')::uuid), 'rejected',
	'rejecting sets the status'
);
select results_eq(
	$$ select decision, message, internal_note from public.seller_reviews
		where seller_id = current_setting('test.seller_id')::uuid $$,
	$$ values ('rejected'::text, 'Licence not found in the AVS registry.'::text, 'Checked registry 1 Oct'::text) $$,
	'the decision is recorded with trimmed text'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);
select results_eq(
	$$ select decision, message from public.get_seller_feedback(current_setting('test.seller_id')::uuid) $$,
	$$ values ('rejected'::text, 'Licence not found in the AVS registry.'::text) $$,
	'the owner sees the decision and message'
);
select is((select count(*)::int from public.seller_reviews), 0, 'the owner cannot read the audit table or internal notes');
select lives_ok(
	$$ update public.sellers set licence_no = 'BR28889' where id = current_setting('test.seller_id')::uuid $$,
	'a rejected seller can fix locked details'
);
select lives_ok(
	$$ select public.submit_seller_for_verification(current_setting('test.seller_id')::uuid) $$,
	'and resubmit'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c2","role":"authenticated"}', true);
select is((select count(*)::int from public.get_seller_feedback(current_setting('test.seller_id')::uuid)), 0,
	'other users get no feedback');

-- Approve, suspend, reinstate.
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
select lives_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'approved', null, null,
		public.seller_approval_checklist()) $$,
	'admins can approve with the full checklist'
);
select results_eq(
	$$ select verification_status, verified_at is not null from public.sellers
		where id = current_setting('test.seller_id')::uuid $$,
	$$ values ('verified'::text, true) $$,
	'approving verifies the seller'
);
select is(
	(select checklist from public.seller_reviews where seller_id = current_setting('test.seller_id')::uuid
		and decision = 'approved'),
	public.seller_approval_checklist(), 'the ticked checklist is stored'
);
select throws_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'approved', null, null,
		public.seller_approval_checklist()) $$,
	'P0001', 'invalid_transition', 'a verified seller cannot be approved twice'
);
select lives_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'suspended', 'Complaint under review.') $$,
	'admins can suspend a verified seller'
);
select ok(
	not public.seller_can_list(current_setting('test.seller_id')::uuid, (select id from public.species where slug = 'dog')),
	'a suspended seller cannot list'
);
select lives_ok(
	$$ select public.review_seller(current_setting('test.seller_id')::uuid, 'reinstated') $$,
	'admins can reinstate without a message'
);
select is(
	(select verification_status from public.sellers where id = current_setting('test.seller_id')::uuid), 'verified',
	'reinstating restores verified'
);

-- Corrections.
select throws_ok(
	$$ select public.admin_correct_seller(current_setting('test.seller_id')::uuid, 'pet_shop', 'Review Pets Pte. Ltd.',
		'202388888R', 'AS24B00001', array['dog'], ' ') $$,
	'P0001', 'note_required', 'corrections need an internal note'
);
select throws_ok(
	$$ select public.admin_correct_seller(current_setting('test.seller_id')::uuid, 'pet_shop', 'Review Pets Pte. Ltd.',
		'202388888R', 'AS24B00001', array['cat'], 'Typo') $$,
	'P0001', 'invalid_species', 'corrections only allow active species'
);
select lives_ok(
	$$ select public.admin_correct_seller(current_setting('test.seller_id')::uuid, 'pet_shop', 'Review Pets Pte. Ltd.',
		'202388888R', 'AS24B00001', array['dog'], 'Seller sent the right licence by email') $$,
	'admins can correct locked details of a verified seller'
);
select results_eq(
	$$ select seller_type, legal_name, licence_no, verification_status from public.sellers
		where id = current_setting('test.seller_id')::uuid $$,
	$$ values ('pet_shop'::text, 'Review Pets Pte. Ltd.'::text, 'AS24B00001'::text, 'verified'::text) $$,
	'corrections change the details but not the status'
);

-- Feedback ignores corrections and shows the latest status decision.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);
select is(
	(select decision from public.get_seller_feedback(current_setting('test.seller_id')::uuid)), 'reinstated',
	'feedback skips corrections'
);

select * from finish();
rollback;
