import type { Text } from "@/i18n/overlay";
import type { Rivalry } from "../seating";

/** Slovenian subjects of the rivalries, keyed by the sorted pair of species keys. */
export const RIVALRIES_TEXT: Record<string, Text<Rivalry>> = {
  "moto+smart": { subject: "sistem start-stop" },
  "festiwalowy+kibicowski": { subject: "daljinec" },
  "korpo+wigilijny": { subject: "catering za sveti večer" },
  "golebiarz+parapetowy": { subject: "golobi na okenski polici" },
  "oszczednosciowy+weselny": { subject: "višina kuverte" },
  "grill+smart": { subject: "plinski žar z aplikacijo" },
  "meteorologiczny+smart": { subject: "vremenska aplikacija" },
  "meteorologiczny+wedka": { subject: "zračni tlak" },
  "kempingowy+parking": { subject: "prikolica na dveh mestih" },
  "bieszczadzki+korpo": { subject: "sporočilo od šefa" },
  "grzybiarz+smart": { subject: "aplikacija za gobe" },
  "moto+zeglarz": { subject: "motor na jezeru" },
  "kolejkowy+smart": { subject: "samopostrežna blagajna" },
  "kibicowski+weselny": { subject: "tekma med oczepinami" },
  "jurajski+kibicowski": { subject: "kdo se bolje spominja" },
  "kempingowy+moto": { subject: "vzvratna vožnja s prikolico" },
  "grill+wigilijny": { subject: "krap z žara" },
  "budowa+smart": { subject: "električna napeljava" },
  "oszczednosciowy+przygraniczny": { subject: "kje je ceneje" },
  "przygraniczny+wigilijny": { subject: "krap izza meje" },
  "korpo+smart": { subject: "zaupanje v oblak" },
  "krupowkowy+moto": { subject: "gneča proti Zakopanam" },
  "kolejkowy+weselny": { subject: "vrsta pri bifeju" },
  "gorski+grzybiarz": { subject: "turisti v gozdu" },
  "meteorologiczny+wakacje": { subject: "veter z morja" },
  "bieszczadzki+smart": { subject: "signal mobilnega omrežja" },
};
