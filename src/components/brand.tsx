import { useId, type ReactNode } from "react";
import { cx } from "@/lib/typo";

/** The Institute's mark. Drawn on a 100 × 36 grid. */
export const MUSTACHE_PATH =
  "M50 11C56 4 69 1.5 80 6C89 10 94.5 19 97 31C92.5 29.5 86 26.5 78 25C68 23 58 23.5 50 18C42 23.5 32 23 22 25C14 26.5 7.5 29.5 3 31C5.5 19 11 10 20 6C31 1.5 44 4 50 11Z";

/** Pinned to the display optical size so the logo has the same shape (and width: 5.43em) at every size. */
export function Wordmark({ className, dotClassName = "text-bordo" }: { className?: string; dotClassName?: string }) {
  return (
    <span className={cx("font-display font-black tracking-[-0.035em]", className)} style={{ fontVariationSettings: '"opsz" 144' }}>
      DZIADER<span className={dotClassName}>.</span>SI
    </span>
  );
}

/** Round rubber seal: ring text, mustache, IBD. */
export function Seal({
  className,
  ring = "INSTYTUT BADAŃ NAD DZIADERSTWEM · EST. 2026 · ",
}: {
  className?: string;
  ring?: string;
}) {
  const id = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      className={cx("ink-worn", className)}
      role="img"
      aria-label="Pieczęć Instytutu Badań nad Dziaderstwem, rok założenia 2026"
    >
      <defs>
        <path id={id} d="M100 100m-73 0a73 73 0 1 1 146 0a73 73 0 1 1 -146 0" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="96" strokeWidth="4" />
        <circle cx="100" cy="100" r="89" strokeWidth="1.25" />
        <circle cx="100" cy="100" r="57" strokeWidth="1.25" />
      </g>
      <text
        fill="currentColor"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1"
        style={{ fontFamily: "var(--font-plex-mono)" }}
      >
        <textPath href={`#${id}`} textLength="452" lengthAdjust="spacing">
          {ring}
        </textPath>
      </text>
      <path d={MUSTACHE_PATH} fill="currentColor" transform="translate(64 72) scale(0.72)" />
      <text
        x="100"
        y="130"
        textAnchor="middle"
        fill="currentColor"
        fontSize="22"
        fontWeight="900"
        letterSpacing="2"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        IBD
      </text>
    </svg>
  );
}

/** Compact seal for small sizes: rings and the mark, no ring text. */
export function SealMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="2.25" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d={MUSTACHE_PATH} fill="currentColor" transform="translate(10 18) scale(0.28)" />
    </svg>
  );
}

/** Rectangular rubber stamp. */
export function Stamp({
  children,
  tone = "bordo",
  className,
}: {
  children: ReactNode;
  tone?: "bordo" | "green" | "ink" | "paper";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "ink-worn inline-block border-4 border-double px-3 py-1.5 font-mono text-[0.7rem] font-semibold uppercase leading-none tracking-[0.18em]",
        tone === "bordo" && "border-bordo text-bordo",
        tone === "green" && "border-green text-green",
        tone === "ink" && "border-ink text-ink",
        tone === "paper" && "border-paper text-paper",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  id,
  number,
  kicker,
  title,
  dek,
  aside,
  inverted = false,
}: {
  id: string;
  number: string;
  kicker: string;
  title: ReactNode;
  dek?: ReactNode;
  aside?: ReactNode;
  inverted?: boolean;
}) {
  return (
    <header className={cx("border-t-2 pt-4", inverted ? "border-paper" : "border-ink")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="kicker">
          § {number} <span className="mx-1.5 opacity-50">/</span> {kicker}
        </p>
        {aside && <div className={cx("kicker", inverted ? "text-paper/70" : "text-ink-faint")}>{aside}</div>}
      </div>
      <h2
        id={id}
        className="mt-8 max-w-4xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.025em] md:mt-10"
      >
        {title}
      </h2>
      {dek && (
        <p className={cx("mt-5 max-w-2xl text-lg leading-relaxed md:text-xl", inverted ? "text-paper/80" : "text-ink-soft")}>
          {dek}
        </p>
      )}
    </header>
  );
}
