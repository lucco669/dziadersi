import type { Bulletin } from "@/lib/bulletin";
import { MONTHS_SHORT, dayOfYear } from "@/lib/calendar";
import { cx, pct, typo } from "@/lib/typo";
import { SectionHeading } from "./brand";
import { RegionMap } from "./region-map";

export function IndexSection({ bulletin }: { bulletin: Bulletin }) {
  return (
    <section id="indeks" aria-labelledby="indeks-title" className="scroll-mt-20 border-y border-ink bg-paper-deep/70">
      <div className="wrap py-20 md:py-28">
        <SectionHeading
          id="indeks-title"
          number="03"
          kicker="Dane"
          aside={`Aktualizacja: ${bulletin.date}, ${bulletin.time}`}
          title="Stan dziaderstwa w Polsce"
          dek={typo(
            "Narodowy Indeks Dziaderstwa mierzy natężenie zjawiska w skali kraju. Wartość aktualizujemy co godzinę na podstawie obserwacji terenowych, nasłuchu przy grillach i analizy komentarzy pod artykułami o oponach.",
          )}
        />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <IndexChart bulletin={bulletin} className="lg:col-span-8" />
          <RegionMap className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}

const Y_MIN = 58;
const Y_MAX = 82;
const GRID = [60, 70, 80];

function IndexChart({ bulletin, className }: { bulletin: Bulletin; className?: string }) {
  const { year, today, total, chart } = bulletin;
  const x = (day: number) => (day / (total - 1)) * 100;
  const y = (value: number) => (1 - (value - Y_MIN) / (Y_MAX - Y_MIN)) * 100;
  const line = (values: number[], start: number) =>
    values.map((value, i) => `${i ? "L" : "M"}${x(start + i).toFixed(2)} ${y(value).toFixed(2)}`).join("");

  const measured = line(chart.measured, 0);
  const forecast = line(chart.forecast, today);
  const area = `${measured}L${x(today).toFixed(2)} 100L0 100Z`;
  const todayValue = chart.measured[today];
  const todayX = x(today);

  return (
    <figure className={className}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-3">
        <span className="kicker">Wykres 1. NID w {year} r., wartości dzienne (%)</span>
        <span className="kicker flex gap-5 text-ink-faint">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-ink" aria-hidden="true" />
            Pomiar
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-ink/50" aria-hidden="true" />
            Prognoza IBD
          </span>
        </span>
      </figcaption>

      <div className="relative mt-16 h-72 md:mt-32 md:h-[22rem]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
          role="img"
          aria-label={`Wykres Narodowego Indeksu Dziaderstwa w ${year} roku. Dziś ${pct(todayValue)}%. Najwyższa prognozowana wartość przypada na Wigilię.`}
        >
          {GRID.map((value) => (
            <line
              key={value}
              x1="0"
              x2="100"
              y1={y(value)}
              y2={y(value)}
              className="stroke-ink/15"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line x1="0" x2="100" y1="100" y2="100" className="stroke-ink" vectorEffect="non-scaling-stroke" />
          <path d={area} className="fill-green/10" />
          <path
            d={forecast}
            fill="none"
            className="stroke-ink/45"
            strokeWidth="2"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={measured}
            fill="none"
            className="stroke-ink"
            strokeWidth="1.75"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={todayX}
            x2={todayX}
            y1="0"
            y2="100"
            className="stroke-bordo"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {GRID.map((value) => (
          <span
            key={value}
            className="absolute left-0 -translate-y-full pb-1 font-mono text-[0.7rem] text-ink-faint"
            style={{ top: `${y(value)}%` }}
          >
            {value}
          </span>
        ))}

        {chart.milestones.map((milestone) => {
          const left = x(milestone.at);
          const future = milestone.at > today;
          const align = left > 88 ? "-translate-x-full text-right" : left < 10 ? "" : "-translate-x-1/2 text-center";
          return (
            <div
              key={milestone.label}
              className={cx(
                "absolute w-0",
                milestone.row === 0 ? "[--lift:2.75rem] md:[--lift:5.75rem]" : "[--lift:1.3rem] md:[--lift:3rem]",
                milestone.minor && "hidden md:block",
              )}
              style={{
                left: `${left}%`,
                top: "calc(var(--lift) * -1)",
                height: `calc(${y(milestone.value).toFixed(2)}% + var(--lift))`,
              }}
            >
              <span className={cx("absolute left-0 top-0 whitespace-nowrap", align)}>
                <span className={cx("kicker block text-[0.62rem] md:text-[0.68rem]", future ? "text-ink-faint" : "text-ink")}>
                  {milestone.label}
                </span>
                <span className="hidden font-display text-[0.85rem] italic leading-tight text-ink-soft md:block">
                  {milestone.note}
                </span>
              </span>
              <span
                className={cx(
                  "absolute bottom-0 left-0 top-4 border-l md:top-[2.55rem]",
                  future ? "border-dashed border-ink/35" : "border-ink/45",
                )}
              />
              <span className="absolute bottom-0 left-0 size-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-ink" />
            </div>
          );
        })}

        <span
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-bordo"
          style={{ left: `${todayX}%`, top: `${y(todayValue)}%` }}
        />
        <span
          className={cx("kicker absolute bottom-2 whitespace-nowrap text-bordo", todayX > 20 ? "-translate-x-full pr-2" : "pl-2")}
          style={{ left: `${todayX}%` }}
        >
          Dziś · {pct(todayValue)}
        </span>
      </div>

      <div className="relative mt-2 h-5" aria-hidden="true">
        {MONTHS_SHORT.map((month, i) => (
          <span
            key={month}
            className={cx("absolute font-mono text-[0.7rem] text-ink-faint", i % 2 === 1 && "hidden sm:block")}
            style={{ left: `${x(dayOfYear(year, i + 1, 1))}%` }}
          >
            {month}
          </span>
        ))}
      </div>

      <p className="kicker mt-8 text-ink-faint">
        Źródło: IBD, obserwacje terenowe. Metodologia objęta tajemnicą służbową.
      </p>
    </figure>
  );
}
