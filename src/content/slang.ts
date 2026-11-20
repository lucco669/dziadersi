import type { Locale } from "@/i18n/config";
import { overlayList, overlayProblems } from "@/i18n/overlay";
import { SLANG_TEXT } from "./sl/slang";
import { SLANG_SLUGS } from "./sl/slugs/slang";

/*
 * Słownik młodzieżowy dla dziadersów (/slownik-mlodziezowy): the Institute explains the youth's
 * words to a dziaders. The plain, correct meaning comes first, for readers who search for it; the
 * Institute's explanation comes second and keeps the deadpan voice. These words date fast: every
 * entry carries the day its meaning was last checked, and the whole list is reviewed every quarter.
 */

export type SlangEntry = {
  /** URL segment. Stable: never change it once published. */
  slug: string;
  /** The word as it is written most often. */
  word: string;
  /** Other spellings and forms, shown under the word and searched. */
  variants?: string[];
  grammar: string;
  /** What the word means, plainly and correctly. One to three sentences. */
  meaning: string;
  /** Where it comes from, with its plebiscite or dictionary record where there is one. */
  origin: string;
  /** How the young use it. */
  example: string;
  /** "Objaśnienie dla dziadersa": the Institute's version. */
  dziaders: string;
  /** "Jak zareagowałby dziaders": what a dziaders says on hearing it. */
  reaction: string;
  /** The matching Słownik Dziaderski entry (Polish slug). */
  phrase?: string;
  /** The day the meaning was last checked, "YYYY-MM-DD". */
  checked: string;
  /** Translator's notes (op. prev.), Slovenian edition only. */
  notes?: string[];
};

const CHECKED = "2026-11-20";

export const SLANG: SlangEntry[] = [
  {
    slug: "67",
    word: "67",
    variants: ["six seven", "6-7", "sześć siedem"],
    grammar: "wykrzyknik, wymawiany po angielsku",
    meaning:
      "Okrzyk bez stałego znaczenia, wypowiadany po angielsku („six seven”) z gestem dłoni poruszanych na przemian w górę i w dół, jak przy ważeniu. Pada, gdy w rozmowie pojawi się liczba 67, a często bez żadnego powodu. Jeśli coś znaczy, to „tak sobie”, „ni to, ni sio”.",
    origin:
      "Z piosenki „Doot Doot (6 7)” amerykańskiego rapera Skrilli (2024), rozpowszechnionej w nagraniach z koszykarzem LaMelo Ballem, który ma 6 stóp i 7 cali wzrostu. Dictionary.com uznało „6-7” za słowo roku 2025; było też w finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "— Ile stron mamy przeczytać? — Sześćdziesiąt siedem. — Six seven!",
    dziaders:
      "Odpowiednik „trzy po trzy”, wypowiedziany z ruchem rąk jak przy ocenie arbuza na targu. Sensu nie należy dociekać. Instytut próbował przez dwa kwartały; sens się nie ujawnił.",
    reaction: "Sześćdziesiąt siedem to rocznik mojego Fiata. Też nikt nie wiedział, dlaczego tak jeździ.",
    phrase: "kto-pamieta",
    checked: CHECKED,
  },
  {
    slug: "aura",
    word: "aura",
    variants: ["aura farming", "+1000 aury"],
    grammar: "rzeczownik",
    meaning:
      "Niewidzialna punktacja czyjejś charyzmy i luzu. Kto zachowa się z klasą, zyskuje aurę („+1000 aury”), kto się skompromituje, traci ją („−1000 aury”). „Aura farming” to celowe pozowanie na kogoś pełnego aury.",
    origin: "Z angielskiego slangu internetowego, od około 2024 roku. W finale plebiscytu Młodzieżowe Słowo Roku 2024 i 2026.",
    example: "Potknął się na schodach przed całą klasą. Minus tysiąc aury.",
    dziaders:
      "Dawniej „szacunek na dzielnicy”. Dziaders traci aurę, kiedy publicznie nie umie zapłacić telefonem, i odzyskuje ją, kiedy wyjmuje banknot i mówi: „Proszę bez reszty”.",
    reaction: "U mnie aura jest jedna: ciśnienie. Czuję w kolanie, że będzie padać.",
    phrase: "bedzie-padac-czuje-w-kolanie",
    checked: CHECKED,
  },
  {
    slug: "cringe",
    word: "cringe",
    grammar: "rzeczownik i przymiotnik, nieodmienny",
    meaning:
      "Coś żenującego, krępującego, co budzi zażenowanie u patrzącego. „Ale cringe” znaczy mniej więcej „ale żenada”. Od angielskiego „to cringe”, czyli skulić się, wzdrygnąć.",
    origin: "Z angielskiego, w polskim internecie od drugiej połowy lat 2010. W finale plebiscytu Młodzieżowe Słowo Roku 2022.",
    example: "Tata tańczył na weselu do piosenki z TikToka. Cringe.",
    dziaders:
      "Uczucie znane z oglądania własnych zdjęć z wesela z 1994 roku. Instytut ustalił, że cringe najczęściej wywołuje dziaders, który próbuje używać słów z tego słownika.",
    reaction: "Cringe? Ja się niczego nie wstydzę. Mam to po ojcu.",
    checked: CHECKED,
  },
  {
    slug: "delulu",
    word: "delulu",
    variants: ["delulu is the solulu"],
    grammar: "przymiotnik, nieodmienny",
    meaning:
      "Zdrobnienie od angielskiego „delusional”: oderwany od rzeczywistości, żyjący złudzeniami, zwykle niegroźnymi, na przykład że sławny piosenkarz odpisze na wiadomość. Często z przymrużeniem oka: „delulu is the solulu”, czyli złudzenie jako sposób na życie.",
    origin: "Z fandomów K-popu i TikToka; w polskim internecie od około 2023 roku.",
    example: "Myśli, że zdąży na pociąg, wychodząc z domu trzy minuty przed odjazdem. Delulu.",
    dziaders:
      "Stan człowieka przekonanego, że naprawi pralkę bez instrukcji, w godzinę, i że nie zostanie mu żadna śrubka. Instytut ma w kartotece liczne przypadki.",
    reaction: "Delulu to ty jesteś, jak myślisz, że za takie pieniądze kupisz mieszkanie.",
    phrase: "ja-nie-potrzebuje-instrukcji",
    checked: CHECKED,
  },
  {
    slug: "fr",
    word: "fr",
    variants: ["fr fr", "for real"],
    grammar: "skrót",
    meaning:
      "Skrót od angielskiego „for real”: serio, naprawdę. Potwierdza albo wzmacnia wypowiedź („fr, nie żartuję”) albo pyta, czy ktoś mówi poważnie („fr?”). Dla większego nacisku: „fr fr”.",
    origin: "Z afroamerykańskiego angielskiego, przez media społecznościowe. W finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "To był najtrudniejszy sprawdzian w moim życiu, fr.",
    dziaders:
      "Odpowiednik „słowo daję” i „jak babcię kocham”. W dziaderskim użyciu poprzedza opowieść o zimie, przy której obecne zimy są wiosną.",
    reaction: "Słowo daję: takiej zimy jak w siedemdziesiątym dziewiątym to już nie będzie.",
    phrase: "kiedys-to-byly-zimy",
    checked: CHECKED,
  },
  {
    slug: "goat",
    word: "GOAT",
    variants: ["goat"],
    grammar: "rzeczownik, skrót",
    meaning:
      "Skrót od angielskiego „greatest of all time”: najlepszy w historii. Mówi się o sportowcu albo artyście, a żartem o koledze, który przyniósł pizzę. Czasem z emoji kozy, bo „goat” to po angielsku koza.",
    origin: "Z amerykańskiego slangu sportowego przełomu lat 90. i 2000. W finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "Babcia zrobiła pierogi na cały tydzień. GOAT.",
    dziaders:
      "Tytuł, który dziaders przyznaje wyłącznie zawodnikom sprzed 1982 roku. Kto grał później, „się nie umywa”.",
    reaction: "Najlepszy w historii był Deyna i nie ma o czym rozmawiać.",
    phrase: "kto-pamieta",
    checked: CHECKED,
  },
  {
    slug: "idk",
    word: "idk",
    variants: ["IDK"],
    grammar: "skrót",
    meaning:
      "Skrót od angielskiego „I don't know”: nie wiem. W wiadomościach to krótka odpowiedź, często w sensie „nie mam zdania” albo „nie chce mi się o tym myśleć”.",
    origin: "Z angielskiego slangu esemesowego i komunikatorów, w użyciu od lat 2000.",
    example: "— Co na obiad? — idk.",
    dziaders:
      "Zwrot nieznany w środowisku dziaderskim. Instytut nie odnotował przypadku, w którym dziaders czegoś nie wiedział. Odnotował przypadki, w których wiedział inaczej.",
    reaction: "Jak to nie wiesz? Mówili w telewizji.",
    phrase: "mowili-w-telewizji",
    checked: CHECKED,
  },
  {
    slug: "larp",
    word: "larp",
    variants: ["larpować", "larpuje"],
    grammar: "rzeczownik; czasownik: larpować",
    meaning:
      "Udawać kogoś, kim się nie jest; odgrywać rolę na pokaz. „On larpuje bogacza” znaczy, że tylko gra bogacza. Od LARP, skrótu „live action role-playing”: gier fabularnych na żywo, w kostiumach.",
    origin: "Z angielskiego slangu internetowego. W finale plebiscytu Młodzieżowe Słowo Roku 2026.",
    example: "Wrzuca zdjęcia z siłowni, ale tylko larpuje sportowca.",
    dziaders:
      "Przebranie się w kombinezon roboczy, żeby wymienić żarówkę. Instytut uznaje larp za podstawową technikę dziaderską, zwłaszcza w sklepie budowlanym.",
    reaction: "Ja niczego nie udaję. Papę na dachu kładłem, jak ty jeszcze w pieluchach chodziłeś.",
    phrase: "kto-panu-to-tak-zrobil",
    checked: CHECKED,
  },
  {
    slug: "lowkey",
    word: "lowkey",
    variants: ["low-key", "highkey"],
    grammar: "przysłówek",
    meaning:
      "„Trochę”, „po cichu”, „nie mówiąc tego głośno”. Łagodzi wyznanie: „lowkey mi się podoba” to „w sumie mi się podoba, ale nie robię z tego sprawy”. Przeciwieństwo: „highkey”, czyli otwarcie, bardzo.",
    origin: "Z angielskiego „low-key”: stonowany, dyskretny. W finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "Lowkey tęsknię za wakacjami nad morzem z rodzicami.",
    dziaders: "Stopień entuzjazmu, który dziaders okazuje wobec cudzych osiągnięć. „No, może być” to dziaderska pochwała lowkey.",
    reaction: "Ja nic po cichu nie robię. Jak mi się nie podoba, to mówię.",
    checked: CHECKED,
  },
  {
    slug: "pov",
    word: "POV",
    variants: ["pov"],
    grammar: "skrót",
    meaning:
      "Skrót od angielskiego „point of view”, czyli punkt widzenia. W podpisach nagrań na TikToku i Instagramie wprowadza scenkę, w którą widz ma się wczuć: „POV: tata pokazuje ci, jak się parkuje”.",
    origin: "Z języka filmowego (ujęcie z perspektywy bohatera); w mediach społecznościowych od końca lat 2010.",
    example: "POV: jesteś na rodzinnym obiedzie i ktoś pyta, ile zarabiasz.",
    dziaders: "Opowieść zaczynająca się od „Wyobraź sobie, że…”. Różnica: POV trwa piętnaście sekund.",
    reaction: "Jaki POV? Ja mam swój punkt widzenia i od trzydziestu lat się nie zmienił.",
    checked: CHECKED,
  },
  {
    slug: "rizz",
    word: "rizz",
    variants: ["zrizzować"],
    grammar: "rzeczownik",
    meaning:
      "Urok osobisty, umiejętność podrywania i zjednywania sobie ludzi. Skrót od angielskiego „charisma”. „Mieć rizz” to mieć gadane; „zrizzować kogoś” to kogoś oczarować.",
    origin: "Spopularyzowane przez amerykańskiego streamera Kaia Cenata. Słowo roku 2023 według Oxford University Press.",
    example: "Zagadał do nowej koleżanki i od razu dostał jej numer. Rizz.",
    dziaders:
      "To, co dziaders miał na zabawie w remizie w 1978 roku, według relacji samego dziadersa. Świadków nie zachowano.",
    reaction: "Rizz? Ja żonę poznałem na kursie prawa jazdy. Na lewoskręcie, bez żadnych skrótów.",
    checked: CHECKED,
  },
  {
    slug: "sigma",
    word: "sigma",
    variants: ["samiec sigma"],
    grammar: "rzeczownik i przymiotnik",
    meaning:
      "Ktoś pewny siebie, niezależny, chodzący własnymi drogami, kto nie potrzebuje aprobaty grupy. Często ironicznie: o kimś, kto tylko pozuje na samotnego wilka, albo po prostu o czymś dobrym („sigma pomysł”).",
    origin: "Z internetowej „hierarchii samców” (alfa, beta, sigma) i memów o „samcu sigma”. Młodzieżowe Słowo Roku 2024 w plebiscycie PWN.",
    example: "Siedzi sam na przerwie i je kanapkę. Sigma.",
    dziaders:
      "Samotny mężczyzna przy grillu, który nie oddaje szczypiec i nie prosi o radę. Dziaders był sigmą, zanim to było modne, tylko mówiło się na to „charakter”.",
    reaction: "Sigma to była litera na matematyce. Z matematyki miałem pięć.",
    phrase: "to-jest-moje-miejsce",
    checked: CHECKED,
  },
  {
    slug: "skibidi",
    word: "skibidi",
    variants: ["Skibidi Toilet"],
    grammar: "wykrzyknik i przymiotnik, nieodmienny",
    meaning:
      "Słowo bez stałego znaczenia, wtrącane dla absurdu albo wzmocnienia; może znaczyć „super”, „okropny” albo nic. Pochodzi z serii animacji „Skibidi Toilet” na YouTubie, w której śpiewające głowy wyłaniają się z sedesów. Używają go głównie dzieci.",
    origin: "Z serii „Skibidi Toilet” (od 2023 roku). W finale plebiscytu Młodzieżowe Słowo Roku 2024 i 2025.",
    example: "Skibidi sprawdzian z historii.",
    dziaders:
      "Najbliższe odpowiedniki to „tralala” i „bla, bla, bla”. Instytut odradza szukanie sensu i ostrzega, że obejrzenie serii źródłowej w całości nie pomaga.",
    reaction: "Za moich czasów była dobranocka. Też nikt nie wiedział, o co chodzi, ale o dziewiętnastej.",
    phrase: "za-moich-czasow",
    checked: CHECKED,
  },
  {
    slug: "slay",
    word: "slay",
    grammar: "czasownik i wykrzyknik",
    meaning:
      "Pochwała: świetnie wyglądać, świetnie coś zrobić, „dać czadu”. Mówi się o stroju, występie albo zdanym egzaminie. Z angielskiego „to slay”, dosłownie „zabić”, w sensie „rozłożyć wszystkich na łopatki”.",
    origin: "Z angielskiego slangu nowojorskiej sceny ballroom, rozpowszechnione przez TikToka. W finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "Nowa fryzura? Slay.",
    dziaders: "Komplement, odpowiednik „elegancko” wypowiadanego przy wyjściu od fryzjera. Ze słowem „zabić” ma wspólny tylko słownik.",
    reaction: "Slay to po angielsku sanie. Uczyłem się na kursie w zakładzie.",
    checked: CHECKED,
  },
  {
    slug: "sybau",
    word: "sybau",
    variants: ["SYBAU"],
    grammar: "skrót, wulgarny",
    meaning:
      "Skrót od angielskiego „shut your bitch ass up”, czyli wulgarnego „zamknij się”. Pisany zwykle małymi literami jako ostra odpowiedź na czyjąś wypowiedź. Między znajomymi bywa żartem, do obcego brzmi obraźliwie.",
    origin: "Z anglojęzycznego TikToka i serwisu X, rozpowszechniony w 2025 roku.",
    example: "— A wiesz, że kiedyś… — sybau.",
    dziaders:
      "To samo, co dawniej wyrażało się zamknięciem drzwi do pokoju. Instytut odnotowuje, że skrót jest krótszy od wykładu, który przerywa, średnio o czterdzieści minut.",
    reaction: "Co to za sybau? Mów po polsku, jak się do ojca zwracasz.",
    phrase: "ja-tylko-zapytac",
    checked: CHECKED,
  },
  {
    slug: "szponcic",
    word: "szponcić",
    variants: ["szpont", "szponcić/szpont"],
    grammar: "czasownik; rzeczownik: szpont",
    meaning:
      "Słowo o kilku znaczeniach, zależnie od sytuacji: robić coś ryzykownego, psotnego albo głupiego, ale też działać z energią, kombinować, flirtować. „Szpont” to wybryk, zamieszanie, czasem pomyłka. Może wyrażać dezaprobatę („ale szpont”) albo podziw.",
    origin: "Młodzieżowe Słowo Roku 2025 w plebiscycie PWN. Słowniki ogólne nie notują jeszcze tego znaczenia.",
    example: "Na wycieczce szponciliśmy do rana.",
    dziaders: "Dawne „wygłupy” i „dawanie czadu” w jednym słowie. Za szpont dziaders uznaje także każdą próbę rozpalenia grilla podpałką.",
    reaction: "Szpunt to się wbija w beczkę. Tego was w szkole nie uczą?",
    phrase: "nie-tak-sie-rozpala",
    checked: CHECKED,
  },
  {
    slug: "tbh",
    word: "tbh",
    variants: ["TBH"],
    grammar: "skrót",
    meaning:
      "Skrót od angielskiego „to be honest”: szczerze mówiąc. Stawiany na początku albo na końcu wiadomości, zwykle przed opinią, z którą ktoś może się nie zgodzić.",
    origin: "Z angielskiego slangu internetowego, w użyciu od lat 2000.",
    example: "Tbh ten film był za długi.",
    dziaders: "Skrócone „powiem ci szczerze”, po którym dziaders mówi to samo co przedtem, tylko głośniej.",
    reaction: "Powiem ci szczerze, i to bez żadnych skrótów.",
    phrase: "panie",
    checked: CHECKED,
  },
  {
    slug: "tuff",
    word: "tuff",
    grammar: "przymiotnik, nieodmienny",
    meaning:
      "Celowo zniekształcone angielskie „tough”: mocny, świetny, robiący wrażenie. Mówi się o butach, akcji w meczu, odpowiedzi przy tablicy. Rzadziej w pierwotnym sensie: trudny, przykry („tuff, przegraliśmy”).",
    origin: "Z angielskiego slangu internetowego. W finale plebiscytu Młodzieżowe Słowo Roku 2025 i 2026.",
    example: "Te buty są tuff.",
    dziaders: "Dawne „sztos”, a jeszcze wcześniej „bomba”. Odnosi się do rzeczy, które dziaders ocenia słowami „dobre, bo niemieckie”.",
    reaction: "Jakie tuff? Porządne. Mówi się: porządne.",
    phrase: "oryginal-niemiecki",
    checked: CHECKED,
  },
  {
    slug: "twin",
    word: "twin",
    grammar: "rzeczownik, zwykle w zwrocie do kogoś",
    meaning:
      "Zwrot do bliskiego kumpla albo kogoś, kto myśli i zachowuje się podobnie: „ziomek”, „bratnia dusza”. Nie oznacza bliźniaka. „Twin, chodź na boisko”.",
    origin: "Z angielskiego slangu internetowego. W finale plebiscytu Młodzieżowe Słowo Roku 2025.",
    example: "Też nie zrobiłeś zadania? Twin.",
    dziaders: "Dawne „szwagier” użyte wobec kogoś, kto szwagrem nie jest. Funkcja ta sama: oznaczenie swojego człowieka.",
    reaction: "Jaki twin? Jestem jedynakiem. Rodzice mówili, że jeden wystarczy.",
    checked: CHECKED,
  },
  {
    slug: "unc",
    word: "unc",
    variants: ["unc behavior", "unc status"],
    grammar: "rzeczownik",
    meaning:
      "Skrót od angielskiego „uncle”: wujek. Żartobliwie o kimś starszym, kto nie nadąża za trendami albo zachowuje się po wujkowemu, także o rówieśniku po trzydziestce. „Unc behavior” to zachowanie kojarzone ze starszym pokoleniem.",
    origin: "Z angielskiego slangu internetowego. W finale plebiscytu Młodzieżowe Słowo Roku 2026.",
    example: "Wysłał na grupę zdjęcie zrobione tabletem. Unc behavior.",
    dziaders:
      "To słowo opisuje dziadersa. Instytut z zadowoleniem odnotowuje, że młodzież samodzielnie wyodrębniła gatunek, choć bez łacińskiej nazwy i bez Atlasu.",
    reaction: "Jaki unc? Wujek. Dla ciebie wujek Zbyszek.",
    phrase: "za-moich-czasow",
    checked: CHECKED,
  },
];

const SLANG_SL: SlangEntry[] = overlayList("slang", SLANG, (entry) => entry.slug, SLANG_TEXT).map((entry) => {
  const slug = SLANG_SLUGS[entry.slug];
  if (!slug) overlayProblems.push(`slang[${entry.slug}]: no Slovenian slug`);
  return { ...entry, slug: slug ?? entry.slug };
});

const EDITIONS: Record<Locale, SlangEntry[]> = { pl: SLANG, sl: SLANG_SL };

/** The youth dictionary in an edition: same entries and order, the edition's text and slugs. */
export const getSlang = (locale: Locale) => EDITIONS[locale];
export const slangBySlug = (slug: string, locale: Locale) => EDITIONS[locale].find((entry) => entry.slug === slug);
