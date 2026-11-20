-- Badanie okresowe zespołu: the private family group, generalised to an office team.
-- Additive. Apply before deploying the team pages (/zespol). Family invitations keep their
-- table, their limit of 12, their functions and their behaviour; old rows become kind 'family'.
--
-- A team has a name (1–60 characters), up to 8 departments (1–32 characters each, distinct
-- regardless of case) and up to 50 members. Every team member has a nickname (1–24 characters,
-- unique in the team regardless of case) and, when the team has departments, one of them (its
-- position in the array, from 0). Teams expire after 90 days like families, and the daily
-- cleanup (/api/cron/porzadki) deletes every expired row of family_groups, teams included.
begin;

create function public.valid_departments(p_departments text[])
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(cardinality(p_departments), 0) <= 8
    and not exists (select 1 from unnest(p_departments) d where d is null or length(btrim(d)) not between 1 and 32 or d <> btrim(d))
    and (select count(distinct lower(d)) from unnest(p_departments) d) = coalesce(cardinality(p_departments), 0);
$$;

alter table public.family_groups
  add column kind text not null default 'family' check (kind in ('family', 'team')),
  add column name text,
  add column departments text[] not null default '{}' check (public.valid_departments(departments)),
  add constraint family_groups_kind_shape check (
    (kind = 'family' and name is null and cardinality(departments) = 0)
    or (kind = 'team' and name = btrim(name) and length(name) between 1 and 60)
  );

alter table public.family_members
  add column nickname text check (nickname is null or (nickname = btrim(nickname) and length(nickname) between 1 and 24)),
  add column department smallint check (department is null or department between 0 and 7);
create unique index family_members_nickname_idx on public.family_members (group_id, lower(nickname)) where nickname is not null;

create function public.group_limit(p_kind text)
returns integer language sql immutable set search_path = '' as $$
  select case p_kind when 'team' then 50 else 12 end;
$$;

-- One join for both kinds. A row lock on the group serializes joins, including the last slot.
-- 'missing' (unknown or expired), 'repeated' (this attempt is already in), 'full', 'invalid'
-- (a team join without a nickname or with a department the team doesn't have), 'taken'
-- (the nickname is in use in this team), 'joined'. Families ignore nickname and department.
create function public.join_group(p_group text, p_attempt uuid, p_code text, p_nickname text, p_department smallint)
returns text language plpgsql set search_path = '' as $$
declare
  g_kind text;
  g_departments text[];
  clean text := btrim(p_nickname);
begin
  select kind, departments into g_kind, g_departments from public.family_groups where id = p_group and expires_at > now() for update;
  if not found then return 'missing'; end if;
  if exists (select 1 from public.family_members where group_id = p_group and attempt = p_attempt) then return 'repeated'; end if;
  if (select count(*) from public.family_members where group_id = p_group) >= public.group_limit(g_kind) then return 'full'; end if;
  if g_kind = 'family' then
    insert into public.family_members(group_id, attempt, code) values (p_group, p_attempt, p_code);
    return 'joined';
  end if;
  if clean is null or length(clean) not between 1 and 24 then return 'invalid'; end if;
  if cardinality(g_departments) = 0 and p_department is not null then return 'invalid'; end if;
  if cardinality(g_departments) > 0 and (p_department is null or p_department < 0 or p_department >= cardinality(g_departments)) then return 'invalid'; end if;
  if exists (select 1 from public.family_members where group_id = p_group and lower(nickname) = lower(clean)) then return 'taken'; end if;
  insert into public.family_members(group_id, attempt, code, nickname, department) values (p_group, p_attempt, p_code, clean, p_department);
  return 'joined';
end $$;

-- The family join, as deployed code calls it, now goes through join_group.
create or replace function public.join_family_group(p_group text, p_attempt uuid, p_code text)
returns text language plpgsql set search_path = '' as $$
begin
  return public.join_group(p_group, p_attempt, p_code, null, null);
end $$;

-- A team, optionally with the person who ordered the check-up as its first member, in one
-- transaction: a first member the team would refuse rolls the team back too.
create function public.create_team_group(
  p_group text, p_name text, p_departments text[],
  p_attempt uuid, p_code text, p_nickname text, p_department smallint
)
returns text language plpgsql set search_path = '' as $$
declare status text;
begin
  delete from public.family_groups where expires_at <= now();
  insert into public.family_groups(id, kind, name, departments) values (p_group, 'team', btrim(p_name), coalesce(p_departments, '{}'));
  if p_code is null then return 'created'; end if;
  status := public.join_group(p_group, p_attempt, p_code, p_nickname, p_department);
  if status <> 'joined' then raise exception 'team member refused: %', status; end if;
  return 'created';
end $$;

revoke all on function public.valid_departments(text[]) from public, anon, authenticated;
revoke all on function public.group_limit(text) from public, anon, authenticated;
revoke all on function public.join_group(text,uuid,text,text,smallint) from public, anon, authenticated;
revoke all on function public.join_family_group(text,uuid,text) from public, anon, authenticated;
revoke all on function public.create_team_group(text,text,text[],uuid,text,text,smallint) from public, anon, authenticated;
grant execute on function public.valid_departments(text[]) to service_role;
grant execute on function public.group_limit(text) to service_role;
grant execute on function public.join_group(text,uuid,text,text,smallint) to service_role;
grant execute on function public.join_family_group(text,uuid,text) to service_role;
grant execute on function public.create_team_group(text,text,text[],uuid,text,text,smallint) to service_role;
commit;
