import { OCCASIONS } from "@/content/bingo";
import { sampleCard } from "@/lib/bingo";
import { OG_SIZE } from "@/lib/og-cards";
import { bingoCard } from "@/lib/toy-cards";

export const alt = "Dziaders Bingo: karty na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const card = sampleCard(OCCASIONS[0]);
  return bingoCard(card.occasion, card.number, card.squares);
}
