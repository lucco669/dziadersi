import { getFamily } from "@/lib/family-server";
import { validFamilyCode } from "@/lib/family";
import { createAdminClient } from "@/lib/supabase/admin";
import { limitWrite } from "@/lib/write-limit";
import { isAttemptId, isFamilyId, readWriteBody } from "@/lib/write-policy";

type Context = { params: Promise<{ id: string }> };
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const group = await getFamily(id);
    return group ? Response.json(group, { headers }) : new Response(null, { status: 404, headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}

export async function POST(request: Request, { params }: Context) {
  const rejected = await limitWrite(request, "family-join");
  if (rejected) return rejected;
  const { id } = await params;
  const body = await readWriteBody(request);
  const code = validFamilyCode(body?.code);
  if (!isFamilyId(id) || !code || !isAttemptId(body?.attempt)) return new Response(null, { status: 400 });
  const { data, error } = await createAdminClient().rpc("join_family_group", { p_group: id, p_attempt: body.attempt, p_code: code });
  if (error) return new Response(null, { status: 503 });
  if (data === "missing") return new Response(null, { status: 404 });
  if (data === "full") return new Response(null, { status: 409 });
  if (data !== "joined" && data !== "repeated") return new Response(null, { status: 503 });
  return Response.json({ path: `/grupy/${id}` }, { headers });
}
