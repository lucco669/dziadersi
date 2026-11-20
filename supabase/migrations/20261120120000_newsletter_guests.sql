-- Biuletyn tygodniowy without an account: an email address, the edition and a double opt-in.
--
-- A guest types an address; the server sends one letter with a signed confirm link and the
-- Monday bulletin starts only after the click. Unconfirmed addresses are deleted by the daily
-- cleanup (/api/cron/porzadki) after 7 days; unsubscribing deletes the row. Server only.
--
-- Additive. Run it before deploying the code that offers the guest form; until then the form
-- answers "Sekretariat nieczynny" and nothing else changes.
begin;

create table public.newsletter_guests (
  id uuid primary key default gen_random_uuid(),
  -- Lower-cased by the server before it gets here.
  email text not null check (char_length(email) between 6 and 254 and email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  edition text not null default 'pl' check (edition in ('pl', 'sl')),
  created_at timestamptz not null default now(),
  -- When the last confirm letter went out: at most one an hour per address.
  letter_at timestamptz,
  confirmed_at timestamptz
);

comment on table public.newsletter_guests is 'Biuletyn tygodniowy bez konta: adres, wydanie, podwójne potwierdzenie. Niepotwierdzone usuwane po 7 dniach.';

create unique index newsletter_guests_email_idx on public.newsletter_guests (email);
create index newsletter_guests_pending_idx on public.newsletter_guests (created_at) where confirmed_at is null;

alter table public.newsletter_guests enable row level security;
revoke all on table public.newsletter_guests from anon, authenticated;
grant all on public.newsletter_guests to service_role;


-- A guest asks for the bulletin. Returns the row's id when a confirm letter should go out now,
-- null when the address is already confirmed or got a letter within the hour (the caller answers
-- the same either way, so the form never tells whether an address is subscribed).
create function public.request_newsletter_guest(p_email text, p_edition text)
returns uuid
language plpgsql
set search_path = ''
as $$
declare guest uuid;
begin
  insert into public.newsletter_guests as g (email, edition, letter_at)
    values (p_email, p_edition, now())
  on conflict (email) do update set edition = excluded.edition, letter_at = now()
    where g.confirmed_at is null and (g.letter_at is null or g.letter_at < now() - interval '1 hour')
  returning id into guest;
  return guest;
end $$;

revoke all on function public.request_newsletter_guest(text, text) from public, anon, authenticated;
grant execute on function public.request_newsletter_guest(text, text) to service_role;


-- Who gets the weekly email: subscribed accounts as before, plus confirmed guests whose address
-- isn't already subscribed through an account. Guests have no figures of their own; `edition`
-- is theirs (accounts keep theirs in the auth metadata, read by the sender).
-- The return type changes, so the function is dropped and created again.
drop function public.newsletter_recipients();

create function public.newsletter_recipients()
returns table (id uuid, email text, nickname text, results bigint, sightings_week bigint, verdicts bigint, pages_week bigint, guest boolean, edition text)
language sql
stable
security definer
set search_path = ''
as $$
  with members as (
    select
      p.id,
      u.email::text as email,
      p.nickname,
      (select count(*) from public.saved_results r where r.user_id = p.id) as results,
      (select count(*) from public.sightings s where s.user_id = p.id and s.created_at > now() - interval '7 days') as sightings_week,
      (select count(*) from public.verdicts v where v.user_id = p.id) as verdicts,
      (select count(*) from public.calendar_pages c where c.user_id = p.id and c.created_at > now() - interval '7 days') as pages_week
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.newsletter and u.email is not null and u.email_confirmed_at is not null
  )
  select id, email, nickname, results, sightings_week, verdicts, pages_week, false, null::text from members
  union all
  select g.id, g.email, null, 0, 0, 0, 0, true, g.edition
  from public.newsletter_guests g
  where g.confirmed_at is not null
    and not exists (select 1 from members m where lower(m.email) = g.email);
$$;

revoke all on function public.newsletter_recipients() from public, anon, authenticated;
grant execute on function public.newsletter_recipients() to service_role;

commit;
