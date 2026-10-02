import { MENU_ICONS } from "@/components/menu-icons";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";
import { svgDataUri } from "@/lib/svg-string";

export const alt = "Biuletyn tygodniowy Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    section: "Co poniedziałek",
    title: "Biuletyn tygodniowy",
    subtitle: "Tydzień w liczbach: badania, obserwacje, sprawa tygodnia i komunikat Instytutu.",
    url: "dziader.si/biuletyn",
    art: <img src={svgDataUri("0 0 48 40", MENU_ICONS["/biuletyn"])} width={380} height={316} alt="" />,
  });
}
