import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { certificateImage } from "@/lib/certificate-image";
import { decodeResult, evaluate } from "@/lib/test";

const COPY = defineCopy({
  pl: { file: "certyfikat-dziadersa", story: "relacja", post: "post" },
  sl: { file: "certifikat-dziadersa", story: "zgodba", post: "objava" },
});

/** PNG certificate: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/wynik/[kod]/certyfikat">) {
  const { lang, kod } = await params;
  const draft = decodeResult(kod);
  if (!hasLocale(lang) || !draft) return new Response("Nie znaleziono", { status: 404 });

  const t = COPY[lang];
  const result = evaluate(draft, lang);
  const story = request.nextUrl.searchParams.get("format") === "relacja";
  const headers: Record<string, string> = {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${t.file}-${result.score}-${story ? t.story : t.post}.png"`;
  }

  return certificateImage(result, story ? "story" : "post", lang, headers);
}
