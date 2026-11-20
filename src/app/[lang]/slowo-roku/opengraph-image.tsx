import { WORD_OF_YEAR } from "@/content/word-of-year";
import { hasLocale } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { wordShareCard } from "@/lib/word-cards";
import { verdictLine, wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";

export const alt = "Dziaderskie Słowo Roku · Dziaderska beseda leta";
export const size = OG_SIZE;
export const contentType = "image/png";

/** The vote and three nominees until the announcement; the word and its verdict after it. */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const state = await getWordState();
  const headwords = WORD_OF_YEAR.nominees.map((nominee) => wordEntry(nominee.slug, lang).headword);
  const winner = state.result ? { entry: wordEntry(state.result.winner, lang), verdict: verdictLine(state.result, lang) } : undefined;
  return wordShareCard(lang, state.phase, headwords, winner);
}
