"use client";

/* eslint-disable @next/next/no-img-element -- the casts are encoded WebPs in public/wosk. */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";
import { warsawTime } from "@/lib/calendar";
import { cx } from "@/lib/typo";
import { encodeReading, pour, yearFor, type WaxTable } from "@/lib/wax-code";
import { useLater, useReducedMotion } from "./hooks";
import styles from "./wax-reading.module.css";

const COPY = defineCopy({
  pl: {
    stage: "Stanowisko do lania wosku",
    hold: "Przytrzymaj i lej",
    again: "Przytrzymaj i lej jeszcze raz",
    pouring: "Leje się…",
    stop: "Wystarczy",
    howTo: "Przytrzymaj przycisk albo spację. Krótkie dotknięcie leje samo, do pełna.",
    idle: "Wosk roztopiony. Klucz nad miską, woda zimna.",
    flowing: (share: number) => `Wosk płynie przez ucho klucza: ${share}% rondelka.`,
    little: "Za mało wosku. Pracownia nie odczytuje pojedynczych kropli.",
    setting: "Wosk tężeje w zimnej wodzie.",
    lifting: "Odlew wyjęty. Pracownia przykłada go do świecy.",
    shadow: (shape: string) => `Cień na ścianie: ${shape}.`,
    amount: "Wosk",
    minimum: "minimum",
    cast: (shape: string) => `Odlew z wosku. Cień przypomina: ${shape}.`,
  },
  sl: {
    stage: "Mesto za vlivanje voska",
    hold: "Pridrži in vlivaj",
    again: "Pridrži in vlivaj znova",
    pouring: "Teče …",
    stop: "Dovolj",
    howTo: "Pridrži gumb ali preslednico. Kratek dotik vliva sam, do konca.",
    idle: "Vosek je stopljen. Ključ nad skledo, voda mrzla.",
    flowing: (share: number) => `Vosek teče skozi ušesce ključa: ${share} % kozice.`,
    little: "Premalo voska. Laboratorij posameznih kapljic ne bere.",
    setting: "Vosek se strjuje v mrzli vodi.",
    lifting: "Odlitek je iz vode. Laboratorij ga drži pred svečo.",
    shadow: (shape: string) => `Senca na steni: ${shape}.`,
    amount: "Vosek",
    minimum: "najmanj",
    cast: (shape: string) => `Voščeni odlitek. Senca spominja na: ${shape}.`,
  },
});

type Phase = "idle" | "pouring" | "setting" | "lifting" | "reading";

/** Seconds of holding for a full pan, and the share below which the Pracownia does not read. */
const FULL = 2.6;
const MINIMUM = 0.35;
/** A press shorter than this is a tap: the pan pours by itself until full. */
const TAP_MS = 260;

const srcSet = (slug: string) => `/wosk/${slug}-360.webp 360w, /wosk/${slug}-600.webp 600w, /wosk/${slug}.webp 900w`;

export function WaxReading({
  table,
  result,
  children,
}: {
  table: WaxTable & { shapes: string[] };
  /** On a result page: the reading on the wall. */
  result?: { code: string; cast: number };
  /** The protocol, shown once the cast is on the wall. */
  children?: ReactNode;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const router = useRouter();
  const reduced = useReducedMotion();
  const later = useLater();

  const [phase, setPhase] = useState<Phase>(result ? "reading" : "idle");
  const [cast, setCast] = useState(result?.cast ?? -1);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);

  const pressedAt = useRef(0);
  const held = useRef(false);
  const amountRef = useRef(0);
  const frame = useRef(0);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const slug = cast >= 0 ? table.slugs[cast] : null;
  const shape = cast >= 0 ? table.shapes[cast] : "";

  function flow() {
    let last = performance.now();
    const step = (now: number) => {
      const next = Math.min(1, amountRef.current + (now - last) / 1000 / FULL);
      last = now;
      amountRef.current = next;
      setAmount(next);
      if (next >= 1) return finish();
      frame.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(step);
  }

  function start() {
    if (phase === "setting" || phase === "lifting") return;
    if (phase === "reading" || phase === "idle") {
      amountRef.current = 0;
      setAmount(0);
      setCast(-1);
    }
    setNote(null);
    setPhase("pouring");
    flow();
  }

  /** The pan is put down: read the cast if there was enough wax. */
  function finish() {
    cancelAnimationFrame(frame.current);
    held.current = false;
    setAuto(false);
    if (amountRef.current < MINIMUM) {
      setNote(t.little);
      return;
    }
    const { year, month } = warsawTime(new Date());
    const picks = pour(table, Math.random, yearFor(year, month));
    const code = encodeReading(table.slugs, picks);
    const href = localizePath(`/lanie-wosku/${code}`, locale);
    const image = new Image();
    image.srcset = srcSet(table.slugs[picks.cast]);
    router.prefetch(href);
    setCast(picks.cast);
    setPhase("setting");
    track("Lanie wosku", { odlew: table.slugs[picks.cast] });
    const pace = reduced ? 0.05 : 1;
    later(1900 * pace, () => setPhase("lifting"));
    later(2700 * pace, () => {
      setPhase("reading");
      router.push(href, { scroll: false });
    });
    if (window.matchMedia("(max-width: 767px)").matches) {
      stage.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }
  }

  function press() {
    if (auto) return finish();
    pressedAt.current = performance.now();
    held.current = true;
    start();
  }

  function release() {
    if (!held.current) return;
    held.current = false;
    if (performance.now() - pressedAt.current < TAP_MS && amountRef.current < MINIMUM) {
      // A tap, not a hold: the pan pours by itself until full or until the next press.
      setAuto(true);
      return;
    }
    finish();
  }

  const busy = phase === "setting" || phase === "lifting";
  const pouring = phase === "pouring" && (held.current || auto);
  const status =
    note ??
    (phase === "pouring" ? t.flowing(Math.round(amount * 100)) : phase === "setting" ? t.setting : phase === "lifting" ? t.lifting : phase === "reading" ? t.shadow(shape) : t.idle);
  const showProtocol = phase === "reading" && result && cast === result.cast;

  return (
    <div>
      <figure className={styles.figure}>
        <div ref={stage} className={styles.wall} data-phase={phase} data-pouring={pouring || undefined} aria-label={t.stage} role="img">
          {slug && (
            <img
              key={`shadow-${slug}`}
              src={`/wosk/${slug}-600.webp`}
              srcSet={srcSet(slug)}
              sizes="(max-width: 767px) 70vw, 32rem"
              width={600}
              height={600}
              alt={t.shadow(shape)}
              className={styles.shadow}
              fetchPriority={result ? "high" : undefined}
              decoding="async"
            />
          )}
          <div className={styles.scene}>
            <Apparatus amount={amount} />
            {slug && (
              <img
                key={`cast-${slug}`}
                src={`/wosk/${slug}-360.webp`}
                srcSet={srcSet(slug)}
                sizes="(max-width: 767px) 30vw, 14rem"
                width={360}
                height={360}
                alt={t.cast(shape)}
                className={styles.cast}
                decoding="async"
              />
            )}
          </div>
        </div>
        <figcaption className={cx("label mt-3 min-h-[2.7em] text-ink-soft", note && "text-red")} aria-live="polite">
          {status}
        </figcaption>
      </figure>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          disabled={busy}
          className={cx("btn bg-ink text-paper hover:bg-red", styles.pour)}
          aria-describedby="wosk-instrukcja"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Capture only keeps the release on the button when a finger slides off it.
            }
            press();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(event) => {
            if (event.key !== " " && event.key !== "Enter") return;
            event.preventDefault();
            if (!event.repeat && !held.current) press();
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") release();
          }}
          onClick={(event) => {
            // Assistive technology clicks without pointer or key events: pour by itself.
            if (event.detail === 0 && !held.current && phase !== "pouring") {
              start();
              setAuto(true);
            }
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          {phase === "pouring" ? (auto ? t.stop : t.pouring) : phase === "reading" ? t.again : t.hold}
        </button>
        <div className="flex min-w-48 flex-1 items-center gap-3" aria-hidden="true">
          <span className="label text-ink-soft">{t.amount}</span>
          <span className={styles.gauge}>
            <i style={{ width: `${amount * 100}%` }} />
            <b style={{ left: `${MINIMUM * 100}%` }} title={t.minimum} />
          </span>
        </div>
      </div>
      <p id="wosk-instrukcja" className="label mt-3 text-ink-faint">
        {t.howTo}
      </p>

      {children && <div className={cx(styles.protocol, !showProtocol && styles.hidden)}>{children}</div>}
    </div>
  );
}

/**
 * The pan, the key and the enamel bowl, drawn like the Atlas pictograms. The stream passes through
 * the bow of the key; ripples and a floating drop show while the wax is running.
 */
function Apparatus({ amount }: { amount: number }) {
  return (
    <svg viewBox="0 0 240 200" className={styles.apparatus} aria-hidden="true">
      {/* Table */}
      <path d="M0 192H240" stroke="var(--color-ink)" strokeWidth={2} />
      {/* Candle */}
      <g>
        <rect x={198} y={132} width={15} height={60} fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth={2} />
        <path d="M193 192H218" stroke="var(--color-ink)" strokeWidth={4} />
        <path d="M205.5 132V125" stroke="var(--color-ink)" strokeWidth={1.6} />
        <path className={styles.flame} d="M205.5 106C210 113 212 118 205.5 126C199 118 201 113 205.5 106Z" fill="var(--color-ochre)" />
        <path className={styles.flame} d="M205.5 114C207.5 118 208 121 205.5 125C203 121 203.5 118 205.5 114Z" fill="var(--color-red)" />
      </g>
      {/* Stream through the bow of the key into the water */}
      <path className={styles.stream} d="M102 47C107 56 110 66 110 82V155" fill="none" stroke="var(--color-ochre)" strokeWidth={3.4} strokeLinecap="round" />
      {/* Pan, tilted further while pouring */}
      <g className={styles.pan}>
        <path d="M46 24H100L104 46H50Z" fill="var(--color-ink)" />
        {/* The molten wax at the rim: the pan empties as it pours. */}
        <path d={`M${48 + amount * 46} 24H99`} stroke="var(--color-ochre)" strokeWidth={3.2} opacity={amount < 1 ? 1 : 0} />
        <path d="M44 22H102" stroke="var(--color-ink)" strokeWidth={2.4} strokeLinecap="round" />
        <path d="M46 29L12 21" stroke="var(--color-ink)" strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* Key: the bow is the hole the wax goes through */}
      <g>
        <circle cx={110} cy={88} r={10} fill="none" stroke="var(--color-ink)" strokeWidth={4.5} />
        <path d="M120 88H196" stroke="var(--color-ink)" strokeWidth={5} />
        <path d="M184 88V102H190V96H196V88" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={2} strokeLinejoin="round" />
        <path d="M126 82V94" stroke="var(--color-ink)" strokeWidth={3} />
      </g>
      {/* Enamel bowl with a red rim and cold water */}
      <path d="M46 150C50 178 70 190 110 190C150 190 170 178 174 150Z" fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth={2.4} />
      <ellipse cx={110} cy={150} rx={64} ry={9} fill="var(--color-blue)" stroke="var(--color-ink)" strokeWidth={2.4} />
      <ellipse cx={110} cy={150} rx={64} ry={9} fill="none" stroke="var(--color-red)" strokeWidth={2} transform="translate(0 -1.6)" />
      <g className={styles.ripples}>
        <ellipse cx={110} cy={152} rx={10} ry={2.4} fill="none" stroke="var(--color-paper)" strokeWidth={1.2} />
        <ellipse cx={110} cy={152} rx={10} ry={2.4} fill="none" stroke="var(--color-paper)" strokeWidth={1.2} />
      </g>
      <ellipse className={styles.drop} cx={110} cy={152} rx={3 + amount * 15} ry={1.6 + amount * 3} fill="var(--color-ochre)" stroke="var(--color-ink)" strokeWidth={1} opacity={amount ? 1 : 0} />
    </svg>
  );
}
