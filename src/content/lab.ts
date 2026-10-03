import type { Locale } from "@/i18n/config";
import { overlay } from "@/i18n/overlay";
import * as sl from "./sl/lab";
import type { SpeciesKey } from "./species";

/**
 * Wyniki badań laboratoryjnych: parameters that borrow the abbreviations of a real blood test.
 * Each is driven by the overall score or by the respondent's affinity to one species, and runs
 * from `min` (no symptoms) to `max` (the most dziaderski answers); the reference range sits low.
 */
export type LabParameter = {
  code: string;
  name: string;
  unit: string;
  low: number;
  high: number;
  min: number;
  max: number;
  decimals: number;
  source: SpeciesKey | "score";
};

export const LAB: LabParameter[] = [
  { code: "OB", name: "Opinie podawane bez pytania", unit: "/godz.", low: 0, high: 3, min: 0.4, max: 14, decimals: 0, source: "score" },
  { code: "CRP", name: "Częstość rozmów o pogodzie", unit: "/dobę", low: 0, high: 5, min: 1.2, max: 38, decimals: 1, source: "score" },
  { code: "CHOL", name: "Cholesterol karkówkowy", unit: "mg/dl", low: 0, high: 190, min: 128, max: 342, decimals: 0, source: "grill" },
  { code: "RR", name: "Ciśnienie przy szukaniu miejsca parkingowego", unit: "mmHg", low: 100, high: 139, min: 112, max: 205, decimals: 0, source: "parking" },
  { code: "PLT", name: "Płytki (opinie o tym, jak je położono)", unit: "tys./µl", low: 150, high: 400, min: 210, max: 780, decimals: 0, source: "budowa" },
  { code: "ON", name: "Olej napędowy we krwi", unit: "‰", low: 0, high: 0.2, min: 0.02, max: 1.9, decimals: 2, source: "moto" },
  { code: "WBC", name: "Białe skarpety (frotte)", unit: "par/tydz.", low: 0, high: 2, min: 0.2, max: 14, decimals: 1, source: "wakacje" },
  { code: "ALT", name: "Aktywność łańcuszków tekstowych", unit: "U/l", low: 0, high: 40, min: 11, max: 260, decimals: 0, source: "facebook" },
  { code: "AST", name: "Aktualizacje systemu odkładane na później", unit: "U/l", low: 0, high: 40, min: 9, max: 230, decimals: 0, source: "smart" },
  { code: "Fe", name: "Żelastwo w szufladzie („się przyda”)", unit: "kg", low: 0, high: 2, min: 0.3, max: 17, decimals: 1, source: "dzialka" },
  { code: "MCV", name: "Średnia wielkość ryby w opowieści", unit: "cm", low: 20, high: 45, min: 26, max: 140, decimals: 0, source: "wedka" },
  { code: "LDL", name: "Liczba drukowanych listów elektronicznych", unit: "szt./tydz.", low: 0, high: 3, min: 0, max: 46, decimals: 0, source: "korpo" },
];

/** The horn test, Formularz IBD-T2 only: reaction time from green to the first honk. */
export const HORN = { code: "CRK", name: "Czas reakcji klaksonowej", unit: "s", low: 0.8, high: 3 };

/* Editions: the Polish parameters above with each edition's names and units laid over them. */

const EDITIONS = {
  pl: { lab: LAB, horn: HORN },
  sl: { lab: overlay(LAB, sl.LAB, "lab.LAB"), horn: overlay(HORN, sl.HORN, "lab.HORN") },
} satisfies Record<Locale, unknown>;

/** The lab parameters in the edition's language: same order, ranges and sources as LAB. */
export const getLab = (locale: Locale): LabParameter[] => EDITIONS[locale].lab;

export const getHorn = (locale: Locale): typeof HORN => EDITIONS[locale].horn;
