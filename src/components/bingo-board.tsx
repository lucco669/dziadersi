"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocale } from "@/i18n/client";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { CARD_SIZE, CENTRE, LINES, randomSeed, type Card } from "@/lib/bingo";
import { tally } from "@/lib/tally";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { patchAccount, useAccount } from "./account";
import { BingoGrid } from "./bingo-grid";
import { BookmarkButton } from "./bookmark";
import { Stamp } from "./brand";

const COPY = defineCopy({
  pl: {
    clear: "Wyczyścić kartę? Skreślenia przepadną.",
    full: "Pełna karta",
    crossed: (crossed: number, of: number) => `Skreślono ${crossed} z ${of}`,
    lines: (lines: number) => ` · ${lines} ${plural(lines, "linia", "linie", "linii")}`,
    first: (at: string) => `Pierwsze bingo o ${at}`,
    fullText: "Karta zapełniona. Instytut gratuluje rodzinie i prosi o zachowanie karty do celów naukowych.",
    bingoText: "Bingo! Należy wstać i krzyknąć. Instytut nie odpowiada za reakcję wujka.",
    filed: "Wygrana karta trafiła do zakładek w Profilu Dziaderskim. Odznaka „Bingo” przyznana.",
    collect: "Wygrane karty zbiera Profil Dziaderski, razem z odznaką „Bingo”.",
    keep: "Zachowaj kartę",
    another: "Nowa karta",
    print: "Drukuj",
    sheet: "Cztery karty do druku",
    reset: "Wyczyść kartę",
  },
  sl: {
    clear: "Počistiti listek? Prečrtana polja bodo izgubljena.",
    full: "Poln listek",
    crossed: (crossed: number, of: number) => `Prečrtano ${crossed} od ${of}`,
    lines: (lines: number) => ` · ${lines} ${pluralSl(lines, "vrsta", "vrsti", "vrste", "vrst")}`,
    first: (at: string) => `Prvi bingo ob ${at}`,
    fullText: "Listek je poln. Inštitut čestita družini in prosi, da se listek shrani za znanstvene namene.",
    bingoText: "Bingo! Treba je vstati in zavpiti. Inštitut ne odgovarja za stričev odziv.",
    filed: "Zmagovalni listek je med zaznamki v Dziaderskem profilu. Značka »Bingo« je podeljena.",
    collect: "Zmagovalne listke zbira Dziaderski profil, skupaj z značko »Bingo«.",
    keep: "Ohrani listek",
    another: "Nov listek",
    print: "Natisni",
    sheet: "Štirje listki za tisk",
    reset: "Počisti listek",
  },
});

/*
 * Marks live in this browser only: a module-level copy (so play works when storage is blocked)
 * persisted to localStorage per card code. Codes are the same in both editions, and so are the marks.
 */

type Saved = { marks: number; at?: string };

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const keyOf = (code: string) => `ibd-bingo:${code}`;

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function load(key: string) {
  if (!memory.has(key)) {
    try {
      memory.set(key, localStorage.getItem(key) ?? "");
    } catch {
      memory.set(key, "");
    }
  }
  return memory.get(key) ?? "";
}

function save(key: string, saved: Saved | null) {
  const value = saved ? JSON.stringify(saved) : "";
  memory.set(key, value);
  try {
    if (saved) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked: the card still works until the tab is closed.
  }
  listeners.forEach((listener) => listener());
}

function parse(raw: string): Saved {
  try {
    const saved = raw ? (JSON.parse(raw) as Saved) : null;
    return saved && Number.isInteger(saved.marks) ? saved : { marks: 0 };
  } catch {
    return { marks: 0 };
  }
}

const isMarked = (marks: number, i: number) => i === CENTRE || ((marks >>> i) & 1) === 1;
const linesOf = (marks: number) => LINES.filter((line) => line.every((i) => isMarked(marks, i)));

function time(locale: Locale) {
  const value = new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { hour: "2-digit", minute: "2-digit" }).format(new Date());
  // Slovenian writes the time with a dot: 14.05.
  return locale === "sl" ? value.replace(":", ".") : value;
}

/** Where a line runs across the grid, in percent: from the centre of its first square to its last. */
function lineEnds(line: number[]) {
  const centre = (i: number) => [((i % 5) + 0.5) * 20, (Math.floor(i / 5) + 0.5) * 20];
  const [x1, y1] = centre(line[0]);
  const [x2, y2] = centre(line[4]);
  // Run a little past the outer squares.
  const dx = (x2 - x1) * 0.08;
  const dy = (y2 - y1) * 0.08;
  return { x1: x1 - dx, y1: y1 - dy, x2: x2 + dx, y2: y2 + dy };
}

const randomCardPath = (slug: string) => `/bingo/${slug}-${randomSeed().toString(36).padStart(5, "0")}`;

/** A fresh card for an occasion: every guest at the table should get a different one. */
export function NewCardButton({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <button
      type="button"
      onClick={() => {
        tally("bingo-karta");
        router.push(localizePath(randomCardPath(slug), locale));
      }}
      className={className}
    >
      {children}
    </button>
  );
}

/** The playable card: tap to cross out, five in a line is bingo. */
export function BingoBoard({ card }: { card: Card }) {
  const router = useRouter();
  const locale = useLocale();
  const t = COPY[locale];
  const account = useAccount();
  const key = keyOf(card.code);
  const raw = useSyncExternalStore(subscribe, () => load(key), () => "");
  const saved = parse(raw);
  const [fresh, setFresh] = useState(false);

  const marked = Array.from({ length: CARD_SIZE }, (_, i) => isMarked(saved.marks, i));
  const lines = linesOf(saved.marks);
  const crossed = marked.filter(Boolean).length - 1;
  const full = crossed === CARD_SIZE - 1;

  function toggle(i: number) {
    const marks = saved.marks ^ (1 << i);
    const before = lines.length;
    const after = linesOf(marks).length;
    const at = after > 0 ? (saved.at ?? time(locale)) : undefined;
    save(key, marks ? { marks, at } : null);
    if (marks & (1 << i)) tally("bingo-pole");
    if (after > before) {
      setFresh(true);
      track("Bingo", { okazja: card.occasion.slug, linie: after });
      tally("bingo");
      fileWinner();
    }
  }

  /** A signed-in player's winning card goes to the profile by itself. */
  function fileWinner() {
    if (account.status !== "member" || account.account.saved.bingo.includes(card.code)) return;
    patchAccount((current) => ({ ...current, saved: { ...current.saved, bingo: [...current.saved.bingo, card.code] } }));
    fetch("/api/zakladki", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "bingo", code: card.code }),
    }).catch(() => {});
  }

  function reset() {
    if (!window.confirm(t.clear)) return;
    save(key, null);
    setFresh(false);
  }

  const another = () => {
    tally("bingo-karta");
    router.push(localizePath(randomCardPath(card.occasion.slug), locale));
  };

  const overlay =
    lines.length > 0 ? (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {lines.map((line) => {
          const ends = lineEnds(line);
          return (
            <line
              key={line.join("-")}
              {...ends}
              pathLength={1}
              stroke="var(--color-red)"
              strokeWidth={6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.75}
              className="animate-draw [stroke-dasharray:1] [animation-duration:450ms]"
            />
          );
        })}
      </svg>
    ) : null;

  return (
    <div>
      <div className="relative">
        <BingoGrid card={card} locale={locale} marked={marked} onToggle={toggle} overlay={overlay} className="border border-ink" />
        {lines.length > 0 && (
          <Stamp
            key={lines.length}
            className={cx(
              "absolute -right-2 -top-3 bg-card/90 text-[1.15rem] md:text-[1.5rem] [--stamp-rotate:8deg]",
              fresh ? "animate-stamp" : "rotate-[8deg]",
            )}
          >
            {full ? t.full : lines.length > 1 ? `Bingo × ${lines.length}` : "Bingo!"}
          </Stamp>
        )}
      </div>

      <p className="label mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft print:hidden" aria-live="polite">
        <span>
          {t.crossed(crossed, CARD_SIZE - 1)}
          {lines.length > 0 && t.lines(lines.length)}
        </span>
        {saved.at && <span className="text-red">{t.first(saved.at)}</span>}
      </p>
      {lines.length > 0 && (
        <p className="mt-3 max-w-xl text-lg leading-snug print:hidden">
          {typo(full ? t.fullText : t.bingoText)}
        </p>
      )}
      {lines.length > 0 && (
        <p className="label mt-3 max-w-xl text-ink-soft print:hidden">
          {account.status === "member" ? (
            <>{t.filed}</>
          ) : (
            <>
              {typo(t.collect)}{" "}
              <BookmarkButton kind="bingo" code={card.code} label={t.keep} className="link text-ink" />
            </>
          )}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
        <button type="button" onClick={another} className="btn bg-ink text-paper hover:bg-red">
          {t.another} <span aria-hidden="true">↻</span>
        </button>
        <button type="button" onClick={() => window.print()} className="btn border border-ink hover:bg-ink hover:text-paper">
          {t.print}
        </button>
        <Link href={`/bingo/${card.code}/druk`} className="btn border border-ink hover:bg-ink hover:text-paper">
          {t.sheet}
        </Link>
        {crossed > 0 && (
          <button type="button" onClick={reset} className="link ml-1 font-sans font-medium text-ink-soft">
            {t.reset}
          </button>
        )}
      </div>
    </div>
  );
}
