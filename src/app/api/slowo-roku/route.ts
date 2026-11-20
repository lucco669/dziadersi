import { isNominee, WORD_OF_YEAR } from "@/content/word-of-year";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { phaseAt, totalOf, wordClock } from "@/lib/word-of-year";
import { readWordTally } from "@/lib/word-of-year.server";
import { limitWrite } from "@/lib/write-limit";
import { isAttemptId, readWriteBody } from "@/lib/write-policy";

/**
 * A vote for the Dziaderskie Słowo Roku. The browser sends the Polish slug of the phrase and its own
 * random key; a signed-in voter is also recognised by the account. One vote per browser and per
 * account: a repeated vote is not counted, and the answer names the phrase that was.
 * Answers with the number of votes, and the votes per phrase once there are enough to publish.
 */
export async function POST(request: Request) {
  const rejected = await limitWrite(request, "words");
  if (rejected) return rejected;
  if (phaseAt(wordClock()) !== "voting") return Response.json({ status: "closed" }, { status: 409 });
  const body = await readWriteBody(request);
  if (!body || !isNominee(body.phrase) || !isAttemptId(body.key)) return new Response(null, { status: 400 });
  if (!hasAdmin) return new Response(null, { status: 503 });

  const user = hasAuth ? (await currentUser()).user : null;
  const { data, error } = await createAdminClient().rpc("cast_word_vote", {
    p_year: WORD_OF_YEAR.year,
    p_phrase: body.phrase,
    p_browser: body.key,
    p_user: user?.id ?? null,
  });
  if (error) {
    console.error("Słowo Roku:", error.message);
    return new Response(null, { status: 500 });
  }
  const [row] = data as { result: "counted" | "repeated"; recorded: string | null }[];
  const tally = await readWordTally();
  const total = tally ? totalOf(tally) : null;
  return Response.json({
    status: row.result,
    phrase: row.recorded ?? body.phrase,
    total,
    tally: total !== null && total >= WORD_OF_YEAR.standingsFrom ? tally : null,
  });
}
