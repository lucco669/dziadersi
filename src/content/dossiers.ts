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
