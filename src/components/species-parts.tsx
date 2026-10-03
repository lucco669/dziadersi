import { getRegions, REGION_GRID, regionFullName } from "@/content/regions";
import { getStatuses, statusLabel, type Species, type Status } from "@/content/species";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { monthsShort } from "@/lib/calendar";
import { cx, typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: {
    traits: "Profil behawioralny (0–100)",
    status: "Status ochrony",
    calendar: "Kalendarz aktywności",
    activity: (month: string, level: number) => `${month}: aktywność ${["brak", "niska", "średnia", "wysoka"][level]}`,
    range: "Zasięg występowania",
    region: (code: string) => getRegions("pl")[code].name,
    regional: "Gatunek regionalny, poza tym województwem występuje sporadycznie.",
    occasion: (occasion: string) => `Cała Polska, ale tylko ${occasion}.`,
    occasional: "Gatunek okazjonalny: poza swoją okazją zachowuje się jak gatunek pospolity.",
    nationwide: "Cała Polska.",
    nationwideText: "Gatunek ogólnopolski, bez wyraźnych preferencji regionalnych.",
  },
  sl: {
    traits: "Vedenjski profil (0–100)",
    status: "Varstveni status",
    calendar: "Koledar aktivnosti",
    activity: (month: string, level: number) =>
      level ? `${month}: aktivnost ${["", "nizka", "srednja", "visoka"][level]}` : `${month}: brez aktivnosti`,
    range: "Območje razširjenosti",
    region: (code: string) => regionFullName(code, "sl"),
    regional: "Regionalna vrsta, zunaj tega vojvodstva se pojavlja sporadično.",
    occasion: (occasion: string) => `Vsa Poljska, a samo ${occasion}.`,
    occasional: "Priložnostna vrsta: zunaj svoje priložnosti se vede kot navadna vrsta.",
    nationwide: "Vsa Poljska.",
    nationwideText: "Vsepoljska vrsta, brez izrazitih regionalnih preferenc.",
  },
});

export async function TraitBars({ traits }: { traits: Species["traits"] }) {
  const t = COPY[await getLocale()];
  return (
    <div>
      <p className="label text-ink-soft">{t.traits}</p>
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

export async function StatusScale({ status, note }: { status: Status; note: string }) {
  const locale = await getLocale();
  const statuses = getStatuses(locale);
  const label = statusLabel(status, locale);
  return (
    <div>
      <p className="label text-ink-soft">{COPY[locale].status}</p>
      <ol className="mt-4 grid grid-cols-7 border border-ink">
        {statuses.map((item, i) => (
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
        <span>{statuses[0].label}</span>
        <span>{statuses[statuses.length - 1].label}</span>
      </p>
      <p className="mt-4 leading-snug">
        <span className="font-bold">{label.charAt(0).toUpperCase() + label.slice(1)}.</span> {typo(note)}
      </p>
    </div>
  );
}

const CALENDAR_FILL = ["bg-ink/[0.07]", "bg-ink/25", "bg-ink/55", "bg-ink"];

/** Twelve months of activity, January to December. */
export async function ActivityCalendar({ months }: { months: number[] }) {
  const locale = await getLocale();
  const t = COPY[locale];
  const names = monthsShort(locale);
  return (
    <figure>
      <figcaption className="label text-ink-soft">{t.calendar}</figcaption>
      <ol className="mt-4 grid grid-cols-12 gap-1">
        {months.map((level, i) => (
          <li key={names[i]} className="text-center">
            <span className={cx("block h-7", CALENDAR_FILL[level])} title={t.activity(names[i], level)} />
            <span className="mt-1.5 block font-sans text-[0.7rem] font-semibold uppercase text-ink-soft">
              {names[i].charAt(0)}
            </span>
            <span className="sr-only">{t.activity(names[i], level)}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Where a regional species lives, on the same tile grid as the national map. */
export async function RangeMap({ region, occasion }: { region?: string; occasion?: string }) {
  const t = COPY[await getLocale()];
  return (
    <figure>
      <figcaption className="label text-ink-soft">{t.range}</figcaption>
      <div className="mt-4 flex items-center gap-5">
        <div className="grid w-28 shrink-0 grid-cols-4 gap-[3px]" aria-hidden="true">
          {REGION_GRID.flat().map((code) => (
            <span
              key={code}
              className={cx("aspect-square", region ? (code === region ? "bg-red" : "bg-ink/10") : occasion ? "bg-ink/30" : "bg-ink/70")}
            />
          ))}
        </div>
        <p className="leading-snug">
          {region ? (
            <>
              <span className="font-bold">{t.region(region)}.</span> {t.regional}
            </>
          ) : occasion ? (
            <>
              <span className="font-bold">{t.occasion(occasion)}</span> {t.occasional}
            </>
          ) : (
            <>
              <span className="font-bold">{t.nationwide}</span> {t.nationwideText}
            </>
          )}
        </p>
      </div>
    </figure>
  );
}

/** A species in a listing: the plate, the name, the Latin name and the one-liner. */
export async function SpeciesTile({ species, className }: { species: Species; className?: string }) {
  const locale = await getLocale();
  return (
    <Link href={`/atlas/${species.slug}`} className={cx("group block", className)}>
      <SpeciesPlate species={species.key} className="w-full" />
      <span className="label mt-3 flex justify-between gap-3 text-ink-soft">
        <span>{species.code}</span>
        <abbr title={statusLabel(species.status, locale)} className="no-underline">
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
