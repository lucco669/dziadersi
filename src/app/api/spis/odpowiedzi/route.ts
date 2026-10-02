import { getAnswerCounts } from "@/lib/census";

/** Answer counts per task, for the notes between rooms in the test. Cached at the edge for five minutes. */
export async function GET() {
  const counts = await getAnswerCounts();
  return Response.json(counts ?? {}, {
    headers: { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" },
  });
}
