-- Profil Dziaderski: accounts (Supabase Auth, magic link) with a nickname and saved results.
--
-- Saved results are kept apart from public.results on purpose: the census stays anonymous,
-- and deleting an account removes everything linked to it (on delete cascade).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text check (nickname is null or char_length(nickname) between 1 and 24),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil Dziaderski: pseudonim właściciela konta.';

alter table public.profiles enable row level security;

create policy "Właściciel czyta swój profil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Właściciel zmienia swój profil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- A profile for every new account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- Results saved to a profile: the full result code, name part included (it is the owner's data).
create table public.saved_results (
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null check (char_length(code) between 10 and 160),
  saved_at timestamptz not null default now(),
  primary key (user_id, code)
);

comment on table public.saved_results is 'Wyniki zapisane w Profilu Dziaderskim.';

create index saved_results_saved_at_idx on public.saved_results (user_id, saved_at desc);

alter table public.saved_results enable row level security;

create policy "Właściciel czyta swoje wyniki"
  on public.saved_results for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Właściciel zapisuje swoje wyniki"
  on public.saved_results for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Właściciel usuwa swoje wyniki"
  on public.saved_results for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Profiles for accounts that existed before this migration, if any.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
