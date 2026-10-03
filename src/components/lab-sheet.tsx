import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { labComment, labResults } from "@/lib/lab";
import type { Result } from "@/lib/test";
import { cx, typo } from "@/lib/typo";

const ARROW = { H: "↑", L: "↓", "": "" } as const;

const COPY = defineCopy({
  pl: {
    lab: "Zakład Diagnostyki Dziaderstwa IBD",
    sample: "Nr próbki",
    title: "Wyniki badań laboratoryjnych",
    patient: "Pacjent",
    anonymous: "osoba badana",
    taken: "Pobrano",
    material: "Materiał",
    proxy: "wywiad rodzinny",
    own: "odpowiedzi własne",
    ordered: "Zlecający",
    test: "Badanie",
    result: "Wynik",
    unit: "Jedn.",
    range: "Zakres ref.",
    norm: "norma",
    high: "powyżej normy",
    low: "poniżej normy",
    comment: "Komentarz diagnosty: ",
    diagnostician: "mgr Halina Śrubka, diagnosta laboratoryjny",
    caption: (flagged: number, total: number) => `Wyniki badań laboratoryjnych: ${flagged} z ${total} parametrów poza zakresem referencyjnym.`,
  },
  sl: {
    lab: "Oddelek za diagnostiko dziaderstva IBD",
    sample: "Št. vzorca",
    title: "Laboratorijski izvidi",
    patient: "Pacient",
    anonymous: "preiskovana oseba",
    taken: "Odvzeto",
    material: "Material",
    proxy: "heteroanamneza",
    own: "lastni odgovori",
    ordered: "Napotni zdravnik",
    test: "Preiskava",
    result: "Rezultat",
    unit: "Enota",
    range: "Ref. vrednosti",
    norm: "ref.",
    high: "povišano",
    low: "znižano",
    comment: "Komentar laboratorija: ",
    diagnostician: "mgr Halina Śrubka, inženirka laboratorijske biomedicine",
    caption: (flagged: number, total: number) => `Laboratorijski izvidi: ${flagged} od ${total} parametrov zunaj referenčnih vrednosti.`,
  },
});

/** The lab printout: a document, so it gets a frame like the certificate. */
export function LabSheet({ result, locale, className }: { result: Result; locale: Locale; className?: string }) {
  const t = COPY[locale];
  const rows = labResults(result, locale);
  const flagged = rows.filter((row) => row.flag).length;

  return (
    <figure className={cx("bg-card p-2", className)}>
      <div className="border border-ink px-4 pb-5 pt-4 md:px-7 md:pb-6">
        <p className="label flex flex-wrap justify-between gap-x-6 text-ink-soft">
          <span>{t.lab}</span>
          <span>
            {t.sample} {result.certificate}
          </span>
        </p>
        <p className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)] font-bold leading-none">{t.title}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-y border-ink py-3 font-sans text-[0.88rem] sm:grid-cols-4">
          <div>
            <dt className="text-ink-faint">{t.patient}</dt>
            <dd className="font-semibold">{result.name || t.anonymous}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">{t.taken}</dt>
            <dd className="font-semibold">{result.date}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">{t.material}</dt>
            <dd className="font-semibold">{result.proxy ? t.proxy : t.own}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">{t.ordered}</dt>
            <dd className="font-semibold">dr hab. Z. Wąsik</dd>
          </div>
        </dl>

        <table className="mt-2 w-full font-sans text-[0.9rem] leading-snug">
          <thead className="sr-only sm:not-sr-only">
            <tr className="text-left text-[0.78rem] text-ink-faint">
              <th scope="col" className="py-2 pr-3 font-medium">
                {t.test}
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-medium">
                {t.result}
              </th>
              <th scope="col" className="hidden py-2 pr-3 font-medium sm:table-cell">
                {t.unit}
              </th>
              <th scope="col" className="hidden py-2 text-right font-medium sm:table-cell">
                {t.range}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code} className="border-t border-rule align-baseline">
                <th scope="row" className="py-2 pr-3 text-left font-normal">
                  <span className="mr-2 inline-block min-w-[2.6rem] font-semibold">{row.code}</span>
                  {typo(row.name)}
                  <span className="block text-[0.78rem] text-ink-faint sm:hidden">
                    {t.norm} {row.range} {row.unit}
                  </span>
                </th>
                <td className={cx("whitespace-nowrap py-2 pr-3 text-right tabular-nums", row.flag && "font-semibold text-red")}>
                  {row.value}
                  <span className="inline-block w-5 text-center" aria-label={row.flag === "H" ? t.high : row.flag === "L" ? t.low : undefined}>
                    {ARROW[row.flag]}
                  </span>
                  <span className="text-ink-faint sm:hidden"> {row.unit}</span>
                </td>
                <td className="hidden whitespace-nowrap py-2 pr-3 text-ink-soft sm:table-cell">{row.unit}</td>
                <td className="hidden whitespace-nowrap py-2 text-right text-ink-soft tabular-nums sm:table-cell">{row.range}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 grid gap-4 border-t border-ink pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <p className="max-w-md text-[1rem] italic leading-snug">
            <span className="label not-italic text-ink-soft">{t.comment}</span>
            {typo(labComment(rows, locale))}
          </p>
          <p className="label text-right text-ink-soft">
            <span className="block font-serif text-[1.35rem] italic leading-none text-ink">
              H. Śrubka
            </span>
            <span className="mt-1.5 block border-t border-ink pt-1.5 text-[0.72rem]">{t.diagnostician}</span>
          </p>
        </div>
      </div>
      <figcaption className="sr-only">{t.caption(flagged, rows.length)}</figcaption>
    </figure>
  );
}
