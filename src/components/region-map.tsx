"use client";

import Link from "next/link";
import { useState } from "react";
import { REGION_BINS, REGION_GRID, type Region } from "@/content/regions";
import { cx, pct, typo } from "@/lib/typo";

export type MapRegion = Region & { speciesName: string; speciesSlug: string };

const SHADES = [
  "bg-[#e3dac3] text-ink",
  "bg-[#c6ccb3] text-ink",
  "bg-[#97a991] text-ink",
  "bg-[#5b7a69] text-paper",
  "bg-green text-paper",
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
      <figcaption className="kicker border-b border-ink pb-3">Mapa 1. Dominujący gatunek według województw</figcaption>

      <div role="group" aria-label="Województwa" className="mt-6 grid grid-cols-4 gap-1.5">
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
                "flex aspect-square flex-col justify-between p-2 text-left outline-2 outline-offset-2 transition-[outline-color] md:p-2.5",
                shadeFor(item.value),
                selected ? "outline-ink" : "outline-transparent",
              )}
            >
              <span className="font-mono text-[0.68rem] font-semibold tracking-[0.08em]">{code}</span>
              <span className="font-display text-[1.05rem] font-semibold leading-none tabular-nums md:text-lg">
                {pct(item.value)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-5 gap-0.5" aria-hidden="true">
        {SHADES.map((shade, i) => (
          <div key={shade}>
            <div className={cx("h-2", shade)} />
            <p className="mt-1.5 font-mono text-[0.62rem] text-ink-faint">{LEGEND[i]}</p>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-7 border-t border-rule pt-5">
        <p className="kicker text-ink-faint">
          {region.name} · {pct(region.value)}%
        </p>
        <p className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.01em]">
          <Link href={`/atlas/${region.speciesSlug}`} className="transition-colors hover:text-green">
            {region.speciesName} <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="mt-2 leading-snug text-ink-soft">{typo(region.note)}</p>
      </div>

      <p className="kicker mt-7 text-ink-faint">Układ kafelkowy. Kształty województw uproszczono dla czytelności.</p>
    </figure>
  );
}
