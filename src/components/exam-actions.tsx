"use client";

import Link from "next/link";
import { useState } from "react";
import { tally } from "@/lib/tally";
import { BookmarkButton } from "./bookmark";

/** Under an exam result: send it, keep it, try again. */
export function ExamActions({ code, points, title }: { code: string; points: number; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/egzamin/${code}`;
    const text = `Egzamin terenowy z oznaczania dziadersów: ${points} z 12. ${title}. A ty rozpoznasz Parkingowego po wokalizacji?`;
    tally("udostepnienie");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // Closed the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Skopiuj link do wyniku:", url);
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink pt-6">
      <button type="button" onClick={share} className="btn bg-ink text-paper hover:bg-red">
        {copied ? "Skopiowano ✓" : "Wyślij wynik"} <span aria-hidden="true">→</span>
      </button>
      <BookmarkButton kind="egzamin" code={code} className="btn border border-ink hover:bg-ink hover:text-paper" />
      <Link href="/egzamin" className="link ml-2 font-sans font-medium">
        Egzamin poprawkowy
      </Link>
    </div>
  );
}
