import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { dayOfYear, daysInYear, easterDay, isoWeek, warsawTime } from "./calendar";

/*
 * The front of a tear-off calendar page: the date, sunrise and sunset in Warsaw, the moon,
 * days to Christmas Eve and whether the number is printed in red (Sunday or a day off work).
 * Pure arithmetic, so the server and the browser agree. Both editions print the same Polish
 * calendar: Warsaw's sun and Poland's days off, in the edition's words.
 */

type Holiday =
  | "newYear"
  | "epiphany"
  | "easter"
  | "easterMonday"
  | "labour"
  | "constitution"
  | "pentecost"
  | "corpusChristi"
  | "assumption"
  | "allSaints"
  | "independence"
  | "christmasEve"
  | "christmas"
  | "boxingDay";

/** Fixed days off work in Poland, "MM-DD"; 24 December since 2025. Moving ones come from Easter. */
const DAYS_OFF: Record<string, Holiday> = {
  "01-01": "newYear",
  "01-06": "epiphany",
  "05-01": "labour",
  "05-03": "constitution",
  "08-15": "assumption",
  "11-01": "allSaints",
  "11-11": "independence",
  "12-24": "christmasEve",
  "12-25": "christmas",
  "12-26": "boxingDay",
};

/** Easter Sunday and Monday, Pentecost (+49) and Corpus Christi (+60), in days after Easter. */
const EASTER_DAYS_OFF: [number, Holiday][] = [
  [0, "easter"],
  [1, "easterMonday"],
  [49, "pentecost"],
  [60, "corpusChristi"],
];

const COPY = defineCopy({
  pl: {
    months: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
    /** After the day number: "2 października". */
    monthsInDate: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"],
    weekdays: ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"],
    date: (day: number, month: string, year: number) => `${day} ${month} ${year}`,
    /** Between hours and minutes: "6:58". */
    clock: ":",
    moon: {
      new: "nów",
      waxing: "przybywa",
      firstQuarter: "pierwsza kwadra",
      full: "pełnia",
      waning: "ubywa",
      lastQuarter: "ostatnia kwadra",
    },
    holidays: {
      newYear: "Nowy Rok",
      epiphany: "Święto Trzech Króli",
      easter: "Wielkanoc",
      easterMonday: "Poniedziałek Wielkanocny",
      labour: "Święto Pracy",
      constitution: "Święto Konstytucji 3 Maja",
      pentecost: "Zielone Świątki",
      corpusChristi: "Boże Ciało",
      assumption: "Wniebowzięcie Najświętszej Maryi Panny",
      allSaints: "Wszystkich Świętych",
      independence: "Narodowe Święto Niepodległości",
      christmasEve: "Wigilia",
      christmas: "Boże Narodzenie",
      boxingDay: "drugi dzień Bożego Narodzenia",
    } satisfies Record<Holiday, string>,
  },
  sl: {
    months: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
    // Slovenian keeps the nominative after the day number: "2. oktober".
    monthsInDate: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
    weekdays: ["ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"],
    date: (day: number, month: string, year: number) => `${day}. ${month} ${year}`,
    clock: ".",
    moon: {
      new: "mlaj",
      waxing: "narašča",
      firstQuarter: "prvi krajec",
      full: "ščip",
      waning: "pojema",
      lastQuarter: "zadnji krajec",
    },
    // The Polish days off, as a Slovenian calendar would name them (lowercase, like Slovenian holidays).
    holidays: {
      newYear: "novo leto",
      epiphany: "sveti trije kralji",
      easter: "velika noč",
      easterMonday: "velikonočni ponedeljek",
      labour: "praznik dela",
      constitution: "dan ustave 3. maja",
      pentecost: "binkošti",
      corpusChristi: "sveto rešnje telo",
      assumption: "Marijino vnebovzetje",
      allSaints: "vsi sveti",
      independence: "dan neodvisnosti",
      christmasEve: "sveti večer",
      christmas: "božič",
      boxingDay: "drugi dan božiča",
    },
  },
});

const WARSAW = { lat: 52.2297, lon: 21.0122 };
const DAY_MS = 86_400_000;
const SYNODIC = 29.530588853;
/** A known new moon: 6 January 2000, 18:14 UTC. */
const NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export type Moon = { name: string; age: number; illumination: number; waxing: boolean };

export type Sheet = {
  /** "2026-10-02", as Postgres writes dates. */
  key: string;
  year: number;
  month: number;
  day: number;
  monthName: string;
  /** The month after a day number: "października" in Polish, "oktober" in Slovenian. */
  monthGenitive: string;
  /** "2 października 2026", "2. oktober 2026". */
  date: string;
  weekday: string;
  /** 1 January is day 1. */
  dayOfYear: number;
  daysLeft: number;
  week: number;
  toChristmasEve: number;
  red: boolean;
  dayOff: boolean;
  /** The Polish public holiday that makes it a day off, in the edition's language. */
  holiday?: string;
  /** Warsaw time: "6:58", "6.58" in Slovenian. */
  sunrise: string;
  sunset: string;
  /** "11 h 29 min". */
  daylight: string;
  moon: Moon;
};

const pad = (value: number) => String(value).padStart(2, "0");
const clock = (minutes: number, separator: string) => `${Math.floor(minutes / 60)}${separator}${pad(Math.round(minutes % 60) % 60)}`;

/** Minutes after local midnight, Warsaw time, for sunrise and sunset (NOAA's approximation). */
function sun(year: number, month: number, day: number) {
  const n = dayOfYear(year, month, day) + 1;
  const gamma = ((2 * Math.PI) / daysInYear(year)) * (n - 1);
  const eqtime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const lat = (WARSAW.lat * Math.PI) / 180;
  const zenith = (90.833 * Math.PI) / 180;
  const ha = (Math.acos(Math.cos(zenith) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)) * 180) / Math.PI;
  // The offset from UTC on that day: one hour in winter, two in summer.
  const offset = (warsawTime(new Date(Date.UTC(year, month - 1, day, 12))).hour - 12) * 60;
  return {
    rise: 720 - 4 * (WARSAW.lon + ha) - eqtime + offset,
    set: 720 - 4 * (WARSAW.lon - ha) - eqtime + offset,
  };
}

export function moonOn(year: number, month: number, day: number, locale: Locale): Moon {
  const names = COPY[locale].moon;
  const age = ((((Date.UTC(year, month - 1, day, 12) - NEW_MOON) / DAY_MS) % SYNODIC) + SYNODIC) % SYNODIC;
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2) * 100);
  const name =
    age < 1.85 || age >= 27.68
      ? names.new
      : age < 5.54
        ? names.waxing
        : age < 9.23
          ? names.firstQuarter
          : age < 12.92
            ? names.waxing
            : age < 16.61
              ? names.full
              : age < 20.3
                ? names.waning
                : age < 23.99
                  ? names.lastQuarter
                  : names.waning;
  return { name, age, illumination, waxing: age < SYNODIC / 2 };
}

/** The Polish public holiday on a date, if there is one. */
function holidayOn(year: number, month: number, day: number): Holiday | undefined {
  const fixed = DAYS_OFF[`${pad(month)}-${pad(day)}`];
  if (fixed) return fixed;
  const easter = easterDay(year);
  const today = dayOfYear(year, month, day);
  return EASTER_DAYS_OFF.find(([after]) => easter + after === today)?.[1];
}

export function isDayOff(year: number, month: number, day: number) {
  return holidayOn(year, month, day) !== undefined;
}

export function sheetFor(year: number, month: number, day: number, locale: Locale): Sheet {
  const t = COPY[locale];
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekdayIndex = (date.getUTCDay() + 6) % 7;
  const doy = dayOfYear(year, month, day) + 1;
  const eve = Date.UTC(year, 11, 24);
  const nextEve = date.getTime() > eve ? Date.UTC(year + 1, 11, 24) : eve;
  const { rise, set } = sun(year, month, day);
  const daylight = Math.round(set - rise);
  const holiday = holidayOn(year, month, day);
  const dayOff = holiday !== undefined;
  return {
    key: `${year}-${pad(month)}-${pad(day)}`,
    year,
    month,
    day,
    monthName: t.months[month - 1],
    monthGenitive: t.monthsInDate[month - 1],
    date: t.date(day, t.monthsInDate[month - 1], year),
    weekday: t.weekdays[weekdayIndex],
    dayOfYear: doy,
    daysLeft: daysInYear(year) - doy,
    week: isoWeek(year, month, day),
    toChristmasEve: Math.round((nextEve - date.getTime()) / DAY_MS),
    red: weekdayIndex === 6 || dayOff,
    dayOff,
    ...(holiday ? { holiday: t.holidays[holiday] } : {}),
    sunrise: clock(rise, t.clock),
    sunset: clock(set, t.clock),
    daylight: `${Math.floor(daylight / 60)} h ${daylight % 60} min`,
    moon: moonOn(year, month, day, locale),
  };
}

/** The page before: what hangs on the wall until someone tears it off. */
export function previousSheet(sheet: Sheet, locale: Locale) {
  const date = new Date(Date.UTC(sheet.year, sheet.month - 1, sheet.day) - DAY_MS);
  return sheetFor(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), locale);
}
