import type { SpeciesKey } from "@/content/species";
import { decodeResult, DIAGNOSABLE, evaluate, type Result } from "./test";

/*
 * The Profil Dziaderski is computed from saved result codes: nothing about badges or the
 * species collection is stored, so it can never drift from the results themselves.
 */

export type Badge = { key: string; name: string; hint: string; earned: boolean };

export type Profile = {
  results: (Result & { savedAt: string })[];
  collected: Set<SpeciesKey>;
  average: number | null;
  badges: Badge[];
};

export function buildProfile(saved: { code: string; saved_at: string }[]): Profile {
  const results = saved.flatMap((row) => {
    const draft = decodeResult(row.code);
    return draft ? [{ ...evaluate(draft), savedAt: row.saved_at }] : [];
  });
  const collected = new Set(results.flatMap((result) => result.diagnosis.species.map((species) => species.key)));
  const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : null;
  const own = results.filter((result) => !result.proxy);

  const rules: (Omit<Badge, "earned"> & { test: boolean })[] = [
    { key: "pierwsze", name: "Pierwsze badanie", hint: "Zapisz pierwszy wynik.", test: results.length >= 1 },
    { key: "staly", name: "Stały pacjent", hint: "Trzy zapisane badania.", test: results.length >= 3 },
    { key: "kliniczny", name: "Przypadek kliniczny", hint: "Wynik 75% albo więcej.", test: own.some((result) => result.score >= 75) },
    { key: "sladowy", name: "Ślad dziaderstwa", hint: "Wynik poniżej 25%.", test: own.some((result) => result.score < 25) },
    {
      key: "krzyzowka",
      name: "Krzyżówka",
      hint: "Rozpoznanie dwóch gatunków naraz.",
      test: results.some((result) => result.diagnosis.species.length === 2),
    },
    { key: "wywiad", name: "Wywiad rodzinny", hint: "Zbadaj kogoś bliskiego.", test: results.some((result) => result.proxy) },
    {
      key: "falstart",
      name: "Falstart",
      hint: "Zatrąb przed zielonym.",
      test: results.some((result) => result.reflex?.outcome === "red" || result.reflex?.outcome === "amber"),
    },
    { key: "kolekcjoner", name: "Kolekcjoner", hint: "Pięć gatunków w kolekcji.", test: collected.size >= 5 },
    { key: "komplet", name: "Komplet", hint: `Wszystkie ${DIAGNOSABLE.length} gatunków.`, test: collected.size >= DIAGNOSABLE.length },
  ];

  return {
    results,
    collected,
    average,
    badges: rules.map(({ test, ...badge }) => ({ ...badge, earned: test })),
  };
}
