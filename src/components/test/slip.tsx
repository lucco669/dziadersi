import { getStations, STATIONS, TASKS } from "@/content/test";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { siteCopy } from "@/lib/site";
import { cx, pluralSl, typo } from "@/lib/typo";
import { Seal } from "../brand";

const PER_STATION = STATIONS.map((_, i) => TASKS.filter((task) => task.station === i).length);

const COPY = defineCopy({
  pl: {
    progress: (done: number, total: number) => `Karta obiegowa: zaliczono ${done} z ${total} gabinetów`,
    room: "Gab.",
    form: "Formularz IBD-T2",
    title: "Karta obiegowa",
    instruction: "Proszę zebrać pieczątki ze wszystkich gabinetów.",
    number: "pok.",
    facts: (tasks: number) => `${tasks} zadań · ok. 4 minuty · pieczątka na końcu`,
  },
  sl: {
    progress: (done: number, total: number) => `Obhodni list: opravljeno ${done} od ${total} ordinacij`,
    room: "Ord.",
    form: "Obrazec IBD-T2",
    title: "Obhodni list",
    instruction: "Prosimo, zberi žige vseh ordinacij.",
    number: "soba",
    facts: (tasks: number) => `${tasks} ${pluralSl(tasks, "naloga", "nalogi", "naloge", "nalog")} · pribl. 4 minute · žig na koncu`,
  },
});

/** Progress as the routing slip of a check-up: one box per room, stamped on the way out. */
export function RoutingSlip({
  locale,
  current,
  done,
  step,
  fresh,
}: {
  locale: Locale;
  /** Room in progress, or -1. */
  current: number;
  /** Rooms stamped so far. */
  done: number;
  /** Task within the current room. */
  step?: number;
  /** Room whose stamp was just put down. */
  fresh?: number;
}) {
  const t = COPY[locale];
  const stations = getStations(locale);
  return (
    <ol
      aria-label={t.progress(done, stations.length)}
      className="grid grid-cols-5 border border-ink bg-card"
    >
      {stations.map((station, i) => (
        <li
          key={station.room}
          aria-current={i === current ? "step" : undefined}
          className={cx(
            "relative min-h-[3.9rem] border-l border-ink px-2 py-1.5 first:border-l-0 md:px-3",
            i === current && "bg-paper",
            i < done && "md:pr-14",
          )}
        >
          <span className={cx("label block text-[0.72rem]", i === current ? "text-red" : "text-ink-soft")}>{t.room} {station.numeral}</span>
          <span className="label hidden text-[0.78rem] leading-tight text-ink md:block">{station.name}</span>
          {i === current && step !== undefined && (
            <span className="absolute inset-x-2 bottom-1.5 flex gap-1 md:inset-x-3" aria-hidden="true">
              {Array.from({ length: PER_STATION[i] }, (_, j) => (
                <span key={j} className={cx("h-1 flex-1", j < step ? "bg-ink" : j === step ? "bg-red" : "bg-ink/15")} />
              ))}
            </span>
          )}
          {i < done && (
            <Seal
              locale={locale}
              className={cx(
                "absolute right-1 top-1/2 size-11 -translate-y-1/2 text-red opacity-90 md:size-12",
                i === fresh ? "animate-stamp [--stamp-rotate:-14deg]" : "rotate-[-14deg]",
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

/** The full routing slip, as handed out at reception: rooms, what happens in each, a box for the stamp. */
export function RoutingSlipDocument({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <figure className="border border-ink bg-card p-2">
      <div className="border border-ink px-5 pb-5 pt-4 md:px-6">
        <p className="label flex justify-between text-ink-soft">
          <span>{siteCopy(locale).institute}</span>
          <span>{t.form}</span>
        </p>
        <p className="mt-4 text-[1.9rem] font-bold leading-none">{t.title}</p>
        <p className="mt-2 italic text-ink-soft">{typo(t.instruction)}</p>
        <ol className="mt-5 border-t border-ink">
          {getStations(locale).map((station) => (
            <li key={station.room} className="grid grid-cols-[3.2rem_1fr_3.4rem] items-center gap-3 border-b border-rule py-3">
              <span className="label text-ink-soft">
                {t.number}
                <br />
                <span className="text-[1rem] text-ink">{station.room}</span>
              </span>
              <span>
                <span className="block font-bold leading-tight">
                  {station.numeral}. {station.name}
                </span>
                <span className="mt-0.5 block font-sans text-[0.85rem] leading-snug text-ink-soft">{typo(station.note)}</span>
              </span>
              <span aria-hidden="true" className="size-12 justify-self-end border border-dashed border-ink-faint" />
            </li>
          ))}
        </ol>
        <p className="label mt-4 text-ink-faint">
          {t.facts(TASKS.length)}
        </p>
      </div>
    </figure>
  );
}
