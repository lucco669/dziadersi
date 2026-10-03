import { MENU_ICONS } from "@/components/menu-icons";
import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, sectionCard } from "@/lib/og-cards";
import { svgDataUri } from "@/lib/svg-string";

export const alt = "Biuletyn tygodniowy Instytutu Badań nad Dziaderstwem · Tedenski bilten Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Co poniedziałek",
    title: "Biuletyn tygodniowy",
    subtitle: "Tydzień w liczbach: badania, obserwacje, sprawa tygodnia i komunikat Instytutu.",
  },
  sl: {
    section: "Vsak ponedeljek",
    title: "Tedenski bilten",
    subtitle: "Teden v številkah: pregledi, opazovanja, primer tedna in obvestilo Inštituta.",
  },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return sectionCard(
    {
      ...COPY[locale],
      path: "/biuletyn",
      art: <img src={svgDataUri("0 0 48 40", MENU_ICONS["/biuletyn"])} width={380} height={316} alt="" />,
    },
    locale,
  );
}
