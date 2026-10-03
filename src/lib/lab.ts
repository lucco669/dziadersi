import { getHorn, getLab } from "@/content/lab";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { hash, type Result } from "./test";

export type LabRow = {
  code: string;
  name: string;
  unit: string;
  value: string;
  range: string;
  /** "H" above the reference range, "L" below it. */
  flag: "H" | "L" | "";
};

const COPY = defineCopy({
  pl: {
    // Horn test outcomes that are words, not a time.
    red: "przed zielonym",
    amber: "na żółtym",
    none: "brak reakcji",
    normal: "Wszystkie parametry w normie. Podejrzanie w normie. Zalecane badanie kontrolne.",
    few: (flagged: number, total: number) => `Wyniki poza zakresem: ${flagged} z ${total}. Stan stabilny, obserwować przy grillu.`,
    some: (flagged: number, total: number) => `Wyniki poza zakresem: ${flagged} z ${total}. Obraz typowy dla dziaderstwa utrwalonego.`,
    most: (flagged: number, total: number) =>
      `Wyniki poza zakresem: ${flagged} z ${total}. Laboratorium prosi o niepowtarzanie badania. Wynik jest jednoznaczny.`,
  },
  sl: {
    red: "pred zeleno",
    amber: "pri rumeni",
    none: "brez reakcije",
    normal: "Vsi parametri v mejah normale. Sumljivo v mejah normale. Priporočen kontrolni pregled.",
    few: (flagged: number, total: number) => `Zunaj referenčnih vrednosti: ${flagged} od ${total}. Stanje stabilno, opazovati ob žaru.`,
    some: (flagged: number, total: number) =>
      `Zunaj referenčnih vrednosti: ${flagged} od ${total}. Klinična slika, značilna za utrjeno dziaderstvo.`,
    most: (flagged: number, total: number) =>
      `Zunaj referenčnih vrednosti: ${flagged} od ${total}. Laboratorij prosi, da preiskave ne ponavljaš. Izvid je nedvoumen.`,
  },
});

const number = (locale: Locale, value: number, decimals: number, minimum = decimals) =>
  new Intl.NumberFormat(LOCALE_INFO[locale].intl, { minimumFractionDigits: minimum, maximumFractionDigits: decimals }).format(value);

/** Reference ranges drop trailing zeros: "0–5", "0–0,2". */
const limit = (locale: Locale, value: number, decimals: number) => number(locale, value, decimals, 0);

/**
 * The lab printout for a result. Values follow the score or the species shares, with a little
 * scatter from the result code, so the same code always prints the same values, in either edition.
 */
export function labResults(result: Result, locale: Locale): LabRow[] {
  const t = COPY[locale];
  const seed = hash(`lab:${result.code.split("~")[0]}`);
  const rows: LabRow[] = getLab(locale).map((parameter, i) => {
    const factor = parameter.source === "score" ? result.score / 100 : (result.share[parameter.source] ?? 0);
    const scatter = (((seed >>> i) % 997) / 997 - 0.5) * 0.08;
    const level = Math.min(1, Math.max(0, factor ** 0.85 + scatter));
    const step = 10 ** -parameter.decimals;
    const value = Math.round((parameter.min + level * (parameter.max - parameter.min)) / step) * step;
    const flag = value > parameter.high ? "H" : value < parameter.low ? "L" : "";
    return {
      code: parameter.code,
      name: parameter.name,
      unit: parameter.unit,
      // Blood pressure prints as systolic/diastolic.
      value: parameter.code === "RR" ? `${value}/${Math.round(value * 0.62)}` : number(locale, value, parameter.decimals),
      range: `${limit(locale, parameter.low, parameter.decimals)}–${limit(locale, parameter.high, parameter.decimals)}`,
      flag,
    };
  });

  if (result.reflex) {
    const horn = getHorn(locale);
    const { outcome, seconds } = result.reflex;
    const range = `${limit(locale, horn.low, 1)}–${limit(locale, horn.high, 1)}`;
    const base = { code: horn.code, name: horn.name, unit: horn.unit, range };
    // Words instead of a time carry no unit.
    if (outcome === "red") rows.push({ ...base, unit: "", value: t.red, flag: "L" });
    else if (outcome === "amber") rows.push({ ...base, unit: "", value: t.amber, flag: "L" });
    else if (seconds === undefined) rows.push({ ...base, unit: "", value: t.none, flag: "H" });
    else {
      rows.push({
        ...base,
        value: number(locale, seconds, 2),
        flag: seconds < horn.low ? "L" : seconds > horn.high ? "H" : "",
      });
    }
  }

  return rows;
}

/** The diagnostician's one-line comment under the printout. */
export function labComment(rows: LabRow[], locale: Locale) {
  const t = COPY[locale];
  const flagged = rows.filter((row) => row.flag).length;
  if (flagged === 0) return t.normal;
  if (flagged <= 3) return t.few(flagged, rows.length);
  if (flagged <= 7) return t.some(flagged, rows.length);
  return t.most(flagged, rows.length);
}
