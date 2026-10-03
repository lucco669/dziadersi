import type { Species } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { compatibility, decodeGroup, encodeResult, evaluate, SAMPLE_DRAFT, type Result, type Symptom } from "./test";

export type Member = { result: Result; label: string; order: number };

const COPY = defineCopy({
  pl: {
    unnamed: (number: number) => `Osoba badana nr ${number}`,
    ideal: "Para idealna. Mogą razem jeździć na działkę i nie rozmawiać przez cały dzień.",
    high: "Zgodność wysoka. Spory dotyczą tylko tego, kiedy przewrócić karkówkę.",
    moderate: "Zgodność umiarkowana. Na Wigilii posadzić na przeciwnych końcach stołu.",
    low: "Zgodność niska. Nie wysyłać razem do marketu budowlanego.",
  },
  sl: {
    unnamed: (number: number) => `Preiskovana oseba št. ${number}`,
    ideal: "Idealen par. Lahko skupaj hodita na vrtiček in ves dan ne spregovorita besede.",
    high: "Visoka združljivost. Sporita se le o tem, kdaj obrniti vratovino.",
    moderate: "Zmerna združljivost. Na sveti večer ju posaditi na nasprotna konca mize.",
    low: "Nizka združljivost. Ne pošiljati ju skupaj v železnino.",
  },
});

/** A ranking from its URL segment, in the edition's language; `normalized` drops duplicates and rejected names. */
export function loadGroup(segment: string, locale: Locale) {
  let requested = segment;
  try {
    requested = decodeURIComponent(segment);
  } catch {
    // Malformed escape: use the raw segment.
  }
  const drafts = decodeGroup(requested);
  if (!drafts) return null;
  const members: Member[] = drafts.map((draft, i) => {
    const result = evaluate(draft, locale);
    return { result, label: result.name || COPY[locale].unnamed(i + 1), order: i };
  });
  return { requested, normalized: members.map((member) => member.result.code).join("."), members };
}

/** Highest score first; ties go to whoever joined earlier. */
export const ranked = (members: Member[]) =>
  [...members].sort((a, b) => b.result.score - a.result.score || a.order - b.order);

export function pairs(members: Member[]) {
  const all = members.flatMap((a, i) =>
    members.slice(i + 1).map((b) => ({ a, b, value: compatibility(a.result, b.result) })),
  );
  all.sort((x, y) => y.value - x.value);
  return { best: all[0], worst: all[all.length - 1] };
}

/** Findings two respondents share: the same answer to the same task. */
export function sharedFindings(a: Result, b: Result): Symptom[] {
  if (a.version !== b.version) return [];
  return a.findings.filter((finding) =>
    b.findings.some((other) => other.number === finding.number && other.answer === finding.answer),
  );
}

/** The species diagnosed most often in a group, first species of hybrids included, as the members' results name it. */
export function dominantSpecies(members: Member[]) {
  const counts = new Map<string, number>();
  for (const member of members) {
    for (const species of member.result.diagnosis.species) counts.set(species.key, (counts.get(species.key) ?? 0) + 1);
  }
  const [key, count] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [];
  const species: Species | undefined = members
    .flatMap((member) => member.result.diagnosis.species)
    .find((item) => item.key === key);
  return species && count ? { species, count } : null;
}

export function compatibilityNote(value: number, locale: Locale) {
  const t = COPY[locale];
  if (value >= 85) return t.ideal;
  if (value >= 65) return t.high;
  if (value >= 45) return t.moderate;
  return t.low;
}

/** The prerendered sample: two respondents. */
export const SAMPLE_GROUP = [
  encodeResult({ ...SAMPLE_DRAFT, name: "Zenek" }),
  encodeResult({ version: 2, answers: [1, 3, 3, 3, 3, 1, 52, 1, 2, 7, 8, 1, 1, 2, 2, 82], day: 273, name: "Basia" }),
].join(".");
