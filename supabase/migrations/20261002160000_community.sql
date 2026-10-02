-- Community: field observations, bookmarks, the Komisja Orzekająca and the statistics yearbook.
--
-- Observations, bookmarks and case submissions belong to an account and go with it
-- (on delete cascade). Verdicts and tallies are anonymous and stay: a verdict loses its owner
-- when the account is deleted (on delete set null), a tally never had one.


-- Obserwacje terenowe: a signed-in visitor reports seeing an Atlas species, at most once a day.
create table public.sightings (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  species text not null check (species ~ '^[a-z]{2,24}$'),
  -- Voivodeship code (ZP, MZ, …), when given.
  region text check (region is null or region ~ '^[A-Z]{2}$'),
  observed_on date not null default ((now() at time zone 'Europe/Warsaw')::date),
  created_at timestamptz not null default now(),
  unique (user_id, species, observed_on)
);

comment on table public.sightings is 'Obserwacje terenowe gatunków z Atlasu, zgłaszane z Profilu Dziaderskiego.';

create index sightings_created_at_idx on public.sightings (created_at desc);
create index sightings_user_idx on public.sightings (user_id, created_at desc);

alter table public.sightings enable row level security;

create policy "Właściciel czyta swoje obserwacje"
  on public.sightings for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Właściciel zgłasza obserwacje"
  on public.sightings for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Właściciel usuwa swoje obserwacje"
  on public.sightings for delete to authenticated
  using ((select auth.uid()) = user_id);


-- Zakładki: things kept in the profile besides results. A Rozmówki line, a bingo card that
-- scored, a field exam. The code is the one in the item's own URL.
create table public.saved_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('rozmowki', 'bingo', 'egzamin')),
  code text not null check (char_length(code) between 3 and 80),
  saved_at timestamptz not null default now(),
  primary key (user_id, kind, code)
);

comment on table public.saved_items is 'Zakładki w Profilu Dziaderskim: rozmówki, wygrane karty bingo, egzaminy terenowe.';

create index saved_items_saved_at_idx on public.saved_items (user_id, saved_at desc);

alter table public.saved_items enable row level security;

create policy "Właściciel czyta swoje zakładki"
  on public.saved_items for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Właściciel dodaje zakładki"
  on public.saved_items for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Właściciel usuwa zakładki"
  on public.saved_items for delete to authenticated
  using ((select auth.uid()) = user_id);


-- Komisja Orzekająca: one vote per case. Anonymous votes are allowed (the browser remembers
-- them); a signed-in voter can vote once per case and sees the vote in the profile.
create table public.verdicts (
  id bigint generated always as identity primary key,
  case_slug text not null check (case_slug ~ '^[a-z0-9-]{2,60}$'),
  verdict text not null check (verdict in ('nie', 'tak', 'kliniczne')),
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.verdicts is 'Głosy ławników Komisji Orzekającej. Anonimowe, chyba że głosował zalogowany ławnik.';

create index verdicts_case_idx on public.verdicts (case_slug);
create unique index verdicts_user_case_idx on public.verdicts (user_id, case_slug) where user_id is not null;

alter table public.verdicts enable row level security;
-- Votes are written by the server (it checks the case exists); owners may read their own.
revoke insert, update, delete on table public.verdicts from anon, authenticated;

create policy "Ławnik czyta swoje głosy"
  on public.verdicts for select to authenticated
  using ((select auth.uid()) = user_id);


-- Cases proposed by signed-in visitors. Nothing here is ever published automatically:
-- the Institute reads the queue and writes accepted cases into the site by hand.
create table public.case_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 30 and 600),
  status text not null default 'nowe' check (status in ('nowe', 'przyjete', 'odrzucone')),
  created_at timestamptz not null default now()
);

comment on table public.case_submissions is 'Sprawy zgłoszone do Komisji Orzekającej. Kolejka moderacji, nic nie jest publikowane automatycznie.';

create index case_submissions_user_idx on public.case_submissions (user_id, created_at desc);
create index case_submissions_status_idx on public.case_submissions (status, created_at);

alter table public.case_submissions enable row level security;

create policy "Właściciel czyta swoje zgłoszenia"
  on public.case_submissions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Właściciel zgłasza sprawy"
  on public.case_submissions for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'nowe');


-- Tallies for the Mały Rocznik Statystyczny: anonymous counters per day, e.g. how many lines
-- the Rozmówki produced or how many times the horn sounded. Server-only.
create table public.tallies (
  day date not null default ((now() at time zone 'Europe/Warsaw')::date),
  kind text not null check (kind ~ '^[a-z-]{2,32}$'),
  n bigint not null default 0,
  primary key (day, kind)
);

comment on table public.tallies is 'Liczniki dzienne do Małego Rocznika Statystycznego. Bez identyfikatorów.';

alter table public.tallies enable row level security;
revoke all on table public.tallies from anon, authenticated;

create or replace function public.tally(what text, amount int default 1)
returns void
language sql
set search_path = ''
as $$
  insert into public.tallies (kind, n) values (what, greatest(1, least(amount, 50)))
  on conflict (day, kind) do update set n = public.tallies.n + excluded.n;
$$;


-- Votes on one case, for the page after voting.
create or replace function public.case_tally(slug text)
returns table (verdict text, n bigint)
language sql
stable
set search_path = ''
as $$
  select v.verdict, count(*) as n
  from public.verdicts v
  where v.case_slug = slug
  group by 1;
$$;


-- Everything the yearbook, the Atlas and the Komisja show, in one call.
create or replace function public.community_summary()
returns jsonb
language sql
stable
set search_path = ''
as $$
  with warsaw as (select (now() at time zone 'Europe/Warsaw')::date as today)
  select jsonb_build_object(
    'accounts', (select count(*) from public.profiles),
    'sightings', jsonb_build_object(
      'total', (select count(*) from public.sightings),
      'observers', (select count(distinct user_id) from public.sightings),
      'today', (select count(*) from public.sightings, warsaw where observed_on = warsaw.today),
      'species', coalesce((
        select jsonb_object_agg(species, n) from (
          select species, count(*) as n from public.sightings group by 1
        ) s
      ), '{}'::jsonb),
      'regions', coalesce((
        select jsonb_object_agg(region, n) from (
          select region, count(*) as n from public.sightings where region is not null group by 1
        ) r
      ), '{}'::jsonb),
      'week', coalesce((
        select jsonb_object_agg(species, n) from (
          select species, count(*) as n
          from public.sightings, warsaw
          where observed_on > warsaw.today - 7
          group by 1
        ) w
      ), '{}'::jsonb),
      'hours', coalesce((
        select jsonb_object_agg(hour, n) from (
          select extract(hour from created_at at time zone 'Europe/Warsaw')::int as hour, count(*) as n
          from public.sightings
          group by 1
        ) h
      ), '{}'::jsonb),
      'latest', coalesce((
        select jsonb_agg(jsonb_build_object('species', species, 'region', region, 'at', created_at) order by created_at desc)
        from (select species, region, created_at from public.sightings order by created_at desc limit 12) l
      ), '[]'::jsonb)
    ),
    'verdicts', jsonb_build_object(
      'total', (select count(*) from public.verdicts),
      'jurors', (select count(distinct user_id) from public.verdicts where user_id is not null),
      'cases', coalesce((
        select jsonb_object_agg(case_slug, counts) from (
          select case_slug, jsonb_object_agg(verdict, n) as counts
          from (select case_slug, verdict, count(*) as n from public.verdicts group by 1, 2) c
          group by 1
        ) per_case
      ), '{}'::jsonb)
    ),
    'saved', coalesce((
      select jsonb_object_agg(kind, n) from (select kind, count(*) as n from public.saved_items group by 1) k
    ), '{}'::jsonb),
    'submissions', (select count(*) from public.case_submissions),
    'tallies', coalesce((
      select jsonb_object_agg(kind, n) from (select kind, sum(n) as n from public.tallies group by 1) t
    ), '{}'::jsonb),
    'talliesToday', coalesce((
      select jsonb_object_agg(kind, n) from (
        select kind, n from public.tallies, warsaw where day = warsaw.today
      ) t
    ), '{}'::jsonb)
  );
$$;

revoke all on function public.tally(text, int) from public, anon, authenticated;
revoke all on function public.case_tally(text) from public, anon, authenticated;
revoke all on function public.community_summary() from public, anon, authenticated;
grant execute on function public.tally(text, int) to service_role;
grant execute on function public.case_tally(text) to service_role;
grant execute on function public.community_summary() to service_role;
