import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";

/*
 * Wyszukiwarka Instytutu: one small index of everything worth finding per edition, built from the
 * content files and served as static JSON, searched in the browser. Diacritics are folded, so
 * "lozko" finds "łóżko" and "zaba" finds "žaba".
 */

export type SearchKind = "dzial" | "gatunek" | "haslo" | "sprawa" | "raport" | "bingo" | "rozmowki";

const KINDS = defineCopy<Record<SearchKind, string>>({
  pl: {
    dzial: "Działy",
    gatunek: "Atlas Dziadersów",
    haslo: "Słownik Dziaderski",
    sprawa: "Komisja Orzekająca",
    raport: "Raporty",
    bingo: "Dziaders Bingo",
    rozmowki: "Rozmówki",
  },
  sl: {
    dzial: "Oddelki",
    gatunek: "Atlas dziadersov",
    haslo: "Dziaderski slovar",
    sprawa: "Razsodna komisija",
    raport: "Poročila",
    bingo: "Dziaders bingo",
    rozmowki: "Pogovornik",
  },
});

export const searchKinds = (locale: Locale) => KINDS[locale];

/** Compact on purpose: the whole index travels to the browser. */
export type SearchEntry = {
  /** Kind. */
  k: SearchKind;
  /** Title. */
  t: string;
  /** Subtitle: one line under the title. */
  s: string;
  /** Link. */
  h: string;
  /** Everything searchable, folded. */
  x: string;
  /** Species key for a plate, or a department path for a menu pictogram. */
  i?: string;
};

export const fold = (text: string) =>
  text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[„”"'’.,:;!?()«»–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const KIND_WEIGHT: Record<SearchKind, number> = { dzial: 6, gatunek: 4, haslo: 3, sprawa: 2, raport: 2, bingo: 1, rozmowki: 1 };

/** Every token must appear somewhere; titles and word starts count most. */
export function search(index: SearchEntry[], query: string, locale: Locale, limit = 24): SearchEntry[] {
  const tokens = fold(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of index) {
    const title = fold(entry.t);
    let score = 0;
    let all = true;
    for (const token of tokens) {
      if (title.startsWith(token)) score += 40;
      else if (title.includes(` ${token}`)) score += 28;
      else if (title.includes(token)) score += 18;
      else if (entry.x.includes(` ${token}`) || entry.x.startsWith(token)) score += 8;
      else if (entry.x.includes(token)) score += 3;
      else {
        all = false;
        break;
      }
    }
    if (all) scored.push({ entry, score: score + KIND_WEIGHT[entry.k] });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.t.localeCompare(b.entry.t, locale))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/** What to offer before anything is typed. */
const SUGGESTION_COPY = defineCopy({
  pl: ["szczypce", "parawan", "pilot", "kolejka", "Passat", "rosół", "wesele", "parapet"],
  sl: ["klešče", "vetrobran", "daljinec", "vrsta", "Passat", "juha", "svatba", "okno"],
});

export const searchSuggestions = (locale: Locale) => SUGGESTION_COPY[locale];
