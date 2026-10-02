"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { SpeciesKey } from "@/content/species";
import { search, SEARCH_KINDS, SUGGESTIONS, type SearchEntry, type SearchKind } from "@/lib/search";
import { tally } from "@/lib/tally";
import { cx, typo } from "@/lib/typo";
import { MenuIcon } from "./menu-icons";
import { SpeciesPlate } from "./pictograms";

/*
 * The index is fetched once, on the first open, and kept for the rest of the visit.
 */

let index: SearchEntry[] | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function loadIndex() {
  loading ??= fetch("/szukaj/indeks.json")
    .then((response) => response.json() as Promise<SearchEntry[]>)
    .then((entries) => {
      index = entries;
      listeners.forEach((listener) => listener());
    })
    .catch(() => {
      loading = null;
    });
  return loading;
}

function useIndex() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      void loadIndex();
      return () => {
        listeners.delete(listener);
      };
    },
    () => index,
    () => null,
  );
}

const KIND_ICON: Record<SearchKind, string> = {
  dzial: "",
  gatunek: "",
  haslo: "/slownik",
  sprawa: "/czy-to-juz-dziaderstwo",
  raport: "/raporty",
  bingo: "/bingo",
  rozmowki: "/generator",
};

function ResultIcon({ entry }: { entry: SearchEntry }) {
  if (entry.k === "gatunek" && entry.i) return <SpeciesPlate species={entry.i as SpeciesKey} className="w-12" />;
  return <MenuIcon href={entry.k === "dzial" ? (entry.i ?? "") : KIND_ICON[entry.k]} className="w-10" />;
}

function Result({ entry, active, id, onPick }: { entry: SearchEntry; active?: boolean; id?: string; onPick?: () => void }) {
  return (
    <Link
      id={id}
      href={entry.h}
      onClick={() => {
        tally("szukaj");
        onPick?.();
      }}
      role={id ? "option" : undefined}
      aria-selected={id ? active : undefined}
      className={cx("mi group grid grid-cols-[3rem_1fr] items-center gap-4 px-4 py-3", active ? "bg-paper-deep" : "hover:bg-paper-deep")}
    >
      <span className="flex justify-center">
        <ResultIcon entry={entry} />
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline justify-between gap-4">
          <span className={cx("truncate font-bold leading-tight", active ? "text-red" : "group-hover:text-red")}>{entry.t}</span>
          <span className="label hidden shrink-0 text-[0.75rem] text-ink-faint sm:inline">{SEARCH_KINDS[entry.k]}</span>
        </span>
        <span className="mt-0.5 block truncate font-sans text-[0.85rem] text-ink-soft">{entry.s}</span>
      </span>
    </Link>
  );
}

function NoResults({ query, onSuggest }: { query: string; onSuggest: (value: string) => void }) {
  return (
    <div className="px-4 py-6">
      <p className="leading-snug">
        {query
          ? typo(`Instytut nie znalazł „${query}”. Może jest w szufladzie ze wszystkim, pod instrukcją od tostera.`)
          : "Czego szukamy? Na przykład:"}
      </p>
      <p className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggest(suggestion)}
            className="label border border-ink/30 px-2.5 py-1 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            {suggestion}
          </button>
        ))}
      </p>
    </div>
  );
}

export const openSearch = () => window.dispatchEvent(new Event("ibd:szukaj"));

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx={8.4} cy={8.4} r={6} fill="none" stroke="currentColor" strokeWidth={2} />
      <line x1={13} y1={13} x2={18} y2={18} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

/** The magnifier in the header and in the phone menu row. */
export function SearchButton({ className, label }: { className?: string; label?: boolean }) {
  return (
    <button type="button" onClick={openSearch} className={className} aria-label="Szukaj" title="Szukaj ( / )">
      <SearchGlyph className="w-5" />
      {label && <span>Szukaj</span>}
    </button>
  );
}

/** The search dialog, opened with the magnifier, "/" or Ctrl+K. Mounted once, in the header. */
export function SearchDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const entries = useIndex();
  const results = entries && open ? search(entries, query, 8) : [];

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const show = () => {
      void loadIndex();
      setOpen(true);
      setActive(0);
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

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    input.current?.select();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  function onKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[active];
      tally("szukaj");
      router.push(chosen ? chosen.h : `/szukaj?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] print:hidden" role="dialog" aria-modal="true" aria-label="Wyszukiwarka Instytutu">
      <div className="absolute inset-0 bg-ink/20" aria-hidden="true" onClick={() => setOpen(false)} />
      <div className="relative mx-4 mt-[8vh] max-w-2xl border border-ink bg-paper sm:mx-auto">
        <div className="flex items-center gap-3 border-b border-ink px-4">
          <SearchGlyph className="w-5 shrink-0 text-ink-soft" />
          <input
            ref={input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            placeholder="Szukaj gatunku, hasła, sprawy…"
            className="min-w-0 flex-1 bg-transparent py-4 font-serif text-xl placeholder:text-ink/30 focus-visible:outline-none"
          />
          <button type="button" onClick={() => setOpen(false)} className="label shrink-0 py-2 text-ink-soft hover:text-red">
            Esc
          </button>
        </div>
        <div id={listId} role="listbox" aria-label="Wyniki" className="max-h-[60vh] overflow-y-auto">
          {!entries ? (
            <p className="label px-4 py-6 text-ink-soft">Instytut przegląda kartoteki…</p>
          ) : results.length ? (
            results.map((entry, i) => (
              <Result key={entry.h} id={`${listId}-${i}`} entry={entry} active={i === active} onPick={() => setOpen(false)} />
            ))
          ) : (
            <NoResults query={query.trim()} onSuggest={(value) => setQuery(value)} />
          )}
        </div>
        {query.trim() && results.length > 0 && (
          <Link
            href={`/szukaj?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setOpen(false)}
            className="label block border-t border-rule px-4 py-3 text-ink-soft hover:text-red"
          >
            Wszystkie wyniki dla „{query.trim()}” →
          </Link>
        )}
      </div>
    </div>
  );
}

/** /szukaj: the same search, full page, with the query in the address. */
export function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const entries = useIndex();
  const results = entries ? search(entries, query, 60) : [];
  const groups = Object.keys(SEARCH_KINDS)
    .map((kind) => ({ kind: kind as SearchKind, items: results.filter((entry) => entry.k === kind) }))
    .filter((group) => group.items.length);

  function update(value: string) {
    setQuery(value);
    router.replace(value.trim() ? `/szukaj?q=${encodeURIComponent(value.trim())}` : "/szukaj", { scroll: false });
  }

  return (
    <div>
      <label htmlFor="zapytanie" className="label text-ink-soft">
        Zapytanie
      </label>
      <div className="mt-2 flex items-center gap-3 border-b-2 border-ink">
        <SearchGlyph className="w-6 shrink-0 text-ink-soft" />
        <input
          id="zapytanie"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => update(event.target.value)}
          placeholder="np. parawan, „za moich czasów”, kolejka"
          className="min-w-0 flex-1 bg-transparent py-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-bold placeholder:font-normal placeholder:text-ink/25 focus-visible:outline-none"
        />
      </div>
      <p className="label mt-3 text-ink-soft" aria-live="polite">
        {!entries ? "Instytut przegląda kartoteki…" : query.trim() ? `Znaleziono: ${results.length}` : "Wpisz słowo albo wybierz jedno z poniższych."}
      </p>

      {entries && results.length === 0 ? (
        <div className="mt-8 border-t border-ink">
          <NoResults query={query.trim()} onSuggest={update} />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.kind} aria-label={SEARCH_KINDS[group.kind]}>
              <h2 className="label flex justify-between border-b border-ink pb-2 text-ink-soft">
                <span>{SEARCH_KINDS[group.kind]}</span>
                <span>{group.items.length}</span>
              </h2>
              <ul>
                {group.items.map((entry) => (
                  <li key={entry.h} className="border-b border-rule">
                    <Result entry={entry} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
