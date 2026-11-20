import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import type { SpeciesKey } from "./species";
import type { SpecimenIndex } from "./specimens";
import * as sl from "./sl/wishes";

/*
 * Życzenia od Instytutu: greetings issued as an official letter. A card is the chapter's salutation,
 * then an opener (wstęp), a wish (życzenie) and a closing line (zakończenie), signed "Z wyrazami
 * szacunku, IBD". Every part is a whole sentence, so any three of a chapter read as one letter:
 * no sentence may lean on another, and the shared ones must not address anyone by gender.
 *
 * Lists are append-only: shared cards link to positions (one base36 digit each, so at most 36),
 * so never remove or reorder an entry, and never append to the shared lists below (that would move
 * every chapter's own entries). Add new sentences at the end of a chapter's own list.
 *
 * A new occasion (Wielkanoc, imieniny) is one entry in OCCASIONS and its chapters below, with
 * chapter slugs that start with the occasion ("wielkanoc-wujek"), plus the Slovenian overlay.
 */

export type WishOccasionSlug = "swieta" | "nowy-rok";

export type WishOccasion = {
  slug: WishOccasionSlug;
  /** "Święta": the group of tabs. */
  name: string;
  /** "Dotyczy: …" on the letter. */
  subject: string;
  /** The place and date line, timeless on purpose: a card says the same thing every year. */
  dateline: string;
  /** When the occasion is offered first and linked from the calendar, as "MM-DD", inclusive; may wrap the new year. */
  season: { from: string; to: string };
  /** The bingo occasion of the field guide that links here (`/okazje/…`). */
  dossier?: string;
};

export type WishChapter = {
  /** Part of every card code. Never change it. */
  slug: string;
  occasion: WishOccasionSlug;
  /** "Dla wujka": tabs and headings. */
  name: string;
  /** "Wujek": labels. */
  short: string;
  /** "Szanowny Panie Wujku,": the first line of the letter. */
  salutation: string;
  /** Who signs with the Institute, under "IBD". */
  cosigner?: string;
  /** The illustration on the letter: a specimen of an Atlas species. */
  plate: { species: SpeciesKey; specimen: SpecimenIndex };
  openers: string[];
  wishes: string[];
  closers: string[];
};

export const OCCASIONS: WishOccasion[] = [
  {
    slug: "swieta",
    name: "Święta",
    subject: "Dotyczy: życzeń świątecznych",
    dateline: "Warszawa, w okresie przedświątecznym",
    season: { from: "12-01", to: "12-26" },
    dossier: "wigilia",
  },
  {
    slug: "nowy-rok",
    name: "Nowy Rok",
    subject: "Dotyczy: życzeń noworocznych",
    dateline: "Warszawa, na przełomie roku",
    season: { from: "12-27", to: "01-06" },
  },
];

/** Frozen: every Christmas chapter starts with these, in this order. */
const OPENERS = [
  "W związku ze zbliżającymi się Świętami Instytut przesyła niniejsze życzenia.",
  "Uprzejmie informujemy, że okres świąteczny rozpoczął się zgodnie z harmonogramem.",
  "Na podstawie 412 obserwacji terenowych Instytut składa następujące życzenia.",
  "Instytut ustalił, że Wigilia przypada, jak co roku, 24 grudnia.",
  "Po konsultacji z Działem Korespondencji Okolicznościowej przekazujemy życzenia w trybie zwykłym.",
  "Niniejszym przekazujemy życzenia świąteczne w brzmieniu uzgodnionym z rodziną.",
  "Pismo doręczamy przed pierwszą gwiazdką, z zachowaniem terminu.",
  "Instytut odnotowuje kolejny rok bez zmian w układzie stołu i składa życzenia.",
];

/** Frozen: every Christmas chapter's wishes start with these, in this order. */
const WISHES = [
  "Życzymy, aby karp zwolnił wannę najpóźniej 23 grudnia o 18:00.",
  "Życzymy dwunastu potraw, w tym najwyżej trzech z kapustą.",
  "Życzymy, aby pilot od telewizora znalazł się przed „Kevinem”, a nie w trakcie.",
  "Życzymy skarpet w kolorze innym niż w ubiegłym roku, przy zachowaniu rozmiaru.",
  "Życzymy, aby lampki na choince zaświeciły za pierwszym razem, bez szukania przepalonej żarówki.",
  "Życzymy pierogów w liczbie podzielnej przez liczbę gości.",
];

/** Frozen: every Christmas chapter ends with these, in this order. */
const CLOSERS = [
  "Życzenia są ważne do 6 stycznia i nie podlegają wymianie.",
  "Pismo nie wymaga odpowiedzi, ale Instytut odnotuje jej brak.",
  "Kopię niniejszych życzeń zachowano w aktach.",
  "Potwierdzenie odbioru prosimy złożyć przy stole, skinieniem głowy.",
  "Reklamacje przyjmujemy po Świętach, w godzinach 8:00–8:15.",
  "Wszelkie podobieństwo do życzeń z ubiegłego roku jest zamierzone.",
  "Brak odpowiedzi w ciągu 14 dni Instytut uzna za odwzajemnienie życzeń.",
  "Życzenia można przekazać dalej bez zmiany treści.",
];

export const CHAPTERS: WishChapter[] = [
  {
    slug: "swieta-wujek",
    occasion: "swieta",
    name: "Dla wujka",
    short: "Wujek",
    salutation: "Szanowny Panie Wujku,",
    plate: { species: "wigilijny", specimen: 0 },
    openers: [
      ...OPENERS,
      "Instytut odnotowuje, że Pan Wujek od 31 lat zajmuje to samo miejsce przy stole.",
      "Na wstępie dziękujemy za coroczny instruktaż krojenia karpia.",
    ],
    wishes: [
      ...WISHES,
      "Życzymy, aby opowieść o maluchu z 1987 roku znalazła w tym roku nowego słuchacza.",
      "Życzymy, aby fotel przed telewizorem pozostał wolny przez cały czas Pana pobytu w kuchni.",
      "Życzymy drzemki w fotelu najpóźniej o 19:40, zgodnie z tradycją.",
      "Życzymy, aby droga powrotna przebiegła dokładnie tak, jak Pan ją zaplanował przy stole.",
      "Życzymy, aby toast wygłoszony na stojąco zmieścił się w sześciu minutach.",
      "Życzymy, aby choinka stała w tym roku prosto, bez podkładania gazety pod stojak.",
    ],
    closers: [
      ...CLOSERS,
      "Odpowiedź „Dzięki, wzajemnie” zostanie przyjęta jako wystarczająca.",
      "Miejsce przy stole pozostaje zarezerwowane, jak co roku.",
    ],
  },
  {
    slug: "swieta-szwagier",
    occasion: "swieta",
    name: "Dla szwagra",
    short: "Szwagier",
    salutation: "Szanowny Panie Szwagrze,",
    plate: { species: "wigilijny", specimen: 1 },
    openers: [
      ...OPENERS,
      "Instytut przesyła życzenia wraz z podziękowaniem za wiertarkę pożyczoną w maju.",
      "Na wstępie przypominamy, że w tym roku to Pan przywozi krzesła.",
    ],
    wishes: [
      ...WISHES,
      "Życzymy, aby myjnia była czynna 23 grudnia, a kolejka krótsza niż trzy samochody.",
      "Życzymy, aby w tym roku nikt przy stole nie zapytał, ile to pali na setkę.",
      "Życzymy miejsca parkingowego pod blokiem w odległości nie większej niż 40 metrów.",
      "Życzymy, aby dodatkowego nakrycia dla wędrowca nie zajął tym razem Pan.",
      "Życzymy, aby zimówki założone w październiku wreszcie się przydały.",
      "Życzymy pod choinką klucza, którego jeszcze nie ma Pan w zestawie.",
    ],
    closers: [
      ...CLOSERS,
      "Wiertarkę można oddać przy okazji, najlepiej przed Wielkanocą.",
      "Dalsze ustalenia w sprawie parkowania przekażemy telefonicznie.",
    ],
  },
  {
    slug: "swieta-szef",
    occasion: "swieta",
    name: "Dla szefa",
    short: "Szef",
    salutation: "Szanowna Dyrekcjo,",
    plate: { species: "korpo", specimen: 1 },
    openers: [
      ...OPENERS,
      "W nawiązaniu do ostatniego spotkania przesyłamy życzenia świąteczne.",
      "Zgodnie z ustaleniami z poniedziałkowego statusu Instytut składa życzenia.",
    ],
    wishes: [
      ...WISHES,
      "Życzymy, aby skrzynka odbiorcza osiągnęła zero 23 grudnia i tak już została.",
      "Życzymy, aby żadne spotkanie nie zostało przełożone na 27 grudnia.",
      "Życzymy, aby sprawy „na wczoraj” zaczekały do stycznia.",
      "Życzymy wyniku powyżej planu i Wigilii bez telefonu z biura.",
      "Życzymy, aby automatyczna odpowiedź „Jestem poza biurem” była w tym roku prawdziwa.",
      "Życzymy kalendarza bez ani jednego zaproszenia od 24 grudnia do 1 stycznia.",
    ],
    closers: [...CLOSERS, "Prosimy nie odpowiadać do wszystkich.", "Pozostajemy do dyspozycji od 2 stycznia, od 9:00."],
  },
  {
    slug: "swieta-rodzina",
    occasion: "swieta",
    name: "Od całej rodziny",
    short: "Rodzina",
    salutation: "Szanowni Państwo,",
    cosigner: "w imieniu całej rodziny, w komplecie",
    plate: { species: "wigilijny", specimen: 2 },
    openers: [
      ...OPENERS,
      "Cała rodzina, po głosowaniu przy stole, przekazuje życzenia jednogłośnie.",
      "Rodzina przesyła życzenia za pośrednictwem Instytutu, bo na grupie i tak nikt nie czyta.",
    ],
    wishes: [
      ...WISHES,
      "Życzymy, aby grupa rodzinna miała w tym roku mniej niż 400 nieprzeczytanych wiadomości.",
      "Życzymy wspólnego zdjęcia za pierwszym podejściem, wszyscy z otwartymi oczami.",
      "Życzymy, aby nikt nie spał na rozkładanym fotelu dłużej niż dwie noce.",
      "Życzymy, aby resztki z Wigilii skończyły się przed sylwestrem.",
      "Życzymy, aby nikt przy stole nie zapytał, kiedy ślub, kiedy dzieci ani ile to kosztowało.",
      "Życzymy, aby wszyscy dojechali na czas, bez tłumaczenia się korkiem na obwodnicy.",
    ],
    closers: [...CLOSERS, "Podpisano w imieniu wszystkich, także nieobecnych.", "Zdjęcie z kolacji zostanie przesłane na grupę w trzech kopiach."],
  },
  {
    slug: "nowy-rok",
    occasion: "nowy-rok",
    name: "Na Nowy Rok",
    short: "Nowy Rok",
    salutation: "Szanowni Państwo,",
    plate: { species: "weselny", specimen: 1 },
    openers: [
      "Z okazji Nowego Roku Instytut składa życzenia w terminie.",
      "Instytut potwierdza, że Nowy Rok rozpocznie się zgodnie z planem, o północy.",
      "Po zamknięciu ksiąg Instytut stwierdza, że stary rok dobiegł końca.",
      "Na wstępie dziękujemy za współpracę w mijającym roku, także tę nieudaną.",
      "Uprzejmie informujemy, że ubiegłoroczne postanowienia zamknięto bez rozpatrzenia.",
      "W związku z końcem roku kalendarzowego przesyłamy życzenia w trybie zwykłym.",
      "Instytut przeliczył mijający rok i składa życzenia na kolejne 365 dni.",
      "Niniejszym otwieramy nowy rok obserwacyjny i składamy życzenia.",
      "Pismo wysyłamy przed północą, zanim sieć się zatnie.",
      "Zgodnie z tradycją Instytut składa życzenia, zanim ktoś otworzy szampana.",
    ],
    wishes: [
      "Życzymy, aby szampan otworzył się o północy, a nie o 23:58 w stronę żyrandola.",
      "Życzymy, aby o północy wszystkie zegarki w domu pokazywały tę samą godzinę.",
      "Życzymy, aby data w dokumentach przestała się mylić najpóźniej w połowie lutego.",
      "Życzymy, aby postanowienia noworoczne przetrwały co najmniej do pierwszego poniedziałku.",
      "Życzymy, aby karnet na siłownię był w tym roku używany dłużej niż do 19 stycznia.",
      "Życzymy, aby fajerwerki sąsiada skończyły się przed 0:15.",
      "Życzymy roku, w którym pytanie „kiedy ślub” padnie najwyżej raz.",
      "Życzymy, aby koncert sylwestrowy w telewizji było słychać tylko w jednym pokoju.",
      "Życzymy, aby wszystkie życzenia z grupy rodzinnej udało się przeczytać do 3 stycznia.",
      "Życzymy, aby nowy kalendarz zawisł na ścianie przed 10 stycznia.",
      "Życzymy, aby sałatka jarzynowa przeszła na kolejny rok w nie więcej niż jednej misce.",
      "Życzymy, aby wszystkie SMS-y z życzeniami doszły jeszcze tej samej nocy.",
    ],
    closers: [
      "Niewykorzystane życzenia przechodzą na kolejny rok.",
      "Życzenia obowiązują przez 365 dni, z wyjątkiem poniedziałków.",
      "Bilans roku Instytut prześle odrębnym pismem.",
      "Prosimy zachować to pismo do 31 grudnia w celach porównawczych.",
      "Do siego roku. Tak się mówi, Instytut sprawdzał.",
      "Kolejne życzenia Instytut prześle za rok, o ile nic się nie zmieni.",
      "Pismo nie wymaga odpowiedzi przed 2 stycznia.",
      "Kopię życzeń zachowano w aktach na wypadek reklamacji.",
      "Życzenia sporządzono w jednym egzemplarzu, do rozesłania wszystkim.",
      "Odpowiedź „Wzajemnie” Instytut przyjmuje do wiadomości.",
    ],
  },
];

/* Editions: the Polish lists above with each edition's text laid over them. */

const EDITIONS = {
  pl: { occasions: OCCASIONS, chapters: CHAPTERS },
  sl: {
    occasions: overlayList("wishes.OCCASIONS", OCCASIONS, (occasion) => occasion.slug, sl.OCCASIONS),
    chapters: overlayList("wishes.CHAPTERS", CHAPTERS, (chapter) => chapter.slug, sl.CHAPTERS),
  },
} satisfies Record<Locale, { occasions: WishOccasion[]; chapters: WishChapter[] }>;

/** The occasions in the edition's language, in the Polish order. */
export const getWishOccasions = (locale: Locale): WishOccasion[] => EDITIONS[locale].occasions;

/** The chapters in the edition's language: same slugs and lists (by index) as CHAPTERS. */
export const getWishChapters = (locale: Locale): WishChapter[] => EDITIONS[locale].chapters;

