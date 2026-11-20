import type { NextRequest } from "next/server";
import { getWordOfYear } from "@/content/word-of-year";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { formatDate } from "@/lib/typo";
import { wordCertificateImage } from "@/lib/word-cards";
import { verdictLine, wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";

const COPY = defineCopy({
  pl: { file: (year: number) => `dziaderskie-slowo-roku-${year}`, story: "relacja", post: "post" },
  sl: { file: (year: number) => `dziaderska-beseda-leta-${year}`, story: "zgodba", post: "objava" },
});

/** The announcement as a PNG: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz forces a download. 404 before the announcement. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/slowo-roku/certyfikat">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const state = await getWordState();
  if (!state.result) return new Response("Nie znaleziono", { status: 404 });

  const t = COPY[lang];
  const config = getWordOfYear(lang);
  const story = request.nextUrl.searchParams.get("format") === "relacja";
  const headers: Record<string, string> = { "cache-control": "public, max-age=3600, s-maxage=86400" };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${t.file(config.year)}-${story ? t.story : t.post}.png"`;
  }
  const date = formatDate(lang, config.announced);
  return wordCertificateImage(lang, wordEntry(state.result.winner, lang), verdictLine(state.result, lang), date, story ? "story" : "post", headers);
}
