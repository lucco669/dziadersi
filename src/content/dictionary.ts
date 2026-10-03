import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { DICTIONARY_SL } from "./sl/dictionary";
import { DICTIONARY_SLUGS } from "./sl/slugs/dictionary";
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
  /** Other headwords, spelled exactly as in this file. In the Slovenian edition: the Slovenian headwords of those entries. */
  seeAlso: string[];
  /** The Atlas species this phrase is typical of. */
  species?: SpeciesKey;
  /** The Polish headword, shown in the Slovenian edition. */
  original?: string;
  /** Translator's notes (op. prev.), Slovenian edition only. */
  notes?: string[];
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
  {
    slug: "ja-tylko-zapytac",
    headword: "ja tylko zapytać",
    grammar: "bezokolicznik pierwszeństwa",
    pronunciation: "wym. już przy okienku, plecami do kolejki",
    senses: [
      {
        text: "Formuła, która pozwala ominąć kolejkę dowolnej długości. Pytanie trwa średnio jedenaście minut i dotyczy trzech spraw.",
      },
      {
        text: "Przekonanie, że kolejka obowiązuje tych, którzy mają sprawę, a nie tych, którzy mają pytanie.",
        figurative: true,
      },
    ],
    example: "Przepraszam, ja tylko zapytać. I od razu nadam paczkę.",
    exampleNote: "Paczek było pięć. Każda za pobraniem.",
    seeAlso: ["ja tu stałem", "może by tak drugą kasę otworzyli?"],
    species: "kolejkowy",
  },
  {
    slug: "ja-tu-stalem",
    headword: "ja tu stałem",
    grammar: "czas przeszły, roszczeniowy",
    pronunciation: "wym. z oburzeniem, po powrocie z działu mięsnego",
    senses: [
      {
        text: "Tytuł prawny do miejsca w kolejce, nabyty w bliżej nieokreślonym momencie przeszłości.",
      },
      { text: "Prawo, które można przenieść na dowolny przedmiot pozostawiony w kolejce: koszyk, reklamówkę albo szwagra." },
    ],
    example: "Przepraszam, ja tu stałem. Za tym panem w kurtce.",
    exampleNote: "Pan w kurtce wyszedł ze sklepu dwadzieścia minut wcześniej.",
    seeAlso: ["ja tylko zapytać", "to jest moje miejsce"],
    species: "kolejkowy",
  },
  {
    slug: "moze-by-tak-druga-kase-otworzyli",
    headword: "może by tak drugą kasę otworzyli?",
    grammar: "wniosek formalny",
    pronunciation: "wym. głośno, do kolejki, nie do kasjerki",
    senses: [
      { text: "Postulat zgłaszany, gdy przed mówiącym stoją już trzy osoby." },
      {
        text: "Przekonanie, że na zapleczu każdego sklepu czeka druga kasjerka, której po prostu nikt nie zawołał.",
        figurative: true,
      },
    ],
    example: "Może by tak drugą kasę otworzyli? Ludzie stoją.",
    exampleNote: "Drugą kasę otwarto. Mówiący przeszedł do niej jako pierwszy.",
    seeAlso: ["ja tu stałem", "w gazetce było taniej"],
    species: "kolejkowy",
  },
  {
    slug: "kto-to-tak-zaparkowal",
    headword: "kto to tak zaparkował?",
    grammar: "pytanie dochodzeniowe",
    pronunciation: "wym. w stronę okien całego bloku",
    senses: [{ text: "Pytanie zadawane przy każdym krzywo zaparkowanym samochodzie, z wyjątkiem własnego." }],
    example: "Kto to tak zaparkował? Przecież stąd nie da się wyjechać.",
    exampleNote: "Mówiący stoi obok, na zakazie, na światłach awaryjnych.",
    seeAlso: ["to jest moje miejsce", "a to do kogo?", "kto panu to tak zrobił?"],
    species: "parking",
  },
  {
    slug: "w-niemczech-to-by",
    headword: "w Niemczech to by…",
    grammar: "tryb przypuszczający, zagraniczny",
    pronunciation: "wym. z pauzą, którą słuchacz ma wypełnić sam",
    senses: [
      {
        text: "Wstęp do porównania, którego wynik jest znany z góry. Wiedza mówiącego o Niemczech pochodzi z trzech sezonów na szparagach i jednego Passata.",
      },
      { text: "Wzór porządku, który obowiązuje wszystkich z wyjątkiem mówiącego.", figurative: true },
    ],
    example: "W Niemczech to by tę dziurę załatali w jeden dzień.",
    exampleNote: "Dziura znajduje się przed posesją mówiącego od 2009 roku. Mówiący jej nie zgłosił.",
    seeAlso: ["oryginał, niemiecki", "za moich czasów"],
    species: "przygraniczny",
  },
  {
    slug: "oryginal-niemiecki",
    headword: "oryginał, niemiecki",
    grammar: "świadectwo pochodzenia",
    pronunciation: "wym. z jedną ręką na sercu, drugą na masce",
    senses: [
      {
        text: "Najwyższy stopień jakości w klasyfikacji dziaderskiej. Przysługuje częściom samochodowym, elektronarzędziom i proszkowi do prania, jeśli przyjechały zza Odry.",
      },
      {
        text: "Każdy przedmiot, który przekroczył granicę w bagażniku, niezależnie od kraju produkcji.",
        figurative: true,
      },
    ],
    example: "Golf czwórka, rocznik 2003. Oryginał, niemiecki. Niemiec płakał, jak sprzedawał.",
    exampleNote: "Przebieg: 186 tysięcy kilometrów, według licznika i sprzedającego.",
    seeAlso: ["w Niemczech to by…", "tego już teraz nie robią", "diesel to jest diesel"],
    species: "moto",
  },
  {
    slug: "to-sie-rozjezdzi",
    headword: "to się rozjeździ",
    grammar: "prognoza techniczna",
    pronunciation: "wym. bez zdejmowania nogi z gazu",
    senses: [
      {
        text: "Diagnoza każdego nowego dźwięku w samochodzie, w tym stukania, piszczenia i wycia na trzecim biegu.",
      },
      { text: "Ogólna metoda rozwiązywania problemów, polegająca na tym, żeby ich nie ruszać.", figurative: true },
    ],
    example: "Stuka od Radomia? To się rozjeździ.",
    exampleNote: "Stukanie ustało pod Kielcami, razem z silnikiem. Dalej na lawecie.",
    seeAlso: ["diesel to jest diesel", "a ile pali?", "oryginał, niemiecki"],
    species: "moto",
  },
  {
    slug: "nie-po-to-kupowalem",
    headword: "nie po to kupowałem",
    grammar: "klauzula muzealna",
    pronunciation: "wym. z ręką zagradzającą drogę do meblościanki",
    senses: [
      {
        text: "Zakaz używania przedmiotu zgodnie z jego przeznaczeniem. Dotyczy serwisu obiadowego, dywanu w dużym pokoju i nowej kanapy.",
      },
      {
        text: "Zasada, zgodnie z którą najlepsze rzeczy w domu czekają na okazję, która nie nadchodzi.",
        figurative: true,
      },
    ],
    example: "Z tego serwisu się nie je. Nie po to kupowałem.",
    exampleNote: "Od 1989 roku serwis opuścił meblościankę dwa razy, za każdym razem do przetarcia z kurzu.",
    seeAlso: ["to się jeszcze przyda", "nie ruszaj, mam to poustawiane"],
  },
  {
    slug: "ja-bym-to-strzelil",
    headword: "ja bym to strzelił",
    grammar: "zdanie warunkowe, niesprawdzalne",
    pronunciation: "wym. z kanapy, w trakcie powtórki",
    senses: [
      {
        text: "Ocena sytuacji podbramkowej, wygłaszana kilkaset kilometrów od boiska. Skuteczność mówiącego w tych warunkach wynosi 100%.",
      },
      {
        text: "Komentarz do każdej cudzej decyzji, nad którą mówiący zastanawiał się dłużej niż jej autor.",
        figurative: true,
      },
    ],
    example: "Z pięciu metrów, na pustą bramkę? Ja bym to strzelił.",
    exampleNote: "Ostatni udokumentowany strzał mówiącego, oddany w 1982 roku, trafił w okno sąsiada z parteru.",
    seeAlso: ["sędzia kalosz", "a gdzie jest pilot?"],
    species: "kibicowski",
  },
  {
    slug: "sedzia-kalosz",
    headword: "sędzia kalosz",
    grammar: "wołacz, opinia służbowa",
    pronunciation: "wym. w stronę telewizora, który nie przekazuje dźwięku w drugą stronę",
    senses: [
      {
        text: "Ocena kwalifikacji arbitra, wydawana po każdym gwizdku niekorzystnym dla drużyny, której kibicuje mówiący.",
      },
      {
        text: "Każdy, kto rozstrzyga spór na niekorzyść mówiącego, w tym kontroler biletów i szwagier liczący punkty w tysiąca.",
        figurative: true,
      },
    ],
    example: "Jaki spalony? Gdzie tu jest spalony? Sędzia kalosz.",
    exampleNote: "Powtórka pokazała dwa metry spalonego. Opinia mówiącego pozostała bez zmian.",
    seeAlso: ["ja bym to strzelił", "kto panu to tak zrobił?"],
    species: "kibicowski",
  },
  {
    slug: "cicho-bo-ryby-sploszysz",
    headword: "cicho, bo ryby spłoszysz",
    grammar: "nakaz ciszy, jednostronny",
    pronunciation: "wym. szeptem, który słychać na drugim brzegu",
    senses: [
      { text: "Zakaz rozmowy, który obowiązuje na pomoście wszystkich z wyjątkiem mówiącego." },
      { text: "Wyjaśnienie zapasowe, przygotowane na wypadek, gdyby nie brały." },
    ],
    example: "Cicho, bo ryby spłoszysz. A wiesz, jakiego szczupaka tu wyciągnąłem w osiemdziesiątym szóstym?",
    exampleNote: "Opowieść trwała czterdzieści minut. Nie brały.",
    seeAlso: ["dziś nie brały", "taka była"],
    species: "wedka",
  },
  {
    slug: "a-gdzie-jest-pilot",
    headword: "a gdzie jest pilot?",
    grammar: "zgłoszenie zaginięcia",
    pronunciation: "wym. z fotela, bez wstawania",
    senses: [
      {
        text: "Pytanie skierowane do wszystkich domowników jednocześnie. Pada przed sprawdzeniem własnej kieszeni, poręczy fotela i miejsca, na którym się siedzi.",
      },
      { text: "Ogłoszenie poszukiwań, w których mówiący nie bierze udziału." },
    ],
    example: "Zaraz będą wiadomości. A gdzie jest pilot? Kto ruszał pilota?",
    exampleNote: "Pilota znaleziono po dwudziestu minutach, pod mówiącym.",
    seeAlso: ["nie ruszaj, mam to poustawiane", "znowu puszczają Kevina", "mówili w telewizji"],
  },
  {
    slug: "dobrze-karmili",
    headword: "dobrze karmili",
    grammar: "recenzja, wyczerpująca",
    pronunciation: "wym. z uznaniem, w poniedziałek po poprawinach",
    senses: [
      {
        text: "Pełne sprawozdanie z przyjęcia weselnego. Pozostałe elementy uroczystości, w tym młoda para, nie podlegają ocenie.",
      },
    ],
    example: "Jak było na weselu? Dobrze karmili. Cztery ciepłe.",
    exampleNote: "Imienia pana młodego mówiący nie zapamiętał.",
    seeAlso: ["puść pan coś normalnego", "ile pan za to dał?"],
    species: "weselny",
  },
  {
    slug: "pusc-pan-cos-normalnego",
    headword: "puść pan coś normalnego",
    grammar: "tryb rozkazujący, uprzejmy",
    pronunciation: "wym. do DJ-a, z łokciem opartym o konsoletę",
    senses: [
      {
        text: "Zamówienie utworu, który mówiący uznaje za muzykę. Lista takich utworów jest zamknięta od 1994 roku i liczy jedenaście pozycji.",
      },
    ],
    example: "Panie, co to jest? Puść pan coś normalnego.",
    exampleNote: "Zamówienie zrealizowano. Mówiący tańczył bez przerwy do oczepin.",
    seeAlso: ["dobrze karmili", "za moich czasów"],
    species: "weselny",
  },
  {
    slug: "znowu-puszczaja-kevina",
    headword: "znowu puszczają Kevina",
    grammar: "komunikat programowy, cykliczny",
    pronunciation: "wym. z dezaprobatą, sadowiąc się wygodniej w fotelu",
    senses: [
      { text: "Coroczne zdziwienie świąteczną ramówką, wyrażane od ponad dwudziestu lat tym samym tonem." },
      { text: "Sygnał, że wieczór wigilijny wszedł w fazę fotelową." },
    ],
    example: "Znowu puszczają Kevina. Co roku to samo.",
    exampleNote: "Mówiący obejrzał do końca. Po raz dwudziesty szósty.",
    seeAlso: ["umawialiśmy się, że bez prezentów", "a gdzie jest pilot?"],
    species: "wigilijny",
  },
  {
    slug: "umawialismy-sie-ze-bez-prezentow",
    headword: "umawialiśmy się, że bez prezentów",
    grammar: "porozumienie, nieobowiązujące",
    pronunciation: "wym. z wyrzutem, z paczką schowaną za plecami",
    senses: [
      { text: "Umowa zawierana co roku w listopadzie i co roku zrywana przez wszystkie strony jednocześnie." },
    ],
    example: "Przecież umawialiśmy się, że bez prezentów. No dobrze, ja też coś mam.",
    exampleNote: "Zestaw kluczy nasadowych, kupiony w październiku z gazetki.",
    seeAlso: ["znowu puszczają Kevina", "w gazetce było taniej"],
    species: "wigilijny",
  },
  {
    slug: "a-to-do-kogo",
    headword: "a to do kogo?",
    grammar: "pytanie ewidencyjne",
    pronunciation: "wym. zza firanki, z łokciami na poduszce",
    senses: [
      {
        text: "Pytanie zadawane na widok każdego samochodu i każdej osoby spoza ewidencji, którą mówiący prowadzi z okna od 1993 roku.",
      },
      { text: "Wszczęcie postępowania wyjaśniającego, zamykanego zwykle przed kolacją." },
    ],
    example: "Srebrna Astra, rejestracja nie nasza. A to do kogo?",
    exampleNote: "Sprawę zamknięto o 18:40. Do tych z trzeciego, co mają remont.",
    seeAlso: ["ja tam w oknie nie siedzę", "kto to tak zaparkował?"],
    species: "parapetowy",
  },
  {
    slug: "ja-tam-w-oknie-nie-siedze",
    headword: "ja tam w oknie nie siedzę",
    grammar: "zastrzeżenie wstępne",
    pronunciation: "wym. od niechcenia, tuż przed podaniem godziny co do minuty",
    senses: [
      {
        text: "Formuła poprzedzająca szczegółowy raport o tym, kto, kiedy i z kim wszedł do klatki albo z niej wyszedł.",
      },
    ],
    example: "Ja tam w oknie nie siedzę, ale ten z czwartego wrócił o 2:17. Taksówką.",
    exampleNote: "Raport sporządzono bez użycia lornetki. Lornetka była w naprawie.",
    seeAlso: ["a to do kogo?", "to jest moje miejsce"],
    species: "parapetowy",
  },
  {
    slug: "trzeba-wypoziomowac",
    headword: "trzeba wypoziomować",
    grammar: "zalecenie techniczne",
    pronunciation: "wym. na kolanach, z poziomicą przyłożoną do progu przyczepy",
    senses: [
      {
        text: "Pierwsza czynność po przyjeździe na kemping. Trwa od czterdziestu minut do całego popołudnia, a odchylenie większe niż dwa milimetry uznaje się za porażkę.",
      },
    ],
    example: "Nie rozkładajcie jeszcze krzesełek. Trzeba wypoziomować.",
    exampleNote: "Pobyt trwał trzy dni. Przyczepa stała równo przez ostatni z nich.",
    seeAlso: ["a prąd jest w cenie?", "ja nie potrzebuję instrukcji"],
    species: "kempingowy",
  },
  {
    slug: "a-prad-jest-w-cenie",
    headword: "a prąd jest w cenie?",
    grammar: "zapytanie ofertowe",
    pronunciation: "wym. w recepcji, z rozwiniętym już przedłużaczem",
    senses: [
      {
        text: "Pierwsze pytanie zadawane na kempingu. Od odpowiedzi zależy, czy na stanowisku pojawią się czajnik elektryczny, lodówka turystyczna i grzejnik olejowy.",
      },
    ],
    example: "Dzień dobry, na dwa tygodnie. A prąd jest w cenie?",
    exampleNote: "Prąd był w cenie. Pierwszego wieczoru na całym kempingu dwa razy wybiło korki.",
    seeAlso: ["trzeba wypoziomować", "zgaś światło, prąd nie jest za darmo"],
    species: "kempingowy",
  },
  {
    slug: "swoje-bez-chemii",
    headword: "swoje, bez chemii",
    grammar: "atest ekologiczny",
    pronunciation: "wym. przez płot, z reklamówką w wyciągniętej ręce",
    senses: [
      { text: "Świadectwo jakości warzyw z własnej działki. Nie obejmuje informacji o czerwcowym oprysku." },
      { text: "Powód, dla którego nie można odmówić przyjęcia trzeciej reklamówki w tym tygodniu." },
    ],
    example: "Weź pomidory. Swoje, bez chemii.",
    exampleNote: "Od lipca do września mówiący rozdał w ten sposób także 84 kilogramy cukinii.",
    seeAlso: ["to się jeszcze przyda", "będzie padać, czuję w kolanie"],
    species: "dzialka",
  },
  {
    slug: "wyslalem-ci-maila",
    headword: "wysłałem ci maila",
    grammar: "awizo telefoniczne",
    pronunciation: "wym. do słuchawki, dwie minuty po wysłaniu",
    senses: [
      { text: "Telefoniczne powiadomienie o wysłaniu wiadomości elektronicznej." },
      { text: "Przekonanie, że wiadomość dociera dopiero wtedy, gdy adresat zostanie o niej uprzedzony telefonicznie." },
    ],
    example: "Halo? Wysłałem ci maila. Sprawdź, czy doszedł.",
    exampleNote: "Mail zawierał prośbę o telefon.",
    seeAlso: ["pozdrawiam serdecznie", "zróbmy calla"],
    species: "korpo",
  },
  {
    slug: "mowili-w-telewizji",
    headword: "mówili w telewizji",
    grammar: "przypis źródłowy",
    pronunciation: "wym. z uniesionym palcem wskazującym, jak przy cytowaniu przepisu",
    senses: [
      { text: "Odwołanie do źródła, które nie wymaga podania stacji, programu ani daty." },
      { text: "Argument wyższej rangi niż wszystko, co ktokolwiek przeczytał w internecie." },
    ],
    example: "Ładowarka w kontakcie ciągnie prąd, nawet jak nic nie ładuje. Mówili w telewizji.",
    exampleNote: "Audycję wyemitowano w 2004 roku. Kanału mówiący nie pamięta.",
    seeAlso: ["udostępnij, zanim usuną", "zgaś światło, prąd nie jest za darmo"],
  },
  {
    slug: "w-gazetce-bylo-taniej",
    headword: "w gazetce było taniej",
    grammar: "reklamacja ustna",
    pronunciation: "wym. przy kasie, z gazetką rozłożoną na taśmie",
    senses: [
      {
        text: "Sprzeciw wobec ceny na paragonie, zgłaszany na podstawie gazetki promocyjnej, którą mówiący nosi złożoną na czworo w kieszeni kurtki.",
      },
      { text: "Przekonanie, że każda cena wyższa niż w gazetce jest pomyłką sklepu." },
    ],
    example: "Proszę pani, w gazetce było taniej. Po trzy dziewięćdziesiąt dziewięć.",
    exampleNote: "Gazetka dotyczyła następnego tygodnia. Mówiący wrócił w poniedziałek.",
    seeAlso: ["ile pan za to dał?", "może by tak drugą kasę otworzyli?", "umawialiśmy się, że bez prezentów"],
    species: "oszczednosciowy",
  },
];

/** Alphabetical, Polish collation. */
export const DICTIONARY_SORTED = [...DICTIONARY].sort((a, b) => a.headword.localeCompare(b.headword, "pl"));

/* Editions ------------------------------------------------------------------------------------------ */

/**
 * The Slovenian edition: Slovenian headwords and slugs, the Polish headword kept as `original`, and
 * cross-references re-pointed to the Slovenian headwords of the same entries.
 */
const DICTIONARY_SLOVENIAN: Entry[] = (() => {
  const translated = overlayList("dictionary", DICTIONARY, (entry) => entry.slug, DICTIONARY_SL);
  const headwords = new Map(DICTIONARY.map((entry, i) => [entry.headword, translated[i].headword]));
  return translated.map((entry, i) => ({
    ...entry,
    slug: DICTIONARY_SLUGS[DICTIONARY[i].slug] ?? entry.slug,
    original: DICTIONARY[i].headword,
    seeAlso: entry.seeAlso.map((headword) => headwords.get(headword) ?? headword),
  }));
})();

const EDITIONS: Record<Locale, Entry[]> = { pl: DICTIONARY, sl: DICTIONARY_SLOVENIAN };

const SORTED: Record<Locale, Entry[]> = {
  pl: DICTIONARY_SORTED,
  sl: [...DICTIONARY_SLOVENIAN].sort((a, b) => a.headword.localeCompare(b.headword, "sl")),
};

/** The entries in the Polish order, with the edition's text and slugs. */
export const getDictionary = (locale: Locale): Entry[] => EDITIONS[locale];

/** Alphabetical, in the edition's collation. */
export const getDictionarySorted = (locale: Locale): Entry[] => SORTED[locale];

export const entryBySlug = (slug: string, locale: Locale) => EDITIONS[locale].find((entry) => entry.slug === slug);

/** Looks up a headword as written in the edition's `seeAlso`. */
export const entryByHeadword = (headword: string, locale: Locale) =>
  EDITIONS[locale].find((entry) => entry.headword === headword);
