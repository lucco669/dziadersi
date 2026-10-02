import { caseBySlug, VERDICTS, type Verdict } from "@/content/cases";
import { caseTally } from "@/lib/community";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

type Body = { slug?: unknown; verdict?: unknown };

/**
 * A lay judge's vote in the Komisja Orzekająca. Anonymous votes are allowed (the browser keeps
 * track of them); a signed-in judge votes once per case. Answers with the fresh counts.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(null, { status: 400 });
  }
  const item = typeof body.slug === "string" ? caseBySlug(body.slug) : undefined;
  const verdict = VERDICTS.find((option) => option.key === body.verdict)?.key as Verdict | undefined;
  if (!item || !verdict) return new Response(null, { status: 400 });
  if (!hasAdmin) return new Response(null, { status: 503 });

  const user = hasAuth ? (await currentUser()).user : null;
  const { error } = await createAdminClient()
    .from("verdicts")
    .insert({ case_slug: item.slug, verdict, user_id: user?.id ?? null });
  // 23505: this judge has already voted on the case. Not an error worth showing.
  if (error && error.code !== "23505") {
    console.error("Komisja:", error.message);
    return new Response(null, { status: 500 });
  }

  return Response.json({ counts: (await caseTally(item.slug)) ?? {}, repeated: error?.code === "23505" });
}
