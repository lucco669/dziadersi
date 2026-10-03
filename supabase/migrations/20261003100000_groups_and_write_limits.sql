-- Additive migration. Apply before deploying the accompanying API changes.
begin;

alter table public.results add column submission_key text;
create unique index results_submission_key_idx on public.results (submission_key);

create table public.write_budgets (
  scope text not null,
  key text not null,
  window_start timestamptz not null,
  hits integer not null,
  primary key (scope, key, window_start)
);
create index write_budgets_expiry_idx on public.write_budgets(window_start);
alter table public.write_budgets enable row level security;
revoke all on public.write_budgets from anon, authenticated;

create function public.take_write_budget(p_scope text, p_key text, p_limit integer)
returns boolean language plpgsql set search_path = '' as $$
declare n integer; bucket timestamptz;
begin
  if p_limit < 1 or p_limit > 1000 or length(p_key) <> 64 then return false; end if;
  bucket := to_timestamp(floor(extract(epoch from now()) / 600) * 600);
  delete from public.write_budgets where window_start < now() - interval '1 day';
  insert into public.write_budgets as b (scope, key, window_start, hits)
    values (p_scope, p_key, bucket, 1)
    on conflict (scope, key, window_start) do update set hits = b.hits + 1
    where b.hits < p_limit returning hits into n;
  return n is not null;
end $$;

create table public.family_groups (
  id text primary key check (id ~ '^[0-9a-f]{32}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create table public.family_members (
  group_id text not null references public.family_groups(id) on delete cascade,
  attempt uuid not null,
  code text not null check (length(code) between 10 and 200),
  joined_at timestamptz not null default now(),
  primary key (group_id, attempt)
);
create index family_groups_expiry_idx on public.family_groups(expires_at);
alter table public.family_groups enable row level security;
alter table public.family_members enable row level security;
revoke all on public.family_groups, public.family_members from anon, authenticated;

-- A row lock serializes joins, including concurrent requests for the final slot.
create function public.join_family_group(p_group text, p_attempt uuid, p_code text)
returns text language plpgsql set search_path = '' as $$
begin
  perform 1 from public.family_groups where id = p_group and expires_at > now() for update;
  if not found then return 'missing'; end if;
  if exists (select 1 from public.family_members where group_id = p_group and attempt = p_attempt) then return 'repeated'; end if;
  if (select count(*) from public.family_members where group_id = p_group) >= 12 then return 'full'; end if;
  insert into public.family_members(group_id, attempt, code) values (p_group, p_attempt, p_code);
  return 'joined';
end $$;

create function public.create_family_group(p_group text, p_attempt uuid, p_code text)
returns text language plpgsql set search_path = '' as $$
begin
  delete from public.family_groups where expires_at <= now();
  insert into public.family_groups(id) values (p_group);
  insert into public.family_members(group_id, attempt, code) values (p_group, p_attempt, p_code);
  return p_group;
end $$;

revoke all on function public.take_write_budget(text,text,integer) from public, anon, authenticated;
revoke all on function public.join_family_group(text,uuid,text) from public, anon, authenticated;
revoke all on function public.create_family_group(text,uuid,text) from public, anon, authenticated;
grant execute on function public.take_write_budget(text,text,integer) to service_role;
grant execute on function public.join_family_group(text,uuid,text) to service_role;
grant execute on function public.create_family_group(text,uuid,text) to service_role;
grant all on public.write_budgets, public.family_groups, public.family_members to service_role;
commit;
