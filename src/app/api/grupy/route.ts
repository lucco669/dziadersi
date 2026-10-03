import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { validFamilyCode } from "@/lib/family";
import { limitWrite } from "@/lib/write-limit";
import { isAttemptId, readWriteBody } from "@/lib/write-policy";

export async function POST(request: Request) {
  const rejected = await limitWrite(request, "family-create");
  if (rejected) return rejected;
  const body = await readWriteBody(request);
  const code = validFamilyCode(body?.code);
  if (!code || !isAttemptId(body?.attempt)) return new Response(null, { status: 400 });
  const id = randomBytes(16).toString("hex");
  const { error } = await createAdminClient().rpc("create_family_group", { p_group: id, p_attempt: body.attempt, p_code: code });
  if (error) return new Response(null, { status: 503 });
  return Response.json({ id, path: `/grupy/${id}` }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
