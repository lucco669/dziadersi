import { decodeCard } from "@/lib/bingo";
import { OG_SIZE } from "@/lib/og-cards";
import { bingoCard } from "@/lib/toy-cards";

export const alt = "Karta Dziaders Bingo";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ karta: string }> }) {
  const card = decodeCard((await params).karta);
  if (!card) return new Response("Nie znaleziono", { status: 404 });
  return bingoCard(card.occasion, card.number, card.squares);
}
