import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { decodeExam, evaluateExam } from "@/lib/exam";
import { examStory, storyResponse } from "@/lib/story-cards";

/** An exam result as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16); ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/egzamin/[kod]/karta">) {
  const { lang, kod } = await params;
  const draft = decodeExam(kod);
  if (!hasLocale(lang) || !draft) return new Response("Nie znaleziono", { status: 404 });
  const result = evaluateExam(draft, lang);
  return storyResponse(request.nextUrl.searchParams, (format) => examStory(result, lang, format), {
    file: `${lang === "sl" ? "izpit" : "egzamin"}-${result.grade.value}`,
  });
}
