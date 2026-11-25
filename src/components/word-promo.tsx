import { getWordOfYear } from "@/content/word-of-year";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { cx, formatDate, quote } from "@/lib/typo";
import type { WordPhase } from "@/lib/word-of-year";
import { wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";
import { Stamp } from "./brand";

const COPY = defineCopy({
  pl: {
    title: (year: number) => `Dziaderskie Słowo Roku ${year}`,
    stamp: { upcoming: "Nominacje", voting: "Głosowanie trwa", closed: "Komisja obraduje", announced: "Ogłoszono" } satisfies Record<WordPhase, string>,
    note: {
      upcoming: (range: string) => `Komisja Orzekająca nominowała dwanaście zwrotów. Głosowanie ${range}.`,
      voting: (closes: string) => `Komisja Orzekająca nominowała dwanaście zwrotów. Głosowanie trwa do ${closes}.`,
      closed: (announced: string) => `Głosowanie zamknięte. Wynik Komisja ogłosi ${announced}.`,
      announced: (phrase: string) => `Słowem roku został zwrot ${phrase}.`,
    },
    at: (date: string, time: string) => `${date}, godz. ${time}`,
  },
  sl: {
    title: (year: number) => `Dziaderska beseda leta ${year}`,
    stamp: { upcoming: "Nominacije", voting: "Glasovanje poteka", closed: "Komisija zaseda", announced: "Razglašeno" } satisfies Record<WordPhase, string>,
    note: {
      upcoming: (range: string) => `Razsodna komisija je nominirala dvanajst izrazov. Glasovanje ${range}.`,
      voting: (closes: string) => `Razsodna komisija je nominirala dvanajst izrazov. Glasovanje traja do ${closes}.`,
      closed: (announced: string) => `Glasovanje je zaključeno. Izid bo Komisija razglasila ${announced}.`,
      announced: (phrase: string) => `Beseda leta je postal izraz ${phrase}.`,
    },
    at: (date: string, time: string) => `${date} ob ${time}`,
  },
});

function noteText(locale: Locale, phase: WordPhase, winner: string | null) {
  const t = COPY[locale];
  const config = getWordOfYear(locale);
  const lastDay = new Date(Date.parse(config.closes) - 60_000);
  const intl = LOCALE_INFO[locale].intl;
  if (phase === "announced" && winner) return t.note.announced(quote(wordEntry(winner, locale).headword, locale));
  if (phase === "voting") return t.note.voting(formatDate(locale, lastDay, { day: "numeric", month: "long" }));
  if (phase === "closed") {
    const time = new Intl.DateTimeFormat(intl, { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" }).format(new Date(config.announced));
    return t.note.closed(t.at(formatDate(locale, config.announced, { day: "numeric", month: "long" }), time));
  }
  const range = new Intl.DateTimeFormat(intl, { timeZone: "Europe/Warsaw", day: "numeric", month: "long", year: "numeric" }).formatRange(new Date(config.opens), lastDay);
  return t.note.upcoming(range);
}

/** The homepage carries the note in the campaign month. Publication pages keep it year-round. */
export async function WordOfYearNote({
  locale, className, seasonalOnly = false,
}: {
  locale: Locale;
  className?: string;
  seasonalOnly?: boolean;
}) {
  const t = COPY[locale];
  const state = await getWordState();
  if (seasonalOnly && !state.season) return null;
  const config = getWordOfYear(locale);
  return (
    <Link
      href="/slowo-roku"
      className={cx("group flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink py-4", className)}
    >
      <Stamp className="text-[0.7rem]">{t.stamp[state.phase]}</Stamp>
      <span className="text-xl font-bold leading-tight transition-colors group-hover:text-red">{t.title(config.year)}</span>
      <span className="leading-snug text-ink-soft">{noteText(locale, state.phase, state.result?.winner ?? null)}</span>
      <span aria-hidden="true" className="ml-auto font-sans font-semibold transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
