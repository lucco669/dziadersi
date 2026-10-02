import type { SpeciesKey } from "./species";

export type Report = {
  /** URL segment. Stable: never change it once published. */
  slug: string;
  number: string;
  /** ISO date of publication. */
  date: string;
  category: string;
  title: string;
  /** For search results and the browser tab, when `title` is longer than 70 characters. */
  shortTitle?: string;
  /** One or two sentences: the listing, meta description and share text. */
  lede: string;
  sample: string;
  abstract: string;
  findings: { value: string; label: string }[];
  chart: { title: string; unit: string; bars: { label: string; value: number }[] };
  sections: { heading: string; paragraphs: string[] }[];
  conclusions: string[];
  methodology: string;
  species: SpeciesKey[];
};

export const REPORTS: Report[] = [
  {
    slug: "sezon-grzewczy",
    number: "IBD/2026/08",
    date: "2026-10-01",
    category: "Raport sezonowy",
    title: "„Ubierz się cieplej”. Polityka grzewcza polskiego domu",
    lede: "Na zgłoszenie „zimno mi” w 61% przypadków pada odpowiedź „ubierz się cieplej”. Zawór podkręcony bez zgody gospodarza wraca na 2,5 średnio po 12 minutach.",
    sample: "1 040 gospodarstw domowych, 5 824 grzejniki, sezon grzewczy 2025/2026",
    abstract:
      "Instytut zbadał, kto i na jakich zasadach steruje ogrzewaniem w 1 040 polskich gospodarstwach domowych. W 83% domów zawory grzejnikowe obsługiwała wyłącznie jedna osoba, która najczęściej ustawiała je na 2,5. Na 61% zgłoszeń „zimno mi” odpowiedziano radą „ubierz się cieplej”. Zawór podkręcony przez innego domownika wracał na 2,5 średnio po 12 minutach.",
    findings: [
      { value: "61%", label: "zgłoszeń „zimno mi” kończy się radą „ubierz się cieplej”" },
      { value: "2,5", label: "najczęstsza nastawa zaworu grzejnikowego w badanych domach" },
      { value: "12 min", label: "mija średnio, zanim podkręcony zawór wróci na 2,5" },
    ],
    chart: {
      title: "Odpowiedź na zgłoszenie „zimno mi”",
      unit: "%",
      bars: [
        { label: "„Ubierz się cieplej”", value: 61 },
        { label: "„Przecież grzeje”", value: 18 },
        { label: "„Rusz się, to się rozgrzejesz”", value: 11 },
        { label: "Wskazanie termometru na ścianie", value: 7 },
        { label: "Podkręcenie zaworu", value: 3 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Formalnie sezon grzewczy zaczyna się wtedy, gdy spółdzielnia uruchomi ogrzewanie albo w piwnicy ruszy piec. W praktyce zaczyna się dopiero wtedy, gdy pozwoli na to osoba, która w domu odpowiada za zawory. Instytut postanowił ustalić, kim jest ta osoba i na jakich zasadach rozdziela ciepło.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "Obserwacje prowadzono przez cały sezon grzewczy 2025/2026 w 1 040 gospodarstwach domowych, w blokach i w domach jednorodzinnych. Na 5 824 grzejnikach rejestrowano każdą zmianę nastawy zaworu, a w pokojach dziennych i sypialniach mierzono temperaturę. Domownicy notowali w dziennikach wszystkie zgłoszenia „zimno mi” i odpowiedzi, które na nie padły. Zgłoszeń było 2 316.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "W 83% domów zawory obsługiwała wyłącznie jedna osoba, w dalszej części raportu nazywana gospodarzem. Najczęściej wybierano nastawę 2,5 (44% grzejników). Jeśli inny domownik podkręcił zawór, wracał on na 2,5 średnio po 12 minutach. Średnia temperatura w pokojach dziennych wyniosła 19,2°C, a gospodarze, zapytani o nią, podawali 22°C.",
          "Na zgłoszenie „zimno mi” najczęściej odpowiadano radą „ubierz się cieplej” (61%), a w 18% przypadków słowami „przecież grzeje”, po uprzednim dotknięciu grzejnika wierzchem dłoni. Zawór podkręcano tylko wtedy, gdy zimno było wnukom, czyli w odpowiedzi na 3% zgłoszeń. Rada była przy tym wykonalna: na jednego domownika przypadało średnio 4,3 swetra.",
          "W 57% sypialni okno było przez całą noc otwarte na mikrowentylację, a zawór grzejnika pod nim ustawiony na 2,5. W 81 z 94 domów z inteligentnymi głowicami termostatycznymi nastawę zmieniano wyłącznie ręcznie. Aplikację, zainstalowaną przez wnuka, otwierano tylko po to, żeby sprawdzić, czy nikt niczego nie przestawiał.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Ogrzewanie w polskim domu podlega nie tyle prawom fizyki, ile zasadom. Nastawa 2,5 nie jest kompromisem między ciepłem a rachunkiem, tylko sygnałem, że ktoś panuje nad sytuacją. Sweter pełni w tym systemie funkcję grzejnika uzupełniającego, który ma tę zaletę, że nie wisi na nim podzielnik. Okno otwarte na mikrowentylację nie jest zaś w rozumieniu gospodarzy oknem otwartym, więc nie narusza zasady „nie będziemy ogrzewać podwórka”.",
        ],
      },
    ],
    conclusions: [
      "Zgłoszenie „zimno mi” rozpatruje się w polskim domu odzieżowo, a nie grzewczo.",
      "Nastawa 2,5 nie jest ustawieniem, tylko stanowiskiem.",
      "Okno otwarte na mikrowentylację nie jest oknem otwartym.",
      "Prawo do podkręcenia zaworu przysługuje wyłącznie wnukom.",
    ],
    methodology:
      "Ciągły pomiar temperatury i nastaw zaworów, uzupełniony dziennikami domowników. Badacze odwiedzali domy co dwa tygodnie. Gdy mówili, że jest im zimno, otrzymywali radę zgodną z wynikami badania.",
    species: ["oszczednosciowy", "smart"],
  },
  {
    slug: "kartka-za-wycieraczka",
    number: "IBD/2026/07",
    date: "2026-09-22",
    category: "Analiza korpusowa",
    title: "Kartka za wycieraczką. Analiza korpusowa korespondencji parkingowej",
    lede: "Instytut przeanalizował 1 274 kartki zostawione za wycieraczkami. W 97% z nich pada słowo „uprzejmie”, a w 64% zapowiedź powiadomienia „odpowiednich służb”.",
    sample: "1 274 kartki z 38 miast, zebrane w latach 2019–2026",
    abstract:
      "Instytut zgromadził pierwszy w Polsce korpus kartek zostawianych za wycieraczkami samochodów: 1 274 egzemplarze z 38 miast. Wielkimi literami napisano 94% z nich, a przeciętna kartka liczyła 27 słów. Słowo „uprzejmie” wystąpiło w 97% kartek, a w 64% autor zapowiadał powiadomienie „odpowiednich służb”. Żadna kartka nie wskazywała, o które służby chodzi.",
    findings: [
      { value: "97%", label: "kartek zawiera słowo „uprzejmie”" },
      { value: "64%", label: "kartek zapowiada powiadomienie „odpowiednich służb”" },
      { value: "27", label: "słów liczy przeciętna kartka" },
    ],
    chart: {
      title: "Materiał, na którym napisano kartkę",
      unit: "%",
      bars: [
        { label: "Odwrót paragonu", value: 34 },
        { label: "Kartka z zeszytu w kratkę", value: 25 },
        { label: "Koperta po rachunku", value: 18 },
        { label: "Tektura z opakowania", value: 14 },
        { label: "Margines gazetki promocyjnej", value: 9 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Kartka za wycieraczką jest gatunkiem wypowiedzi równie wyraźnie ukształtowanym jak podanie czy list oficjalny, choć w przeciwieństwie do nich nie uczy się jej w szkole. Mimo to wszyscy jej autorzy stosują te same reguły. Instytut postanowił je opisać.",
        ],
      },
      {
        heading: "Materiał i metody",
        paragraphs: [
          "Korpus obejmuje 1 274 kartki zebrane w latach 2019–2026 w 38 miastach. Przekazali je Instytutowi adresaci wraz z opisem okoliczności: gdzie i na jak długo zaparkowali. Każdą kartkę przepisano z zachowaniem pisowni, podkreśleń i liczby wykrzykników, a następnie oznaczono pod względem nośnika, długości, treści i podpisu. Kartki zamoczone przez deszcz odczytywano w świetle bocznym.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "Wielkimi literami napisano 94% kartek. Najczęstszym nośnikiem był odwrót paragonu (34%). Z drugiej strony paragonów wynika, że autorzy kupowali głównie chleb, masło i płyn do spryskiwaczy. Przeciętna kartka liczyła 27 słów, najdłuższa 318: zajmowała obie strony koperty, a przejście na drugą stronę autor oznaczył dopiskiem „verte”.",
          "Słowo „uprzejmie” wystąpiło w 97% kartek. W pozostałych 3% zostało napisane i przekreślone. W 64% kartek autor zapowiadał powiadomienie „odpowiednich służb”, średnio 9 słów po „uprzejmie”. Żadna kartka nie wskazywała, o które służby chodzi.",
          "Podpisem „Życzliwy” opatrzono 14% kartek, a 36% nie podpisano wcale. Nie przeszkodziło to adresatom ustalić autora, zwykle jeszcze tego samego dnia. W 52 przypadkach adresat odpowiedział własną kartką. Korespondencja trwała wtedy średnio 7 miesięcy i kończyła się zwykle przeprowadzką jednej ze stron.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Kartka za wycieraczką łączy dwa rejestry: urzędową uprzejmość i groźbę. Słowo „uprzejmie” nie łagodzi groźby, tylko nadaje jej formę pisma urzędowego. Najstaranniej napisane kartki pojawiały się za wycieraczką średnio 6 minut po zaparkowaniu, co wskazuje na autora, który obserwuje parking z okna, z łokciami na poduszce, i ma czas na kaligrafię.",
        ],
      },
    ],
    conclusions: [
      "„Uprzejmie” jest w korespondencji parkingowej zapowiedzią groźby.",
      "„Odpowiednie służby” pozostają niezidentyfikowane.",
      "Na kartkę za wycieraczką nie należy odpowiadać kartką.",
    ],
    methodology:
      "Analiza korpusowa z elementami grafologii. W trakcie badania zespół znalazł 14 kartek za wycieraczkami własnych samochodów. Nie włączono ich do korpusu ze względu na konflikt interesów.",
    species: ["parking", "parapetowy"],
  },
  {
    slug: "ja-tylko-zapytac",
    number: "IBD/2026/06",
    date: "2026-09-10",
    category: "Eksperyment terenowy",
    title: "„Ja tylko zapytać”. Ile trwa pytanie zadane z pominięciem kolejki",
    lede: "„Ja tylko zapytać” trwa średnio 4 minuty i obejmuje 3,4 pytania dodatkowego. W 71% przypadków pytający załatwia przy okazji całą sprawę.",
    sample: "572 zdarzenia przy 120 kasach i okienkach, czerwiec–sierpień 2026",
    abstract:
      "Instytut zarejestrował 572 zdarzenia „ja tylko zapytać”, czyli przypadki ominięcia kolejki do kasy lub okienka pod pretekstem jednego pytania. Zdarzenie, które według zapowiedzi miało zająć „dosłownie sekundkę”, trwało średnio 4 minuty i obejmowało 3,4 pytania dodatkowego. W 71% przypadków pytający załatwiał przy okazji całą sprawę. Tabliczka „Informacji udzielamy wyłącznie w kolejce” zwiększyła liczbę takich zdarzeń o 8%.",
    findings: [
      { value: "4 min", label: "trwa średnio „ja tylko zapytać”" },
      { value: "3,4", label: "pytania dodatkowego pada średnio po pytaniu, które miało być jedyne" },
      { value: "71%", label: "pytających załatwia przy okazji całą sprawę" },
    ],
    chart: {
      title: "Reakcja kolejki na „ja tylko zapytać”",
      unit: "%",
      bars: [
        { label: "Milczenie i westchnienie", value: 41 },
        { label: "Komentarz do osoby obok", value: 24 },
        { label: "„Wszyscy tu tylko zapytać”", value: 17 },
        { label: "Spojrzenie na zegarek", value: 12 },
        { label: "Podejście z własnym pytaniem", value: 6 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Polska kolejka ma jedną zasadę: kto przyszedł później, stoi dalej. Od tej zasady istnieje wyjątek, nigdzie niezapisany, ale powszechnie stosowany. Zapowiadają go słowa „przepraszam, ja tylko zapytać”. Instytut postanowił sprawdzić, ile trwa pytanie, które nie wymaga stania w kolejce.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "Od czerwca do sierpnia badacze stali w kolejkach do 120 kas i okienek: w sklepach, na poczcie, w urzędach i na dworcach. Rejestrowali każde zdarzenie „ja tylko zapytać”: czas trwania, liczbę pytań i reakcję kolejki. Przy połowie stanowisk umieszczono tabliczkę „Informacji udzielamy wyłącznie w kolejce”. Łącznie zarejestrowano 572 zdarzenia.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "Pytający zapowiadali zwykle, że zajmie to „dosłownie sekundkę”. Średni czas zdarzenia wyniósł 4 minuty, a najdłuższe trwało 26 minut i zakończyło się nadaniem trzech paczek. Po pierwszym pytaniu padało średnio 3,4 pytania dodatkowego, przy czym niemal każde zaczynało się od słów „a jeszcze”. W 71% przypadków pytanie przechodziło płynnie w załatwienie całej sprawy, z płatnością włącznie.",
          "Pytający stawali zwykle bokiem do kolejki, z łokciem na ladzie. Przy kasach sklepowych najczęściej pytali, dlaczego produkt z gazetki promocyjnej kosztuje na półce inaczej. Gazetkę mieli przy sobie. Kolejka reagowała najczęściej milczeniem i westchnieniem (41%). Otwarty sprzeciw, „Wszyscy tu tylko zapytać”, odnotowano w 17% przypadków, a w 6% ktoś z kolejki wykorzystał okazję i podszedł z własnym pytaniem.",
          "Tabliczka „Informacji udzielamy wyłącznie w kolejce” nie zmniejszyła liczby zdarzeń. Zwiększyła ją o 8% (297 wobec 275), ponieważ część pytających podchodziła tylko po to, żeby zapytać, czy tabliczka dotyczy także ich.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "„Ja tylko zapytać” nie jest pytaniem, tylko trybem obsługi. Słowo „tylko” działa w nim jak przepustka: zapowiada sprawę tak drobną, że stanie w kolejce byłoby wobec niej nieproporcjonalne. Kolejka przyjmuje tę zapowiedź, bo sprzeciw wobec jednego pytania wydaje się małostkowy. Gdy padają pytania dodatkowe, na sprzeciw jest już za późno.",
        ],
      },
    ],
    conclusions: [
      "„Tylko” trwa średnio 4 minuty.",
      "Pytanie, które miało być jedyne, jest średnio pierwszym z 4,4.",
      "Tabliczka „Informacji udzielamy wyłącznie w kolejce” zwiększa liczbę pytań zadawanych poza kolejką.",
    ],
    methodology:
      "Eksperyment terenowy z grupą kontrolną: stanowiska z tabliczką i bez niej. Czas mierzono od słów „przepraszam, ja tylko…” do odejścia od kasy lub okienka. Słowa „dziękuję” nie uznawano za koniec pomiaru, ponieważ zwykle padało po nim jeszcze jedno pytanie.",
    species: ["kolejkowy", "oszczednosciowy"],
  },
  {
    slug: "pilot-od-telewizora",
    number: "IBD/2026/05",
    date: "2026-09-03",
    category: "Raport specjalny",
    title: "Pilot od telewizora jako insygnium władzy w polskim domu",
    lede: "W 87% domów pilot od telewizora pozostaje w rękach najstarszego mężczyzny. W pozostałych 13% zaginął w fotelu.",
    sample: "960 gospodarstw domowych, obserwacje w godzinach 19:00–23:00",
    abstract:
      "Instytut zbadał rozkład władzy nad pilotem od telewizora w 960 gospodarstwach domowych. W 87% z nich pilot przez cały wieczór pozostawał w rękach najstarszego mężczyzny. W 9% domów pilot był przechowywany w foliowym woreczku, który miał go chronić przed zużyciem. Zjawisko wykazuje cechy dziedziczne.",
    findings: [
      { value: "87%", label: "domów, w których pilot należy do najstarszego mężczyzny" },
      { value: "9%", label: "pilotów przechowywanych w foliowym woreczku" },
      { value: "64%", label: "domów ogląda jeden kanał, „żeby nie rozstroić”" },
    ],
    chart: {
      title: "Miejsce przebywania pilota w trakcie wieczoru",
      unit: "%",
      bars: [
        { label: "W ręce", value: 52 },
        { label: "Na podłokietniku fotela", value: 21 },
        { label: "Zaginiony w fotelu", value: 13 },
        { label: "W foliowym woreczku", value: 9 },
        { label: "Gdzie indziej", value: 5 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Pilot od telewizora jest najmniejszym, ale najważniejszym urządzeniem w polskim domu. Kto ma pilota, ten decyduje o wieczorze. Instytut postanowił sprawdzić, kto ma pilota.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "Obserwacje prowadzono w godzinach 19:00–23:00 w 960 gospodarstwach domowych. Rejestrowano, kto trzyma pilota, jak długo i czy oddaje go na prośbę innych domowników. Ani razu nie odnotowano oddania pilota na prośbę.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "W 87% domów pilot przez cały wieczór pozostawał w rękach najstarszego mężczyzny. W 13% domów pilot zaginął w fotelu, a jego poszukiwania trwały średnio 11 minut i obejmowały co najmniej dwukrotne podniesienie wszystkich poduszek.",
          "W 9% domów pilot był przechowywany w foliowym woreczku, który miał chronić go przed kurzem i zużyciem. Woreczki wymieniano średnio co cztery lata, piloty co dwanaście.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Pilot pełni funkcję symboliczną, porównywalną z berłem. Przekazuje się go zwykle razem z fotelem, co w badanych rodzinach zdarzało się rzadziej niż wymiana telewizora.",
        ],
      },
    ],
    conclusions: [
      "Pilot od telewizora jest insygnium władzy.",
      "Władzę tę przekazuje się z ojca na syna, razem z fotelem.",
      "Foliowy woreczek przedłuża życie pilota średnio o osiem lat.",
    ],
    methodology:
      "Obserwacja uczestnicząca. Badacze byli zapraszani na wieczór w roli gości. Żaden z nich nie dostał pilota.",
    species: ["smart", "oszczednosciowy"],
  },
  {
    slug: "sandal-a-skarpeta",
    number: "IBD/2026/04",
    date: "2026-07-21",
    category: "Przegląd systematyczny",
    title: "Sandał a skarpeta. Przegląd systematyczny 412 obserwacji terenowych",
    lede: "Instytut przeanalizował 412 udokumentowanych przypadków noszenia skarpet do sandałów. Wniosek główny: skarpeta jest biała. Wniosek poboczny: zawsze.",
    sample: "412 obserwacji z 9 kurortów nadmorskich i 3 pasm górskich",
    abstract:
      "Połączenie sandała ze skarpetą jest jednym z najlepiej rozpoznawalnych objawów dziaderstwa, a mimo to dotąd brakowało jego systematycznej analizy. Przegląd objął 412 obserwacji terenowych z sezonu letniego 2026. W 87% przypadków skarpeta była biała, a w 100% przypadków osoba, która ją nosiła, była przekonana o słuszności swojego wyboru.",
    findings: [
      { value: "87%", label: "skarpet noszonych do sandałów jest białych" },
      { value: "64%", label: "to skarpety frotte, także w upale powyżej 30°C" },
      { value: "100%", label: "obserwowanych jest przekonanych o słuszności wyboru" },
    ],
    chart: {
      title: "Kolor skarpety noszonej do sandałów",
      unit: "%",
      bars: [
        { label: "Biała", value: 87 },
        { label: "Szara", value: 7 },
        { label: "Czarna", value: 4 },
        { label: "W paski", value: 2 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Skarpeta noszona do sandała budzi w Polsce emocje porównywalne ze sporem o wyższość świąt. Instytut postanowił oddzielić emocje od danych i przyjrzeć się zjawisku tam, gdzie występuje najliczniej: na deptakach nadmorskich i szlakach górskich.",
        ],
      },
      {
        heading: "Materiał i metody",
        paragraphs: [
          "Obserwacje prowadzono od czerwca do sierpnia, w godzinach 7:00–19:00. Rejestrowano kolor i grubość skarpety, model sandała oraz temperaturę powietrza. Obserwatorów przeszkolono, by nie okazywali emocji. Dwóch nie wytrzymało i zostało wyłączonych z badania.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "Biała skarpeta dominuje bezwzględnie: 87% obserwacji. W 64% przypadków była to skarpeta frotte, niezależnie od temperatury. Najwyższa odnotowana temperatura, w jakiej noszono skarpetę frotte, wyniosła 34°C (Mielno, lipiec).",
          "Zapytani o powód, obserwowani najczęściej odpowiadali: „Bo tak jest wygodniej” (52%), „Żeby nie obetrzeć” (31%) i „A co panu do tego?” (17%).",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Skarpeta pełni funkcję nie tyle odzieżową, co tożsamościową. Jej biel sygnalizuje czystość intencji, a frotte gotowość na każde warunki. Zjawisko jest w pełni odporne na krytykę, modę i dane meteorologiczne.",
        ],
      },
    ],
    conclusions: [
      "Skarpeta jest biała.",
      "Zawsze.",
      "Zjawisko nie wymaga interwencji, bo żadna interwencja nie przyniesie skutku.",
    ],
    methodology:
      "Przegląd systematyczny obserwacji terenowych. Obserwacja nieuczestnicząca, prowadzona z ławki. Każdą obserwację potwierdzało dwóch niezależnych badaczy, z których jeden udawał, że czyta gazetę.",
    species: ["wakacje", "gorski"],
  },
  {
    slug: "system-start-stop",
    number: "IBD/2026/03",
    date: "2026-05-12",
    category: "Badanie eksperymentalne",
    title: "Wpływ systemu start-stop na poziom irytacji kierowców po pięćdziesiątce",
    shortTitle: "System start-stop a irytacja kierowców po pięćdziesiątce",
    lede: "96% badanych kierowców wyłącza system start-stop natychmiast po uruchomieniu silnika. Średni czas reakcji: 1,8 sekundy.",
    sample: "240 kierowców w wieku 50+, trasa z trzema skrzyżowaniami",
    abstract:
      "System start-stop, który wyłącza silnik podczas postoju, jest standardowym wyposażeniem nowych samochodów. Instytut zbadał reakcje 240 kierowców po pięćdziesiątce na samoczynne wyłączenie silnika na czerwonym świetle. Wyniki wskazują, że system jest wyłączany szybciej, niż zdąży zadziałać.",
    findings: [
      { value: "96%", label: "badanych wyłącza system przy każdym uruchomieniu silnika" },
      { value: "1,8 s", label: "średni czas od uruchomienia silnika do wyłączenia systemu" },
      { value: "78%", label: "jest przekonanych, że system „psuje rozrusznik”" },
    ],
    chart: {
      title: "Reakcja na samoczynne wyłączenie silnika na czerwonym świetle",
      unit: "%",
      bars: [
        { label: "Trwałe wyłączenie systemu", value: 54 },
        { label: "Uwaga o rozruszniku", value: 24 },
        { label: "Pukanie w deskę rozdzielczą", value: 13 },
        { label: "Spokój", value: 9 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "System start-stop miał oszczędzać paliwo i ograniczać emisję spalin. Nie przewidziano jednak, że jego największym przeciwnikiem okaże się kierowca, który pamięta czasy, gdy silnik wyłączało się kluczykiem i tylko wtedy, kiedy się chciało.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "240 kierowców przejechało wyznaczoną trasę z trzema skrzyżowaniami. W samochodach testowych system start-stop był domyślnie włączony. Rejestrowano czas do jego wyłączenia oraz wypowiedzi kierowców, które zespół spisywał z nagrań, uprzednio je cenzurując.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "96% kierowców wyłączyło system, zanim samochód ruszył z miejsca. Średni czas reakcji wyniósł 1,8 sekundy, a najkrótszy 0,4 sekundy: kierowca wyłączył system, zanim silnik zdążył zaskoczyć.",
          "Wszyscy kierowcy z pozostałych 4% przyznali po badaniu, że „nie zauważyli przycisku”. Po jego wskazaniu natychmiast wyłączyli system.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "System start-stop budzi w badanej grupie sprzeciw zasadniczy, niezależny od wiedzy technicznej. Badani nie potrafili wyjaśnić, w jaki sposób system psuje rozrusznik, ale 78% było tego pewnych.",
        ],
      },
    ],
    conclusions: [
      "System start-stop jest wyłączany szybciej, niż zdąży zadziałać.",
      "Przekonanie o szkodliwości systemu nie wymaga wiedzy o jego działaniu.",
      "Producenci powinni rozważyć przycisk, który wyłącza system na zawsze.",
    ],
    methodology:
      "Badanie eksperymentalne w warunkach ruchu miejskiego. Grupa kontrolna, kierowcy poniżej 30. roku życia, nie zauważyła istnienia systemu.",
    species: ["moto"],
  },
  {
    slug: "zaraz-to-naprawie",
    number: "IBD/2026/02",
    date: "2026-04-08",
    category: "Badanie podłużne",
    title: "Od „zaraz to naprawię” do wezwania fachowca. Badanie podłużne",
    lede: "Od zapowiedzi „zaraz to naprawię” do wezwania fachowca mija średnio 3 lata i 2 miesiące. W 41% przypadków fachowcem okazuje się szwagier.",
    sample: "318 usterek w 204 gospodarstwach domowych, obserwowanych od 2019 roku",
    abstract:
      "Instytut przez siedem lat śledził losy 318 domowych usterek zgłoszonych słowami „zaraz to naprawię”. Średni czas do wezwania fachowca wyniósł 3 lata i 2 miesiące. Ani jedna usterka nie została naprawiona w ciągu zapowiedzianego „zaraz”. W 41% przypadków fachowcem okazał się szwagier.",
    findings: [
      { value: "38 mies.", label: "mija średnio od „zaraz to naprawię” do wezwania fachowca" },
      { value: "41%", label: "napraw wykonuje ostatecznie szwagier" },
      { value: "0", label: "usterek naprawionych „zaraz”" },
    ],
    chart: {
      title: "Czas od zapowiedzi naprawy do wezwania fachowca",
      unit: "mies.",
      bars: [
        { label: "Kapiący kran", value: 9 },
        { label: "Drzwiczki od szafki", value: 21 },
        { label: "Gniazdko w kuchni", value: 33 },
        { label: "Fuga w łazience", value: 47 },
        { label: "Roleta w sypialni", value: 80 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Zdanie „zaraz to naprawię” jest jedną z najczęściej składanych w Polsce obietnic. Instytut postanowił sprawdzić, co dokładnie oznacza w nim słowo „zaraz”.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "Od 2019 roku zespół monitorował 318 usterek w 204 gospodarstwach domowych. Rejestrowano moment pierwszej zapowiedzi naprawy, kolejne zapowiedzi oraz moment, w którym do domu wchodził fachowiec. Badanie zakończono w 2026 roku, choć 12 usterek wciąż czeka na swoje „zaraz”.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "Średni czas od pierwszego „zaraz to naprawię” do wezwania fachowca wyniósł 38 miesięcy. Najszybciej naprawiany był kapiący kran (9 miesięcy), najwolniej roleta w sypialni (80 miesięcy). Przed wezwaniem fachowca każdą usterkę zapowiadano średnio 46 razy.",
          "W 41% przypadków fachowcem był szwagier, w 33% fachowiec polecony przez szwagra, a w pozostałych 26% fachowiec, o którym szwagier powiedział, że „przepłacili”.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Słowo „zaraz” należy rozumieć nie jako określenie czasu, lecz jako deklarację kompetencji. Osoba, która je wypowiada, nie obiecuje naprawy, tylko informuje, że mogłaby jej dokonać. To rozróżnienie wyjaśnia większość wyników badania.",
        ],
      },
    ],
    conclusions: [
      "„Zaraz” trwa średnio 3 lata i 2 miesiące.",
      "Zapowiedź naprawy nie jest naprawą.",
      "Szwagier jest kluczowym elementem polskiego rynku usług remontowych.",
    ],
    methodology:
      "Badanie podłużne, obserwacja ciągła. Usterkę kwalifikowano do badania, jeśli została zgłoszona słowami „zaraz to naprawię” w obecności co najmniej jednego świadka.",
    species: ["budowa", "smart"],
  },
  {
    slug: "kabel-nieznanego-przeznaczenia",
    number: "IBD/2026/01",
    date: "2026-02-16",
    category: "Badanie terenowe",
    title: "Kabel nieznanego przeznaczenia. Inwentaryzacja szuflad w 1 200 gospodarstwach domowych",
    shortTitle: "Kabel nieznanego przeznaczenia: inwentaryzacja szuflad",
    lede: "73% badanych ojców ma co najmniej jeden kabel, którego przeznaczenia nie zna. Instytut przeprowadził pierwszą w Polsce inwentaryzację szuflad z kablami.",
    sample: "1 200 gospodarstw domowych, 2 847 szuflad, 5 640 kabli",
    abstract:
      "Szuflada z kablami występuje w niemal każdym polskim domu, ale dotąd nie była przedmiotem systematycznych badań. Zespół Pracowni Terenowej IBD zinwentaryzował zawartość 2 847 szuflad w 1 200 gospodarstwach domowych. W 61% przypadków przeznaczenia kabla nie udało się ustalić. Właściciele szuflad konsekwentnie odmawiali wyrzucenia któregokolwiek egzemplarza.",
    findings: [
      { value: "73%", label: "ojców ma kabel, którego przeznaczenia nie zna" },
      { value: "4,7", label: "kabla o nieznanym przeznaczeniu przypada na jedną szufladę" },
      { value: "0", label: "kabli wyrzuconych w trakcie badania" },
    ],
    chart: {
      title: "Przeznaczenie kabli w badanych szufladach",
      unit: "%",
      bars: [
        { label: "Nieznane", value: 61 },
        { label: "Do telefonu, którego już nie ma", value: 17 },
        { label: "Do aparatu z 2006 roku", value: 9 },
        { label: "Przedłużacz do przedłużacza", value: 7 },
        { label: "Ustalone poprawnie", value: 6 },
      ],
    },
    sections: [
      {
        heading: "Wprowadzenie",
        paragraphs: [
          "Szuflada z kablami jest jednym z najbardziej rozpowszechnionych, a zarazem najsłabiej zbadanych elementów polskiego gospodarstwa domowego. Występuje zwykle w kuchni, pod telewizorem albo w przedpokoju, a jej zawartość narasta warstwami, w tempie wyznaczanym przez kolejne generacje telefonów.",
        ],
      },
      {
        heading: "Przebieg badania",
        paragraphs: [
          "Badacze odwiedzili 1 200 gospodarstw domowych we wszystkich szesnastu województwach. Każdy kabel został wyjęty, opisany i sfotografowany, a następnie przedstawiony właścicielowi z prośbą o wskazanie przeznaczenia. Wyjmowanie kabli trwało średnio 23 minuty na szufladę, ponieważ były splątane w sposób, który zespół określił w protokole jako „celowy”.",
        ],
      },
      {
        heading: "Wyniki",
        paragraphs: [
          "Przeznaczenia 61% kabli nie ustalili ani właściciele, ani badacze. Kolejne 17% to ładowarki do telefonów, których w gospodarstwie już nie ma. 19% respondentów twierdziło, że wie, do czego służy dany kabel, „ale nie będzie teraz szukać”.",
          "Na pytanie, czy można wyrzucić którykolwiek z kabli, wszyscy respondenci odpowiedzieli „To się jeszcze przyda”. Odpowiedź padała średnio po 1,2 sekundy, co wskazuje na odruch, a nie na namysł.",
        ],
      },
      {
        heading: "Dyskusja",
        paragraphs: [
          "Wyniki potwierdzają hipotezę, że szuflada z kablami nie pełni funkcji użytkowej, tylko rezerwową. Jej zawartość jest zabezpieczeniem na wypadek scenariusza, którego żaden z badanych nie potrafił opisać, ale wszyscy uznali za prawdopodobny.",
        ],
      },
    ],
    conclusions: [
      "Szuflada z kablami jest zjawiskiem powszechnym i trwałym.",
      "Wiedza o przeznaczeniu kabli zanika szybciej niż same kable.",
      "Prawdopodobieństwo, że osoba po pięćdziesiątce wyrzuci kabel, jest statystycznie nieistotne.",
    ],
    methodology:
      "Badanie terenowe: wywiad bezpośredni połączony z inwentaryzacją. Dobór próby losowo-sąsiedzki. Margines błędu nieznany, podobnie jak przeznaczenie większości kabli.",
    species: ["dzialka", "smart", "budowa"],
  },
];

export const reportBySlug = (slug: string) => REPORTS.find((report) => report.slug === slug);

const dateFormat = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const formatReportDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));
