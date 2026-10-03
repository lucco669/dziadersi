import { REGIONS } from "@/content/regions";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { dayNumber, decodeResult, encodeResult, evaluate } from "@/lib/test";
import { limitWrite } from "@/lib/write-limit";
import { isAttemptId, readWriteBody } from "@/lib/write-policy";

/**
 * A finished test, sent by the test page. Goes into the anonymous census (code without the
 * name, with a per-examination retry key) and, for a signed-in visitor, into their Profil Dziaderski.
 */
export async function POST(request: Request) {
  const rejected = await limitWrite(request, "results");
  if (rejected) return rejected;
  const body = await readWriteBody(request);
  if (!body || !isAttemptId(body.attempt)) return new Response(null, { status: 400 });

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
        .upsert({
          submission_key: body.attempt,
          code: encodeResult({ ...draft, name: "" }),
          version: draft.version,
          proxy: result.proxy,
          score: result.score,
          species: result.diagnosis.species.map((species) => species.key),
          answers: draft.answers,
          region,
          retake: previous !== null,
          previous_score: previous,
        }, { onConflict: "submission_key", ignoreDuplicates: true })
        .then(({ error }) => { if (error) throw error; }),
    );
  }
  if (hasAuth) {
    const { supabase, user } = await currentUser();
    if (user) {
      writes.push(
        supabase
          .from("saved_results")
          .upsert({ user_id: user.id, code: result.code }, { onConflict: "user_id,code", ignoreDuplicates: true })
          .then(({ error }) => { if (error) throw error; }),
      );
    }
  }
  try {
    await Promise.all(writes);
  } catch {
    return new Response(null, { status: 503 });
  }

  return new Response(null, { status: 204 });
}
