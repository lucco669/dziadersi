import type { ReactNode } from "react";
import Link from "@/i18n/link";

/*
 * The Institute's empty states, in the manner of a statistics office: one line with a GUS
 * conventional sign instead of a table of dashes, and the action that would fill the line.
 *   "–" the phenomenon did not occur, "·" no information, "x" not applicable (below a threshold).
 */

export type Sign = "–" | "·" | "x";

export function SignLine({
  sign,
  children,
  actions = [],
  className,
}: {
  sign: Sign;
  children: ReactNode;
  /** The ways to fill the line: "Wykonaj test", "Do Atlasu"… */
  actions?: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={["grid grid-cols-[2rem_1fr] gap-x-3 border-t border-ink pt-5", className].filter(Boolean).join(" ")}>
      <span className="text-[1.75rem] font-bold leading-none" aria-hidden="true">
        {sign}
      </span>
      <div>
        <p className="max-w-2xl text-xl leading-snug">{children}</p>
        {actions.length > 0 && (
          <p className="mt-5 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="btn border border-ink hover:bg-ink hover:text-paper">
                {action.label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

/** Progress to a publication threshold: one box per result needed, filled as results arrive. */
export function Threshold({ count, of, label, className }: { count: number; of: number; label: string; className?: string }) {
  const filled = Math.min(count, of);
  return (
    <figure className={className}>
      <div className="grid max-w-md grid-cols-[repeat(15,minmax(0,1fr))] gap-1" role="img" aria-label={label}>
        {Array.from({ length: of }, (_, i) => (
          <span key={i} className={i < filled ? "aspect-square bg-ink" : "aspect-square border border-dashed border-ink-faint"} />
        ))}
      </div>
      <figcaption className="label mt-3 text-ink-soft">{label}</figcaption>
    </figure>
  );
}
