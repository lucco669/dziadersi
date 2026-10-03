import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OgSeal } from "@/lib/og";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";

export const alt = "O Instytucie Badań nad Dziaderstwem · O Inštitutu za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Statut, historia i struktura",
    title: "O Instytucie",
    subtitle: "Od sporu o szczypce na działce do Komisji Orzekającej. Bez grantów, bez zgody rodziny.",
  },
  sl: {
    section: "Statut, zgodovina in struktura",
    title: "O Inštitutu",
    subtitle: "Od spora o kleščah na vrtičku do Razsodne komisije. Brez projektnih sredstev, brez soglasja družine.",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "pl";
  return sectionCard({ ...COPY[locale], path: "/o-instytucie", art: <OgSeal size={360} /> }, locale);
}
