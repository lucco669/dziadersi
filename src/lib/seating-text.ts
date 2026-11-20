import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { shortName, type Seat } from "./seating";

/* The protocol's wording, shared by the planner, its pages and the generated images. */

export const VERDICT_COPY = defineCopy({
  pl: {
    calm: { title: "Rozsadzenie bezpieczne", stamp: "Zatwierdzono", note: "Instytut nie zgłasza zastrzeżeń. Można podawać zupę." },
    tense: {
      title: "Napięcie umiarkowane",
      stamp: "Zatwierdzono warunkowo",
      note: "Dopuszczalne pod nadzorem. Zaleca się posadzenie osoby neutralnej najbliżej pilota do telewizora.",
    },
    volatile: {
      title: "Stół zapalny",
      stamp: "Do poprawy",
      note: "Przewidywane są co najmniej dwa spory przed deserem. Instytut zaleca przesadzenie gości przed podaniem pierwszego dania.",
    },
    emergency: {
      title: "Stan wyjątkowy przy stole",
      stamp: "Stan wyjątkowy",
      note: "Ryzyko sporu przekracza normy. Instytut zaleca rozsadzenie urzędowe albo dostawienie drugiego stołu.",
    },
  },
  sl: {
    calm: { title: "Varen sedežni red", stamp: "Odobreno", note: "Inštitut nima pripomb. Juha se lahko postreže." },
    tense: {
      title: "Zmerna napetost",
      stamp: "Pogojno odobreno",
      note: "Dopustno pod nadzorom. Priporočamo, da najbližje daljincu sedi nevtralna oseba.",
    },
    volatile: {
      title: "Vnetljiva miza",
      stamp: "Za popravek",
      note: "Pred sladico sta predvidena vsaj dva spora. Inštitut priporoča presedanje gostov pred prvo jedjo.",
    },
    emergency: {
      title: "Izredne razmere za mizo",
      stamp: "Izredne razmere",
      note: "Tveganje spora presega normative. Inštitut priporoča uradni sedežni red ali dodatno mizo.",
    },
  },
});

const WANDERER = defineCopy({ pl: "wędrowiec", sl: "popotnik" });

/** Who sits at a place, for sentences: the label, or the species' short name. */
export function seatName(seat: Seat, locale: Locale) {
  return seat.label || (seat.species ? shortName(seat.species, locale) : WANDERER[locale]);
}

/** "87%" in Polish, "87 %" in Slovenian. */
export const percent = (locale: Locale, value: number) => (locale === "sl" ? `${value} %` : `${value}%`);
