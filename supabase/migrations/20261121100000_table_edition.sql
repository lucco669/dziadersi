-- Badanie przy stole: results of the short form IBD-T2S (code version 3) go into the census.
-- Additive. Apply before deploying the table mode, or its results are rejected by the check below
-- (the page still works; /api/wyniki answers 503 and analytics records "Spis: zapis odrzucony").
--
-- What counts where:
-- * census_summary() (totals, zones, species, hybrids, hours, voivodeships) counts every result:
--   a short-form score is a percentage of its own maximum and names the same ten species.
-- * answer_counts() stays IBD-T2 only, as it always was (where r.version = 2): its task numbers
--   are positions in IBD-T2, and a short code stores six answers in a different order.
-- * score_histogram() becomes IBD-T2 only: it gives IBD-T2 result pages their real percentile,
--   and six answers spread wider than sixteen.
begin;

alter table public.results drop constraint results_version_check;
alter table public.results add constraint results_version_check check (version in (1, 2, 3));

create or replace function public.score_histogram()
returns table (score int, n bigint)
language sql
stable
set search_path = ''
as $$
  select score::int, count(*) as n
  from public.results
  where version = 2
  group by 1;
$$;

revoke all on function public.score_histogram() from public, anon, authenticated;
grant execute on function public.score_histogram() to service_role;

commit;
