import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IsoKey, IsoRow, isoUnit, type IsoKind } from "@/components/isotype";
import { breadcrumbList, DataLicense, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Figure, SpeciesPlate } from "@/components/pictograms";
import { OCCASIONS } from "@/content/bingo";
import { CASES, docket, getCases, getVerdicts, VERDICTS } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
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
import { dataset, pageMetadata } from "@/lib/seo";
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
    metaTitle: "Mały Rocznik Statystyczny Dziaderstwa",
    description:
      "Mały Rocznik Statystyczny Dziaderstwa: badania, obserwacje, orzeczenia, bingo, Rozmówki i trąbienia klaksonem. Na żywo, z przeliczeniem na rosoły.",
    shareDescription: "Badania, obserwacje, orzeczenia i trąbienia klaksonem. Z przeliczeniem na rosoły.",
    variables: ["Badania", "Obserwacje terenowe", "Orzeczenia", "Wypowiedzi z Rozmówek", "Skreślenia w bingo", "Trąbienia klaksonem"],
    cover: { label: "Rys. Stos roczników statystycznych i dziaders, który je czytał", spine: "MAŁY ROCZNIK" },
    lead: "Wszystko, co Instytut policzył od otwarcia: badania, obserwacje, orzeczenia, skreślenia w bingo i trąbienia klaksonem. Dane z Narodowego Spisu, Sieci Obserwatorów Terenowych, Komisji Orzekającej i liczników w pomocach naukowych.",
    metaBefore: "Rocznik 2026 · Stan na ",
    metaAfter: " · aktualizacja co kilka minut",
    contents: "Działy Rocznika",
    chapters: ["Badania", "Obserwacje terenowe", "Komisja Orzekająca", "Pomoce naukowe", "Zbiory Instytutu", "Przeliczenia Instytutu", "Objaśnienia znaków umownych"],
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
      title: "Dział I. Badania",
      aside: "Źródło: Narodowy Spis Dziadersów",
      total: "Badań ogółem",
      today: "W tym dziś",
      average: "Średni wynik",
      proxy: "Wywiady rodzinne",
      proxyNote: "badań",
      retakes: "Powtórki",
      retakeNote: (change: string) => `śr. zmiana ${change} pkt`,
      index: "Indeks dziś",
      time: "Czas spędzony w gabinetach Instytutu",
      timeUnknown: "Brak informacji: Spis jest chwilowo nieczynny.",
      timeNone: "Zjawisko nie wystąpiło. Pierwszy rosół czeka na pierwszego zbadanego.",
      timeTotal: (hours: string, broths: string) => `Łącznie ${hours} badań, czyli ${broths} w jednostkach niedzielnych.`,
      potKey: (unit: number) =>
        `1 garnek = ${formatNumber("pl", unit)} ${plural(unit, "rosół", "rosoły", "rosołów")}, czyli ${formatNumber("pl", unit * 3)} godz. badań`,
      table: "Zbadani według natężenia dziaderstwa",
      tableSource: "Źródło: Narodowy Spis Dziadersów, IBD.",
      tooFew: `Rozkłady publikuje się od ${MIN_RESULTS} wyników. Wcześniej mówiłyby więcej o konkretnym wujku niż o społeczeństwie.`,
      census: "Pełne wyniki: Narodowy Spis Dziadersów",
    },
    observations: {
      title: "Dział II. Obserwacje terenowe",
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
      none: "Zjawisko nie wystąpiło. Teren czeka na pierwszego obserwatora.",
      chart: "O której Polacy widzą dziadersa",
      peak: (hour: number, remark: string) => `Najwięcej zgłoszeń o godzinie ${hour}:00. ${remark}`,
      evening: "Wtedy wraca się z pracy i widać cały parking.",
      morning: "Wtedy dziaders myje samochód i jest dobrze widoczny.",
      midday: "O tej porze dziaders jest w szczytowej formie, a obserwator ma przerwę.",
      empty: "Wykres wypełni się wraz z pierwszymi zgłoszeniami. Godziny liczone według czasu warszawskiego.",
      chartSource: "Źródło: IBD. Liczba zgłoszeń według godziny, czas warszawski.",
      key: (unit: number) => `1 lornetka = ${formatNumber("pl", unit)} ${plural(unit, "zgłoszenie", "zgłoszenia", "zgłoszeń")}`,
    },
    commission: {
      title: "Dział III. Komisja Orzekająca",
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
      tooFew: "x Za mało głosów. Komisja wskazuje sprawę od pięciu głosów.",
      link: "Do Komisji",
    },
    aids: {
      title: "Dział IV. Pomoce naukowe",
      aside: "Źródło: liczniki Instytutu",
      table: "Użycie pomocy naukowych",
      tableSource: "Źródło: IBD. Liczniki bez identyfikatorów, od 2 października 2026.",
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
      title: "Dział V. Zbiory Instytutu",
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
    conversions: {
      title: "Dział VI. Przeliczenia Instytutu",
      aside: "Dane szacunkowe",
      intro: "Liczby z działów I–V w jednostkach, które rozumie cała rodzina. Metodologia pod każdą pozycją.",
      method: "Metodologia:",
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
    signs: {
      title: "Objaśnienia znaków umownych",
      aside: "Zgodnie z praktyką statystyki publicznej",
      list: [
        ["–", "Kreska", "Zjawisko nie wystąpiło. Wujek twierdzi, że wystąpiło."],
        ["·", "Kropka", "Zupełny brak informacji albo brak informacji wiarygodnych. Dziaders wie, ale nie powie."],
        ["x", "Znak x", "Wypełnienie rubryki jest niemożliwe lub niecelowe. Zwykle dlatego, że pilot zaginął w fotelu."],
        ["w tym", "W tym", "Nie podaje się wszystkich składników sumy. Reszta poszła do szwagra."],
      ],
      note: "Dane są zaokrąglone, więc suma składników może się różnić od wartości ogółem, jak paragon od tego, co pamięta tata. Rozkłady procentowe publikuje się od 30 obserwacji. Liczniki pomocy naukowych nie zawierają identyfikatorów: Instytut wie, ile razy zatrąbiono, ale nie wie kto.",
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
    metaTitle: "Mali statistični letopis dziaderstva",
    description:
      "Mali statistični letopis dziaderstva: pregledi, opazovanja, razsodbe, bingo, Pogovornik in pritiski na hupo. V živo, s preračunom v nedeljske juhe.",
    shareDescription: "Pregledi, opazovanja, razsodbe in pritiski na hupo. S preračunom v nedeljske juhe.",
    variables: ["Pregledi", "Terenska opazovanja", "Razsodbe", "Izjave iz Pogovornika", "Prečrtana polja v bingu", "Pritiski na hupo"],
    cover: { label: "Slika. Kup statističnih letopisov in dziaders, ki jih je bral", spine: "MALI LETOPIS" },
    lead: "Vse, kar je Inštitut preštel od odprtja: preglede, opazovanja, razsodbe, prečrtana polja v bingu in pritiske na hupo. Podatki Nacionalnega popisa, Mreže terenskih opazovalcev, Razsodne komisije in števcev v učnih pripomočkih.",
    metaBefore: "Letopis 2026 · Stanje na ",
    metaAfter: " · posodobitev vsakih nekaj minut",
    contents: "Poglavja Letopisa",
    chapters: ["Pregledi", "Terenska opazovanja", "Razsodna komisija", "Učni pripomočki", "Zbirke Inštituta", "Preračuni Inštituta", "Pojasnila dogovorjenih znakov"],
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
      title: "Poglavje I. Pregledi",
      aside: "Vir: Nacionalni popis dziadersov",
      total: "Pregledi skupaj",
      today: "Od tega danes",
      average: "Povprečni rezultat",
      proxy: "Heteroanamneze",
      proxyNote: "pregledov",
      retakes: "Ponovitve",
      retakeNote: (change: string) => `povpr. sprememba ${change} o. t.`,
      index: "Indeks danes",
      time: "Čas, preživet v ordinacijah Inštituta",
      timeUnknown: "Ni podatka: popis je začasno zaprt.",
      timeNone: "Pojava ni bilo. Prva juha čaka na prvega preiskovanca.",
      timeTotal: (hours: string, broths: string) => `Skupaj ${hours} pregledov, torej ${broths} v nedeljskih enotah.`,
      potKey: (unit: number) =>
        `1 lonec = ${formatNumber("sl", unit)} ${pluralSl(unit, "juha", "juhi", "juhe", "juh")}, torej ${formatNumber("sl", unit * 3)} h pregledov`,
      table: "Preiskovanci po jakosti dziaderstva",
      tableSource: "Vir: Nacionalni popis dziadersov, IBD.",
      tooFew: `Porazdelitve se objavljajo šele od ${MIN_RESULTS} rezultatov naprej. Prej bi povedale več o določenem stricu kot o družbi.`,
      census: "Vsi rezultati: Nacionalni popis dziadersov",
    },
    observations: {
      title: "Poglavje II. Terenska opazovanja",
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
      none: "Pojava ni bilo. Teren čaka na prvega opazovalca.",
      chart: "Ob kateri uri Poljaki vidijo dziadersa",
      peak: (hour: number, remark: string) => `Največ prijav ob ${hour}.00. ${remark}`,
      evening: "Takrat se ljudje vračajo iz službe in se vidi celo parkirišče.",
      morning: "Takrat dziaders pere avto in je dobro viden.",
      midday: "Ob tej uri je dziaders v najboljši formi, opazovalec pa ima malico.",
      empty: "Grafikon se bo napolnil s prvimi prijavami. Ure so štete po varšavskem času.",
      chartSource: "Vir: IBD. Število prijav po urah, varšavski čas.",
      key: (unit: number) => `1 daljnogled = ${formatNumber("sl", unit)} ${pluralSl(unit, "prijava", "prijavi", "prijave", "prijav")}`,
    },
    commission: {
      title: "Poglavje III. Razsodna komisija",
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
      tooFew: "x Premalo glasov. Komisija izpostavi primer šele od petih glasov naprej.",
      link: "Na Komisijo",
    },
    aids: {
      title: "Poglavje IV. Učni pripomočki",
      aside: "Vir: števci Inštituta",
      table: "Raba učnih pripomočkov",
      tableSource: "Vir: IBD. Števci brez identifikatorjev, od 2. oktobra 2026.",
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
      title: "Poglavje V. Zbirke Inštituta",
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
    conversions: {
      title: "Poglavje VI. Preračuni Inštituta",
      aside: "Ocenjeni podatki",
      intro: "Številke iz poglavij I–V v enotah, ki jih razume vsa družina. Metodologija pod vsako postavko.",
      method: "Metodologija:",
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
    signs: {
      title: "Pojasnila dogovorjenih znakov",
      aside: "Po praksi javne statistike",
      list: [
        ["–", "Pomišljaj", "Pojava ni bilo. Stric trdi, da je bil."],
        ["·", "Pika", "Podatka sploh ni ali pa ni zanesljiv. Dziaders ve, pa ne pove."],
        ["x", "Znak x", "Vpis v rubriko ni mogoč ali ni smiseln. Navadno zato, ker se je daljinec izgubil v naslanjaču."],
        ["od tega", "Od tega", "Niso navedeni vsi deli vsote. Ostanek je šel k svaku."],
      ],
      note: "Podatki so zaokroženi, zato se vsota delov lahko razlikuje od skupne vrednosti, kot se račun razlikuje od tega, kar si zapomni oči. Odstotne porazdelitve se objavljajo od 30 opazovanj naprej. Števci učnih pripomočkov ne vsebujejo identifikatorjev: Inštitut ve, kolikokrat je kdo zatrobil, ne ve pa, kdo.",
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
  return pageMetadata(locale, {
    title: t.metaTitle,
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

  /* Dział I. Badania. */
  const tests = census?.total ?? null;
  const hours = tests === null ? null : (tests * 4) / 60;
  const broths = hours === null ? null : hours / 3;
  const enough = (census?.total ?? 0) >= MIN_RESULTS;

  /* Dział II. Obserwacje. */
  const sightings = community?.sightings ?? null;
  const observedSpecies = sightings ? Object.keys(sightings.species).filter((key) => known.has(key)).length : null;
  const topObserved = Object.entries(sightings?.species ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const hoursOfDay = Array.from({ length: 24 }, (_, hour) => sightings?.hours[String(hour)] ?? 0);
  const peakHour = hoursOfDay.indexOf(Math.max(...hoursOfDay));
  const busiest = Math.max(1, ...hoursOfDay);

  /* Dział III. Komisja. Votes are kept under the Polish slugs; the edition's cases share their order. */
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

  /* Dział V. Zbiory. */
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

  /* Dział VI. Przeliczenia. */
  const lines = tally("rozmowki");
  const honks = tally("klakson");
  const crossed = tally("bingo-pole");
  const certificates = tally("certyfikat");
  const accounts = community?.accounts ?? null;
  const daysOpen = Math.max(1, (now - Date.UTC(2026, 9, 1)) / 86_400_000);
  const poolYear = lines ? 2026 + Math.ceil(TOTAL_LINES / (lines / daysOpen) / 365) : null;

  const c = t.conversions;
  const conversions: Conversion[] = [
    {
      value: figure(tests === null ? null : (tests * 7) / 100, (n) => `${decimal(n)} m`),
      label: c.mustache.label,
      method: c.mustache.method(figure(tests === null ? null : (tests * 0.07) / 4.7, decimal)),
    },
    {
      value: figure(broths, t.units.broths),
      label: c.broths.label,
      method: c.broths.method,
    },
    {
      value: figure(honks === null ? null : (honks * 0.6) / 60, (n) => `${decimal(n)} min`),
      label: c.honks.label,
      method: c.honks.method,
    },
    {
      value: figure(lines === null ? null : (lines * 9) / 3600 / 14, c.weddings.value),
      label: c.weddings.label,
      method: c.weddings.method,
    },
    {
      value: figure(crossed === null ? null : crossed / 3, (n) => number(Math.round(n))),
      label: c.uncles.label,
      method: c.uncles.method,
    },
    {
      value: figure(certificates === null ? null : certificates / 12, c.fridges.value),
      label: c.fridges.label,
      method: c.fridges.method,
    },
    {
      value: figure(accounts === null ? null : accounts / 3.4, (n) => `${decimal(n)}%`),
      label: c.drawer.label,
      method: c.drawer.method,
    },
    {
      value: poolYear ? String(poolYear) : figure(lines, number),
      label: c.pool.label(number(TOTAL_LINES)),
      method: c.pool.method,
    },
  ];

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

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/statystyki" }]),
          dataset(locale, "/statystyki", {
            name: t.metaTitle,
            description: t.description,
            datePublished: site.launched,
            temporalCoverage: `${site.launched}/..`,
            dateModified: updated,
            variableMeasured: t.variables,
          }),
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={
          <>
            {t.metaBefore}
            <time dateTime={updated}>
              {formatDate(locale, updated, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </time>
            {t.metaAfter} · <DataLicense />
          </>
        }
        aside={<Cover t={t} />}
      />

      <nav aria-label={t.contents} className="wrap mt-12">
        <ol className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["#badania", "I"],
              ["#obserwacje", "II"],
              ["#komisja", "III"],
              ["#pomoce", "IV"],
              ["#zbiory", "V"],
              ["#przeliczenia", "VI"],
              ["#znaki", ""],
            ] as const
          ).map(([href, numeral], i) => (
            <li key={href} className="border-b border-rule">
              <a href={href} className="group flex items-baseline gap-3 py-3">
                <span className="w-8 font-sans text-[0.85rem] font-semibold text-red">{numeral}</span>
                <span className="font-bold leading-tight transition-colors group-hover:text-red">{t.chapters[i]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="badania" title={t.tests.title} aside={t.tests.aside}>
        <Figures
          items={[
            [t.tests.total, figure(tests, number)],
            [t.tests.today, figure(census?.today, number)],
            [t.tests.average, figure(census?.average, (n) => `${pct(n)}%`)],
            [t.tests.proxy, figure(census ? share(census.proxy, census.total) : null, (n) => `${n}%`), t.tests.proxyNote],
            [
              t.tests.retakes,
              figure(census?.retakes, number),
              census?.retakeChange ? t.tests.retakeNote(`${census.retakeChange > 0 ? "+" : ""}${decimal(census.retakeChange)}`) : undefined,
            ],
            [t.tests.index, `${pct(bulletin.index.value)}%`, bulletin.index.zone.label],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="font-bold leading-tight">{t.tests.time}</h3>
            <p className="mt-1 max-w-xl leading-snug text-ink-soft">
              {typo(hours === null ? t.tests.timeUnknown : hours === 0 ? t.tests.timeNone : t.tests.timeTotal(t.units.hours(hours), t.units.broths(broths ?? 0)))}
            </p>
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
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">x</span>
                  {typo(t.tests.tooFew)}
                </p>
              )}
            </Table>
            <Link href="/spis" className="link mt-5 inline-block font-sans font-medium">
              {t.tests.census}
            </Link>
          </div>
        </div>
      </Section>

      <Section id="obserwacje" title={t.observations.title} aside={t.observations.aside}>
        <Figures
          items={[
            [t.observations.total, figure(sightings?.total, number)],
            [t.observations.today, figure(sightings?.today, number)],
            [t.observations.observers, figure(sightings?.observers, number)],
            [
              t.observations.perObserver,
              figure(sightings && sightings.observers ? sightings.total / sightings.observers : sightings ? 0 : null, decimal),
              t.observations.perObserverNote,
            ],
            [t.observations.species, figure(observedSpecies, number), t.observations.of(SPECIES.length)],
            [t.observations.regions, figure(sightings ? Object.keys(sightings.regions).length : null, number), t.observations.of(16)],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Table t={t} number={2} title={t.observations.table} source={t.observations.tableSource}>
              {topObserved.length ? (
                <ol>
                  {topObserved.map(([key, n], i) => {
                    const species = known.get(key)!;
                    return (
                      <li key={key} className="grid grid-cols-[1.5rem_3rem_1fr_auto] items-center gap-3 border-b border-rule py-2">
                        <span className="font-sans text-[0.85rem] font-semibold text-red">{i + 1}</span>
                        <SpeciesPlate species={key as SpeciesKey} className="w-full" />
                        <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                          {species.name}
                        </Link>
                        <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{number(n)}</span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">–</span>
                  {typo(t.observations.none)}
                </p>
              )}
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
                  sightings && sightings.total
                    ? t.observations.peak(
                        peakHour,
                        peakHour >= 17 && peakHour <= 20 ? t.observations.evening : peakHour < 9 ? t.observations.morning : t.observations.midday,
                      )
                    : t.observations.empty,
                )}
              </p>
              <p className="label mt-3 text-ink-faint">{t.observations.chartSource}</p>
            </figure>
            <div className="mt-10">
              <Picture
                t={t}
                kind="binoculars"
                value={sightings?.total ?? null}
                label={t.units.sightings(sightings?.total ?? 0)}
                unitLabel={t.observations.key}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="komisja" title={t.commission.title} aside={t.commission.aside}>
        <Figures
          items={[
            [t.commission.votes, figure(verdicts?.total, number)],
            [t.commission.jurors, figure(verdicts?.jurors, number)],
            [t.commission.cases, number(CASES.length)],
            [t.commission.agreement, figure(verdicts ? share(agreeing, allVotes) : null, (n) => `${n}%`), t.commission.ofVotes],
            [t.commission.clinical, figure(verdicts ? share(totals.kliniczne, allVotes) : null, (n) => `${n}%`), t.commission.ofVotes],
            [t.commission.submissions, figure(community?.submissions, number), t.commission.submissionsNote],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Table t={t} number={3} title={t.commission.table}>
              {allVotes ? (
                <>
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
                        <span className="tabular-nums text-ink-soft">{number(totals[option.key])}</span>
                        <span className="text-right font-semibold tabular-nums">{share(totals[option.key], allVotes)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">{verdicts ? "–" : "·"}</span>
                  {typo(verdicts ? t.commission.none : t.commission.unknown)}
                </p>
              )}
            </Table>
            <div className="mt-10">
              <Picture t={t} kind="gavel" value={verdicts?.total ?? null} label={t.units.votes(verdicts?.total ?? 0)} unitLabel={t.commission.key} />
            </div>
          </div>
          <div className="space-y-8 lg:col-span-5">
            {[
              { label: t.commission.disputed, item: disputed },
              { label: t.commission.unanimous, item: unanimous !== disputed ? unanimous : undefined },
            ].map(({ label, item }) => (
              <div key={label} className="border-t border-ink pt-4">
                <p className="label text-ink-soft">{label}</p>
                {item ? (
                  <Link href={`/czy-to-juz-dziaderstwo/${item.slug}`} className="group mt-2 block">
                    <span className="label block text-ink-faint">{docket(item)}</span>
                    <span className="block text-2xl font-bold leading-tight group-hover:text-red">{item.title}</span>
                  </Link>
                ) : (
                  <p className="mt-2 leading-snug text-ink-soft">{typo(t.commission.tooFew)}</p>
                )}
              </div>
            ))}
            <Link href="/czy-to-juz-dziaderstwo" className="btn border border-ink hover:bg-ink hover:text-paper">
              {t.commission.link} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section id="pomoce" title={t.aids.title} aside={t.aids.aside}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Table t={t} number={4} title={t.aids.table} source={t.aids.tableSource}>
              <table className="w-full font-sans text-[0.95rem]">
                <tbody>
                  {t.aids.rows.map((label, i) => {
                    const value = usage[i];
                    return value === null && /^[A-ZĄĆČĘŁŃÓŚŠŹŻŽ]/.test(label) ? (
                      <tr key={`${label}-${i}`} className="border-b border-ink">
                        <th scope="rowgroup" colSpan={2} className="pb-2 pt-5 text-left font-serif text-[1.1rem] font-bold">
                          {label}
                        </th>
                      </tr>
                    ) : (
                      <tr key={`${label}-${i}`} className="border-b border-rule">
                        <th scope="row" className="py-2 pl-4 text-left font-normal text-ink-soft">
                          {label}
                        </th>
                        <td className="py-2 text-right font-semibold tabular-nums">{figure(value, number)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Table>
          </div>
          <div className="space-y-10 lg:col-span-6">
            {(
              [
                ["horn", tally("klakson")],
                ["bubble", tally("rozmowki")],
                ["cross", tally("bingo-pole")],
                ["exam", tally("egzamin")],
              ] as const
            ).map(([kind, value]) => {
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
        </div>
      </Section>

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
