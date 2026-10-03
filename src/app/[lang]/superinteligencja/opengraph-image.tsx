import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { sampleAnswer } from "@/lib/szwagier";
import { answerCard } from "@/lib/toy-cards";

export const alt =
  "Superinteligencja: SZWAGIER 1.9 TDI odpowiada na każde pytanie · Superinteligenca: SZWAGIER 1.9 TDI odgovori na vsako vprašanje";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return answerCard(sampleAnswer(lang), lang);
}
