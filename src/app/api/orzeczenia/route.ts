import { caseBySlug, caseKey, VERDICTS, type Verdict } from "@/content/cases";
import { caseTally } from "@/lib/community";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { limitWrite } from "@/lib/write-limit";
import { readWriteBody } from "@/lib/write-policy";

/**
 * A lay judge's vote in the Komisja Orzekająca. Anonymous votes are allowed (the browser keeps
 * track of them); a signed-in judge votes once per case. Answers with the fresh counts.
 * Both editions vote on the same case: it is stored under caseKey(), the Polish slug. The browser
 * sends that key; a Slovenian slug is accepted too and mapped to it.
 */
export async function POST(request: Request) {
  const rejected = await limitWrite(request, "verdicts");
  if (rejected) return rejected;
  const body = await readWriteBody(request);
  if (!body) return new Response(null, { status: 400 });
  const item = typeof body.slug === "string" ? (caseBySlug(body.slug, "pl") ?? caseBySlug(body.slug, "sl")) : undefined;
  const verdict = VERDICTS.find((option) => option.key === body.verdict)?.key as Verdict | undefined;
  if (!item || !verdict) return new Response(null, { status: 400 });
  if (!hasAdmin) return new Response(null, { status: 503 });
  const slug = caseKey(item);

  const user = hasAuth ? (await currentUser()).user : null;
  const { error } = await createAdminClient()
    .from("verdicts")
    .insert({ case_slug: slug, verdict, user_id: user?.id ?? null });
  // 23505: this judge has already voted on the case. Not an error worth showing.
  if (error && error.code !== "23505") {
    console.error("Komisja:", error.message);
    return new Response(null, { status: 500 });
  }

  return Response.json({ counts: (await caseTally(slug)) ?? {}, repeated: error?.code === "23505" });
}
