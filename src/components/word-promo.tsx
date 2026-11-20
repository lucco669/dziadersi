import { getWordOfYear } from "@/content/word-of-year";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { cx, formatDate, quote } from "@/lib/typo";
import type { WordPhase } from "@/lib/word-of-year";
import { wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";
import { Stamp } from "./brand";

/*
 * Where the Dziaderskie Słowo Roku is announced elsewhere on the site: a one-line note (Raporty,
 * the yearbook, the press page) and, in December, a band on the home page. Both follow the phase.
 */

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
    band: {
      upcoming: "Komisja Orzekająca nominowała dwanaście zwrotów ze Słownika. Który w tym roku padał najczęściej?",
      voting: "Dwanaście zwrotów ze Słownika, jeden głos z przeglądarki. Który w tym roku padał najczęściej?",
      closed: "Głosowanie zamknięte. Komisja liczy głosy przy zamkniętych drzwiach.",
      announced: "Komisja ogłosiła wynik. Uchwała, protokół głosowania i certyfikat do pobrania.",
    },
    cta: { upcoming: "Zobacz nominowanych", voting: "Głosuj", closed: "Lista nominowanych", announced: "Zobacz uchwałę" } satisfies Record<WordPhase, string>,
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
    band: {
      upcoming: "Razsodna komisija je nominirala dvanajst izrazov iz Slovarja. Kateri je letos padel najpogosteje?",
      voting: "Dvanajst izrazov iz Slovarja, en glas na brskalnik. Kateri je letos padel najpogosteje?",
      closed: "Glasovanje je zaključeno. Komisija šteje glasove za zaprtimi vrati.",
      announced: "Komisija je razglasila izid. Sklep, zapisnik glasovanja in certifikat za prenos.",
    },
    cta: { upcoming: "Poglej nominirance", voting: "Glasuj", closed: "Seznam nominirancev", announced: "Poglej sklep" } satisfies Record<WordPhase, string>,
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

/** One line with the stamp of the phase, for the top of Raporty, the yearbook and the press page. */
export async function WordOfYearNote({ locale, className }: { locale: Locale; className?: string }) {
  const t = COPY[locale];
  const state = await getWordState();
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

/** The home page's band, in December only. */
export async function WordOfYearBand({ locale }: { locale: Locale }) {
  const state = await getWordState();
  if (!state.season) return null;
  const t = COPY[locale];
  const config = getWordOfYear(locale);
  const winner = state.result ? wordEntry(state.result.winner, locale) : null;
  return (
    <section className="border-y border-ink bg-paper-deep" aria-labelledby="slowo-roku-band">
      <div className="wrap grid items-center gap-6 py-10 md:grid-cols-12 md:py-12">
        <div className="md:col-span-7">
          <Stamp className="text-[0.75rem] [--stamp-rotate:-3deg]">{t.stamp[state.phase]}</Stamp>
          <h2 id="slowo-roku-band" className="mt-5 text-[clamp(2.3rem,5vw,4.2rem)] font-bold leading-none tracking-tight">
            {t.title(config.year)}
          </h2>
          <p className="mt-4 max-w-md text-xl leading-snug text-ink-soft">{t.band[state.phase]}</p>
          <Link href="/slowo-roku" className="btn mt-6 bg-ink text-paper hover:bg-red">
            {t.cta[state.phase]} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="md:col-span-5">
          {winner ? (
            <p className="text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.02em] text-red">{quote(winner.headword, locale)}</p>
          ) : (
            <ol className="border-t border-ink">
              {config.nominees.slice(0, 4).map((nominee, i) => (
                <li key={nominee.slug} className="flex items-baseline gap-3 border-b border-rule py-2.5">
                  <span className="w-6 font-sans text-[0.8rem] font-semibold text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg font-bold leading-tight">{quote(wordEntry(nominee.slug, locale).headword, locale)}</span>
                </li>
              ))}
              <li className="py-2.5 font-sans text-[0.9rem] text-ink-soft">…</li>
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
