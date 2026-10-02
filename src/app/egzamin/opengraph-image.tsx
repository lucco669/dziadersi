import { OG_SIZE, sectionCard, OgBinoculars } from "@/lib/og-cards";

export const alt = "Egzamin terenowy z oznaczania dziadersów";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Egzamin terenowy",
    title: "Egzamin terenowy",
    subtitle: "Dwanaście pytań z Atlasu. Rozpoznasz Parkingowego po wokalizacji?",
    url: "dziader.si/egzamin",
    art: <OgBinoculars height={380} />,
  });
}
