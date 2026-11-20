"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getSpecies, type SpeciesKey } from "@/content/species";
import { useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { track } from "@/lib/analytics";
import { cleanName } from "@/lib/names";
import {
  assess,
  encodePlan,
  MAX_GUESTS,
  MIN_GUESTS,
  NEW_GUEST_SPECIES,
  optimalOrder,
  pairRisk,
  pairSubject,
  protocolNumber,
  seatingLayout,
  shortName,
  switchMode,
  type Assessment,
  type Pair,
  type Plan,
  type Seat,
  type TableMode,
  type Verdict,
} from "@/lib/seating";
import { percent, seatName, VERDICT_COPY } from "@/lib/seating-text";
import { cx, formatNumber, pluralSl, typo } from "@/lib/typo";
import { Stamp } from "./brand";
import { SpeciesPlate } from "./pictograms";
import { useReducedMotion } from "./hooks";
import { EmptyChair, SEAT_HEIGHT, SEAT_WIDTH, setting, TableScene } from "./seating-scene";

const COPY = defineCopy({
  pl: {
    occasion: "Okazja",
    modes: { wigilia: "Wigilia", wesele: "Wesele" } as Record<TableMode, string>,
    guests: "Liczba gości",
    fewer: "Usuń gościa",
    more: "Dodaj gościa",
    scene: (mode: TableMode, guests: number) =>
      mode === "wigilia"
        ? `Stół wigilijny widziany z góry: ${guests} gości i puste nakrycie dla wędrowca`
        : `${guests > 10 ? "Dwa okrągłe stoły" : "Okrągły stół"} weselny widziany z góry: ${guests} gości`,
    hint: "Przeciągnij gościa na inne miejsce, żeby zamienić miejscami. Stuknij, żeby zmienić gatunek albo podpis.",
    place: (n: number) => `Miejsce ${n}`,
    seatLabel: (n: number, label: string, species: string) => `Miejsce ${n}: ${label ? `${label}, ` : ""}${species}`,
    wanderer: "wędrowiec",
    wandererLabel: (n: number) => `Miejsce ${n}: puste nakrycie dla zbłąkanego wędrowca`,
    wandererNote: "Puste nakrycie dla zbłąkanego wędrowca. Zgodnie z tradycją nikt na nim nie siada, ale można je przesunąć.",
    label: "Podpis (nieobowiązkowy)",
    labelPlaceholder: "np. wujek Rysiek",
    labelNote: "Podpis zostaje w linku do protokołu. Instytut go nie zapisuje ani nie liczy.",
    species: "Gatunek",
    groups: { national: "Ogólnopolskie", regional: "Regionalne", occasional: "Okazjonalne" },
    move: "Przesadź na inne miejsce",
    moving: "Wskaż miejsce docelowe. Esc anuluje.",
    cancel: "Anuluj",
    remove: "Usuń z listy gości",
    close: "Gotowe",
    moved: (who: string, n: number) => `${who} siedzi teraz na miejscu ${n}.`,
    optimise: "Rozsadzenie Instytutu",
    undo: "Przywróć mój plan",
    optimised: (moved: number, before: string, after: string) =>
      moved
        ? `Instytut przesadził ${moved} ${moved === 1 ? "osobę" : moved < 5 ? "osoby" : "osób"}. Przewidywane spory: ${before} → ${after}.`
        : "Instytut nie widzi lepszego rozsadzenia. Plan pozostaje bez zmian.",
    protocol: "Protokół rozsadzenia",
    number: (n: string) => `nr ${n}`,
    index: "Wskaźnik zapalności stołu",
    disputes: "Przewidywane spory do północy",
    flashpoints: "Punkty zapalne",
    none: "Instytut nie stwierdza punktów zapalnych.",
    beside: "obok siebie",
    facing: "naprzeciwko",
    risk: "ryzyko sporu",
    about: "przedmiot sporu",
    unknown: "sprawy ogólne",
    calmest: (a: string, b: string, risk: number) => `Najspokojniejsze sąsiedztwo: ${a} i ${b} (${risk}%).`,
    buffer: (a: string, b: string, risk: number) =>
      `Puste nakrycie pełni funkcję strefy buforowej między: ${a} i ${b}. W razie przybycia wędrowca ryzyko sporu wzrośnie do ${risk}%.`,
    issue: "Wydaj protokół",
    issued: "Protokół wydany",
    reissue: "Wydaj nowy protokół",
    changed: "Plan różni się od wydanego protokołu.",
  },
  sl: {
    occasion: "Priložnost",
    modes: { wigilia: "Sveti večer", wesele: "Svatba" } as Record<TableMode, string>,
    guests: "Število gostov",
    fewer: "Odstrani gosta",
    more: "Dodaj gosta",
    scene: (mode: TableMode, guests: number) =>
      mode === "wigilia"
        ? `Miza za sveti večer od zgoraj: ${guests} gostov in prazen pogrinjek za popotnika`
        : `${guests > 10 ? "Dve okrogli svatbeni mizi" : "Okrogla svatbena miza"} od zgoraj: ${guests} gostov`,
    hint: "Povleci gosta na drugo mesto, da zamenjata mesti. Tapni, da spremeniš vrsto ali oznako.",
    place: (n: number) => `Mesto ${n}`,
    seatLabel: (n: number, label: string, species: string) => `Mesto ${n}: ${label ? `${label}, ` : ""}${species}`,
    wanderer: "popotnik",
    wandererLabel: (n: number) => `Mesto ${n}: prazen pogrinjek za zablodelega popotnika`,
    wandererNote: "Prazen pogrinjek za zablodelega popotnika. Po poljskem izročilu nanj nihče ne sede, lahko pa ga premakneš.",
    label: "Oznaka (neobvezno)",
    labelPlaceholder: "npr. stric Franci",
    labelNote: "Oznaka ostane v povezavi do zapisnika. Inštitut je ne shranjuje in ne šteje.",
    species: "Vrsta",
    groups: { national: "Vsepoljske", regional: "Regionalne", occasional: "Priložnostne" },
    move: "Presedi na drugo mesto",
    moving: "Pokaži ciljno mesto. Esc prekliče.",
    cancel: "Prekliči",
    remove: "Odstrani s seznama gostov",
    close: "Končano",
    moved: (who: string, n: number) => `${who} zdaj sedi na mestu ${n}.`,
    optimise: "Sedežni red Inštituta",
    undo: "Vrni moj načrt",
    optimised: (moved: number, before: string, after: string) =>
      moved
        ? `Inštitut je presedel ${moved} ${pluralSl(moved, "osebo", "osebi", "osebe", "oseb")}. Predvideni spori: ${before} → ${after}.`
        : "Inštitut ne vidi boljšega sedežnega reda. Načrt ostaja nespremenjen.",
    protocol: "Zapisnik o sedežnem redu",
    number: (n: string) => `št. ${n}`,
    index: "Indeks vnetljivosti mize",
    disputes: "Predvideni spori do polnoči",
    flashpoints: "Žarišča",
    none: "Inštitut ne ugotavlja žarišč.",
    beside: "drug ob drugem",
    facing: "nasproti",
    risk: "tveganje spora",
    about: "predmet spora",
    unknown: "splošne zadeve",
    calmest: (a: string, b: string, risk: number) => `Najmirnejše sosedstvo: ${a} in ${b} (${risk} %).`,
    buffer: (a: string, b: string, risk: number) =>
      `Prazen pogrinjek deluje kot varovalni pas med: ${a} in ${b}. Če popotnik pride, se tveganje spora zviša na ${risk} %.`,
    issue: "Izdaj zapisnik",
    issued: "Zapisnik izdan",
    reissue: "Izdaj nov zapisnik",
    changed: "Načrt se razlikuje od izdanega zapisnika.",
  },
});

type Guest = Seat & { id: number };
type Drag = { place: number; id: number; x: number; y: number; dx: number; dy: number; moved: boolean; target: number | null };

const decimal = (locale: Locale, value: number) => formatNumber(locale, Math.round(value * 10) / 10);

/** Flashpoints, the calmest pair and the empty place's buffer duty, as rows for the protocol. */
export function ProtocolFindings({ plan, assessment, limit = 5 }: { plan: Plan; assessment: Assessment; limit?: number }) {
  const locale = useLocale();
  const t = COPY[locale];
  const name = (i: number) => seatName(plan.seats[i], locale);
  const buffer = bufferDuty(plan);
  return (
    <div>
      <h3 className="label text-ink-soft">{t.flashpoints}</h3>
      {assessment.flashpoints.length ? (
        <ol className="mt-2">
          {assessment.flashpoints.slice(0, limit).map((pair) => (
            <FlashpointRow key={`${pair.a}-${pair.b}`} pair={pair} plan={plan} />
          ))}
        </ol>
      ) : (
        <p className="mt-2 border-t border-rule pt-3 text-lg">{t.none}</p>
      )}
      {buffer && <p className="mt-4 text-ink-soft">{typo(t.buffer(name(buffer.a), name(buffer.b), buffer.risk))}</p>}
      {assessment.calmest && (
        <p className="mt-3 text-ink-soft">{typo(t.calmest(name(assessment.calmest.a), name(assessment.calmest.b), assessment.calmest.risk))}</p>
      )}
    </div>
  );
}

function FlashpointRow({ pair, plan }: { pair: Pair; plan: Plan }) {
  const locale = useLocale();
  const t = COPY[locale];
  const a = plan.seats[pair.a];
  const b = plan.seats[pair.b];
  const subject = pairSubject(a.species, b.species, locale);
  const who = (seat: Seat) => (
    <span>
      <span className="font-bold">{seatName(seat, locale)}</span>
      {seat.label && seat.species && <span className="text-ink-soft"> ({shortName(seat.species, locale)})</span>}
    </span>
  );
  return (
    <li className="flex items-start justify-between gap-4 border-t border-rule py-3">
      <div className="min-w-0">
        <p className="leading-snug">
          {who(a)} <span className="label text-ink-faint">· {pair.kind === "beside" ? t.beside : t.facing} ·</span> {who(b)}
        </p>
        <p className="label mt-1 text-ink-soft">
          {t.about}: {subject ?? t.unknown}
        </p>
      </div>
      <p className="shrink-0 text-right">
        <span className="block font-sans text-2xl font-bold leading-none text-red">{percent(locale, pair.risk)}</span>
        <span className="label text-ink-faint">{t.risk}</span>
      </p>
    </li>
  );
}

/** The two guests the empty Wigilia place keeps apart, when they would be a flashpoint side by side. */
function bufferDuty(plan: Plan) {
  const empty = plan.seats.findIndex((seat) => !seat.species);
  if (empty < 0) return null;
  const layout = seatingLayout(plan.mode, plan.seats.length);
  const sides = layout.edges
    .filter((edge) => edge.kind === "beside" && (edge.a === empty || edge.b === empty))
    .map((edge) => (edge.a === empty ? edge.b : edge.a));
  if (sides.length !== 2) return null;
  const risk = pairRisk(plan.seats[sides[0]].species, plan.seats[sides[1]].species, plan.mode).risk;
  return risk >= 50 ? { a: sides[0], b: sides[1], risk } : null;
}

export function VerdictStamp({ verdict, className }: { verdict: Verdict; className?: string }) {
  const locale = useLocale();
  return (
    <Stamp className={cx("-rotate-3 text-[0.95rem]", className)}>{VERDICT_COPY[locale][verdict].stamp}</Stamp>
  );
}

const withIds = (seats: Seat[]): Guest[] => seats.map((seat, i) => ({ ...seat, id: i }));
const stripIds = (seats: Guest[]): Seat[] => seats.map(({ species, label }) => ({ species, label }));

/**
 * The seating planner: the table from above with a guest at every place. Drag a guest onto
 * another place to swap them (mouse or touch); tap or press Enter to edit a place, where the same
 * move is available as "pick a target" for keyboards and screen readers.
 */
export function SeatingPlanner({ initial, issued }: { initial: Plan; issued?: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const verdicts = VERDICT_COPY[locale];
  const species = getSpecies(locale);

  const [mode, setMode] = useState<TableMode>(initial.mode);
  const [seats, setSeats] = useState<Guest[]>(() => withIds(initial.seats));
  const nextId = useRef(initial.seats.length);
  const [selected, setSelected] = useState<number | null>(null);
  const [moving, setMoving] = useState<number | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [settled, setSettled] = useState<number | null>(null);
  const [before, setBefore] = useState<Guest[] | null>(null);
  const [notice, setNotice] = useState("");
  const [announce, setAnnounce] = useState("");
  const reduced = useReducedMotion();
  const board = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  // A drag ends with a click on the same button; clicks right after a drop are ignored.
  const droppedAt = useRef(-Infinity);
  // Only a tap or Enter opens the editor into view; a swap that moves the selection does not scroll.
  const reveal = useRef(false);

  const plan: Plan = useMemo(() => ({ mode, seats: stripIds(seats) }), [mode, seats]);
  const layout = useMemo(() => seatingLayout(mode, seats.length), [mode, seats.length]);
  const assessment = useMemo(() => assess(plan), [plan]);
  const code = useMemo(() => encodePlan(plan), [plan]);
  const guests = seats.filter((seat) => seat.species).length;
  const verdict = verdicts[assessment.verdict];

  // The guest who was just dropped lands where the finger is; everyone else glides.
  useEffect(() => {
    if (settled === null) return;
    const frame = window.requestAnimationFrame(() => setSettled(null));
    return () => window.cancelAnimationFrame(frame);
  }, [settled]);

  useEffect(() => {
    if (moving === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoving(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moving]);

  const edit = (next: Guest[], keepNotice = false) => {
    setSeats(next);
    if (!keepNotice) {
      setBefore(null);
      setNotice("");
    }
  };

  const swap = (from: number, to: number) => {
    if (from === to) return;
    const next = [...seats];
    [next[from], next[to]] = [next[to], next[from]];
    edit(next);
    setSelected((current) => (current === from ? to : current === to ? from : current));
    setAnnounce(t.moved(seatName(next[to], locale), to + 1));
  };

  const changeMode = (next: TableMode) => {
    if (next === mode) return;
    const switched = switchMode({ mode, seats: stripIds(seats) }, next);
    setMode(next);
    edit(withIds(switched.seats).map((seat, i) => ({ ...seat, id: nextId.current + i })));
    nextId.current += switched.seats.length;
    setSelected(null);
    setMoving(null);
  };

  const addGuest = () => {
    if (guests >= MAX_GUESTS) return;
    const used = new Set(seats.map((seat) => seat.species));
    const pick = NEW_GUEST_SPECIES.find((key) => !used.has(key)) ?? NEW_GUEST_SPECIES[guests % NEW_GUEST_SPECIES.length];
    edit([...seats, { species: pick, label: "", id: nextId.current++ }]);
  };

  const removeGuest = (place?: number) => {
    if (guests <= MIN_GUESTS) return;
    const index = place ?? seats.findLastIndex((seat) => seat.species);
    edit(seats.filter((_, i) => i !== index));
    setSelected(null);
    setMoving(null);
  };

  const optimise = () => {
    const order = optimalOrder(plan);
    const next = order.map((i) => seats[i]);
    const moved = next.filter((seat, i) => seat.id !== seats[i].id).length;
    const after = assess({ mode, seats: stripIds(next) });
    setBefore(seats);
    setSeats(next);
    setSelected(null);
    setMoving(null);
    const text = t.optimised(moved, decimal(locale, assessment.disputes), decimal(locale, after.disputes));
    setNotice(text);
    setAnnounce(text);
    track("Plan stołu: rozsadzenie Instytutu", { tryb: mode, goscie: guests });
  };

  const undo = () => {
    if (!before) return;
    setSeats(before);
    setBefore(null);
    setNotice("");
  };

  /* Dragging: pointer events on the guest, coordinates turned into the layout's units. */

  const scale = () => (board.current ? board.current.getBoundingClientRect().width / layout.width : 1);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, place: number) => {
    if (event.button !== 0 || moving !== null) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer the browser no longer tracks: the drag still follows the button's own events.
    }
    setDrag({ place, id: seats[place].id, x: event.clientX, y: event.clientY, dx: 0, dy: 0, moved: false, target: null });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const moved = drag.moved || Math.hypot(dx, dy) > 6;
    if (!moved) return;
    const s = scale();
    const origin = layout.places[drag.place];
    const at = { x: origin.x + dx / s, y: origin.y + dy / s };
    let target: number | null = null;
    let best = 52;
    layout.places.forEach((place, i) => {
      const distance = Math.hypot(place.x - at.x, place.y - at.y);
      if (i !== drag.place && distance < best) {
        best = distance;
        target = i;
      }
    });
    setDrag({ ...drag, dx, dy, moved, target });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    if (drag.moved) {
      droppedAt.current = event.timeStamp;
      if (drag.target !== null) {
        setSettled(drag.id);
        swap(drag.place, drag.target);
        track("Plan stołu: przesadzenie", { sposob: "przeciagniecie" });
      }
    }
    setDrag(null);
  };

  const onSeatClick = (place: number, at: number) => {
    if (at - droppedAt.current < 400) return;
    if (moving !== null) {
      const from = moving;
      setMoving(null);
      swap(from, place);
      if (from !== place) track("Plan stołu: przesadzenie", { sposob: "wskazanie" });
      return;
    }
    reveal.current = true;
    setSelected((current) => (current === place ? null : place));
  };

  useEffect(() => {
    if (selected === null || !editor.current || !reveal.current) return;
    reveal.current = false;
    editor.current.focus({ preventScroll: true });
    editor.current.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [selected, reduced]);

  const marked = assessment.flashpoints.slice(0, 4).map((pair) => [pair.a, pair.b] as [number, number]);
  const selectedSeat = selected !== null ? seats[selected] : null;

  const setSpecies = (key: SpeciesKey) => {
    if (selected === null) return;
    edit(seats.map((seat, i) => (i === selected ? { ...seat, species: key } : seat)));
  };
  const setLabel = (label: string) => {
    if (selected === null) return;
    edit(seats.map((seat, i) => (i === selected ? { ...seat, label } : seat)));
  };

  const groups = [
    { key: "national" as const, items: species.filter((item) => !item.region && !item.occasion) },
    { key: "regional" as const, items: species.filter((item) => item.region) },
    { key: "occasional" as const, items: species.filter((item) => item.occasion) },
  ];

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <fieldset>
            <legend className="label text-ink-soft">{t.occasion}</legend>
            <div className="mt-2 flex">
              {(["wigilia", "wesele"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={mode === item}
                  onClick={() => changeMode(item)}
                  className={cx(
                    "btn -ml-px border border-ink px-4 py-3 first:ml-0",
                    mode === item ? "bg-ink text-paper" : "hover:bg-paper-deep",
                  )}
                >
                  {t.modes[item]}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <p className="label text-ink-soft" id="liczba-gosci">
              {t.guests}
            </p>
            <div className="mt-2 flex items-center" role="group" aria-labelledby="liczba-gosci">
              <button type="button" onClick={() => removeGuest()} disabled={guests <= MIN_GUESTS} aria-label={t.fewer} className="btn border border-ink px-4 py-3 hover:bg-paper-deep disabled:opacity-35">
                −
              </button>
              <output aria-live="polite" className="w-12 text-center font-sans text-xl font-bold">
                {guests}
              </output>
              <button type="button" onClick={addGuest} disabled={guests >= MAX_GUESTS} aria-label={t.more} className="btn border border-ink px-4 py-3 hover:bg-paper-deep disabled:opacity-35">
                +
              </button>
            </div>
          </div>
        </div>

        <p className="label mt-5 text-ink-soft">{moving !== null ? <span className="text-red">{t.moving}</span> : t.hint}</p>

        <div
          ref={board}
          className={cx("relative mx-auto mt-4 w-full select-none", mode === "wesele" && seats.length > 10 ? "max-w-[24rem]" : "max-w-[28rem]")}
          style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
        >
          <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="absolute inset-0 h-full w-full" role="img" aria-label={t.scene(mode, guests)}>
            <TableScene layout={layout} marked={marked} />
            {seats.map((seat, i) => (!seat.species ? <EmptyChair key={seat.id} {...layout.places[i]} /> : null))}
          </svg>
          {assessment.flashpoints.slice(0, 4).map((pair) => {
            const from = setting(layout, pair.a);
            const to = setting(layout, pair.b);
            return (
              <span
                key={`${pair.a}-${pair.b}`}
                aria-hidden="true"
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-paper px-1 font-sans text-[0.7rem] font-bold leading-tight text-red sm:text-xs"
                style={{ left: `${(((from.x + to.x) / 2) / layout.width) * 100}%`, top: `${(((from.y + to.y) / 2) / layout.height) * 100}%` }}
              >
                {percent(locale, pair.risk)}
              </span>
            );
          })}
          {seats.map((seat, i) => {
            const place = layout.places[i];
            const dragging = drag?.id === seat.id && drag.moved;
            const target = drag?.moved && drag.target === i;
            const name = seat.species ? species.find((item) => item.key === seat.species)!.name : "";
            return (
              <button
                key={seat.id}
                type="button"
                aria-label={seat.species ? t.seatLabel(i + 1, seat.label, name) : t.wandererLabel(i + 1)}
                aria-pressed={selected === i}
                onPointerDown={(event) => onPointerDown(event, i)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => setDrag(null)}
                onClick={(event) => onSeatClick(i, event.timeStamp)}
                className={cx(
                  "group absolute flex touch-none flex-col items-center rounded-sm outline-offset-2",
                  dragging ? "z-20 cursor-grabbing" : "z-10 cursor-grab",
                  selected === i && "outline-2 outline-red outline-dashed",
                  target && "bg-paper-deep outline-2 outline-ink outline-dashed",
                  moving !== null && moving !== i && "bg-paper-deep/70",
                  !dragging && settled !== seat.id && "transition-[left,top] duration-500 ease-out motion-reduce:transition-none",
                )}
                style={{
                  left: `${(place.x / layout.width) * 100}%`,
                  top: `${((place.y - SEAT_HEIGHT / 2) / layout.height) * 100}%`,
                  width: `${(SEAT_WIDTH / layout.width) * 100}%`,
                  transform: `translate(-50%, 0) ${dragging ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.08)` : ""}`,
                }}
              >
                {seat.species ? (
                  <>
                    <SpeciesPlate species={seat.species} variant="pictogram" className="aspect-[6/5] w-full" />
                    <span className="mt-0.5 block max-w-[130%] truncate bg-paper/85 px-1 font-sans text-[0.68rem] font-semibold leading-tight sm:text-[0.78rem]">
                      {seat.label || shortName(seat.species, locale)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block aspect-[6/5] w-full" />
                    <span className="mt-0.5 block font-sans text-[0.68rem] italic leading-tight text-ink-soft sm:text-[0.78rem]">{t.wanderer}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>

      <div className="space-y-10">
        {selectedSeat && selected !== null && (
          <div ref={editor} tabIndex={-1} className="border border-ink bg-card p-5 outline-none md:p-6" aria-labelledby="miejsce-edycja">
            <div className="flex items-baseline justify-between gap-4">
              <h3 id="miejsce-edycja" className="text-2xl font-bold">
                {t.place(selected + 1)}
                {selectedSeat.species && <span className="font-normal text-ink-soft"> · {shortName(selectedSeat.species, locale)}</span>}
              </h3>
              <button type="button" onClick={() => setSelected(null)} className="link shrink-0 font-sans">
                {t.close}
              </button>
            </div>
            {selectedSeat.species ? (
              <>
                <label className="mt-5 block">
                  <span className="label text-ink-soft">{t.label}</span>
                  <input
                    type="text"
                    value={selectedSeat.label}
                    maxLength={24}
                    placeholder={t.labelPlaceholder}
                    onChange={(event) => setLabel(event.target.value)}
                    onBlur={(event) => setLabel(cleanName(event.target.value))}
                    className="mt-1 block w-full border border-ink bg-paper px-3 py-2.5 text-lg outline-offset-2 focus:outline-2 focus:outline-red"
                  />
                </label>
                <p className="label mt-2 text-ink-faint">{t.labelNote}</p>
                <fieldset className="mt-6">
                  <legend className="label text-ink-soft">{t.species}</legend>
                  {groups.map((group) => (
                    <div key={group.key} className="mt-3">
                      <p className="label text-ink-faint">{t.groups[group.key]}</p>
                      <div className="mt-1 grid grid-cols-4 gap-1 sm:grid-cols-5">
                        {group.items.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            aria-pressed={selectedSeat.species === item.key}
                            onClick={() => setSpecies(item.key)}
                            title={item.name}
                            className={cx(
                              "group flex flex-col items-center border px-0.5 pb-1 pt-0.5 text-center",
                              selectedSeat.species === item.key ? "border-red bg-paper" : "border-transparent hover:border-rule hover:bg-paper",
                            )}
                          >
                            <SpeciesPlate species={item.key} variant="pictogram" className="aspect-[6/5] w-full max-w-16" />
                            <span className="mt-0.5 block w-full truncate font-sans text-[0.68rem] leading-tight">{shortName(item.key, locale)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </fieldset>
              </>
            ) : (
              <div className="mt-4 flex items-center gap-4">
                <svg viewBox="-24 -22 48 44" className="w-14 shrink-0" aria-hidden="true">
                  <EmptyChair x={0} y={0} />
                </svg>
                <p className="text-ink-soft">{typo(t.wandererNote)}</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {moving === selected ? (
                <button type="button" onClick={() => setMoving(null)} className="btn border border-ink hover:bg-paper-deep">
                  {t.cancel}
                </button>
              ) : (
                <button type="button" onClick={() => setMoving(selected)} className="btn bg-ink text-paper hover:bg-red">
                  {t.move}
                </button>
              )}
              {selectedSeat.species && (
                <button type="button" onClick={() => removeGuest(selected)} disabled={guests <= MIN_GUESTS} className="btn border border-ink hover:bg-paper-deep disabled:opacity-35">
                  {t.remove}
                </button>
              )}
            </div>
          </div>
        )}

        <section aria-labelledby="protokol-tytul">
          <div className="flex items-start justify-between gap-4 border-t-2 border-ink pt-4">
            <div>
              <h2 id="protokol-tytul" className="text-3xl font-bold leading-tight">
                {t.protocol}
              </h2>
              <p className="label mt-1 text-ink-soft">
                {t.modes[mode]} · {t.number(protocolNumber(plan))}
              </p>
            </div>
            <VerdictStamp verdict={assessment.verdict} className="mt-1 shrink-0" />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <dt className="label text-ink-soft">{t.index}</dt>
              <dd className="mt-1 font-sans text-4xl font-bold leading-none">
                {assessment.index}
                <span className="text-xl text-ink-faint">/100</span>
              </dd>
              <div className="relative mt-3 h-2 bg-rule" aria-hidden="true">
                <div className="absolute inset-y-0 left-0 bg-red transition-[width] duration-500" style={{ width: `${assessment.index}%` }} />
              </div>
            </div>
            <div>
              <dt className="label text-ink-soft">{t.disputes}</dt>
              <dd className="mt-1 font-sans text-4xl font-bold leading-none">{decimal(locale, assessment.disputes)}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <p className="text-xl font-bold">{verdict.title}</p>
            <p className="mt-1 text-ink-soft">{typo(verdict.note)}</p>
          </div>
          <div className="mt-6">
            <ProtocolFindings plan={plan} assessment={assessment} />
          </div>
          {notice && <p className="mt-6 border-l-4 border-red pl-4">{notice}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={optimise} className="btn bg-red text-paper hover:bg-ink">
              {t.optimise}
            </button>
            {before && (
              <button type="button" onClick={undo} className="btn border border-ink hover:bg-paper-deep">
                {t.undo}
              </button>
            )}
            {issued === code ? (
              <span className="btn border border-rule text-ink-soft">{t.issued} ✓</span>
            ) : (
              <Link href={`/plan-stolu/${code}`} prefetch={false} className="btn border border-ink hover:bg-ink hover:text-paper" onClick={() => track("Plan stołu: protokół", { tryb: mode })}>
                {issued ? t.reissue : t.issue} →
              </Link>
            )}
          </div>
          {issued && issued !== code && <p className="label mt-3 text-ink-faint">{t.changed}</p>}
        </section>
      </div>
    </div>
  );
}
