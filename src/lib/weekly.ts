import { caseKey, docket, getCases, VERDICTS, type Case } from "@/content/cases";
import { getRegions, regionFullName } from "@/content/regions";
import { getSpecies, type Species } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { Bulletin } from "./bulletin";
import { formatDayMonth, isoWeek } from "./calendar";
import type { VerdictCounts, Weekly } from "./community";
import { formatNumber, pct, plural, pluralSl, quote } from "./typo";

/*
 * Biuletyn tygodniowy: the last seven days, composed once for the page (/biuletyn) and for the
 * Monday email, in either edition. Every sentence reads well with zero as well as with thousands.
 */

const COPY = defineCopy({
  pl: {
    tests: (tests: number, average: number, clinical: number) =>
      `W tym tygodniu Instytut zbadał ${formatNumber("pl", tests)} ${plural(tests, "osobę", "osoby", "osób")}. Średni wynik: ${pct(average)}%, a ${formatNumber("pl", clinical)} ${plural(clinical, "wynik przekroczył", "wyniki przekroczyły", "wyników przekroczyło")} próg dziaderstwa klinicznego.`,
    noTests: "W tym tygodniu gabinety Instytutu stały puste. Personel odkurzył plansze Rorschacha i czeka.",
    diagnosed: (name: string) => `Najczęstsze rozpoznanie tygodnia: ${name}.`,
    noDiagnosed: "Żaden gatunek nie zdominował rozpoznań. Instytut uznaje to za tydzień zróżnicowany.",
    observed: (name: string, count: number, region?: string) =>
      `W terenie najczęściej widziano gatunek ${name} (${formatNumber("pl", count)} ${plural(count, "zgłoszenie", "zgłoszenia", "zgłoszeń")})${region ? `, a najczujniejsze było ${region}` : ""}.`,
    noObserved: "Sieć Obserwatorów Terenowych nie zgłosiła żadnej obserwacji. Teren był, obserwatorów zabrakło.",
    caseOfWeek: (item: Case, total: number) =>
      `Sprawa tygodnia w Komisji: ${quote(item.title, "pl")} (${docket(item)}), ${formatNumber("pl", total)} ${plural(total, "głos", "głosy", "głosów")} ławników.`,
    noCase: "Komisja Orzekająca obradowała bez ławników. Wokanda czeka.",
    index: (value: number, zone: string, alert: string) => `Narodowy Indeks Dziaderstwa wynosi ${pct(value)}%, natężenie ${zone}. ${alert}`,
    figures: {
      tests: (tests: number) => plural(tests, "badanie", "badania", "badań"),
      sightings: "obserwacji terenowych",
      verdicts: "głosów w Komisji",
      accounts: "nowych kartotek",
      pages: "zerwanych kartek z kalendarza",
      horn: "trąbnięć w próbie klaksonowej",
    },
    /** "Komunikat Instytutu": one per issue, by week number. */
    notices: [
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
    ],
  },
  sl: {
    tests: (tests: number, average: number, clinical: number) =>
      `Ta teden je Inštitut pregledal ${formatNumber("sl", tests)} ${pluralSl(tests, "osebo", "osebi", "osebe", "oseb")}. Povprečni rezultat: ${pct(average)} %, ${formatNumber("sl", clinical)} ${pluralSl(clinical, "rezultat pa je presegel", "rezultata pa sta presegla", "rezultati pa so presegli", "rezultatov pa je preseglo")} prag kliničnega dziaderstva.`,
    noTests: "Ta teden so ordinacije Inštituta samevale. Osebje je pobrisalo prah z Rorschachovih tabel in čaka.",
    diagnosed: (name: string) => `Najpogostejša diagnoza tedna: ${name}.`,
    noDiagnosed: "Nobena vrsta ni prevladala med diagnozami. Inštitut teden šteje za raznolik.",
    observed: (name: string, count: number, region?: string) =>
      `Na terenu je bil najpogosteje opažen ${name} (${formatNumber("sl", count)} ${pluralSl(count, "prijava", "prijavi", "prijave", "prijav")})${region ? `, najbolj budno pa je bilo ${region}` : ""}.`,
    noObserved: "Mreža terenskih opazovalcev ni prijavila nobenega opazovanja. Teren je bil, opazovalcev ni bilo.",
    caseOfWeek: (item: Case, total: number) =>
      `Primer tedna v Komisiji: ${quote(item.title, "sl")} (${docket(item)}), ${formatNumber("sl", total)} ${pluralSl(total, "glas", "glasova", "glasovi", "glasov")} porotnikov.`,
    noCase: "Razsodna komisija je zasedala brez porotnikov. Dnevni red čaka.",
    index: (value: number, zone: string, alert: string) => `Nacionalni indeks dziaderstva znaša ${pct(value)} %, jakost: ${zone}. ${alert}`,
    figures: {
      tests: (tests: number) => pluralSl(tests, "pregled", "pregleda", "pregledi", "pregledov"),
      sightings: "terenskih opazovanj",
      verdicts: "glasov v Komisiji",
      accounts: "novih kartotek",
      pages: "odtrganih listov s koledarja",
      horn: "pritiskov v preizkusu s hupo",
    },
    notices: [
      "Inštitut opominja, da se zimske gume menjajo oktobra, ne pa takrat, ko zapade sneg. Avtomobilski dziaders na to opominja že od avgusta.",
      "Zaradi kurilne sezone Inštitut beleži porast števila puloverjev, ki se izdajo družinskim članom, namesto da bi se odvil radiator.",
      "Razsodna komisija opominja, da porotnik o vsakem primeru glasuje enkrat. Spreminjanje mnenja je mogoče samo za družinsko mizo.",
      "Taksonomska sekcija pripravlja nove vrste. Prijave opazovanj delo pospešijo, priganjanje ne.",
      "Center za napovedi in opozorila napoveduje nadaljnjo rast Indeksa, bolj ko se bliža sveti večer. Napoved se uresničuje od začetka meritev.",
      "Inštitut opominja, da se list s koledarja odtrga zjutraj. Trganje listov na zalogo šteje za prehiter start.",
      "Ob koncu tedna je Inštitut zabeležil povečan promet pri samopostrežnih avtopralnicah. Vzroke ugotavlja Terenska sekcija, na kraju samem, z vedrom.",
      "Arhiv vokalizacij sprejema samo izjave, slišane na terenu. Izmišljene izjave sprejema svak.",
      "Mreža terenskih opazovalcev opominja: opazovalec gleda in prijavi. Komentira Okenski dziaders.",
      "Inštitut ne sprejema reklamacij izvidov Testa dziadersa. Sprejema pa izvide kontrolnega pregleda.",
      "Opominjamo, da daljinec ne preide samodejno na naslednjega družinskega člana. Predaja zahteva soglasje in naslonjač.",
      "Služba za statistiko se zahvaljuje vsem, ki so trobili v preizkusu s hupo. Sosedje se zahvaljujejo manj.",
    ],
  },
});

export type Issue = {
  week: number;
  year: number;
  /** "26 września – 2 października 2026", "26. september – 2. oktober 2026". */
  period: string;
  figures: { value: string; label: string }[];
  lines: string[];
  /** The case in the edition's language; votes are counted under its Polish key. */
  caseOfWeek?: { item: Case; counts: VerdictCounts; total: number };
  diagnosed?: Species;
  observed?: Species;
  notice: string;
};

const top = (counts: Record<string, number> | undefined, known: Map<string, Species>) =>
  Object.entries(counts ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])[0];

function periodEnding(year: number, month: number, day: number, locale: Locale) {
  const end = new Date(Date.UTC(year, month - 1, day) - 86_400_000);
  const start = new Date(end.getTime() - 6 * 86_400_000);
  const label = (date: Date) => formatDayMonth(date.getUTCMonth() + 1, date.getUTCDate(), locale);
  return `${label(start)} – ${label(end)} ${end.getUTCFullYear()}`;
}

export function composeIssue(weekly: Weekly | null, bulletin: Bulletin, today: { year: number; month: number; day: number }, locale: Locale): Issue {
  const t = COPY[locale];
  const known = new Map(getSpecies(locale).map((species) => [species.key as string, species]));
  const regions = getRegions(locale);
  const figure = (value: number | undefined | null) => (value ? formatNumber(locale, value) : "–");

  const week = isoWeek(today.year, today.month, today.day);
  const tallies = weekly?.tallies ?? {};
  const diagnosedEntry = top(weekly?.results.species, known);
  const observedEntry = top(weekly?.sightings.species, known);
  const region = Object.entries(weekly?.sightings.regions ?? {}).sort((a, b) => b[1] - a[1])[0];

  // Votes are kept under the Polish slugs, whatever the edition.
  const cases = getCases(locale)
    .map((item) => {
      const counts = weekly?.verdicts.cases[caseKey(item)] ?? {};
      return { item, counts, total: VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0) };
    })
    .sort((a, b) => b.total - a.total);
  const caseOfWeek = cases[0]?.total ? cases[0] : undefined;

  const tests = weekly?.results.total ?? 0;
  const lines = [
    tests ? t.tests(tests, weekly!.results.average, weekly!.results.clinical) : t.noTests,
    diagnosedEntry ? t.diagnosed(known.get(diagnosedEntry[0])!.name) : t.noDiagnosed,
    observedEntry
      ? t.observed(known.get(observedEntry[0])!.name, observedEntry[1], region && regions[region[0]] ? regionFullName(region[0], locale) : undefined)
      : t.noObserved,
    caseOfWeek ? t.caseOfWeek(caseOfWeek.item, caseOfWeek.total) : t.noCase,
    t.index(bulletin.index.value, bulletin.index.zone.label, bulletin.index.season.alert),
  ];

  return {
    week,
    year: today.year,
    period: periodEnding(today.year, today.month, today.day, locale),
    figures: [
      { value: figure(tests), label: t.figures.tests(tests) },
      { value: figure(weekly?.sightings.total), label: t.figures.sightings },
      { value: figure(weekly?.verdicts.total), label: t.figures.verdicts },
      { value: figure(weekly?.accounts), label: t.figures.accounts },
      { value: figure(tallies.kartka), label: t.figures.pages },
      { value: figure(tallies.klakson), label: t.figures.horn },
    ],
    lines,
    caseOfWeek,
    diagnosed: diagnosedEntry ? known.get(diagnosedEntry[0]) : undefined,
    observed: observedEntry ? known.get(observedEntry[0]) : undefined,
    notice: t.notices[week % t.notices.length],
  };
}
