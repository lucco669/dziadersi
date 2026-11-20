import "server-only";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import type { FamilyGroup, GroupEntry, PrivateGroup } from "./family";
import { isFamilyId } from "./write-policy";

type GroupRow = { id: string; expires_at: string; kind?: string; name?: string | null; departments?: string[] | null };
type MemberRow = { code: string; nickname?: string | null; department?: number | null };

/**
 * A family or a team, by its invitation id. Reads every column, so families keep loading before
 * the team migration has run (the columns are then missing and the group is a family).
 */
export async function getGroup(id: string): Promise<PrivateGroup | null> {
  if (!isFamilyId(id)) return null;
  if (!hasAdmin) throw new Error("Family groups unavailable");
  const db = createAdminClient();
  const { data, error } = await db.from("family_groups").select("*").eq("id", id).gt("expires_at", new Date().toISOString()).maybeSingle();
  if (error) throw new Error("Family groups unavailable");
  if (!data) return null;
  const group = data as GroupRow;
  const { data: members, error: memberError } = await db.from("family_members").select("*").eq("group_id", id).order("joined_at").order("attempt");
  if (memberError) throw new Error("Family groups unavailable");
  const entries: GroupEntry[] = ((members ?? []) as MemberRow[]).map((member) => ({
    code: member.code,
    nickname: member.nickname ?? null,
    department: member.department ?? null,
  }));
  return {
    id: group.id,
    expires: group.expires_at,
    codes: entries.map((entry) => entry.code),
    kind: group.kind === "team" ? "team" : "family",
    name: group.name ?? null,
    departments: group.departments ?? [],
    entries,
  };
}

/** What the family pages and their polling need, exactly as before teams existed. */
export const familyView = ({ id, expires, codes }: PrivateGroup): FamilyGroup => ({ id, expires, codes });
