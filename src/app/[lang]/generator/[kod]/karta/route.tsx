import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { decodeLine } from "@/lib/phrasebook";
import { lineStory, storyResponse } from "@/lib/story-cards";

/** A Rozmówki line as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/generator/[kod]/karta">) {
  const { lang, kod } = await params;
  const line = hasLocale(lang) ? decodeLine(kod, lang) : null;
  if (!hasLocale(lang) || !line) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return storyResponse(request.nextUrl.searchParams, (format) => lineStory(line, lang, format), {
    file: `${lang === "sl" ? "pogovornik" : "rozmowki"}-${line.code}`,
  });
}
