"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { tally } from "@/lib/tally";
import { BookmarkButton } from "./bookmark";

const COPY = defineCopy({
  pl: {
    text: (points: number, title: string) =>
      `Egzamin terenowy z oznaczania dziadersów: ${points} z 12. ${title}. A ty rozpoznasz Parkingowego po wokalizacji?`,
    copy: "Skopiuj link do wyniku:",
    copied: "Skopiowano ✓",
    send: "Wyślij wynik",
    retake: "Egzamin poprawkowy",
  },
  sl: {
    text: (points: number, title: string) =>
      `Terenski izpit iz določanja dziadersov: ${points} od 12. ${title}. Pa ti prepoznaš Parkirnega po oglašanju?`,
    copy: "Kopiraj povezavo do rezultata:",
    copied: "Kopirano ✓",
    send: "Pošlji rezultat",
    retake: "Popravni izpit",
  },
});

/** Under an exam result: send it, keep it, try again. */
export function ExamActions({ code, points, title }: { code: string; points: number; title: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}${localizePath(`/egzamin/${code}`, locale)}`;
    const text = t.text(points, title);
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
      window.prompt(t.copy, url);
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink pt-6">
      <button type="button" onClick={share} className="btn bg-ink text-paper hover:bg-red">
        {copied ? t.copied : t.send} <span aria-hidden="true">→</span>
      </button>
      <BookmarkButton kind="egzamin" code={code} className="btn border border-ink hover:bg-ink hover:text-paper" />
      <Link href="/egzamin" className="link ml-2 font-sans font-medium">
        {t.retake}
      </Link>
    </div>
  );
}
