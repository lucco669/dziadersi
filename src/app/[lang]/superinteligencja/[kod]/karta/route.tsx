import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { decodeAnswer } from "@/lib/szwagier";
import { answerStory, storyResponse } from "@/lib/story-cards";

/**
 * An answer of SZWAGIER as a portrait image: ?format=post (4:5, default) or ?format=relacja (9:16);
 * ?pobierz downloads it. Withheld questions are empty after decoding, so they never reach the image.
 */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/superinteligencja/[kod]/karta">) {
  const { lang, kod } = await params;
  let answer = null;
  try {
    answer = hasLocale(lang) ? decodeAnswer(decodeURIComponent(kod), lang) : null;
  } catch {
    // A malformed escape in the address is a missing answer.
  }
  if (!hasLocale(lang) || !answer) return new Response("Nie znaleziono", { status: 404 });
  const found = answer;
  return storyResponse(request.nextUrl.searchParams, (format) => answerStory(found, lang, format), {
    file: `szwagier-${found.code}`,
  });
}
