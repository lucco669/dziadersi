import type { NextRequest } from "next/server";
import { caseBySlug } from "@/content/cases";
import { hasLocale } from "@/i18n/config";
import { caseStory, storyResponse } from "@/lib/story-cards";

/** A case as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/czy-to-juz-dziaderstwo/[slug]/karta">) {
  const { lang, slug } = await params;
  const item = hasLocale(lang) ? caseBySlug(slug, lang) : undefined;
  if (!hasLocale(lang) || !item) return new Response("Nie znaleziono", { status: 404 });
  return storyResponse(request.nextUrl.searchParams, (format) => caseStory(item, lang, format), {
    file: `${lang === "sl" ? "primer" : "sprawa"}-${item.number}`,
    // Cases are edited now and then; a day is long enough.
    cache: "public, max-age=3600, s-maxage=86400",
  });
}
