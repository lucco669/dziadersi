import { OG_SIZE, OgIsotype, sectionCard } from "@/lib/og-cards";

export const alt = "Mały Rocznik Statystyczny Dziaderstwa";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Rocznik 2026 · dane na żywo",
    title: "Mały Rocznik Statystyczny",
    subtitle: "Badania, obserwacje i trąbienia klaksonem. Z przeliczeniem na rosoły.",
    url: "dziader.si/statystyki",
    art: <OgIsotype kind="pot" count={23} part={0.5} columns={5} width={380} />,
  });
}
