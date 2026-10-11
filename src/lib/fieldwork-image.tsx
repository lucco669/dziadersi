import { museumDrawing } from "@/components/museum-drawing";
import type { Dossier } from "@/content/dossiers";
import { getGuide } from "@/content/guide";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "./fieldwork-cards";
import { OgPlate } from "./og-cards";
import { svgDataUri } from "./svg-string";

const COPY = defineCopy({
  pl: {
    guide: "Wprowadzenie do Instytutu",
    occasions: "Przewodniki na okazje",
    occasionsText: "Wigilia, wesele, majówka. Gatunki, wokalizacje i bingo.",
    museum: "Muzeum rzeczy",
    museumText: "Rzeczy, które jeszcze się przydadzą. Sześć eksponatów, żadnego do wyrzucenia.",
    print: "Materiały do druku",
    printText: "Bingo, karty gatunków i kieszonkowy przewodnik. Papier A4.",
    dossier: "Przewodnik terenowy · bingo do druku",
  },
  sl: {
    guide: "Uvod v Inštitut",
    occasions: "Vodniki za priložnosti",
    occasionsText: "Sveti večer, svatba, prvomajski vikend. Vrste, oglašanje in bingo.",
    museum: "Muzej stvari",
    museumText: "Stvari, ki bodo še prišle prav. Šest eksponatov, noben za zavreči.",
    print: "Gradivo za tisk",
    printText: "Bingo, kartice vrst in žepni vodnik. Papir A4.",
    dossier: "Terenski vodnik · bingo za tisk",
  },
});
export function fieldworkSectionImage(kind: "guide" | "occasions" | "museum" | "print", locale: Locale) {
  const t = COPY[locale];
  if (kind === "guide") {
    const guide = getGuide(locale);
    return fieldworkCard(locale, {
      title: guide.title,
      subtitle: t.guide,
      section: t.guide,
      path: "/dziaders",
      art: <OgPlate species="korpo" width={380} />,
    });
  }
  if (kind === "occasions")
    return fieldworkCard(locale, {
      title: t.occasions,
      subtitle: t.occasionsText,
      section: t.dossier,
      path: "/okazje",
      art: <OgPlate species="wigilijny" width={380} />,
    });
  if (kind === "museum")
    return fieldworkCard(locale, {
      title: t.museum,
      subtitle: t.museumText,
      section: t.museum,
      path: "/muzeum",
      art: <img src={svgDataUri("0 0 240 164", museumDrawing("screws"))} width={380} height={260} alt="" />,
    });
  return fieldworkCard(locale, {
    title: t.print,
    subtitle: t.printText,
    section: t.print,
    path: "/do-druku",
    art: <OgPlate species="dzialka" width={380} />,
  });
}
export function dossierImage(dossier: Dossier, locale: Locale) {
  return fieldworkCard(locale, {
    title: dossier.title,
    subtitle: dossier.season,
    section: COPY[locale].dossier,
    path: "/okazje/" + dossier.slug,
    art: <OgPlate species={dossier.species[0]} width={380} />,
  });
}
