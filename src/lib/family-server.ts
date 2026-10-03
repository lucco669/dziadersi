import "server-only";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import type { FamilyGroup } from "./family";
import { isFamilyId } from "./write-policy";

export async function getFamily(id: string): Promise<FamilyGroup | null> {
  if (!isFamilyId(id)) return null;
  if (!hasAdmin) throw new Error("Family groups unavailable");
  const db = createAdminClient();
  const { data: group, error } = await db.from("family_groups").select("id,expires_at").eq("id", id).gt("expires_at", new Date().toISOString()).maybeSingle();
  if (error) throw new Error("Family groups unavailable");
  if (!group) return null;
  const { data: members, error: memberError } = await db.from("family_members").select("code").eq("group_id", id).order("joined_at").order("attempt");
  if (memberError) throw new Error("Family groups unavailable");
  return { id: group.id, expires: group.expires_at, codes: (members ?? []).map((member) => member.code) };
}
