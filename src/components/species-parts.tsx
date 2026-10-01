import Link from "next/link";
import { REGION_GRID, REGIONS } from "@/content/regions";
import { STATUSES, statusLabel, type Species, type Status } from "@/content/species";
import { MONTHS_SHORT } from "@/lib/calendar";
import { cx, typo } from "@/lib/typo";

export function TraitBars({ traits }: { traits: Species["traits"] }) {
  return (
    <div>
      <p className="kicker text-ink-faint">Profil behawioralny (0–100)</p>
      <ul className="mt-5 space-y-4">
        {traits.map((trait) => (
          <li key={trait.label}>
            <div className="flex items-baseline justify-between gap-4 text-[0.95rem] leading-snug">
              <span>{trait.label}</span>
              <span className="font-mono text-[0.8rem] tabular-nums">{trait.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-ink/10">
              <div className="h-full bg-green" style={{ width: `${trait.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatusScale({ status, note }: { status: Status; note: string }) {
  const label = statusLabel(status);
  return (
    <div>
      <p className="kicker text-ink-faint">Status ochrony</p>
      <ol className="mt-5 grid grid-cols-7 border border-ink">
        {STATUSES.map((item, i) => (
          <li
            key={item.code}
            aria-current={item.code === status ? "true" : undefined}
            className={cx(
              "py-2 text-center font-mono text-[0.72rem] font-semibold",
              i > 0 && "border-l border-ink",
              item.code === status ? "bg-ink text-paper" : "text-ink-faint",
            )}
          >
            <abbr title={item.label} className="no-underline">
              {item.code}
            </abbr>
          </li>
        ))}
      </ol>
      <p className="kicker mt-2 flex justify-between text-[0.58rem] text-ink-faint">
        <span>Wymarły</span>
        <span>Najmniejszej troski</span>
      </p>
      <p className="mt-4 text-[0.95rem] leading-snug">
        <span className="font-semibold">{label.charAt(0).toUpperCase() + label.slice(1)}.</span> {typo(note)}
      </p>
    </div>
  );
}

const CALENDAR_FILL = ["bg-ink/[0.06]", "bg-green/25", "bg-green/60", "bg-green"];
const ACTIVITY = ["brak", "niska", "średnia", "wysoka"];

/** Twelve months of activity, January to December. */
export function ActivityCalendar({ months }: { months: number[] }) {
  return (
    <figure>
      <figcaption className="kicker text-ink-faint">Kalendarz aktywności</figcaption>
      <ol className="mt-4 grid grid-cols-12 gap-1">
        {months.map((level, i) => (
          <li key={MONTHS_SHORT[i]} className="text-center">
            <span
              className={cx("block h-7", CALENDAR_FILL[level])}
              title={`${MONTHS_SHORT[i]}: aktywność ${ACTIVITY[level]}`}
            />
            <span className="mt-1.5 block font-mono text-[0.58rem] uppercase text-ink-faint">
              {MONTHS_SHORT[i].charAt(0)}
            </span>
            <span className="sr-only">{`${MONTHS_SHORT[i]}: aktywność ${ACTIVITY[level]}`}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Where a regional species lives, on the same tile grid as the national map. */
export function RangeMap({ region }: { region?: string }) {
  return (
    <figure>
      <figcaption className="kicker text-ink-faint">Zasięg występowania</figcaption>
      <div className="mt-4 flex items-center gap-5">
        <div className="grid w-28 shrink-0 grid-cols-4 gap-[3px]" aria-hidden="true">
          {REGION_GRID.flat().map((code) => (
            <span key={code} className={cx("aspect-square", region ? (code === region ? "bg-bordo" : "bg-ink/10") : "bg-green/70")} />
          ))}
        </div>
        <p className="text-[0.95rem] leading-snug">
          {region ? (
            <>
              <span className="font-semibold">{REGIONS[region].name}.</span> Gatunek regionalny, poza tym
              województwem występuje sporadycznie.
            </>
          ) : (
            <>
              <span className="font-semibold">Cała Polska.</span> Gatunek ogólnopolski, bez wyraźnych preferencji
              regionalnych.
            </>
          )}
        </p>
      </div>
    </figure>
  );
}

/** Compact catalogue card used on the Atlas index and in "related species". */
export function SpeciesCard({ species, className }: { species: Species; className?: string }) {
  return (
    <Link
      href={`/atlas/${species.slug}`}
      className={cx(
        "group flex h-full flex-col border border-ink bg-paper-light transition-colors hover:bg-paper",
        className,
      )}
    >
      <span className="kicker flex justify-between gap-3 border-b border-ink px-5 py-2.5">
        <span>{species.code}</span>
        <abbr title={statusLabel(species.status)} className="text-ink-faint no-underline">
          {species.status}
        </abbr>
      </span>
      <span className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="font-display text-[1.6rem] font-bold leading-[1.05] tracking-[-0.015em] transition-colors group-hover:text-green">
          {species.name}
        </span>
        <span className="mt-1 text-[0.95rem] text-ink-soft">
          <em>{species.latin}</em>
        </span>
        <span className="mt-4 flex-1 leading-snug">{typo(species.teaser)}</span>
        <span className="mt-5 grid grid-cols-12 gap-[2px]" aria-hidden="true">
          {species.calendar.map((level, i) => (
            <span key={i} className={cx("h-1.5", CALENDAR_FILL[level])} />
          ))}
        </span>
      </span>
    </Link>
  );
}
