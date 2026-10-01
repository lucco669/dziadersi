"use client";

import Link from "next/link";
import { useState } from "react";
import { REGION_BINS, REGION_GRID, type Region } from "@/content/regions";
import { cx, pct, typo } from "@/lib/typo";

export type MapRegion = Region & { speciesName: string; speciesSlug: string };

const SHADES = [
  "bg-[#e9e3d6] text-ink",
  "bg-[#d3cbbb] text-ink",
  "bg-[#a69d8c] text-ink",
  "bg-[#5d574e] text-paper",
  "bg-ink text-paper",
];

const LEGEND = [`<${REGION_BINS[0]}`, ...REGION_BINS.slice(1).map((bin, i) => `${REGION_BINS[i]}–${bin}`), `${REGION_BINS.at(-1)}+`];

const shadeFor = (value: number) => SHADES[REGION_BINS.filter((bin) => value >= bin).length];

export function RegionMap({ regions, className }: { regions: Record<string, MapRegion>; className?: string }) {
  const [active, setActive] = useState(
    () => Object.values(regions).reduce((top, region) => (region.value > top.value ? region : top)).code,
  );
  const region = regions[active];

  return (
    <figure className={className}>
      <div role="group" aria-label="Województwa" className="grid grid-cols-4 gap-1.5">
        {REGION_GRID.flat().map((code) => {
          const item = regions[code];
          const selected = code === active;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={selected}
              aria-label={`${item.name}: ${pct(item.value)}%`}
              onClick={() => setActive(code)}
              onMouseEnter={() => setActive(code)}
              onFocus={() => setActive(code)}
              className={cx(
                "flex aspect-square flex-col justify-between p-2 text-left outline-[3px] outline-offset-2 transition-[outline-color] md:p-2.5",
                shadeFor(item.value),
                selected ? "outline-red" : "outline-transparent",
              )}
            >
              <span className="font-sans text-[0.75rem] font-semibold">{code}</span>
              <span className="text-[1.1rem] font-bold leading-none tabular-nums md:text-xl">{pct(item.value)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-5 gap-0.5" aria-hidden="true">
        {SHADES.map((shade, i) => (
          <div key={shade}>
            <div className={cx("h-2", shade)} />
            <p className="label mt-1.5 text-[0.72rem] text-ink-soft">{LEGEND[i]}</p>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-6 border-t border-rule pt-5">
        <p className="label text-ink-soft">
          {region.name} · {pct(region.value)}%
        </p>
        <p className="mt-1 text-2xl font-bold leading-tight">
          <Link href={`/atlas/${region.speciesSlug}`} className="transition-colors hover:text-red">
            {region.speciesName} <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="mt-2 leading-snug text-ink-soft">{typo(region.note)}</p>
      </div>

      <figcaption className="label mt-6 text-ink-soft">
        Mapa 1. Dominujący gatunek i natężenie dziaderstwa według województw (%). Układ kafelkowy, kształty uproszczono.
      </figcaption>
    </figure>
  );
}
