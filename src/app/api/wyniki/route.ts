import { REGIONS } from "@/content/regions";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { dayNumber, decodeResult, encodeResult, evaluate } from "@/lib/test";

type Body = { code?: unknown; region?: unknown; previous?: unknown };

/**
 * A finished test, sent by the test page. Goes into the anonymous census (code without the
 * name, no identifiers) and, for a signed-in visitor, into their Profil Dziaderski.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(null, { status: 400 });
  }

  const draft = typeof body.code === "string" ? decodeResult(body.code) : null;
  // Only fresh results of the current edition: a code from last month is a shared link, not a test.
  if (!draft || draft.version !== 2 || Math.abs(draft.day - dayNumber(new Date())) > 1) {
    return new Response(null, { status: 400 });
  }

  const result = evaluate(draft);
  const region = typeof body.region === "string" && body.region in REGIONS ? body.region : null;
  const previous =
    typeof body.previous === "number" && Number.isInteger(body.previous) && body.previous >= 0 && body.previous <= 100
      ? body.previous
      : null;

  const writes: PromiseLike<unknown>[] = [];
  if (hasAdmin) {
    writes.push(
      createAdminClient()
        .from("results")
        .insert({
          code: encodeResult({ ...draft, name: "" }),
          version: draft.version,
          proxy: result.proxy,
          score: result.score,
          species: result.diagnosis.species.map((species) => species.key),
          answers: draft.answers,
          region,
          retake: previous !== null,
          previous_score: previous,
        })
        .then(({ error }) => error && console.error("Spis:", error.message)),
    );
  }
  if (hasAuth) {
    const { supabase, user } = await currentUser();
    if (user) {
      writes.push(
        supabase
          .from("saved_results")
          .upsert({ user_id: user.id, code: result.code }, { onConflict: "user_id,code", ignoreDuplicates: true })
          .then(({ error }) => error && console.error("Profil:", error.message)),
      );
    }
  }
  await Promise.all(writes);

  return new Response(null, { status: 204 });
}
