import type { ReactNode } from "react";
import { cx } from "@/lib/typo";
import { Figure } from "./pictograms";

/** A figure and what it says, in a red speech bubble. */
export function Saying({ children, note, className }: { children: ReactNode; note?: ReactNode; className?: string }) {
  return (
    <figure className={cx("flex items-end gap-1", className)}>
      <svg viewBox="-4 -1 56 97" className="h-44 shrink-0 md:h-52" aria-hidden="true">
        <Figure right="point" glasses="eyes" />
      </svg>
      <div className="mb-24 md:mb-28">
        <blockquote className="relative bg-red px-5 py-4 text-paper">
          <span
            aria-hidden="true"
            className="absolute -left-3 bottom-4 size-0 border-y-[10px] border-r-[14px] border-y-transparent border-r-red"
          />
          <p className="text-[clamp(1.25rem,2.2vw,1.6rem)] font-bold leading-tight">{children}</p>
        </blockquote>
        {note && <figcaption className="label mt-3 text-ink-soft">{note}</figcaption>}
      </div>
    </figure>
  );
}
