import { hasLocale } from "@/i18n/config";
import { decodeCard } from "@/lib/bingo";
import { OG_SIZE } from "@/lib/og-cards";
import { bingoCard } from "@/lib/toy-cards";

export const alt = "Karta Dziaders Bingo · Listek Dziaders binga";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; karta: string }> }) {
  const { lang, karta } = await params;
  const card = hasLocale(lang) ? decodeCard(karta, lang) : null;
  if (!hasLocale(lang) || !card) return new Response("Nie znaleziono", { status: 404 });
  return bingoCard(card.occasion, card.number, card.squares, lang);
}
