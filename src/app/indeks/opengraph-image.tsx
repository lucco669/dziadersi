import { OG_SIZE, OgCrowd, sectionCard } from "@/lib/og-cards";

export const alt = "Narodowy Indeks Dziaderstwa";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Aktualizacja co godzinę",
    title: "Narodowy Indeks Dziaderstwa",
    subtitle: "Natężenie dziaderstwa w Polsce. Prognoza na Wigilię: kliniczne.",
    url: "dziader.si/indeks",
    art: <OgCrowd count={33} width={330} />,
  });
}
