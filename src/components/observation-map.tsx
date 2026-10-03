"use client";

import { useState } from "react";
import { getRegions, REGION_GRID, REGIONS, regionFullName } from "@/content/regions";
import type { SpeciesKey } from "@/content/species";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { cx, formatNumber, plural, pluralSl, typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

export type MapSpecies = { key: SpeciesKey; name: string; slug: string; total: number };

const SHADES = ["bg-paper-deep text-ink-faint", "bg-[#d3cbbb] text-ink", "bg-[#a69d8c] text-ink", "bg-[#5d574e] text-paper", "bg-ink text-paper"];

const COPY = defineCopy({
  pl: {
    species: "Gatunek",
    all: "Wszystkie gatunki",
    regions: "Województwa",
    reports: (n: number) => plural(n, "zgłoszenie", "zgłoszenia", "zgłoszeń"),
    caption: (species: string, unplaced: string) =>
      `Mapa 2. Zgłoszenia obserwatorów terenowych według województw${species}. Układ kafelkowy, kształty uproszczono. Bez województwa: ${unplaced}. Źródło: IBD.`,
    share: (percent: number) => `${percent}% kraju`,
    top: "Najczęściej obserwowane w województwie",
    none: (code: string) => `${getRegions("pl")[code].name}: brak zgłoszeń. Dziaders tam jest, tylko nikt go jeszcze nie zgłosił.`,
    busiest: (code: string, n: string) => `: najwięcej zgłoszeń z województwa: ${getRegions("pl")[code].name} (${n}).`,
    noRegion: ": jeszcze bez zgłoszeń z podanym województwem.",
    legend: ["0", "do 20%", "do 40%", "do 70%", "ponad 70%"],
    legendNote: "Odcień względem województwa z największą liczbą zgłoszeń.",
  },
  sl: {
    species: "Vrsta",
    all: "Vse vrste",
    regions: "Vojvodstva",
    reports: (n: number) => pluralSl(n, "prijava", "prijavi", "prijave", "prijav"),
    caption: (species: string, unplaced: string) =>
      `Zemljevid 2. Prijave terenskih opazovalcev po vojvodstvih${species}. Razporeditev v ploščicah, oblike so poenostavljene. Brez vojvodstva: ${unplaced}. Vir: IBD.`,
    share: (percent: number) => `${percent} % države`,
    top: "Najpogosteje opažene v vojvodstvu",
    none: (code: string) => `${regionFullName(code, "sl")}: ni prijav. Dziaders je tam, le prijavil ga še ni nihče.`,
    busiest: (code: string, n: string) => `: največ prijav: ${regionFullName(code, "sl")} (${n}).`,
    noRegion: ": še brez prijav z navedenim vojvodstvom.",
    legend: ["0", "do 20 %", "do 40 %", "do 70 %", "nad 70 %"],
    legendNote: "Odtenek glede na vojvodstvo z največ prijavami.",
  },
});

/** Five classes relative to the busiest voivodeship; empty ones stay paper. */
function shadeFor(value: number, max: number) {
  if (!value) return SHADES[0];
  const share = value / max;
  return SHADES[share > 0.7 ? 4 : share > 0.4 ? 3 : share > 0.2 ? 2 : 1];
}

/**
 * Mapa obserwacji: the tile map of voivodeships, shaded by sightings, for all species or one.
 * `matrix[region][species]` holds the counts.
 */
export function ObservationMap({
  matrix,
  species,
  unplaced,
}: {
  matrix: Record<string, Record<string, number>>;
  species: MapSpecies[];
  /** Sightings reported without a voivodeship. */
  unplaced: number;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const regions = getRegions(locale);
  const count = (n: number) => formatNumber(locale, n);
  const [filter, setFilter] = useState<SpeciesKey | "">("");
  const valueOf = (code: string) =>
    filter ? (matrix[code]?.[filter] ?? 0) : Object.values(matrix[code] ?? {}).reduce((sum, n) => sum + n, 0);
  const values = Object.fromEntries(Object.keys(REGIONS).map((code) => [code, valueOf(code)]));
  const max = Math.max(1, ...Object.values(values));
  const total = Object.values(values).reduce((sum, n) => sum + n, 0);
  const busiest = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
  const [active, setActive] = useState<string>(busiest?.[0] ?? "MZ");
  const region = regions[active];
  const here = values[active] ?? 0;
  const top = Object.entries(matrix[active] ?? {})
    .map(([key, n]) => ({ item: species.find((entry) => entry.key === key), n }))
    .filter((row): row is { item: MapSpecies; n: number } => Boolean(row.item))
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);
  const chosen = species.find((entry) => entry.key === filter);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <figure className="lg:col-span-6">
        <label className="block max-w-sm">
          <span className="label text-ink-soft">{t.species}</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as SpeciesKey | "")}
            className="mt-1 w-full border-0 border-b-2 border-ink bg-transparent py-2 font-serif text-xl font-bold focus:border-red focus-visible:outline-none"
          >
            <option value="">{t.all}</option>
            {species.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.name} ({count(entry.total)})
              </option>
            ))}
          </select>
        </label>

        <div role="group" aria-label={t.regions} className="mt-8 grid grid-cols-4 gap-1.5">
          {REGION_GRID.flat().map((code) => {
            const value = values[code] ?? 0;
            return (
              <button
                key={code}
                type="button"
                aria-pressed={code === active}
                aria-label={`${regions[code].name}: ${value} ${t.reports(value)}`}
                onClick={() => setActive(code)}
                onMouseEnter={() => setActive(code)}
                onFocus={() => setActive(code)}
                className={cx(
                  "flex aspect-square flex-col justify-between p-2 text-left outline-[3px] outline-offset-2 transition-[outline-color,background-color] md:p-3",
                  shadeFor(value, max),
                  code === active ? "outline-red" : "outline-transparent",
                )}
              >
                <span className="font-sans text-[0.75rem] font-semibold">{code}</span>
                <span className="text-[1.2rem] font-bold leading-none tabular-nums md:text-2xl">{value ? count(value) : "–"}</span>
              </button>
            );
          })}
        </div>
        <figcaption className="label mt-5 text-ink-soft">{t.caption(chosen ? `: ${chosen.name}` : "", count(unplaced))}</figcaption>
      </figure>

      <div aria-live="polite" className="lg:col-span-6">
        <div className="border-t border-ink pt-5">
          <p className="label text-ink-soft">{region.name}</p>
          <p className="mt-1 text-[clamp(3.5rem,7vw,5rem)] font-bold leading-none tabular-nums">{count(here)}</p>
          <p className="label mt-2 text-ink-soft">
            {t.reports(here)}
            {chosen ? `: ${chosen.name}` : ""} · {t.share(total ? Math.round((here / total) * 100) : 0)}
          </p>
        </div>
        {!filter && (
          <div className="mt-8">
            <h3 className="label border-b border-ink pb-2 text-ink-soft">{t.top}</h3>
            {top.length ? (
              <ol>
                {top.map(({ item, n }) => (
                  <li key={item.key}>
                    <Link href={`/atlas/${item.slug}`} className="group grid grid-cols-[4rem_1fr_auto] items-center gap-4 border-b border-rule py-2.5">
                      <SpeciesPlate species={item.key} className="w-full" />
                      <span className="font-bold leading-tight group-hover:text-red">{item.name}</span>
                      <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{count(n)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 leading-snug text-ink-soft">{typo(t.none(active))}</p>
            )}
          </div>
        )}
        {chosen && (
          <p className="mt-8 max-w-md leading-snug">
            <Link href={`/atlas/${chosen.slug}`} className="link">
              {chosen.name}
            </Link>
            {typo(busiest && busiest[1] ? t.busiest(busiest[0], count(busiest[1])) : t.noRegion)}
          </p>
        )}
        <div className="mt-6 grid grid-cols-5 gap-0.5" aria-hidden="true">
          {SHADES.map((shade, i) => (
            <div key={shade}>
              <div className={cx("h-2", shade)} />
              <p className="label mt-1.5 text-[0.72rem] text-ink-soft">{t.legend[i]}</p>
            </div>
          ))}
        </div>
        <p className="label mt-2 text-ink-faint">{t.legendNote}</p>
      </div>
    </div>
  );
}
