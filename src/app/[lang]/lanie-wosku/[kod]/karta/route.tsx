import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { storyResponse } from "@/lib/story-cards";
import { decodeReading } from "@/lib/wax";
import { waxStory } from "@/lib/wax-cards";

/** A reading as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/lanie-wosku/[kod]/karta">) {
  const { lang, kod } = await params;
  const reading = hasLocale(lang) ? decodeReading(kod, lang) : null;
  if (!hasLocale(lang) || !reading) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return storyResponse(request.nextUrl.searchParams, (format) => waxStory(reading, lang, format), {
    file: `${lang === "sl" ? "vlivanje-voska" : "lanie-wosku"}-${reading.code}`,
  });
}
