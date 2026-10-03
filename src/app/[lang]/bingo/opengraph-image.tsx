import { notFound } from "next/navigation";
import { getOccasions } from "@/content/bingo";
import { hasLocale, LOCALES } from "@/i18n/config";
import { sampleCard } from "@/lib/bingo";
import { OG_SIZE } from "@/lib/og-cards";
import { bingoCard } from "@/lib/toy-cards";

export const alt =
  "Dziaders Bingo: karty na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę · Dziaders bingo: listki za svatbo, sveti večer, godovanje, prvomajski vikend, vožnjo z avtom in plažo";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const card = sampleCard(getOccasions(lang)[0]);
  return bingoCard(card.occasion, card.number, card.squares, lang);
}
