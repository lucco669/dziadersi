import type { Locale } from "@/i18n/config";
import { overlay, type Text } from "@/i18n/overlay";
import { WORD_OF_YEAR_SL } from "./sl/word-of-year";

/*
 * Dziaderskie Słowo Roku: the Komisja Orzekająca shortlists phrases from the Słownik and the
 * public votes in December. The dates are Warsaw time. PWN announces the Młodzieżowe Słowo Roku
 * on 8 December 2026, so the Institute announces in the same week, two days later, while the
 * newsrooms are still writing about words of the year.
 *
 * Votes are stored under the Polish dictionary slug, in both editions. The list of nominees is
 * frozen once voting opens: a vote is only counted for a slug on this list.
 */

export type Nominee = {
  /** The Polish slug of the Słownik entry. Stable: votes are stored under it. */
  slug: string;
  /** Why the Komisja nominated it, one or two sentences. */
  nomination: string;
};

export type WordOfYear = {
  year: number;
  /** Voting opens, inclusive. ISO with the Warsaw offset. */
  opens: string;
  /** Voting closes, exclusive. */
  closes: string;
  /** The Komisja announces the result. */
  announced: string;
  /** The PWN gala, for the press notes. */
  pwn: string;
  /** Standings are shown live from this many votes. */
  standingsFrom: number;
  /** Below this many votes the Komisja chooses the word itself. */
  quorum: number;
  /** The Komisja's own choice, used below the quorum. One of the nominees. */
  reserve: string;
  /** The Polish slug of the year-end report that carries the result. */
  report: string;
  nominees: Nominee[];
};

export const WORD_OF_YEAR: WordOfYear = {
  year: 2026,
  opens: "2026-12-01T00:00:00+01:00",
  closes: "2026-12-09T00:00:00+01:00",
  announced: "2026-12-10T10:00:00+01:00",
  pwn: "2026-12-08",
  standingsFrom: 100,
  quorum: 30,
  reserve: "to-sie-jeszcze-przyda",
  report: "stan-dziaderstwa-2026",
  nominees: [
    {
      slug: "to-sie-jeszcze-przyda",
      nomination: "Najczęściej zgłaszane hasło roku. Komisja odnotowała je w 9 na 10 piwnic objętych kontrolą.",
    },
    {
      slug: "kiedys-to-byly-zimy",
      nomination: "Nominowane po raz kolejny, niezależnie od opadów. W tym roku wypowiadane także w lipcu.",
    },
    {
      slug: "nie-ruszaj-mam-to-poustawiane",
      nomination: "Zwrot roku w kategorii elektroniki użytkowej. Dotyczy także urządzeń, których nikt nie umie obsługiwać.",
    },
    {
      slug: "diesel-to-jest-diesel",
      nomination: "Nominacja za konsekwencję. Komisja nie znalazła argumentu, na który ten zwrot nie byłby odpowiedzią.",
    },
    {
      slug: "nie-tak-sie-rozpala",
      nomination: "Najczęściej słyszany zwrot sezonu grillowego. Poprzedza przejęcie szczypiec w 4 na 5 przypadków.",
    },
    {
      slug: "to-jest-moje-miejsce",
      nomination: "Nominacja z wniosku wspólnot mieszkaniowych, złożonego w imieniu 46 osób zajmujących 11 miejsc.",
    },
    {
      slug: "zrobmy-calla",
      nomination: "Jedyny nominowany zwrot z języka angielskiego. Komisja zebrała się w tej sprawie trzykrotnie, w tym raz na callu.",
    },
    {
      slug: "udostepnij-zanim-usuna",
      nomination: "Zwrot o największym zasięgu. Treści, których dotyczył, są dostępne do dziś.",
    },
    {
      slug: "zgas-swiatlo-prad-nie-jest-za-darmo",
      nomination: "Nominacja w związku z rachunkami. Komisja obradowała przy zgaszonym świetle.",
    },
    {
      slug: "ja-tu-stalem",
      nomination: "Zwrot roku w kategorii kolejek. Prawdziwość twierdzenia nie została ustalona w żadnym z 312 sporów.",
    },
    {
      slug: "znowu-puszczaja-kevina",
      nomination: "Nominacja sezonowa. Zdziwienie jest coroczne, film również.",
    },
    {
      slug: "ja-nie-potrzebuje-instrukcji",
      nomination: "Nominacja z wniosku Pracowni Montażowej. Zapasowe elementy przechowywane są w szufladzie pod telewizorem.",
    },
  ],
};

type WordOfYearText = { nominees: Text<Nominee, "slug">[] };

/** The Slovenian nominations, in the order of the Polish list. */
export type WordOfYearTextSl = WordOfYearText;

const EDITIONS: Record<Locale, WordOfYear> = {
  pl: WORD_OF_YEAR,
  sl: overlay(WORD_OF_YEAR, WORD_OF_YEAR_SL, "wordOfYear"),
};

export const getWordOfYear = (locale: Locale) => EDITIONS[locale];

export const isNominee = (slug: unknown): slug is string =>
  typeof slug === "string" && WORD_OF_YEAR.nominees.some((nominee) => nominee.slug === slug);
