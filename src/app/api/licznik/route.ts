import { addTally, isTallyKind } from "@/lib/community";

/** One more of something for the Mały Rocznik Statystyczny. Sent with sendBeacon, so the body is text. */
export async function POST(request: Request) {
  let kind: unknown;
  try {
    kind = (JSON.parse(await request.text()) as { kind?: unknown }).kind;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isTallyKind(kind)) return new Response(null, { status: 400 });
  await addTally(kind);
  return new Response(null, { status: 204 });
}
