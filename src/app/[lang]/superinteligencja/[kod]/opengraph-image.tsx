import { hasLocale } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { decodeAnswer } from "@/lib/szwagier";
import { answerCard } from "@/lib/toy-cards";

export const alt = "Odpowiedź Superinteligencji Instytutu · Odgovor superinteligence Inštituta";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  let answer = null;
  try {
    answer = hasLocale(lang) ? decodeAnswer(decodeURIComponent(kod), lang) : null;
  } catch {
    // A malformed escape in the address is a missing answer.
  }
  if (!hasLocale(lang) || !answer) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return answerCard(answer, lang, { cached: true });
}
