import { familyView, getGroup } from "@/lib/family-server";
import { validFamilyCode } from "@/lib/family";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanNickname, teamView } from "@/lib/team";
import { limitWrite } from "@/lib/write-limit";
import { checkWriteRequest, isAttemptId, isFamilyId, readWriteBody } from "@/lib/write-policy";

type Context = { params: Promise<{ id: string }> };
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };

/** Families get their list of codes, as before; teams their name, departments and nicknames. */
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const group = await getGroup(id);
    if (!group) return new Response(null, { status: 404, headers });
    return Response.json(group.kind === "team" ? teamView(group) : familyView(group), { headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}

/**
 * Joining. A team member also sends a nickname and, when the team has departments, the index of
 * one; the database checks both against the team (`join_group`). Families send neither.
 */
export async function POST(request: Request, { params }: Context) {
  const refused = checkWriteRequest(request);
  if (refused) return refused;
  const body = await readWriteBody(request);
  const team = body?.nickname !== undefined;
  const rejected = await limitWrite(request, team ? "team-join" : "family-join");
  if (rejected) return rejected;
  const { id } = await params;
  const code = validFamilyCode(body?.code);
  if (!isFamilyId(id) || !code || !isAttemptId(body?.attempt)) return new Response(null, { status: 400 });
  const db = createAdminClient();
  const department = body?.department;
  if (team && department !== null && department !== undefined && !(typeof department === "number" && Number.isInteger(department) && department >= 0 && department < 8)) {
    return new Response(null, { status: 400 });
  }
  const { data, error } = team
    ? await db.rpc("join_group", { p_group: id, p_attempt: body.attempt, p_code: code, p_nickname: cleanNickname(body.nickname) || null, p_department: department ?? null })
    : await db.rpc("join_family_group", { p_group: id, p_attempt: body.attempt, p_code: code });
  if (error) return new Response(null, { status: 503 });
  if (data === "missing") return new Response(null, { status: 404 });
  if (data === "full" || data === "taken") return Response.json({ status: data }, { status: 409, headers });
  if (data === "invalid") return Response.json({ status: data }, { status: 422, headers });
  if (data !== "joined" && data !== "repeated") return new Response(null, { status: 503 });
  return Response.json({ path: team ? `/zespol/${id}` : `/grupy/${id}` }, { headers });
}
