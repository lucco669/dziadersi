-- Dziaderskie Słowo Roku: one vote per browser and per account each year.
-- Additive migration. Run it in the SQL Editor before the voting opens (1 December 2026).
-- Votes are written by the server only (it checks the phrase is on the shortlist and the
-- voting is open), through cast_word_vote(); nobody can read individual votes but the server.
begin;

create table public.word_votes (
  id bigint generated always as identity primary key,
  year smallint not null check (year between 2026 and 2100),
  phrase text not null check (phrase ~ '^[a-z0-9-]{2,60}$'),
  -- A random identifier the browser keeps; not linked to anything else.
  browser_key uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.word_votes is 'Głosy w plebiscycie Dziaderskie Słowo Roku. Jeden na przeglądarkę i na konto w danym roku.';

create unique index word_votes_browser_idx on public.word_votes (year, browser_key);
create unique index word_votes_user_idx on public.word_votes (year, user_id) where user_id is not null;
create index word_votes_phrase_idx on public.word_votes (year, phrase);

alter table public.word_votes enable row level security;
revoke all on table public.word_votes from anon, authenticated;

-- Casts a vote. 'counted' with the phrase, or 'repeated' with the phrase this browser or
-- account voted for earlier (the earlier vote stands).
create function public.cast_word_vote(p_year smallint, p_phrase text, p_browser uuid, p_user uuid)
returns table (result text, recorded text)
language plpgsql
set search_path = ''
as $$
declare earlier text;
begin
  insert into public.word_votes (year, phrase, browser_key, user_id)
    values (p_year, p_phrase, p_browser, p_user)
    on conflict do nothing;
  if found then
    return query select 'counted'::text, p_phrase;
    return;
  end if;
  select v.phrase into earlier
    from public.word_votes v
    where v.year = p_year and (v.browser_key = p_browser or (p_user is not null and v.user_id = p_user))
    order by v.id
    limit 1;
  return query select 'repeated'::text, earlier;
end $$;

-- Votes per phrase in one year.
create function public.word_tally(p_year smallint)
returns table (phrase text, n bigint)
language sql
stable
set search_path = ''
as $$
  select v.phrase, count(*) as n
  from public.word_votes v
  where v.year = p_year
  group by 1;
$$;

revoke all on function public.cast_word_vote(smallint, text, uuid, uuid) from public, anon, authenticated;
revoke all on function public.word_tally(smallint) from public, anon, authenticated;
grant execute on function public.cast_word_vote(smallint, text, uuid, uuid) to service_role;
grant execute on function public.word_tally(smallint) to service_role;
grant all on public.word_votes to service_role;

commit;
