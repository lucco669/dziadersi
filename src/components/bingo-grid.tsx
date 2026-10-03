import type { ReactNode } from "react";
import { freeSquare } from "@/content/bingo";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { CENTRE, type Card } from "@/lib/bingo";
import { siteCopy } from "@/lib/site";
import { cx, typo } from "@/lib/typo";
import { Seal } from "./brand";

const COPY = defineCopy({
  pl: {
    number: (number: string) => `Karta nr ${number}`,
    free: "Wolne pole",
    rules: "Skreślaj, co usłyszysz. Pięć w linii wygrywa.",
  },
  sl: {
    number: (number: string) => `Listek št. ${number}`,
    free: "Prosto polje",
    rules: "Prečrtaj, kar slišiš. Pet v vrsto zmaga.",
  },
});

/** A red cross over a square, drawn like the cross in the test's checkboxes. */
function Cross() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-1.5 text-red" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M8 10C36 38 64 64 92 90" pathLength={1} strokeWidth={2.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.85} className="animate-draw [stroke-dasharray:1]" />
      <path d="M90 8C64 36 38 62 10 92" pathLength={1} strokeWidth={2.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.85} className="animate-draw [stroke-dasharray:1] [animation-delay:110ms]" />
    </svg>
  );
}

/**
 * The bingo card: a printed document with the red stripe, five columns under B-I-N-G-O.
 * Interactive when `onToggle` is given; static for printing. `card` comes from the same edition as `locale`.
 */
export function BingoGrid({
  card,
  locale,
  marked,
  onToggle,
  overlay,
  compact,
  className,
}: {
  card: Card;
  locale: Locale;
  marked?: boolean[];
  onToggle?: (index: number) => void;
  /** Drawn over the 5 × 5 grid: the bingo lines. */
  overlay?: ReactNode;
  /** Smaller type, for four cards on one sheet. */
  compact?: boolean;
  className?: string;
}) {
  const t = COPY[locale];
  return (
    <figure className={cx("relative overflow-hidden bg-card p-2 text-ink", className)}>
      <div aria-hidden="true" className="absolute -left-16 top-5 h-5 w-48 -rotate-45 bg-red print:hidden" />
      <div className={cx("relative border border-ink", compact ? "p-3" : "p-3 md:p-5")}>
        <figcaption className={cx("flex items-baseline justify-between gap-4 pl-6", compact ? "text-[0.7rem]" : "label")}>
          <span className="font-sans font-semibold">{card.occasion.title}</span>
          <span className="font-sans text-ink-soft">{t.number(card.number)}</span>
        </figcaption>

        <div className="mt-3 grid grid-cols-5" aria-hidden="true">
          {"BINGO".split("").map((letter) => (
            <span key={letter} className={cx("text-center font-bold leading-none", compact ? "text-xl" : "text-[clamp(1.6rem,4.4vw,2.6rem)]")}>
              {letter}
            </span>
          ))}
        </div>

        <div className="relative mt-2">
          <ol className="grid grid-cols-5 border-l border-t border-ink">
            {card.squares.map((square, i) => {
              const on = !!marked?.[i];
              const label = i === CENTRE ? `${t.free}: ${freeSquare(locale)}` : square;
              const inner = (
                <>
                  {i === CENTRE ? (
                    <span className="flex flex-col items-center gap-1">
                      <Seal locale={locale} className={cx("text-red", compact ? "size-9" : "size-10 md:size-14")} />
                      <span className="font-semibold uppercase tracking-[0.08em] text-red">{t.free}</span>
                    </span>
                  ) : (
                    <span className={cx("transition-colors", on && "text-ink-faint")}>{typo(square)}</span>
                  )}
                  {on && i !== CENTRE && <Cross />}
                </>
              );
              const cell = cx(
                "relative flex min-w-0 items-center justify-center border-b border-r border-ink p-1 text-center font-sans leading-[1.15] [hyphens:auto] [overflow-wrap:anywhere]",
                compact ? "aspect-square text-[0.62rem]" : "aspect-[4/5] text-[0.64rem] min-[420px]:text-[0.72rem] sm:aspect-square sm:p-2 sm:text-[0.84rem] lg:text-[0.9rem]",
              );
              return (
                <li key={i} lang={LOCALE_INFO[locale].tag} className="contents">
                  {onToggle && i !== CENTRE ? (
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={label}
                      onClick={() => onToggle(i)}
                      className={cx(cell, "transition-colors", on ? "bg-red/[0.05]" : "hover:bg-paper-deep")}
                    >
                      {inner}
                    </button>
                  ) : (
                    <div className={cell} aria-label={label}>
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          {overlay}
        </div>

        {compact && (
          <p className="mt-2 font-sans text-[0.6rem] text-ink-soft">
            {t.rules} {siteCopy(locale).institute} · dziader.si{localizePath("/bingo", locale)}
          </p>
        )}
      </div>
    </figure>
  );
}
