"use client";

import { useState, useSyncExternalStore } from "react";
import type { ExhibitKind } from "@/content/museum";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";

const COPY = defineCopy({
  pl: {
    keep: "To jeszcze się przyda",
    kept: "Zachowano w zbiorach ✓",
    undo: "Usuń ze zbiorów",
    note: "Twoje zbiory są zapisane tylko w tej przeglądarce.",
    added: "Eksponat zachowany.",
    removed: "Eksponat usunięty ze zbiorów.",
    count: (count: number, total: number) => "W Twoich zbiorach: " + count + " z " + total,
  },
  sl: {
    keep: "To bo še prišlo prav",
    kept: "Ohranjeno v zbirki ✓",
    undo: "Odstrani iz zbirke",
    note: "Tvoja zbirka je shranjena samo v tem brskalniku.",
    added: "Eksponat je ohranjen.",
    removed: "Eksponat je odstranjen iz zbirke.",
    count: (count: number, total: number) => "V tvoji zbirki: " + count + " od " + total,
  },
});
const STORAGE = "ibd-museum-v1";
const CHANGE = "ibd-museum-change";
let memory = "[]";
let memoryOnly = false;
function read(): string[] {
  let raw = memory;
  try {
    if (!memoryOnly) raw = localStorage.getItem(STORAGE) ?? memory;
  } catch {
    /* Private browsers can still use the in-memory collection. */
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE, callback);
    window.removeEventListener("storage", callback);
  };
}

export function MuseumActions({ kind }: { kind: ExhibitKind }) {
  const t = COPY[useLocale()];
  const kept = useSyncExternalStore(
    subscribe,
    () => read().includes(kind),
    () => false,
  );
  const [announcement, setAnnouncement] = useState("");
  function toggle() {
    const previous = read();
    const next = kept ? previous.filter((item) => item !== kind) : [...new Set([...previous, kind])];
    memory = JSON.stringify(next);
    try {
      localStorage.setItem(STORAGE, memory);
    } catch {
      memoryOnly = true;
    }
    setAnnouncement(kept ? t.removed : t.added);
    window.dispatchEvent(new Event(CHANGE));
  }
  return (
    <div>
      <button
        type="button"
        aria-pressed={kept}
        onClick={toggle}
        className={
          kept ? "btn border-2 border-red text-red hover:bg-red hover:text-paper" : "btn bg-ink text-paper hover:bg-red"
        }
      >
        {kept ? t.kept : t.keep}
      </button>
      {kept && (
        <button type="button" onClick={toggle} className="link ml-4 mt-3 font-sans text-sm">
          {t.undo}
        </button>
      )}
      <p className="mt-3 font-sans text-sm text-ink-soft">{t.note}</p>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

export function MuseumCollectionCount({ kinds }: { kinds: ExhibitKind[] }) {
  const t = COPY[useLocale()];
  const count = useSyncExternalStore(
    subscribe,
    () => kinds.filter((kind) => read().includes(kind)).length,
    () => 0,
  );
  return <span aria-live="polite">{t.count(count, kinds.length)}</span>;
}
