import type { Locale } from "@/i18n/config";
import { overlay, overlayList } from "@/i18n/overlay";
import * as sl from "./sl/wax";
import type { SpeciesKey } from "./species";

/*
 * Lanie wosku (/lanie-wosku): the Pracownia Wróżb reads the shadow of a wax cast. A cast is one
 * text-free drawing (public/wosk/, assets/wosk/), the shape its shadow shows, the Pracownia's
 * reading and the species it foretells (one or two; the code says which).
 *
 * Append-only: result codes hold the cast slug and indices into PROPHECIES and the dictionary.
 * Never reorder, remove or rename; a new cast needs its drawing, prompt and Slovenian overlay.
 */

export type Cast = {
  /** In codes and file names. Stable: never change it. */
  slug: string;
  /** What the shadow shows, as the Pracownia writes it in the protocol. */
  shape: string;
  /** The Pracownia's reading of the shape: one or two sentences. */
  reading: string;
  /** The species the cast foretells. The code picks one by index, so never reorder. */
  species: SpeciesKey[];
};

export const CASTS: Cast[] = [
  {
    slug: "szczypce",
    shape: "Szczypce do grilla",
    reading: "Cień rozwiera się jak szczypce i nie chce się zamknąć. Odczyt jednoznaczny: w nadchodzącym sezonie nikt ci ich nie odbierze.",
    species: ["grill"],
  },
  {
    slug: "sandal",
    shape: "Sandał ze skarpetą",
    reading: "Wyraźna podeszwa, wyraźny pasek, a na wysokości kostki zgrubienie, które może być tylko skarpetą. Odlew zapowiada lato, które zacznie się w kwietniu.",
    species: ["wakacje", "kempingowy"],
  },
  {
    slug: "kombi",
    shape: "Kombi z boksem dachowym",
    reading: "Długa sylwetka, zwis z tyłu i garb na dachu. Pracownia rzadko ogląda tak wyraźny boks dachowy, a pustego nie widziała nigdy.",
    species: ["moto"],
  },
  {
    slug: "wiadro",
    shape: "Wiadro dnem do góry",
    reading: "Przedmiot, który stawia się na wolnym miejscu parkingowym, zanim ktoś na nim stanie. Odlew stoi stabilnie i nie zamierza ustąpić.",
    species: ["parking"],
  },
  {
    slug: "kielnia",
    shape: "Kielnia",
    reading: "Trójkątne pióro i krótki trzonek. Cień wskazuje na prace wykończeniowe, które wykonał ktoś inny i które trzeba będzie poprawić.",
    species: ["budowa"],
  },
  {
    slug: "kciuk",
    shape: "Kciuk w górę",
    reading: "Pięść z uniesionym kciukiem. W dawnych wróżbach znak pomyślności, dziś reakcja pod zdjęciem kuzynki z urlopu.",
    species: ["facebook"],
  },
  {
    slug: "pilot",
    shape: "Pilot do telewizora",
    reading: "Podłużny kształt z guzikami. Odlew dobrze leży w dłoni i nie przechodzi do rąk innych domowników.",
    species: ["smart", "kibicowski"],
  },
  {
    slug: "konewka",
    shape: "Konewka",
    reading: "Pękaty brzuch i długi dziobek. Odlew podlewa ogród także wtedy, gdy pada, bo deszcz to nie to samo.",
    species: ["dzialka"],
  },
  {
    slug: "ryba",
    shape: "Karp",
    reading: "Łuski, płetwy i wyraz pyska kogoś, kto wie, co go czeka w grudniu. Pracownia zaleca nie pytać, gdzie odlew spędzi święta.",
    species: ["wedka", "wigilijny"],
  },
  {
    slug: "krawat",
    shape: "Krawat",
    reading: "Wąski, długi, z węzłem u góry. Węzeł zawiązano raz, na stałe: krawat zdejmuje się przez głowę.",
    species: ["korpo"],
  },
  {
    slug: "zaglowka",
    shape: "Żaglówka",
    reading: "Kadłub i jeden wysoki żagiel. Odlew płynie pod wiatr i przy każdym podmuchu tłumaczy, co to jest bajdewind.",
    species: ["zeglarz"],
  },
  {
    slug: "grzyb",
    shape: "Borowik",
    reading: "Gruby trzon i kapelusz z połyskiem. Gdzie odlew został znaleziony, Pracownia nie ujawnia, nawet w protokole.",
    species: ["grzybiarz"],
  },
  {
    slug: "reklamowka",
    shape: "Reklamówka",
    reading: "Wypchana torba z dwoma uszami, w środku zapewne kolejne torby. Cień prowadzi na zakupy za granicę, bo tam taniej.",
    species: ["przygraniczny"],
  },
  {
    slug: "skarbonka",
    shape: "Świnka skarbonka",
    reading: "Odlew jest pełny, ciężki i nie ma otworu, przez który dałoby się coś wyjąć. Pracownia uznaje to za znak bardzo silny.",
    species: ["oszczednosciowy"],
  },
  {
    slug: "taniec",
    shape: "Para w tańcu",
    reading: "Dwie postacie pochylone ku sobie, jedna prowadzi. Odczyt: wieczorek taneczny w sanatorium, turnus drugi, wolny wstęp dla kuracjuszy.",
    species: ["uzdrowiskowy"],
  },
  {
    slug: "szczyt",
    shape: "Szczyt górski",
    reading: "Postrzępiony wierzchołek, a obok drugi, niższy. Cień zapowiada wejście na szczyt w sandałach i opowieść o nim do końca roku.",
    species: ["gorski", "krupowkowy"],
  },
  {
    slug: "gitara",
    shape: "Gitara",
    reading: "Pudło i długi gryf. Odlew zna trzy akordy i zagra wszystkie przy ognisku, jeszcze zanim ktoś poprosi.",
    species: ["festiwalowy"],
  },
  {
    slug: "golab",
    shape: "Gołąb",
    reading: "Wypięta pierś i mała głowa. Odlew zawsze wraca do tego samego gołębnika, choćby wypuścić go w Belgii.",
    species: ["golebiarz"],
  },
  {
    slug: "zamek",
    shape: "Ruina zamku na skale",
    reading: "Baszta na wapiennej skale. Pracownia rozpoznaje Jurę, a odlew zna historię każdej baszty i opowiada ją bez pytania.",
    species: ["jurajski"],
  },
  {
    slug: "parasol",
    shape: "Parasol",
    reading: "Rozpięta czasza i zakrzywiona rączka. Odlew wie, że będzie padać, zanim powie o tym prognoza, i mówi o tym pierwszy.",
    species: ["meteorologiczny"],
  },
  {
    slug: "niedzwiedz",
    shape: "Niedźwiedź",
    reading: "Ciężki chód na czterech łapach. Odlew chodzi własnymi ścieżkami, tam gdzie nie ma zasięgu, i jest z tego zadowolony.",
    species: ["bieszczadzki"],
  },
  {
    slug: "tort",
    shape: "Tort weselny",
    reading: "Trzy piętra, każde mniejsze od poprzedniego. Odczyt: wesele, oczepiny i krawat na czole po północy.",
    species: ["weselny"],
  },
  {
    slug: "parapet",
    shape: "Postać wsparta na łokciach",
    reading: "Głowa i ramiona nad skrzyżowanymi rękami, jak w oknie na poduszce. Odlew widzi wszystko, co dzieje się na podwórku.",
    species: ["parapetowy"],
  },
  {
    slug: "kolejka",
    shape: "Kolejka",
    reading: "Pięć postaci jedna za drugą, ostatnia stoi trochę za blisko. Przyłożony do ucha odlew mówi: „Pan tu nie stał”.",
    species: ["kolejkowy"],
  },
];

/** Prophecies for the coming year. Written without gendered forms: the reader may be anyone. Append only. */
export const PROPHECIES: string[] = [
  "W marcu kupisz trzecią poziomicę. Dwie poprzednie okażą się krzywe.",
  "Wiosną po raz pierwszy powiesz do kogoś „młody”. Ten ktoś będzie miał trzydzieści cztery lata.",
  "W kwietniu założysz zeszyt w kratkę i zaczniesz zapisywać przebieg, ceny paliwa i kto ile pożyczył.",
  "W maju nauczysz się hasła do wi-fi na pamięć i od tej pory podasz je każdemu gościowi, litera po literze.",
  "Do jesieni wyrobisz sobie zdanie o oponach wielosezonowych i podzielisz się nim bez pytania.",
  "W czerwcu ktoś przy tobie rozpali grilla podpałką w płynie. Wspomnisz o tym przy wigilijnym stole.",
  "W lipcu zaczniesz wstawać przed szóstą, bez budzika i bez powodu.",
  "W sierpniu na stacji benzynowej zapytasz obcą osobę, ile pali jej auto. Odpowiedź cię nie przekona.",
  "We wrześniu wydasz pierwszą w życiu opinię o tym, jak sąsiad ociepla dom. Opinia będzie fachowa i długa.",
  "W październiku znajdziesz w szufladzie kabel nieznanego przeznaczenia i zostawisz go, bo się przyda.",
  "W listopadzie zaczniesz sprawdzać prognozę trzy razy dziennie, za każdym razem w innej aplikacji.",
  "W grudniu powiesz przy stole „za moich czasów” i nikt nie zaprotestuje. Pracownia uznaje to za przełom.",
  "Pod koniec zimy ustawisz kaloryfer na dwójkę, na stałe, i zaczniesz rozdawać swetry.",
  "W nadchodzącym roku kupisz pierwszą saszetkę na pas. Okaże się, że mieści wszystko.",
  "W ciągu roku zgubisz pilota cztery razy. Trzy razy znajdzie się w lodówce.",
  "Do lata nauczysz się parkować tyłem w jednym ruchu i zaczniesz oceniać, jak parkują inni.",
  "Któregoś dnia odbierzesz telefon słowami „no, słucham”. Instytut odnotuje to w Roczniku.",
  "Latem przy cudzym grillu zapytasz, czy karkówka była marynowana od wczoraj. Odpowiedź będzie przecząca.",
  "W nadchodzącym roku założysz torbę na torby. Przed końcem roku potrzebna będzie druga.",
  "Wiosną zajrzysz do instrukcji dopiero po złożeniu szafy. Zostanie jedna śrubka i zachowasz ją na wszelki wypadek.",
  "W wakacje rozstawisz parawan przed siódmą rano. Sąsiedzi z prawej przyjdą o ósmej i zrozumieją.",
  "W listopadzie zgasisz światło w pokoju, w którym ktoś jeszcze siedzi. Powiesz, że prąd nie jest za darmo.",
  "W ciągu roku opowiesz tę samą anegdotę jedenaście razy. Za każdym razem ryba będzie większa.",
  "W nadchodzącym roku zaczniesz myć samochód w sobotę rano, ręcznie, na oczach całej ulicy.",
  "Jesienią zapytasz na głos, po co komu hulajnoga. Zapytasz przy hulajnodze.",
  "W lutym przymierzysz sandały do skarpet, jeszcze w domu, na próbę. Próba się powiedzie.",
  "W maju zaczniesz klaskać przy lądowaniu samolotu. Rodzina następnym razem usiądzie osobno.",
  "Na grupę rodzinną trafi twoje pierwsze zdjęcie zachodu słońca z podpisem. Podpis będzie dłuższy niż zachód.",
  "Do końca roku każdy nowy sprzęt w domu nazwiesz „ustrojstwem”. Nikt nie odważy się zaprzeczyć.",
  "W sierpniu zmierzysz cukinię i podasz wynik w centymetrach, na głos, przy gościach.",
  "Jesienią zapytasz kelnera, czy ryba jest dzisiejsza. Kelner powie, że tak, a ty będziesz wiedzieć swoje.",
  "W nadchodzącym roku przestaniesz ufać nawigacji i pojedziesz na pamięć. Objazd okaże się dłuższy, ale lepszy.",
];

/* Editions: the Polish lists above with each edition's text laid over them. */

type Wax = { CASTS: Cast[]; PROPHECIES: string[] };

const EDITIONS = {
  pl: { CASTS, PROPHECIES },
  sl: {
    CASTS: overlayList("wax.CASTS", CASTS, (item) => item.slug, sl.CASTS),
    PROPHECIES: overlay(PROPHECIES, sl.PROPHECIES, "wax.PROPHECIES"),
  },
} satisfies Record<Locale, Wax>;

/** The casts and prophecies in the edition's language: same order, same slugs. */
export const getWax = (locale: Locale): Wax => EDITIONS[locale];
