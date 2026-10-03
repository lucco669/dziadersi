"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import type { Moon, Sheet } from "@/lib/almanac";
import { warsawTime } from "@/lib/calendar";
import type { Calendar } from "@/lib/profile";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";

export type Page = Sheet & { proverb: string; observance?: { name: string; note: string } };

const COPY = defineCopy({
  pl: {
    dayOff: "dzień wolny od pracy",
    /** Whether the page names the holiday too: Polish readers know their own. */
    namesHoliday: false,
    sunrise: "Wschód",
    sunset: "Zachód",
    daylight: "Dzień",
    moon: (name: string, day: number, left: number) => `Księżyc: ${name} · dzień ${day}, zostało ${left}`,
    week: (week: number) => `Kalendarz IBD · tydzień ${week}`,
    toChristmasEve: (days: number) => (days ? `do Wigilii ${days} ${plural(days, "dzień", "dni", "dni")}` : "Wigilia"),
    tearYesterday: (date: string) => `Zerwij wczorajszą kartkę: ${date}`,
    yesterday: "Wczorajsza kartka. Zerwij",
    hanging: "Na ścianie wisi jeszcze wczorajsza kartka.",
    hangingText: "W każdym porządnym domu zrywa się ją rano, przy herbacie, z dźwiękiem, który słychać w całej kuchni.",
    tear: "Zerwij kartkę",
    today: (date: string) => `Dziś, ${date}`,
    torn: "Kartka zerwana.",
    alreadyTorn: "Dzisiejsza kartka już wisi.",
    collection: ({ total, streak, best }: Calendar) =>
      `Kartka nr ${total} w kolekcji. Seria: ${streak} ${plural(streak, "dzień", "dni", "dni")} z rzędu${best > streak ? `, rekord: ${best}` : ""}.`,
    badge: (days: number) => `Do odznaki Zdzieraka brakuje ${days} ${plural(days, "dnia", "dni", "dni")}.`,
    guest: "Kolekcję zerwanych kartek, serię dni i odznakę Zdzieraka prowadzi Profil Dziaderski.",
    join: "Załóż profil",
    next: "Następna kartka za",
    tornToday: "Dziś zerwało",
    people: (n: number) => `${n} ${plural(n, "osoba", "osoby", "osób")}`,
  },
  sl: {
    // Red numbers are Poland's days off: the page names the holiday and says where it is one.
    dayOff: "dela prost dan na Poljskem",
    namesHoliday: true,
    sunrise: "Vzhod",
    sunset: "Zahod",
    daylight: "Dolžina dneva",
    moon: (name: string, day: number, left: number) => `Luna: ${name} · ${day}. dan, do konca leta ${left}`,
    week: (week: number) => `Koledar IBD · ${week}. teden`,
    toChristmasEve: (days: number) =>
      days ? `do svetega večera ${days} ${pluralSl(days, "dan", "dneva", "dnevi", "dni")}` : "sveti večer",
    tearYesterday: (date: string) => `Odtrgaj včerajšnji list: ${date}`,
    yesterday: "Včerajšnji list. Odtrgaj",
    hanging: "Na steni še visi včerajšnji list.",
    hangingText: "V vsaki spodobni hiši ga odtrgajo zjutraj, ob čaju, z zvokom, ki se sliši po vsej kuhinji.",
    tear: "Odtrgaj list",
    today: (date: string) => `Danes, ${date}`,
    torn: "List je odtrgan.",
    alreadyTorn: "Današnji list že visi.",
    collection: ({ total, streak, best }: Calendar) =>
      `List št. ${total} v zbirki. Niz: ${streak} ${pluralSl(streak, "dan", "dneva", "dnevi", "dni")} zapored${best > streak ? `, rekord: ${best}` : ""}.`,
    badge: (days: number) =>
      `Do značke Trgalec ${pluralSl(days, `manjka še ${days} dan`, `manjkata še ${days} dneva`, `manjkajo še ${days} dnevi`, `manjka še ${days} dni`)}.`,
    guest: "Zbirko odtrganih listov, niz dni in značko Trgalec vodi Dziaderski profil.",
    join: "Ustvari profil",
    next: "Naslednji list čez",
    tornToday: "Danes odtrgalo",
    people: (n: number) => `${n} ${pluralSl(n, "oseba", "osebi", "osebe", "oseb")}`,
  },
});

const TORN_KEY = "ibd-kartka";
const noSubscription = () => () => {};

function storedDay() {
  try {
    return localStorage.getItem(TORN_KEY) ?? "";
  } catch {
    return "";
  }
}

/** The moon as a disc lit from the right while it grows and from the left while it wanes. */
export function MoonGlyph({ moon, className }: { moon: Moon; className?: string }) {
  const lit = moon.illumination / 100;
  // The terminator is an ellipse whose width runs from full (new) through zero (quarter) to full (full moon).
  const rx = Math.abs(1 - 2 * lit) * 10;
  const sweep = moon.waxing ? 1 : 0;
  const bulge = lit > 0.5 === moon.waxing ? 1 : 0;
  return (
    <svg viewBox="-11 -11 22 22" className={className} aria-hidden="true">
      <circle r={10} fill="currentColor" opacity={0.15} />
      {lit > 0.02 && <path d={`M0 -10A10 10 0 0 ${sweep} 0 10A${rx} 10 0 0 ${bulge} 0 -10Z`} fill="currentColor" />}
    </svg>
  );
}

function SheetFace({ page, className }: { page: Page; className?: string }) {
  const t = COPY[useLocale()];
  const [first, second] = page.proverb.split(" / ");
  return (
    <div className={cx("flex h-full flex-col border border-ink bg-card px-6 pb-5 pt-5 text-center", className)}>
      <p className="flex justify-between font-sans text-[0.9rem] font-semibold">
        <span className="uppercase tracking-[0.14em]">{page.monthName}</span>
        <span className="text-ink-soft">{page.year}</span>
      </p>
      <p className={cx("mt-2 text-[clamp(7.5rem,24vw,11rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums", page.red && "text-red")}>
        {page.day}
      </p>
      <p className={cx("mt-1 text-2xl font-bold", page.red && "text-red")}>{page.weekday}</p>
      {page.dayOff && <p className="label text-red">{t.namesHoliday && page.holiday ? `${page.holiday} · ${t.dayOff}` : t.dayOff}</p>}

      <dl className="mt-5 grid grid-cols-3 border-y border-ink py-2.5 font-sans text-[0.8rem] leading-tight">
        <div>
          <dt className="text-ink-soft">{t.sunrise}</dt>
          <dd className="font-semibold">{page.sunrise}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">{t.sunset}</dt>
          <dd className="font-semibold">{page.sunset}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">{t.daylight}</dt>
          <dd className="font-semibold">{page.daylight}</dd>
        </div>
      </dl>
      <p className="label mt-2 flex items-center justify-center gap-2 text-ink-soft">
        <MoonGlyph moon={page.moon} className="size-4 text-ink" />
        {t.moon(page.moon.name, page.dayOfYear, page.daysLeft)}
      </p>

      {page.observance && (
        <div className="mt-4">
          <p className="font-sans text-[0.85rem] font-semibold text-red">{page.observance.name}</p>
          <p className="label mt-0.5 text-ink-soft">{typo(page.observance.note)}</p>
        </div>
      )}

      <p className="mx-auto mt-auto max-w-xs pt-5 text-[1.15rem] italic leading-snug">
        {typo(first)}
        {second && (
          <>
            <br />
            {typo(second)}
          </>
        )}
      </p>
      <p className="label mt-4 flex justify-between border-t border-rule pt-2 text-[0.72rem] text-ink-faint">
        <span>{t.week(page.week)}</span>
        <span>{t.toChristmasEve(page.toChristmasEve)}</span>
      </p>
    </div>
  );
}

function untilMidnight() {
  const now = warsawTime(new Date());
  const left = 24 * 60 - (now.hour * 60 + now.minute);
  return `${Math.floor(left / 60)} h ${left % 60} min`;
}

/**
 * The calendar on the wall: yesterday's page still hangs over today's until someone tears it off.
 * A signed-in visitor's torn pages go to the profile and make a streak.
 */
export function TearOffCalendar({ today, yesterday, tornToday }: { today: Page; yesterday: Page; tornToday: number | null }) {
  const t = COPY[useLocale()];
  const account = useAccount();
  const stored = useSyncExternalStore(noSubscription, storedDay, () => "");
  const [state, setState] = useState<"wall" | "tearing" | "done">("wall");
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [left, setLeft] = useState("");
  const hydrated = useSyncExternalStore(noSubscription, () => true, () => false);

  const member = account.status === "member" ? account.account : null;
  const alreadyTorn = stored === today.key || Boolean(member?.calendar.today);
  const hanging = state !== "done" && !(state === "wall" && alreadyTorn && hydrated);

  useEffect(() => {
    const tick = () => setLeft(untilMidnight());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  async function tear() {
    if (state !== "wall") return;
    setState("tearing");
    try {
      localStorage.setItem(TORN_KEY, today.key);
    } catch {
      // Not remembering is fine: tomorrow the page hangs again anyway.
    }
    window.setTimeout(() => setState("done"), 900);
    try {
      const response = await fetch("/api/kalendarz", { method: "POST" });
      const data = (await response.json()) as { calendar: Calendar | null };
      if (data.calendar) {
        setCalendar(data.calendar);
        patchAccount((current) => ({ ...current, calendar: data.calendar! }));
      }
    } catch {
      // The page is torn either way.
    }
  }

  const shown = calendar ?? member?.calendar ?? null;

  return (
    <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6">
        <div className="relative mx-auto max-w-[26rem]">
          <div className="relative z-20 flex h-6 items-center justify-center gap-24 bg-ink" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-paper" />
            <span className="size-2.5 rounded-full bg-paper" />
          </div>
          <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="relative z-10 block h-2 w-full" aria-hidden="true">
            <path d="M0 0H100V1.6L96 4L92 1.4L88 3.6L84 1.2L80 3.8L76 1.6L72 3.4L68 1.2L64 3.6L60 1.4L56 3.8L52 1.2L48 3.4L44 1.6L40 3.8L36 1.2L32 3.6L28 1.4L24 3.4L20 1.6L16 3.8L12 1.2L8 3.6L4 1.4L0 3Z" fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth={0.3} />
          </svg>
          <div className="relative -mt-px min-h-[34rem]">
            <span aria-hidden="true" className="absolute inset-x-1 -bottom-1.5 h-3 border-x border-b border-ink bg-card" />
            <span aria-hidden="true" className="absolute inset-x-2 -bottom-3 h-3 border-x border-b border-ink bg-card" />
            <SheetFace page={today} className="relative min-h-[34rem]" />
            {hanging && (
              <button
                type="button"
                onClick={tear}
                aria-label={t.tearYesterday(yesterday.date)}
                className={cx(
                  "absolute inset-0 z-10 block w-full origin-top-right cursor-grab text-left",
                  state === "tearing" && "pointer-events-none animate-[tear-off_900ms_cubic-bezier(0.5,0,0.75,0.4)_forwards]",
                )}
              >
                <SheetFace page={yesterday} className="min-h-[34rem]" />
                <span className="label absolute left-1/2 top-full mt-7 -translate-x-1/2 whitespace-nowrap bg-ink px-3 py-1.5 text-paper">
                  {t.yesterday}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-6">
        {hanging ? (
          <div className="border-t border-ink pt-5">
            <p className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">{typo(t.hanging)}</p>
            <p className="mt-3 max-w-md text-lg leading-snug text-ink-soft">
              {typo(t.hangingText)}
            </p>
            <button type="button" onClick={tear} disabled={state !== "wall"} className="btn mt-7 bg-ink text-paper hover:bg-red disabled:opacity-60">
              {t.tear} <span aria-hidden="true">↓</span>
            </button>
          </div>
        ) : (
          <div className="border-t border-ink pt-5" role="status">
            <p className="label text-ink-soft">{t.today(today.date)}</p>
            <p className="mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">
              {state === "done" ? t.torn : t.alreadyTorn}
            </p>
            {shown ? (
              <p className="mt-3 max-w-md text-lg leading-snug">
                <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-2px] rounded-full bg-red" />
                {typo(t.collection(shown))}{" "}
                {shown.best < 7 && typo(t.badge(7 - shown.best))}
              </p>
            ) : (
              <p className="mt-3 max-w-md text-lg leading-snug text-ink-soft">
                {typo(t.guest)}{" "}
                <Link href={signInHref("/kalendarz")} className="link font-sans text-[0.95rem] text-ink">
                  {t.join}
                </Link>
              </p>
            )}
          </div>
        )}
        <dl className="mt-8 grid grid-cols-2 border-t border-rule">
          <div className="pt-3">
            <dt className="label text-ink-soft">{t.next}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums">{left || "…"}</dd>
          </div>
          <div className="pt-3">
            <dt className="label text-ink-soft">{t.tornToday}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums">
              {tornToday === null ? "·" : t.people(tornToday + (state === "done" ? 1 : 0))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
