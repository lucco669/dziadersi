"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { track } from "@/lib/analytics";
import { cx, formatNumber, plural, pluralSl, quote } from "@/lib/typo";
import type { WordPhase, WordTally } from "@/lib/word-of-year";

/*
 * The ballot of the Dziaderskie Słowo Roku in the browser. The rows of the shortlist are rendered
 * on the server; each carries a <VoteStamp>, and <BallotStatus> above the list says what happened.
 * They share one store: this browser's key and vote (localStorage), and the counts the API
 * returned after the vote. Votes are keyed by the Polish slug, in both editions.
 */

const COPY = defineCopy({
  pl: {
    vote: "Głosuję",
    voteFor: (phrase: string) => `Głosuję na zwrot ${phrase}`,
    yours: "Twój głos",
    sending: "Liczenie…",
    votes: (n: number) => `${formatNumber("pl", n)} ${plural(n, "głos", "głosy", "głosów")}`,
    counted: "Głos przyjęty. Komisja dziękuje za udział w plebiscycie.",
    repeated: (phrase: string) => `Z tej przeglądarki albo z tego konta oddano już głos, na zwrot ${phrase}. Liczy się pierwszy.`,
    failed: "Urna chwilowo nie przyjmuje głosów. Spróbuj za kilka minut; Komisja poczeka.",
    closed: "Głosowanie jest zamknięte. Głos nie został policzony.",
    mine: (phrase: string) => `Twój głos: ${phrase}.`,
    total: (n: number) => `Dotąd oddano ${formatNumber("pl", n)} ${plural(n, "głos", "głosy", "głosów")}.`,
    threshold: (from: number) => `Wyniki cząstkowe Komisja publikuje od ${formatNumber("pl", from)} głosów, żeby jeden dom nie przesądzał o wyniku.`,
    standings: "Wyniki cząstkowe, aktualizowane co kwadrans.",
    once: "Jeden głos z przeglądarki. Zmiana zdania nie jest przewidziana w regulaminie.",
  },
  sl: {
    vote: "Glasujem",
    voteFor: (phrase: string) => `Glasujem za izraz ${phrase}`,
    yours: "Tvoj glas",
    sending: "Štetje …",
    votes: (n: number) => `${formatNumber("sl", n)} ${pluralSl(n, "glas", "glasova", "glasovi", "glasov")}`,
    counted: "Glas sprejet. Komisija se zahvaljuje za sodelovanje v izboru.",
    repeated: (phrase: string) => `Iz tega brskalnika ali računa je bil glas že oddan, za izraz ${phrase}. Šteje prvi.`,
    failed: "Volilna skrinjica trenutno ne sprejema glasov. Poskusi čez nekaj minut; Komisija bo počakala.",
    closed: "Glasovanje je zaključeno. Glas ni bil štet.",
    mine: (phrase: string) => `Tvoj glas: ${phrase}.`,
    total: (n: number) => `Doslej ${pluralSl(n, "je bil oddan", "sta bila oddana", "so bili oddani", "je bilo oddanih")} ${formatNumber("sl", n)} ${pluralSl(n, "glas", "glasova", "glasovi", "glasov")}.`,
    threshold: (from: number) => `Delne rezultate Komisija objavi od ${formatNumber("sl", from)} glasov naprej, da en sam dom ne bi odločil o izidu.`,
    standings: "Delni rezultati, posodobljeni vsakih petnajst minut.",
    once: "En glas na brskalnik. Spreminjanje mnenja v pravilniku ni predvideno.",
  },
});

type Stored = { key?: string; phrase?: string };
type Outcome = "counted" | "repeated" | "failed" | "closed";
type Fresh = { total: number | null; tally: WordTally | null; outcome: Outcome } | null;

const STORAGE = "ibd-slowo-roku-2026";
const listeners = new Set<() => void>();
let raw: string | null = null;
let fresh: Fresh = null;
let sending = false;

function read() {
  if (raw === null) {
    try {
      raw = localStorage.getItem(STORAGE) ?? "{}";
    } catch {
      raw = "{}";
    }
  }
  return raw;
}

function parse(value: string): Stored {
  try {
    const stored = JSON.parse(value) as Stored;
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function store(next: Stored) {
  raw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE, raw);
  } catch {
    // The vote still counts on the server; this browser just won't remember it.
  }
}

const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function useBallot() {
  const value = useSyncExternalStore(subscribe, read, () => "{}");
  const freshValue = useSyncExternalStore(subscribe, () => fresh, () => null);
  const busy = useSyncExternalStore(subscribe, () => sending, () => false);
  return { mine: parse(value).phrase, fresh: freshValue, busy };
}

async function castVote(phrase: string) {
  if (sending) return;
  const stored = parse(read());
  const key = stored.key ?? crypto.randomUUID();
  sending = true;
  store({ ...stored, key });
  notify();
  try {
    const response = await fetch("/api/slowo-roku", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phrase, key }),
    });
    if (response.status === 409) {
      fresh = { total: null, tally: null, outcome: "closed" };
    } else if (!response.ok) {
      fresh = { total: null, tally: null, outcome: "failed" };
    } else {
      const answer = (await response.json()) as { status: "counted" | "repeated"; phrase: string; total: number | null; tally: WordTally | null };
      store({ key, phrase: answer.phrase });
      fresh = { total: answer.total, tally: answer.tally, outcome: answer.status };
      if (answer.status === "counted") track("Słowo Roku", { zwrot: answer.phrase });
    }
  } catch {
    fresh = { total: null, tally: null, outcome: "failed" };
  } finally {
    sending = false;
    notify();
  }
}

/** The stamp on one row of the shortlist, and its share of the votes once they are published. */
export function VoteStamp({ slug, phrase, phase, tally, total }: { slug: string; phrase: string; phase: WordPhase; tally: WordTally | null; total: number | null }) {
  const locale = useLocale();
  const t = COPY[locale];
  const { mine, fresh: answer, busy } = useBallot();
  const [pressed, setPressed] = useState(false);
  const shown = answer?.tally ?? tally;
  const all = answer?.total ?? total;
  const votes = shown?.[slug] ?? 0;
  const share = shown && all ? Math.round((votes / all) * 100) : null;

  return (
    <div className="grid gap-3">
      {mine === slug ? (
        <span className="ink-worn animate-stamp inline-block self-start border-4 border-double border-red px-3 py-1.5 font-sans text-[0.8rem] font-bold uppercase leading-none tracking-[0.12em] text-red [--stamp-rotate:-4deg]">
          {t.yours}
        </span>
      ) : (
        phase === "voting" &&
        !mine && (
          <button
            type="button"
            disabled={busy}
            aria-label={t.voteFor(phrase)}
            onClick={() => {
              setPressed(true);
              void castVote(slug);
            }}
            className="self-start border-4 border-double border-ink px-4 py-2.5 font-sans text-[0.9rem] font-bold uppercase tracking-[0.08em] transition-[transform,background-color,color] hover:-rotate-1 hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            {busy && pressed ? t.sending : t.vote}
          </button>
        )
      )}
      {share !== null && (
        <div className="max-w-56">
          <div className="flex items-baseline justify-between gap-3 font-sans text-[0.85rem] font-semibold tabular-nums">
            <span>{locale === "sl" ? `${share} %` : `${share}%`}</span>
            <span className="text-ink-soft">{t.votes(votes)}</span>
          </div>
          <div className="mt-1 h-2.5 bg-ink/10">
            <div className={cx("h-full origin-left animate-[grow-x_700ms_cubic-bezier(0.2,0.8,0.2,1)_both]", mine === slug ? "bg-red" : "bg-ink")} style={{ width: `${share}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/** One or two lines above the shortlist: the turnout, the threshold and what happened to this browser's vote. */
export function BallotStatus({
  phase,
  total,
  published,
  standingsFrom,
  headwords,
}: {
  phase: WordPhase;
  total: number | null;
  published: boolean;
  standingsFrom: number;
  /** Polish slug → the edition's headword, to name the voted phrase. */
  headwords: Record<string, string>;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const { mine, fresh: answer } = useBallot();
  const all = answer?.total ?? total;
  const named = (slug: string) => quote(headwords[slug] ?? slug, locale);
  const lines: { text: string; tone?: "red" }[] = [];
  if (answer?.outcome === "counted") lines.push({ text: t.counted, tone: "red" });
  else if (answer?.outcome === "repeated" && mine) lines.push({ text: t.repeated(named(mine)), tone: "red" });
  else if (answer?.outcome === "failed") lines.push({ text: t.failed, tone: "red" });
  else if (answer?.outcome === "closed") lines.push({ text: t.closed, tone: "red" });
  else if (mine) lines.push({ text: t.mine(named(mine)) });
  if (phase === "voting") {
    if (all !== null) lines.push({ text: t.total(all) });
    lines.push({ text: answer?.tally || published ? t.standings : all !== null && all < standingsFrom ? t.threshold(standingsFrom) : t.once });
  }
  if (!lines.length) return null;
  return (
    <div aria-live="polite" className="label space-y-1">
      {lines.map((line) => (
        <p key={line.text} className={line.tone === "red" ? "text-red" : "text-ink-soft"}>
          {line.text}
        </p>
      ))}
    </div>
  );
}
