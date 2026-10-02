import { CASES, docket, VERDICTS, type Case } from "@/content/cases";
import { REGIONS } from "@/content/regions";
import { SPECIES, type Species } from "@/content/species";
import type { Bulletin } from "./bulletin";
import { isoWeek } from "./calendar";
import type { VerdictCounts, Weekly } from "./community";
import { pct, plural } from "./typo";

/*
 * Biuletyn tygodniowy: the last seven days, composed once for the page (/biuletyn) and for the
 * Monday email. Every sentence reads well with zero as well as with thousands.
 */

const MONTHS_GENITIVE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const number = new Intl.NumberFormat("pl-PL");
const known = new Map(SPECIES.map((species) => [species.key as string, species]));

/** "Komunikat Instytutu": one per issue, by week number. */
const NOTICES = [
  "Instytut przypomina, że opony zimowe zmienia się w październiku, a nie wtedy, kiedy spadnie śnieg. Dziaders Motoryzacyjny przypomina o tym od sierpnia.",
  "W związku z sezonem grzewczym Instytut odnotowuje wzrost liczby swetrów wydawanych domownikom zamiast regulacji kaloryfera.",
  "Komisja Orzekająca przypomina, że ławnik głosuje raz w sprawie. Zmiana zdania jest możliwa wyłącznie przy rodzinnym stole.",
  "Pracownia Taksonomii prowadzi prace nad kolejnymi gatunkami. Zgłoszenia obserwacji przyspieszają prace, ponaglenia nie.",
  "Ośrodek Prognoz i Ostrzeżeń przewiduje dalszy wzrost Indeksu w miarę zbliżania się Wigilii. Prognoza sprawdza się od początku pomiarów.",
  "Instytut przypomina, że kartkę z kalendarza zrywa się rano. Zrywanie kartek na zapas uznaje się za falstart.",
  "W weekend Instytut odnotował wzmożony ruch przy myjniach samoobsługowych. Przyczyny ustala Pracownia Terenowa, na miejscu, z wiadrem.",
  "Archiwum Wokalizacji przyjmuje wyłącznie wypowiedzi usłyszane w terenie. Wypowiedzi wymyślone przyjmuje szwagier.",
  "Sieć Obserwatorów Terenowych przypomina: obserwator patrzy i zgłasza. Komentuje Dziaders Parapetowy.",
  "Instytut nie przyjmuje reklamacji wyników Testu Dziadersa. Przyjmuje za to wyniki badania kontrolnego.",
  "Przypominamy, że pilot od telewizora nie przechodzi na kolejnych domowników automatycznie. Przekazanie wymaga zgody i fotela.",
  "Dział Statystyki dziękuje wszystkim, którzy trąbili w próbie klaksonowej. Sąsiedzi dziękują mniej.",
];

export type Issue = {
  week: number;
  year: number;
  /** "26 września – 2 października 2026". */
  period: string;
  figures: { value: string; label: string }[];
  lines: string[];
  caseOfWeek?: { item: Case; counts: VerdictCounts; total: number };
  diagnosed?: Species;
  observed?: Species;
  notice: string;
};

const top = (counts: Record<string, number> | undefined) =>
  Object.entries(counts ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])[0];

const figure = (value: number | undefined | null) => (value ? number.format(value) : "–");

function periodEnding(year: number, month: number, day: number) {
  const end = new Date(Date.UTC(year, month - 1, day) - 86_400_000);
  const start = new Date(end.getTime() - 6 * 86_400_000);
  const label = (date: Date) => `${date.getUTCDate()} ${MONTHS_GENITIVE[date.getUTCMonth()]}`;
  return `${label(start)} – ${label(end)} ${end.getUTCFullYear()}`;
}

export function composeIssue(weekly: Weekly | null, bulletin: Bulletin, today: { year: number; month: number; day: number }): Issue {
  const week = isoWeek(today.year, today.month, today.day);
  const tallies = weekly?.tallies ?? {};
  const diagnosedEntry = top(weekly?.results.species);
  const observedEntry = top(weekly?.sightings.species);
  const region = Object.entries(weekly?.sightings.regions ?? {}).sort((a, b) => b[1] - a[1])[0];

  const cases = CASES.map((item) => {
    const counts = weekly?.verdicts.cases[item.slug] ?? {};
    return { item, counts, total: VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0) };
  }).sort((a, b) => b.total - a.total);
  const caseOfWeek = cases[0]?.total ? cases[0] : undefined;

  const tests = weekly?.results.total ?? 0;
  const lines = [
    tests
      ? `W tym tygodniu Instytut zbadał ${number.format(tests)} ${plural(tests, "osobę", "osoby", "osób")}. Średni wynik: ${pct(weekly!.results.average)}%, a ${number.format(weekly!.results.clinical)} ${plural(weekly!.results.clinical, "wynik przekroczył", "wyniki przekroczyły", "wyników przekroczyło")} próg dziaderstwa klinicznego.`
      : "W tym tygodniu gabinety Instytutu stały puste. Personel odkurzył plansze Rorschacha i czeka.",
    diagnosedEntry
      ? `Najczęstsze rozpoznanie tygodnia: ${known.get(diagnosedEntry[0])!.name}.`
      : "Żaden gatunek nie zdominował rozpoznań. Instytut uznaje to za tydzień zróżnicowany.",
    observedEntry
      ? `W terenie najczęściej widziano gatunek ${known.get(observedEntry[0])!.name} (${number.format(observedEntry[1])} ${plural(observedEntry[1], "zgłoszenie", "zgłoszenia", "zgłoszeń")})${region ? `, a najczujniejsze było województwo ${REGIONS[region[0]]?.name.toLowerCase()}` : ""}.`
      : "Sieć Obserwatorów Terenowych nie zgłosiła żadnej obserwacji. Teren był, obserwatorów zabrakło.",
    caseOfWeek
      ? `Sprawa tygodnia w Komisji: „${caseOfWeek.item.title}” (${docket(caseOfWeek.item)}), ${number.format(caseOfWeek.total)} ${plural(caseOfWeek.total, "głos", "głosy", "głosów")} ławników.`
      : "Komisja Orzekająca obradowała bez ławników. Wokanda czeka.",
    `Narodowy Indeks Dziaderstwa wynosi ${pct(bulletin.index.value)}%, natężenie ${bulletin.index.zone.label}. ${bulletin.index.season.alert}`,
  ];

  return {
    week,
    year: today.year,
    period: periodEnding(today.year, today.month, today.day),
    figures: [
      { value: figure(tests), label: plural(tests, "badanie", "badania", "badań") },
      { value: figure(weekly?.sightings.total), label: "obserwacji terenowych" },
      { value: figure(weekly?.verdicts.total), label: "głosów w Komisji" },
      { value: figure(weekly?.accounts), label: "nowych kartotek" },
      { value: figure(tallies.kartka), label: "zerwanych kartek z kalendarza" },
      { value: figure(tallies.klakson), label: "trąbnięć w próbie klaksonowej" },
    ],
    lines,
    caseOfWeek,
    diagnosed: diagnosedEntry ? known.get(diagnosedEntry[0]) : undefined,
    observed: observedEntry ? known.get(observedEntry[0]) : undefined,
    notice: NOTICES[week % NOTICES.length],
  };
}
