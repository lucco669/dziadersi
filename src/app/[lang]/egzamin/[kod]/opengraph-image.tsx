import { hasLocale } from "@/i18n/config";
import { decodeExam, encodeExam, evaluateExam, SAMPLE_EXAM } from "@/lib/exam";
import { examCard, OG_SIZE } from "@/lib/og-cards";

export const alt = "Wynik egzaminu terenowego z oznaczania dziadersów · Rezultat terenskega izpita iz določanja dziadersov";
export const size = OG_SIZE;
export const contentType = "image/png";

// Codes are the same in both editions.
export function generateStaticParams() {
  return [{ kod: encodeExam(SAMPLE_EXAM) }];
}

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const draft = decodeExam(kod);
  if (!hasLocale(lang) || !draft) return new Response("Nie znaleziono", { status: 404 });
  return examCard(evaluateExam(draft, lang), lang, { "cache-control": "public, max-age=31536000, immutable" });
}
