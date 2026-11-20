"use client";

import { useState } from "react";
import { caseKey, caseMeta, docket, getCases } from "@/content/cases";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import type { VerdictCounts } from "@/lib/community";
import { cx } from "@/lib/typo";
import { CaseFile, useVerdicts } from "./case-file";

const COPY = defineCopy({
  pl: {
    judged: (judged: number, total: number) => `Rozpatrzono ${judged} z ${total}`,
    docketNav: "Sprawy na wokandzie",
  },
  sl: {
    judged: (judged: number, total: number) => `Obravnavano: ${judged} od ${total}`,
    docketNav: "Primeri na dnevnem redu",
  },
});

/**
 * The docket on the Komisja's page: one case at a time, starting with the first not yet judged.
 * `counts` are keyed by caseKey(), as getCommunity() gives them.
 */
export function Docket({ counts }: { counts: Record<string, VerdictCounts> | null }) {
  const locale = useLocale();
  const t = COPY[locale];
  const cases = getCases(locale);
  const verdicts = useVerdicts();
  const [chosen, setChosen] = useState<string | null>(null);
  const judged = cases.filter((item) => verdicts[caseKey(item)]).length;
  const firstOpen = cases.find((item) => !verdicts[caseKey(item)]) ?? cases[0];
  const current = cases.find((item) => item.slug === chosen) ?? firstOpen;
  const index = cases.indexOf(current);

  function next() {
    const after = [...cases.slice(index + 1), ...cases.slice(0, index)];
    const open = after.find((item) => !verdicts[caseKey(item)]) ?? after[0];
    setChosen(open.slug);
    document.getElementById("wokanda")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <CaseFile
        key={current.slug}
        item={current}
        meta={caseMeta(current, locale)}
        initial={counts?.[caseKey(current)] ?? null}
        position={t.judged(judged, cases.length)}
        onNext={next}
      />
      <nav aria-label={t.docketNav} className="mt-12 flex flex-wrap gap-1.5">
        {cases.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setChosen(item.slug)}
            aria-current={item === current ? "true" : undefined}
            title={`${docket(item)}: ${item.title}`}
            className={cx(
              "size-8 font-sans text-[0.8rem] font-semibold tabular-nums transition-colors",
              item === current ? "bg-red text-paper" : verdicts[caseKey(item)] ? "bg-ink text-paper" : "border border-ink/30 text-ink-soft hover:border-ink",
            )}
          >
            {item.number}
          </button>
        ))}
      </nav>
    </div>
  );
}
