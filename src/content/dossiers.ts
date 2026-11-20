import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { DOSSIER_TEXT } from "./sl/dossiers";
import { DOSSIER_SLUGS } from "./sl/slugs/dossiers";
import type { SpeciesKey } from "./species";

export type Dossier = {
  slug: string;
  code: string;
  bingo: string;
  title: string;
  short: string;
  season: string;
  lead: string;
  introduction: string[];
  signals: string[];
  protocol: { title: string; text: string }[];
  packing: string[];
  species: SpeciesKey[];
  dictionary: string[];
  caseSlug: string;
  reportSlug?: string;
  /** Questions readers search for around the occasion; shown with FAQPage data. */
  questions?: { question: string; answer: string }[];
  notes?: string[];
};

/** Editorial guides; references keep their Polish keys in both editions. */
export const DOSSIERS: Dossier[] = [
  {
    slug: "wigilia",
    code: "IBD-O 01",
    bingo: "wigilia",
    title: "Wigilia z dziadersem",
    short: "Wigilia",
    season: "24 grudnia · stół rodzinny",
    lead: "Przewodnik terenowy po kolacji, podczas której temperatura w pokoju rośnie, a termostat pozostaje na dwójce. Objawy, wokalizacje i bingo wigilijne do druku.",
    introduction: [
      "Dziaders Wigilijny pojawia się przed pierwszą gwiazdką. Sprawdza, czy krzesła nie rysują podłogi, ustala kolejność potraw i przypomina, że w zeszłym roku ryba była tańsza. Nie trzeba go szukać. Sam obejmuje stanowisko.",
      "Obserwację prowadź przy własnym talerzu. Zapisuj wypowiedzi, nie nazwiska. Jedno zdanie o cenie karpia nie przesądza o rozpoznaniu; powtórzenie go po każdym daniu pozwala już wyznaczyć rytm aktywności.",
    ],
    signals: [
      "Pilot znika przed rozpoczęciem kolacji.",
      "Liczba potraw jest sprawdzana dwukrotnie.",
      "Cena karpia wraca w trzech różnych rozmowach.",
      "Każdy prezent wymaga odczytania instrukcji przez gospodarza.",
    ],
    protocol: [
      {
        title: "Przed pierwszą gwiazdką",
        text: "Rozdaj karty bingo i przygotuj długopisy. Ustal, że skreśla się zasłyszane zdania, a nie uczestników kolacji. Telefon odłóż ekranem do dołu.",
      },
      {
        title: "W trakcie kolacji",
        text: "Obserwuj bez podpowiadania haseł. Pytanie o zeszłoroczny rachunek za ogrzewanie jest ingerencją w środowisko, nie badaniem terenowym.",
      },
      {
        title: "Po kompotach",
        text: "Porównaj karty. Pięć pól w jednej linii oznacza bingo. Sporną wypowiedź skieruj do Komisji; rodzinne głosowanie można przeprowadzić po deserze.",
      },
    ],
    packing: [
      "Cztery różne karty na jednym arkuszu A4",
      "Długopis dla każdego obserwatora",
      "Atlas otwarty na gatunku wigilijnym",
      "Zapas cierpliwości bez daty ważności",
    ],
    species: ["wigilijny", "oszczednosciowy", "meteorologiczny"],
    dictionary: ["znowu-puszczaja-kevina", "umawialismy-sie-ze-bez-prezentow", "za-moich-czasow"],
    caseSlug: "prasowany-papier",
    reportSlug: "sezon-grzewczy",
    questions: [
      {
        question: "Ile potraw powinno być na Wigilię?",
        answer:
          "Tradycyjnie dwanaście, bezmięsnych: między innymi barszcz z uszkami, karp, pierogi, kapusta z grochem, kutia i kompot z suszu. W wielu domach liczy się je umownie. Dziaders Wigilijny liczy dwa razy i zawsze wychodzi mu jedenaście.",
      },
      {
        question: "Kiedy zaczyna się wieczerza wigilijna?",
        answer:
          "Według zwyczaju, gdy na niebie pojawi się pierwsza gwiazdka. W praktyce o godzinie ustalonej przez osobę, która pilnuje karpia, i niezależnie od zachmurzenia.",
      },
      {
        question: "Co to jest opłatek?",
        answer:
          "Cienki wafel z mąki i wody, którym przed kolacją dzielą się wszyscy przy stole, składając sobie życzenia. To moment, w którym Dziaders Wigilijny życzy wszystkim zdrowia, a potem przez dwie minuty wyjaśnia, co jest zdrowe.",
      },
      {
        question: "Po co wolne nakrycie przy wigilijnym stole?",
        answer:
          "Dodatkowe nakrycie zostawia się dla niespodziewanego gościa, a w wielu rodzinach także na pamiątkę bliskich, których przy stole już nie ma. W obserwacjach Instytutu to jedyne krzesło, którego nikt nie przesuwa.",
      },
      {
        question: "Jak przetrwać Wigilię z dziadersem?",
        answer:
          "Ustal wcześniej bezpieczne tematy, usiądź z dala od termostatu i rozdaj bingo. Skreślanie zdań zamiast odpowiadania na nie obniża temperaturę rozmowy o kilka stopni. Sporne wypowiedzi zostaw Komisji.",
      },
    ],
  },
  {
    slug: "wesele",
    code: "IBD-O 02",
    bingo: "wesele",
    title: "Wesele z dziadersem",
    short: "Wesele",
    season: "Od rosołu do ostatniego utworu",
    lead: "Instrukcja obserwacji przy stole numer siedem. Jak rozpoznać gatunek weselny, co zanotować i kiedy rozdać bingo weselne.",
    introduction: [
      "Dziaders Weselny ocenia salę, zespół i koszt jednego talerza, zanim pojawi się rosół. Pierwszy taniec ogląda z pozycji eksperta. Sam tańczy dopiero po zgłoszeniu uwag do repertuaru.",
      "Najlepsze stanowisko obserwacyjne znajduje się przy stole. Na parkiecie trudniej sporządzać notatki, a wypowiedź o cenie sali może zostać zagłuszona przez saksofon. Materiał zbieraj między daniami.",
    ],
    signals: [
      "Koszt jednego talerza zostaje ustalony przed rosołem.",
      "Zespół otrzymuje instrukcje dotyczące normalnej muzyki.",
      "Droga do domu jest omawiana jeszcze przed tortem.",
      "Koperta ma własną historię rozliczeniową.",
    ],
    protocol: [
      {
        title: "Zajmij stanowisko",
        text: "Rozdaj karty osobom, które chcą grać. Na każdym stole może działać osobny zespół obserwacyjny. Nie blokuj miejsca dla kelnera.",
      },
      {
        title: "Notuj między daniami",
        text: "Skreślaj sens wypowiedzi, nie wymagaj cytatu słowo w słowo. Wykład o dojeździe i wykład o cenach paliwa to dwa zjawiska, nawet jeśli nie było między nimi pauzy.",
      },
      {
        title: "Zamknij protokół",
        text: "Bingo ogłoś przy własnym stole. Mikrofon zespołu pozostaje poza wyposażeniem badawczym. Wyniki porównaj przed wyjazdem, gdy wszyscy jeszcze pamiętają, kto mówił.",
      },
    ],
    packing: [
      "Karty bingo weselnego",
      "Długopis, który pisze",
      "Numer własnego stołu",
      "Buty umożliwiające zmianę stanowiska",
    ],
    species: ["weselny", "moto", "korpo"],
    dictionary: ["pusc-pan-cos-normalnego", "ile-pan-za-to-dal", "za-moich-czasow"],
    caseSlug: "zeszyt-weselny",
  },
  {
    slug: "majowka",
    code: "IBD-O 03",
    bingo: "majowka",
    title: "Majówka z dziadersem",
    short: "Majówka",
    season: "Długi weekend · działka i grill",
    lead: "Przewodnik po stanowisku grillowym. Rozpoznawanie gatunków, bezpieczny dystans od szczypiec i bingo na majówkę do wydrukowania.",
    introduction: [
      "Majówka skupia trzy silne populacje: grillową, działkową i meteorologiczną. Wszystkie wiedzą, jak rozpalić. Żadna nie odpowiada za deszcz. Stanowisko dowodzenia rozpoznasz po człowieku, który nie oddaje szczypiec.",
      "Badanie rozpocznij przed rozłożeniem leżaka. Później pole widzenia zasłania dym, a zdania o karkówce stają się częścią tła. Nie poprawiaj sposobu rozpalania tylko po to, żeby uzyskać reakcję.",
    ],
    signals: [
      "Szczypce mają jednego użytkownika.",
      "Prognoza pogody jest odświeżana częściej niż ruszt.",
      "Cudza kosiarka zakłóca ciszę, własna wykonuje pracę.",
      "Każda porcja karkówki musi swoje odstać.",
    ],
    protocol: [
      {
        title: "Wyznacz teren",
        text: "Wybierz stolik poza dymem. Karty i długopisy rozdaj przed jedzeniem. Talerz nie służy do przytrzymywania protokołu.",
      },
      {
        title: "Zachowaj dystans",
        text: "Szczypce są narzędziem i insygnium. Obserwuj przekazanie, ale nie inicjuj go. Spór o węgiel zanotuj bez dokładania własnej teorii.",
      },
      {
        title: "Porównaj obserwacje",
        text: "Pięć pól w linii kończy rundę. Kartę można nadal uzupełniać. Po powrocie sprawdź w Atlasie, czy oglądałeś jeden gatunek, czy zespół mieszany.",
      },
    ],
    packing: [
      "Bingo na majówkę",
      "Podkładka pod arkusz",
      "Nakrycie głowy",
      "Własna opinia o musztardzie, zachowana dla siebie",
    ],
    species: ["grill", "dzialka", "meteorologiczny"],
    dictionary: ["nie-tak-sie-rozpala", "karkowka-musi-swoje-odstac", "swoje-bez-chemii"],
    caseSlug: "mycie-w-sobote",
    reportSlug: "sandal-a-skarpeta",
  },
  {
    slug: "imieniny",
    code: "IBD-O 04",
    bingo: "imieniny",
    title: "Imieniny z dziadersem",
    short: "Imieniny",
    season: "Cały rok · duży pokój i wersalka",
    lead: "Przewodnik po przyjęciu w dużym pokoju, od kapci w przedpokoju po pożegnanie w przedpokoju. Rodzinne objawy dziaderstwa, typowe pytania i bingo imieninowe do druku.",
    introduction: [
      "Imieniny to rodzinne święto, które w wielu polskich domach wciąż wygrywa z urodzinami. Odbywają się w dużym pokoju, przy rozłożonym stole i meblościance, która wie więcej niż goście. Dziaders przychodzi z bukietem i od progu sprawdza, czy można nie zdejmować butów.",
      "Obserwację prowadź z wersalki, najlepiej z miejsca środkowego. Stamtąd słychać zarówno rozmowę o pensjach, jak i naradę na balkonie. Zapisuj pytania o pracę i mieszkanie, ale nie odpowiadaj na nie wyczerpująco: dokładna odpowiedź wydłuża czas trwania objawu.",
    ],
    signals: [
      "Kapcie dla gości czekają w przedpokoju, zanim ktokolwiek przyjdzie.",
      "Pierwsze pytanie dotyczy pracy, drugie pensji.",
      "Telewizor chodzi cały wieczór bez głosu.",
      "Pożegnanie w przedpokoju trwa dłużej niż deser.",
    ],
    protocol: [
      {
        title: "Po pierwszym „Sto lat”",
        text: "Rozdaj karty bingo osobom, które chcą grać. Solenizanta zwolnij z obserwacji: ma dość obowiązków przy krojeniu tortu.",
      },
      {
        title: "Przy stole",
        text: "Notuj pytania, nie odpowiedzi. „A ile ci tam płacą?” skreśl raz, nawet jeśli padło przy każdym daniu. Cudzej pensji nie licz na serwetce; to zadanie wujka.",
      },
      {
        title: "W przedpokoju",
        text: "Protokół zamknij przed pożegnaniem, bo pożegnanie może potrwać godzinę. Wyniki porównaj na klatce schodowej, ściszonym głosem.",
      },
    ],
    packing: [
      "Karty bingo imieninowego",
      "Własne kapcie, na wszelki wypadek",
      "Długopis schowany przed wujkiem z krzyżówką",
      "Gotowa odpowiedź na pytanie o pensję",
    ],
    species: ["parapetowy", "oszczednosciowy", "budowa"],
    dictionary: ["ja-w-twoim-wieku", "co-ludzie-powiedza", "umawialismy-sie-ze-bez-prezentow"],
    caseSlug: "folia-na-fotelach",
    reportSlug: "pilot-od-telewizora",
    questions: [
      {
        question: "Czym są imieniny?",
        answer:
          "To święto obchodzone w dniu patrona, którego imię nosi solenizant, według kalendarza imion. W Polsce, zwłaszcza w starszych pokoleniach, bywały ważniejsze od urodzin: wiadomo, kiedy wypadają, i nikt nie pyta o wiek.",
      },
      {
        question: "Jak wyglądają imieniny w polskim domu?",
        answer:
          "Goście przychodzą z kwiatami, składają życzenia i śpiewają „Sto lat”. Potem są sałatka jarzynowa, ciepłe danie i tort. Instytut odnotowuje też pytania o pracę, pensję, mieszkanie i plany ślubne, zadawane w tej kolejności.",
      },
      {
        question: "Imieniny czy urodziny?",
        answer:
          "Zależy od rodziny. Młodsze pokolenia częściej obchodzą urodziny, starsze imieniny. Dziaders obchodzi jedno i drugie, ale przy każdym przypomina, że kiedyś obchodziło się tylko imieniny.",
      },
    ],
  },
];

const EDITIONS = {
  pl: DOSSIERS,
  sl: overlayList("dossiers", DOSSIERS, (item) => item.slug, DOSSIER_TEXT).map((item) => ({
    ...item,
    slug: DOSSIER_SLUGS[item.slug],
  })),
};
export const getDossiers = (locale: Locale) => EDITIONS[locale];
export const dossierBySlug = (slug: string, locale: Locale) => getDossiers(locale).find((item) => item.slug === slug);
