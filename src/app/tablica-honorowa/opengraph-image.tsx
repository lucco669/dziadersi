import { OG_SIZE, OgMedals, sectionCard } from "@/lib/og-cards";

export const alt = "Tablica Honorowa Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Przodownicy i wyróżnieni",
    title: "Tablica Honorowa",
    subtitle: "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Sprawy, które podzieliły naród.",
    url: "dziader.si/tablica-honorowa",
    art: <OgMedals width={420} />,
  });
}
