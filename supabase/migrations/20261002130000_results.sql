-- Narodowy Spis Dziadersów: anonymous test results.
--
-- A row is a finished test: its result code without the name part, what the code decodes to,
-- an optional voivodeship and the time. No names, no accounts, no IP addresses, no identifiers.
-- Only the server writes and reads this table (with the secret key); the public API sees nothing.

create table public.results (
  id bigint generated always as identity primary key,
  -- Result code without "~name": "2" + answers + date. Enough to recompute everything.
  code text not null check (char_length(code) between 10 and 40 and code !~ '~'),
  version smallint not null check (version in (1, 2)),
  -- Family interview: the answers describe someone else.
  proxy boolean not null default false,
  score smallint not null check (score between 0 and 100),
  -- Diagnosed Atlas species: one, two for a hybrid, none for Utajony and Pospolity.
  species text[] not null default '{}' check (cardinality(species) <= 2),
  -- One value per task, as in the code.
  answers smallint[] not null check (cardinality(answers) between 1 and 40),
  -- Voivodeship code from the test intro (ZP, MZ, …), when given.
  region text check (region is null or region ~ '^[A-Z]{2}$'),
  -- The same browser finished the test before; previous_score is that earlier result.
  retake boolean not null default false,
  previous_score smallint check (previous_score is null or previous_score between 0 and 100),
  created_at timestamptz not null default now()
);

comment on table public.results is 'Anonimowe wyniki Testu Dziadersa dla Narodowego Spisu Dziadersów. Bez imion i identyfikatorów.';

create index results_created_at_idx on public.results (created_at);
create index results_version_idx on public.results (version);

alter table public.results enable row level security;
-- No policies on purpose: anon and authenticated can neither read nor write.
revoke all on table public.results from anon, authenticated;


-- Everything the census page shows, in one call.
create or replace function public.census_summary()
returns jsonb
language sql
stable
set search_path = ''
as $$
  with r as (
    select
      score,
      species,
      proxy,
      region,
      retake,
      previous_score,
      created_at at time zone 'Europe/Warsaw' as local_at
    from public.results
  ),
  totals as (
    select
      count(*) as total,
      count(*) filter (where local_at::date = (now() at time zone 'Europe/Warsaw')::date) as today,
      coalesce(round(avg(score)::numeric, 1), 0) as average,
      count(*) filter (where proxy) as proxy,
      count(*) filter (where cardinality(species) = 0) as unspecified,
      count(*) filter (where cardinality(species) = 2) as hybrid,
      count(*) filter (where retake) as retakes,
      round(avg(score - previous_score) filter (where retake and previous_score is not null)::numeric, 1) as retake_change
    from r
  ),
  zones as (
    select coalesce(jsonb_object_agg(zone, n), '{}'::jsonb) as zones
    from (
      select case when score < 25 then 0 when score < 50 then 1 when score < 75 then 2 else 3 end as zone, count(*) as n
      from r
      group by 1
    ) z
  ),
  species as (
    select coalesce(jsonb_object_agg(key, n), '{}'::jsonb) as species
    from (
      select unnest(species) as key, count(*) as n
      from r
      group by 1
    ) s
  ),
  hybrids as (
    select coalesce(jsonb_agg(jsonb_build_object('pair', pair, 'n', n) order by n desc, pair), '[]'::jsonb) as hybrids
    from (
      select species[1] || '+' || species[2] as pair, count(*) as n
      from r
      where cardinality(species) = 2
      group by 1
    ) h
  ),
  hours as (
    select coalesce(jsonb_agg(jsonb_build_object('dow', dow, 'hour', hour, 'n', n, 'average', average)), '[]'::jsonb) as hours
    from (
      select
        extract(isodow from local_at)::int as dow,
        extract(hour from local_at)::int as hour,
        count(*) as n,
        round(avg(score)::numeric, 1) as average
      from r
      group by 1, 2
    ) t
  ),
  regions as (
    select coalesce(jsonb_object_agg(region, jsonb_build_object('n', n, 'average', average)), '{}'::jsonb) as regions
    from (
      select region, count(*) as n, round(avg(score)::numeric, 1) as average
      from r
      where region is not null
      group by 1
    ) g
  )
  select jsonb_build_object(
    'total', totals.total,
    'today', totals.today,
    'average', totals.average,
    'proxy', totals.proxy,
    'unspecified', totals.unspecified,
    'hybrid', totals.hybrid,
    'retakes', totals.retakes,
    'retakeChange', totals.retake_change,
    'zones', zones.zones,
    'species', species.species,
    'hybrids', hybrids.hybrids,
    'hours', hours.hours,
    'regions', regions.regions
  )
  from totals, zones, species, hybrids, hours, regions;
$$;

-- How often each answer was given, per task, for the current edition of the test (IBD-T2).
create or replace function public.answer_counts()
returns table (task int, value int, n bigint)
language sql
stable
set search_path = ''
as $$
  select (a.ord - 1)::int as task, a.value::int as value, count(*) as n
  from public.results r
  cross join lateral unnest(r.answers) with ordinality as a(value, ord)
  where r.version = 2
  group by 1, 2;
$$;

-- Scores of every result, for the real percentile on the result page.
create or replace function public.score_histogram()
returns table (score int, n bigint)
language sql
stable
set search_path = ''
as $$
  select score::int, count(*) as n
  from public.results
  group by 1;
$$;

revoke all on function public.census_summary() from public, anon, authenticated;
revoke all on function public.answer_counts() from public, anon, authenticated;
revoke all on function public.score_histogram() from public, anon, authenticated;
grant execute on function public.census_summary() to service_role;
grant execute on function public.answer_counts() to service_role;
grant execute on function public.score_histogram() to service_role;
