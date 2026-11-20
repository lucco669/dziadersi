import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { wishImage } from "@/lib/wish-cards";
import { decodeWish } from "@/lib/wishes";

const COPY = defineCopy({
  pl: { file: "zyczenia-od-instytutu", story: "relacja", post: "post" },
  sl: { file: "voscilo-instituta", story: "zgodba", post: "objava" },
});

/** The whole letter as a PNG: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/zyczenia/[kod]/kartka">) {
  const { lang, kod } = await params;
  const card = hasLocale(lang) ? decodeWish(kod, lang) : null;
  if (!hasLocale(lang) || !card) return new Response("Nie znaleziono", { status: 404 });

  const t = COPY[lang];
  const story = request.nextUrl.searchParams.get("format") === "relacja";
  const headers: Record<string, string> = {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${t.file}-${card.code}-${story ? t.story : t.post}.png"`;
  }
  return wishImage(card, story ? "story" : "post", lang, headers);
}
