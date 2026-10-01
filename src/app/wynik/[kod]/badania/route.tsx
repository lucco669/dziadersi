import type { NextRequest } from "next/server";
import { labImage } from "@/lib/lab-image";
import { decodeResult, evaluate } from "@/lib/test";

/** PNG lab printout (4:5); ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/wynik/[kod]/badania">) {
  const { kod } = await params;
  const draft = decodeResult(kod);
  if (!draft) return new Response("Nie znaleziono", { status: 404 });

  const result = evaluate(draft);
  const headers: Record<string, string> = {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="wyniki-badan-dziadersa-${result.score}.png"`;
  }
  return labImage(result, headers);
}
