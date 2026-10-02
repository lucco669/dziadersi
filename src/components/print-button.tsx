"use client";

import { track } from "@vercel/analytics";

export function PrintButton({ label = "Drukuj" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        track("Bingo", { akcja: "druk" });
        window.print();
      }}
      className="btn bg-ink text-paper hover:bg-red"
    >
      {label}
    </button>
  );
}
