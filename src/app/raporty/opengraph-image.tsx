import { OG_SIZE, sectionCard } from "@/lib/og-cards";

export const alt = "Raporty Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    kicker: "§ BADANIA",
    title: "Raporty Instytutu",
    subtitle: "Wszystkie dane są zmyślone. A mimo to się zgadzają.",
    footer: "BADANIA TERENOWE · PRZEGLĄDY · EKSPERYMENTY",
    link: "DZIADER.SI/RAPORTY",
  });
}
