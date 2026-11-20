import { CASES, docket, getCases, getVerdicts, VERDICTS, type Case } from "@/content/cases";
import { getWordOfYear } from "@/content/word-of-year";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getCensus } from "@/lib/census";
import { getCommunity, type VerdictCounts } from "@/lib/community";
import { getToday } from "@/lib/today";
import { cx, formatDate, formatNumber, quote, typo } from "@/lib/typo";
import { protocolText, verdictLine, wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";

/*
 * The live annex of a year-end report: what visitors really did (the yearbook and the Komisja)
 * and the Dziaderskie Słowo Roku. Read from the same cached sources as the yearbook. Before the
 * announcement the word's part says when it will be filled in, so the report never looks unfinished.
 */

const MIN_VOTES = 5;

const COPY = defineCopy({
  pl: {
    title: "Aneks",
    read: (date: string) => `Stan na ${date}. Znaki umowne jak w Roczniku: „–” zjawisko nie wystąpiło, „·” brak informacji.`,
    figures: "A. Mały Rocznik Statystyczny",
    rows: {
      tests: "Badania w Narodowym Spisie Dziadersów",
      verdicts: "Głosy ławników Komisji Orzekającej",
      sightings: "Obserwacje terenowe",
      accounts: "Profile Dziaderskie",
      lines: "Wypowiedzi wylosowane w Rozmówkach",
      squares: "Pola skreślone w bingo",
      horn: "Naciśnięcia klaksonu w Teście",
      words: "Głosy w plebiscycie Słowo Roku",
    },
    yearbook: "Pełny Rocznik",
    disputed: "B. Najbardziej sporna sprawa roku",
    noDispute: (min: number) => `Żadna sprawa nie zebrała jeszcze ${min} głosów. Komisja wstrzymuje się z oceną, zamiast ogłaszać sporną sprawę na podstawie dwóch opinii.`,
    votes: (n: number) => `n = ${formatNumber("pl", n)}`,
    word: "C. Dziaderskie Słowo Roku",
    pending: {
      upcoming: (opens: string, announced: string) => `Głosowanie rozpocznie się ${opens}. Wynik zostanie dołączony do raportu ${announced}.`,
      voting: (closes: string, announced: string) => `Głosowanie trwa do ${closes}. Wynik zostanie dołączony do raportu ${announced}.`,
      closed: (announced: string) => `Głosowanie zostało zamknięte; Komisja liczy głosy. Wynik zostanie dołączony do raportu ${announced}.`,
    },
    vote: "Lista nominowanych i głosowanie",
    ruling: "Uchwała Komisji",
    at: (date: string, time: string) => `${date}, godz. ${time}`,
  },
  sl: {
    title: "Dodatek",
    read: (date: string) => `Stanje na dan ${date}. Dogovorjeni znaki kot v Letopisu: »–« pojava ni bilo, »·« ni podatka.`,
    figures: "A. Mali statistični letopis",
    rows: {
      tests: "Pregledi v Nacionalnem popisu dziadersov",
      verdicts: "Glasovi porotnikov Razsodne komisije",
      sightings: "Terenska opazovanja",
      accounts: "Dziaderski profili",
      lines: "Izjave, izžrebane v Pogovorniku",
      squares: "Prečrtana polja v bingu",
      horn: "Pritiski na hupo na testu",
      words: "Glasovi v izboru Beseda leta",
    },
    yearbook: "Celoten Letopis",
    disputed: "B. Najbolj sporni primer leta",
    noDispute: (min: number) => `Noben primer še ni zbral ${min} glasov. Komisija se vzdrži ocene, namesto da bi sporni primer razglasila na podlagi dveh mnenj.`,
    votes: (n: number) => `n = ${formatNumber("sl", n)}`,
    word: "C. Dziaderska beseda leta",
    pending: {
      upcoming: (opens: string, announced: string) => `Glasovanje se bo začelo ${opens}. Izid bo dodan poročilu ${announced}.`,
      voting: (closes: string, announced: string) => `Glasovanje traja do ${closes}. Izid bo dodan poročilu ${announced}.`,
      closed: (announced: string) => `Glasovanje je zaključeno; Komisija šteje glasove. Izid bo dodan poročilu ${announced}.`,
    },
    vote: "Seznam nominirancev in glasovanje",
    ruling: "Sklep Komisije",
    at: (date: string, time: string) => `${date} ob ${time}`,
  },
});

/** The case whose votes split most evenly, from MIN_VOTES votes; the edition's case at the Polish index. */
function mostDisputed(locale: Locale, cases: Record<string, VerdictCounts> | undefined) {
  const edition = getCases(locale);
  let best: { item: Case; counts: VerdictCounts; total: number; spread: number } | null = null;
  CASES.forEach((source, index) => {
    const counts = cases?.[source.slug] ?? {};
    const total = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
    if (total < MIN_VOTES) return;
    const spread = Math.max(...VERDICTS.map((option) => counts[option.key] ?? 0)) / total;
    if (!best || spread < best.spread) best = { item: edition[index], counts, total, spread };
  });
  return best as { item: Case; counts: VerdictCounts; total: number; spread: number } | null;
}

/** "·" without data, "–" for zero, else the number. */
const figure = (locale: Locale, value: number | null | undefined) =>
  value === null || value === undefined ? "·" : value === 0 ? "–" : formatNumber(locale, value);

export async function YearAnnex({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [census, community, word, today] = await Promise.all([getCensus(), getCommunity("counts"), getWordState(), getToday()]);
  const config = getWordOfYear(locale);
  const tallies = community?.tallies;
  const disputed = mostDisputed(locale, community?.verdicts.cases);
  const options = getVerdicts(locale);
  const read = community?.updated ?? census?.updated ?? today.date;
  const time = (iso: string) => new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  const announced = t.at(formatDate(locale, config.announced), time(config.announced));
  const lastDay = new Date(Date.parse(config.closes) - 60_000).toISOString();
  const winner = word.result ? wordEntry(word.result.winner, locale) : null;

  const rows: [string, number | null | undefined][] = [
    [t.rows.tests, census?.total],
    [t.rows.verdicts, community?.verdicts.total],
    [t.rows.sightings, community?.sightings.total],
    [t.rows.accounts, community?.accounts],
    [t.rows.lines, tallies ? (tallies.rozmowki ?? 0) : null],
    [t.rows.squares, tallies ? (tallies["bingo-pole"] ?? 0) : null],
    [t.rows.horn, tallies ? (tallies.klakson ?? 0) : null],
    // Not while the Komisja counts: nothing is published between the close and the announcement.
    ...(word.phase === "voting" || word.phase === "announced" ? ([[t.rows.words, word.total]] as [string, number | null][]) : []),
  ];

  return (
    <section aria-labelledby="aneks" className="mt-14">
      <h2 id="aneks" className="text-[clamp(1.75rem,3vw,2.3rem)] font-bold tracking-[-0.01em]">
        {t.title}
      </h2>
      <p className="label mt-2 text-ink-soft">{t.read(formatDate(locale, read))}</p>

      <h3 className="mt-8 text-xl font-bold">{t.figures}</h3>
      <dl className="mt-4 border-t border-ink">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-rule py-2.5">
            <dt className="leading-snug">{label}</dt>
            <dd className="font-sans text-[1.05rem] font-semibold tabular-nums">{figure(locale, value)}</dd>
          </div>
        ))}
      </dl>
      <Link href="/statystyki" className="link label mt-3 inline-block text-ink">
        {t.yearbook} <span aria-hidden="true">→</span>
      </Link>

      <h3 className="mt-10 text-xl font-bold">{t.disputed}</h3>
      {disputed ? (
        <div className="mt-4 border-t border-ink pt-4">
          <p className="label text-ink-soft">
            {docket(disputed.item)} · {t.votes(disputed.total)}
          </p>
          <Link href={`/czy-to-juz-dziaderstwo/${disputed.item.slug}`} className="mt-1 block text-[1.4rem] font-bold leading-tight transition-colors hover:text-red">
            {disputed.item.title}
          </Link>
          <ul className="mt-4 space-y-2">
            {options.map((option) => {
              const share = Math.round(((disputed.counts[option.key] ?? 0) / disputed.total) * 100);
              return (
                <li key={option.key} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3">
                  <span className="font-sans text-[0.9rem] leading-tight">{option.label}</span>
                  <span className="h-2.5 bg-ink/10">
                    <span className={cx("block h-full", option.key === "kliniczne" ? "bg-red" : "bg-ink")} style={{ width: `${share}%` }} />
                  </span>
                  <span className="text-right font-sans text-[0.9rem] font-semibold tabular-nums">{share}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-4 border-t border-ink pt-4 leading-relaxed text-ink-soft">{typo(t.noDispute(MIN_VOTES))}</p>
      )}

      <h3 className="mt-10 text-xl font-bold">{t.word}</h3>
      <div className="mt-4 border-t border-ink pt-4">
        {winner && word.result ? (
          <>
            <p className="text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.01em]">{quote(winner.headword, locale)}</p>
            <p className="mt-2 leading-snug">{typo(winner.senses[0].text)}</p>
            <p className="label mt-3 text-red">{verdictLine(word.result, locale)}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">{typo(protocolText(word.result, locale))}</p>
            <Link href="/slowo-roku" className="link label mt-3 inline-block text-ink">
              {t.ruling} <span aria-hidden="true">→</span>
            </Link>
          </>
        ) : (
          <>
            <p className="leading-relaxed">
              {typo(
                word.phase === "upcoming"
                  ? t.pending.upcoming(formatDate(locale, config.opens), announced)
                  : word.phase === "voting"
                    ? t.pending.voting(formatDate(locale, lastDay), announced)
                    : t.pending.closed(announced),
              )}
            </p>
            <Link href="/slowo-roku" className="link label mt-3 inline-block text-ink">
              {t.vote} <span aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
