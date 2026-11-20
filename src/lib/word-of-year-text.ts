import { DICTIONARY, getDictionary, type Entry } from "@/content/dictionary";
import { WORD_OF_YEAR } from "@/content/word-of-year";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { formatNumber, plural, pluralSl, quote } from "./typo";
import type { WordResult } from "./word-of-year";

/*
 * How the Komisja words its result, in one line (certificate, cards) and in the protocol
 * (the page and the year-end report). Honest about turnout: a small vote is called small.
 */

/** The edition's dictionary entry for a Polish slug. */
export function wordEntry(polishSlug: string, locale: Locale): Entry {
  const index = DICTIONARY.findIndex((entry) => entry.slug === polishSlug);
  return getDictionary(locale)[index];
}

const n = (locale: Locale, value: number) => `n = ${formatNumber(locale, value)}`;

/** "212 głosów", "212 glasov". */
const count = (locale: Locale, value: number) =>
  `${formatNumber(locale, value)} ${locale === "sl" ? pluralSl(value, "glas", "glasova", "glasovi", "glasov") : plural(value, "głos", "głosy", "głosów")}`;

const COPY = defineCopy({
  pl: {
    votes: (total: number, share: number) => `${n("pl", total)} · ${share}% głosów`,
    tie: (total: number) => `${n("pl", total)} · Komisja rozstrzygnęła remis`,
    commission: (total: number) => `${n("pl", total)} · wybór Komisji, frekwencja poniżej kworum`,
    noData: "Wybór Komisji",
    protocol: {
      votes: (total: number, phrase: string, votes: number, share: number) =>
        `W głosowaniu oddano ${count("pl", total)}. Zwrot ${phrase} otrzymał ${count("pl", votes)}, czyli ${share}%. Komisja stwierdza ważność głosowania.`,
      tie: (total: number, phrases: string, votes: number, phrase: string) =>
        `W głosowaniu oddano ${count("pl", total)}. Zwroty ${phrases} otrzymały po ${count("pl", votes)}. Zgodnie z regulaminem remis rozstrzygnęła Komisja głosem przewodniczącego, na zwrot ${phrase}.`,
      commission: (total: number, quorum: number, phrase: string) =>
        `W głosowaniu oddano ${count("pl", total)}, mniej niż wymagane ${quorum}. Zgodnie z regulaminem słowo roku wskazała Komisja: zwrot ${phrase}. Oddane głosy odnotowano w protokole; Komisja dziękuje każdemu z głosujących z osobna.`,
      noData: (phrase: string) =>
        `Protokół z urny nie dotarł do Komisji w terminie. Zgodnie z regulaminem słowo roku wskazała Komisja: zwrot ${phrase}.`,
    },
    and: " i ",
  },
  sl: {
    votes: (total: number, share: number) => `${n("sl", total)} · ${share} % glasov`,
    tie: (total: number) => `${n("sl", total)} · izenačenje je razrešila Komisija`,
    commission: (total: number) => `${n("sl", total)} · izbor Komisije, udeležba pod sklepčnostjo`,
    noData: "Izbor Komisije",
    protocol: {
      votes: (total: number, phrase: string, votes: number, share: number) =>
        `Skupno število oddanih glasov: ${formatNumber("sl", total)}. Izraz ${phrase} je prejel ${count("sl", votes)}, torej ${share} %. Komisija ugotavlja veljavnost glasovanja.`,
      tie: (total: number, phrases: string, votes: number, phrase: string) =>
        `Skupno število oddanih glasov: ${formatNumber("sl", total)}. Izrazi ${phrases} so prejeli po ${count("sl", votes)}. V skladu s pravilnikom je izenačenje razrešila Komisija z glasom predsednika, za izraz ${phrase}.`,
      commission: (total: number, quorum: number, phrase: string) =>
        `Skupno število oddanih glasov: ${formatNumber("sl", total)}, kar je manj od zahtevanih ${quorum}. V skladu s pravilnikom je besedo leta določila Komisija: izraz ${phrase}. Oddani glasovi so zabeleženi v zapisniku; Komisija se zahvaljuje vsakemu glasovalcu posebej.`,
      noData: (phrase: string) =>
        `Zapisnik iz volilne skrinjice ni pravočasno prispel do Komisije. V skladu s pravilnikom je besedo leta določila Komisija: izraz ${phrase}.`,
    },
    and: " in ",
  },
});

const share = (result: WordResult) => result.standings.find((standing) => standing.slug === result.winner)?.share ?? 0;

/** "n = 212 · 34% głosów", "n = 212 · Komisja rozstrzygnęła remis". */
export function verdictLine(result: WordResult, locale: Locale) {
  const t = COPY[locale];
  if (result.total === null) return t.noData;
  if (result.decision === "votes") return t.votes(result.total, share(result));
  if (result.decision === "tie") return t.tie(result.total);
  return t.commission(result.total);
}

/** The protocol of the vote, in a sentence or three. */
export function protocolText(result: WordResult, locale: Locale) {
  const t = COPY[locale];
  const phrase = (slug: string) => quote(wordEntry(slug, locale).headword, locale);
  if (result.total === null) return t.protocol.noData(phrase(result.winner));
  const total = result.total;
  if (result.decision === "commission") return t.protocol.commission(total, WORD_OF_YEAR.quorum, phrase(result.winner));
  const top = result.standings[0];
  if (result.decision === "tie") {
    const names = result.tied.map(phrase);
    const listed = `${names.slice(0, -1).join(", ")}${t.and}${names.at(-1)}`;
    return t.protocol.tie(total, listed, top.votes, phrase(result.winner));
  }
  return t.protocol.votes(total, phrase(result.winner), top.votes, top.share);
}
