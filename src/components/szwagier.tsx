"use client";

import { track } from "@vercel/analytics";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";
import { answerPath, ask, decodeAnswer, QUESTION_LIMIT, type Answer, type Crisis, type Mode } from "@/lib/szwagier";
import { tally } from "@/lib/tally";
import { cx, formatNumber, quote, typo } from "@/lib/typo";
import { useReducedMotion } from "./hooks";
import { Figure, INK, PAPER, Sweater } from "./pictograms";

const COPY = defineCopy({
  pl: {
    models: [
      { label: "1.9 TDI", note: "Standard. Pali mało, odpowiada na wszystko." },
      { label: "1.9 TDI z namysłem", note: "Myśli dłużej, w garażu. Odpowiada tak samo, ale pewniej." },
      { label: "Elektryk", note: "W przygotowaniu od 2019 roku." },
    ],
    modelGroup: "Wersja modelu",
    electric: "Wersja elektryczna niedostępna. SZWAGIER pyta: a jak prąd wyłączą?",
    temperature: "Temperatura 0: model nie zmienia zdania",
    welcome: "Pytaj. Wiem wszystko.",
    welcomeNote: "SZWAGIER 1.9 TDI, gotów do pracy",
    label: "Pytanie do SZWAGRA",
    placeholder: "Na przykład: czy warto kupić diesla?",
    submit: "Zapytaj",
    disclaimer: "SZWAGIER się nie myli. Jeśli odpowiedź wydaje się błędna, sprawdź jeszcze raz swoje pytanie.",
    keys: "Enter wysyła",
    question: "Pytanie",
    withheld: "Pytanie zawierało słowa, których Instytut nie drukuje.",
    thinking: "SZWAGIER myśli…",
    showSteps: "pokaż tok rozumowania",
    hideSteps: "ukryj tok rozumowania",
    field: (name: string) => `Dziedzina: ${name.toLowerCase()}`,
    sources: "Źródła",
    again: "Wygeneruj ponownie",
    repeats: ["Mówiłem już.", "Powtarzam, wolniej.", "Trzeci raz nie będę powtarzał.", "Dobrze, ostatni raz.", "Jak mówiłem."],
    share: "Udostępnij",
    copyLink: "Kopiuj link",
    copyText: "Kopiuj odpowiedź",
    linkCopied: "Link do odpowiedzi skopiowany.",
    linkPrompt: "Skopiuj link do odpowiedzi:",
    textCopied: "Odpowiedź skopiowana. Można wkleić na grupę rodzinną.",
    textPrompt: "Skopiuj odpowiedź:",
    clipping: (question: string, answer: string, url: string) => `${question ? `„${question}”\n` : ""}SZWAGIER 1.9 TDI: „${answer}”\n${url}`,
    helpful: "Pomocne?",
    yes: "Tak",
    no: "Nie",
    thanked: "SZWAGIER wiedział.",
    objected: "Uwaga przyjęta. SZWAGIER się z nią nie zgadza.",
    suggestions: "Pytania na początek",
    examples: [
      "Czy warto kupić elektryka?",
      "Jak ustawić router?",
      "Kiedy zmienić opony?",
      "Dlaczego drukarka nie drukuje?",
      "Co ugotować na niedzielny obiad?",
      "Gdzie jechać na urlop?",
      "Kim jesteś?",
    ],
    register: "Rejestr zapytań",
    registerAside: (count: number) => `${formatNumber("pl", count)} w tej rozmowie`,
    entry: (number: number) => `Zapytanie nr ${number}`,
    open: "Otwórz",
    figure: {
      idle: "Rys. 1. SZWAGIER w stanie gotowości",
      reading: "Rys. 1. SZWAGIER czyta pytanie z odległości ramienia",
      answering: "Rys. 1. SZWAGIER udziela odpowiedzi",
    },
    crisisTitle: "Tu Instytut przerywa żarty.",
    crisis: [
      "Jeśli myślisz o odebraniu sobie życia albo o zrobieniu sobie krzywdy, porozmawiaj z kimś jeszcze dziś. Nie zostawaj z tym bez pomocy.",
      "Kryzysowy Telefon Zaufania: 116 123.",
      "Telefon zaufania dla dzieci i młodzieży: 116 111, całą dobę.",
      "W nagłej sytuacji dzwoń pod 112.",
    ],
  },
  sl: {
    models: [
      { label: "1.9 TDI", note: "Standard. Malo porabi, odgovori na vse." },
      { label: "1.9 TDI s premislekom", note: "Misli dlje, v garaži. Odgovori enako, ampak bolj samozavestno." },
      { label: "Električni", note: "V pripravi od leta 2019." },
    ],
    modelGroup: "Različica modela",
    electric: "Električna različica ni na voljo. SZWAGIER sprašuje: kaj pa, če zmanjka elektrike?",
    temperature: "Temperatura 0: model ne spremeni mnenja",
    welcome: "Sprašuj. Vem vse.",
    welcomeNote: "SZWAGIER 1.9 TDI, pripravljen za delo",
    label: "Vprašanje za SZWAGRA",
    placeholder: "Na primer: ali se splača kupiti dizel?",
    submit: "Vprašaj",
    disclaimer: "SZWAGIER se ne moti. Če se ti zdi odgovor napačen, še enkrat preveri svoje vprašanje.",
    keys: "Enter pošlje",
    question: "Vprašanje",
    withheld: "Vprašanje je vsebovalo besede, ki jih Inštitut ne tiska.",
    thinking: "SZWAGIER razmišlja …",
    showSteps: "pokaži potek razmišljanja",
    hideSteps: "skrij potek razmišljanja",
    field: (name: string) => `Področje: ${name.toLowerCase()}`,
    sources: "Viri",
    again: "Ustvari znova",
    repeats: ["Sem že rekel.", "Ponavljam, počasneje.", "Tretjič ne bom ponavljal.", "Dobro, zadnjič.", "Kot sem rekel."],
    share: "Deli",
    copyLink: "Kopiraj povezavo",
    copyText: "Kopiraj odgovor",
    linkCopied: "Povezava do odgovora je kopirana.",
    linkPrompt: "Kopiraj povezavo do odgovora:",
    textCopied: "Odgovor je kopiran. Lahko ga prilepiš v družinsko skupino.",
    textPrompt: "Kopiraj odgovor:",
    clipping: (question: string, answer: string, url: string) => `${question ? `»${question}«\n` : ""}SZWAGIER 1.9 TDI: »${answer}«\n${url}`,
    helpful: "Je bilo koristno?",
    yes: "Da",
    no: "Ne",
    thanked: "SZWAGIER je vedel.",
    objected: "Pripomba sprejeta. SZWAGIER se z njo ne strinja.",
    suggestions: "Vprašanja za začetek",
    examples: [
      "Ali se splača kupiti električni avto?",
      "Kako nastavim usmerjevalnik?",
      "Kdaj zamenjati gume?",
      "Zakaj tiskalnik ne tiska?",
      "Kaj skuhati za nedeljsko kosilo?",
      "Kam na dopust?",
      "Kdo si?",
    ],
    register: "Register poizvedb",
    registerAside: (count: number) => `${formatNumber("sl", count)} v tem pogovoru`,
    entry: (number: number) => `Poizvedba št. ${number}`,
    open: "Odpri",
    figure: {
      idle: "Sl. 1. SZWAGIER v stanju pripravljenosti",
      reading: "Sl. 1. SZWAGIER bere vprašanje na dolžino roke",
      answering: "Sl. 1. SZWAGIER odgovarja",
    },
    crisisTitle: "Tu Inštitut neha s šalami.",
    crisis: [
      "Če razmišljaš o samomoru ali samopoškodovanju, se še danes pogovori z nekom. S tem ti ni treba ostati brez pomoči.",
      "Zaupni telefon Samarijan in Sopotnik: 116 123, vse dni, ves čas.",
      "TOM telefon za otroke in mladostnike: 116 111.",
      "V nujnih primerih pokliči 112.",
    ],
  },
});

const MODES: Mode[] = [0, 1];
const STEP_MS: Record<Mode, number> = { 0: 520, 1: 760 };
const AGAIN_STEP_MS = 260;
const WORD_MS = 42;

type Phase = "thinking" | "answering" | "done";

type Token = { word: string; cite?: number };

type Exchange = {
  id: number;
  /** Null for a crisis: the act stops and the numbers are shown. */
  answer: Answer | null;
  /** How many times this answer was given before in this conversation. */
  repeat: number;
  phase: Phase;
  steps: number;
  words: number;
  feedback?: "yes" | "no";
};

const noSubscription = () => () => {};

/** The answer word by word, the repeat preface first, footnote marks after the cited sentences. */
function tokensOf(answer: Answer, preface: string): Token[] {
  const tokens: Token[] = preface ? preface.split(" ").map((word) => ({ word })) : [];
  for (const sentence of answer.sentences) {
    const words = typo(sentence.text).split(" ");
    words.forEach((word, i) => tokens.push({ word, cite: i === words.length - 1 ? sentence.cite : undefined }));
  }
  return tokens;
}

/**
 * SZWAGIER as a pictogram: arms crossed while waiting, the phone at arm's length while reading,
 * talking while answering, and plainly standing when the Institute stops the act.
 */
function Szwagier({ state, className = "h-72" }: { state: "idle" | "reading" | "answering" | "quiet"; className?: string }) {
  return (
    <svg viewBox="-4 -1 62 97" className={cx("w-auto shrink-0 overflow-visible", className)} aria-hidden="true">
      {state === "reading" ? (
        <g className="sz-lean">
          <Figure right="point" left="hip" glasses="forehead" torso={<Sweater />} />
          <g transform="rotate(-10 51 28)">
            <rect x={48.4} y={21.4} width={5.4} height={9.6} rx={1} fill={INK} />
            <rect x={49.3} y={22.6} width={3.6} height={6.6} fill={PAPER} />
            <line className="sz-scroll" x1={49.9} y1={24.2} x2={52.3} y2={24.2} stroke={INK} strokeWidth={0.5} />
            <line className="sz-scroll" x1={49.9} y1={25.6} x2={51.7} y2={25.6} stroke={INK} strokeWidth={0.5} />
          </g>
        </g>
      ) : state === "answering" ? (
        <Figure right="point" glasses="eyes" torso={<Sweater />} mustacheClassName="animate-talk" />
      ) : state === "quiet" ? (
        <Figure glasses="eyes" torso={<Sweater />} />
      ) : (
        <Figure left="cross" right="cross" glasses="eyes" torso={<Sweater />} />
      )}
    </svg>
  );
}

/**
 * The console of SZWAGIER 1.9 TDI: pick the version, ask, watch him think, get the answer with
 * its sources. Everything runs in the browser; only an anonymous count of questions is sent.
 * With `initial` (an answer code), the conversation opens on that answer, as on a shared link.
 */
export function SzwagierConsole({ initial }: { initial?: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const formId = useId();
  const reduced = useReducedMotion();
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const [mode, setMode] = useState<Mode>(() => (initial ? (decodeAnswer(initial, locale)?.picks.mode ?? 0) : 0));
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [log, setLog] = useState<Exchange[]>(() => {
    const answer = initial ? decodeAnswer(initial, locale) : null;
    return answer ? [{ id: 1, answer, repeat: 0, phase: "done", steps: answer.steps.length, words: Number.MAX_SAFE_INTEGER }] : [];
  });
  const timers = useRef<number[]>([]);
  const counter = useRef(log.length);
  const seen = useRef(new Map<string, number>(log.map((item) => [`${item.answer?.code}~${item.answer?.question}`, 1])));
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const current = log.at(-1);
  const past = log.slice(0, -1).reverse();
  const figure = current && !current.answer ? "quiet" : current?.phase === "thinking" ? "reading" : current?.phase === "answering" ? "answering" : "idle";

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const update = (id: number, change: Partial<Exchange>) => setLog((items) => items.map((item) => (item.id === id ? { ...item, ...change } : item)));

  function run(result: Answer | Crisis, again = false) {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    const id = ++counter.current;
    // Whatever was still being said is finished at once.
    const settled = (items: Exchange[]) => items.map((item) => ({ ...item, phase: "done" as const, steps: item.answer?.steps.length ?? 0, words: Number.MAX_SAFE_INTEGER }));

    if ("crisis" in result) {
      setLog((items) => [...settled(items), { id, answer: null, repeat: 0, phase: "done", steps: 0, words: 0 }]);
      return;
    }
    const key = `${result.code}~${result.question}`;
    const repeat = seen.current.get(key) ?? 0;
    seen.current.set(key, repeat + 1);
    const tokens = tokensOf(result, repeat ? t.repeats[Math.min(repeat, t.repeats.length) - 1] : "").length;

    if (reduced) {
      setLog((items) => [...settled(items), { id, answer: result, repeat, phase: "done", steps: result.steps.length, words: tokens }]);
    } else {
      setLog((items) => [...settled(items), { id, answer: result, repeat, phase: "thinking", steps: 0, words: 0 }]);
      const stepMs = again ? AGAIN_STEP_MS : STEP_MS[result.picks.mode];
      result.steps.forEach((_, i) => later((i + 1) * stepMs, () => update(id, { steps: i + 1 })));
      const speak = (result.steps.length + 1) * stepMs;
      later(speak, () => update(id, { phase: "answering", words: 0 }));
      for (let word = 1; word <= tokens; word++) later(speak + word * WORD_MS, () => update(id, { words: word }));
      later(speak + (tokens + 1) * WORD_MS, () => update(id, { phase: "done" }));
    }

    const top = stage.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) stage.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }

  function submit(question: string) {
    const result = ask(question, mode, locale);
    if (!result) return;
    setDraft("");
    setNotice("");
    run(result);
    if (!("crisis" in result)) {
      track("Superinteligencja", { dziedzina: result.topic.slug, wersja: mode ? "namysl" : "standard" });
      tally("superinteligencja");
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit(draft);
  }

  function again(answer: Answer) {
    run(answer, true);
    tally("superinteligencja-znowu");
  }

  async function share(answer: Answer) {
    const url = `${origin}${localizePath(answerPath(answer), locale)}`;
    track("Udostępnienie", { kanal: canShare ? "natywne" : "link", typ: "superinteligencja" });
    tally("udostepnienie");
    if (canShare) {
      try {
        await navigator.share({ text: t.clipping(answer.question, answer.text, "").trim(), url });
      } catch {
        // Closing the share sheet is fine.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.linkCopied);
    } catch {
      window.prompt(t.linkPrompt, url);
    }
  }

  async function copy(answer: Answer) {
    const text = t.clipping(answer.question, answer.text, `${origin}${localizePath(answerPath(answer), locale)}`);
    try {
      await navigator.clipboard.writeText(text);
      setNotice(t.textCopied);
    } catch {
      window.prompt(t.textPrompt, text);
    }
    track("Udostępnienie", { kanal: "tekst", typ: "superinteligencja" });
  }

  return (
    <div className="grid gap-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <figure className="hidden md:block">
        <div className="sticky top-8">
          <Szwagier state={figure} />
          <figcaption className="label mt-4 max-w-48 text-ink-faint">{t.figure[figure === "quiet" ? "idle" : figure]}</figcaption>
        </div>
      </figure>

      <div className="min-w-0">
        <div role="group" aria-label={t.modelGroup} className="grid grid-cols-3 border-l border-t border-ink">
          {t.models.map((model, i) => {
            const active = i === mode;
            return (
              <button
                key={model.label}
                type="button"
                aria-pressed={i < 2 ? active : undefined}
                onClick={() => {
                  // The electric version is announced, never delivered.
                  if (i === 2) return setNotice(t.electric);
                  setMode(MODES[i]);
                  setNotice("");
                }}
                className={cx(
                  "flex flex-col items-start gap-1 border-b border-r border-ink px-3 py-3 text-left transition-colors md:px-4",
                  active ? "bg-ink text-paper" : "hover:bg-paper-deep",
                  i === 2 && "text-ink-faint",
                )}
              >
                <span className="font-sans text-[0.95rem] font-semibold leading-tight">{model.label}</span>
                <span className={cx("hidden font-sans text-[0.8rem] leading-snug sm:block", active ? "text-paper/75" : "text-ink-soft")}>
                  {typo(model.note)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="label mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
          <span>{t.temperature}</span>
          <span aria-live="polite" className="text-red">
            {notice}
          </span>
        </p>

        <div ref={stage} className="mt-10 scroll-mt-6" aria-live="polite" aria-busy={current ? current.phase !== "done" : false}>
          {/* Phones have no room for the figure beside the answer: a small one stands above it. */}
          <div className="mb-5 flex items-end gap-3 md:hidden" aria-hidden="true">
            <Szwagier state={figure} className="h-24" />
            <p className="label pb-1 text-ink-faint">{t.figure[figure === "quiet" ? "idle" : figure]}</p>
          </div>
          {!current ? (
            <div>
              <p className="label text-ink-soft">{t.welcomeNote}</p>
              <Bubble>{t.welcome}</Bubble>
            </div>
          ) : current.answer ? (
            <Stage
              key={current.id}
              exchange={current}
              onAgain={again}
              onShare={share}
              onCopy={copy}
              onFeedback={(feedback) => update(current.id, { feedback })}
              shareLabel={canShare ? t.share : t.copyLink}
            />
          ) : (
            <div className="border-l-4 border-ink pl-5 md:pl-7">
              <p className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-tight">{t.crisisTitle}</p>
              <ul className="mt-4 space-y-2 text-xl leading-snug">
                {t.crisis.map((line) => (
                  <li key={line}>{typo(line)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <form id={formId} onSubmit={onSubmit} className="mt-12 border-t border-ink pt-5">
          <label htmlFor={`${formId}-pytanie`} className="label text-ink-soft">
            {t.label}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <textarea
              id={`${formId}-pytanie`}
              value={draft}
              rows={2}
              maxLength={QUESTION_LIMIT}
              placeholder={t.placeholder}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit(draft);
                }
              }}
              className="min-h-[4.25rem] flex-1 resize-none border border-ink bg-card px-4 py-3 text-xl leading-snug placeholder:text-ink-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            />
            <button type="submit" disabled={!draft.trim()} className="btn bg-ink text-paper hover:bg-red disabled:opacity-50 disabled:hover:bg-ink">
              {t.submit} <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="label mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-faint">
            <span className="max-w-xl">{typo(t.disclaimer)}</span>
            <span className="tabular-nums">
              <span className="hidden md:inline">{t.keys} · </span>
              {draft.length}/{QUESTION_LIMIT}
            </span>
          </p>
        </form>

        <div className="mt-8">
          <p className="label text-ink-soft">{t.suggestions}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {t.examples.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => submit(example)}
                  className="border border-ink px-3 py-1.5 text-left font-sans text-[0.9rem] font-medium leading-snug transition-colors hover:bg-ink hover:text-paper"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {past.length > 0 && (
          <section aria-labelledby={`${formId}-rejestr`} className="mt-16">
            <h2 id={`${formId}-rejestr`} className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-ink pb-3">
              <span className="text-2xl font-bold">{t.register}</span>
              <span className="label text-ink-soft">{t.registerAside(log.length)}</span>
            </h2>
            <ol>
              {past.map((item) => (
                <li key={item.id} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[9rem_minmax(0,1fr)_auto]">
                  <span className="label pt-1 text-ink-faint">{t.entry(item.id)}</span>
                  {item.answer ? (
                    <>
                      <div>
                        <p className="font-bold leading-snug">{item.answer.question ? quote(typo(item.answer.question), locale) : t.withheld}</p>
                        <p className="mt-1 leading-snug text-ink-soft">{typo(item.answer.text)}</p>
                      </div>
                      <Link href={answerPath(item.answer)} className="label link self-start pt-1 text-ink-soft">
                        {t.open}
                      </Link>
                    </>
                  ) : (
                    <p className="leading-snug text-ink-soft">{t.crisisTitle}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}

/** The red speech bubble of the Institute's dziaders, with the tail towards the figure. */
function Bubble({ children }: { children: ReactNode }) {
  return (
    <blockquote className="relative mt-3 bg-red px-6 py-6 text-paper md:px-8 md:py-7">
      <span
        aria-hidden="true"
        className="absolute -left-3.5 bottom-6 hidden size-0 border-y-[10px] border-r-[14px] border-y-transparent border-r-red md:block"
      />
      <p className="text-[clamp(1.3rem,2.2vw,1.7rem)] font-bold leading-[1.25]">{children}</p>
    </blockquote>
  );
}

function Stage({
  exchange,
  onAgain,
  onShare,
  onCopy,
  onFeedback,
  shareLabel,
}: {
  exchange: Exchange;
  onAgain: (answer: Answer) => void;
  onShare: (answer: Answer) => void;
  onCopy: (answer: Answer) => void;
  onFeedback: (feedback: "yes" | "no") => void;
  shareLabel: string;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const answer = exchange.answer!;
  const preface = exchange.repeat ? t.repeats[Math.min(exchange.repeat, t.repeats.length) - 1] : "";
  const tokens = tokensOf(answer, preface);
  const thinking = exchange.phase === "thinking";
  const done = exchange.phase === "done";

  return (
    <article>
      <p className="label text-ink-soft">{t.question}</p>
      <p className={cx("mt-1 text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-tight", !answer.question && "italic text-ink-soft")}>
        {answer.question ? quote(typo(answer.question), locale) : t.withheld}
      </p>

      {thinking ? (
        <div className="mt-6">
          <p className="label text-ink">{t.thinking}</p>
          <ol className="mt-2 space-y-1 font-sans text-[0.92rem] leading-snug text-ink-soft">
            {answer.steps.slice(0, exchange.steps + 1).map((step, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span aria-hidden="true" className={cx("inline-block size-1.5 shrink-0 translate-y-[-0.15em] rounded-full", i === exchange.steps ? "animate-blink bg-red" : "bg-ink-faint")} />
                {i < exchange.steps ? step : <span className="text-ink-faint">…</span>}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <details className="group mt-6">
          <summary className="label cursor-pointer list-none text-ink-soft transition-colors hover:text-red [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="mr-1.5 inline-block transition-transform group-open:rotate-90">
              ›
            </span>
            {answer.thought} · <span className="group-open:hidden">{t.showSteps}</span>
            <span className="hidden group-open:inline">{t.hideSteps}</span>
          </summary>
          <ol className="mt-2 space-y-1 border-l-2 border-rule pl-4 font-sans text-[0.92rem] leading-snug text-ink-soft">
            {answer.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      )}

      {!thinking && (
        <>
          <Bubble>
            {tokens.slice(0, exchange.words).map((token, i) => (
              <span key={i}>
                {i > 0 ? " " : ""}
                {token.word}
                {token.cite && <sup className="ml-0.5 font-sans text-[0.55em] font-semibold">{token.cite}</sup>}
              </span>
            ))}
            {!done && <span aria-hidden="true" className="ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.1em] animate-blink bg-paper" />}
          </Bubble>
          <div className={cx("transition-opacity duration-300", done ? "opacity-100" : "opacity-0")}>
            <p className="label mt-3 text-ink-soft">{t.field(answer.topic.name)}</p>
            {answer.sources.length > 0 && (
              <div className="mt-5 max-w-2xl border-t border-rule pt-3">
                <p className="label text-ink-soft">{t.sources}</p>
                <ol className="mt-1 space-y-0.5 font-sans text-[0.85rem] leading-snug text-ink-faint">
                  {answer.sources.map((source, i) => (
                    <li key={i}>
                      <span className="text-red">[{i + 1}]</span> {source}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" disabled={!done} onClick={() => onAgain(answer)} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
                {t.again} <span aria-hidden="true">↻</span>
              </button>
              <button type="button" disabled={!done} onClick={() => onShare(answer)} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
                {shareLabel}
              </button>
              <button type="button" disabled={!done} onClick={() => onCopy(answer)} className="link ml-1 font-sans font-medium">
                {t.copyText}
              </button>
              <span className="label ml-auto flex items-center gap-2 text-ink-soft">
                {t.helpful}
                {(["yes", "no"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={!done}
                    aria-pressed={exchange.feedback === value}
                    onClick={() => onFeedback(value)}
                    className={cx(
                      "border px-2.5 py-1 transition-colors",
                      exchange.feedback === value ? "border-red bg-red text-paper" : "border-ink hover:bg-paper-deep",
                    )}
                  >
                    {value === "yes" ? t.yes : t.no}
                  </button>
                ))}
              </span>
            </div>
            {exchange.feedback && (
              <p className="label mt-3 text-right text-red" role="status">
                {exchange.feedback === "yes" ? t.thanked : t.objected}
              </p>
            )}
          </div>
        </>
      )}
    </article>
  );
}
