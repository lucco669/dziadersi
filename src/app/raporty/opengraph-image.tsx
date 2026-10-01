import { C, bold, sans } from "@/lib/og";
import { OG_SIZE, OgTally, sectionCard } from "@/lib/og-cards";

export const alt = "Raporty Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Badania terenowe · przeglądy · eksperymenty",
    title: "Raporty Instytutu",
    subtitle: "Wszystkie dane są zmyślone. A mimo to się zgadzają.",
    url: "dziader.si/raporty",
    art: (
      <div style={{ display: "flex", flexDirection: "column", width: 420 }}>
        <div style={{ ...bold, display: "flex", fontSize: 150, lineHeight: 0.9, letterSpacing: -4, color: C.red }}>73%</div>
        <div style={{ ...sans, display: "flex", marginTop: 12, fontSize: 22, lineHeight: 1.25, color: C.soft }}>
          ojców posiada kabel, którego przeznaczenia nie zna
        </div>
        <div style={{ display: "flex", marginTop: 22 }}>
          <OgTally count={7} width={420} />
        </div>
      </div>
    ),
  });
}
