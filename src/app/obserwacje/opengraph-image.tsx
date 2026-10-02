import { OG_SIZE, OgTileMap, sectionCard } from "@/lib/og-cards";

export const alt = "Mapa obserwacji dziadersów według województw";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Sieć Obserwatorów Terenowych",
    title: "Mapa obserwacji",
    subtitle: "Gdzie widziano dziadersa. Zgłoszenia według województw i gatunków.",
    url: "dziader.si/obserwacje",
    art: <OgTileMap width={360} />,
  });
}
