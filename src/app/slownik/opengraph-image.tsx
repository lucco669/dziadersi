import { DICTIONARY } from "@/content/dictionary";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";
import { plural } from "@/lib/typo";

export const alt = "Słownik Dziaderski";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return sectionCard({
    kicker: "§ LEKSYKOGRAFIA",
    title: "Słownik Dziaderski",
    subtitle: "Od „za moich czasów” po „diesel to jest diesel”. Z wymową i przykładami.",
    footer: `${DICTIONARY.length} ${plural(DICTIONARY.length, "HASŁO", "HASŁA", "HASEŁ")} · WYDANIE PIERWSZE`,
    link: "DZIADER.SI/SLOWNIK",
  });
}
