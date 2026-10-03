"use client";

import { track } from "@vercel/analytics";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";

const COPY = defineCopy({
  pl: { print: "Drukuj" },
  sl: { print: "Natisni" },
});

export function PrintButton({ label }: { label?: string }) {
  const locale = useLocale();
  return (
    <button
      type="button"
      onClick={() => {
        track("Bingo", { akcja: "druk" });
        window.print();
      }}
      className="btn bg-ink text-paper hover:bg-red"
    >
      {label ?? COPY[locale].print}
    </button>
  );
}
