import { briefsFor } from "@/content/briefs";
import type { Bulletin } from "@/lib/bulletin";
import { cx, typo } from "@/lib/typo";

export function Briefs({ bulletin }: { bulletin: Bulletin }) {
  const items = briefsFor(bulletin.today);

  return (
    <section aria-labelledby="briefs-title" className="wrap">
      <div className="grid border-y border-ink xl:grid-cols-12">
        <div className="flex items-baseline justify-between gap-4 border-b border-rule py-5 xl:col-span-3 xl:block xl:border-b-0 xl:border-r xl:py-8 xl:pr-8">
          <h2 id="briefs-title" className="font-display text-2xl font-bold leading-tight tracking-[-0.01em] md:text-[1.75rem]">
            Dzisiaj w&nbsp;Instytucie
          </h2>
          <p className="kicker whitespace-nowrap text-ink-faint xl:mt-3">Biuletyn nr {bulletin.issue}</p>
        </div>

        <ol className="grid md:grid-cols-3 xl:col-span-9">
          {items.map((brief, i) => (
            <li
              key={brief.title}
              className={cx(
                "py-6 md:px-6 lg:py-8",
                i === 0 ? "md:pl-0 xl:pl-8" : "border-t border-rule md:border-l md:border-t-0",
                i === items.length - 1 && "md:pr-0",
              )}
            >
              <p className="kicker text-green">{brief.category}</p>
              <h3 className="mt-3 font-display text-[1.3rem] font-semibold leading-[1.15] tracking-[-0.01em]">
                {typo(brief.title)}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">{typo(brief.dek)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
