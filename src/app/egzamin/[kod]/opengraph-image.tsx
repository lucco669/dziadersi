import { decodeExam, encodeExam, evaluateExam, SAMPLE_EXAM } from "@/lib/exam";
import { examCard, OG_SIZE } from "@/lib/og-cards";

export const alt = "Wynik egzaminu terenowego z oznaczania dziadersów";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ kod: encodeExam(SAMPLE_EXAM) }];
}

export default async function Image({ params }: { params: Promise<{ kod: string }> }) {
  const draft = decodeExam((await params).kod);
  if (!draft) return new Response("Nie znaleziono", { status: 404 });
  return examCard(evaluateExam(draft), { "cache-control": "public, max-age=31536000, immutable" });
}
