import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SignLine, Threshold } from "@/components/conventional-sign";
import { IsoKey, IsoRow, isoUnit, type IsoKind } from "@/components/isotype";
import { breadcrumbList, DataLicense, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Figure, SpeciesPlate } from "@/components/pictograms";
import { OCCASIONS } from "@/content/bingo";
import { CASES, docket, getCases, getVerdicts, VERDICTS } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { getRegions, REGION_GRID } from "@/content/regions";
import { REPORTS } from "@/content/reports";
import { ESTIMATED_SPECIES, getSpecies, SPECIES, type SpeciesKey } from "@/content/species";
import { STATIONS, TASKS } from "@/content/test";
import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { getCensus, MIN_RESULTS } from "@/lib/census";
import { getCommunity } from "@/lib/community";
import { TOTAL_LINES } from "@/lib/phrasebook";
import { absoluteUrl, dataset, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, formatDate, formatNumber, pct, plural, pluralSl, typo } from "@/lib/typo";

const decimals = Object.fromEntries(
  LOCALES.map((locale) => [locale, new Intl.NumberFormat(LOCALE_INFO[locale].intl, { maximumFractionDigits: 1 })]),
) as Record<Locale, Intl.NumberFormat>;

/** A number with its noun in the right form; Polish takes the genitive singular after a fraction ("2,5 godziny"). */
function countedPl(value: number, one: string, few: string, many: string, fraction: string) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${formatNumber("pl", rounded)} ${plural(rounded, one, few, many)}`
    : `${decimals.pl.format(rounded)} ${fraction}`;
}

/** The same in Slovenian: four forms with the dual, and the genitive singular after a fraction ("2,5 ure"). */
function countedSl(value: number, one: string, two: string, few: string, other: string, fraction: string) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${formatNumber("sl", rounded)} ${pluralSl(rounded, one, two, few, other)}`
    : `${decimals.sl.format(rounded)} ${fraction}`;
}

const COPY = defineCopy({
  pl: {
    title: "Mały Rocznik Statystyczny",
    metaTitle: (year: number) => `Mały Rocznik Statystyczny ${year}: dziaderstwo w Polsce w liczbach`,
    heading: (year: number) => `Mały Rocznik Statystyczny ${year}`,
    description:
      "Mały Rocznik Statystyczny Dziaderstwa: badania, obserwacje, orzeczenia, bingo, Rozmówki i trąbienia klaksonem. Na żywo, z przeliczeniem na rosoły.",
    shareDescription: "Badania, obserwacje, orzeczenia i trąbienia klaksonem. Z przeliczeniem na rosoły.",
    variables: ["Badania", "Obserwacje terenowe", "Orzeczenia", "Wypowiedzi z Rozmówek", "Skreślenia w bingo", "Trąbienia klaksonem"],
    cover: { label: "Rys. Stos roczników statystycznych i dziaders, który je czytał", spine: "MAŁY ROCZNIK" },
    lead: "Wszystko, co Instytut policzył od otwarcia: badania, obserwacje, orzeczenia, skreślenia w bingo i trąbienia klaksonem. Dane z Narodowego Spisu, Sieci Obserwatorów Terenowych, Komisji Orzekającej i liczników w pomocach naukowych.",
    metaBefore: (year: number) => `Rocznik ${year} · Stan na `,
    notGus: {
      before: "Nie mylić z „Małym Rocznikiem Statystycznym Polski”, wydawanym przez GUS: oficjalne dane o kraju są na ",
      after: ". Tutaj policzono wyłącznie dziaderstwo.",
    },
    metaAfter: " · aktualizacja co kilka minut",
    contents: "Działy Rocznika",
    chapters: ["Zbiory Instytutu", "Narodowy Indeks Dziaderstwa", "Przeliczenia Instytutu", "Badania", "Obserwacje terenowe", "Komisja Orzekająca", "Pomoce naukowe", "Województwa i pory roku", "Pytania o Rocznik", "Objaśnienia znaków umownych"],
    table: (index: number) => `Tabl. ${index}.`,
    chart: (index: number) => `Wykres ${index}.`,
    source: "Źródło: IBD.",
    noData: "· Brak informacji.",
    clock: (hour: number) => `${hour}:00`,
    zones: ["Śladowe", "Umiarkowane", "Podwyższone", "Kliniczne"],
    units: {
      hours: (n: number) => countedPl(n, "godzina", "godziny", "godzin", "godziny"),
      broths: (n: number) => countedPl(n, "rosół", "rosoły", "rosołów", "rosołu"),
      sightings: (n: number) => countedPl(n, "zgłoszenie", "zgłoszenia", "zgłoszeń", "zgłoszenia"),
      votes: (n: number) => countedPl(n, "głos", "głosy", "głosów", "głosu"),
    },
    tests: {
      title: "Dział IV. Badania",
      aside: "Źródło: Narodowy Spis Dziadersów",
      total: "Badań ogółem",
      today: "W tym dziś",
      average: "Średni wynik",
      proxy: "Wywiady rodzinne",
      proxyNote: "badań",
      retakes: "Powtórki",
      retakeNote: (change: string) => `śr. zmiana ${change} pkt`,
      averageNote: `od ${MIN_RESULTS} badań`,
      empty: "Zjawisko nie wystąpiło. Pierwsze badanie trafi do tego działu w ciągu kilku minut.",
      action: "Wykonaj test",
      hybrids: "Krzyżówki",
      time: "Czas spędzony w gabinetach Instytutu",
      timeUnknown: "Brak informacji: Spis jest chwilowo nieczynny.",
      timeTotal: (hours: string, broths: string) => `Łącznie ${hours} badań, czyli ${broths} w jednostkach niedzielnych.`,
      potKey: (unit: number) =>
        `1 garnek = ${formatNumber("pl", unit)} ${plural(unit, "rosół", "rosoły", "rosołów")}, czyli ${formatNumber("pl", unit * 3)} godz. badań`,
      table: "Zbadani według natężenia dziaderstwa",
      tableSource: "Źródło: Narodowy Spis Dziadersów, IBD.",
      tooFew: `Rozkłady publikuje się od ${MIN_RESULTS} wyników. Wcześniej mówiłyby więcej o konkretnym wujku niż o społeczeństwie.`,
      progress: (n: number) => `Badania do pierwszej publikacji rozkładów: ${n} z ${MIN_RESULTS}.`,
      census: "Pełne wyniki: Narodowy Spis Dziadersów",
    },
    observations: {
      title: "Dział V. Obserwacje terenowe",
      aside: "Źródło: Sieć Obserwatorów Terenowych",
      total: "Zgłoszeń",
      today: "W tym dziś",
      observers: "Obserwatorów",
      perObserver: "Na obserwatora",
      perObserverNote: "zgłoszeń",
      species: "Gatunki zaobserwowane",
      of: (n: number) => `z ${n}`,
      regions: "Województwa",
      table: "Gatunki najczęściej obserwowane",
      tableSource: "Źródło: zgłoszenia z Profili Dziaderskich, IBD.",
      collapsed: "Zjawisko nie wystąpiło. Zgłoszenia przyjmuje strona każdego gatunku w Atlasie: jedno kliknięcie, jeśli masz Profil Dziaderski.",
      unknown: "Brak informacji. Sieć Obserwatorów jest chwilowo nieczynna.",
      action: "Do Atlasu",
      chart: "O której Polacy widzą dziadersa",
      peak: (hour: number, remark: string) => `Najwięcej zgłoszeń o godzinie ${hour}:00. ${remark}`,
      evening: "Wtedy wraca się z pracy i widać cały parking.",
      morning: "Wtedy dziaders myje samochód i jest dobrze widoczny.",
      midday: "O tej porze dziaders jest w szczytowej formie, a obserwator ma przerwę.",
      chartSource: "Źródło: IBD. Liczba zgłoszeń według godziny, czas warszawski.",
      key: (unit: number) => `1 lornetka = ${formatNumber("pl", unit)} ${plural(unit, "zgłoszenie", "zgłoszenia", "zgłoszeń")}`,
    },
    commission: {
      title: "Dział VI. Komisja Orzekająca",
      aside: "Źródło: akta Komisji",
      votes: "Głosów ławników",
      jurors: "Ławnicy z profilem",
      cases: "Spraw na wokandzie",
      agreement: "Zgodność z Komisją",
      clinical: "Orzeczeń „kliniczne”",
      ofVotes: "głosów",
      submissions: "Zgłoszeń spraw",
      submissionsNote: "w sekretariacie",
      table: "Głosy ławników według rodzaju orzeczenia",
      none: "Zjawisko nie wystąpiło. Wokanda czeka na ławników.",
      unknown: "Brak informacji. Sekretariat Komisji jest chwilowo nieczynny.",
      key: (unit: number) => `1 młotek = ${formatNumber("pl", unit)} ${plural(unit, "głos", "głosy", "głosów")}`,
      disputed: "Sprawa najbardziej sporna",
      unanimous: "Sprawa najbardziej jednomyślna",
      tooFew: "Sprawę najbardziej sporną i najbardziej jednomyślną Komisja wskazuje od pięciu głosów w sprawie.",
      link: "Do Komisji",
    },
    aids: {
      title: "Dział VII. Pomoce naukowe",
      aside: "Źródło: liczniki Instytutu",
      table: "Użycie pomocy naukowych",
      tableSource: "Źródło: IBD. Liczniki bez identyfikatorów, od 2 października 2026.",
      empty: "Zjawisko nie wystąpiło. Liczniki czekają na pierwszą wypowiedź wylosowaną w Rozmówkach.",
      unknown: "Brak informacji. Liczniki są chwilowo nieczynne.",
      action: "Do Rozmówek",
      rows: [
        "Rozmówki dziaderskie",
        "wylosowane wypowiedzi",
        "odczytane na głos",
        "zachowane w profilach",
        "Dziaders Bingo",
        "wylosowane karty",
        "skreślone pola",
        "okrzyki „Bingo!”",
        "Egzamin terenowy",
        "zdawane egzaminy",
        "zachowane w profilach",
        "Test Dziadersa",
        "trąbnięcia w próbie klaksonowej",
        "pobrane certyfikaty i wyniki",
        "udostępnienia",
        "Superinteligencja",
        "zadane pytania",
        "odpowiedzi wygenerowane ponownie (bez zmian)",
      ],
      pictures: {
        horn: {
          label: "Trąbnięcia w próbie klaksonowej",
          key: (unit: number) => `1 klakson = ${formatNumber("pl", unit)} ${plural(unit, "trąbnięcie", "trąbnięcia", "trąbnięć")}`,
        },
        bubble: {
          label: "Wypowiedzi z Rozmówek",
          key: (unit: number) => `1 dymek = ${formatNumber("pl", unit)} ${plural(unit, "wypowiedź", "wypowiedzi", "wypowiedzi")}`,
        },
        cross: {
          label: "Pola skreślone w bingo",
          key: (unit: number) => `1 krzyżyk = ${formatNumber("pl", unit)} ${plural(unit, "pole", "pola", "pól")}`,
        },
        exam: {
          label: "Egzaminy terenowe",
          key: (unit: number) => `1 arkusz = ${formatNumber("pl", unit)} ${plural(unit, "egzamin", "egzaminy", "egzaminów")}`,
        },
      },
    },
    collections: {
      title: "Dział I. Zbiory Instytutu",
      aside: "Stan zbiorów",
      species: "Gatunki w Atlasie",
      speciesNote: (nationwide: number, regional: number, occasional: number) =>
        `${nationwide} ogólnopolskich · ${regional} regionalnych · ${occasional} okazjonalnych`,
      entries: "Hasła w Słowniku",
      entriesNote: (words: string) => `${words} słów definicji`,
      reports: "Raporty",
      cases: "Sprawy Komisji",
      squares: "Pola bingo",
      squaresNote: (occasions: number) => `${occasions} okazji`,
      lines: "Wypowiedzi w Rozmówkach",
      linesNote: "możliwych kombinacji",
      atlas: (described: number, estimated: number, percent: number, year: number) =>
        `Atlas opisuje ${described} z około ${estimated} gatunków występujących w Polsce, czyli ${percent}%. Przy obecnym tempie prac Pracowni Taksonomii komplet zostanie opisany w roku ${year}. Pracownia uważa, że wcześniej, ale tak samo mówiła o remoncie łazienki.`,
      test: (tasks: number, stations: number, species: number) =>
        `Test Dziadersa ma ${tasks} zadań w ${stations} gabinetach. Egzamin terenowy losuje 12 pytań z ${species} gatunków i 7 rodzajów wskazówek, co daje więcej wariantów, niż Instytut potrafi policzyć bez kalkulatora z drukarką.`,
    },
    index: {
      title: "Dział II. Narodowy Indeks Dziaderstwa",
      aside: "Źródło: model sezonowy Instytutu",
      today: "Indeks dziś",
      season: "Zmiana w sezonie",
      seasonNote: (name: string) => `od początku ${name}`,
      points: (n: string) => `${n} pkt`,
      peak: "Szczyt roku dotąd",
      low: "Minimum roku dotąd",
      average: "Średnia roku dotąd",
      forecast: "Szczyt prognozy",
      forecastNote: "do końca roku",
      text: "Indeks liczy się sam, codziennie, z modelu sezonowego Instytutu. Dlatego ten dział nigdy nie jest pusty.",
      link: "Wykres roczny, sezony i metodologia",
    },
    conversions: {
      title: "Dział III. Przeliczenia Instytutu",
      aside: "Dane szacunkowe",
      intro: "Liczby z pozostałych działów w jednostkach, które rozumie cała rodzina. Metodologia pod każdą pozycją.",
      method: "Metodologia:",
      table: {
        value: (n: number) => countedPl(n, "osoba", "osoby", "osób", "osoby"),
        label: "przy wigilijnym stole na 12 nakryć wykazuje dziś objawy, według dzisiejszego Indeksu",
        method: "Instytut liczy 12 nakryć razem z dodatkowym dla zbłąkanego wędrowca. Wędrowiec też bywa dziadersem.",
      },
      toasts: {
        value: (n: number) => countedPl(n, "toast", "toasty", "toastów", "toastu"),
        label: "tyle trwa Słownik Dziaderski przeczytany na głos przy stole, z definicjami",
        method: (words: string) => `${words} słów definicji tempem toastu: wujek mówi 120 słów na minutę, toast trwa 3 minuty, licząc „no to chlup”.`,
      },
      bingo: {
        label: "trwałyby wszystkie pola bingo, gdyby każde opowiedział wujek",
        method: "Instytut przyjmuje 4 minuty na pole: tyle trwa opowieść, którą pole opisuje. Wesele trwa 14 godzin, więc na oczepiny już nie starczy.",
      },
      skipped: (names: string) => `Pozostałych przeliczeń nie wykonano, bo zjawisko nie wystąpiło: ${names}.`,
      names: { mustache: "wąs", broths: "rosoły", honks: "klaksony", weddings: "wesela", uncles: "wujkowie", fridges: "lodówki", drawer: "szuflady", pool: "pula Rozmówek" },
      mustache: {
        label: "wąsa łącznie, gdyby wąsy wszystkich zbadanych ułożyć w jednej linii",
        method: (passats: string) => `Instytut przyjmuje 7 cm wąsa na osobę badaną, także u osób bez wąsów. To ${passats} długości Passata kombi.`,
      },
      broths: {
        label: "tyle trwały wszystkie badania w gabinetach Instytutu",
        method: "Badanie trwa około 4 minut. Rosół, jednostka czasu niedzielnego, gotuje się 3 godziny na małym ogniu.",
      },
      honks: {
        label: "nieprzerwanego trąbienia, gdyby wszystkie klaksony z próby klaksonowej nacisnąć po kolei",
        method: "Jedno trąbnięcie trwa średnio 0,6 sekundy. Zielone światło na skrzyżowaniu trwa 30 sekund, więc większość trąbień zmieściłaby się na jednym, przy dobrej organizacji.",
      },
      weddings: {
        value: (n: number) => countedPl(n, "wesele", "wesela", "wesel", "wesela"),
        label: "trzeba by przegadać, żeby powiedzieć przy stole wszystko, co wylosowały Rozmówki",
        method: "Wypowiedź trwa około 9 sekund, wesele 14 godzin. Poprawiny liczone osobno.",
      },
      uncles: {
        label: "tylu wujków skreślono w Dziaders Bingo",
        method: "Instytut przyjmuje, że co trzecie skreślone pole dotyczy wujka. Pozostałe dotyczą szwagra.",
      },
      fridges: {
        value: (n: number) => countedPl(n, "lodówki", "lodówek", "lodówek", "lodówki"),
        label: "potrzeba, żeby przypiąć magnesem do drzwi wszystkie pobrane certyfikaty",
        method: "Na drzwiach przeciętnej lodówki mieści się 12 certyfikatów, licząc zaproszenie na komunię kuzyna jako jeden.",
      },
      drawer: {
        label: "szuflady ze wszystkim zajęłyby kartoteki Profilu Dziaderskiego, wydrukowane",
        method: "Do szuflady mieści się 340 kartotek, po wyjęciu gumek recepturek, baterii i instrukcji do tostera z 1998 roku.",
      },
      pool: {
        label: (lines: string) => `rok, w którym Rozmówki wyczerpią pulę ${lines} wypowiedzi`,
        method: "Przy obecnym tempie losowania i pod warunkiem, że nikt nie wylosuje dwa razy tej samej. Wujek wylosuje.",
      },
    },
    territory: {
      title: "Dział VIII. Województwa i pory roku",
      aside: "Dane stałe",
      intro: "Dziaderstwo w przekroju terytorialnym i kalendarzowym. Indeks według województw pochodzi z Narodowego Indeksu Dziaderstwa, kalendarz aktywności z kart gatunków w Atlasie.",
      regions: "Województwa: indeks dziaderstwa i gatunek dominujący",
      regionsHead: ["Województwo", "Indeks", "Gatunek dominujący", "Uwagi z terenu"],
      regionsSource: "Źródło: Narodowy Indeks Dziaderstwa (osoby z objawami na 100 mieszkańców, szacunek IBD), Atlas Dziadersów.",
      months: "Aktywność gatunków według miesięcy",
      monthsHead: ["Miesiąc", "Gatunki aktywne", "W szczycie", "Gatunki w szczycie aktywności"],
      monthsSource: "Źródło: karty gatunków w Atlasie Dziadersów. Aktywność w skali 0–3; szczyt to 3.",
      summary: (peak: string, count: number, quiet: string) =>
        `Najwięcej gatunków jest w szczycie aktywności w miesiącu: ${peak} (${count}). Najspokojniej jest w miesiącu: ${quiet}. Wujek twierdzi, że w jego czasach było odwrotnie.`,
      index: "Narodowy Indeks Dziaderstwa",
    },
    faq: {
      title: "Pytania o Rocznik",
      aside: "Informacja dla czytelników",
      items: [
        {
          question: "Czy to Mały Rocznik Statystyczny Polski 2026 wydawany przez GUS?",
          answer:
            "Nie. „Mały Rocznik Statystyczny Polski” wydaje co roku Główny Urząd Statystyczny; aktualne wydanie i tablice do pobrania są na stat.gov.pl. Ten Rocznik liczy wyłącznie dziaderstwo: badania, obserwacje i orzeczenia zebrane w serwisie Instytutu.",
        },
        {
          question: "Skąd pochodzą dane w Roczniku?",
          answer:
            "Z Narodowego Spisu Dziadersów (wyniki Testu Dziadersa), Sieci Obserwatorów Terenowych (zgłoszenia na Mapie obserwacji), głosowań Komisji Orzekającej i liczników w pomocach naukowych. Dane są zbiorcze i nie zawierają identyfikatorów osób.",
        },
        {
          question: "Jak często Rocznik jest aktualizowany?",
          answer:
            "Działy III–VII odświeżają się co kilka minut. Dział I zmienia się, gdy Instytut opisze nowy gatunek, hasło albo sprawę. Działy II i VIII zawierają dane modelowe i stałe, aktualizowane razem z Atlasem i Indeksem.",
        },
        {
          question: "Czy mogę wykorzystać dane z Rocznika?",
          answer:
            "Tak, na licencji CC BY 4.0, z podaniem źródła: Instytut Badań nad Dziaderstwem, dziader.si. Prezentacja wyników przy rodzinnym stole również wymaga podania źródła.",
        },
      ],
    },
    signs: {
      title: "Objaśnienia znaków umownych",
      aside: "Zgodnie z praktyką statystyki publicznej",
      list: [
        ["–", "Kreska", "Zjawisko nie wystąpiło. Wujek twierdzi, że wystąpiło."],
        ["·", "Kropka", "Zupełny brak informacji albo brak informacji wiarygodnych. Dziaders wie, ale nie powie."],
        ["x", "Znak x", "Wypełnienie rubryki jest niemożliwe lub niecelowe. Zwykle dlatego, że pilot zaginął w fotelu."],
        ["w tym", "W tym", "Nie podaje się wszystkich składników sumy. Reszta poszła do szwagra."],
      ],
      note: `Dane są zaokrąglone, więc suma składników może się różnić od wartości ogółem, jak paragon od tego, co pamięta tata. Liczby bezwzględne podaje się od pierwszego przypadku, bo sama liczba nikogo nie wskazuje. Średnie, rozkłady procentowe i rankingi z Narodowego Spisu publikuje się od ${MIN_RESULTS} badań. Liczniki pomocy naukowych nie zawierają identyfikatorów: Instytut wie, ile razy zatrąbiono, ale nie wie kto.`,
      privacy: "Prywatność",
      translator: "",
    },
    promo: {
      title: "Każdy wynik to wkład w statystykę publiczną.",
      text: "Test Dziadersa: pięć gabinetów, około czterech minut. Twój rosół zostanie doliczony do Działu I.",
    },
  },
  sl: {
    title: "Mali statistični letopis",
    metaTitle: (year: number) => `Mali statistični letopis ${year}: dziaderstvo na Poljskem v številkah`,
    heading: (year: number) => `Mali statistični letopis ${year}`,
    description:
      "Mali statistični letopis dziaderstva: pregledi, opazovanja, razsodbe, bingo, Pogovornik in pritiski na hupo. V živo, s preračunom v nedeljske juhe.",
    shareDescription: "Pregledi, opazovanja, razsodbe in pritiski na hupo. S preračunom v nedeljske juhe.",
    variables: ["Pregledi", "Terenska opazovanja", "Razsodbe", "Izjave iz Pogovornika", "Prečrtana polja v bingu", "Pritiski na hupo"],
    cover: { label: "Slika. Kup statističnih letopisov in dziaders, ki jih je bral", spine: "MALI LETOPIS" },
    lead: "Vse, kar je Inštitut preštel od odprtja: preglede, opazovanja, razsodbe, prečrtana polja v bingu in pritiske na hupo. Podatki Nacionalnega popisa, Mreže terenskih opazovalcev, Razsodne komisije in števcev v učnih pripomočkih.",
    metaBefore: (year: number) => `Letopis ${year} · Stanje na `,
    notGus: {
      before: "Ne gre za Mali statistični letopis Poljske, ki ga izdaja poljski statistični urad GUS: uradni podatki o državi so na ",
      after: ". Tu je preštet samo dziaderstvo.",
    },
    metaAfter: " · posodobitev vsakih nekaj minut",
    contents: "Poglavja Letopisa",
    chapters: ["Zbirke Inštituta", "Nacionalni indeks dziaderstva", "Preračuni Inštituta", "Pregledi", "Terenska opazovanja", "Razsodna komisija", "Učni pripomočki", "Vojvodstva in letni časi", "Vprašanja o Letopisu", "Pojasnila dogovorjenih znakov"],
    table: (index: number) => `Tabela ${index}.`,
    chart: (index: number) => `Grafikon ${index}.`,
    source: "Vir: IBD.",
    noData: "· Ni podatka.",
    clock: (hour: number) => `${hour}.00`,
    zones: ["Sledna", "Zmerna", "Povišana", "Klinična"],
    units: {
      hours: (n: number) => countedSl(n, "ura", "uri", "ure", "ur", "ure"),
      broths: (n: number) => countedSl(n, "juha", "juhi", "juhe", "juh", "juhe"),
      sightings: (n: number) => countedSl(n, "prijava", "prijavi", "prijave", "prijav", "prijave"),
      votes: (n: number) => countedSl(n, "glas", "glasova", "glasovi", "glasov", "glasu"),
    },
    tests: {
      title: "Poglavje IV. Pregledi",
      aside: "Vir: Nacionalni popis dziadersov",
      total: "Pregledi skupaj",
      today: "Od tega danes",
      average: "Povprečni rezultat",
      proxy: "Heteroanamneze",
      proxyNote: "pregledov",
      retakes: "Ponovitve",
      retakeNote: (change: string) => `povpr. sprememba ${change} o. t.`,
      averageNote: `od ${MIN_RESULTS} pregledov`,
      empty: "Pojava ni bilo. Prvi pregled se bo v tem poglavju pojavil v nekaj minutah.",
      action: "Opravi test",
      hybrids: "Križanci",
      time: "Čas, preživet v ordinacijah Inštituta",
      timeUnknown: "Ni podatka: popis je začasno zaprt.",
      timeTotal: (hours: string, broths: string) => `Skupaj ${hours} pregledov, torej ${broths} v nedeljskih enotah.`,
      potKey: (unit: number) =>
        `1 lonec = ${formatNumber("sl", unit)} ${pluralSl(unit, "juha", "juhi", "juhe", "juh")}, torej ${formatNumber("sl", unit * 3)} h pregledov`,
      table: "Preiskovanci po jakosti dziaderstva",
      tableSource: "Vir: Nacionalni popis dziadersov, IBD.",
      tooFew: `Porazdelitve se objavljajo šele od ${MIN_RESULTS} rezultatov naprej. Prej bi povedale več o določenem stricu kot o družbi.`,
      progress: (n: number) => `Pregledi do prve objave porazdelitev: ${n} od ${MIN_RESULTS}.`,
      census: "Vsi rezultati: Nacionalni popis dziadersov",
    },
    observations: {
      title: "Poglavje V. Terenska opazovanja",
      aside: "Vir: Mreža terenskih opazovalcev",
      total: "Prijave",
      today: "Od tega danes",
      observers: "Opazovalci",
      perObserver: "Na opazovalca",
      perObserverNote: "prijav",
      species: "Opažene vrste",
      of: (n: number) => `od ${n}`,
      regions: "Vojvodstva",
      table: "Najpogosteje opažene vrste",
      tableSource: "Vir: prijave iz dziaderskih profilov, IBD.",
      collapsed: "Pojava ni bilo. Prijave sprejema stran vsake vrste v Atlasu: en klik, če imaš Dziaderski profil.",
      unknown: "Ni podatka. Mreža opazovalcev je začasno zaprta.",
      action: "V Atlas",
      chart: "Ob kateri uri Poljaki vidijo dziadersa",
      peak: (hour: number, remark: string) => `Največ prijav ob ${hour}.00. ${remark}`,
      evening: "Takrat se ljudje vračajo iz službe in se vidi celo parkirišče.",
      morning: "Takrat dziaders pere avto in je dobro viden.",
      midday: "Ob tej uri je dziaders v najboljši formi, opazovalec pa ima malico.",
      chartSource: "Vir: IBD. Število prijav po urah, varšavski čas.",
      key: (unit: number) => `1 daljnogled = ${formatNumber("sl", unit)} ${pluralSl(unit, "prijava", "prijavi", "prijave", "prijav")}`,
    },
    commission: {
      title: "Poglavje VI. Razsodna komisija",
      aside: "Vir: spisi Komisije",
      votes: "Glasovi porotnikov",
      jurors: "Porotniki s profilom",
      cases: "Primeri na dnevnem redu",
      agreement: "Skladnost s Komisijo",
      clinical: "Razsodbe »klinično«",
      ofVotes: "glasov",
      submissions: "Prijavljeni primeri",
      submissionsNote: "v tajništvu",
      table: "Glasovi porotnikov po vrsti razsodbe",
      none: "Pojava ni bilo. Dnevni red čaka na porotnike.",
      unknown: "Ni podatka. Tajništvo Komisije je začasno zaprto.",
      key: (unit: number) => `1 kladivce = ${formatNumber("sl", unit)} ${pluralSl(unit, "glas", "glasova", "glasovi", "glasov")}`,
      disputed: "Najbolj sporen primer",
      unanimous: "Najbolj enoglasen primer",
      tooFew: "Najbolj sporen in najbolj enoglasen primer Komisija izpostavi šele od petih glasov na primer naprej.",
      link: "Na Komisijo",
    },
    aids: {
      title: "Poglavje VII. Učni pripomočki",
      aside: "Vir: števci Inštituta",
      table: "Raba učnih pripomočkov",
      tableSource: "Vir: IBD. Števci brez identifikatorjev, od 2. oktobra 2026.",
      empty: "Pojava ni bilo. Števci čakajo na prvo izjavo, izžrebano v Pogovorniku.",
      unknown: "Ni podatka. Števci so začasno zaprti.",
      action: "V Pogovornik",
      rows: [
        "Dziaderski pogovornik",
        "izžrebane izjave",
        "prebrane na glas",
        "shranjene v profilih",
        "Dziaders bingo",
        "izžrebani listki",
        "prečrtana polja",
        "vzkliki »Bingo!«",
        "Terenski izpit",
        "opravljani izpiti",
        "shranjeni v profilih",
        "Test dziadersa",
        "pritiski v preizkusu s hupo",
        "preneseni certifikati in izvidi",
        "deljenja",
        "Superinteligenca",
        "zastavljena vprašanja",
        "znova ustvarjeni odgovori (nespremenjeni)",
      ],
      pictures: {
        horn: {
          label: "Pritiski v preizkusu s hupo",
          key: (unit: number) => `1 hupa = ${formatNumber("sl", unit)} ${pluralSl(unit, "pritisk", "pritiska", "pritiski", "pritiskov")}`,
        },
        bubble: {
          label: "Izjave iz Pogovornika",
          key: (unit: number) => `1 oblaček = ${formatNumber("sl", unit)} ${pluralSl(unit, "izjava", "izjavi", "izjave", "izjav")}`,
        },
        cross: {
          label: "Prečrtana polja v bingu",
          key: (unit: number) => `1 križec = ${formatNumber("sl", unit)} ${pluralSl(unit, "polje", "polji", "polja", "polj")}`,
        },
        exam: {
          label: "Terenski izpiti",
          key: (unit: number) => `1 pola = ${formatNumber("sl", unit)} ${pluralSl(unit, "izpit", "izpita", "izpiti", "izpitov")}`,
        },
      },
    },
    collections: {
      title: "Poglavje I. Zbirke Inštituta",
      aside: "Stanje zbirk",
      species: "Vrste v Atlasu",
      speciesNote: (nationwide: number, regional: number, occasional: number) =>
        `${nationwide} vsepoljskih · ${regional} regionalnih · ${occasional} priložnostnih`,
      entries: "Gesla v Slovarju",
      entriesNote: (words: string) => `${words} besed v definicijah`,
      reports: "Poročila",
      cases: "Primeri Komisije",
      squares: "Polja v bingu",
      squaresNote: (occasions: number) => `${occasions} ${pluralSl(occasions, "priložnost", "priložnosti", "priložnosti", "priložnosti")}`,
      lines: "Izjave v Pogovorniku",
      linesNote: "možnih kombinacij",
      atlas: (described: number, estimated: number, percent: number, year: number) =>
        `Atlas opisuje ${described} od približno ${estimated} vrst, ki živijo na Poljskem, torej ${percent}%. Pri sedanjem tempu dela Taksonomske sekcije bo komplet opisan leta ${year}. Sekcija meni, da prej, a enako je trdila za prenovo kopalnice.`,
      test: (tasks: number, stations: number, species: number) =>
        `Test dziadersa ima ${tasks} ${pluralSl(tasks, "nalogo", "nalogi", "naloge", "nalog")} v ${stations} ordinacijah. Terenski izpit izžreba 12 vprašanj iz ${species} vrst in 7 tipov namigov, kar da več različic, kot jih Inštitut zmore prešteti brez kalkulatorja s tiskalnikom.`,
    },
    index: {
      title: "Poglavje II. Nacionalni indeks dziaderstva",
      aside: "Vir: sezonski model Inštituta",
      today: "Indeks danes",
      season: "Sprememba v sezoni",
      seasonNote: (name: string) => `od začetka ${name}`,
      points: (n: string) => `${n} o. t.`,
      peak: "Letni vrh doslej",
      low: "Letni minimum doslej",
      average: "Letno povprečje doslej",
      forecast: "Vrh napovedi",
      forecastNote: "do konca leta",
      text: "Indeks se izračuna sam, vsak dan, iz sezonskega modela Inštituta. Zato to poglavje nikoli ni prazno.",
      link: "Letni grafikon, sezone in metodologija",
    },
    conversions: {
      title: "Poglavje III. Preračuni Inštituta",
      aside: "Ocenjeni podatki",
      intro: "Številke iz drugih poglavij v enotah, ki jih razume vsa družina. Metodologija pod vsako postavko.",
      method: "Metodologija:",
      table: {
        value: (n: number) => countedSl(n, "oseba", "osebi", "osebe", "oseb", "osebe"),
        label: "za mizo na sveti večer z 12 pogrinjki danes kaže simptome, po današnjem Indeksu",
        method: "Inštitut šteje 12 pogrinjkov, vključno z dodatnim za popotnika. Tudi popotnik je lahko dziaders.",
      },
      toasts: {
        value: (n: number) => countedSl(n, "zdravica", "zdravici", "zdravice", "zdravic", "zdravice"),
        label: "toliko traja Dziaderski slovar, prebran na glas za mizo, z definicijami",
        method: (words: string) => `${words} besed v definicijah v tempu zdravice: stric govori 120 besed na minuto, zdravica traja 3 minute, skupaj z »na zdravje«.`,
      },
      bingo: {
        label: "bi trajala vsa polja binga, če bi vsako povedal stric",
        method: "Inštitut računa 4 minute na polje: toliko traja zgodba, ki jo polje opisuje. Svatba traja 14 ur, zato za rezanje torte ne bo več časa.",
      },
      skipped: (names: string) => `Drugih preračunov nismo opravili, ker pojava ni bilo: ${names}.`,
      names: { mustache: "brki", broths: "juhe", honks: "hupe", weddings: "svatbe", uncles: "strici", fridges: "hladilniki", drawer: "predali", pool: "zaloga Pogovornika" },
      mustache: {
        label: "brkov skupaj, če bi brke vseh preiskovanih zložili v eno vrsto",
        method: (passats: string) => `Inštitut računa 7 cm brkov na preiskovano osebo, tudi pri osebah brez brkov. V dolžinah passata karavan: ${passats}.`,
      },
      broths: {
        label: "toliko so trajali vsi pregledi v ordinacijah Inštituta",
        method: "Pregled traja približno 4 minute. Juha, enota nedeljskega časa, se kuha 3 ure na majhnem ognju.",
      },
      honks: {
        label: "neprekinjenega trobljenja, če bi vse hupe iz preizkusa s hupo pritisnili eno za drugo",
        method: "En pritisk na hupo traja povprečno 0,6 sekunde. Zelena luč na križišču gori 30 sekund, zato bi se večina trobljenja zvrstila v eni sami zeleni, ob dobri organizaciji.",
      },
      weddings: {
        value: (n: number) => countedSl(n, "svatbo", "svatbi", "svatbe", "svatb", "svatbe"),
        label: "bi bilo treba preklepetati, da bi za mizo povedali vse, kar je izžrebal Pogovornik",
        method: "Izjava traja približno 9 sekund, svatba 14 ur. Drugi dan svatbe se šteje posebej.",
      },
      uncles: {
        label: "toliko stricev so prečrtali v Dziaders bingu",
        method: "Inštitut predpostavlja, da se vsako tretje prečrtano polje nanaša na strica. Ostala se nanašajo na svaka.",
      },
      fridges: {
        value: (n: number) => countedSl(n, "hladilnik", "hladilnika", "hladilnike", "hladilnikov", "hladilnika"),
        label: "bi potrebovali, da bi z magnetki na vrata pripeli vse prenesene certifikate",
        method: "Na vrata povprečnega hladilnika gre 12 certifikatov, če vabilo na bratrančevo prvo obhajilo štejemo kot enega.",
      },
      drawer: {
        label: "predala za vse bi zasedle natisnjene kartoteke Dziaderskega profila",
        method: "V predal gre 340 kartotek, ko iz njega vzameš elastike, baterije in navodila za opekač kruha iz leta 1998.",
      },
      pool: {
        label: (lines: string) => `leto, v katerem bo Pogovornik izčrpal zalogo ${lines} izjav`,
        method: "Pri sedanjem tempu žrebanja in pod pogojem, da nihče dvakrat ne izžreba iste. Stric jo bo izžrebal.",
      },
    },
    territory: {
      title: "Poglavje VIII. Vojvodstva in letni časi",
      aside: "Stalni podatki",
      intro: "Dziaderstvo po ozemlju in po koledarju. Indeks po vojvodstvih izhaja iz Nacionalnega indeksa dziaderstva, koledar aktivnosti iz kartotek vrst v Atlasu.",
      regions: "Vojvodstva: indeks dziaderstva in prevladujoča vrsta",
      regionsHead: ["Vojvodstvo", "Indeks", "Prevladujoča vrsta", "Opombe s terena"],
      regionsSource: "Vir: Nacionalni indeks dziaderstva (osebe s simptomi na 100 prebivalcev, ocena IBD), Atlas dziadersov.",
      months: "Aktivnost vrst po mesecih",
      monthsHead: ["Mesec", "Aktivne vrste", "Na vrhuncu", "Vrste na vrhuncu aktivnosti"],
      monthsSource: "Vir: kartoteke vrst v Atlasu dziadersov. Aktivnost na lestvici 0–3; vrhunec je 3.",
      summary: (peak: string, count: number, quiet: string) =>
        `Največ vrst je na vrhuncu aktivnosti v mesecu ${peak} (${count}). Najmirnejši mesec je ${quiet}. Stric trdi, da je bilo v njegovih časih ravno obratno.`,
      index: "Nacionalni indeks dziaderstva",
    },
    faq: {
      title: "Vprašanja o Letopisu",
      aside: "Obvestilo bralcem",
      items: [
        {
          question: "Je to Mali statistični letopis Poljske 2026, ki ga izdaja GUS?",
          answer:
            "Ne. »Mały Rocznik Statystyczny Polski« vsako leto izda poljski statistični urad GUS; aktualna izdaja in tabele so na stat.gov.pl. Slovenski bralec uradne podatke najde pri SURS na stat.si. Ta Letopis šteje samo dziaderstvo: preglede, opazovanja in razsodbe, zbrane na strani Inštituta.",
        },
        {
          question: "Od kod so podatki v Letopisu?",
          answer:
            "Iz Nacionalnega popisa dziadersov (izvidi Testa dziadersa), Mreže terenskih opazovalcev (prijave na Zemljevidu opazovanj), glasovanj Razsodne komisije in števcev v učnih pripomočkih. Podatki so zbirni in ne vsebujejo identifikatorjev oseb.",
        },
        {
          question: "Kako pogosto se Letopis posodablja?",
          answer:
            "Poglavja III–VII se osvežijo vsakih nekaj minut. Poglavje I se spremeni, ko Inštitut opiše novo vrsto, geslo ali primer. Poglavji II in VIII vsebujeta modelne in stalne podatke, ki se posodobijo skupaj z Atlasom in Indeksom.",
        },
        {
          question: "Lahko uporabim podatke iz Letopisa?",
          answer:
            "Da, pod licenco CC BY 4.0, z navedbo vira: Inštitut za raziskave dziaderstva, dziader.si. Predstavitev rezultatov za družinsko mizo prav tako zahteva navedbo vira.",
        },
      ],
    },
    signs: {
      title: "Pojasnila dogovorjenih znakov",
      aside: "Po praksi javne statistike",
      list: [
        ["–", "Pomišljaj", "Pojava ni bilo. Stric trdi, da je bil."],
        ["·", "Pika", "Podatka sploh ni ali pa ni zanesljiv. Dziaders ve, pa ne pove."],
        ["x", "Znak x", "Vpis v rubriko ni mogoč ali ni smiseln. Navadno zato, ker se je daljinec izgubil v naslanjaču."],
        ["od tega", "Od tega", "Niso navedeni vsi deli vsote. Ostanek je šel k svaku."],
      ],
      note: `Podatki so zaokroženi, zato se vsota delov lahko razlikuje od skupne vrednosti, kot se račun razlikuje od tega, kar si zapomni oči. Absolutne številke se objavljajo od prvega primera, ker sama številka nikogar ne razkrije. Povprečja, odstotne porazdelitve in lestvice iz Nacionalnega popisa se objavljajo od ${MIN_RESULTS} pregledov naprej. Števci učnih pripomočkov ne vsebujejo identifikatorjev: Inštitut ve, kolikokrat je kdo zatrobil, ne ve pa, kdo.`,
      privacy: "Zasebnost",
      translator: "Znaki so poljski, po praksi GUS, poljskega statističnega urada. Slovenski ustreznik je SURS (op. prev.).",
    },
    promo: {
      title: "Vsak rezultat je prispevek k javni statistiki.",
      text: "Test dziadersa: pet ordinacij, približno štiri minute. Tvoja juha bo prišteta k poglavju I.",
    },
  },
});

type Copy = (typeof COPY)[Locale];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  // The year of the cached data, like the page itself: a clock read would block prerendering.
  const { updated } = await getBulletin(locale);
  return pageMetadata(locale, {
    title: t.metaTitle(new Date(updated).getFullYear()),
    description: t.description,
    path: "/statystyki",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

/** GUS conventions: "·" when the figure is unknown, "–" when the phenomenon did not occur. */
function figure(value: number | null | undefined, format: (value: number) => string) {
  if (value === null || value === undefined || Number.isNaN(value)) return "·";
  return value === 0 ? "–" : format(value);
}

const share = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/* The cover of the yearbook, with the specimen pointing at the stack. */
function Cover({ t }: { t: Copy }) {
  return (
    <svg viewBox="0 0 200 150" className="ml-auto w-full max-w-sm" role="img" aria-label={t.cover.label}>
      <g>
        <rect x={60} y={118} width={128} height={20} fill="#cec6b6" />
        <rect x={60} y={118} width={10} height={20} fill="#8a8376" />
        <rect x={66} y={98} width={120} height={20} fill="#161513" />
        <rect x={66} y={98} width={10} height={20} fill="#3d6696" />
        <rect x={84} y={104} width={60} height={8} fill="#f4f0e7" opacity={0.85} />
        <g transform="rotate(-4 124 82)">
          <rect x={62} y={66} width={124} height={32} fill="#c4362c" />
          <rect x={62} y={66} width={10} height={32} fill="#a32a21" />
          <rect x={82} y={72} width={70} height={20} fill="#f4f0e7" />
          <text x={117} y={81} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={6.2} fontWeight={600} fill="#161513">
            {t.cover.spine}
          </text>
          <text x={117} y={89} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={7.4} fontWeight={700} fill="#c4362c">
            2026
          </text>
        </g>
      </g>
      <g transform="translate(4 42) scale(0.98)">
        <Figure right="point" glasses="eyes" />
      </g>
    </svg>
  );
}

function Figures({ items }: { items: [string, string, string?][] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([label, value, note]) => (
        <div key={label} className="border-b border-rule py-4 pr-4">
          <dt className="label text-ink-soft">{label}</dt>
          <dd className="mt-1 text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-none tabular-nums">{value}</dd>
          {note && <dd className="label mt-1.5 text-ink-faint">{note}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** "Tabl. 3." in the Rocznik's own numbering, with the source line under it. */
function Table({ t, number: index, title: caption, children, source = t.source }: { t: Copy; number: number; title: string; children: ReactNode; source?: string }) {
  return (
    <figure>
      <figcaption className="border-b border-ink pb-3">
        <span className="label block text-ink-soft">{t.table(index)}</span>
        <span className="mt-0.5 block font-bold leading-tight">{caption}</span>
      </figcaption>
      {children}
      <p className="label mt-3 text-ink-faint">{source}</p>
    </figure>
  );
}

function Picture({ t, kind, value, max = 36, label, unitLabel }: { t: Copy; kind: IsoKind; value: number | null; max?: number; label: string; unitLabel: (unit: number) => string }) {
  if (value === null) return <p className="label text-ink-faint">{t.noData}</p>;
  const unit = isoUnit(value, max);
  return (
    <div>
      <IsoRow kind={kind} value={value} unit={unit} label={label} />
      <IsoKey kind={kind}>{unitLabel(unit)}</IsoKey>
    </div>
  );
}

type Conversion = { value: string; label: string; method: string };

/** A division with nothing to show: "·" when the source is down, "–" when the phenomenon did not occur. */
function Collapsed({ known, empty, unknown, action }: { known: boolean; empty: string; unknown: string; action: { href: string; label: string } }) {
  return known ? (
    <SignLine sign="–" actions={[action]}>
      {typo(empty)}
    </SignLine>
  ) : (
    <SignLine sign="·">{typo(unknown)}</SignLine>
  );
}

/** Where each tool of Tabl. 4 lives, by the row of its heading. */
const AID_LINKS: Record<number, string> = { 0: "/generator", 4: "/bingo", 8: "/egzamin", 11: "/test", 15: "/superinteligencja" };

export default async function YearbookPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const number = (value: number) => formatNumber(locale, value);
  const decimal = (value: number) => decimals[locale].format(value);
  const known = new Map(getSpecies(locale).map((species) => [species.key as string, species]));
  const [census, community, bulletin] = await Promise.all([getCensus(), getCommunity(), getBulletin(locale)]);
  const updated = community?.updated ?? census?.updated ?? bulletin.updated;
  // "Now" comes from the cached data, so the page can be prerendered and refreshed in the background.
  const now = Date.parse(updated);
  const tallies = community?.tallies ?? null;
  const tally = (kind: string) => (tallies ? (tallies[kind] ?? 0) : null);

  /* Dział I. Zbiory: always there, they are the Institute's own. */
  const regional = SPECIES.filter((species) => species.region).length;
  const occasional = SPECIES.filter((species) => species.occasion).length;
  const squares = OCCASIONS.reduce((sum, occasion) => sum + occasion.squares.length, 0);
  const monthsOfWork = Math.max(1, (now - Date.UTC(2026, 0, 1)) / (30.44 * 86_400_000));
  const perMonth = SPECIES.length / monthsOfWork;
  const completeYear = 2026 + Math.ceil((ESTIMATED_SPECIES - SPECIES.length) / perMonth / 12);
  const definitionWords = getDictionary(locale).reduce(
    (sum, entry) => sum + entry.senses.reduce((words, sense) => words + sense.text.split(/\s+/).length, 0),
    0,
  );

  /* Dział II. Indeks: a model, so never empty. Day i of the chart is 1 January + i days. */
  const { index, chart, year } = bulletin;
  const peakDay = chart.measured.indexOf(Math.max(...chart.measured));
  const lowDay = chart.measured.indexOf(Math.min(...chart.measured));
  const yearAverage = chart.measured.reduce((sum, value) => sum + value, 0) / chart.measured.length;
  const forecastPeak = Math.max(...chart.forecast);
  const onDay = (day: number) => formatDate(locale, new Date(Date.UTC(year, 0, 1 + day, 12)), { day: "numeric", month: "long" });

  /* Dział IV. Badania. Counts from the first result; averages and distributions from MIN_RESULTS. */
  const tests = census?.total ?? null;
  const hours = tests === null ? null : (tests * 4) / 60;
  const broths = hours === null ? null : hours / 3;
  const enough = (census?.total ?? 0) >= MIN_RESULTS;

  /* Dział V. Obserwacje. */
  const sightings = community?.sightings ?? null;
  const observedSpecies = sightings ? Object.keys(sightings.species).filter((key) => known.has(key)).length : null;
  const topObserved = Object.entries(sightings?.species ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const hoursOfDay = Array.from({ length: 24 }, (_, hour) => sightings?.hours[String(hour)] ?? 0);
  const peakHour = hoursOfDay.indexOf(Math.max(...hoursOfDay));
  const busiest = Math.max(1, ...hoursOfDay);

  /* Dział VI. Komisja. Votes are kept under the Polish slugs; the edition's cases share their order. */
  const cases = getCases(locale);
  const options = getVerdicts(locale);
  const verdicts = community?.verdicts ?? null;
  const totals = Object.fromEntries(VERDICTS.map((option) => [option.key, 0])) as Record<string, number>;
  let agreeing = 0;
  const contested: { index: number; spread: number; votes: number }[] = [];
  for (const [index, item] of CASES.entries()) {
    const counts = verdicts?.cases[item.slug] ?? {};
    const votes = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
    for (const option of VERDICTS) totals[option.key] += counts[option.key] ?? 0;
    agreeing += counts[item.expert] ?? 0;
    if (votes >= 5) contested.push({ index, spread: Math.max(...VERDICTS.map((option) => counts[option.key] ?? 0)) / votes, votes });
  }
  const allVotes = VERDICTS.reduce((sum, option) => sum + totals[option.key], 0);
  contested.sort((a, b) => a.spread - b.spread);
  const disputed = contested[0] ? cases[contested[0].index] : undefined;
  const unanimous = contested.at(-1) ? cases[contested.at(-1)!.index] : undefined;

  /* Dział VIII. Województwa i pory roku: fixed content data. */
  const regions = getRegions(locale);
  const regionRows = REGION_GRID.flat()
    .map((code) => regions[code])
    .sort((a, b) => b.value - a.value);
  const monthName = new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { month: "long", timeZone: "UTC" });
  const monthRows = Array.from({ length: 12 }, (_, month) => {
    const active = getSpecies(locale).filter((species) => species.calendar[month] > 0);
    const peak = active.filter((species) => species.calendar[month] === 3);
    return { name: monthName.format(Date.UTC(2026, month, 15)), active: active.length, peak };
  });
  const busiestMonth = monthRows.reduce((best, row) => (row.peak.length > best.peak.length ? row : best));
  const quietestMonth = monthRows.reduce((best, row) => (row.active < best.active ? row : best));

  /* Dział VII. Pomoce naukowe. */
  const usage: (number | null)[] = [
    null,
    tally("rozmowki"),
    tally("rozmowki-glos"),
    community ? (community.saved.rozmowki ?? 0) : null,
    null,
    tally("bingo-karta"),
    tally("bingo-pole"),
    tally("bingo"),
    null,
    tally("egzamin"),
    community ? (community.saved.egzamin ?? 0) : null,
    null,
    tally("klakson"),
    tally("certyfikat"),
    tally("udostepnienie"),
    null,
    tally("superinteligencja"),
    tally("superinteligencja-znowu"),
  ];
  const heading = (i: number) => usage[i] === null && /^[A-ZĄĆČĘŁŃÓŚŠŹŻŽ]/.test(t.aids.rows[i]);
  // Each tool's rows, so a tool nobody has used yet takes one line instead of three dashes.
  const aidGroups = t.aids.rows.flatMap((label, i) => {
    if (!heading(i)) return [];
    let end = i + 1;
    while (end < t.aids.rows.length && !heading(end)) end++;
    const rows = Array.from({ length: end - i - 1 }, (_, k) => ({ label: t.aids.rows[i + 1 + k], value: usage[i + 1 + k] }));
    return [{ label, href: AID_LINKS[i], rows, used: rows.some((row) => (row.value ?? 0) > 0) }];
  });
  const aidsUsed = aidGroups.some((group) => group.used);
  const pictures = (
    [
      ["horn", tally("klakson")],
      ["bubble", tally("rozmowki")],
      ["cross", tally("bingo-pole")],
      ["exam", tally("egzamin")],
    ] as const
  ).filter(([, value]) => (value ?? 0) > 0);

  /* Dział III. Przeliczenia: three from the collections and the Index first, then the live ones that have happened. */
  const lines = tally("rozmowki");
  const honks = tally("klakson");
  const crossed = tally("bingo-pole");
  const certificates = tally("certyfikat");
  const accounts = community?.accounts ?? null;
  const daysOpen = Math.max(1, (now - Date.UTC(2026, 9, 1)) / 86_400_000);
  const poolYear = lines ? 2026 + Math.ceil(TOTAL_LINES / (lines / daysOpen) / 365) : null;

  const c = t.conversions;
  const standing: Conversion[] = [
    { value: c.table.value((index.value / 100) * 12), label: c.table.label, method: c.table.method },
    { value: c.toasts.value(definitionWords / 120 / 3), label: c.toasts.label, method: c.toasts.method(number(definitionWords)) },
    { value: t.units.hours((squares * 4) / 60), label: c.bingo.label, method: c.bingo.method },
  ];
  // `amount` is the figure as shown, rounded to `digits`: a conversion that rounds to nothing goes to the "not computed" line.
  const live: (Conversion & { name: string; amount: number | null; digits: number })[] = [
    {
      name: c.names.mustache,
      amount: tests === null ? null : (tests * 7) / 100,
      digits: 1,
      value: figure(tests === null ? null : (tests * 7) / 100, (n) => `${decimal(n)} m`),
      label: c.mustache.label,
      method: c.mustache.method(figure(tests === null ? null : (tests * 0.07) / 4.7, decimal)),
    },
    { name: c.names.broths, amount: broths, digits: 1, value: figure(broths, t.units.broths), label: c.broths.label, method: c.broths.method },
    {
      name: c.names.honks,
      amount: honks === null ? null : (honks * 0.6) / 60,
      digits: 1,
      value: figure(honks === null ? null : (honks * 0.6) / 60, (n) => `${decimal(n)} min`),
      label: c.honks.label,
      method: c.honks.method,
    },
    {
      name: c.names.weddings,
      amount: lines === null ? null : (lines * 9) / 3600 / 14,
      digits: 1,
      value: figure(lines === null ? null : (lines * 9) / 3600 / 14, c.weddings.value),
      label: c.weddings.label,
      method: c.weddings.method,
    },
    {
      name: c.names.uncles,
      amount: crossed === null ? null : crossed / 3,
      digits: 0,
      value: figure(crossed === null ? null : crossed / 3, (n) => number(Math.round(n))),
      label: c.uncles.label,
      method: c.uncles.method,
    },
    {
      name: c.names.fridges,
      amount: certificates === null ? null : certificates / 12,
      digits: 1,
      value: figure(certificates === null ? null : certificates / 12, c.fridges.value),
      label: c.fridges.label,
      method: c.fridges.method,
    },
    {
      name: c.names.drawer,
      amount: accounts === null ? null : accounts / 3.4,
      digits: 1,
      value: figure(accounts === null ? null : accounts / 3.4, (n) => `${decimal(n)}%`),
      label: c.drawer.label,
      method: c.drawer.method,
    },
    {
      name: c.names.pool,
      amount: lines,
      digits: 0,
      value: poolYear ? String(poolYear) : figure(lines, number),
      label: c.pool.label(number(TOTAL_LINES)),
      method: c.pool.method,
    },
  ];
  const shown = (item: (typeof live)[number]) => item.amount !== null && Math.round(item.amount * 10 ** item.digits) > 0;
  const conversions = [...standing, ...live.filter(shown)];
  const skipped = live.filter((item) => !shown(item)).map((item) => item.name);

  const chapters = ["#zbiory", "#indeks", "#przeliczenia", "#badania", "#obserwacje", "#komisja", "#pomoce", "#wojewodztwa", "#pytania", "#znaki"];
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "", ""];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/statystyki" }]),
          dataset(locale, "/statystyki", {
            name: t.metaTitle(new Date(updated).getFullYear()),
            description: t.description,
            datePublished: site.launched,
            temporalCoverage: `${site.launched}/..`,
            dateModified: updated,
            variableMeasured: t.variables,
          }),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl("/statystyki", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            mainEntity: t.faq.items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.heading(new Date(updated).getFullYear())}
        lead={typo(t.lead)}
        meta={
          <>
            {t.metaBefore(new Date(updated).getFullYear())}
            <time dateTime={updated}>
              {formatDate(locale, updated, { day: "numeric", month: "long", year: "numeric" })}
            </time>
            {t.metaAfter} · <DataLicense />
          </>
        }
        aside={<Cover t={t} />}
      />
      <p className="wrap label mt-6 text-ink-soft">
        {typo(t.notGus.before)}
        <a href="https://stat.gov.pl/" className="link text-ink">
          stat.gov.pl
        </a>
        {typo(t.notGus.after)}
      </p>

      <nav aria-label={t.contents} className="wrap mt-12">
        <ol className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((href, i) => (
            <li key={href} className="border-b border-rule">
              <a href={href} className="group flex items-baseline gap-3 py-3">
                <span className="w-8 font-sans text-[0.85rem] font-semibold text-red">{numerals[i]}</span>
                <span className="font-bold leading-tight transition-colors group-hover:text-red">{t.chapters[i]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="zbiory" title={t.collections.title} aside={t.collections.aside}>
        <Figures
          items={[
            [t.collections.species, number(SPECIES.length), t.collections.speciesNote(SPECIES.length - regional - occasional, regional, occasional)],
            [t.collections.entries, number(getDictionary(locale).length), t.collections.entriesNote(number(definitionWords))],
            [t.collections.reports, number(REPORTS.length), REPORTS[0].number],
            [t.collections.cases, number(CASES.length), `${docket(CASES[0])} – ${docket(CASES[CASES.length - 1])}`],
            [t.collections.squares, number(squares), t.collections.squaresNote(OCCASIONS.length)],
            [t.collections.lines, number(TOTAL_LINES), t.collections.linesNote],
          ]}
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <p className="max-w-xl text-[1.2rem] leading-relaxed">
            {typo(t.collections.atlas(SPECIES.length, ESTIMATED_SPECIES, share(SPECIES.length, ESTIMATED_SPECIES), completeYear))}
          </p>
          <p className="max-w-xl text-[1.2rem] leading-relaxed">{typo(t.collections.test(TASKS.length, STATIONS.length, SPECIES.length))}</p>
        </div>
      </Section>

      <Section id="indeks" title={t.index.title} aside={t.index.aside}>
        <Figures
          items={[
            [t.index.today, `${pct(index.value)}%`, index.zone.label],
            [t.index.season, t.index.points(`${index.delta > 0 ? "+" : ""}${decimal(index.delta)}`), t.index.seasonNote(index.season.name)],
            [t.index.peak, `${pct(chart.measured[peakDay])}%`, onDay(peakDay)],
            [t.index.low, `${pct(chart.measured[lowDay])}%`, onDay(lowDay)],
            [t.index.average, `${pct(yearAverage)}%`],
            [t.index.forecast, `${pct(forecastPeak)}%`, t.index.forecastNote],
          ]}
        />
        <p className="mt-8 max-w-2xl text-[1.2rem] leading-relaxed">{typo(t.index.text)}</p>
        <Link href="/indeks" className="link mt-4 inline-block font-sans font-medium">
          {t.index.link}
        </Link>
      </Section>

      <Section id="przeliczenia" title={c.title} aside={c.aside} intro={typo(c.intro)}>
        <ol className="grid gap-x-10 gap-y-12 border-t border-ink pt-8 md:grid-cols-2">
          {conversions.map((item, i) => (
            <li key={item.label} className="grid grid-cols-[2.5rem_1fr] gap-x-2">
              <span className="pt-2 font-sans text-[0.9rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[clamp(2.6rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.02em] tabular-nums">{item.value}</p>
                <p className="mt-2 text-[1.15rem] leading-snug">{typo(item.label)}</p>
                <p className="label mt-3 max-w-md text-ink-soft">
                  {c.method} {typo(item.method)}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {skipped.length > 0 && (
          <p className="label mt-12 grid max-w-3xl grid-cols-[2.5rem_1fr] gap-x-2 border-t border-rule pt-4 text-ink-soft">
            <span className="font-semibold text-ink" aria-hidden="true">
              –
            </span>
            <span>{typo(c.skipped(skipped.join(", ")))}</span>
          </p>
        )}
      </Section>

      <Section id="badania" title={t.tests.title} aside={t.tests.aside}>
        {!tests ? (
          <Collapsed known={census !== null} empty={t.tests.empty} unknown={t.tests.timeUnknown} action={{ href: "/test", label: t.tests.action }} />
        ) : (
          <>
            <Figures
              items={[
                [t.tests.total, figure(tests, number)],
                [t.tests.today, figure(census?.today, number)],
                enough
                  ? [t.tests.average, figure(census?.average, (n) => `${pct(n)}%`)]
                  : [t.tests.average, "x", t.tests.averageNote],
                enough
                  ? [t.tests.proxy, figure(census ? share(census.proxy, census.total) : null, (n) => `${n}%`), t.tests.proxyNote]
                  : [t.tests.proxy, figure(census?.proxy, number), t.tests.proxyNote],
                [
                  t.tests.retakes,
                  figure(census?.retakes, number),
                  enough && census?.retakeChange ? t.tests.retakeNote(`${census.retakeChange > 0 ? "+" : ""}${decimal(census.retakeChange)}`) : undefined,
                ],
                enough
                  ? [t.tests.hybrids, figure(census ? share(census.hybrid, census.total) : null, (n) => `${n}%`), t.tests.proxyNote]
                  : [t.tests.hybrids, "x", t.tests.averageNote],
              ]}
            />
            <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <h3 className="font-bold leading-tight">{t.tests.time}</h3>
                <p className="mt-1 max-w-xl leading-snug text-ink-soft">{typo(t.tests.timeTotal(t.units.hours(hours ?? 0), t.units.broths(broths ?? 0)))}</p>
                <div className="mt-5">
                  <Picture t={t} kind="pot" value={broths} label={t.units.broths(broths ?? 0)} unitLabel={t.tests.potKey} />
                </div>
              </div>
              <div className="lg:col-span-5">
                <Table t={t} number={1} title={t.tests.table} source={t.tests.tableSource}>
                  {enough && census ? (
                    <ol>
                      {t.zones.map((label, i) => {
                        const n = census.zones[String(i)] ?? 0;
                        return (
                          <li key={label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 border-b border-rule py-2.5">
                            <span className="font-sans text-[0.95rem]">{label}</span>
                            <span className="h-2.5 bg-ink/10">
                              <span className={cx("block h-full", i === 3 ? "bg-red" : "bg-ink")} style={{ width: `${share(n, census.total)}%` }} />
                            </span>
                            <span className="text-right font-sans text-[0.95rem] font-semibold tabular-nums">{share(n, census.total)}%</span>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <div className="py-4">
                      <p className="leading-snug text-ink-soft">
                        <span className="mr-2 font-sans font-semibold text-ink">x</span>
                        {typo(t.tests.tooFew)}
                      </p>
                      <Threshold count={tests} of={MIN_RESULTS} label={t.tests.progress(tests)} className="mt-5" />
                    </div>
                  )}
                </Table>
                <Link href={enough ? "/spis" : "/test"} className="link mt-5 inline-block font-sans font-medium">
                  {enough ? t.tests.census : t.tests.action}
                </Link>
              </div>
            </div>
          </>
        )}
      </Section>

      <Section id="obserwacje" title={t.observations.title} aside={t.observations.aside}>
        {!sightings?.total ? (
          <Collapsed known={sightings !== null} empty={t.observations.collapsed} unknown={t.observations.unknown} action={{ href: "/atlas", label: t.observations.action }} />
        ) : (
          <>
            <Figures
              items={[
                [t.observations.total, figure(sightings.total, number)],
                [t.observations.today, figure(sightings.today, number)],
                [t.observations.observers, figure(sightings.observers, number)],
                [t.observations.perObserver, figure(sightings.observers ? sightings.total / sightings.observers : 0, decimal), t.observations.perObserverNote],
                [t.observations.species, figure(observedSpecies, number), t.observations.of(SPECIES.length)],
                [t.observations.regions, figure(Object.keys(sightings.regions).length, number), t.observations.of(16)],
              ]}
            />
            <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Table t={t} number={2} title={t.observations.table} source={t.observations.tableSource}>
                  <ol>
                    {topObserved.map(([key, n], i) => {
                      const species = known.get(key)!;
                      return (
                        <li key={key} className="grid grid-cols-[1.5rem_3rem_1fr_auto] items-center gap-3 border-b border-rule py-2">
                          <span className="font-sans text-[0.85rem] font-semibold text-red">{i + 1}</span>
                          <SpeciesPlate species={key as SpeciesKey} variant="pictogram" className="w-full" />
                          <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                            {species.name}
                          </Link>
                          <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{number(n)}</span>
                        </li>
                      );
                    })}
                  </ol>
                </Table>
              </div>
              <div className="lg:col-span-7">
                <figure>
                  <figcaption className="border-b border-ink pb-3">
                    <span className="label block text-ink-soft">{t.chart(1)}</span>
                    <span className="mt-0.5 block font-bold leading-tight">{t.observations.chart}</span>
                  </figcaption>
                  <div className="mt-6 flex h-40 items-end gap-[3px]" aria-hidden="true">
                    {hoursOfDay.map((n, hour) => (
                      <div key={hour} className="flex h-full flex-1 flex-col justify-end">
                        <div className={cx("w-full", hour === peakHour && n > 0 ? "bg-red" : "bg-ink")} style={{ height: `${n ? Math.max(3, (n / busiest) * 100) : 1}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="label mt-2 flex justify-between text-[0.75rem] text-ink-soft">
                    {[0, 6, 12, 18, 23].map(t.clock).map((hour) => (
                      <span key={hour}>{hour}</span>
                    ))}
                  </div>
                  <p className="mt-4 max-w-xl leading-snug">
                    {typo(
                      t.observations.peak(
                        peakHour,
                        peakHour >= 17 && peakHour <= 20 ? t.observations.evening : peakHour < 9 ? t.observations.morning : t.observations.midday,
                      ),
                    )}
                  </p>
                  <p className="label mt-3 text-ink-faint">{t.observations.chartSource}</p>
                </figure>
                <div className="mt-10">
                  <Picture t={t} kind="binoculars" value={sightings.total} label={t.units.sightings(sightings.total)} unitLabel={t.observations.key} />
                </div>
              </div>
            </div>
          </>
        )}
      </Section>

      <Section id="komisja" title={t.commission.title} aside={t.commission.aside}>
        {!allVotes ? (
          <Collapsed known={verdicts !== null} empty={t.commission.none} unknown={t.commission.unknown} action={{ href: "/czy-to-juz-dziaderstwo", label: t.commission.link }} />
        ) : (
          <>
            <Figures
              items={[
                [t.commission.votes, figure(verdicts?.total, number)],
                [t.commission.jurors, figure(verdicts?.jurors, number)],
                [t.commission.cases, number(CASES.length)],
                [t.commission.agreement, figure(share(agreeing, allVotes), (n) => `${n}%`), t.commission.ofVotes],
                [t.commission.clinical, figure(share(totals.kliniczne, allVotes), (n) => `${n}%`), t.commission.ofVotes],
                [t.commission.submissions, figure(community?.submissions, number), t.commission.submissionsNote],
              ]}
            />
            <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <Table t={t} number={3} title={t.commission.table}>
                  <div className="mt-5 flex h-10" aria-hidden="true">
                    {options.map((option) => (
                      <div
                        key={option.key}
                        className={cx("h-full", option.key === "nie" ? "bg-ink/15" : option.key === "tak" ? "bg-ink" : "bg-red")}
                        style={{ width: `${share(totals[option.key], allVotes)}%` }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3">
                    {options.map((option) => (
                      <li key={option.key} className="grid grid-cols-[1fr_auto_3rem] gap-4 border-b border-rule py-2 font-sans text-[0.95rem]">
                        <span>{option.label}</span>
                        <span className="tabular-nums text-ink-soft">{figure(totals[option.key], number)}</span>
                        <span className="text-right font-semibold tabular-nums">{share(totals[option.key], allVotes)}%</span>
                      </li>
                    ))}
                  </ul>
                </Table>
                <div className="mt-10">
                  <Picture t={t} kind="gavel" value={verdicts?.total ?? null} label={t.units.votes(verdicts?.total ?? 0)} unitLabel={t.commission.key} />
                </div>
              </div>
              <div className="space-y-8 lg:col-span-5">
                {disputed ? (
                  [
                    { label: t.commission.disputed, item: disputed },
                    { label: t.commission.unanimous, item: unanimous !== disputed ? unanimous : undefined },
                  ]
                    .filter(({ item }) => item)
                    .map(({ label, item }) => (
                      <div key={label} className="border-t border-ink pt-4">
                        <p className="label text-ink-soft">{label}</p>
                        <Link href={`/czy-to-juz-dziaderstwo/${item!.slug}`} className="group mt-2 block">
                          <span className="label block text-ink-faint">{docket(item!)}</span>
                          <span className="block text-2xl font-bold leading-tight group-hover:text-red">{item!.title}</span>
                        </Link>
                      </div>
                    ))
                ) : (
                  <p className="grid grid-cols-[1.5rem_1fr] gap-x-2 border-t border-ink pt-4 leading-snug text-ink-soft">
                    <span className="font-sans font-semibold text-ink" aria-hidden="true">
                      x
                    </span>
                    <span>{typo(t.commission.tooFew)}</span>
                  </p>
                )}
                <Link href="/czy-to-juz-dziaderstwo" className="btn border border-ink hover:bg-ink hover:text-paper">
                  {t.commission.link} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </Section>

      <Section id="pomoce" title={t.aids.title} aside={t.aids.aside}>
        {!aidsUsed ? (
          <Collapsed known={tallies !== null} empty={t.aids.empty} unknown={t.aids.unknown} action={{ href: "/generator", label: t.aids.action }} />
        ) : (
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className={pictures.length ? "lg:col-span-6" : "lg:col-span-8"}>
              <Table t={t} number={4} title={t.aids.table} source={t.aids.tableSource}>
                <table className="w-full font-sans text-[0.95rem]">
                  {aidGroups.map((group) => (
                    <tbody key={group.label}>
                      <tr className={group.used ? "border-b border-ink" : "border-b border-rule"}>
                        <th scope="rowgroup" className="pb-2 pt-5 text-left font-serif text-[1.1rem] font-bold">
                          <Link href={group.href} className="hover:text-red">
                            {group.label}
                          </Link>
                        </th>
                        <td className="pb-2 pt-5 text-right font-semibold tabular-nums">{group.used ? null : "–"}</td>
                      </tr>
                      {group.used &&
                        group.rows.map((row) => (
                          <tr key={row.label} className="border-b border-rule">
                            <th scope="row" className="py-2 pl-4 text-left font-normal text-ink-soft">
                              {row.label}
                            </th>
                            <td className="py-2 text-right font-semibold tabular-nums">{figure(row.value, number)}</td>
                          </tr>
                        ))}
                    </tbody>
                  ))}
                </table>
              </Table>
            </div>
            {pictures.length > 0 && (
              <div className="space-y-10 lg:col-span-6">
                {pictures.map(([kind, value]) => {
                  const { label, key } = t.aids.pictures[kind];
                  return (
                    <div key={kind}>
                      <h3 className="mb-3 font-bold leading-tight">
                        {label} <span className="label font-normal text-ink-soft">· {figure(value, number)}</span>
                      </h3>
                      <Picture t={t} kind={kind} value={value} label={`${label}: ${figure(value, number)}`} unitLabel={key} max={30} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Section>

      <Section id="wojewodztwa" title={t.territory.title} aside={t.territory.aside} intro={typo(t.territory.intro)}>
        <div className="grid gap-12 xl:grid-cols-2">
          <Table t={t} number={5} title={t.territory.regions} source={t.territory.regionsSource}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left">
                <thead>
                  <tr className="label text-ink-soft">
                    {t.territory.regionsHead.map((label, i) => (
                      <th key={label} scope="col" className={cx("border-b border-rule py-2 pr-4 font-normal", i === 1 && "text-right")}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regionRows.map((region) => {
                    const dominant = known.get(region.species);
                    return (
                      <tr key={region.code} className="border-b border-rule align-top">
                        <th scope="row" className="py-2 pr-4 font-bold">
                          {region.name}
                        </th>
                        <td className="py-2 pr-4 text-right tabular-nums">{decimal(region.value)}</td>
                        <td className="py-2 pr-4">
                          {dominant ? (
                            <Link href={"/atlas/" + dominant.slug} className="link">
                              {dominant.name}
                            </Link>
                          ) : (
                            "·"
                          )}
                        </td>
                        <td className="py-2 text-ink-soft">{typo(region.note)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-sans">
              <Link href="/indeks" className="link">
                {t.territory.index} →
              </Link>
            </p>
          </Table>
          <Table t={t} number={6} title={t.territory.months} source={t.territory.monthsSource}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left">
                <thead>
                  <tr className="label text-ink-soft">
                    {t.territory.monthsHead.map((label, i) => (
                      <th key={label} scope="col" className={cx("border-b border-rule py-2 pr-4 font-normal", (i === 1 || i === 2) && "text-right")}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthRows.map((row) => (
                    <tr key={row.name} className="border-b border-rule align-top">
                      <th scope="row" className="py-2 pr-4 font-bold">
                        {row.name}
                      </th>
                      <td className="py-2 pr-4 text-right tabular-nums">{figure(row.active, number)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{figure(row.peak.length, number)}</td>
                      <td className="py-2 text-ink-soft">{row.peak.length ? row.peak.map((species) => species.name).join(", ") : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-xl text-[1.1rem] leading-relaxed">
              {typo(t.territory.summary(busiestMonth.name, busiestMonth.peak.length, quietestMonth.name))}
            </p>
          </Table>
        </div>
      </Section>

      <Section id="pytania" title={t.faq.title} aside={t.faq.aside}>
        <div className="max-w-3xl divide-y divide-rule border-t border-ink">
          {t.faq.items.map((item) => (
            <details key={item.question} className="py-5">
              <summary className="cursor-pointer text-xl font-bold hover:text-red">{item.question}</summary>
              <p className="mt-4 leading-relaxed text-ink-soft">{typo(item.answer)}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="znaki" title={t.signs.title} aside={t.signs.aside}>
        <dl className="max-w-3xl border-t border-ink">
          {t.signs.list.map(([sign, name, text]) => (
            <div
              key={name}
              className={
                // "od tega" needs a wider sign column than "w tym".
                locale === "sl"
                  ? "grid grid-cols-[5.75rem_1fr] gap-x-4 border-b border-rule py-4 sm:grid-cols-[5.75rem_8rem_1fr]"
                  : "grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-rule py-4 sm:grid-cols-[4.5rem_8rem_1fr]"
              }
            >
              <dt className="whitespace-nowrap text-2xl font-bold leading-none">{sign}</dt>
              <dd className="label pt-1 text-ink-soft sm:col-start-2">{name}</dd>
              <dd className="col-start-2 leading-snug sm:col-start-3">{typo(text)}</dd>
            </div>
          ))}
        </dl>
        <p className="label mt-6 max-w-3xl text-ink-soft">
          {typo(t.signs.note)}{" "}
          <Link href="/prywatnosc" className="link text-ink">
            {t.signs.privacy}
          </Link>
        </p>
        {t.signs.translator && <p className="label mt-3 max-w-3xl text-ink-faint">{typo(t.signs.translator)}</p>}
      </Section>

      <TestPromo title={t.promo.title} text={typo(t.promo.text)} />
    </main>
  );
}
