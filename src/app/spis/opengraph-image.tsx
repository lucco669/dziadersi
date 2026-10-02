import { OG_SIZE, OgCrowd, sectionCard } from "@/lib/og-cards";

export const alt = "Narodowy Spis Dziadersów: wyniki wszystkich badań Instytutu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Wyniki wszystkich badań, na żywo",
    title: "Narodowy Spis Dziadersów",
    subtitle: "Gatunki, krzyżówki, najczęstsze odpowiedzi i najbardziej dziaderska godzina.",
    url: "dziader.si/spis",
    art: <OgCrowd count={31} width={330} />,
  });
}
