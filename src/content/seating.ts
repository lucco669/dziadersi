import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { RIVALRIES_TEXT } from "@/content/sl/seating";
import type { SpeciesKey } from "./species";

/**
 * Natural enmities between species, for the seating protocol (/plan-stolu). Each one is a natural
 * enemy from the Atlas sitting at the same table: the Motoryzacyjny's "system start-stop" is what
 * the Smart-Home drives. `risk` is the base chance of a dispute between direct neighbours, 0–100;
 * the scoring in src/lib/seating.ts adds the season. `subject` names the dispute in the protocol.
 *
 * The pair is unordered. Append only: a rivalry changes the score of plans already shared.
 */
export type Rivalry = {
  a: SpeciesKey;
  b: SpeciesKey;
  risk: number;
  subject: string;
};

export const RIVALRIES: Rivalry[] = [
  { a: "moto", b: "smart", risk: 87, subject: "system start-stop" },
  { a: "festiwalowy", b: "kibicowski", risk: 88, subject: "pilot do telewizora" },
  { a: "wigilijny", b: "korpo", risk: 85, subject: "catering na Wigilię" },
  { a: "golebiarz", b: "parapetowy", risk: 86, subject: "gołębie na parapecie" },
  { a: "weselny", b: "oszczednosciowy", risk: 83, subject: "wysokość koperty" },
  { a: "grill", b: "smart", risk: 80, subject: "grill gazowy z aplikacją" },
  { a: "meteorologiczny", b: "smart", risk: 81, subject: "aplikacja pogodowa" },
  { a: "meteorologiczny", b: "wedka", risk: 78, subject: "ciśnienie atmosferyczne" },
  { a: "parking", b: "kempingowy", risk: 79, subject: "przyczepa na dwóch miejscach" },
  { a: "bieszczadzki", b: "korpo", risk: 77, subject: "wiadomość od szefa" },
  { a: "grzybiarz", b: "smart", risk: 76, subject: "aplikacja do grzybów" },
  { a: "zeglarz", b: "moto", risk: 74, subject: "silnik na jeziorze" },
  { a: "kolejkowy", b: "smart", risk: 73, subject: "kasa samoobsługowa" },
  { a: "weselny", b: "kibicowski", risk: 72, subject: "mecz w trakcie oczepin" },
  { a: "jurajski", b: "kibicowski", risk: 71, subject: "kto pamięta lepiej" },
  { a: "moto", b: "kempingowy", risk: 70, subject: "cofanie z przyczepą" },
  { a: "wigilijny", b: "grill", risk: 69, subject: "karp z grilla" },
  { a: "budowa", b: "smart", risk: 68, subject: "instalacja elektryczna" },
  { a: "przygraniczny", b: "oszczednosciowy", risk: 67, subject: "gdzie jest taniej" },
  { a: "wigilijny", b: "przygraniczny", risk: 66, subject: "karp zza granicy" },
  { a: "smart", b: "korpo", risk: 64, subject: "zaufanie do chmury" },
  { a: "krupowkowy", b: "moto", risk: 62, subject: "korek na zakopiance" },
  { a: "kolejkowy", b: "weselny", risk: 61, subject: "kolejka do bufetu" },
  { a: "grzybiarz", b: "gorski", risk: 58, subject: "turyści w lesie" },
  { a: "meteorologiczny", b: "wakacje", risk: 57, subject: "wiatr od morza" },
  { a: "bieszczadzki", b: "smart", risk: 55, subject: "zasięg sieci" },
];

export const rivalryKey = (rivalry: Pick<Rivalry, "a" | "b">) => [rivalry.a, rivalry.b].sort().join("+");

const EDITIONS: Record<Locale, Rivalry[]> = {
  pl: RIVALRIES,
  sl: overlayList("rivalries", RIVALRIES, rivalryKey, RIVALRIES_TEXT),
};

/** The rivalries in an edition: the same pairs and risks, with the edition's subjects. */
export const getRivalries = (locale: Locale) => EDITIONS[locale];
