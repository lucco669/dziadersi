import { dayOfYear, daysInYear, easterDay, isoWeek, warsawTime } from "./calendar";

/*
 * The front of a tear-off calendar page: the date, sunrise and sunset in Warsaw, the moon,
 * days to Christmas Eve and whether the number is printed in red (Sunday or a day off work).
 * Pure arithmetic, so the server and the browser agree.
 */

const MONTHS = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
const MONTHS_GENITIVE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const WEEKDAYS = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];

/** Fixed days off work in Poland, "MM-DD"; 24 December since 2025. Moving ones come from Easter. */
const DAYS_OFF = ["01-01", "01-06", "05-01", "05-03", "08-15", "11-01", "11-11", "12-24", "12-25", "12-26"];

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
  /** "października": for dates in a sentence. */
  monthGenitive: string;
  /** "2 października 2026". */
  date: string;
  weekday: string;
  /** 1 January is day 1. */
  dayOfYear: number;
  daysLeft: number;
  week: number;
  toChristmasEve: number;
  red: boolean;
  dayOff: boolean;
  sunrise: string;
  sunset: string;
  /** "11 h 29 min". */
  daylight: string;
  moon: Moon;
};

const pad = (value: number) => String(value).padStart(2, "0");
const clock = (minutes: number) => `${Math.floor(minutes / 60)}:${pad(Math.round(minutes % 60) % 60)}`;

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

export function moonOn(year: number, month: number, day: number): Moon {
  const age = ((((Date.UTC(year, month - 1, day, 12) - NEW_MOON) / DAY_MS) % SYNODIC) + SYNODIC) % SYNODIC;
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2) * 100);
  const name =
    age < 1.85 || age >= 27.68
      ? "nów"
      : age < 5.54
        ? "przybywa"
        : age < 9.23
          ? "pierwsza kwadra"
          : age < 12.92
            ? "przybywa"
            : age < 16.61
              ? "pełnia"
              : age < 20.3
                ? "ubywa"
                : age < 23.99
                  ? "ostatnia kwadra"
                  : "ubywa";
  return { name, age, illumination, waxing: age < SYNODIC / 2 };
}

export function isDayOff(year: number, month: number, day: number) {
  if (DAYS_OFF.includes(`${pad(month)}-${pad(day)}`)) return true;
  const easter = easterDay(year);
  const today = dayOfYear(year, month, day);
  // Easter Sunday and Monday, Pentecost (+49) and Corpus Christi (+60).
  return [easter, easter + 1, easter + 49, easter + 60].includes(today);
}

export function sheetFor(year: number, month: number, day: number): Sheet {
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekdayIndex = (date.getUTCDay() + 6) % 7;
  const doy = dayOfYear(year, month, day) + 1;
  const eve = Date.UTC(year, 11, 24);
  const nextEve = date.getTime() > eve ? Date.UTC(year + 1, 11, 24) : eve;
  const { rise, set } = sun(year, month, day);
  const daylight = Math.round(set - rise);
  const dayOff = isDayOff(year, month, day);
  return {
    key: `${year}-${pad(month)}-${pad(day)}`,
    year,
    month,
    day,
    monthName: MONTHS[month - 1],
    monthGenitive: MONTHS_GENITIVE[month - 1],
    date: `${day} ${MONTHS_GENITIVE[month - 1]} ${year}`,
    weekday: WEEKDAYS[weekdayIndex],
    dayOfYear: doy,
    daysLeft: daysInYear(year) - doy,
    week: isoWeek(year, month, day),
    toChristmasEve: Math.round((nextEve - date.getTime()) / DAY_MS),
    red: weekdayIndex === 6 || dayOff,
    dayOff,
    sunrise: clock(rise),
    sunset: clock(set),
    daylight: `${Math.floor(daylight / 60)} h ${daylight % 60} min`,
    moon: moonOn(year, month, day),
  };
}

/** The page before: what hangs on the wall until someone tears it off. */
export function previousSheet(sheet: Sheet) {
  const date = new Date(Date.UTC(sheet.year, sheet.month - 1, sheet.day) - DAY_MS);
  return sheetFor(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}
