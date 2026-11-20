import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { compatibilityNote } from "@/lib/group";
import type { DepartmentRow, TeamMember, TeamReport, TeamVerdict } from "@/lib/team";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { Crowd } from "./crowd";
import { SpeciesPlate } from "./pictograms";

/*
 * The parts of a team check-up shared by the live team page and the printed report for HR.
 * No state, no effects: they render on the server (report) and in the polling client (page).
 */

const COPY = defineCopy({
  pl: {
    verdictKicker: "Orzeczenie Komisji Orzekającej",
    finding: "Orzeczenie",
    grounds: "Uzasadnienie",
    orders: "Zalecenia pokontrolne",
    department: "Dział",
    examined: "Przebadani",
    average: "Średnia",
    isotype: "Co najmniej podwyższone",
    dominant: "Gatunek dominujący",
    risk: "Ryzyko calla",
    riskLong: "Ryzyko „zróbmy calla”",
    nobody: "Jeszcze nikt",
    none: "brak",
    elevated: (count: number, total: number) => `${count} z ${total} ${plural(total, "osoby", "osób", "osób")} z wynikiem co najmniej podwyższonym`,
    people: (count: number) => `${count} ${plural(count, "osoba", "osoby", "osób")}`,
    best: "Para najbardziej zgodna",
    worst: "Para najmniej zgodna",
    atRisk: "Dział zagrożony calem",
    pair: (a: string, b: string) => `${a} i ${b}`,
    percent: (value: number) => `Zgodność ${value}%`,
    apart: "Nie sadzać razem na spotkaniu zespołu.",
    riskNote: (value: number) => `Wskaźnik ${value}%. Spotkanie, które mogło być mailem, zostanie zwołane najpierw tutaj.`,
    riskWhole: "Cały zespół",
    method: "Wskaźnik: trzy piąte powinowactwa z Dziadersem Korporacyjnym, dwie piąte wyniku testu.",
    rank: "Lp.",
    nickname: "Pseudonim",
    diagnosis: "Rozpoznanie",
    score: "Wynik",
    noDepartment: "bez działu",
  },
  sl: {
    verdictKicker: "Odločba Razsodne komisije",
    finding: "Odločba",
    grounds: "Obrazložitev",
    orders: "Ukrepi po pregledu",
    department: "Oddelek",
    examined: "Pregledani",
    average: "Povprečje",
    isotype: "Najmanj povišano",
    dominant: "Prevladujoča vrsta",
    risk: "Tveganje za call",
    riskLong: "Tveganje za »dajmo en call«",
    nobody: "Še nihče",
    none: "ni",
    elevated: (count: number, total: number) => `${count} od ${total} ${pluralSl(total, "osebe", "oseb", "oseb", "oseb")} z najmanj povišanim rezultatom`,
    people: (count: number) => `${count} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")}`,
    best: "Najbolj združljiv par",
    worst: "Najmanj združljiv par",
    atRisk: "Oddelek, ogrožen s callom",
    pair: (a: string, b: string) => `${a} in ${b}`,
    percent: (value: number) => `Združljivost ${value} %`,
    apart: "Na sestanku kolektiva ju ne posaditi skupaj.",
    riskNote: (value: number) => `Kazalnik ${value} %. Sestanek, ki bi lahko bil mejl, bo najprej sklican tukaj.`,
    riskWhole: "Ves kolektiv",
    method: "Kazalnik: tri petine sorodnosti s Korporativnim dziadersom, dve petini rezultata testa.",
    rank: "Zap. št.",
    nickname: "Vzdevek",
    diagnosis: "Diagnoza",
    score: "Rezultat",
    noDepartment: "brez oddelka",
  },
});

/** A percentage as each edition writes it: "83%", "83 %" (non-breaking). */
const percent = (value: number, locale: Locale) => (locale === "sl" ? `${value} %` : `${value}%`);

const STAMP_ORDER: TeamVerdict["key"][] = ["nie", "tak", "kliniczne"];
const STAMP_LABELS: Record<Locale, Record<TeamVerdict["key"], string>> = {
  pl: { nie: "To jeszcze nie dziaderstwo", tak: "To już dziaderstwo", kliniczne: "Dziaderstwo kliniczne" },
  sl: { nie: "To še ni dziaderstvo", tak: "To že je dziaderstvo", kliniczne: "Klinično dziaderstvo" },
};

/** The Commission's three stamps, the chosen one inked: the same ballot as in the Komisja. */
export function VerdictStamps({ verdict, locale, className }: { verdict: TeamVerdict; locale: Locale; className?: string }) {
  return (
    <ol className={cx("flex flex-wrap gap-3", className)}>
      {STAMP_ORDER.map((key) => {
        const chosen = key === verdict.key;
        return (
          <li
            key={key}
            aria-current={chosen ? "true" : undefined}
            className={cx(
              "border-4 border-double px-3 py-2 font-sans text-[0.78rem] font-bold uppercase leading-none tracking-[0.12em]",
              chosen ? "ink-worn rotate-[-3deg] border-red text-red" : "border-rule text-ink-faint print:hidden",
            )}
          >
            {STAMP_LABELS[locale][key]}
          </li>
        );
      })}
    </ol>
  );
}

/** `compact`: on the A4 report, the ruling across the sheet and the grounds and orders under it. */
export function CommissionVerdict({ verdict, locale, heading = "h2", compact = false }: { verdict: TeamVerdict; locale: Locale; heading?: "h2" | "h3" | "h4"; compact?: boolean }) {
  const t = COPY[locale];
  const Heading = heading;
  return (
    <div className={cx("grid gap-10", !compact && "lg:grid-cols-12", compact && "gap-7")}>
      <div className={cx(!compact && "lg:col-span-5")}>
        <p className="label text-red">{t.verdictKicker}</p>
        <VerdictStamps verdict={verdict} locale={locale} className="mt-5" />
        <Heading className={cx("mt-6 font-bold leading-[1.08]", compact ? "max-w-xl text-[1.45rem]" : "text-[clamp(1.6rem,3vw,2.2rem)]")}>{typo(verdict.finding)}</Heading>
      </div>
      <div className={cx("grid gap-8 md:grid-cols-2 print:grid-cols-2", !compact && "lg:col-span-7")}>
        <div>
          <p className="label border-b border-ink pb-2 text-ink-soft">{t.grounds}</p>
          {verdict.grounds.map((line) => (
            <p key={line} className="mt-3 leading-snug">{typo(line)}</p>
          ))}
        </div>
        <div>
          <p className="label border-b border-ink pb-2 text-ink-soft">{t.orders}</p>
          <ol className="mt-1">
            {verdict.orders.map((order, i) => (
              <li key={order} className="grid grid-cols-[1.6rem_1fr] border-b border-rule py-3 leading-snug">
                <span className="font-sans text-[0.9rem] font-semibold text-red">{i + 1}.</span>
                <span>{typo(order)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Isotype({ row, locale, className }: { row: DepartmentRow; locale: Locale; className?: string }) {
  const total = row.members.length;
  if (!total) return null;
  return (
    <Crowd
      count={row.elevated}
      total={total}
      columns={Math.min(total, 10)}
      ordered
      className={className}
      label={COPY[locale].elevated(row.elevated, total)}
    />
  );
}

/** Departments as rows on paper and wide screens, as cards on a phone. */
export function DepartmentTable({ rows, locale, print = false }: { rows: DepartmentRow[]; locale: Locale; print?: boolean }) {
  const t = COPY[locale];
  const riskiest = Math.max(...rows.map((row) => row.risk));
  return (
    <div>
      <table className={cx("w-full border-collapse text-left", !print && "hidden md:table")}>
        <thead>
          <tr className="border-y border-ink">
            {[t.department, t.examined, t.average, t.isotype, t.dominant, t.risk].map((label, i) => (
              <th key={label} scope="col" className={cx("label py-3 pr-4 font-normal text-ink-soft", (i === 1 || i === 2 || i === 5) && "text-right")}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-rule align-middle">
              <th scope="row" className="py-4 pr-4 text-xl font-bold leading-tight">{row.name}</th>
              <td className="py-4 pr-4 text-right tabular-nums">{row.members.length}</td>
              <td className="py-4 pr-4 text-right text-2xl font-bold tabular-nums">{row.members.length ? percent(row.average, locale) : "–"}</td>
              <td className="w-[11rem] py-4 pr-4">{row.members.length ? <Isotype row={row} locale={locale} className="h-9 max-w-full" /> : <span className="label text-ink-faint">{t.nobody}</span>}</td>
              <td className="py-4 pr-4">
                {row.dominant ? (
                  <span className="flex items-center gap-3">
                    <SpeciesPlate species={row.dominant.species.key} className="w-12 shrink-0" />
                    <span className="leading-tight">{row.dominant.species.name}</span>
                  </span>
                ) : (
                  <span className="label text-ink-faint">{row.members.length ? t.none : "–"}</span>
                )}
              </td>
              <td className={cx("py-4 text-right text-xl font-bold tabular-nums", row.members.length > 0 && row.risk === riskiest && "text-red")}>
                {row.members.length ? percent(row.risk, locale) : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!print && (
        <ol className="border-t border-ink md:hidden">
          {rows.map((row) => (
            <li key={row.name} className="border-b border-rule py-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-bold leading-tight">{row.name}</h3>
                <span className="text-3xl font-bold tabular-nums">{row.members.length ? percent(row.average, locale) : "–"}</span>
              </div>
              <p className="label mt-1 text-ink-soft">
                {row.members.length ? t.people(row.members.length) : t.nobody}
                {row.members.length > 0 && <> · {t.risk}: <span className={cx(row.risk === riskiest && "text-red")}>{percent(row.risk, locale)}</span></>}
              </p>
              {row.members.length > 0 && <Isotype row={row} locale={locale} className="mt-3 h-12 max-w-full" />}
              {row.dominant && (
                <p className="mt-3 flex items-center gap-3">
                  <SpeciesPlate species={row.dominant.species.key} className="w-12 shrink-0" />
                  <span className="label text-ink-soft">{t.dominant}: <span className="text-ink">{row.dominant.species.name}</span></span>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** The pairs and the department at risk. */
export function TeamFacts({ report, locale }: { report: TeamReport; locale: Locale }) {
  const t = COPY[locale];
  const { best, worst, riskiest } = report;
  const facts = [
    best && { label: t.best, value: t.pair(best.a.label, best.b.label), note: `${t.percent(best.value)}. ${compatibilityNote(best.value, locale)}` },
    worst && { label: t.worst, value: t.pair(worst.a.label, worst.b.label), note: `${t.percent(worst.value)}. ${t.apart}` },
    riskiest && { label: t.atRisk, value: riskiest.index === null ? t.riskWhole : riskiest.name, note: t.riskNote(riskiest.risk), red: true },
  ].filter((fact): fact is { label: string; value: string; note: string; red?: boolean } => Boolean(fact));
  if (!facts.length) return null;
  return (
    <div>
      <dl className="grid gap-8 md:grid-cols-3 print:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="border-t border-ink pt-4">
            <dt className="label text-ink-soft">{fact.label}</dt>
            <dd className={cx("mt-2 break-words text-2xl font-bold leading-tight", fact.red && "text-red")}>{fact.value}</dd>
            <dd className="mt-2 font-sans text-[0.92rem] leading-snug text-ink-soft">{typo(fact.note)}</dd>
          </div>
        ))}
      </dl>
      <p className="label mt-6 text-ink-faint">{t.method}</p>
    </div>
  );
}

/** Everyone examined, highest score first, with their department. */
export function TeamRoster({ members, departments, locale, links = true }: { members: TeamMember[]; departments: string[]; locale: Locale; links?: boolean }) {
  const t = COPY[locale];
  return (
    <ol className="border-t border-ink">
      {members.map((member, i) => {
        const body = (
          <>
            <span className="font-sans text-[0.95rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className={cx("block break-words text-[1.35rem] font-bold leading-tight", links && "transition-colors group-hover:text-red")}>{member.label}</span>
              <span className="label mt-1 block text-ink-soft">
                {departments.length ? (member.department !== null ? departments[member.department] : t.noDepartment) + " · " : ""}
                {member.result.diagnosis.name}
              </span>
            </span>
            <span className="text-right text-[1.8rem] font-bold leading-none tabular-nums">
              {member.result.score}
              <span className="text-[0.5em]">%</span>
            </span>
          </>
        );
        const grid = "grid grid-cols-[2.2rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-rule py-4";
        return (
          <li key={member.order} className="print:break-inside-avoid">
            {links ? <Link href={`/wynik/${member.result.code}`} className={cx("group", grid)}>{body}</Link> : <div className={grid}>{body}</div>}
          </li>
        );
      })}
    </ol>
  );
}

export const teamReportCopy = COPY;
