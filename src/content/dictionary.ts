import type { SpeciesKey } from "./species";

export type Entry = {
  /** URL segment. Stable: never change it once published. */
  slug: string;
  headword: string;
  grammar: string;
  pronunciation: string;
  senses: { text: string; figurative?: boolean }[];
  example: string;
  exampleNote?: string;
  /** Other headwords, spelled exactly as in this file. */
  seeAlso: string[];
  /** The Atlas species this phrase is typical of. */
  species?: SpeciesKey;
};

export const DICTIONARY: Entry[] = [
  {
    slug: "to-sie-jeszcze-przyda",
    headword: "to się jeszcze przyda",
    grammar: "zwrot konserwujący",
    pronunciation: "wym. stanowczo, z ręką na klamce piwnicy",
    senses: [
      { text: "Formuła uzasadniająca przechowywanie przedmiotu, który od 1997 roku nie znalazł zastosowania." },
      { text: "Deklaracja nienaruszalności piwnicy, garażu i szuflady pod telewizorem.", figurative: true },
    ],
    example: "Zostaw ten karton od telewizora, to się jeszcze przyda.",
    exampleNote: "Telewizor wyrzucono w 2011 roku.",
    seeAlso: ["za moich czasów", "ja nie potrzebuję instrukcji", "zgaś światło, prąd nie jest za darmo"],
    species: "dzialka",
  },
  {
    slug: "panie",
    headword: "panie…",
    grammar: "wykrzyknik otwierający",
    pronunciation: "wym. z westchnieniem, po którym następuje pauza",
    senses: [
      {
        text: "Uniwersalny wstęp do wypowiedzi eksperckiej. Zapowiada, że kiedyś było lepiej, taniej albo z prawdziwej stali.",
      },
    ],
    example: "Panie… to już nie ta stal.",
    seeAlso: ["za moich czasów", "ile pan za to dał?", "tego już teraz nie robią"],
  },
  {
    slug: "za-moich-czasow",
    headword: "za moich czasów",
    grammar: "wyrażenie przyimkowe, jednostka czasu",
    pronunciation: "wym. z naciskiem na „moich”",
    senses: [
      { text: "Okres o nieustalonych granicach, w którym wszystko było tańsze, trwalsze i uczciwsze." },
      { text: "Argument kończący dyskusję, niezależnie od jej tematu.", figurative: true },
    ],
    example: "Za moich czasów bułka kosztowała dwadzieścia groszy i była większa.",
    seeAlso: ["kiedyś to były zimy", "panie…", "kiedyś to się pracowało"],
  },
  {
    slug: "kiedys-to-byly-zimy",
    headword: "kiedyś to były zimy",
    grammar: "zdanie meteorologiczne",
    pronunciation: "wym. niezależnie od pory roku",
    senses: [
      {
        text: "Twierdzenie, że opady śniegu w latach 1979–1987 przewyższały wszystko, co nastąpiło później. Nie wymaga danych.",
      },
    ],
    example: "Kiedyś to były zimy. Do szkoły pięć kilometrów pod górę. W obie strony.",
    seeAlso: ["za moich czasów", "będzie padać, czuję w kolanie"],
    species: "meteorologiczny",
  },
  {
    slug: "ja-nie-potrzebuje-instrukcji",
    headword: "ja nie potrzebuję instrukcji",
    grammar: "deklaracja kompetencji",
    pronunciation: "wym. pewnie, na chwilę przed zgubieniem śrubki",
    senses: [{ text: "Oświadczenie poprzedzające montaż mebla, po którym jeden element zostaje „zapasowy”." }],
    example: "Ja nie potrzebuję instrukcji. Te dwie śrubki są zapasowe.",
    seeAlso: ["to się jeszcze przyda", "kto panu to tak zrobił?", "nie ruszaj, mam to poustawiane"],
    species: "budowa",
  },
  {
    slug: "ile-pan-za-to-dal",
    headword: "ile pan za to dał?",
    grammar: "pytanie wstępne",
    pronunciation: "wym. z niedowierzaniem przygotowanym zawczasu",
    senses: [{ text: "Otwarcie każdej rozmowy o zakupie. Każda odpowiedź jest za wysoka." }],
    example: "Ile pan za to dał? Ja bym to panu załatwił za połowę.",
    seeAlso: ["panie…", "a ile pali?"],
  },
  {
    slug: "nie-ruszaj-mam-to-poustawiane",
    headword: "nie ruszaj, mam to poustawiane",
    grammar: "formuła ochronna",
    pronunciation: "wym. szybko, z ręką wyciągniętą w stronę pilota",
    senses: [{ text: "Zakaz dotyczący pilota, telewizora, fotela i lusterek w samochodzie." }],
    example: "Nie ruszaj tego pilota, mam to poustawiane.",
    exampleNote: "Ustawiony jest jeden kanał.",
    seeAlso: ["ja nie potrzebuję instrukcji", "wnuczek mi to ustawił"],
    species: "smart",
  },
  {
    slug: "kto-panu-to-tak-zrobil",
    headword: "kto panu to tak zrobił?",
    grammar: "pytanie retoryczne",
    pronunciation: "wym. z niedowierzaniem, przy oględzinach cudzej pracy",
    senses: [{ text: "Formuła otwierająca każdą wizytę na cudzym remoncie. Odpowiedź nie ma znaczenia." }],
    example: "Kto panu to tak zrobił? Pan sam? No to wszystko jasne.",
    seeAlso: ["ja nie potrzebuję instrukcji", "ile pan za to dał?"],
    species: "budowa",
  },
  {
    slug: "tego-juz-teraz-nie-robia",
    headword: "tego już teraz nie robią",
    grammar: "zdanie oznajmujące, nostalgiczne",
    pronunciation: "wym. z dłonią na karoserii",
    senses: [
      { text: "Ocena przedmiotu wyprodukowanego przed 2004 rokiem. Zawsze pozytywna." },
      { text: "Ukryta ocena wszystkiego, co wyprodukowano później." },
    ],
    example: "Panie, to jest blacha. Tego już teraz nie robią.",
    seeAlso: ["panie…", "diesel to jest diesel"],
    species: "moto",
  },
  {
    slug: "diesel-to-jest-diesel",
    headword: "diesel to jest diesel",
    grammar: "tautologia motoryzacyjna",
    pronunciation: "wym. tonem zamykającym dyskusję",
    senses: [
      { text: "Argument rozstrzygający każdy spór o samochody. Nie wymaga uzasadnienia, bo sam jest uzasadnieniem." },
    ],
    example: "Elektryk? A zasięg? A zimą? Diesel to jest diesel.",
    seeAlso: ["tego już teraz nie robią", "a ile pali?"],
    species: "moto",
  },
  {
    slug: "nie-tak-sie-rozpala",
    headword: "nie tak się rozpala",
    grammar: "zwrot korygujący",
    pronunciation: "wym. z odległości kilku metrów, w drodze do grilla",
    senses: [{ text: "Komunikat poprzedzający przejęcie szczypiec." }],
    example: "Nie tak się rozpala. Daj, pokażę ci.",
    seeAlso: ["karkówka musi swoje odstać"],
    species: "grill",
  },
  {
    slug: "karkowka-musi-swoje-odstac",
    headword: "karkówka musi swoje odstać",
    grammar: "zasada technologiczna",
    pronunciation: "wym. z namaszczeniem",
    senses: [
      { text: "Reguła, zgodnie z którą mięso musi się marynować co najmniej dobę, najlepiej w misce przykrytej talerzem." },
      { text: "Uzasadnienie każdego opóźnienia.", figurative: true },
    ],
    example: "Jeszcze nie jemy. Karkówka musi swoje odstać.",
    seeAlso: ["nie tak się rozpala"],
    species: "grill",
  },
  {
    slug: "to-jest-moje-miejsce",
    headword: "to jest moje miejsce",
    grammar: "deklaracja terytorialna",
    pronunciation: "wym. z balkonu, z ręką wskazującą parking",
    senses: [{ text: "Podstawa prawna do zajmowania miejsca parkingowego, które nigdy nie zostało nikomu przydzielone." }],
    example: "Proszę pana, to jest moje miejsce. Od dziewięćdziesiątego siódmego.",
    seeAlso: ["za moich czasów"],
    species: "parking",
  },
  {
    slug: "kiedys-to-sie-pracowalo",
    headword: "kiedyś to się pracowało",
    grammar: "zdanie wspomnieniowe",
    pronunciation: "wym. w trakcie przerwy na kawę",
    senses: [{ text: "Twierdzenie, że praca w dawnych czasach była cięższa, dłuższa i bardziej prawdziwa niż obecnie." }],
    example: "Kiedyś to się pracowało, a nie home office.",
    seeAlso: ["za moich czasów", "zróbmy calla", "rzucę wszystko i wyjadę w Bieszczady"],
    species: "korpo",
  },
  {
    slug: "zrobmy-calla",
    headword: "zróbmy calla",
    grammar: "wyrażenie korporacyjne",
    pronunciation: "wym. tuż przed zwołaniem spotkania na żywo",
    senses: [{ text: "Propozycja rozmowy, po której i tak zostanie wydrukowana notatka." }],
    example: "Zróbmy calla. Albo lepiej wpadnij do mnie.",
    seeAlso: ["pozdrawiam serdecznie", "kiedyś to się pracowało"],
    species: "korpo",
  },
  {
    slug: "pozdrawiam-serdecznie",
    headword: "pozdrawiam serdecznie",
    grammar: "formuła końcowa",
    pronunciation: "wym. z kropką na końcu",
    senses: [{ text: "Zamknięcie każdej wiadomości, w tym wiadomości na czacie o treści „ok”." }],
    example: "Ok. Pozdrawiam serdecznie.",
    seeAlso: ["zróbmy calla"],
    species: "korpo",
  },
  {
    slug: "udostepnij-zanim-usuna",
    headword: "udostępnij, zanim usuną",
    grammar: "wezwanie",
    pronunciation: "wym. wielkimi literami",
    senses: [{ text: "Instrukcja dołączana do treści, których nikt nie zamierza usuwać." }],
    example: "UDOSTĘPNIJ, ZANIM USUNĄ!!! Lekarze tego nienawidzą.",
    seeAlso: ["kto pamięta?"],
    species: "facebook",
  },
  {
    slug: "kto-pamieta",
    headword: "kto pamięta?",
    grammar: "pytanie retoryczne, internetowe",
    pronunciation: "wym. pod zdjęciem z lat osiemdziesiątych",
    senses: [
      { text: "Podpis pod zdjęciem przedmiotu sprzed czterdziestu lat, wywołujący lawinę komentarzy „Ja pamiętam”." },
    ],
    example: "Syfon do wody sodowej. Kto pamięta?",
    seeAlso: ["za moich czasów", "udostępnij, zanim usuną"],
    species: "facebook",
  },
  {
    slug: "ja-te-miejsca-znam-od-czterdziestu-lat",
    headword: "ja te miejsca znam od czterdziestu lat",
    grammar: "deklaracja grzybiarska",
    pronunciation: "wym. ściszonym głosem, z koszykiem w ręce",
    senses: [{ text: "Zdanie, które nie zawiera żadnej informacji o miejscach." }],
    example: "Gdzie byłeś? W lesie. Ja te miejsca znam od czterdziestu lat.",
    seeAlso: ["kiedyś to były zimy"],
    species: "grzybiarz",
  },
  {
    slug: "bedzie-padac-czuje-w-kolanie",
    headword: "będzie padać, czuję w kolanie",
    grammar: "prognoza pogody",
    pronunciation: "wym. z ręką na kolanie",
    senses: [
      {
        text: "Komunikat meteorologiczny o skuteczności 54%, w opinii nadawcy wyższej niż skuteczność prognoz telewizyjnych.",
      },
    ],
    example: "Nie bierz roweru. Będzie padać, czuję w kolanie.",
    seeAlso: ["kiedyś to były zimy"],
    species: "meteorologiczny",
  },
  {
    slug: "taka-byla",
    headword: "taka była",
    grammar: "wykrzyknik wędkarski",
    pronunciation: "wym. z rozłożonymi rękami",
    senses: [
      { text: "Opis ryby, której nikt poza mówiącym nie widział. Rozpiętość rąk rośnie z każdym opowiadaniem." },
    ],
    example: "Urwała się przy samym brzegu. Taka była.",
    seeAlso: ["dziś nie brały"],
    species: "wedka",
  },
  {
    slug: "dzis-nie-braly",
    headword: "dziś nie brały",
    grammar: "podsumowanie dnia",
    pronunciation: "wym. pogodnie",
    senses: [{ text: "Wyjaśnienie powrotu z pustą siatką, które nie dotyczy umiejętności wędkarza." }],
    example: "Ciśnienie skakało. Dziś nie brały.",
    seeAlso: ["taka była"],
    species: "wedka",
  },
  {
    slug: "zgas-swiatlo-prad-nie-jest-za-darmo",
    headword: "zgaś światło, prąd nie jest za darmo",
    grammar: "upomnienie",
    pronunciation: "wym. z drugiego pokoju",
    senses: [{ text: "Komunikat wygłaszany, gdy domownik opuścił pokój na dłużej niż cztery sekundy." }],
    example: "Gdzie idziesz? Zgaś światło, prąd nie jest za darmo.",
    seeAlso: ["to się jeszcze przyda"],
    species: "oszczednosciowy",
  },
  {
    slug: "rzuce-wszystko-i-wyjade-w-bieszczady",
    headword: "rzucę wszystko i wyjadę w Bieszczady",
    grammar: "deklaracja",
    pronunciation: "wym. po drugim piwie",
    senses: [{ text: "Plan życiowy realizowany przez mniej niż jeden procent deklarujących." }],
    example: "Jeszcze rok w tej firmie, a potem rzucę wszystko i wyjadę w Bieszczady.",
    seeAlso: ["kiedyś to się pracowało"],
    species: "bieszczadzki",
  },
  {
    slug: "wnuczek-mi-to-ustawil",
    headword: "wnuczek mi to ustawił",
    grammar: "wyjaśnienie technologiczne",
    pronunciation: "wym. z bezradnym uśmiechem",
    senses: [
      { text: "Formuła zwalniająca z odpowiedzialności za działanie każdego urządzenia elektronicznego w domu." },
    ],
    example: "Nie wiem, czemu gra. Wnuczek mi to ustawił.",
    seeAlso: ["nie ruszaj, mam to poustawiane"],
    species: "smart",
  },
  {
    slug: "a-ile-pali",
    headword: "a ile pali?",
    grammar: "pytanie motoryzacyjne",
    pronunciation: "wym. przed jakimkolwiek innym pytaniem",
    senses: [
      {
        text: "Jedyne pytanie, jakie warto zadać o samochód. Prędkość, wyposażenie i bezpieczeństwo nie mają znaczenia.",
      },
    ],
    example: "Ładny. A ile pali?",
    seeAlso: ["diesel to jest diesel", "ile pan za to dał?"],
    species: "moto",
  },
];

export const entryBySlug = (slug: string) => DICTIONARY.find((entry) => entry.slug === slug);

export const entryByHeadword = (headword: string) => DICTIONARY.find((entry) => entry.headword === headword);

/** Alphabetical, Polish collation. */
export const DICTIONARY_SORTED = [...DICTIONARY].sort((a, b) => a.headword.localeCompare(b.headword, "pl"));
