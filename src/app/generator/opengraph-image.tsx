import { SITUATIONS } from "@/content/phrasebook";
import { OG_SIZE } from "@/lib/og-cards";
import { seededLine } from "@/lib/phrasebook";
import { lineCard } from "@/lib/toy-cards";

export const alt = "Rozmówki dziaderskie: generator wypowiedzi na każdą okazję";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return lineCard(seededLine(3, SITUATIONS[1]));
}
