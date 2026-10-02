"use client";

import { track } from "@vercel/analytics";
import { useRef, useState, useSyncExternalStore } from "react";
import { SITUATIONS } from "@/content/phrasebook";
import { line as compose, listsOf, type Line, type Picks } from "@/lib/phrasebook";
import { site } from "@/lib/site";
import { cx, typo } from "@/lib/typo";
import { useKeys, useLater, useReducedMotion } from "./hooks";
import { SituationIcon } from "./occasions";
import { Figure } from "./pictograms";

const PARTS = [
  { label: "Zagajenie", note: "linia przerywana", underline: "decoration-dashed" },
  { label: "Teza", note: "dwie linie, jak orzeczenie", underline: "decoration-double" },
  { label: "Puenta", note: "falka", underline: "decoration-wavy" },
] as const;

const REEL_MS = [420, 700, 980];
const TICK_MS = 70;

const noSubscription = () => () => {};
const count = new Intl.NumberFormat("pl-PL");

function speak(text: string, onEnd: () => void) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pl-PL";
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("pl"));
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 0.7;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

/** The phrasebook machine: pick a chapter, pull the lever, hold the parts worth keeping. */
export function Phrasebook({ initial }: { initial: { slug: string; picks: Picks } }) {
  const [slug, setSlug] = useState(initial.slug);
  const [picks, setPicks] = useState<Picks>(initial.picks);
  const [shown, setShown] = useState<Picks>(initial.picks);
  const [rolling, setRolling] = useState([false, false, false]);
  const [held, setHeld] = useState([false, false, false]);
  const [speaking, setSpeaking] = useState(false);
  const [notice, setNotice] = useState("");
  const timers = useRef<number[]>([]);
  const later = useLater();
  const reduced = useReducedMotion();
  const canSpeak = useSyncExternalStore(noSubscription, () => "speechSynthesis" in window, () => false);
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);

  const situation = SITUATIONS.find((item) => item.slug === slug) ?? SITUATIONS[0];
  const lists = listsOf(situation);
  const current: Line = compose(situation, picks);
  const display = shown.map((pick, i) => lists[i][Math.min(pick, lists[i].length - 1)]);
  const busy = rolling.some(Boolean);

  function stopReels() {
    timers.current.forEach((id) => window.clearInterval(id));
    timers.current = [];
  }

  function roll(next = situation, keep = held) {
    if (busy) return;
    const nextLists = listsOf(next);
    const target = nextLists.map((list, i) => (keep[i] && next === situation ? picks[i] : Math.floor(Math.random() * list.length))) as Picks;
    setPicks(target);
    if (speaking) speechSynthesis.cancel();
    track("Rozmówki", { rozdzial: next.slug });

    if (reduced) {
      setShown(target);
      return;
    }
    const spinning = target.map((_, i) => !(keep[i] && next === situation));
    setRolling(spinning);
    spinning.forEach((spin, i) => {
      if (!spin) return;
      const id = window.setInterval(() => {
        setShown((now) => {
          const copy = [...now] as Picks;
          copy[i] = Math.floor(Math.random() * nextLists[i].length);
          return copy;
        });
      }, TICK_MS);
      timers.current.push(id);
      later(REEL_MS[i], () => {
        window.clearInterval(id);
        setShown((now) => {
          const copy = [...now] as Picks;
          copy[i] = target[i];
          return copy;
        });
        setRolling((now) => now.map((value, j) => (j === i ? false : value)));
      });
    });
  }

  function choose(nextSlug: string) {
    if (busy || nextSlug === slug) return;
    const next = SITUATIONS.find((item) => item.slug === nextSlug);
    if (!next) return;
    stopReels();
    setSlug(nextSlug);
    setHeld([false, false, false]);
    roll(next, [false, false, false]);
  }

  function toggleHold(i: number) {
    setHeld((now) => now.map((value, j) => (j === i ? !value : value)));
  }

  function read() {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(current.text, () => setSpeaking(false));
    track("Rozmówki", { akcja: "czytaj" });
  }

  async function share() {
    const url = `${origin}/generator/${current.code}`;
    track("Udostępnienie", { kanal: canShare ? "natywne" : "link", typ: "rozmowki" });
    if (canShare) {
      try {
        await navigator.share({ text: `„${current.text}”`, url });
      } catch {
        // Closing the share sheet is fine.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Link do wypowiedzi skopiowany.");
    } catch {
      window.prompt("Skopiuj link do wypowiedzi:", url);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`„${current.text}” Rozmówki dziaderskie, ${origin}/generator/${current.code}`);
      setNotice("Wypowiedź skopiowana. Można wkleić na grupę rodzinną.");
    } catch {
      window.prompt("Skopiuj wypowiedź:", current.text);
    }
    track("Udostępnienie", { kanal: "tekst", typ: "rozmowki" });
  }

  useKeys((key, event) => {
    if (event.target instanceof HTMLButtonElement) return;
    if (key === " " || key === "enter") {
      event.preventDefault();
      roll();
    } else if (["1", "2", "3"].includes(key)) {
      event.preventDefault();
      toggleHold(Number(key) - 1);
    }
  });

  return (
    <div>
      <div role="group" aria-label="Rozdziały rozmówek" className="grid grid-cols-3 border-l border-t border-ink md:grid-cols-6">
        {SITUATIONS.map((item) => {
          const active = item.slug === slug;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active}
              onClick={() => choose(item.slug)}
              className={cx(
                "flex flex-col items-center gap-2 border-b border-r border-ink px-2 py-3 font-sans text-[0.88rem] font-medium leading-tight transition-colors md:py-4",
                active ? "bg-ink text-paper" : "hover:bg-paper-deep",
              )}
            >
              <span className={cx("p-1", active && "bg-paper")}>
                <SituationIcon slug={item.slug} className="h-8 w-10" />
              </span>
              {item.short}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid max-w-5xl items-end gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-2">
        <svg viewBox="-4 -1 56 97" className="hidden h-72 shrink-0 md:block" aria-hidden="true">
          <Figure right="point" glasses="eyes" mustacheClassName={cx(speaking && "animate-talk")} />
        </svg>
        <div className="md:mb-32">
          <blockquote className="relative bg-red px-6 py-6 text-paper md:px-8 md:py-7" aria-live="polite" aria-busy={busy}>
            <span
              aria-hidden="true"
              className="absolute -left-3.5 bottom-6 hidden size-0 border-y-[10px] border-r-[14px] border-y-transparent border-r-red md:block"
            />
            <p className="min-h-[4.8em] text-[clamp(1.45rem,2.6vw,2.15rem)] font-bold leading-[1.18] md:min-h-[3.6em]">
              {display.map((part, i) => (
                <span key={i} className={cx(rolling[i] && "opacity-60 blur-[0.4px]")}>
                  {typo(part)}
                  {i < 2 ? " " : ""}
                </span>
              ))}
            </p>
          </blockquote>
          <p className="label mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
            <span>
              {situation.name} · wypowiedź nr {count.format(current.number)} z {count.format(current.total)}
            </span>
            <span aria-live="polite" className="text-red">
              {notice}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => roll()} disabled={busy} className="btn bg-ink text-paper hover:bg-red disabled:opacity-60">
          Losuj wypowiedź <span aria-hidden="true">↻</span>
        </button>
        {canSpeak && (
          <button type="button" onClick={read} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
            {speaking ? "Cisza" : "Przeczytaj na głos"}
          </button>
        )}
        <button type="button" onClick={share} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
          {canShare ? "Udostępnij" : "Kopiuj link"}
        </button>
        <button type="button" onClick={copy} className="link ml-1 font-sans font-medium">
          Kopiuj tekst
        </button>
        <span className="label ml-auto hidden text-ink-faint md:inline">Spacja losuje · 1–3 zostawiają część</span>
      </div>

      <section aria-labelledby="rozbior" className="mt-16 max-w-4xl">
        <h2 id="rozbior" className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-ink pb-3">
          <span className="text-2xl font-bold">Rozbiór wypowiedzi</span>
          <span className="label text-ink-soft">Oznaczenia jak na lekcji polskiego</span>
        </h2>
        <ol>
          {PARTS.map((part, i) => (
            <li key={part.label} className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[10rem_1fr_auto]">
              <span className="label col-start-1 row-start-1 pt-1 text-ink-soft">
                <span className="text-ink">{part.label}</span>
                <span className="block text-ink-faint">{part.note}</span>
              </span>
              <span
                className={cx(
                  "col-span-2 col-start-1 row-start-2 text-xl leading-relaxed underline decoration-red decoration-[1.5px] underline-offset-[6px] md:col-span-1 md:col-start-2 md:row-start-1",
                  part.underline,
                )}
              >
                {typo(display[i])}
              </span>
              <button
                type="button"
                aria-pressed={held[i]}
                onClick={() => toggleHold(i)}
                className={cx(
                  "label col-start-2 row-start-1 border px-3 py-1.5 transition-colors md:col-start-3",
                  held[i] ? "border-red bg-red text-paper" : "border-ink hover:bg-paper-deep",
                )}
              >
                {held[i] ? "Zostaje" : "Zostaw"}
              </button>
            </li>
          ))}
        </ol>
        <p className="label mt-4 max-w-xl text-ink-soft">
          {typo("Zostawiona część nie zmienia się przy losowaniu. Instytut zaleca zostawić puentę: dobra puenta pasuje do wszystkiego.")}
        </p>
      </section>
    </div>
  );
}
