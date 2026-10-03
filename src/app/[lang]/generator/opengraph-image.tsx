import { notFound } from "next/navigation";
import { getSituations } from "@/content/phrasebook";
import { hasLocale, LOCALES } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { seededLine } from "@/lib/phrasebook";
import { lineCard } from "@/lib/toy-cards";

export const alt =
  "Rozmówki dziaderskie: generator wypowiedzi na każdą okazję · Dziaderski pogovornik: generator izjav za vsako priložnost";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lineCard(seededLine(3, lang, getSituations(lang)[1]), lang);
}
