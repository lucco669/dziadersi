import { HORN, LAB } from "@/content/lab";
import { formatSeconds, hash, type Result } from "./test";

export type LabRow = {
  code: string;
  name: string;
  unit: string;
  value: string;
  range: string;
  /** "H" above the reference range, "L" below it. */
  flag: "H" | "L" | "";
};

const number = (value: number, decimals: number, minimum = decimals) =>
  new Intl.NumberFormat("pl-PL", { minimumFractionDigits: minimum, maximumFractionDigits: decimals }).format(value);

/** Reference ranges drop trailing zeros: "0–5", "0–0,2". */
const limit = (value: number, decimals: number) => number(value, decimals, 0);

/**
 * The lab printout for a result. Values follow the score or the species shares, with a little
 * scatter from the result code, so the same code always prints the same values.
 */
export function labResults(result: Result): LabRow[] {
  const seed = hash(`lab:${result.code.split("~")[0]}`);
  const rows: LabRow[] = LAB.map((parameter, i) => {
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
      value: parameter.code === "RR" ? `${value}/${Math.round(value * 0.62)}` : number(value, parameter.decimals),
      range: `${limit(parameter.low, parameter.decimals)}–${limit(parameter.high, parameter.decimals)}`,
      flag,
    };
  });

  if (result.reflex) {
    const { outcome, seconds } = result.reflex;
    const range = `${limit(HORN.low, 1)}–${limit(HORN.high, 1)}`;
    const base = { code: HORN.code, name: HORN.name, unit: HORN.unit, range };
    // Words instead of a time carry no unit.
    if (outcome === "red") rows.push({ ...base, unit: "", value: "przed zielonym", flag: "L" });
    else if (outcome === "amber") rows.push({ ...base, unit: "", value: "na żółtym", flag: "L" });
    else if (seconds === undefined) rows.push({ ...base, unit: "", value: "brak reakcji", flag: "H" });
    else {
      rows.push({
        ...base,
        value: formatSeconds(seconds).replace(" s", ""),
        flag: seconds < HORN.low ? "L" : seconds > HORN.high ? "H" : "",
      });
    }
  }

  return rows;
}

/** The diagnostician's one-line comment under the printout. */
export function labComment(rows: LabRow[]) {
  const flagged = rows.filter((row) => row.flag).length;
  if (flagged === 0) return "Wszystkie parametry w normie. Podejrzanie w normie. Zalecane badanie kontrolne.";
  if (flagged <= 3) return `Wyniki poza zakresem: ${flagged} z ${rows.length}. Stan stabilny, obserwować przy grillu.`;
  if (flagged <= 7) return `Wyniki poza zakresem: ${flagged} z ${rows.length}. Obraz typowy dla dziaderstwa utrwalonego.`;
  return `Wyniki poza zakresem: ${flagged} z ${rows.length}. Laboratorium prosi o niepowtarzanie badania. Wynik jest jednoznaczny.`;
}
