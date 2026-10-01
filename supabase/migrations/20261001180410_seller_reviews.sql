-- Seller verification by platform admins: an audit trail of decisions, the functions that make them, and a narrow
-- view of the latest decision for the seller.

create table public.seller_reviews (
	id uuid primary key default gen_random_uuid(),
	seller_id uuid not null references public.sellers (id) on delete cascade,
	-- References profiles (1:1 with auth.users) so the reviewer's name can be embedded.
	reviewer_id uuid references public.profiles (id) on delete set null,
	decision text not null
		check (decision in ('approved', 'rejected', 'suspended', 'reinstated', 'details_corrected')),
	-- Shown to the seller.
	message text check (char_length(message) between 1 and 1000),
	-- Admins only. Never returned to sellers.
	internal_note text check (char_length(internal_note) between 1 and 2000),
	-- Checklist keys ticked when approving (see lib/admin/checklist.ts).
	checklist text[] not null default '{}',
	-- clock_timestamp() rather than now(), so decisions made in one transaction still have a clear order.
	created_at timestamptz not null default clock_timestamp(),
	constraint seller_reviews_message_required check (decision not in ('rejected', 'suspended') or message is not null),
	constraint seller_reviews_note_required check (decision <> 'details_corrected' or internal_note is not null)
);

comment on table public.seller_reviews is
	'Audit trail of admin decisions on sellers. Admins only; sellers see the latest decision via get_seller_feedback().';

create index seller_reviews_seller_id_created_at_idx on public.seller_reviews (seller_id, created_at desc);
create index seller_reviews_reviewer_id_idx on public.seller_reviews (reviewer_id);

alter table public.seller_reviews enable row level security;
revoke all on public.seller_reviews from anon, authenticated;
grant select on public.seller_reviews to authenticated;

-- Rows are written only by the functions below.
create policy "Admins can view seller reviews"
	on public.seller_reviews for select
	to authenticated
	using (public.is_platform_admin());

----------------------------------------------------------------------------------------------------
-- Decisions
----------------------------------------------------------------------------------------------------

-- Checks an admin must tick to approve. Keep in sync with lib/admin/checklist.ts (a unit test compares them).
create function public.seller_approval_checklist()
returns text[]
language sql
immutable
set search_path = ''
as $$
	select array[
		'avs_registry', 'registry_matches_acra', 'licence_scope', 'licence_expiry', 'uen_matches', 'documents_valid'
	];
$$;

-- Approves, rejects, suspends or reinstates a seller, recording the decision. The only way statuses change after
-- submission.
create function public.review_seller(
	p_seller_id uuid,
	p_decision text,
	p_message text default null,
	p_internal_note text default null,
	p_checklist text[] default '{}'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	seller public.sellers;
	next_status text;
	v_message text := nullif(trim(p_message), '');
	v_note text := nullif(trim(p_internal_note), '');
begin
	if not public.is_platform_admin() then
		raise exception 'not_an_admin';
	end if;

	select * into seller from public.sellers where id = p_seller_id for update;
	if not found then
		raise exception 'seller_not_found';
	end if;

	next_status := case
		when p_decision = 'approved' and seller.verification_status = 'pending' then 'verified'
		when p_decision = 'rejected' and seller.verification_status = 'pending' then 'rejected'
		when p_decision = 'suspended' and seller.verification_status = 'verified' then 'suspended'
		when p_decision = 'reinstated' and seller.verification_status = 'suspended' then 'verified'
	end;
	if next_status is null then
		raise exception 'invalid_transition';
	end if;

	if p_decision in ('rejected', 'suspended') and v_message is null then
		raise exception 'message_required';
	end if;
	if p_decision = 'approved' then
		if not (coalesce(p_checklist, '{}') @> public.seller_approval_checklist()) then
			raise exception 'checklist_incomplete';
		end if;
		if seller.licence_expires_on < current_date then
			raise exception 'licence_expired';
		end if;
	end if;

	update public.sellers
	set
		verification_status = next_status,
		verified_at = case when p_decision = 'approved' then now() else verified_at end
	where id = p_seller_id;

	insert into public.seller_reviews (seller_id, reviewer_id, decision, message, internal_note, checklist)
	values (
		p_seller_id, (select auth.uid()), p_decision, v_message, v_note,
		case when p_decision = 'approved' then p_checklist else '{}' end
	);
end;
$$;

-- Corrects the details sellers can't change once submitted. Recorded with a mandatory internal note.
create function public.admin_correct_seller(
	p_seller_id uuid,
	p_seller_type text,
	p_legal_name text,
	p_uen text,
	p_licence_no text,
	p_species text[],
	p_internal_note text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_note text := nullif(trim(p_internal_note), '');
	species_ids smallint[];
begin
	if not public.is_platform_admin() then
		raise exception 'not_an_admin';
	end if;
	if v_note is null then
		raise exception 'note_required';
	end if;
	if not exists (select 1 from public.sellers where id = p_seller_id) then
		raise exception 'seller_not_found';
	end if;

	select array_agg(id) into species_ids from public.species where slug = any (p_species) and is_active;
	if coalesce(cardinality(species_ids), 0) = 0
		or cardinality(species_ids) <> cardinality(array(select distinct unnest(p_species)))
	then
		raise exception 'invalid_species';
	end if;

	update public.sellers
	set seller_type = p_seller_type, legal_name = p_legal_name, uen = p_uen, licence_no = p_licence_no
	where id = p_seller_id;

	delete from public.seller_species where seller_id = p_seller_id and species_id <> all (species_ids);
	insert into public.seller_species (seller_id, species_id)
	select p_seller_id, unnest(species_ids)
	on conflict do nothing;

	insert into public.seller_reviews (seller_id, reviewer_id, decision, internal_note)
	values (p_seller_id, (select auth.uid()), 'details_corrected', v_note);
end;
$$;

----------------------------------------------------------------------------------------------------
-- Reads
----------------------------------------------------------------------------------------------------

-- The latest status decision on a seller, without internal notes. For the seller's members and admins.
create function public.get_seller_feedback(p_seller_id uuid)
returns table (decision text, message text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
	select r.decision, r.message, r.created_at
	from public.seller_reviews r
	where r.seller_id = p_seller_id
		and r.decision <> 'details_corrected'
		and (public.is_seller_member(p_seller_id) or public.is_platform_admin())
	order by r.created_at desc
	limit 1;
$$;

-- Sellers per status, for the admin queue tabs.
create function public.admin_seller_status_counts()
returns table (status text, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
	select verification_status, count(*)
	from public.sellers
	where public.is_platform_admin()
	group by verification_status;
$$;

-- The seller's owner account, for admins contacting or identifying them.
create function public.admin_seller_owner(p_seller_id uuid)
returns table (user_id uuid, email text, display_name text)
language sql
stable
security definer
set search_path = ''
as $$
	select u.id, u.email::text, p.display_name
	from public.seller_members m
	join auth.users u on u.id = m.user_id
	left join public.profiles p on p.id = m.user_id
	where m.seller_id = p_seller_id and m.role = 'owner' and public.is_platform_admin();
$$;

revoke execute on function public.seller_approval_checklist() from public;
revoke execute on function public.review_seller(uuid, text, text, text, text[]) from public, anon;
revoke execute on function public.admin_correct_seller(uuid, text, text, text, text, text[], text) from public, anon;
revoke execute on function public.get_seller_feedback(uuid) from public, anon;
revoke execute on function public.admin_seller_status_counts() from public, anon;
revoke execute on function public.admin_seller_owner(uuid) from public, anon;
grant execute on function public.seller_approval_checklist() to authenticated;
grant execute on function public.review_seller(uuid, text, text, text, text[]) to authenticated;
grant execute on function public.admin_correct_seller(uuid, text, text, text, text, text[], text) to authenticated;
grant execute on function public.get_seller_feedback(uuid) to authenticated;
grant execute on function public.admin_seller_status_counts() to authenticated;
grant execute on function public.admin_seller_owner(uuid) to authenticated;
