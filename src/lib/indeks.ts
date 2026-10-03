import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { overlay, type Text } from "@/i18n/overlay";
import { dayOfYear, daysInYear, easterDay } from "./calendar";

/*
 * Narodowy Indeks Dziaderstwa (NID).
 * A seasonal baseline with peaks on the calendar's known risk dates,
 * plus deterministic daily noise, so every visitor sees the same number.
 */

export type Season = {
  from: [month: number, day: number];
  /** Nominative, as in "Sezon grillowy". */
  title: string;
  /** Genitive, as in "od początku sezonu grillowego". */
  name: string;
  level: 1 | 2 | 3;
  alert: string;
};

/** Polish text; use seasons(locale) in anything a reader sees. */
export const SEASONS: Season[] = [
  {
    from: [1, 1],
    title: "sezon „kiedyś to były zimy”",
    name: "sezonu „kiedyś to były zimy”",
    level: 1,
    alert: "Zwiększone ryzyko zdania „Kiedyś to były zimy”. Obecne opady śniegu nie mają znaczenia.",
  },
  {
    from: [3, 20],
    title: "sezon działkowy",
    name: "sezonu działkowego",
    level: 1,
    alert: "Otwarcie altan. Możliwe intensywne doradzanie sąsiadom w sprawie pomidorów.",
  },
  {
    from: [5, 1],
    title: "sezon grillowy",
    name: "sezonu grillowego",
    level: 2,
    alert: "Wysokie ryzyko przejęcia szczypiec. Nie podchodzić do rusztu bez zaproszenia.",
  },
  {
    from: [6, 21],
    title: "sezon parawanowy",
    name: "sezonu parawanowego",
    level: 3,
    alert: "Parawany rozstawiane od 6:30. Na pasie nadmorskim zachować szczególną czujność.",
  },
  {
    from: [9, 1],
    title: "sezon grzybowy",
    name: "sezonu grzybowego",
    level: 1,
    alert: "Zwiększona częstotliwość wypowiedzi „Ja te miejsca znam od czterdziestu lat”.",
  },
  {
    from: [10, 15],
    title: "sezon wymiany opon",
    name: "sezonu wymiany opon",
    level: 2,
    alert: "Kolejki do wulkanizacji. Spodziewane: „Ja zawsze zmieniam przed pierwszym przymrozkiem”.",
  },
  {
    from: [12, 6],
    title: "sezon świąteczny",
    name: "sezonu świątecznego",
    level: 3,
    alert: "Zbliża się Wigilia. Prognozowane dyskusje przy stole. Zaleca się omijanie tematów.",
  },
];

/** The Slovenian seasons, in the order of SEASONS. */
const SEASONS_SL: Text<Season>[] = [
  {
    title: "sezona »včasih so bile prave zime«",
    name: "sezone »včasih so bile prave zime«",
    alert: "Povečano tveganje izjave »Včasih so bile prave zime«. Dejanske snežne padavine niso pomembne.",
  },
  {
    title: "vrtičkarska sezona",
    name: "vrtičkarske sezone",
    alert: "Odpiranje vrtnih ut. Možno intenzivno svetovanje sosedom glede paradižnika.",
  },
  {
    title: "sezona žara",
    name: "sezone žara",
    alert: "Visoko tveganje prevzema klešč. Žaru se ne približevati brez povabila.",
  },
  {
    title: "sezona vetrobranov",
    name: "sezone vetrobranov",
    alert: "Vetrobrani se postavljajo od 6.30. Na obalnem pasu je potrebna posebna previdnost.",
  },
  {
    title: "gobarska sezona",
    name: "gobarske sezone",
    alert: "Povečana pogostost izjave »Jaz ta mesta poznam že štirideset let«.",
  },
  {
    title: "sezona menjave pnevmatik",
    name: "sezone menjave pnevmatik",
    alert: "Vrste pri vulkanizerjih. Pričakovano: »Jaz vedno zamenjam pred prvim mrazom«.",
  },
  {
    title: "praznična sezona",
    name: "praznične sezone",
    alert: "Bliža se sveti večer. Napovedane so razprave za mizo. Priporoča se izogibanje temam.",
  },
];

const SEASON_EDITIONS: Record<Locale, Season[]> = { pl: SEASONS, sl: overlay(SEASONS, SEASONS_SL, "seasons") };

/** The seasons with the edition's names and alerts. */
export const seasons = (locale: Locale) => SEASON_EDITIONS[locale];

/** Polish labels; use zones(locale) in anything a reader sees. */
export const ZONES = [
  { from: 0, to: 25, label: "śladowe" },
  { from: 25, to: 50, label: "umiarkowane" },
  { from: 50, to: 75, label: "podwyższone" },
  { from: 75, to: 100, label: "kliniczne" },
] as const;

export type Zone = { from: number; to: number; label: string };

/** Slovenian labels in the order of ZONES: adjectives for "jakost", which is feminine. */
const ZONE_LABELS_SL = ["sledna", "zmerna", "povišana", "klinična"];

const ZONE_EDITIONS: Record<Locale, Zone[]> = {
  pl: [...ZONES],
  sl: ZONES.map((zone, i) => ({ ...zone, label: ZONE_LABELS_SL[i] })),
};

/** The warning zones of the index with the edition's labels. */
export const zones = (locale: Locale) => ZONE_EDITIONS[locale];

type MilestoneKey = "easter" | "may" | "screens" | "tyres" | "christmas";

export type Milestone = {
  key: MilestoneKey;
  at: number;
  label: string;
  note: string;
  /** Label row in the chart, to keep neighbours from colliding. */
  row: 0 | 1;
  /** Hidden on narrow screens. */
  minor?: boolean;
};

const MILESTONES = defineCopy<Record<MilestoneKey, Pick<Milestone, "label" | "note">>>({
  pl: {
    easter: { label: "Wielkanoc", note: "spór o chrzan" },
    may: { label: "Majówka", note: "otwarcie sezonu grillowego" },
    screens: { label: "Szczyt parawanowy", note: "pas nadmorski" },
    tyres: { label: "Wymiana opon", note: "kolejki do wulkanizacji" },
    christmas: { label: "Wigilia", note: "dyskusje przy stole" },
  },
  sl: {
    easter: { label: "Velika noč", note: "spor o hren" },
    may: { label: "Prvomajski vikend", note: "začetek sezone žara" },
    screens: { label: "Vrhunec vetrobranov", note: "obalni pas" },
    tyres: { label: "Menjava pnevmatik", note: "vrste pri vulkanizerjih" },
    christmas: { label: "Sveti večer", note: "razprave za mizo" },
  },
});

type Bump = { at: number; height: number; width: number };

const BASELINE = 63.5;

function calendar(year: number) {
  const on = (month: number, day: number) => dayOfYear(year, month, day);
  const total = daysInYear(year);

  const bumps: Bump[] = [
    { at: 0, height: 5, width: 4 }, // Nowy Rok
    { at: easterDay(year), height: 5, width: 3 },
    { at: on(5, 2), height: 9, width: 6 },
    { at: on(7, 5), height: 3, width: 45 }, // lato
    { at: on(7, 20), height: 7, width: 14 },
    { at: on(9, 22), height: 4, width: 12 }, // grzybobranie
    { at: on(10, 24), height: 6, width: 10 },
    { at: on(11, 1), height: 3, width: 2 },
    { at: on(12, 24), height: 14, width: 4 },
    { at: total, height: 5, width: 4 }, // Sylwester
  ];

  const milestones: Omit<Milestone, "label" | "note">[] = [
    { key: "easter", at: easterDay(year), row: 1, minor: true },
    { key: "may", at: on(5, 2), row: 0 },
    { key: "screens", at: on(7, 20), row: 1 },
    { key: "tyres", at: on(10, 24), row: 0 },
    { key: "christmas", at: on(12, 24), row: 1 },
  ];

  return { bumps, milestones };
}

function hash01(input: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 0x1_0000_0000;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Expected value for a day, without noise. Used for the forecast. */
export function trend(year: number, day: number) {
  const { bumps } = calendar(year);
  const drift = 0.7 * Math.sin(day / 11) + 0.5 * Math.sin(day / 29 + 1);
  const value = bumps.reduce((sum, bump) => {
    const distance = day - bump.at;
    return sum + bump.height * Math.exp(-(distance * distance) / (2 * bump.width * bump.width));
  }, BASELINE + drift);
  return round1(value);
}

/** "Measured" value: trend plus daily noise, and hourly noise when an hour is given. */
export function measured(year: number, day: number, hour?: number) {
  let value = trend(year, day) + (hash01(`${year}:${day}`) - 0.5) * 1.4;
  if (hour !== undefined) value += (hash01(`${year}:${day}:${hour}`) - 0.5) * 0.5;
  return round1(Math.min(100, Math.max(0, value)));
}

export function milestones(year: number, locale: Locale): Milestone[] {
  return calendar(year).milestones.map((milestone) => ({ ...milestone, ...MILESTONES[locale][milestone.key] }));
}

export function seasonFor(month: number, day: number, locale: Locale) {
  const all = seasons(locale);
  return all.findLast(({ from: [m, d] }) => month > m || (month === m && day >= d)) ?? all[0];
}

export function zoneFor(value: number, locale: Locale) {
  const all = zones(locale);
  return all.find((zone) => value < zone.to) ?? all[all.length - 1];
}
