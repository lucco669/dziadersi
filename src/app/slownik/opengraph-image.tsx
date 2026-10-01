import { DICTIONARY } from "@/content/dictionary";
import { C, bold } from "@/lib/og";
import { OG_SIZE, OgFigure, sectionCard } from "@/lib/og-cards";
import { plural } from "@/lib/typo";

export const alt = "Słownik Dziaderski";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: `${DICTIONARY.length} ${plural(DICTIONARY.length, "hasło", "hasła", "haseł")} · wydanie pierwsze`,
    title: "Słownik Dziaderski",
    subtitle: "Od „za moich czasów” po „diesel to jest diesel”. Z wymową i przykładami.",
    url: "dziader.si/slownik",
    art: (
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <OgFigure height={330} />
        <div style={{ ...bold, display: "flex", marginBottom: 190, marginLeft: 6, padding: "18px 24px", background: C.red, color: C.paper, fontSize: 34, lineHeight: 1.1 }}>
          „Panie…”
        </div>
      </div>
    ),
  });
}
