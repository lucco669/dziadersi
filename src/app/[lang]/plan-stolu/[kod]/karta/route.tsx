import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { decodePlan } from "@/lib/seating";
import { SEATING_FORMAT_QUERY, seatingFile, seatingStory } from "@/lib/seating-cards";

/** The protocol as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/plan-stolu/[kod]/karta">) {
  const { lang, kod } = await params;
  const plan = decodePlan(kod);
  if (!hasLocale(lang) || !plan) return new Response("Nie znaleziono", { status: 404 });
  const search = request.nextUrl.searchParams;
  const format = search.get("format") === SEATING_FORMAT_QUERY.story ? "story" : "post";
  const headers: Record<string, string> = {};
  if (search.has("pobierz")) headers["content-disposition"] = `attachment; filename="${seatingFile(plan, lang, format)}"`;
  return seatingStory(plan, lang, format, headers);
}
