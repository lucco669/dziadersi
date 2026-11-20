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
  /** What the phrase means outside the Institute, in plain words: for readers who search for its meaning. */
  usage?: string;
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
    usage:
      "Zwrot uzasadnia zatrzymanie kartonu, słoika, kabla albo starej kurtki, których nikt właśnie nie używa. Wyraża oszczędność wyniesioną z czasów, gdy wiele rzeczy trudno było kupić, dlatego częściej słychać go u starszych pokoleń. Czasem ma rację; zwykle kończy się piwnicą, w której niczego nie da się znaleźć, kiedy rzecz wreszcie się przydaje.",
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
    usage:
      "„Panie” to wołacz od „pan”, używany potocznie jako zwrot do mężczyzny, którego imienia się nie zna. Na początku zdania działa jak westchnienie: zapowiada narzekanie albo wykład z dziedziny, w której mówiący czuje się ekspertem. Typowe miejsca: warsztat samochodowy, targ, budowa i kolejka do kasy.",
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
    usage:
      "Zwrot wprowadza porównanie teraźniejszości z młodością mówiącego, prawie zawsze na niekorzyść teraźniejszości. Pada w rozmowach o cenach, pracy, szkole i wychowaniu dzieci. Konkretna data rzadko się w nim pojawia: „moje czasy” to zwykle lata, w których mówiący miał od kilkunastu do trzydziestu lat.",
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
    usage:
      "Powiedzenie oznacza, że dawniej zimy były mroźniejsze i bardziej śnieżne niż dziś. Pada przy każdej odwilży, w rozmowach o pogodzie i przy wspomnieniach z dzieciństwa. Dane klimatyczne rzeczywiście pokazują, że zimy łagodnieją, ale zdanie nie opiera się na danych, tylko na pamięci.",
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
    usage:
      "Deklaracja, że mówiący poradzi sobie z montażem albo obsługą urządzenia bez czytania instrukcji, na podstawie doświadczenia i wyczucia. Pada najczęściej przy składaniu mebli, podłączaniu sprzętu i pierwszym uruchomieniu nowego telefonu. Po instrukcję sięga się dopiero wtedy, gdy zostają części, których nie ma gdzie przykręcić.",
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
    usage:
      "Pytanie o cenę, zadawane właścicielowi nowego samochodu, roweru, telewizora albo remontu. Zwykle nie wynika z ciekawości, tylko jest wstępem do oceny, czy kupujący przepłacił. Po odpowiedzi najczęściej pada informacja, gdzie można było kupić taniej albo kto by to załatwił po znajomości.",
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
    usage:
      "„Poustawiane” znaczy „ustawione po swojemu”: kanały, głośność, fotel albo lusterka zostały skonfigurowane i każda zmiana grozi utratą tego układu. Zwrot jest prośbą, żeby niczego nie przestawiać, zwykle wypowiadaną szybciej, niż ktokolwiek zdążył czegoś dotknąć. Często dotyczy ustawień, których mówiący sam nie potrafiłby odtworzyć.",
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
    usage:
      "Retoryczne pytanie fachowca albo samozwańczego eksperta, który ogląda cudzą instalację, remont lub naprawę i ocenia je źle. Znaczy mniej więcej „to zostało zrobione nieprawidłowo”. Słyszy je prawie każdy, kto wezwał hydraulika, elektryka albo mechanika do roboty po poprzedniku; dziaderskie staje się wtedy, gdy pada w gościach, bez zaproszenia do oględzin.",
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
    usage:
      "Zwrot wyraża przekonanie, że dawne przedmioty były trwalsze i solidniejsze niż obecne. Pada przy starych samochodach, narzędziach, meblach i sprzęcie AGD, często z poklepaniem obudowy. Bywa trafny, bo wiele starych rzeczy przetrwało, ale pomija te, które się zepsuły i dawno trafiły na złom.",
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
    usage:
      "Tautologia oznaczająca, że silnik wysokoprężny jest z definicji najlepszym wyborem: oszczędny, trwały i „ciągnie”. Pada w sporach o napęd, zwłaszcza gdy ktoś wspomni o benzynie, hybrydzie albo samochodzie elektrycznym. Nie zawiera argumentu, tylko jego zapowiedź; dalsza rozmowa zwykle dotyczy spalania w trasie i legendarnego silnika 1.9 TDI.",
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
    usage:
      "Uwaga do osoby, która rozpala grilla, ognisko albo piec, że robi to źle. W praktyce zapowiada przejęcie czynności przez mówiącego: „daj, pokażę ci”. Spory dotyczą zwykle podpałki, kolejności układania węgla i tego, czy wolno dmuchać.",
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
    usage:
      "Kulinarna zasada, że mięso na grilla, zwłaszcza karkówka, powinno odpowiednio długo marynować się przed pieczeniem. To, że coś „musi swoje odstać”, znaczy, że potrzebuje czasu i nie warto się spieszyć. Zwrot pada też poza kuchnią: o cieście, nalewce i decyzjach.",
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
    usage:
      "Stwierdzenie prawa do miejsca parkingowego, przy stole, na kanapie albo w kościelnej ławce. Często dotyczy miejsca, które formalnie nikomu nie przysługuje, ale ktoś zajmuje je od lat i uważa to za tytuł prawny. Między sąsiadami bywa początkiem wieloletniego sporu.",
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
    usage:
      "Zwrot przeciwstawia dawną, ciężką pracę fizyczną obecnej, którą mówiący uważa za łatwiejszą: biurowej, zdalnej albo „przy komputerze”. Pada w rozmowach o młodszym pokoleniu, urlopach i pracy z domu. Zwykle nie chodzi w nim o liczbę godzin, tylko o to, czy pracę widać: zmęczenie przy biurku nie liczy się do stażu.",
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
    usage:
      "„Call” to zapożyczenie z angielskiego oznaczające rozmowę telefoniczną albo wideorozmowę, najczęściej służbową. „Zróbmy calla” znaczy więc „porozmawiajmy na spotkaniu online”. Zwrot należy do języka korporacyjnego, obok „spotkania o spotkaniu”, „feedbacku” i „asapa”; do Słownika trafia przez dziadersa, który używa go chętnie, ale wciąż drukuje notatki.",
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
    usage:
      "„Pozdrawiam serdecznie” to grzecznościowa formuła kończąca list, e-mail albo wiadomość. Znaczy tyle co „przesyłam życzliwe pozdrowienia” i jest cieplejsza od samego „pozdrawiam”. W korespondencji służbowej uchodzi za uprzejmą i neutralną. W krótkiej wiadomości na czacie, zwłaszcza po słowie „ok”, brzmi już bardzo oficjalnie, a czasem chłodno.",
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
    usage:
      "Wezwanie do szybkiego udostępnienia posta w mediach społecznościowych, rzekomo zanim ktoś go zablokuje lub usunie. Typowe dla łańcuszków, sensacyjnych „ukrytych prawd” i fałszywych informacji o zdrowiu. Sama formuła jest sygnałem ostrzegawczym: treść, którą ktoś naprawdę chce usunąć, rzadko prosi o udostępnienie wielkimi literami.",
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
    usage:
      "Pytanie pod zdjęciem przedmiotu, programu albo produktu sprzed lat, zachęcające do wspomnień i komentarzy. Popularne w grupach nostalgicznych, zwłaszcza o czasach PRL i latach dziewięćdziesiątych. Zwykle nie oczekuje odpowiedzi, tylko lawiny komentarzy „ja pamiętam” i historii z dzieciństwa.",
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
    usage:
      "Deklaracja doświadczenia grzybiarza, wędkarza albo turysty: mówiący zna teren od dawna i wie, gdzie warto iść. W praktyce zwykle oznacza, że tych miejsc nie zdradzi. Pada też jako argument w sporze o drogę, gdy nawigacja prowadzi gdzie indziej.",
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
    usage:
      "Prognoza pogody oparta na odczuciach w stawach. Ból kolana, krzyża albo starej kontuzji ma zapowiadać deszcz. Wiele osób to zgłasza, ale badania nie dają jednoznacznej odpowiedzi, czy rzeczywiście wywołują go zmiany ciśnienia. W rozmowie zwrot działa jako argument przeciw wyjściu z domu bez parasola.",
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
    usage:
      "Wędkarskie określenie wielkości ryby, która się urwała albo została wypuszczona, połączone z gestem rozłożonych rąk. Nikt poza mówiącym jej nie widział, a odległość między dłońmi rośnie z każdym opowiadaniem. Zwrot przeszedł do mowy potocznej jako określenie każdej przechwałki, której nie da się sprawdzić.",
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
    usage:
      "Wędkarskie wyjaśnienie, że nic nie złowiono, bo ryby nie brały przynęty. Winne bywają ciśnienie, wiatr, pełnia, woda za ciepła albo za zimna, ale nigdy umiejętności wędkarza. Żartobliwie mówi się tak też o każdym nieudanym dniu w pracy albo w sklepie.",
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
    usage:
      "Upomnienie, żeby wyłączać światło po wyjściu z pokoju, bo prąd kosztuje. Należy do domowego kanonu oszczędzania obok zakręcania wody i zamykania lodówki. Sama rada jest rozsądna; dziaderskie staje się tempo jej wydawania i to, że obowiązuje wszystkich poza telewizorem, który gra w pustym salonie.",
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
    usage:
      "„Rzucę wszystko i wyjadę w Bieszczady” znaczy: mam dość obowiązków i marzę o prostym życiu z dala od ludzi. Bieszczady to góry w południowo-wschodniej Polsce, od dziesięcioleci symbol ucieczki od miasta i pracy. Zwrot jest zwykle żartem albo westchnieniem po ciężkim dniu, a nie planem z datą wyjazdu.",
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
    usage:
      "Zwrot wyjaśnia, że urządzenie skonfigurowała młodsza osoba z rodziny, więc mówiący nie odpowiada za jego działanie i nie zamierza niczego zmieniać. Dotyczy telefonów, telewizorów, routerów i aplikacji bankowych. Bywa też prośbą: jeśli coś przestało działać, naprawić to może tylko ten sam wnuczek.",
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
    usage:
      "Pytanie o spalanie samochodu, czyli o to, ile litrów paliwa zużywa na sto kilometrów. Dla wielu kierowców to pierwsza i najważniejsza informacja o aucie, ważniejsza od wyposażenia i bezpieczeństwa. Po odpowiedzi zwykle następuje porównanie z własnym dieslem, który pali mniej.",
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
        text: "Formuła, która pozwala ominąć kolejkę dowolnej długości. Pytanie trwa średnio cztery minuty i obejmuje 3,4 pytania dodatkowego.",
      },
      {
        text: "Przekonanie, że kolejka obowiązuje tych, którzy mają sprawę, a nie tych, którzy mają pytanie.",
        figurative: true,
      },
    ],
    example: "Przepraszam, ja tylko zapytać. I od razu nadam paczkę.",
    exampleNote: "Paczek było pięć. Każda za pobraniem.",
    usage:
      "Skrót od „ja chciałem tylko zapytać”: formuła, z którą ktoś podchodzi do okienka bez stania w kolejce, bo ma „tylko pytanie”. Zakłada, że pytanie zajmie chwilę i nie wymaga czekania. W praktyce często przechodzi w załatwienie całej sprawy, co w kolejce wywołuje głośne „pan tu nie stał”.",
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
    usage:
      "Zwrot w kolejce, którym ktoś zgłasza, że zajmował już miejsce, ale na chwilę odszedł. Bywa uczciwy, bo ktoś rzeczywiście poszedł po koszyk, i bywa nadużywany przez osoby, które pojawiają się tuż przed okienkiem. Kolejka przyjmuje go zwykle z westchnieniem i milczącą weryfikacją.",
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
    usage:
      "Głośno wypowiedziana prośba do obsługi sklepu, żeby uruchomiła kolejną kasę, bo kolejka jest za długa. Częściej kierowana jest do całej kolejki niż do kasjerki i pokazuje, że mówiący nie zamierza czekać w milczeniu. Działa zaskakująco często, zwłaszcza gdy powtórzy ją kilka osób.",
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
    usage:
      "Pytanie o kierowcę, który zaparkował krzywo, na dwóch miejscach albo zablokował wyjazd. Wyraża złość i pada głośno, choć w pobliżu nikogo nie ma. Bywa wstępem do kartki za wycieraczką, telefonu do straży miejskiej albo zdjęcia w grupie osiedlowej.",
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
        text: "Wstęp do porównania, którego wynik jest znany z góry. Wiedza mówiącego o Niemczech pochodzi z trzech sezonów na szparagach i jednego passata.",
      },
      { text: "Wzór porządku, który obowiązuje wszystkich z wyjątkiem mówiącego.", figurative: true },
    ],
    example: "W Niemczech to by tę dziurę załatali w jeden dzień.",
    exampleNote: "Dziura znajduje się przed posesją mówiącego od 2009 roku. Mówiący jej nie zgłosił.",
    usage:
      "Początek porównania, w którym zagranica, najczęściej Niemcy, wypada lepiej od Polski: drogi, urzędy, porządek, płace. Opiera się zwykle na doświadczeniu z pracy sezonowej, wycieczki albo opowieści szwagra. Zwrot wyraża narzekanie na sprawy krajowe, a nie rzeczywistą wiedzę o Niemczech.",
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
    usage:
      "Zwrot podkreśla, że przedmiot pochodzi z Niemiec, co w polskim handlu używanymi rzeczami od lat uchodzi za gwarancję jakości. Pada przy sprzedaży samochodów, części, narzędzi i chemii gospodarczej. Ma sugerować, że rzecz jest lepsza od krajowej, nawet jeśli wyprodukowano ją gdzie indziej, a w Niemczech tylko ją kupiono.",
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
    usage:
      "Motoryzacyjna diagnoza, że niepokojący dźwięk, wibracja albo nowa usterka w samochodzie zniknie sama w czasie jazdy. Przy nowych oponach czy klockach hamulcowych bywa prawdziwa; częściej oznacza odłożenie wizyty u mechanika. Mechanik słyszy ją potem jako wstęp do zdania „stuka od miesiąca”.",
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
    usage:
      "Zastrzeżenie, że rzecz kupiono do oglądania, a nie do używania, jak serwis „dla gości”, nowy dywan, kanapa w folii czy kryształy w meblościance. Wynika z szacunku do drogich przedmiotów, kupionych z wysiłkiem. W efekcie najlepsze rzeczy w domu czekają na okazję, która rzadko przychodzi.",
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
    usage:
      "Komentarz kibica oznaczający, że piłkarz zmarnował łatwą sytuację, którą mówiący na pewno by wykorzystał. Pada przed telewizorem, w trakcie meczu albo tuż po nim. Szerzej odnosi się do każdej cudzej decyzji ocenianej z wygodnej pozycji: z kanapy wszystko jest prostsze, niż było na boisku.",
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
    usage:
      "Kibicowskie określenie sędziego, który zdaniem mówiącego źle sędziuje; „kalosz” znaczy tu tyle co niezdara. Okrzyk pada na stadionie i przed telewizorem po każdej decyzji niekorzystnej dla „naszych”. Nie dotyczy sędziów, którzy podyktowali karnego dla właściwej drużyny.",
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
    usage:
      "Wędkarskie upomnienie, żeby nie rozmawiać i nie hałasować, bo hałas odstrasza ryby. Wędkarze spierają się, na ile ryby słyszą rozmowę na brzegu, ale tupanie po pomoście i stukanie o łódź mogą je płoszyć. Do Słownika zwrot trafia przez dziadersa, bo zakaz obowiązuje wszystkich poza osobą, która go ogłasza.",
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
    usage:
      "Pytanie o zaginiony pilot do telewizora, zadawane całemu domowi naraz. Zwykle pada tuż przed ważnym programem i zanim pytający przeszuka najbliższe otoczenie: kieszenie, fotel i kanapę. W wielu rodzinach jest rytuałem, po którym następuje wspólne przetrząsanie poduszek i ustalanie, kto ostatni oglądał.",
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
    usage:
      "Najkrótsza recenzja przyjęcia, zwłaszcza wesela: jedzenia było dużo i było dobre. Dla wielu gości to podstawowe kryterium udanej uroczystości, obok liczby ciepłych dań i tego, czy czegoś nie zabrakło. Brak tej oceny w relacji z wesela bywa odczytywany jako ostrzeżenie.",
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
    usage:
      "Prośba do DJ-a, kierowcy albo sprzedawcy o zmianę muzyki na taką, którą mówiący zna i lubi. „Normalne” oznacza zwykle przeboje sprzed lat, a „nienormalne” wszystko, co wydano później. Forma „puść pan” łączy grzecznościowe „pan” z potocznym trybem rozkazującym i jest typowa dla wesel, taksówek i imprez rodzinnych.",
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
    usage:
      "Komentarz do świątecznej ramówki: od lat telewizja w okolicach Wigilii nadaje komedię „Kevin sam w domu”. Dla jednych to narzekanie na powtórki, dla innych znak, że święta naprawdę się zaczęły. Film oglądają zwykle także ci, którzy narzekają.",
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
    usage:
      "Przypomnienie rodzinnej umowy, że na święta, urodziny albo imieniny nikt nie kupuje prezentów. Taka umowa ma oszczędzić pieniądze i stres, ale zwykle łamie ją ktoś, kto ma „tylko drobiazg”, a pozostali czują się zawstydzeni. Dlatego zwrot pada najczęściej w chwili wręczania prezentu.",
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
    example: "Srebrna astra, rejestracja nie nasza. A to do kogo?",
    exampleNote: "Sprawę zamknięto o 18:40. Do tych z trzeciego, co mają remont.",
    usage:
      "Pytanie, do kogo przyjechał nieznany samochód albo gość, zadawane przez sąsiada, który zna wszystkie auta na ulicy. Wyraża ciekawość, czasem czujność, i należy do repertuaru osiedli, bloków i wsi. Odpowiedź rzadko jest potrzebna: pytający zwykle ustala ją sam, obserwując, pod którą klatką gość zaparkował.",
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
    usage:
      "Zastrzeżenie, że mówiący nie obserwuje sąsiadów, wypowiadane tuż przed dokładną relacją z tego, co sąsiedzi robili. Sąsiad albo sąsiadka w oknie to stały element polskiego osiedla: wie, kto przyjechał, kto wyjechał i o której. Zwrot jest więc zaprzeczeniem, które potwierdza.",
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
    usage:
      "Zalecenie, żeby ustawić przyczepę, kampera, namiot, pralkę albo półkę idealnie w poziomie, zwykle za pomocą poziomicy i podkładek. Na kempingu to pierwszy obowiązek po przyjeździe, bo w krzywo stojącym kamperze źle się śpi, a lodówka gorzej chłodzi. Kłopot zaczyna się, gdy poziomowanie trwa dłużej niż urlop.",
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
    usage:
      "Pytanie, czy opłata za nocleg, miejsce na kempingu albo wynajem obejmuje zużycie energii elektrycznej. Na kempingach przyłącze prądu bywa płatne osobno, więc pytanie ma sens. Dziaderskie staje się wtedy, gdy od odpowiedzi zależy, czy z bagażnika wyjadą czajnik, lodówka i grzejnik olejowy.",
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
    usage:
      "Zapewnienie, że warzywa albo owoce pochodzą z własnej działki lub ogródka i nie były pryskane środkami ochrony roślin ani nawożone sztucznymi nawozami. Domowe plony uchodzą za zdrowsze i smaczniejsze od sklepowych. Zwrot nie zawsze uwzględnia czerwcowy oprysk na stonkę.",
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
    usage:
      "Zwrot oznacza telefoniczne uprzedzenie, że właśnie wysłano wiadomość e-mail. Wynika z ostrożności wobec poczty elektronicznej: mówiący chce mieć pewność, że wiadomość dotarła i zostanie przeczytana. W pracy bywa rozsądny przy pilnych sprawach; dziaderski staje się wtedy, gdy towarzyszy każdemu mailowi, łącznie z tym o treści „w załączniku”.",
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
    usage:
      "Powołanie się na telewizję jako źródło informacji, bez podania stacji, programu ani daty. Dla części starszych widzów telewizja pozostaje bardziej wiarygodna niż internet, bo informacje przechodzą tam przez redakcję. W sporze zwrot ma zakończyć dyskusję, ale trudno go sprawdzić.",
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
    usage:
      "„Gazetka” to potoczna nazwa ulotki promocyjnej sklepu z cenami na dany tydzień. Zwrot jest reklamacją przy kasie: cena na paragonie nie zgadza się z tą z promocji. Bywa słuszny, bo różnice się zdarzają, ale często okazuje się, że promocja dotyczyła innej gramatury, karty lojalnościowej albo skończyła się wczoraj.",
    seeAlso: ["ile pan za to dał?", "może by tak drugą kasę otworzyli?", "umawialiśmy się, że bez prezentów"],
    species: "oszczednosciowy",
  },
  {
    slug: "to-jest-na-wczoraj",
    headword: "to jest na wczoraj",
    grammar: "termin, przeterminowany",
    pronunciation: "wym. w drzwiach, w piątek o 16:45",
    senses: [
      { text: "Termin wykonania zadania, który upłynął, zanim zadanie zostało zlecone." },
      { text: "Stopień pilności, po którym zadanie czeka na podpis do wtorku.", figurative: true },
    ],
    example: "Potrzebuję tego zestawienia. To jest na wczoraj.",
    exampleNote: "Zestawienie leżało u przełożonego od poniedziałku.",
    usage:
      "„Na wczoraj” znaczy „bardzo pilnie, natychmiast”: sprawa jest tak pilna, że najlepiej byłoby załatwić ją wczoraj. Zwrot należy do żargonu biurowego i podkreśla priorytet zadania. Kiedy wszystkie zadania są „na wczoraj”, przestaje znaczyć cokolwiek poza tym, że zawiodło planowanie.",
    seeAlso: ["zróbmy calla", "wysłałem ci maila", "kiedyś to się pracowało"],
    species: "korpo",
  },
  {
    slug: "w-nawiazaniu-do-rozmowy-telefonicznej",
    headword: "w nawiązaniu do rozmowy telefonicznej",
    grammar: "formuła wstępna, urzędowa",
    pronunciation: "wym. pisemnie, dwie minuty po rozmowie",
    senses: [
      { text: "Pierwsze zdanie maila, który powtarza rozmowę telefoniczną, żeby była na piśmie." },
      { text: "Dowód rzeczowy na wypadek, gdyby rozmówca zapomniał, co obiecał.", figurative: true },
    ],
    example: "W nawiązaniu do rozmowy telefonicznej przesyłam ustalenia. Proszę o potwierdzenie telefoniczne.",
    exampleNote: "Ustalenie było jedno: że prześle ustalenia.",
    usage:
      "Oficjalna formuła rozpoczynająca list albo e-mail, który odnosi się do wcześniejszej rozmowy przez telefon. Znaczy „piszę w sprawie, o której rozmawialiśmy” i służy potwierdzeniu ustaleń na piśmie. W korespondencji służbowej jest poprawna i przydatna; sztywno brzmi w wiadomości do kogoś, z kim minutę wcześniej rozmawiało się przy sąsiednim biurku.",
    seeAlso: ["wysłałem ci maila", "pozdrawiam serdecznie", "to jest na wczoraj"],
    species: "korpo",
  },
  {
    slug: "w-stodole-mieszkasz",
    headword: "zamykaj drzwi, w stodole mieszkasz?",
    grammar: "pytanie wychowawcze, retoryczne",
    pronunciation: "wym. z drugiego pokoju, przy otwartym oknie",
    senses: [
      { text: "Przypomnienie o zamknięciu drzwi, sformułowane jako pytanie o miejsce zamieszkania." },
      { text: "Ochrona ciepła w mieszkaniu, w którym termostat ustawiono na dwójkę.", figurative: true },
    ],
    example: "Zamykaj drzwi! W stodole mieszkasz? Ciepło ucieka.",
    exampleNote: "Drzwi były uchylone na szerokość kota.",
    usage:
      "Upomnienie, żeby zamknąć za sobą drzwi do mieszkania, pokoju albo na balkon. Stodoła, budynek gospodarczy z szerokimi wrotami, służy tu za przykład miejsca, w którym drzwi się nie zamyka. Pytanie jest retoryczne i dotyczy najczęściej dzieci, kotów oraz ciepła, które zdaniem rodziców „ucieka na ulicę”.",
    seeAlso: ["zgaś światło, prąd nie jest za darmo", "dopóki mieszkasz pod moim dachem"],
    species: "oszczednosciowy",
  },
  {
    slug: "dopoki-mieszkasz-pod-moim-dachem",
    headword: "dopóki mieszkasz pod moim dachem",
    grammar: "klauzula najmu, rodzinna",
    pronunciation: "wym. w progu pokoju, z ręką na framudze",
    senses: [
      { text: "Podstawa prawna rodzicielskich decyzji w sprawie godziny powrotu, muzyki i fryzury." },
      { text: "Umowa najmu bez czynszu, z regulaminem ogłaszanym ustnie w miarę potrzeb.", figurative: true },
    ],
    example: "Dopóki mieszkasz pod moim dachem, obowiązują moje zasady.",
    exampleNote: "Zasad nie spisano. Obowiązywały wstecz.",
    usage:
      "Zwrot rodzica do dorastającego albo dorosłego dziecka, które mieszka w domu rodzinnym, że skoro korzysta z mieszkania i utrzymania, ma przestrzegać zasad domu. Pada w sporach o godzinę powrotu, porządek, gości i sposób spędzania czasu. Jest argumentem z pozycji siły i zwykle kończy rozmowę, ale nie spór.",
    seeAlso: ["ja w twoim wieku", "zamykaj drzwi, w stodole mieszkasz?", "pieniądze nie rosną na drzewach"],
  },
  {
    slug: "ja-w-twoim-wieku",
    headword: "ja w twoim wieku",
    grammar: "porównanie biograficzne",
    pronunciation: "wym. z pauzą na wyliczenie osiągnięć",
    senses: [
      { text: "Wstęp do zestawienia, z którego wynika, że mówiący w tym wieku miał już pracę, mieszkanie, dwoje dzieci i własnoręcznie zbudowany garaż." },
      { text: "Miara opóźnienia rozwojowego młodszego pokolenia, wyrażona w latach.", figurative: true },
    ],
    example: "Ja w twoim wieku to już miałem dwoje dzieci i malucha.",
    exampleNote: "Maluch był na talon. Mieszkanie z przydziału.",
    usage:
      "Początek porównania z własną młodością, w którym rozmówca wypada gorzej, bo później się usamodzielnia, mniej pracuje i nie ma jeszcze rodziny albo mieszkania. Zwrot pomija zwykle różnice w czasach, cenach mieszkań i rynku pracy. Bywa życzliwą zachętą, ale częściej brzmi jak wyrzut.",
    seeAlso: ["za moich czasów", "kiedyś to się pracowało", "dopóki mieszkasz pod moim dachem"],
  },
  {
    slug: "pieniadze-nie-rosna-na-drzewach",
    headword: "pieniądze nie rosną na drzewach",
    grammar: "twierdzenie botaniczne",
    pronunciation: "wym. przy kasie, na widok koszyka dziecka",
    senses: [
      { text: "Ustalenie naukowe, że banknoty nie są owocem. Ogłaszane przy każdej prośbie o kieszonkowe." },
      { text: "Uzasadnienie zakupu najtańszej wersji czegokolwiek, także takiej, która psuje się po tygodniu.", figurative: true },
    ],
    example: "Pieniądze nie rosną na drzewach. Weź te za trzy dziewięćdziesiąt.",
    exampleNote: "Kupiono je dwa razy. Wyszło drożej.",
    usage:
      "Przysłowie przypominające, że pieniądze trzeba zarobić, więc nie należy wydawać ich lekkomyślnie. Rodzice mówią tak zwykle do dzieci, które proszą o coś, co dorosłym wydaje się zbędne. To odpowiednik angielskiego „money doesn't grow on trees”.",
    seeAlso: ["zgaś światło, prąd nie jest za darmo", "w gazetce było taniej", "dopóki mieszkasz pod moim dachem"],
    species: "oszczednosciowy",
  },
  {
    slug: "co-ludzie-powiedza",
    headword: "co ludzie powiedzą?",
    grammar: "pytanie wizerunkowe",
    pronunciation: "wym. ściszonym głosem, z zerknięciem w okno",
    senses: [
      { text: "Główne kryterium decyzji rodzinnych: od koloru elewacji po wybór studiów." },
      { text: "Odwołanie do opinii osób, które nikogo nie pytały o zdanie i których nikt nie pytał.", figurative: true },
    ],
    example: "W dresie do sklepu? A co ludzie powiedzą?",
    exampleNote: "Sklep był czynny całą dobę. Ludzie byli w dresach.",
    usage:
      "Pytanie wyrażające obawę o opinię sąsiadów, rodziny i parafii. Mówiący ocenia czyjś wybór nie według tego, czy jest dobry, tylko według tego, jak zostanie odebrany. Pada przy strojach, ślubach, rozwodach, remontach i wyborach życiowych, a jego siła rośnie z liczbą okien z widokiem na podwórko.",
    seeAlso: ["ja tam w oknie nie siedzę", "dopóki mieszkasz pod moim dachem"],
    species: "parapetowy",
  },
  {
    slug: "do-wesela-sie-zagoi",
    headword: "do wesela się zagoi",
    grammar: "prognoza medyczna, długoterminowa",
    pronunciation: "wym. pogodnie, bez oglądania rany",
    senses: [
      { text: "Diagnoza każdego otarcia, siniaka i rozbitego kolana. Termin wesela nie musi być wyznaczony." },
      { text: "Zapewnienie, że problem rozwiąże się sam, jeżeli nikt się nim nie zajmie.", figurative: true },
    ],
    example: "Nie płacz, do wesela się zagoi.",
    exampleNote: "Osoba badana miała sześć lat. Zagoiło się po tygodniu. Wesele odbyło się dwadzieścia lat później.",
    usage:
      "Pocieszenie dla dziecka albo kogoś, kto lekko się zranił. Znaczy, że rana jest niegroźna i zagoi się na długo przed jakimś odległym wydarzeniem, na przykład weselem. W przenośni znaczy, że kłopot nie jest poważny i minie. Przy poważniejszym urazie zamiast przysłowia lepiej sięgnąć po apteczkę albo pojechać do lekarza.",
    seeAlso: ["dobrze karmili", "będzie padać, czuję w kolanie"],
    species: "weselny",
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
