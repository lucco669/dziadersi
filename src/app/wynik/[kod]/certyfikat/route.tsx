import type { NextRequest } from "next/server";
import { certificateImage } from "@/lib/certificate-image";
import { decodeResult, evaluate } from "@/lib/test";

/** PNG certificate: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/wynik/[kod]/certyfikat">) {
  const { kod } = await params;
  const draft = decodeResult(kod);
  if (!draft) return new Response("Nie znaleziono", { status: 404 });

  const result = evaluate(draft);
  const story = request.nextUrl.searchParams.get("format") === "relacja";
  const headers: Record<string, string> = {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] =
      `attachment; filename="certyfikat-dziadersa-${result.score}-${story ? "relacja" : "post"}.png"`;
  }

  return certificateImage(result, story ? "story" : "post", headers);
}
