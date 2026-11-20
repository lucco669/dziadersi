import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { validFamilyCode } from "@/lib/family";
import { cleanDepartments, cleanNickname, cleanTeamName, validDepartment } from "@/lib/team";
import { limitWrite } from "@/lib/write-limit";
import { checkWriteRequest, isAttemptId, readWriteBody } from "@/lib/write-policy";

/** A family ranking (with the creator's result) or, with `kind: "team"`, an office team. */
export async function POST(request: Request) {
  const refused = checkWriteRequest(request);
  if (refused) return refused;
  const body = await readWriteBody(request);
  if (body?.kind === "team") return createTeam(request, body);
  const rejected = await limitWrite(request, "family-create");
  if (rejected) return rejected;
  const code = validFamilyCode(body?.code);
  if (!code || !isAttemptId(body?.attempt)) return new Response(null, { status: 400 });
  const id = randomBytes(16).toString("hex");
  const { error } = await createAdminClient().rpc("create_family_group", { p_group: id, p_attempt: body.attempt, p_code: code });
  if (error) return new Response(null, { status: 503 });
  return Response.json({ id, path: `/grupy/${id}` }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

/**
 * Name and departments, and optionally the person ordering it: a result code, a nickname and a
 * department, who then joins in the same transaction.
 */
async function createTeam(request: Request, body: Record<string, unknown>) {
  const rejected = await limitWrite(request, "team-create");
  if (rejected) return rejected;
  const name = cleanTeamName(body.name);
  const departments = cleanDepartments(body.departments);
  if (!name || !departments) return new Response(null, { status: 400 });
  let member = { p_attempt: null as string | null, p_code: null as string | null, p_nickname: null as string | null, p_department: null as number | null };
  if (body.code !== undefined) {
    const code = validFamilyCode(body.code);
    const nickname = cleanNickname(body.nickname);
    const department = validDepartment(body.department, departments);
    if (!code || !nickname || department === undefined || !isAttemptId(body.attempt)) return new Response(null, { status: 400 });
    member = { p_attempt: body.attempt, p_code: code, p_nickname: nickname, p_department: department };
  }
  const id = randomBytes(16).toString("hex");
  const { error } = await createAdminClient().rpc("create_team_group", { p_group: id, p_name: name, p_departments: departments, ...member });
  if (error) return new Response(null, { status: 503 });
  return Response.json({ id, path: `/zespol/${id}` }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
