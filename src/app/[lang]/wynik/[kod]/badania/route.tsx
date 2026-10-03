import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { labImage } from "@/lib/lab-image";
import { decodeResult, evaluate } from "@/lib/test";

const COPY = defineCopy({
  pl: { file: "wyniki-badan-dziadersa" },
  sl: { file: "laboratorijski-izvidi-dziadersa" },
});

/** PNG lab printout (4:5); ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/wynik/[kod]/badania">) {
  const { lang, kod } = await params;
  const draft = decodeResult(kod);
  if (!hasLocale(lang) || !draft) return new Response("Nie znaleziono", { status: 404 });

  const result = evaluate(draft, lang);
  const headers: Record<string, string> = {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${COPY[lang].file}-${result.score}.png"`;
  }
  return labImage(result, lang, headers);
}
