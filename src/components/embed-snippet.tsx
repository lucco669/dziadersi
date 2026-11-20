"use client";

import { useId, useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { track } from "@/lib/analytics";

const COPY = defineCopy({
  pl: { copy: "Kopiuj kod", copied: "Skopiowano ✓", announce: "Kod skopiowany do schowka." },
  sl: { copy: "Kopiraj kodo", copied: "Kopirano ✓", announce: "Koda je kopirana v odložišče." },
});

/** A block of HTML for another site to paste, with a copy button. Selecting the field selects it all. */
export function EmbedSnippet({ label, note, code, kind }: { label: string; note: string; code: string; kind: string }) {
  const t = COPY[useLocale()];
  const id = useId();
  const [copied, setCopied] = useState(false);

  async function copy() {
    track("Osadzenie", { typ: kind });
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      (document.getElementById(id) as HTMLTextAreaElement | null)?.select();
    }
  }

  return (
    <div className="border-t border-rule pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <label htmlFor={id} className="text-lg font-bold">
          {label}
        </label>
        <button type="button" onClick={copy} className="label link inline-flex min-h-6 items-center py-1.5 text-ink">
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <p className="mt-1 text-ink-soft">{note}</p>
      <textarea
        id={id}
        readOnly
        value={code}
        rows={code.split("\n").length + 1}
        spellCheck={false}
        onFocus={(event) => event.currentTarget.select()}
        className="mt-3 w-full resize-none border border-ink bg-card p-3 font-sans text-[0.85rem] leading-relaxed text-ink"
      />
      <span className="sr-only" aria-live="polite">
        {copied ? t.announce : ""}
      </span>
    </div>
  );
}
