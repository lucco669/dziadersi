"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";

/*
 * The magnifier and the shortcuts are all a page needs up front. The dialog (results, icons,
 * the index) is fetched on the first open, or a moment earlier when the pointer reaches the
 * magnifier.
 */

const COPY = defineCopy({
  pl: { search: "Szukaj", searchKey: "Szukaj ( / )", dialog: "Wyszukiwarka Instytutu", placeholder: "Szukaj gatunku, hasła, sprawy…", loading: "Instytut przegląda kartoteki…" },
  sl: { search: "Išči", searchKey: "Išči ( / )", dialog: "Iskalnik Inštituta", placeholder: "Išči vrsto, geslo, primer …", loading: "Inštitut prebira kartoteke …" },
});

const loadPanel = () => import("./search-panel");
const SearchDialogPanel = lazy(loadPanel);

export const openSearch = () => window.dispatchEvent(new Event("ibd:szukaj"));

export function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx={8.4} cy={8.4} r={6} fill="none" stroke="currentColor" strokeWidth={2} />
      <line x1={13} y1={13} x2={18} y2={18} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

/** The magnifier in the header and in the phone menu row. */
export function SearchButton({ className, label }: { className?: string; label?: boolean }) {
  const t = COPY[useLocale()];
  return (
    <button type="button" onClick={openSearch} onPointerEnter={() => void loadPanel()} onFocus={() => void loadPanel()} className={className} aria-label={t.search} title={t.searchKey}>
      <SearchGlyph className="w-5" />
      {label && <span>{t.search}</span>}
    </button>
  );
}

/** The search dialog, opened with the magnifier, "/" or Ctrl+K. Mounted once, in the header; empty until first opened. */
export function SearchDialog() {
  const t = COPY[useLocale()];
  const pathname = usePathname();
  // What is typed before the dialog's script arrives; the dialog starts from it.
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const show = () => {
      setWanted(true);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("ibd:szukaj", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("ibd:szukaj", show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!wanted) return null;
  // The same frame as the dialog, so "/" and typing at once lose nothing on a slow connection.
  const fallback = open ? (
    <div className="fixed inset-0 z-[60] print:hidden" role="dialog" aria-modal="true" aria-label={t.dialog}>
      <div className="absolute inset-0 bg-ink/20" aria-hidden="true" onClick={() => setOpen(false)} />
      <div className="relative mx-4 mt-[8vh] max-w-2xl border border-ink bg-paper sm:mx-auto">
        <div className="flex items-center gap-3 border-b border-ink px-4">
          <SearchGlyph className="w-5 shrink-0 text-ink-soft" />
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
            placeholder={t.placeholder}
            className="min-w-0 flex-1 bg-transparent py-4 font-serif text-xl placeholder:text-ink/30 focus-visible:outline-none"
          />
        </div>
        <p className="label px-4 py-6 text-ink-soft">{t.loading}</p>
      </div>
    </div>
  ) : null;
  return (
    <Suspense fallback={fallback}>
      <SearchDialogPanel open={open} onClose={() => setOpen(false)} initialQuery={draft} />
    </Suspense>
  );
}
