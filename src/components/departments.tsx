import Link from "next/link";
import { DEPARTMENTS, STATUS_LABEL, type DepartmentStatus } from "@/content/departments";
import { cx, typo } from "@/lib/typo";
import { SectionHeading } from "./brand";

const STATUS_STYLE: Record<DepartmentStatus, string> = {
  live: "border-green bg-green text-paper",
  pilot: "border-green text-green",
  building: "border-bordo text-bordo",
  planned: "border-ink/25 text-ink-faint",
};

export function Departments() {
  return (
    <section id="dzialy" aria-labelledby="dzialy-title" className="wrap scroll-mt-20 pb-24 md:pb-32">
      <SectionHeading
        id="dzialy-title"
        number="05"
        kicker="Organizacja"
        aside="Lata 2026–2027"
        title="Plan działalności statutowej"
        dek={typo(
          "Instytut rozwija się etapami. Poniżej wykaz działów z aktualnym statusem. Działy planowane uruchomimy, gdy tylko skończymy remont piwnicy.",
        )}
      />

      <ol className="mt-14 border-t border-ink">
        {DEPARTMENTS.map((department, i) => (
          <li
            key={department.name}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 border-b border-rule py-5 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.5fr)_9.5rem] md:items-baseline md:gap-x-8"
          >
            <span className="kicker text-ink-faint md:pt-1">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.01em] md:text-2xl">
              {department.href ? (
                <Link href={department.href} className="transition-colors hover:text-green">
                  {department.name}
                </Link>
              ) : (
                department.name
              )}
            </h3>
            <p className="col-start-2 leading-snug text-ink-soft md:col-start-auto">{typo(department.description)}</p>
            <span className="col-start-2 mt-1 md:col-start-auto md:mt-0 md:justify-self-end">
              <span
                className={cx(
                  "kicker inline-block border px-2 py-1 text-[0.62rem]",
                  STATUS_STYLE[department.status],
                )}
              >
                {STATUS_LABEL[department.status]}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
