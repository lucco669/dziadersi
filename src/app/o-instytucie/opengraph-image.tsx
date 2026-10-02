import { OgSeal } from "@/lib/og";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";

export const alt = "O Instytucie Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Statut, historia i struktura",
    title: "O Instytucie",
    subtitle: "Od sporu o szczypce na działce do Komisji Orzekającej. Bez grantów, bez zgody rodziny.",
    url: "dziader.si/o-instytucie",
    art: <OgSeal size={360} />,
  });
}
