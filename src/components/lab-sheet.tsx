import { labComment, labResults } from "@/lib/lab";
import type { Result } from "@/lib/test";
import { cx, typo } from "@/lib/typo";

const ARROW = { H: "↑", L: "↓", "": "" } as const;

/** The lab printout: a document, so it gets a frame like the certificate. */
export function LabSheet({ result, className }: { result: Result; className?: string }) {
  const rows = labResults(result);
  const flagged = rows.filter((row) => row.flag).length;

  return (
    <figure className={cx("bg-card p-2", className)}>
      <div className="border border-ink px-4 pb-5 pt-4 md:px-7 md:pb-6">
        <p className="label flex flex-wrap justify-between gap-x-6 text-ink-soft">
          <span>Zakład Diagnostyki Dziaderstwa IBD</span>
          <span>Nr próbki {result.certificate}</span>
        </p>
        <p className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)] font-bold leading-none">Wyniki badań laboratoryjnych</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-y border-ink py-3 font-sans text-[0.88rem] sm:grid-cols-4">
          <div>
            <dt className="text-ink-faint">Pacjent</dt>
            <dd className="font-semibold">{result.name || "osoba badana"}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Pobrano</dt>
            <dd className="font-semibold">{result.date}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Materiał</dt>
            <dd className="font-semibold">{result.proxy ? "wywiad rodzinny" : "odpowiedzi własne"}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Zlecający</dt>
            <dd className="font-semibold">dr hab. Z. Wąsik</dd>
          </div>
        </dl>

        <table className="mt-2 w-full font-sans text-[0.9rem] leading-snug">
          <thead className="sr-only sm:not-sr-only">
            <tr className="text-left text-[0.78rem] text-ink-faint">
              <th scope="col" className="py-2 pr-3 font-medium">
                Badanie
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-medium">
                Wynik
              </th>
              <th scope="col" className="hidden py-2 pr-3 font-medium sm:table-cell">
                Jedn.
              </th>
              <th scope="col" className="hidden py-2 text-right font-medium sm:table-cell">
                Zakres ref.
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
                    norma {row.range} {row.unit}
                  </span>
                </th>
                <td className={cx("whitespace-nowrap py-2 pr-3 text-right tabular-nums", row.flag && "font-semibold text-red")}>
                  {row.value}
                  <span className="inline-block w-5 text-center" aria-label={row.flag === "H" ? "powyżej normy" : row.flag === "L" ? "poniżej normy" : undefined}>
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
            <span className="label not-italic text-ink-soft">Komentarz diagnosty: </span>
            {typo(labComment(rows))}
          </p>
          <p className="label text-right text-ink-soft">
            <span className="block font-serif text-[1.35rem] italic leading-none text-ink">
              H. Śrubka
            </span>
            <span className="mt-1.5 block border-t border-ink pt-1.5 text-[0.72rem]">mgr Halina Śrubka, diagnosta laboratoryjny</span>
          </p>
        </div>
      </div>
      <figcaption className="sr-only">{`Wyniki badań laboratoryjnych: ${flagged} z ${rows.length} parametrów poza zakresem referencyjnym.`}</figcaption>
    </figure>
  );
}
