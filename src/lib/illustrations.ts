import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";

type Art = { alt: string; caption: string };

/** Report illustrations, public/illustrations/<Polish slug>.webp, keyed by the Polish slug in both editions. */
const REPORT_ART = defineCopy<Record<string, Art>>({
  pl: {
    "sezon-grzewczy": { alt: "Dłoń osłania pokrętło kaloryfera, strzegąc domowej temperatury.", caption: "Rys. 1. Ręczne zabezpieczenie przed nieuprawnioną zmianą temperatury." },
    "kartka-za-wycieraczka": { alt: "Dłoń wkłada pustą kartkę za wycieraczkę zaparkowanego samochodu.", caption: "Rys. 1. Doręczenie korespondencji w trybie parkingowym." },
    "kabel-nieznanego-przeznaczenia": { alt: "W szufladzie leży starannie zwinięty stary kabel, długopis, śrubokręt i kilka śrub.", caption: "Rys. 1. Zbiór kabli o nieustalonym przeznaczeniu. Nie wyrzucać." },
  },
  sl: {
    "sezon-grzewczy": { alt: "Dlan zakriva gumb radiatorskega ventila in varuje domačo temperaturo.", caption: "Slika 1. Ročno varovanje pred nepooblaščeno spremembo temperature." },
    "kartka-za-wycieraczka": { alt: "Dlan vtika prazen listek za brisalec parkiranega avtomobila.", caption: "Slika 1. Vročitev korespondence po parkirnem postopku." },
    "kabel-nieznanego-przeznaczenia": { alt: "V predalu leži skrbno zvit star kabel, kemični svinčnik, izvijač in nekaj vijakov.", caption: "Slika 1. Zbirka kablov neugotovljenega namena. Ne zavreči." },
  },
});

/** The illustration of a report, by its Polish slug, with the edition's alt text and caption. */
export const reportArt = (polishSlug: string, locale: Locale): Art | undefined => REPORT_ART[locale][polishSlug];
