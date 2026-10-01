import { SPECIES } from "@/content/species";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";
import { plural } from "@/lib/typo";

export const alt = "Atlas Dziadersów: katalog gatunków";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    kicker: "§ ZBIORY",
    title: "Atlas Dziadersów",
    subtitle: "Od Grillowego po Bieszczadzkiego. Objawy, siedliska, naturalni wrogowie.",
    footer: `${SPECIES.length} ${plural(SPECIES.length, "GATUNEK", "GATUNKI", "GATUNKÓW")} · KLUCZ DO OZNACZANIA`,
    link: "DZIADER.SI/ATLAS",
  });
}
