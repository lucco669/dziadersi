import { SPECIES } from "@/content/species";
import { OG_SIZE, OgPlate, sectionCard } from "@/lib/og-cards";
import { plural } from "@/lib/typo";

export const alt = "Atlas Dziadersów: katalog gatunków";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: `${SPECIES.length} ${plural(SPECIES.length, "gatunek", "gatunki", "gatunków")} · klucz do oznaczania`,
    title: "Atlas Dziadersów",
    subtitle: "Od Grillowego po Bieszczadzkiego. Objawy, siedliska, naturalni wrogowie.",
    url: "dziader.si/atlas",
    art: (
      <div style={{ display: "flex", flexWrap: "wrap", width: 470 }}>
        {(["grill", "wakacje", "wedka", "moto"] as const).map((key) => (
          <OgPlate key={key} species={key} width={235} />
        ))}
      </div>
    ),
  });
}
