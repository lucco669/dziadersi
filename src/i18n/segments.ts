/**
 * URL segments of the Slovenian edition. Route folders keep their Polish names (app/[lang]/slownik);
 * Slovenian URLs use these words (/sl/slovar) and next.config.ts rewrites them to the folders.
 * Children rename a later segment of the same section (/wynik/[kod]/certyfikat → /izvid/[kod]/certifikat).
 *
 * Published URLs must never change: add new routes here, never rename existing ones.
 * Imported by next.config.ts, so this file has no imports.
 */
export type SegmentMap = Record<string, { sl: string; children?: Record<string, string> }>;

export const SEGMENTS: SegmentMap = {
  test: { sl: "test" },
  wynik: { sl: "izvid", children: { certyfikat: "certifikat", badania: "preiskave" } },
  atlas: { sl: "atlas" },
  slownik: { sl: "slovar" },
  raporty: { sl: "porocila" },
  indeks: { sl: "indeks" },
  spis: { sl: "popis" },
  statystyki: { sl: "statistika" },
  obserwacje: { sl: "opazovanja" },
  "tablica-honorowa": { sl: "castna-tabla" },
  generator: { sl: "pogovornik" },
  bingo: { sl: "bingo", children: { druk: "tisk" } },
  kalendarz: { sl: "koledar" },
  biuletyn: { sl: "bilten", children: { wypisz: "odjava" } },
  egzamin: { sl: "izpit" },
  "czy-to-juz-dziaderstwo": { sl: "je-to-ze-dziaderstvo" },
  grupa: { sl: "lestvica" },
  grupy: { sl: "skupina" },
  profil: { sl: "profil", children: { zapisz: "shrani", zachowaj: "ohrani", legitymacja: "izkaznica" } },
  konto: { sl: "racun" },
  szukaj: { sl: "iskanje" },
  "o-instytucie": { sl: "o-institutu" },
  regulamin: { sl: "pogoji-uporabe" },
  prywatnosc: { sl: "zasebnost" },
};

type Rule = { source: string; destination: string };

/** Rewrites from Slovenian URLs to the route folders, most specific first. */
export function slovenianRewrites(): Rule[] {
  const rules: Rule[] = [];
  for (const [pl, { sl, children }] of Object.entries(SEGMENTS)) {
    for (const [childPl, childSl] of Object.entries(children ?? {})) {
      rules.push(
        { source: `/sl/${sl}/${childSl}/:rest*`, destination: `/sl/${pl}/${childPl}/:rest*` },
        { source: `/sl/${sl}/:a/${childSl}/:rest*`, destination: `/sl/${pl}/:a/${childPl}/:rest*` },
      );
    }
    if (sl !== pl) rules.push({ source: `/sl/${sl}/:rest*`, destination: `/sl/${pl}/:rest*` });
  }
  return rules;
}
