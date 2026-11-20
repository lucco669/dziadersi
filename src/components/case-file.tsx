"use client";

import { useState, useSyncExternalStore } from "react";
import type { Case, CaseMeta, Verdict } from "@/content/cases";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import type { VerdictCounts } from "@/lib/community";
import { site } from "@/lib/site";
import { cx, plural, pluralSl, quote, typo } from "@/lib/typo";
import { patchAccount, SignInLink, useAccount } from "./account";
import { Stamp } from "./brand";

/*
 * Komisja Orzekająca in the browser. A guest's verdicts live in localStorage, a signed-in
 * judge's come from the account. Counts come cached from the page and fresh after a vote.
 * Verdicts and counts are keyed by caseKey(), the Polish slug, in both editions: the editions
 * share the votes, and a reader who switches keeps their verdicts.
 *
 * The file takes the case and its labels as props (`caseMeta()`), never the cases module itself,
 * so the front page's case of the day doesn't ship the whole docket in both editions.
 */

const COPY = defineCopy({
  pl: {
    votes: "Głosy ławników",
    count: (n: number) => `${n} ${plural(n, "głos", "głosy", "głosów")}`,
    yours: "Twój głos",
    docket: "Sygn. akt",
    facts: "Stan faktyczny",
    defence: "Stanowisko strony",
    question: "Czy to już dziaderstwo?",
    juror: "Orzekasz jako ławnik. Jeden głos w sprawie.",
    received: "Głos przyjęty. Sekretariat liczy pozostałe, wyniki pojawią się przy następnej wizycie.",
    opinion: "Uzasadnienie Komisji",
    ruling: "Orzeczenie Komisji",
    agreed: "Twój głos jest zgodny z orzeczeniem Komisji.",
    dissent: "Zdanie odrębne: Komisja orzekła inaczej. Odnotowano.",
    next: "Następna sprawa",
    copied: "Skopiowano link ✓",
    send: "Wyślij sprawę",
    shareText: (number: string, title: string) => `Sprawa ${number}: ${title}. Czy to już dziaderstwo?`,
    shareMore: (text: string) => `${text} Orzeka Komisja ${site.name}.`,
    copy: "Skopiuj link do sprawy:",
    profile: "Ławnicy z Profilem Dziaderskim mają orzeczenia w kartotece, a po dziesięciu sprawach odznakę.",
    signUp: "Załóż Profil",
  },
  sl: {
    votes: "Glasovi porotnikov",
    count: (n: number) => `${n} ${pluralSl(n, "glas", "glasova", "glasovi", "glasov")}`,
    yours: "Tvoj glas",
    docket: "Opr. št.",
    facts: "Dejansko stanje",
    defence: "Stališče udeležene osebe",
    question: "Je to že dziaderstvo?",
    juror: "Razsojaš kot porotnik. En glas na primer.",
    received: "Glas sprejet. Tajništvo šteje preostale, rezultati bodo vidni ob naslednjem obisku.",
    opinion: "Obrazložitev Komisije",
    ruling: "Razsodba Komisije",
    agreed: "Tvoj glas se ujema z razsodbo Komisije.",
    dissent: "Ločeno mnenje: Komisija je razsodila drugače. Zabeleženo.",
    next: "Naslednji primer",
    copied: "Povezava kopirana ✓",
    send: "Pošlji primer",
    shareText: (number: string, title: string) => `Primer ${number}: ${title}. Je to že dziaderstvo?`,
    shareMore: (text: string) => `${text} Razsoja Komisija ${site.name}.`,
    copy: "Kopiraj povezavo do primera:",
    profile: "Porotniki z Dziaderskim profilom imajo razsodbe v kartoteki, po desetih primerih pa še značko.",
    signUp: "Ustvari profil",
  },
});

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
export function useVerdicts(): Record<string, Verdict> {
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

function Tally({ counts, mine, verdicts }: { counts: VerdictCounts; mine: Verdict; verdicts: CaseMeta["verdicts"] }) {
  const t = COPY[useLocale()];
  const total = verdicts.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
  return (
    <figure>
      <figcaption className="label flex justify-between text-ink-soft">
        <span>{t.votes}</span>
        <span>{t.count(total)}</span>
      </figcaption>
      <ul className="mt-3 border-t border-ink">
        {verdicts.map((option) => {
          const n = counts[option.key] ?? 0;
          const share = percent(n, total);
          return (
            <li key={option.key} className="grid grid-cols-[minmax(0,11rem)_1fr_3.5rem] items-center gap-4 border-b border-rule py-3">
              <span className={cx("font-sans text-[0.95rem] leading-tight", option.key === mine && "font-semibold")}>
                {option.label}
                {option.key === mine && <span className="label block text-red">{t.yours}</span>}
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

/** One case of the edition: the file, the three stamps, then the vote split and the Commission's opinion. */
export function CaseFile({
  item,
  meta,
  initial,
  heading = "h2",
  position,
  onNext,
}: {
  item: Case;
  /** The case's key, docket and labels in the edition: `caseMeta(item, locale)`. */
  meta: CaseMeta;
  initial: VerdictCounts | null;
  heading?: "h1" | "h2";
  /** "Sprawa 4 z 30", on the docket. */
  position?: string;
  onNext?: () => void;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const options = meta.verdicts;
  const verdicts = useVerdicts();
  const [counts, setCounts] = useState<VerdictCounts | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const key = meta.key;
  const mine = verdicts[key];
  const shown = counts ?? initial;
  const expert = options.find((option) => option.key === item.expert)!;
  const Title = heading;

  async function vote(verdict: Verdict) {
    if (sending || mine) return;
    setSending(true);
    remember(key, verdict);
    patchAccount((account) => ({ ...account, verdicts: { ...account.verdicts, [key]: verdict } }));
    try {
      const response = await fetch("/api/orzeczenia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: key, verdict }),
      });
      if (response.ok) setCounts(((await response.json()) as { counts: VerdictCounts }).counts);
    } catch {
      // The opinion is shown anyway; the counts wait for the next visit.
    } finally {
      setSending(false);
    }
  }

  async function share() {
    const url = `${window.location.origin}${localizePath(`/czy-to-juz-dziaderstwo/${item.slug}`, locale)}`;
    const text = t.shareText(meta.docket, item.title);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: text, text: t.shareMore(text), url });
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
      window.prompt(t.copy, url);
    }
  }

  return (
    <article aria-labelledby={`sprawa-${item.slug}`} className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink pb-3 text-ink-soft">
          <span>
            {t.docket} {meta.docket} · {meta.category}
          </span>
          {position && <span>{position}</span>}
        </p>
        <Title id={`sprawa-${item.slug}`} className="mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1] tracking-[-0.02em]">
          {item.title}
        </Title>
        <p className="label mt-8 text-ink-soft">{t.facts}</p>
        <p className="mt-2 max-w-2xl text-[1.25rem] leading-relaxed">{typo(item.facts)}</p>
        <p className="label mt-8 text-ink-soft">{t.defence}</p>
        <p className="mt-2 max-w-2xl border-l-2 border-red pl-5 text-[1.5rem] italic leading-snug">{quote(typo(item.defence), locale)}</p>
      </div>

      <div className="lg:col-span-5 lg:pt-10">
        {!mine ? (
          <div className="border-t border-ink pt-5">
            <p className="text-[1.75rem] font-bold leading-tight">{t.question}</p>
            <p className="label mt-1 text-ink-soft">{t.juror}</p>
            <div className="mt-6 grid gap-3">
              {options.map((option) => (
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
              <Tally counts={shown} mine={mine} verdicts={options} />
            ) : (
              <p className="border-t border-ink pt-5 leading-snug text-ink-soft">
                {typo(t.received)}
              </p>
            )}
            <section aria-label={t.opinion} className="border-t border-ink pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="label text-ink-soft">{t.ruling}</p>
                <Stamp tone={item.expert === "kliniczne" ? "red" : "ink"} className="animate-stamp text-[0.8rem] [--stamp-rotate:-3deg]">
                  {expert.label}
                </Stamp>
              </div>
              <p className="mt-5 text-[1.15rem] leading-relaxed">{typo(item.opinion)}</p>
              <p className="label mt-4 text-ink-soft">
                {mine === item.expert ? t.agreed : t.dissent}
              </p>
            </section>
            <div className="flex flex-wrap items-center gap-3">
              {onNext && (
                <button type="button" onClick={onNext} className="btn bg-ink text-paper hover:bg-red">
                  {t.next} <span aria-hidden="true">→</span>
                </button>
              )}
              <button type="button" onClick={share} className="btn border border-ink hover:bg-ink hover:text-paper">
                {copied ? t.copied : t.send}
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
  const t = COPY[useLocale()];
  if (account.status !== "guest") return null;
  return (
    <p className="label max-w-sm text-ink-soft">
      {typo(t.profile)}{" "}
      <SignInLink next="/czy-to-juz-dziaderstwo" className="link text-ink">
        {t.signUp}
      </SignInLink>
    </p>
  );
}

