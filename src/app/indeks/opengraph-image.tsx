import { OG_SIZE, sectionCard } from "@/lib/og-cards";

export const alt = "Narodowy Indeks Dziaderstwa";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    kicker: "§ DANE · NID",
    title: "Narodowy Indeks Dziaderstwa",
    subtitle: "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę.",
    footer: "PRZEBIEG · PROGNOZA · WOJEWÓDZTWA",
    link: "DZIADER.SI/INDEKS",
  });
}
