"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CASE_CATEGORIES, CASES, docket, VERDICTS, type Case, type Verdict } from "@/content/cases";
import type { VerdictCounts } from "@/lib/community";
import { site } from "@/lib/site";
import { cx, plural, typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";
import { Stamp } from "./brand";

/*
 * Komisja Orzekająca in the browser. A guest's verdicts live in localStorage, a signed-in
 * judge's come from the account. Counts come cached from the page and fresh after a vote.
 */

const LOCAL_KEY = "ibd-komisja";
const listeners = new Set<() => void>();
let snapshot: string | null = null;

function readRaw() {
  if (snapshot === null) {
    try {
      snapshot = localStorage.getItem(LOCAL_KEY) ?? "{}";
    } catch {
      snapshot = "{}";
    }
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function remember(slug: string, verdict: Verdict) {
  const next = JSON.stringify({ ...parse(readRaw()), [slug]: verdict });
  snapshot = next;
  try {
    localStorage.setItem(LOCAL_KEY, next);
  } catch {
    // The vote still counts; the browser just won't remember it.
  }
  listeners.forEach((listener) => listener());
}

function parse(raw: string): Record<string, Verdict> {
  try {
    return JSON.parse(raw) as Record<string, Verdict>;
  } catch {
    return {};
  }
}

/** Every verdict this visitor has given: the account's, then this browser's. */
function useVerdicts(): Record<string, Verdict> {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}");
  const account = useAccount();
  const local = parse(raw);
  return account.status === "member" ? { ...local, ...account.account.verdicts } : local;
}

const STAMP_STYLE: Record<Verdict, string> = {
  nie: "border-ink text-ink hover:bg-ink hover:text-paper",
  tak: "border-ink text-ink hover:bg-ink hover:text-paper",
  kliniczne: "border-red text-red hover:bg-red hover:text-paper",
};

const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function Tally({ counts, mine }: { counts: VerdictCounts; mine: Verdict }) {
  const total = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
  return (
    <figure>
      <figcaption className="label flex justify-between text-ink-soft">
        <span>Głosy ławników</span>
        <span>
          {total} {plural(total, "głos", "głosy", "głosów")}
        </span>
      </figcaption>
      <ul className="mt-3 border-t border-ink">
        {VERDICTS.map((option) => {
          const n = counts[option.key] ?? 0;
          const share = percent(n, total);
          return (
            <li key={option.key} className="grid grid-cols-[minmax(0,11rem)_1fr_3.5rem] items-center gap-4 border-b border-rule py-3">
              <span className={cx("font-sans text-[0.95rem] leading-tight", option.key === mine && "font-semibold")}>
                {option.label}
                {option.key === mine && <span className="label block text-red">Twój głos</span>}
              </span>
              <span className="h-3 bg-ink/10">
                <span
                  className={cx("block h-full origin-left animate-[grow-x_700ms_cubic-bezier(0.2,0.8,0.2,1)_both]", option.key === "kliniczne" ? "bg-red" : "bg-ink")}
                  style={{ width: `${share}%` }}
                />
              </span>
              <span className="text-right text-2xl font-bold tabular-nums">{share}%</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/** One case: the file, the three stamps, then the vote split and the Commission's opinion. */
export function CaseFile({
  item,
  initial,
  heading = "h2",
  position,
  onNext,
}: {
  item: Case;
  initial: VerdictCounts | null;
  heading?: "h1" | "h2";
  /** "Sprawa 4 z 30", on the docket. */
  position?: string;
  onNext?: () => void;
}) {
  const verdicts = useVerdicts();
  const [counts, setCounts] = useState<VerdictCounts | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const mine = verdicts[item.slug];
  const shown = counts ?? initial;
  const expert = VERDICTS.find((option) => option.key === item.expert)!;
  const Title = heading;

  async function vote(verdict: Verdict) {
    if (sending || mine) return;
    setSending(true);
    remember(item.slug, verdict);
    patchAccount((account) => ({ ...account, verdicts: { ...account.verdicts, [item.slug]: verdict } }));
    try {
      const response = await fetch("/api/orzeczenia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: item.slug, verdict }),
      });
      if (response.ok) setCounts(((await response.json()) as { counts: VerdictCounts }).counts);
    } catch {
      // The opinion is shown anyway; the counts wait for the next visit.
    } finally {
      setSending(false);
    }
  }

  async function share() {
    const url = `${window.location.origin}/czy-to-juz-dziaderstwo/${item.slug}`;
    const text = `Sprawa ${docket(item)}: ${item.title}. Czy to już dziaderstwo?`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: text, text: `${text} Orzeka Komisja ${site.name}.`, url });
      } catch {
        // Closed the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Skopiuj link do sprawy:", url);
    }
  }

  return (
    <article aria-labelledby={`sprawa-${item.slug}`} className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink pb-3 text-ink-soft">
          <span>
            Sygn. akt {docket(item)} · {CASE_CATEGORIES[item.category]}
          </span>
          {position && <span>{position}</span>}
        </p>
        <Title id={`sprawa-${item.slug}`} className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1] tracking-[-0.02em]">
          {item.title}
        </Title>
        <p className="label mt-8 text-ink-soft">Stan faktyczny</p>
        <p className="mt-2 max-w-2xl text-[1.25rem] leading-relaxed">{typo(item.facts)}</p>
        <p className="label mt-8 text-ink-soft">Uczestnik wyjaśnia</p>
        <p className="mt-2 max-w-2xl border-l-2 border-red pl-5 text-[1.5rem] italic leading-snug">„{typo(item.defence)}”</p>
      </div>

      <div className="lg:col-span-5 lg:pt-10">
        {!mine ? (
          <div className="border-t border-ink pt-5">
            <p className="text-[1.75rem] font-bold leading-tight">Czy to już dziaderstwo?</p>
            <p className="label mt-1 text-ink-soft">Orzekasz jako ławnik. Jeden głos w sprawie.</p>
            <div className="mt-6 grid gap-3">
              {VERDICTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled={sending}
                  onClick={() => vote(option.key)}
                  className={cx(
                    "border-4 border-double px-5 py-4 text-left font-sans text-[1rem] font-bold uppercase tracking-[0.08em] transition-[transform,background-color,color] hover:-rotate-1 disabled:opacity-60",
                    STAMP_STYLE[option.key],
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {shown && Object.keys(shown).length ? (
              <Tally counts={shown} mine={mine} />
            ) : (
              <p className="border-t border-ink pt-5 leading-snug text-ink-soft">
                {typo("Głos przyjęty. Sekretariat liczy pozostałe, wyniki pojawią się przy następnej wizycie.")}
              </p>
            )}
            <section aria-label="Uzasadnienie Komisji" className="border-t border-ink pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="label text-ink-soft">Orzeczenie Komisji</p>
                <Stamp tone={item.expert === "kliniczne" ? "red" : "ink"} className="animate-stamp text-[0.8rem] [--stamp-rotate:-3deg]">
                  {expert.label}
                </Stamp>
              </div>
              <p className="mt-5 text-[1.15rem] leading-relaxed">{typo(item.opinion)}</p>
              <p className="label mt-4 text-ink-soft">
                {mine === item.expert ? "Twój głos jest zgodny z orzeczeniem Komisji." : "Zdanie odrębne: Komisja orzekła inaczej. Odnotowano."}
              </p>
            </section>
            <div className="flex flex-wrap items-center gap-3">
              {onNext && (
                <button type="button" onClick={onNext} className="btn bg-ink text-paper hover:bg-red">
                  Następna sprawa <span aria-hidden="true">→</span>
                </button>
              )}
              <button type="button" onClick={share} className="btn border border-ink hover:bg-ink hover:text-paper">
                {copied ? "Skopiowano link ✓" : "Wyślij sprawę"}
              </button>
            </div>
            <JurorNote />
          </div>
        )}
      </div>
    </article>
  );
}

/** After a guest's vote: one line about keeping verdicts in the profile. */
function JurorNote() {
  const account = useAccount();
  if (account.status !== "guest") return null;
  return (
    <p className="label max-w-sm text-ink-soft">
      {typo("Ławnicy z Profilem Dziaderskim mają orzeczenia w kartotece, a po dziesięciu sprawach odznakę.")}{" "}
      <Link href={signInHref("/czy-to-juz-dziaderstwo")} className="link text-ink">
        Załóż profil
      </Link>
    </p>
  );
}

/** The docket on the Komisja's page: one case at a time, starting with the first not yet judged. */
export function Docket({ counts }: { counts: Record<string, VerdictCounts> | null }) {
  const verdicts = useVerdicts();
  const [chosen, setChosen] = useState<string | null>(null);
  const judged = CASES.filter((item) => verdicts[item.slug]).length;
  const firstOpen = CASES.find((item) => !verdicts[item.slug]) ?? CASES[0];
  const current = CASES.find((item) => item.slug === chosen) ?? firstOpen;
  const index = CASES.indexOf(current);

  function next() {
    const after = [...CASES.slice(index + 1), ...CASES.slice(0, index)];
    const open = after.find((item) => !verdicts[item.slug]) ?? after[0];
    setChosen(open.slug);
    document.getElementById("wokanda")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <CaseFile
        key={current.slug}
        item={current}
        initial={counts?.[current.slug] ?? null}
        position={`Rozpatrzono ${judged} z ${CASES.length}`}
        onNext={next}
      />
      <nav aria-label="Sprawy na wokandzie" className="mt-12 flex flex-wrap gap-1.5">
        {CASES.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setChosen(item.slug)}
            aria-current={item === current ? "true" : undefined}
            title={`${docket(item)}: ${item.title}`}
            className={cx(
              "size-8 font-sans text-[0.8rem] font-semibold tabular-nums transition-colors",
              item === current ? "bg-red text-paper" : verdicts[item.slug] ? "bg-ink text-paper" : "border border-ink/30 text-ink-soft hover:border-ink",
            )}
          >
            {item.number}
          </button>
        ))}
      </nav>
    </div>
  );
}
