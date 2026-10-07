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
  superinteligencja: { sl: "superinteligenca" },
  bingo: { sl: "bingo", children: { druk: "tisk" } },
  kolejka: { sl: "cakalna-vrsta" },
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
  kontakt: { sl: "kontakt" },
  regulamin: { sl: "pogoji-uporabe" },
  prywatnosc: { sl: "zasebnost" },
};

type Rule = { source: string; destination: string };

/**
 * The same rewrite for a page's RSC paths. On Vercel, client navigations and prefetches reach the
 * rewrites with the suffix already on the last segment ("/sl/slovar.rsc", "/sl/slovar.segments/_tree.segment.rsc"),
 * where "/sl/slovar/:rest*" no longer matches and the router gets the 404 page instead.
 */
export const rscRewrites = (source: string, destination: string): Rule[] => [
  { source: `${source}.rsc`, destination: `${destination}.rsc` },
  { source: `${source}.segments/:rest*`, destination: `${destination}.segments/:rest*` },
];

/** A rewrite of a path and everything under it, RSC paths included. */
const rewriteTree = (source: string, destination: string): Rule[] => [
  { source: `${source}/:rest*`, destination: `${destination}/:rest*` },
  ...rscRewrites(source, destination),
];

/**
 * Redirects from the routed form of the Slovenian edition (/sl/slownik/x) to its public address
 * (/sl/slovar/x), as /pl/… does in the Polish edition. Share images keep the routed path: Next.js links them by it.
 */
export function slovenianRedirects(): (Rule & { permanent: true })[] {
  return Object.entries(SEGMENTS)
    .filter(([pl, { sl }]) => sl !== pl)
    .flatMap(([pl, { sl }]) => [
      { source: `/sl/${pl}`, destination: `/sl/${sl}`, permanent: true as const },
      { source: `/sl/${pl}/:path((?!.*opengraph-image).*)`, destination: `/sl/${sl}/:path`, permanent: true as const },
    ]);
}

/** Rewrites from Slovenian URLs to the route folders, most specific first. */
export function slovenianRewrites(): Rule[] {
  const rules: Rule[] = [];
  for (const [pl, { sl, children }] of Object.entries(SEGMENTS)) {
    for (const [childPl, childSl] of Object.entries(children ?? {})) {
      rules.push(...rewriteTree(`/sl/${sl}/${childSl}`, `/sl/${pl}/${childPl}`), ...rewriteTree(`/sl/${sl}/:a/${childSl}`, `/sl/${pl}/:a/${childPl}`));
    }
    if (sl !== pl) rules.push(...rewriteTree(`/sl/${sl}`, `/sl/${pl}`));
  }
  return rules;
}
