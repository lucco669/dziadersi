import { Fragment, useId, type CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { Figure, GREY, INK } from "./pictograms";

const COPY = defineCopy({
  pl: { tally: (count: number) => `${count} na 10 osób` },
  sl: { tally: (count: number) => `${count} od 10 oseb` },
});

/** A fixed, random-looking order, so the same people turn every time. */
function shuffled(total: number) {
  const order = Array.from({ length: total }, (_, i) => i);
  let seed = 1987;
  for (let i = total - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Picture statistics: `count` out of `total` people are dziaders (mustache, shorts, white socks). */
export function Crowd({
  count,
  total = 100,
  columns = 20,
  ordered,
  className,
  label,
}: {
  count: number;
  total?: number;
  columns?: number;
  /** Fill from the left, as in a tally, instead of in a scattered order. */
  ordered?: boolean;
  className?: string;
  label: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const order = ordered ? Array.from({ length: total }, (_, i) => i) : shuffled(total);
  const rank = new Map(order.map((cell, i) => [cell, i]));
  const rows = Math.ceil(total / columns);

  return (
    <svg viewBox={`0 0 ${columns * 44} ${rows * 104}`} className={className} role="img" aria-label={label}>
      <defs>
        <g id={`${id}-plain`}>
          <Figure color={GREY} mustache={false} legs="trousers" />
        </g>
        <g id={`${id}-dziaders`}>
          <Figure color={INK} />
        </g>
      </defs>
      {/* Bare <use> elements, positioned with x and y: the crowd is the largest part of the front page's DOM. */}
      {Array.from({ length: total }, (_, cell) => {
        const order = rank.get(cell) ?? 0;
        const x = (cell % columns) * 44 + 2;
        const y = Math.floor(cell / columns) * 104 + 4;
        return (
          <Fragment key={cell}>
            <use href={`#${id}-plain`} x={x} y={y} />
            {order < count && (
              <use href={`#${id}-dziaders`} x={x} y={y} className="crowd-on" style={{ "--i": order } as CSSProperties} />
            )}
          </Fragment>
        );
      })}
    </svg>
  );
}

/** A percentage as ten figures. */
export function Tally({ percent, locale, className }: { percent: number; locale: Locale; className?: string }) {
  const count = Math.round(percent / 10);
  return (
    <Crowd
      count={count}
      total={10}
      columns={10}
      ordered
      className={className}
      label={COPY[locale].tally(count)}
    />
  );
}
