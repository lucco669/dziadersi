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
  test: { sl: "test", children: { "przy-stole": "za-mizo" } },
  wynik: { sl: "izvid", children: { certyfikat: "certifikat", badania: "preiskave" } },
  atlas: { sl: "atlas", children: { "gatunki-pokrewne": "sorodne-vrste" } },
  slownik: { sl: "slovar" },
  "slownik-mlodziezowy": { sl: "mladinski-slovar" },
  raporty: { sl: "porocila" },
  dziaders: { sl: "dziaders", children: { kobieta: "zenska" } },
  okazje: { sl: "priloznosti" },
  muzeum: { sl: "muzej", children: { karta: "kartica" } },
  "do-druku": { sl: "za-tisk", children: { "karty-gatunkow": "kartice-vrst", przewodnik: "vodnik" } },
  indeks: { sl: "indeks", children: { ramka: "okvir", plakietka: "znacka" } },
  spis: { sl: "popis" },
  statystyki: { sl: "statistika" },
  obserwacje: { sl: "opazovanja" },
  "tablica-honorowa": { sl: "castna-tabla" },
  generator: { sl: "pogovornik", children: { karta: "kartica" } },
  zyczenia: { sl: "voscila", children: { karta: "kartica" } },
  superinteligencja: { sl: "superinteligenca", children: { karta: "kartica" } },
  bingo: { sl: "bingo", children: { druk: "tisk" } },
  kolejka: { sl: "cakalna-vrsta" },
  "krol-grilla": { sl: "kralj-zara" },
  "plan-stolu": { sl: "sedezni-red", children: { karta: "kartica" } },
  kalendarz: { sl: "koledar", children: { swieta: "prazniki" } },
  "lanie-wosku": { sl: "vlivanje-voska", children: { karta: "kartica" } },
  biuletyn: { sl: "bilten", children: { wypisz: "odjava", potwierdz: "potrditev" } },
  egzamin: { sl: "izpit", children: { karta: "kartica" } },
  "czy-to-juz-dziaderstwo": { sl: "je-to-ze-dziaderstvo", children: { karta: "kartica" } },
  "slowo-roku": { sl: "beseda-leta", children: { certyfikat: "certifikat" } },
  grupa: { sl: "lestvica", children: { karta: "kartica" } },
  grupy: { sl: "skupina" },
  profil: { sl: "profil", children: { zapisz: "shrani", zachowaj: "ohrani", legitymacja: "izkaznica" } },
  konto: { sl: "racun" },
  rejestracja: { sl: "registracija" },
  szukaj: { sl: "iskanje" },
  "o-instytucie": { sl: "o-institutu" },
  kontakt: { sl: "kontakt" },
  "dla-mediow": { sl: "za-medije" },
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
 * (/sl/slovar/x), as /pl/… does in the Polish edition. Share images too: pages link their public address.
 */
export function slovenianRedirects(): (Rule & { permanent: true })[] {
  const sections = Object.entries(SEGMENTS)
    .filter(([pl, { sl }]) => sl !== pl)
    .flatMap(([pl, { sl }]) => [
      { source: `/sl/${pl}`, destination: `/sl/${sl}`, permanent: true as const },
      { source: `/sl/${pl}/:path+`, destination: `/sl/${sl}/:path+`, permanent: true as const },
    ]);
  // A renamed page directly under its section (/sl/dziaders/kobieta → /sl/dziaders/zenska) and its share image.
  const children = Object.values(SEGMENTS).flatMap(({ sl, children = {} }) =>
    Object.entries(children)
      .filter(([childPl, childSl]) => childSl !== childPl)
      .flatMap(([childPl, childSl]) => [
        { source: `/sl/${sl}/${childPl}`, destination: `/sl/${sl}/${childSl}`, permanent: true as const },
        { source: `/sl/${sl}/${childPl}/:path+`, destination: `/sl/${sl}/${childSl}/:path+`, permanent: true as const },
      ]),
  );
  return [...sections, ...children];
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
