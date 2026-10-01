import Link from "next/link";
import type { Bulletin } from "@/lib/bulletin";
import { ZONES } from "@/lib/indeks";
import { cx, pct, roman, typo } from "@/lib/typo";
import { Seal } from "./brand";

export function Hero({ bulletin }: { bulletin: Bulletin }) {
  return (
    <section className="wrap grid gap-16 pb-16 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
      <div className="lg:col-span-7 lg:pr-4">
        <p className="kicker text-bordo">
          Komunikat nr {bulletin.issue}/{bulletin.year}
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.25rem,8.4vw,7.25rem)] font-black leading-[0.88] tracking-[-0.035em]">
          Dziaderstwo nie&nbsp;wybiera.
        </h1>
        <p className="mt-5 text-balance font-display text-[clamp(1.85rem,3.7vw,3.1rem)] italic leading-[1.04] tracking-[-0.01em] text-green">
          Zbadaj się, zanim będzie za późno.
        </p>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
          {typo(
            "Instytut Badań nad Dziaderstwem prowadzi obserwacje w całym kraju: od parkingów pod marketami budowlanymi po wigilijne stoły. Dokumentujemy, klasyfikujemy i ostrzegamy. Z pełną powagą, na jaką zasługuje zjawisko.",
          )}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href="/test" className="btn bg-green text-paper hover:bg-ink">
            Wykonaj test <span aria-hidden="true">→</span>
          </Link>
          <Link href="/atlas" className="link font-display text-lg italic">
            Przeglądaj Atlas Dziadersów
          </Link>
        </div>
        <p className="kicker mt-8 text-ink-faint">
          Czas badania: ok. 3 min <span className="mx-1.5">·</span> 24 pytania{" "}
          <span className="mx-1.5">·</span> Bez pobierania krwi
        </p>
      </div>

      <div className="lg:col-span-5">
        <IndexPanel bulletin={bulletin} />
      </div>
    </section>
  );
}

export function IndexPanel({ bulletin }: { bulletin: Bulletin }) {
  const { value, delta, season, zone } = bulletin.index;
  const trendLabel = delta === 0 ? "■ bez zmian" : `${delta > 0 ? "▲" : "▼"} ${pct(Math.abs(delta))} pkt`;

  return (
    <aside aria-labelledby="nid-title" className="relative border border-ink bg-paper-light">
      <div className="flex items-center justify-between gap-4 border-b border-ink px-5 py-3 md:px-7">
        <h2 id="nid-title" className="kicker">
          Narodowy Indeks Dziaderstwa
        </h2>
        <span className="kicker text-ink-faint">NID · PL</span>
      </div>

      <div className="px-5 pb-7 pt-6 md:px-7">
        <p className="kicker text-ink-faint">Aktualna wartość dla Polski</p>
        <p className="mt-3 font-display text-[clamp(5rem,12vw,8.25rem)] font-black leading-[0.82] tracking-[-0.045em] tabular-nums">
          {pct(value)}
          <span className="ml-1 align-top text-[0.4em] tracking-normal">%</span>
        </p>
        <p className="mt-4 font-mono text-[0.8rem] leading-snug">
          <span className={delta > 0 ? "text-bordo" : "text-green"}>{trendLabel}</span>{" "}
          <span className="text-ink-soft">od początku {season.name}</span>
        </p>

        <ZoneScale value={value} zone={zone.label} />

        <div className="mt-7 border-l-[3px] border-bordo bg-bordo/[0.06] py-3 pl-4 pr-3">
          <p className="kicker text-bordo">Ostrzeżenie {roman(season.level)} stopnia</p>
          <p className="mt-1.5 text-[0.95rem] leading-snug">{typo(season.alert)}</p>
        </div>
      </div>

      <p className="kicker border-t border-rule py-3 pl-5 pr-32 text-ink-faint md:pl-7 md:pr-40">
        Stan na {bulletin.date}, godz. {bulletin.time} <span className="mx-1">·</span> Źródło: IBD
      </p>

      <Seal className="pointer-events-none absolute -bottom-10 right-2 size-28 rotate-[-14deg] text-bordo/90 md:-bottom-12 md:right-3 md:size-36" />
    </aside>
  );
}

const ZONE_FILL = ["bg-ink/[0.07]", "bg-ink/15", "bg-ink/30", "bg-bordo/85"];

function ZoneScale({ value, zone }: { value: number; zone: string }) {
  return (
    <div className="mt-7">
      <p className="kicker flex justify-between text-ink-faint">
        <span>
          Natężenie: <span className="text-ink">{zone}</span>
        </span>
        <span>Skala 0–100</span>
      </p>
      <div className="relative mt-3">
        <div className="flex h-2.5">
          {ZONES.map((item, i) => (
            <div key={item.label} className={cx("flex-1", ZONE_FILL[i], i > 0 && "border-l-2 border-paper-light")} />
          ))}
        </div>
        <div className="absolute -bottom-1.5 -top-1.5 w-[3px] -translate-x-1/2 bg-ink" style={{ left: `${value}%` }} />
      </div>
      <div className="kicker mt-2.5 grid grid-cols-4 text-[0.58rem] tracking-[0.04em] text-ink-faint">
        {ZONES.map((item) => (
          <span key={item.label} className={item.label === zone ? "text-ink" : undefined}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
