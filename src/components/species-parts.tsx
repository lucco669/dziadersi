import Link from "next/link";
import { REGION_GRID, REGIONS } from "@/content/regions";
import { STATUSES, statusLabel, type Species, type Status } from "@/content/species";
import { MONTHS_SHORT } from "@/lib/calendar";
import { cx, typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

export function TraitBars({ traits }: { traits: Species["traits"] }) {
  return (
    <div>
      <p className="label text-ink-soft">Profil behawioralny (0–100)</p>
      <ul className="mt-4 space-y-4">
        {traits.map((trait) => (
          <li key={trait.label}>
            <div className="flex items-baseline justify-between gap-4 leading-snug">
              <span>{trait.label}</span>
              <span className="font-sans text-[0.9rem] font-semibold tabular-nums">{trait.value}</span>
            </div>
            <div className="mt-1.5 h-2 bg-ink/10">
              <div className="h-full bg-ink" style={{ width: `${trait.value}%` }} />
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
      <p className="label text-ink-soft">Status ochrony</p>
      <ol className="mt-4 grid grid-cols-7 border border-ink">
        {STATUSES.map((item, i) => (
          <li
            key={item.code}
            aria-current={item.code === status ? "true" : undefined}
            className={cx(
              "py-2 text-center font-sans text-[0.8rem] font-semibold",
              i > 0 && "border-l border-ink",
              item.code === status ? "bg-red text-paper" : "text-ink-soft",
            )}
          >
            <abbr title={item.label} className="no-underline">
              {item.code}
            </abbr>
          </li>
        ))}
      </ol>
      <p className="label mt-2 flex justify-between text-[0.75rem] text-ink-soft">
        <span>wymarły</span>
        <span>najmniejszej troski</span>
      </p>
      <p className="mt-4 leading-snug">
        <span className="font-bold">{label.charAt(0).toUpperCase() + label.slice(1)}.</span> {typo(note)}
      </p>
    </div>
  );
}

const CALENDAR_FILL = ["bg-ink/[0.07]", "bg-ink/25", "bg-ink/55", "bg-ink"];
const ACTIVITY = ["brak", "niska", "średnia", "wysoka"];

/** Twelve months of activity, January to December. */
export function ActivityCalendar({ months }: { months: number[] }) {
  return (
    <figure>
      <figcaption className="label text-ink-soft">Kalendarz aktywności</figcaption>
      <ol className="mt-4 grid grid-cols-12 gap-1">
        {months.map((level, i) => (
          <li key={MONTHS_SHORT[i]} className="text-center">
            <span className={cx("block h-7", CALENDAR_FILL[level])} title={`${MONTHS_SHORT[i]}: aktywność ${ACTIVITY[level]}`} />
            <span className="mt-1.5 block font-sans text-[0.7rem] font-semibold uppercase text-ink-soft">
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
      <figcaption className="label text-ink-soft">Zasięg występowania</figcaption>
      <div className="mt-4 flex items-center gap-5">
        <div className="grid w-28 shrink-0 grid-cols-4 gap-[3px]" aria-hidden="true">
          {REGION_GRID.flat().map((code) => (
            <span key={code} className={cx("aspect-square", region ? (code === region ? "bg-red" : "bg-ink/10") : "bg-ink/70")} />
          ))}
        </div>
        <p className="leading-snug">
          {region ? (
            <>
              <span className="font-bold">{REGIONS[region].name}.</span> Gatunek regionalny, poza tym województwem występuje
              sporadycznie.
            </>
          ) : (
            <>
              <span className="font-bold">Cała Polska.</span> Gatunek ogólnopolski, bez wyraźnych preferencji regionalnych.
            </>
          )}
        </p>
      </div>
    </figure>
  );
}

/** A species in a listing: the plate, the name, the Latin name and the one-liner. */
export function SpeciesTile({ species, className }: { species: Species; className?: string }) {
  return (
    <Link href={`/atlas/${species.slug}`} className={cx("group block", className)}>
      <SpeciesPlate species={species.key} className="w-full" />
      <span className="label mt-3 flex justify-between gap-3 text-ink-soft">
        <span>{species.code}</span>
        <abbr title={statusLabel(species.status)} className="no-underline">
          {species.status}
        </abbr>
      </span>
      <span className="mt-1 block text-[1.3rem] font-bold leading-tight transition-colors group-hover:text-red">
        {species.name}
      </span>
      <span className="mt-0.5 block italic text-ink-soft">{species.latin}</span>
      <span className="mt-2 block font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(species.teaser)}</span>
    </Link>
  );
}
