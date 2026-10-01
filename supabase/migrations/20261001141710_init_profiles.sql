-- Public user profiles, 1:1 with auth.users.
create table public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	display_name text check (char_length(display_name) <= 80),
	avatar_url text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile for each auth user. Rows are created by the on_auth_user_created trigger.';

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
	on public.profiles for select
	to anon, authenticated
	using (true);

create policy "Users can update their own profile"
	on public.profiles for update
	to authenticated
	using ((select auth.uid()) = id)
	with check ((select auth.uid()) = id);

-- Keep updated_at current on every update.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger profiles_set_updated_at
	before update on public.profiles
	for each row execute function public.set_updated_at();

-- Create a profile whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.profiles (id, display_name, avatar_url)
	values (
		new.id,
		new.raw_user_meta_data ->> 'display_name',
		new.raw_user_meta_data ->> 'avatar_url'
	);
	return new;
end;
$$;

-- Only the auth trigger should be able to run this.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();
