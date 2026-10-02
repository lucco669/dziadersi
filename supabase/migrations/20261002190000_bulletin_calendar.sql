-- Biuletyn tygodniowy, Tablica Honorowa, Kartka z kalendarza and the observation map.
--
-- Two opt-ins on the profile (the weekly email, the nickname on the honor board), the calendar
-- pages a signed-in visitor tears off, and server-only functions that read across accounts.
-- Nothing here is readable by visitors directly except their own calendar pages.


-- Opt-ins. Both start off; the owner flips them in the profile (existing update policy).
alter table public.profiles
  add column newsletter boolean not null default false,
  add column newsletter_at timestamptz,
  add column honor boolean not null default false;

comment on column public.profiles.newsletter is 'Biuletyn tygodniowy: zgoda na list w poniedziałki.';
comment on column public.profiles.honor is 'Pseudonim widoczny na Tablicy Honorowej.';


-- Kartka z kalendarza: one torn page per account per day, Warsaw time.
create table public.calendar_pages (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default ((now() at time zone 'Europe/Warsaw')::date),
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

comment on table public.calendar_pages is 'Kartki z kalendarza zerwane przez właściciela konta.';

alter table public.calendar_pages enable row level security;

create policy "Właściciel czyta swoje kartki"
  on public.calendar_pages for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Właściciel zrywa kartki"
  on public.calendar_pages for insert to authenticated
  with check ((select auth.uid()) = user_id);


-- Issues of the weekly email: one row per Monday, so a retried cron never sends twice.
create table public.bulletin_issues (
  week date primary key,
  recipients int not null default 0,
  sent int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.bulletin_issues enable row level security;
revoke all on table public.bulletin_issues from anon, authenticated;


-- Mapa obserwacji: sightings per voivodeship and species. Region is null when not given.
create or replace function public.sightings_map()
returns table (region text, species text, n bigint)
language sql
stable
set search_path = ''
as $$
  select s.region, s.species, count(*) as n
  from public.sightings s
  group by 1, 2;
$$;


-- Tablica Honorowa: only accounts that opted in and have a nickname.
create or replace function public.honor_board()
returns jsonb
language sql
stable
set search_path = ''
as $$
  with visible as (
    select id, nickname from public.profiles where honor and nickname is not null
  ),
  observers as (
    select v.nickname, count(distinct s.species) as species, count(*) as sightings
    from public.sightings s
    join visible v on v.id = s.user_id
    group by v.id, v.nickname
    order by species desc, sightings desc, v.nickname
    limit 10
  ),
  jurors as (
    select v.nickname, count(*) as votes
    from public.verdicts d
    join visible v on v.id = d.user_id
    group by v.id, v.nickname
    order by votes desc, v.nickname
    limit 10
  ),
  islands as (
    select user_id, day, day - (row_number() over (partition by user_id order by day))::int as streak
    from public.calendar_pages
  ),
  runs as (
    select user_id, count(*) as length from islands group by user_id, streak
  ),
  calendar as (
    select v.nickname, (select count(*) from public.calendar_pages c where c.user_id = v.id) as pages, max(r.length) as best
    from runs r
    join visible v on v.id = r.user_id
    group by v.id, v.nickname
    order by best desc, pages desc, v.nickname
    limit 10
  )
  select jsonb_build_object(
    'observers', coalesce((select jsonb_agg(to_jsonb(o)) from observers o), '[]'::jsonb),
    'jurors', coalesce((select jsonb_agg(to_jsonb(j)) from jurors j), '[]'::jsonb),
    'calendar', coalesce((select jsonb_agg(to_jsonb(c)) from calendar c), '[]'::jsonb),
    'visible', (select count(*) from visible)
  );
$$;


-- Biuletyn tygodniowy: the last seven days in one call.
create or replace function public.weekly_summary()
returns jsonb
language sql
stable
set search_path = ''
as $$
  with since as (select now() - interval '7 days' as at),
  r as (select score, species, proxy from public.results, since where created_at > since.at),
  s as (select species, region, user_id from public.sightings, since where created_at > since.at),
  v as (select case_slug, verdict from public.verdicts, since where created_at > since.at)
  select jsonb_build_object(
    'results', jsonb_build_object(
      'total', (select count(*) from r),
      'average', coalesce((select round(avg(score)::numeric, 1) from r), 0),
      'clinical', (select count(*) from r where score >= 75),
      'species', coalesce((select jsonb_object_agg(key, n) from (select unnest(species) as key, count(*) as n from r group by 1) x), '{}'::jsonb)
    ),
    'sightings', jsonb_build_object(
      'total', (select count(*) from s),
      'observers', (select count(distinct user_id) from s),
      'species', coalesce((select jsonb_object_agg(species, n) from (select species, count(*) as n from s group by 1) x), '{}'::jsonb),
      'regions', coalesce((select jsonb_object_agg(region, n) from (select region, count(*) as n from s where region is not null group by 1) x), '{}'::jsonb)
    ),
    'verdicts', jsonb_build_object(
      'total', (select count(*) from v),
      'cases', coalesce((
        select jsonb_object_agg(case_slug, counts) from (
          select case_slug, jsonb_object_agg(verdict, n) as counts
          from (select case_slug, verdict, count(*) as n from v group by 1, 2) c
          group by 1
        ) x
      ), '{}'::jsonb)
    ),
    'accounts', (select count(*) from public.profiles, since where created_at > since.at),
    'pages', (select count(*) from public.calendar_pages, since where created_at > since.at),
    'tallies', coalesce((
      select jsonb_object_agg(kind, n) from (
        select kind, sum(n) as n from public.tallies
        where day > (now() at time zone 'Europe/Warsaw')::date - 7
        group by 1
      ) t
    ), '{}'::jsonb)
  );
$$;


-- Who gets the weekly email: opted in, with a confirmed address, plus a few personal figures.
-- Security definer: it reads auth.users, which only the server may see.
create or replace function public.newsletter_recipients()
returns table (id uuid, email text, nickname text, results bigint, sightings_week bigint, verdicts bigint, pages_week bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    u.email::text,
    p.nickname,
    (select count(*) from public.saved_results r where r.user_id = p.id),
    (select count(*) from public.sightings s where s.user_id = p.id and s.created_at > now() - interval '7 days'),
    (select count(*) from public.verdicts v where v.user_id = p.id),
    (select count(*) from public.calendar_pages c where c.user_id = p.id and c.created_at > now() - interval '7 days')
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.newsletter and u.email is not null and u.email_confirmed_at is not null;
$$;

revoke all on function public.sightings_map() from public, anon, authenticated;
revoke all on function public.honor_board() from public, anon, authenticated;
revoke all on function public.weekly_summary() from public, anon, authenticated;
revoke all on function public.newsletter_recipients() from public, anon, authenticated;
grant execute on function public.sightings_map() to service_role;
grant execute on function public.honor_board() to service_role;
grant execute on function public.weekly_summary() to service_role;
grant execute on function public.newsletter_recipients() to service_role;
