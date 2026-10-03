import { addTally, isTallyKind } from "@/lib/community";
import { limitWrite } from "@/lib/write-limit";
import { readWriteBody } from "@/lib/write-policy";

/** One more of something for the Mały Rocznik Statystyczny. Sent with sendBeacon, so the body is text. */
export async function POST(request: Request) {
  const rejected = await limitWrite(request, "tallies");
  if (rejected) return rejected;
  const kind = (await readWriteBody(request))?.kind;
  if (!isTallyKind(kind)) return new Response(null, { status: 400 });
  await addTally(kind);
  return new Response(null, { status: 204 });
}
