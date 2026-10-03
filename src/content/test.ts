import type { Locale } from "@/i18n/config";
import { overlay } from "@/i18n/overlay";
import * as sl from "./sl/test";
import type { SpeciesKey } from "./species";

export type Weights = Partial<Record<SpeciesKey, number>>;

export type Option = {
  text: string;
  /** Third person, for the family interview. Defaults to `text`. */
  proxy?: string;
  points: number;
  species?: Weights;
};

/** A spot on a picture: `place` is what the respondent sees before choosing, `text` the verdict after. */
export type Zone = Option & { zone: string; place: string };

/** Something to tick in a drawer or a boot, drawn by its `icon`. */
export type Thing = Option & { icon: string };

type Base = {
  section: string;
  /** Room on the routing slip, 0–4. */
  station: number;
  prompt: string;
  /** The prompt in the family interview, about "osoba badana". */
  proxyPrompt: string;
};

export type ChoiceTask = Base & { kind: "choice"; options: Option[] };
export type SmsTask = Base & { kind: "sms"; contact: string; message: string; options: Option[] };
export type BlotTask = Base & { kind: "blot"; plate: string; image: string; width: number; height: number; options: Option[] };
export type WordsTask = Base & { kind: "words"; words: { word: string; options: Option[] }[] };
export type ReflexTask = Base & { kind: "reflex"; outcomes: Record<ReflexOutcome, Option> };
export type MapTask = Base & { kind: "map"; scene: "parking" | "beach"; zones: Zone[]; skip?: Option };
export type InventoryTask = Base & { kind: "inventory"; container: "drawer" | "boot"; things: Thing[]; done: string };
export type ScaleTask = Base & { kind: "scale"; ticks: string[]; steps: Option[] };
export type RapidTask = Base & { kind: "rapid"; seconds: number; statements: Option[] };

export type Task =
  | ChoiceTask
  | SmsTask
  | BlotTask
  | WordsTask
  | ReflexTask
  | MapTask
  | InventoryTask
  | ScaleTask
  | RapidTask;

export type ReflexOutcome = "red" | "amber" | "fast" | "normal" | "slow" | "none";

export type Station = { numeral: string; room: string; name: string; note: string; next: string };

/** The routing slip: five rooms, each stamped on the way out. */
export const STATIONS: Station[] = [
  {
    numeral: "I",
    room: "101",
    name: "Wywiad lekarski",
    note: "Kilka pytań o życie codzienne. Lekarz i tak wie, więc szczerze.",
    next: "Wywiad zakończony. Lekarz coś zanotował i zasłonił kartkę ręką.",
  },
  {
    numeral: "II",
    room: "102",
    name: "Pracownia psychologiczna",
    note: "Plansze Rorschacha i test skojarzeń. Nie ma złych odpowiedzi, są tylko dziaderskie.",
    next: "Psycholog prosi, żeby nie wracać do plansz. Plansze też potrzebują odpoczynku.",
  },
  {
    numeral: "III",
    room: "103",
    name: "Pracownia sprawności",
    note: "Próba klaksonowa i orientacja w terenie. Proszę zapiąć pasy.",
    next: "Sprawność potwierdzona. Instytut nie odpowiada za wgniecenia na parkingu.",
  },
  {
    numeral: "IV",
    room: "104",
    name: "Inwentaryzacja",
    note: "Szuflada, bagażnik, skarpety. To, co trzymasz, mówi więcej niż to, co mówisz.",
    next: "Inwentaryzacja zamknięta. Szuflada wróciła na miejsce, z oporem.",
  },
  {
    numeral: "V",
    room: "105",
    name: "Konsultacja końcowa",
    note: "Ostatnie pytania, ostatnia plansza i seria szybka. Potem pieczątka.",
    next: "",
  },
];

/**
 * Formularz IBD-T2. Never reorder, remove or resize tasks once published: result codes
 * store each answer by position. A new edition gets a new code version instead.
 */
export const TASKS: Task[] = [
  {
    kind: "choice",
    station: 0,
    section: "Motoryzacja",
    prompt: "Sąsiad pokazuje ci swój nowy samochód. Co robisz?",
    proxyPrompt: "Sąsiad pokazuje swój nowy samochód. Co robi osoba badana?",
    options: [
      { text: "Gratuluję i od razu zapominam, jaka to marka.", proxy: "Gratuluje i od razu zapomina, jaka to marka.", points: 0 },
      { text: "Pytam, ile pali w trasie, a ile w mieście.", proxy: "Pyta, ile pali w trasie, a ile w mieście.", points: 1, species: { moto: 1 } },
      {
        text: "Mówię, że za te pieniądze to są dwa Passaty z Niemiec.",
        proxy: "Mówi, że za te pieniądze to są dwa Passaty z Niemiec.",
        points: 2,
        species: { moto: 2 },
      },
      { text: "Bez słowa kopię w oponę i kiwam głową.", proxy: "Bez słowa kopie w oponę i kiwa głową.", points: 3, species: { moto: 3 } },
    ],
  },
  {
    kind: "choice",
    station: 0,
    section: "Komunikacja",
    prompt: "Przychodzi wiadomość: „UDOSTĘPNIJ, ZANIM USUNĄ!!!”. Co robisz?",
    proxyPrompt: "Przychodzi wiadomość: „UDOSTĘPNIJ, ZANIM USUNĄ!!!”. Co robi osoba badana?",
    options: [
      { text: "Wyciszam grupę rodzinną do 2031 roku.", proxy: "Wycisza grupę rodzinną do 2031 roku.", points: 0 },
      { text: "Sprawdzam w internecie. Internet potwierdza.", proxy: "Sprawdza w internecie. Internet potwierdza.", points: 1, species: { facebook: 1 } },
      { text: "Przesyłam rodzinie. Na wszelki wypadek.", proxy: "Przesyła rodzinie. Na wszelki wypadek.", points: 2, species: { facebook: 2 } },
      {
        text: "Udostępniam publicznie i dopisuję trzy wykrzykniki. Dla pewności cztery.",
        proxy: "Udostępnia publicznie i dopisuje trzy wykrzykniki. Dla pewności cztery.",
        points: 3,
        species: { facebook: 3 },
      },
    ],
  },
  {
    kind: "sms",
    station: 0,
    section: "Łączność",
    prompt: "Młody pisze: „jestem”. Co odpisujesz?",
    proxyPrompt: "Młody pisze do osoby badanej: „jestem”. Co ona odpisuje?",
    contact: "Młody",
    message: "jestem",
    options: [
      { text: "k", points: 0 },
      { text: "Dobrze.", points: 1, species: { korpo: 1 } },
      { text: "Dobrze. Pozdrawiam serdecznie", points: 3, species: { korpo: 3 } },
      { text: "DOBRZE SYNU UWAZAJ NA SIEBIE I ZADZWON JAK DOJEDZIESZ", points: 3, species: { smart: 2, facebook: 1 } },
    ],
  },
  {
    kind: "blot",
    station: 1,
    section: "Plansza I",
    plate: "I",
    image: "/plansze/plansza-1.webp",
    width: 820,
    height: 700,
    prompt: "Plansza I. Co widzisz?",
    proxyPrompt: "Plansza I. Co zobaczy w niej osoba badana?",
    options: [
      { text: "Ćmę. Albo motyla. Coś, co lata.", points: 0 },
      { text: "Wąsy po tygodniu bez przycinania.", points: 1 },
      { text: "Karkówkę. Przewróconą za wcześnie.", points: 3, species: { grill: 3 } },
      { text: "Plan działki: altana, kompostownik i miedza sąsiada.", points: 3, species: { dzialka: 3 } },
    ],
  },
  {
    kind: "words",
    station: 1,
    section: "Skojarzenia",
    prompt: "Test skojarzeń. Pierwsze, co przychodzi ci do głowy.",
    proxyPrompt: "Test skojarzeń. Pierwsze, co przyszłoby do głowy osobie badanej.",
    words: [
      {
        word: "Sobota",
        options: [
          { text: "Spanie do południa", points: 0 },
          { text: "Market budowlany", points: 1, species: { budowa: 2 } },
          { text: "Myjnia", points: 1, species: { moto: 2 } },
          { text: "Działka", points: 1, species: { dzialka: 2 } },
        ],
      },
      {
        word: "Lato",
        options: [
          { text: "Festiwal", points: 0 },
          { text: "Parawan", points: 1, species: { wakacje: 2 } },
          { text: "Karkówka", points: 1, species: { grill: 2 } },
          { text: "Szczupak", points: 1, species: { wedka: 2 } },
        ],
      },
      {
        word: "Poniedziałek",
        options: [
          { text: "Kawa", points: 0 },
          { text: "Odprawa o ósmej", points: 1, species: { korpo: 2 } },
          { text: "Aktualizacja Windowsa", points: 1, species: { smart: 2 } },
          { text: "Obrazek „Miłego tygodnia”", points: 1, species: { facebook: 2 } },
        ],
      },
    ],
  },
  {
    kind: "blot",
    station: 1,
    section: "Plansza II",
    plate: "II",
    image: "/plansze/plansza-2.webp",
    width: 805,
    height: 820,
    prompt: "Plansza II. A tutaj?",
    proxyPrompt: "Plansza II. Co zobaczy w niej osoba badana?",
    options: [
      { text: "Dwie osoby przybijają piątkę.", points: 0 },
      { text: "Dyskusję w komentarzach. Jedna strona ma rację.", points: 2, species: { facebook: 2 } },
      { text: "Przód Passata. Ktoś jedzie na długich.", points: 2, species: { moto: 2 } },
      { text: "Dwóch sąsiadów kłóci się o miejsce pod blokiem.", points: 3, species: { parking: 3 } },
    ],
  },
  {
    kind: "reflex",
    station: 2,
    section: "Próba klaksonowa",
    prompt: "Stoisz na światłach. Zapala się zielone, a samochód przed tobą nie rusza. Zatrąb.",
    proxyPrompt: "Zatrąb tak, jak zatrąbiłaby osoba badana. Zapala się zielone, a samochód przed nią nie rusza.",
    outcomes: {
      red: { text: "Trąbienie na czerwonym. Na zapas.", points: 3, species: { moto: 2, parking: 1 } },
      amber: { text: "Trąbienie na czerwonym z żółtym. Bo zaraz będzie zielone.", points: 3, species: { moto: 3 } },
      fast: { text: "Trąbienie, zanim zielone zdążyło się rozgrzać.", points: 3, species: { moto: 2 } },
      normal: { text: "Trąbienie po chwili, zgodnie z kodeksem towarzyskim.", points: 2, species: { moto: 1 } },
      slow: { text: "Krótkie, nieśmiałe trąbnięcie.", points: 1 },
      none: { text: "Bez trąbienia. Samochód z przodu w końcu ruszył sam.", points: 0 },
    },
  },
  {
    kind: "map",
    station: 2,
    section: "Parkowanie",
    scene: "parking",
    prompt: "Sobota, dziesiąta rano, parking pod marketem. Stuknij, gdzie stajesz.",
    proxyPrompt: "Sobota, dziesiąta rano, parking pod marketem. Stuknij, gdzie staje osoba badana.",
    zones: [
      { zone: "first", place: "Pierwsze wolne miejsce", text: "Na pierwszym wolnym miejscu. Bez filozofii.", points: 0 },
      {
        zone: "family",
        place: "Miejsce dla rodzin przy wejściu",
        text: "Na kopercie dla rodzin. Rodzina została w domu, ale jest.",
        points: 2,
        species: { parking: 2 },
      },
      {
        zone: "far",
        place: "Ostatni rząd, z dala od wszystkich",
        text: "Na samym końcu parkingu. Nikt nie obije drzwi.",
        points: 2,
        species: { moto: 2, parking: 1 },
      },
      {
        zone: "double",
        place: "Dwa wolne miejsca obok siebie",
        text: "Na dwóch miejscach naraz. Po skosie, dla bezpieczeństwa.",
        points: 3,
        species: { parking: 3 },
      },
      {
        zone: "lane",
        place: "Alejka przed samym wejściem",
        text: "W alejce, na awaryjnych. Tylko po bułki.",
        points: 3,
        species: { parking: 2, moto: 1 },
      },
    ],
  },
  {
    kind: "map",
    station: 2,
    section: "Plaża",
    scene: "beach",
    prompt: "Pierwszy dzień urlopu nad morzem, 6:30. Stuknij, gdzie stawiasz parawan.",
    proxyPrompt: "Pierwszy dzień urlopu nad morzem, 6:30. Stuknij, gdzie osoba badana stawia parawan.",
    zones: [
      { zone: "path", place: "Przy zejściu na plażę", text: "Przy zejściu, blisko gofrów i toalety.", points: 1, species: { wakacje: 1 } },
      {
        zone: "front",
        place: "Pierwszy rząd przy wodzie",
        text: "W pierwszym rzędzie przy wodzie. Osiem metrów parawanu, wejście od lądu.",
        points: 3,
        species: { wakacje: 3 },
      },
      {
        zone: "middle",
        place: "Środek plaży",
        text: "Na środku, wokół trzech koców. Rodzina dojedzie o jedenastej.",
        points: 3,
        species: { wakacje: 2, parking: 1 },
      },
      { zone: "dune", place: "Wydma", text: "Na wydmie. Zakaz wstępu dotyczy turystów.", points: 2, species: { wakacje: 1 } },
    ],
    skip: { text: "Nigdzie. O 6:30 śpię.", proxy: "Nigdzie. O 6:30 śpi.", points: 0 },
  },
  {
    kind: "inventory",
    station: 3,
    section: "Szuflada",
    container: "drawer",
    prompt: "Szuflada ze wszystkim. Zaznacz, co w niej jest.",
    proxyPrompt: "Szuflada ze wszystkim u osoby badanej. Zaznacz, co w niej jest.",
    done: "Zamykam szufladę",
    things: [
      { icon: "cables", text: "Kable do urządzeń, których już nie ma", points: 1, species: { smart: 1, dzialka: 1 } },
      { icon: "manual", text: "Instrukcja do telewizora z 2004 roku", points: 1, species: { smart: 1 } },
      { icon: "bags", text: "Reklamówka z reklamówkami", points: 1, species: { dzialka: 2 } },
      { icon: "keys", text: "Klucze. Nie wiadomo od czego. Nie wyrzucać.", points: 1, species: { dzialka: 1, budowa: 1 } },
      { icon: "screws", text: "Śrubki zapasowe po składaniu szafy", points: 1, species: { budowa: 2 } },
      { icon: "batteries", text: "Baterie. Chyba dobre.", points: 1, species: { smart: 1 } },
      { icon: "float", text: "Spławik i haczyki, luzem", points: 1, species: { wedka: 2 } },
      { icon: "pen", text: "Długopis z banku, którego już nie ma", points: 1, species: { korpo: 1 } },
      { icon: "charger", text: "Ładowarka do Nokii", points: 1, species: { smart: 1 } },
    ],
  },
  {
    kind: "inventory",
    station: 3,
    section: "Bagażnik",
    container: "boot",
    prompt: "Bagażnik. Zaznacz, co w nim wozisz na stałe.",
    proxyPrompt: "Bagażnik osoby badanej. Zaznacz, co w nim jeździ na stałe.",
    done: "Zamykam bagażnik",
    things: [
      { icon: "triangle", text: "Trójkąt, gaśnica i dwie apteczki", points: 1, species: { moto: 1 } },
      { icon: "jumper", text: "Kable rozruchowe. Dla innych.", points: 1, species: { moto: 1 } },
      { icon: "oil", text: "Litr oleju na wszelki wypadek", points: 1, species: { moto: 1 } },
      { icon: "windbreak", text: "Parawan", points: 1, species: { wakacje: 2 } },
      { icon: "stool", text: "Krzesełko składane i termos", points: 1, species: { wedka: 2 } },
      { icon: "charcoal", text: "Worek węgla drzewnego", points: 1, species: { grill: 2 } },
      { icon: "level", text: "Poziomica", points: 1, species: { budowa: 2 } },
      { icon: "bucket", text: "Wiadro. Do zajmowania miejsca.", points: 1, species: { parking: 2 } },
      { icon: "binder", text: "Segregator z fakturami za auto, od nowości", points: 1, species: { korpo: 1, moto: 1 } },
    ],
  },
  {
    kind: "scale",
    station: 3,
    section: "Ubiór",
    prompt: "Do jakiej temperatury nosisz skarpety do sandałów?",
    proxyPrompt: "Do jakiej temperatury osoba badana nosi skarpety do sandałów?",
    ticks: ["nie", "12°C", "20°C", "28°C", "zawsze"],
    steps: [
      { text: "Nie noszę. Ani sandałów, ani skarpet do nich.", proxy: "Nie nosi. Ani sandałów, ani skarpet do nich.", points: 0 },
      { text: "Do 12°C. Wyżej to już przesada.", points: 1, species: { wakacje: 1 } },
      { text: "Do 20°C. Cienkie, nikt nie zauważy.", points: 2, species: { wakacje: 2 } },
      { text: "Do 28°C. Białe, frotte.", points: 3, species: { wakacje: 3 } },
      { text: "Zawsze. Także na plaży w Hurghadzie.", points: 3, species: { wakacje: 3 } },
    ],
  },
  {
    kind: "choice",
    station: 4,
    section: "Życie towarzyskie",
    prompt: "Grill u znajomych. Gospodarz właśnie przewraca karkówkę. Ty:",
    proxyPrompt: "Grill u znajomych. Gospodarz przewraca karkówkę. Osoba badana:",
    options: [
      { text: "Pytam, czy jest coś wegańskiego.", proxy: "Pyta, czy jest coś wegańskiego.", points: 0 },
      { text: "Stoję obok z piwem i nadzoruję.", proxy: "Stoi obok z piwem i nadzoruje.", points: 1, species: { grill: 1 } },
      { text: "Mówię, że za wcześnie. I że węgiel nie ten.", proxy: "Mówi, że za wcześnie. I że węgiel nie ten.", points: 2, species: { grill: 2 } },
      { text: "Przejmuję szczypce. Ktoś musi.", proxy: "Przejmuje szczypce. Ktoś musi.", points: 3, species: { grill: 3 } },
    ],
  },
  {
    kind: "choice",
    station: 4,
    section: "Praca",
    prompt: "Spotkanie, które mogło być mailem. Co robisz?",
    proxyPrompt: "Spotkanie, które mogło być mailem. Co robi osoba badana?",
    options: [
      { text: "Wyłączam kamerę i wieszam pranie.", proxy: "Wyłącza kamerę i wiesza pranie.", points: 0 },
      { text: "Robię notatki. Ręcznie, w zeszycie A4.", proxy: "Robi notatki. Ręcznie, w zeszycie A4.", points: 1, species: { korpo: 1 } },
      {
        text: "Drukuję agendę. I notatkę z poprzedniego spotkania.",
        proxy: "Drukuje agendę. I notatkę z poprzedniego spotkania.",
        points: 3,
        species: { korpo: 3 },
      },
      {
        text: "Na koniec mówię: „To ja tylko krótko, w ramach podsumowania”.",
        proxy: "Na koniec mówi: „To ja tylko krótko, w ramach podsumowania”.",
        points: 3,
        species: { korpo: 2 },
      },
    ],
  },
  {
    kind: "blot",
    station: 4,
    section: "Plansza III",
    plate: "III",
    image: "/plansze/plansza-3.webp",
    width: 573,
    height: 820,
    prompt: "Plansza III. Ostatnia, obiecujemy.",
    proxyPrompt: "Plansza III. Co zobaczy w niej osoba badana?",
    options: [
      { text: "Żuka w garniturze.", points: 0 },
      { text: "Router od środka. Mruga na czerwono.", points: 2, species: { smart: 2 } },
      { text: "Przeciek pod zlewem. Sam naprawię.", proxy: "Przeciek pod zlewem. Sam naprawi.", points: 3, species: { budowa: 3 } },
      { text: "Rybę trzymaną w dwóch rękach. Była taka.", points: 3, species: { wedka: 3 } },
    ],
  },
  {
    kind: "rapid",
    station: 4,
    section: "Seria szybka",
    prompt: "Seria szybka. Czy to o tobie?",
    proxyPrompt: "Seria szybka. Czy to o osobie badanej?",
    seconds: 5,
    statements: [
      { text: "Klaskanie przy lądowaniu samolotu.", points: 1, species: { wakacje: 1 } },
      { text: "Wyłączanie routera na noc, żeby odpoczął.", points: 1, species: { smart: 1 } },
      { text: "Koszula z krótkim rękawem wpuszczona w spodnie.", points: 1, species: { korpo: 1 } },
      { text: "Mycie samochodu w niedzielę o ósmej rano.", points: 1, species: { moto: 1 } },
      { text: "Pomidory z działki rozdawane w reklamówkach.", points: 1, species: { dzialka: 1 } },
      { text: "Zdjęcie z rybą jako zdjęcie profilowe.", points: 1, species: { wedka: 1 } },
      { text: "Komentarz „Ładnie” pod każdym zdjęciem w rodzinie.", points: 1, species: { facebook: 1 } },
      { text: "Fartuch z napisem „Mistrz grilla”.", points: 1, species: { grill: 1 } },
      { text: "Wiertarka udarowa jako prezent na każdą okazję.", points: 1, species: { budowa: 1 } },
      { text: "Pachołek na miejscu pod blokiem.", points: 1, species: { parking: 1 } },
    ],
  },
];

export type Verdict = {
  from: number;
  label: string;
  title: string;
  description: string;
  recommendations: string[];
};

export const VERDICTS: Verdict[] = [
  {
    from: 0,
    label: "śladowe",
    title: "Dziaderstwo śladowe",
    description:
      "Objawy na poziomie błędu statystycznego. Instytut nie stwierdza zagrożenia, ale zaleca czujność: pierwsze objawy pojawiają się zwykle po zakupie pierwszej wiertarki.",
    recommendations: [
      "Badanie kontrolne za pięć lat.",
      "Unikać marketów budowlanych w soboty przed dziesiątą.",
      "Nie przyjmować w prezencie fartucha do grilla.",
    ],
  },
  {
    from: 25,
    label: "umiarkowane",
    title: "Dziaderstwo umiarkowane",
    description:
      "Objawy występują sezonowo, zwykle w okolicach grilla, Wigilii i wymiany opon. Stan stabilny, rokowania dobre.",
    recommendations: [
      "Ograniczyć zwrot „za moich czasów” do jednego dziennie.",
      "Nie komentować cudzych opon bez wyraźnej prośby.",
      "Raz w miesiącu przeczytać instrukcję. Dowolną.",
    ],
  },
  {
    from: 50,
    label: "podwyższone",
    title: "Dziaderstwo podwyższone",
    description:
      "Objawy utrwalone. Osoba badana posiada co najmniej jedną szufladę, której zawartości nie wolno ruszać, i co najmniej jedną opinię o dieslu.",
    recommendations: [
      "Raz w tygodniu wyrzucić jeden przedmiot, który „się jeszcze przyda”. Pod nadzorem.",
      "Przed udostępnieniem czegokolwiek odczekać 24 godziny.",
      "Pozwolić komuś innemu przewrócić karkówkę.",
    ],
  },
  {
    from: 75,
    label: "kliniczne",
    title: "Dziaderstwo kliniczne",
    description:
      "Stan zaawansowany. Instytut potwierdza rozpoznanie i składa wyrazy uznania. Leczenie nie jest zalecane, ponieważ i tak nie przyniesie efektu.",
    recommendations: [
      "Pogodzić się z rozpoznaniem.",
      "Zamówić fartuch z napisem „Certyfikowany”.",
      "Przekazać wiedzę młodszym. Najlepiej przy stole wigilijnym.",
    ],
  },
];

/** Diagnoses for answers that point to no particular Atlas species. */
export const UNSPECIFIED = {
  latent: {
    name: "Dziaders Utajony",
    latin: "Dziadersus latens",
    authority: "Wąsik, 2026",
    description:
      "Gatunek trudny do wykrycia. Objawy są niewidoczne gołym okiem i ujawniają się zwykle po trzydziestce albo po zakupie pierwszej wiertarki.",
  },
  common: {
    name: "Dziaders Pospolity",
    latin: "Dziadersus vulgaris",
    authority: "Linneusz, 1758",
    description:
      "Postać klasyczna, bez specjalizacji. Objawy rozłożone równomiernie na wszystkie dziedziny życia: od pogody po politykę.",
  },
};

/* Editions: the Polish data above with each edition's text laid over it. */

const EDITIONS = {
  pl: { stations: STATIONS, tasks: TASKS, verdicts: VERDICTS, unspecified: UNSPECIFIED },
  sl: {
    stations: overlay(STATIONS, sl.STATIONS, "test.STATIONS"),
    tasks: overlay(TASKS, sl.TASKS, "test.TASKS"),
    verdicts: overlay(VERDICTS, sl.VERDICTS, "test.VERDICTS"),
    unspecified: overlay(UNSPECIFIED, sl.UNSPECIFIED, "test.UNSPECIFIED"),
  },
} satisfies Record<Locale, unknown>;

/** The routing slip in the edition's language. */
export const getStations = (locale: Locale): Station[] => EDITIONS[locale].stations;

/** Formularz IBD-T2 in the edition's language: same order, points and weights as TASKS. */
export const getTasks = (locale: Locale): Task[] => EDITIONS[locale].tasks;

export const getVerdicts = (locale: Locale): Verdict[] => EDITIONS[locale].verdicts;

export const getUnspecified = (locale: Locale): typeof UNSPECIFIED => EDITIONS[locale].unspecified;
