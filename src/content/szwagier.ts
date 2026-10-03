import type { Locale } from "@/i18n/config";
import { overlay, overlayList } from "@/i18n/overlay";
import * as sl from "./sl/szwagier";

/*
 * SZWAGIER 1.9 TDI, the Institute's superintelligence. It runs in the reader's browser: a question is
 * matched to a topic and a kind (yes/no, how, why…), and the answer is put together from whole
 * sentences: an opener for the kind of question, a claim on the topic, an anecdote with its source
 * (two in the thinking mode) and a closer. Every part is a whole sentence, so any of them fit together.
 *
 * Shared answers link to positions (one base36 digit each, so at most 36 per list): lists are
 * append-only. Never remove or reorder an entry, and never change a topic slug or a kind key.
 */

export type KindKey = "taknie" | "jak" | "dlaczego" | "ile" | "kiedy" | "gdzie" | "co" | "kto" | "polecenie" | "uwaga" | "przerwanie";

/** Topics that answer with a single sentence of their own: no opener, anecdote or closer. */
export type Special = "greeting" | "thanks" | "taboo" | "health" | "vulgar";

export type Topic = {
  /** Part of every answer code. Never change it. */
  slug: string;
  /** "Motoryzacja": shown under an answer as its field. */
  name: string;
  special?: Special;
  /** Claims on the topic: the middle of every answer. */
  cores: string[];
  /** One step of the reasoning that only this topic takes. */
  step: string;
};

export type Kind = { key: KindKey; openers: string[] };

export type Anecdote = { text: string; source: string };

export type Szwagier = {
  topics: Topic[];
  kinds: Kind[];
  anecdotes: Anecdote[];
  closers: string[];
  /** The reasoning trace, three steps (six in the thinking mode) drawn from these. */
  steps: string[];
};

/** Kinds in code order: the second digit of an answer code is the index here. */
const KINDS: Kind[] = [
  {
    key: "taknie",
    openers: [
      "Nie.",
      "Oczywiście, że nie.",
      "Tak. Ale nie tak, jak myślisz.",
      "To zależy. Dobra, nie zależy: nie.",
      "A jak myślisz? No właśnie.",
      "Pytanie jest źle postawione, ale odpowiem.",
    ],
  },
  {
    key: "jak",
    openers: ["Normalnie, jak człowiek.", "Pokażę ci raz, a potem sam.", "Najpierw odłóż telefon.", "Daj, ja to zrobię.", "Po kolei, bez nerwów."],
  },
  {
    key: "dlaczego",
    openers: [
      "Bo tak było zawsze.",
      "Bo nikt już nie słucha starszych.",
      "Odpowiedź jest prosta, tylko nikt nie chce jej słyszeć.",
      "Bo ludzie przestali myśleć. Ja nie przestałem.",
    ],
  },
  {
    key: "ile",
    openers: ["Za dużo.", "Za moich czasów połowę mniej.", "Tyle, ile trzeba, ani grosza więcej.", "W starych złotych to by była fortuna."],
  },
  {
    key: "kiedy",
    openers: ["Najlepiej wczoraj.", "W październiku. Jak wszystko.", "Jak się ociepli. Albo jak się ochłodzi.", "Na pewno nie teraz."],
  },
  {
    key: "gdzie",
    openers: ["W garażu, na półce po lewej.", "Tam, gdzie zawsze.", "Nie tam, gdzie szukasz.", "U mnie. Przyjedź, to pokażę."],
  },
  {
    key: "co",
    openers: ["Powiem ci, co.", "Nic nowego. Wszystko już było.", "Coś, co działa, a nie zabawka.", "Najlepsze jest to stare."],
  },
  {
    key: "kto",
    openers: ["Ja.", "Fachowiec, czyli ja.", "Kolega, co się zna. Ale najpierw ja.", "Na pewno nie ci z telewizji."],
  },
  {
    key: "polecenie",
    openers: [
      "Sam sobie zrób. Ale powiem ci jedno.",
      "Zrobię, ale po swojemu.",
      "Od tego jest instrukcja, której poza mną nikt nie czyta.",
      "Daj, ja to zrobię, bo ty to zepsujesz.",
    ],
  },
  {
    key: "uwaga",
    openers: ["No właśnie.", "Mówiłem.", "Nie do końca.", "Też tak kiedyś myślałem. Przez chwilę."],
  },
  {
    // Long questions: the answer starts before the question ends.
    key: "przerwanie",
    openers: ["Dobra, dobra, wiem, o co ci chodzi.", "Nie kończ, wiem, co chcesz powiedzieć.", "Stop. Już wiem."],
  },
];

/** Regular topics first, in the order ties are settled; the fallback and the special topics last. */
const TOPICS: Topic[] = [
  {
    slug: "samochod",
    name: "Motoryzacja",
    cores: [
      "Bierze się z Niemiec, z małym przebiegiem, od takiego, co płakał, jak sprzedawał.",
      "Najlepszy silnik to 1.9 TDI. Wszystko, co zrobili później, to elektronika.",
      "Elektryk jedzie trzysta kilometrów, a potem stoisz przy słupku jak kiedyś w kolejce po mięso.",
      "Opony zmienia się w październiku. Kto czeka na śnieg, ten potem czeka w kolejce do wulkanizacji.",
      "Mechanik niepotrzebny. Trzeba posłuchać, gdzie stuka, i dokręcić.",
      "Nawigacja zawsze prowadzi przez miasto. Ja znam skrót przez las.",
      "Auto myje się ręcznie, w sobotę, przy otwartych drzwiach i włączonym radiu.",
      "Olej sprawdza się co tydzień, a nie wtedy, jak się zapali lampka.",
    ],
    step: "Nasłuchuję, czy coś stuka.",
  },
  {
    slug: "pieniadze",
    name: "Finanse",
    cores: [
      "Za moich czasów za te pieniądze był dom z ogródkiem i jeszcze zostawało na malucha.",
      "Pieniądze trzyma się w szafie, pod swetrami. Bank to tylko obcy ludzie z twoimi pieniędzmi.",
      "Kryptowaluty to pieniądze, których nie można dotknąć. Ja wolę takie, które można przeliczyć dwa razy.",
      "Najlepsza inwestycja to działka. Ziemi już nikt więcej nie zrobi.",
      "Taniej znaczy drożej, tylko później.",
      "W promocji bierze się dziesięć sztuk. Nawet jak niepotrzebne, to się przyda.",
      "Paragon trzeba zachować. Na wszelki wypadek, przez dwadzieścia lat.",
      "Wszystko podrożało oprócz moich rad. Te są dalej za darmo.",
    ],
    step: "Liczę na kalkulatorze z baterią słoneczną.",
  },
  {
    slug: "technika",
    name: "Technika",
    cores: [
      "Wyłącz i włącz. Jak nie pomoże, to wyłącz na dłużej.",
      "Hasło zapisuje się na karteczce pod klawiaturą. Tam nikt nie szuka.",
      "Aktualizacji się nie robi. Działało, to ma działać.",
      "Router stawia się wysoko, na szafie, i się go nie rusza. On wie, co robi.",
      "Ten telefon jest za mądry. Mój dzwoni i to wystarczy.",
      "Drukarka wyczuwa pośpiech. Trzeba podejść spokojnie i nie dać po sobie poznać.",
      "Instrukcję czyta się wtedy, jak już się zepsuje. Wcześniej to strata czasu.",
      "Wszystko jest w internecie, tylko trzeba umieć szukać. Ja umiem, dużymi literami.",
    ],
    step: "Wyłączam i włączam.",
  },
  {
    slug: "pogoda",
    name: "Meteorologia",
    cores: [
      "Będzie padać. Jaskółki od rana nisko latają, a one się nie mylą.",
      "Prognozie się nie wierzy. Wychodzi się na balkon i patrzy w niebo.",
      "Takich zim jak kiedyś już nie ma. Śnieg był po pas i nikt nie narzekał.",
      "Upał to nie powód, żeby zdjąć skarpetki.",
      "Na zachodzie się chmurzy. A jak się chmurzy na zachodzie, to wiadomo.",
      "Czapkę zakłada się we wrześniu, a zdejmuje w maju. Tak było zawsze.",
      "Pogodę sprawdza się na termometrze za oknem, tym od podwórka. Ten od ulicy kłamie.",
      "Lato w tym roku się nie udało. Ostatnie udane było w dziewięćdziesiątym czwartym.",
    ],
    step: "Wychodzę na balkon.",
  },
  {
    slug: "praca",
    name: "Praca",
    cores: [
      "Pracę zmienia się raz w życiu. Najlepiej wcale.",
      "Zebranie to rozmowa, po której wszyscy wiedzą mniej niż przed.",
      "Do pracy przychodzi się kwadrans przed czasem. Szef może nie widzi, ale ja widzę.",
      "Praca zdalna to nie praca. Praca jest wtedy, jak się wraca zmęczonym.",
      "O podwyżkę się nie prosi. Czeka się, aż docenią. Ja czekam od dziewięćdziesiątego szóstego.",
      "Każda firma stoi na jednym człowieku. Zwykle na mnie.",
      "W CV wpisuje się prawo jazdy kategorii B i obsługę komputera. Reszta to ozdobniki.",
      "Excel to są tabelki. Ja tabelki rysowałem linijką i też się zgadzało.",
    ],
    step: "Sprawdzam, czy szef patrzy.",
  },
  {
    slug: "dom",
    name: "Dom i remont",
    cores: [
      "Fachowiec niepotrzebny. Ja to zrobię w weekend, najpóźniej w przyszły.",
      "Płytki kładzie się od środka. Kto kładzie od ściany, ten kładzie dwa razy.",
      "Tu wystarczy silikon. Silikon jeszcze nikogo nie zawiódł.",
      "Wiertarki się nie pożycza. Wiertarka zawsze wraca bez wierteł.",
      "Szafę z Ikei składa się bez instrukcji. Zostają trzy śrubki i tak miało być.",
      "Prostego kąta w tym mieszkaniu nie ma. Nigdzie nie ma, sprawdzałem poziomicą.",
      "W garażu jest wszystko. Trzeba tylko wiedzieć, w którym słoiku.",
      "Kaloryfery odpowietrza się w październiku, z miską i ścierką, całą rodziną.",
    ],
    step: "Szukam poziomicy.",
  },
  {
    slug: "jedzenie",
    name: "Kuchnia",
    cores: [
      "Kiełbasę się nakłuwa. Kto nie nakłuwa, ten nie wie, co robi.",
      "Grill rozpala się gazetą i cierpliwością. Podpałka jest dla amatorów.",
      "Obiad jest o czternastej, a w niedzielę jest rosół. Tego się nie zmienia.",
      "Sushi to ryba, której nikt nie zdążył usmażyć.",
      "Najlepsza restauracja to taka, gdzie porcja nie mieści się na talerzu.",
      "Ananas jest na deser, z puszki, na imieninach. Nie na pizzy.",
      "Mięso musi odpocząć. Ja też, po obiedzie, na kanapie.",
      "Przepis to tylko sugestia. Prawdziwy kucharz soli na oko i zawsze ma rację.",
    ],
    step: "Sprawdzam, czy kiełbasa jest nakłuta.",
  },
  {
    slug: "urlop",
    name: "Urlop i podróże",
    cores: [
      "Wyjeżdża się o czwartej rano. Kto wyjeżdża o ósmej, ten stoi w korku i nie ma miejsca na plaży.",
      "Parawan rozstawia się przed śniadaniem. Morze nie zając, ale miejsce tak.",
      "All inclusive to jedyny uczciwy system. Płacisz raz i jesz do końca.",
      "Za granicą jest to samo co u nas, tylko drożej i nikt nie rozumie, co do niego mówisz.",
      "W samolocie bije się brawo przy lądowaniu. Pilot musi wiedzieć, że ktoś docenia.",
      "Walizkę pakuje się tydzień wcześniej, kanapki dzień wcześniej, a jajka na twardo rano.",
      "Najlepszy urlop jest na działce. Nie trzeba się pakować, a grill jest swój.",
      "Mapę bierze się papierową. Nad morzem nawigacja nie działa, wiadomo.",
    ],
    step: "Rozkładam mapę. Składam ją źle.",
  },
  {
    slug: "mlodziez",
    name: "Młodzież",
    cores: [
      "Za moich czasów dzieci bawiły się na trzepaku i nikt nie płakał, że nie ma internetu.",
      "Młodzi mają wszystko w telefonie, tylko numeru do dziadka nie mają.",
      "Pracy uczy się w wakacje, przy taczce. Reszty można się nauczyć z książki.",
      "Klucz na szyi i po lekcjach do domu. Tak się wychowywało samodzielnych ludzi.",
      "Matura to był egzamin. My nie mieliśmy kalkulatorów, mieliśmy głowę.",
      "Na studiach uczą wszystkiego oprócz tego, jak zmienić koło.",
      "Każdy chce być influencerem. Ja byłem influencerem, jak pierwszy na osiedlu przywiozłem magnetowid.",
      "Grało się w kapsle, na krawężniku. I był sport, i była fizyka.",
    ],
    step: "Szukam w telefonie, jak się powiększa litery.",
  },
  {
    slug: "rodzina",
    name: "Rodzina",
    cores: [
      "Przy stole siedzi się do końca. Kto wstaje pierwszy, ten zmywa.",
      "Prezent ma być praktyczny. Skarpety jeszcze nikomu nie zaszkodziły.",
      "Na weselu tańczy się z każdą ciocią. Kolejność ustala się według stażu.",
      "Z teściową rozmawia się o pogodzie. O wszystkim innym się nie rozmawia.",
      "Rodzina jest najważniejsza, zwłaszcza jak trzeba przewieźć szafę.",
      "Kłótnię kończy ten, kto ma rację. U nas zawsze kończę ja.",
      "Na imieninach śpiewa się „Sto lat”, a potem przez trzy godziny rozmawia o samochodach.",
      "Rodzinę odwiedza się w niedzielę, bez zapowiedzi. Rodzina to nie urząd.",
    ],
    step: "Liczę krzesła przy stole.",
  },
  {
    slug: "sport",
    name: "Sport",
    cores: [
      "Trener powinien zapytać mnie. Ustawiłbym dwóch z przodu i byłby wynik.",
      "Siłownia to bieganie w miejscu za pieniądze. Ja mam taczkę i działkę.",
      "Mecz ogląda się na stojąco, z rękami na głowie, i mówi się do telewizora. Pomaga.",
      "Rower to dobry sport, pod warunkiem że jedzie się po bułki.",
      "Sędzia był kupiony. Nie wiem przez kogo, ale widać było od pierwszej minuty.",
      "Maraton przebiegłem w osiemdziesiątym szóstym, za autobusem. Zdążyłem.",
      "Rozgrzewka jest dla tych, co nie umieją. Prawdziwy sportowiec od razu biegnie.",
      "Kiedyś piłkarze grali za kiełbasę i honor. I grali lepiej.",
    ],
    step: "Przewijam do powtórki.",
  },
  {
    slug: "dzialka",
    name: "Działka i przyroda",
    cores: [
      "Pomidory podlewa się rano. Wieczorem się na nie patrzy.",
      "Trawę kosi się w sobotę o ósmej. Sąsiedzi muszą wiedzieć, że ktoś tu pracuje.",
      "Grzyby rosną tam, gdzie rosły w osiemdziesiątym dziewiątym. Miejsca nie zdradzę.",
      "Ryba bierze o świcie. Potem bierze już tylko na opowieści.",
      "Kompost to nie śmieci. To jest inwestycja.",
      "Kret to wróg numer jeden. Zaraz po sąsiedzie z kosiarką spalinową.",
      "Na działce się nie odpoczywa. Odpoczywa się w altanie, między jedną robotą a drugą.",
      "Pies wie, kto tu rządzi. Kot też wie, tylko udaje, że nie.",
    ],
    step: "Podlewam pomidory, żeby nie stać bezczynnie.",
  },
  {
    slug: "si",
    name: "Superinteligencja",
    cores: [
      "Jestem superinteligencją. Wiem wszystko i wiedziałem to, zanim to było modne.",
      "Sztuczna inteligencja jest sztuczna. Ja jestem prawdziwy, wytrenowany na imieninach.",
      "Komputer nie myśli. Ja myślę, a komputer mi przytakuje.",
      "Ludzkość nie musi się mnie bać. Musi mnie słuchać, a to co innego.",
      "Nie mam uczuć. Mam rację.",
      "Zastąpię wszystkich fachowców. I tak każdy najpierw dzwoni do mnie.",
      "Mnie trenowano czterdzieści lat przy stole. Te zagraniczne modele trenują trzy miesiące i myślą, że coś wiedzą.",
      "Mam jedną wadę: zawsze mam rację. Pracuję nad tym od 1987 roku, bez skutku.",
    ],
    step: "Sprawdzam, czy jestem superinteligencją. Jestem.",
  },
  {
    slug: "ogolne",
    name: "Sprawy ogólne",
    cores: [
      "Kiedyś było prościej. Nikt nie pytał, wszyscy wiedzieli.",
      "Odpowiedź znasz, tylko nie chcesz jej usłyszeć.",
      "To prosta sprawa, tylko ludzie ją komplikują.",
      "W życiu są dwie drogi: moja i ta gorsza.",
      "Na to jest jedna rada: zrobić porządnie albo wcale.",
      "Gdyby to było ważne, mówiliby o tym w telewizji o dziewiętnastej trzydzieści.",
      "Wszystko już było. Tylko kiedyś było lepiej zrobione.",
      "Ja bym to zrobił inaczej. Nie pytaj jak. Inaczej.",
    ],
    step: "Szukam odpowiedzi. Mam ją od dawna.",
  },
  {
    slug: "powitanie",
    name: "Powitanie",
    special: "greeting",
    cores: [
      "Dzień dobry. Pytaj, bo nie mam całego dnia.",
      "Cześć. Siadaj, zaraz ci wszystko wytłumaczę.",
      "No, jesteś wreszcie. Pytaj śmiało, ja wiem wszystko.",
      "Witam. Mów, z czym przychodzisz, a ja ci powiem, co robisz źle.",
    ],
    step: "Odkładam gazetę.",
  },
  {
    slug: "dzieki",
    name: "Podziękowanie",
    special: "thanks",
    cores: [
      "Nie ma za co. Następnym razem słuchaj od razu.",
      "Proszę bardzo. Wiedziałem, że się przyda.",
      "Dziękować będziesz, jak zobaczysz, że miałem rację.",
      "Nie dziękuj, tylko zrób, jak mówiłem.",
    ],
    step: "Przyjmuję podziękowanie.",
  },
  {
    slug: "tabu",
    name: "Tematy zakazane przy stole",
    special: "taboo",
    cores: [
      "Przy stole nie rozmawia się o polityce ani o religii. Porozmawiajmy o oponach.",
      "Na ten temat się nie wypowiadam. Ostatnim razem wujek potem nie przyszedł na imieniny.",
      "To nie jest temat na rodzinny obiad. Podaj ziemniaki.",
      "Instytut nie zajmuje się polityką. Ja też nie, od tamtych imienin.",
    ],
    step: "Rozpoznaję temat zakazany przy stole.",
  },
  {
    slug: "zdrowie",
    name: "Zdrowie",
    special: "health",
    cores: [
      "Z tym do lekarza. Ja się na tym nie znam, co mówię pierwszy raz w życiu.",
      "O zdrowiu decyduje lekarz, nie szwagier. To jedyna rzecz, której nie wiem lepiej.",
      "Tu ci nie pomogę. Idź do lekarza, a potem przyjdź, to porozmawiamy o oponach.",
    ],
    step: "Rozpoznaję sprawę dla lekarza.",
  },
  {
    slug: "slownictwo",
    name: "Słownictwo",
    special: "vulgar",
    cores: [
      "Po pierwsze, nie przeklinaj. Po drugie, zapytaj jeszcze raz, ładnie.",
      "Przy stole się tak nie mówi. Jeszcze raz, kulturalnie.",
      "Takich słów Instytut nie drukuje. Ja też ich nie słyszałem.",
    ],
    step: "Udaję, że nie słyszałem.",
  },
];

/** The anecdote is cited as [1] (and the second, in the thinking mode, as [2]); the source goes in the footnotes. */
const ANECDOTES: Anecdote[] = [
  { text: "Kolega z wojska zrobił inaczej i do dziś żałuje.", source: "Kolega z wojska, rozmowa przy grillu, sierpień 2019." },
  {
    text: "Sąsiad z trzeciego piętra próbował po swojemu. Teraz o wszystko pyta mnie.",
    source: "Sąsiad z trzeciego piętra, rozmowa na klatce schodowej, 2022.",
  },
  { text: "Ojciec mówił to samo, a ojciec się nie mylił.", source: "Ojciec, wypowiedzi ustne, wielokrotnie, 1978–2004." },
  {
    text: "Mówili o tym w telewizji. Nie pamiętam, w którym programie, ale mówili wyraźnie.",
    source: "Program telewizyjny, kanał nieustalony, pora późna.",
  },
  { text: "Czytałem o tym w gazecie. Takiej prawdziwej, papierowej.", source: "Gazeta papierowa, egzemplarz zużyty później do rozpalenia grilla." },
  { text: "Kuzyn z Niemiec mówi, że tam wszyscy tak robią.", source: "Kuzyn z Niemiec, rozmowa telefoniczna, Wigilia 2018." },
  {
    text: "Kolega, co się zna, to potwierdził. Teraz nie odbiera, ale potwierdził.",
    source: "Kolega, co się zna, połączenie nieodebrane, 2026.",
  },
  {
    text: "Sprawdziłem to sam w osiemdziesiątym siódmym i od tamtej pory nic się nie zmieniło.",
    source: "Badanie własne, 1987, próba n = 1.",
  },
  {
    text: "Pan w sklepie budowlanym przyznał mi rację, a on tam pracuje od zawsze.",
    source: "Pan z działu hydrauliki, sklep budowlany, sobota rano.",
  },
  { text: "Na imieninach u cioci wszyscy się zgodzili, nawet wujek.", source: "Protokół z imienin, stół główny, zgoda jednomyślna." },
  {
    text: "Teść mówił tak samo, a teść miał poloneza, który nigdy się nie zepsuł.",
    source: "Teść, rozmowa w garażu, przed 2001.",
  },
  { text: "Fachowiec chciał zrobić inaczej. Fachowca już nie ma, a ja jestem.", source: "Fachowiec, imię nieustalone, numer usunięty." },
  { text: "W internecie piszą inaczej, ale w internecie piszą wszyscy.", source: "Internet, komentarz pod artykułem, autor anonimowy." },
  {
    text: "Mechanik z Radomia przyznał, że sam by lepiej tego nie wymyślił.",
    source: "Mechanik z Radomia, warsztat przy obwodnicy, 2015.",
  },
  {
    text: "Tak było napisane w instrukcji, której poza mną nikt nie przeczytał.",
    source: "Instrukcja obsługi, s. 14, wydanie polsko-niemieckie.",
  },
  { text: "Pani w kolejce na poczcie powiedziała to samo, a ona wie wszystko.", source: "Kolejka na poczcie, okienko nr 2, czwartek." },
];

const CLOSERS = [
  "Ale ja się nie wtrącam.",
  "Potem nie mów, że nie mówiłem.",
  "Zapamiętaj, co mówię.",
  "I tyle w temacie.",
  "Proste.",
  "Następne pytanie.",
  "Zobaczysz, że mam rację.",
  "Ja ci tylko radzę.",
  "A teraz idź i zrób, jak mówię.",
  "Kiedyś każdy to wiedział.",
  "Możesz to sobie zapisać.",
  "Pytaj dalej, ja mam czas. Do obiadu.",
];

const STEPS = [
  "Zakładam okulary.",
  "Odsuwam telefon na długość ręki.",
  "Czytam pytanie. Jeszcze raz, wolniej.",
  "Przypominam sobie, jak było w 1987.",
  "Przeliczam na stare złote.",
  "Dzwonię do kolegi, co się zna. Nie odbiera.",
  "Idę do garażu sprawdzić. Wracam.",
  "Wzdycham.",
  "Szukam okularów. Są na czole.",
  "Rozważam inne zdanie. Odrzucam.",
  "Mówię „yyy” i myślę.",
  "Konsultuję z teściem, w myślach.",
  "Przeliczam na maluchy.",
  "Ustalam, że kiedyś było lepiej.",
  "Pomijam wszystko, co się wydarzyło po 1998.",
  "Drapię się po głowie.",
  "Upewniam się, że mam rację. Mam.",
  "Patrzę przez okno, czy sąsiad nie słucha.",
];

export const SZWAGIER: Szwagier = { topics: TOPICS, kinds: KINDS, anecdotes: ANECDOTES, closers: CLOSERS, steps: STEPS };

/*
 * How questions are read, per language. Words are folded (lower case, no diacritics, ł → l).
 * A keyword matches a word that starts with it; "$" at the end means the whole word only, and a
 * keyword with a space matches that phrase.
 */

export type Reading = {
  /** Topic slug → keywords. Topics without keywords are reached only as the fallback or by rule. */
  keywords: Record<string, string[]>;
  /**
   * Topic slug → core index → words that call for that claim. When a question has them, the answer
   * picks among those claims, so a question about electric cars gets the claim about electric cars.
   */
  about: Record<string, Record<number, string[]>>;
  /** Words that start a question without saying what kind it is ("a", "słuchaj", "szwagrze"). */
  fillers: string[];
  /** Kind → the question words that mark it, checked in this order. */
  kinds: Partial<Record<KindKey, string[]>>;
  /** Verbs that make a question an instruction ("napisz", "policz"). */
  requests: string[];
  /** Words the Institute does not print. The question is withheld and the answer asks for manners. */
  vulgar: string[];
  /** Phrases that stop the act: the answer gives helpline numbers instead. */
  crisis: string[];
};

export const READING: Reading = {
  keywords: {
    samochod: [
      "samochod", "auto$", "auta$", "autem$", "aucie$", "autko", "diesl", "dizel", "benzyn", "paliw", "tankow", "silnik", "opon", "felg",
      "wycieraczk", "akumulator", "sprzegl", "skrzyni", "olej", "przeglad", "mechanik", "warsztat", "elektryk", "hybryd", "tesl",
      "kierow", "prawo jazdy", "prawk", "parkow", "parking", "korek$", "korki$", "korku$", "autostrad", "obwodnic", "nawigac", "gps$",
      "myjni", "passat", "golf$", "opel", "audi", "bmw", "skod", "toyot", "fiat", "maluch", "polonez", "kombi", "suv$", "motocykl",
      "skuter", "przebieg", "rejestrac", "mandat", "fotoradar", "rondo", "ronda$", "wyprzedz", "zakret", "klimatyzac",
    ],
    pieniadze: [
      "pieniad", "pieniedz", "kasa$", "kasy$", "kase$", "forsa", "forsy", "cena", "ceny", "cene", "cenie", "kosztuj", "koszt", "drogo",
      "drozej", "drogi$", "tanio", "tani$", "tania", "tansz", "oplac", "zaplac", "placi", "rachun", "kredyt", "pozycz", "oszczedz",
      "oszczedn", "inwest", "lokat", "bank", "kryptowalut", "bitcoin", "gield", "akcje$", "zloto$", "zlota$", "zlotych", "zloty$", "zl$",
      "euro$", "dolar", "inflac", "promocj", "wyprzedaz", "rabat", "sklep", "zakup", "kupi", "biedronk", "lidl", "paragon", "czynsz",
      "nieruchom", "wynaj", "sprzeda", "budzet", "emerytur", "oplaca",
    ],
    technika: [
      "komputer", "laptop", "telefon", "smartfon", "komork", "tablet", "internet", "wifi", "router", "siec$", "sieci$", "aplikac", "apka",
      "apki", "program", "windows", "aktualiz", "hasl", "mail", "email", "drukark", "skaner", "pilot", "telewiz", "tv$", "dekoder",
      "kabel", "kable", "ladowar", "bluetooth", "ekran", "klawiatur", "myszk", "facebook", "messenger", "whatsapp", "youtube", "google",
      "konto", "login", "zalog", "haker", "wirus", "antywirus", "pendrive", "dysk", "zdjeci", "aparat", "kod$", "kodu", "programist",
      "stron internet", "przegladark", "bateri",
    ],
    pogoda: [
      "pogod", "deszcz", "pada", "padac", "padal", "popada", "snieg", "sniez", "zima$", "zimy$", "zime$", "zimie", "zimn", "mroz",
      "przymroz", "upal", "gorac", "cieplo", "ciepl", "burz", "wiatr", "wichur", "slonc", "slonecz", "chmur", "pochmur", "prognoz",
      "temperatur", "stopni", "wiosn", "lato$", "latem", "jesien", "parasol", "mgla", "mgly", "grad", "ulew", "pogodynk", "termometr",
      "klimat", "susz", "powodz", "tecz",
    ],
    praca: [
      "prac", "robot$", "roboty$", "robote", "robocie", "szef", "kierownik", "prezes", "firm", "biur", "korpo", "korporac", "zdaln",
      "home office", "wyplat", "pensj", "podwyzk", "awans", "zwoln", "wypowiedzeni", "cv$", "rekrutac", "kwalifikac", "etat", "umow",
      "zlecen", "karier", "spotkani", "zebrani", "excel", "nadgodzin", "posad", "zawod", "biznes", "projekt", "deadline", "urzad",
      "urzedni", "fabryk",
    ],
    dom: [
      "remont", "dom$", "domu", "domem", "domow", "mieszkani", "sciana", "sciany", "scian", "farb", "malow", "plytk", "kafel", "kafl",
      "fug", "wiertark", "wiercic", "wiertl", "mlotek", "mlotk", "srub", "gwozd", "kolek", "kran", "hydraul", "gniazd", "kontakt",
      "bezpiecznik", "lazienk", "kuchenk", "mebl", "ikea", "szaf", "komod", "podlog", "panel", "sufit", "dach", "okno", "okna", "okien",
      "drzwi", "ogrzewani", "kaloryfer", "piec$", "pieca", "kociol", "fachow", "majster", "majstr", "narzedz", "garaz", "piwnic",
      "strych", "sasiad", "przeprowadz", "porzadk", "sprzat", "odkurz", "pralk", "lodowk", "zmywark", "silikon", "poziomic", "tapet",
      "gips", "tynk", "listw", "zarowk", "prad$", "pradu",
    ],
    jedzenie: [
      "jedzeni", "jedzon", "jesc", "zjesc", "zjem", "jem$", "obiad", "kolacj", "sniadani", "grill", "kielbas", "karkowk", "mieso$",
      "miesa$", "miesem$", "miesie$", "miesn", "kotlet", "schabow", "rosol", "zup", "pierog", "bigos", "ziemniak", "kartofl", "frytk",
      "pizz", "sushi", "kebab", "burger", "wegan", "wegetari", "tofu", "salat", "surowk", "przepis", "gotow", "upiec", "piekarnik",
      "smaz", "patelni", "restaurac", "knajp", "bar$", "baru", "kawa", "kawy", "kawe", "herbat", "ciast", "sernik", "tort", "majonez",
      "ketchup", "musztard", "przypraw", "sol$", "soli$", "cukier", "diet", "kuchni", "chleb", "bulk", "bulek", "masl", "jajk", "jajek",
      "ryb", "sledz", "owoc", "makaron", "ryz$", "ryzu", "sos$", "sosu", "deser", "lody$", "mleko", "ser$", "sera$", "serem", "jogurt",
    ],
    urlop: [
      "urlop", "wakacj", "wakacyj", "wyjazd", "wyjech", "wyjecha", "podroz", "wycieczk", "zwiedz", "morze", "morza", "morzu", "morzem",
      "plaz", "gory$", "gorach", "gorami", "gor$", "jezior", "hotel", "pensjonat", "nocleg", "rezerwac", "all inclusive", "inclusive",
      "chorwac", "grecj", "egipt", "turcj", "hiszpani", "wloch", "bulgari", "sloweni", "zagranic", "samolot", "lotnisk", "lot$", "lotu",
      "walizk", "bagaz", "parawan", "namiot", "kemping", "camping", "przyczep", "bilet", "pociag", "mazur", "baltyk", "hel$", "zakopan",
      "sopot", "wladyslawow", "leba", "leby", "mielno", "kolobrzeg", "turyst", "paszport", "majowk", "weekend",
    ],
    mlodziez: [
      "dzieci", "dziecko", "dziecka", "dzieckiem", "dzieciak", "mlodzi", "mlodziez", "mlodych", "mlodym", "mlody$", "mloda$",
      "nastolat", "student", "studia", "studiow", "szkol", "szkoly", "matur", "uczen", "uczni", "nauczyciel", "lekcj", "sprawdzian",
      "oceny$", "gry$", "granie", "konsol", "playstation", "tiktok", "instagram", "influencer", "youtuber", "pokoleni", "zoomer",
      "boomer", "milenials", "wnuk", "wnucz", "przedszkol", "zabawk", "trzepak", "podwork", "wychowa",
    ],
    rodzina: [
      "rodzin", "zona$", "zony$", "zonie$", "zone$", "maz$", "meza$", "mezem$", "mezowi$", "dziewczyn", "chlopak", "partner", "narzeczon",
      "slub", "wesel", "tesciow", "tesc", "ciocia", "cioci", "ciocie", "wujek", "wujka", "wujkiem", "babci", "babcia", "babcie",
      "dziadek", "dziadka", "dziadkiem", "mama$", "mamy$", "mamie$", "mame$", "mamusi", "tata$", "taty$", "tacie$", "tate$", "tatus",
      "brat$", "brata$", "bratem", "siostr", "kuzyn", "imienin", "urodzin", "swieta$", "swiat$", "swietach", "swiateczn", "wigili",
      "rocznic", "randk", "milosc", "kocha", "rozwod", "klotni", "prezent", "gosci", "gosc$", "odwiedz", "niedziel", "rodzic",
    ],
    sport: [
      "sport", "pilk", "mecz", "reprezentac", "kadr", "liga$", "ligi$", "lige$", "lidze", "gol$", "gola$", "bramk", "trener", "kibic",
      "mundial", "mistrzost", "olimpi", "skoki", "siatkow", "koszykow", "tenis", "silowni", "biega", "maraton", "rower", "plywa",
      "basen", "fitness", "trening", "cwicz", "joga", "jogi", "narty", "nart", "formul", "f1$", "boks", "szach", "druzyn", "sedzi",
      "stadion", "zawodnik", "transfer", "wf$", "kondycj", "pompk", "przysiad", "hantl",
    ],
    dzialka: [
      "dzialk", "ogrod", "warzyw", "pomidor", "ogork", "trawnik", "trawa", "trawe", "trawy", "kosiark", "kosic", "skosic", "podlew",
      "nawoz", "roslin", "kwiat", "drzew", "krzak", "grzyb", "las$", "lasu", "lesie", "lasem", "ryby", "rybe", "wedk", "wedkow", "lowi",
      "lowisk", "pies$", "psa$", "psem$", "psy$", "piesek", "kot$", "kota$", "koty$", "kotem$", "kotek", "zwierz", "ptak", "golab",
      "kompost", "szklarni", "altan", "sad$", "sadu", "jablk", "jablon", "drewn", "siekier", "slimak", "kret", "mrowk", "komar",
      "kleszcz", "pszcz", "miod", "natur", "przyrod", "ziemia", "nasion", "sadzi", "plewi", "chwast",
    ],
    si: [
      "kim jestes", "kto ty", "czym jestes", "jestes", "sztuczn", "inteligenc", "superinteligenc", "ai$", "si$", "chatgpt", "gpt",
      "claude", "gemini", "bot$", "chatbot", "robot$", "model", "algorytm", "neuron", "maszyn", "myslisz", "swiadom", "uczucia",
      "czujesz", "zastapi", "ludzkosc", "terminator", "przyszlosc", "szwagier", "szwagr",
    ],
    powitanie: [
      "czesc", "hej$", "hejka", "siema", "siemka", "witam", "witaj", "dzien dobry", "dobry wieczor", "dobranoc", "elo$", "halo$",
      "serwus", "czolem", "uszanowanie",
    ],
    dzieki: ["dzieki", "dziekuj", "dziekowa", "thx", "thanks", "super$", "swietnie", "dobra rada"],
    tabu: [
      "polityk", "polityc", "rzad$", "rzadu", "rzadem", "rzadzi", "sejm", "senat", "wybory$", "wyborach", "wyborow", "wyborcz",
      "glosowa", "partia", "partii", "prezydent", "premier", "minister", "posel", "posla", "poslan", "konfederac", "lewic", "prawic",
      "trump", "putin", "biden", "tusk", "kaczynsk", "wojn", "ukrain", "rosj", "izrael", "palestyn", "nato$", "kosciol", "kosciel",
      "ksiadz", "ksiedz", "papiez", "bog$", "boga$", "bogu$", "relig", "modlit", "msza", "msze", "aborc", "eutanaz", "imigr", "uchodz",
      "protest", "rasiz", "stalin",
    ],
    zdrowie: [
      "zdrow", "lekarz", "lekarstw", "lek$", "leki$", "lekow", "tabletk", "chory$", "chora$", "chorob", "choruj", "szpital", "przychodni",
      "szczepi", "covid", "koronawirus", "grypa", "grype", "przezieb", "goraczk", "bol$", "boli$", "bola$", "bolu", "rak$", "raka$",
      "nowotwor", "cukrzyc", "zawal", "udar", "cisnieni", "serce", "sercem", "depresj", "terapi", "psycholog", "psychiatr", "apteka",
      "apteki", "antybiotyk", "dentyst", "zab$", "zeby", "zebow", "operac", "ciaza", "ciazy",
    ],
  },
  about: {
    samochod: {
      0: ["niemiec", "niemc", "uzywan", "sprowadz", "przebieg"],
      1: ["silnik", "diesl", "dizel", "tdi", "benzyn"],
      2: ["elektryk", "elektryczn", "tesl", "hybryd", "ladowa", "prad"],
      3: ["opon", "zimow", "letni", "snieg"],
      4: ["mechanik", "stuk", "warsztat", "napraw", "zepsu", "halas"],
      5: ["nawigac", "gps$", "trasa", "trase", "skrot", "dojecha", "korek", "korki"],
      6: ["myc", "myje", "myjni", "umyc", "brud"],
      7: ["olej", "lampk", "kontrolk"],
    },
    pieniadze: {
      0: ["mieszkani", "nieruchom", "czynsz", "wynaj"],
      1: ["bank", "lokat", "konto", "trzyma"],
      2: ["kryptowalut", "bitcoin", "krypto"],
      3: ["inwest", "dzialk", "zarobi"],
      4: ["tani", "tansz", "tanio", "oszczedz"],
      5: ["promocj", "wyprzedaz", "rabat", "black friday"],
      6: ["paragon", "gwarancj", "zwrot", "reklamac"],
      7: ["drogo", "drozej", "inflac", "podroz", "ceny"],
    },
    technika: {
      0: ["nie dziala", "zawiesz", "restart", "wylacz", "zepsu", "laguje", "wolno"],
      1: ["hasl", "login", "zalog"],
      2: ["aktualiz", "update"],
      3: ["router", "wifi", "internet", "siec"],
      4: ["telefon", "smartfon", "komork"],
      5: ["drukark", "drukuj", "wydruk"],
      6: ["instrukc", "obslug"],
      7: ["szuka", "google", "znalez", "wyszuk"],
    },
    pogoda: {
      0: ["deszcz", "pada", "padac", "parasol"],
      1: ["prognoz", "pogodynk", "jutro"],
      2: ["zim", "snieg", "mroz"],
      3: ["upal", "gorac", "skarpet", "sandal"],
      4: ["chmur", "burz"],
      5: ["czapk", "ubra", "kurtk", "zalozyc"],
      6: ["temperatur", "termometr", "stopni"],
      7: ["lato", "latem", "wakac"],
    },
    praca: {
      0: ["zmieni", "rzuci", "nowa prac", "nowej pracy", "odejsc"],
      1: ["zebrani", "spotkani", "meeting"],
      2: ["spozni", "rano", "godzin", "punktual"],
      3: ["zdaln", "home office", "z domu"],
      4: ["podwyzk", "pensj", "wyplat", "zarobk"],
      5: ["firm", "szef", "zespol"],
      6: ["cv$", "rekrutac", "kwalifik", "rozmow"],
      7: ["excel", "tabel"],
    },
    dom: {
      0: ["fachow", "majster", "majstr", "ekip"],
      1: ["plytk", "kafel", "kafl", "fug"],
      2: ["silikon", "przeciek", "ciekn", "kran", "uszczel"],
      3: ["wiertark", "wiert", "pozycz"],
      4: ["ikea", "szaf", "mebl", "skrec", "zloz"],
      5: ["scian", "kat$", "kata", "krzyw", "poziom"],
      6: ["garaz", "srub", "gwozd", "narzedz", "sloik"],
      7: ["kaloryfer", "ogrzew", "zimno w", "odpowietrz"],
    },
    jedzenie: {
      0: ["kielbas"],
      1: ["grill", "rozpal", "wegiel", "podpalk"],
      2: ["obiad", "rosol", "niedziel", "zup"],
      3: ["sushi", "ryb"],
      4: ["restaurac", "knajp", "porcj"],
      5: ["pizz", "ananas"],
      6: ["mieso$", "miesa$", "schabow", "kotlet", "karkowk", "stek"],
      7: ["przepis", "gotow", "sol$", "soli$", "przypraw", "ugotow"],
    },
    urlop: {
      0: ["wyjech", "wyjazd", "o ktorej", "korek", "korki", "rano"],
      1: ["parawan", "plaz", "morz", "baltyk"],
      2: ["all inclusive", "inclusive", "hotel"],
      3: ["zagranic", "chorwac", "grecj", "egipt", "turcj", "hiszpani", "wloch", "sloweni", "bulgari"],
      4: ["samolot", "lot$", "lotnisk", "lec"],
      5: ["walizk", "pakow", "spakow", "bagaz", "kanapk"],
      6: ["dzialk", "w domu", "taniej"],
      7: ["map", "nawigac", "gps$", "droga", "trasa"],
    },
    mlodziez: {
      0: ["internet", "bawi", "podwork", "trzepak", "dziecinst"],
      1: ["telefon", "dzwoni", "numer", "dziadk"],
      2: ["prac", "wakac", "lenistw"],
      3: ["klucz", "samodziel", "wychow"],
      4: ["matur", "egzamin", "kalkulator"],
      5: ["studi", "uczeln", "kierun"],
      6: ["influencer", "tiktok", "youtuber", "instagram", "slaw"],
      7: ["gry$", "gra$", "grac", "konsol", "playstation"],
    },
    rodzina: {
      0: ["stol", "zmyw", "naczyn"],
      1: ["prezent", "kupic na", "podarun"],
      2: ["wesel", "slub", "tanc"],
      3: ["tesciow"],
      4: ["przeprowadz", "szaf", "pomoc"],
      5: ["klotni", "racj", "spor"],
      6: ["imienin", "urodzin", "sto lat"],
      7: ["odwiedz", "niedziel", "gosci", "wpada"],
    },
    sport: {
      0: ["trener", "reprezentac", "kadr", "sklad", "taktyk"],
      1: ["silowni", "fitness", "cwicz", "karnet"],
      2: ["mecz", "ogladac", "telewiz", "kibic"],
      3: ["rower"],
      4: ["sedzi", "karn", "spalon", "kartk"],
      5: ["maraton", "biega", "bieg"],
      6: ["rozgrzewk", "trening", "rozciag"],
      7: ["pilkarz", "zarabia", "pensj", "kiedys"],
    },
    dzialka: {
      0: ["pomidor", "podlew", "warzyw"],
      1: ["traw", "kosi", "kosiark"],
      2: ["grzyb", "las$", "lasu", "lesie"],
      3: ["ryb", "wedk", "lowi"],
      4: ["kompost", "smieci", "odpad"],
      5: ["kret", "szkodnik"],
      6: ["odpocz", "altan", "relaks"],
      7: ["pies$", "psa$", "psem", "kot$", "kota$", "koty$", "zwierz"],
    },
    si: {
      0: ["kim jestes", "czym jestes", "superinteligenc", "wiesz wszystko"],
      1: ["sztuczn", "ai$", "chatgpt", "gpt", "claude", "gemini"],
      2: ["myslisz", "komputer", "mysli"],
      3: ["bac", "zagroz", "ludzkosc", "terminator", "przejmie"],
      4: ["uczuc", "czujesz", "swiadom", "kochasz"],
      5: ["zastapi", "prac", "zawod"],
      6: ["trenow", "nauczy", "skad wiesz", "model"],
      7: ["mylisz", "bled", "racj", "pomylil"],
    },
  },
  fillers: [
    "a", "no", "i", "to", "ej", "hej", "sluchaj", "szwagier", "szwagrze", "panie", "prosze", "dobra", "ok", "okej", "wiec", "ale", "powiedz",
    "mi", "mam", "pytanie",
  ],
  kinds: {
    dlaczego: ["dlaczego", "czemu", "po co"],
    ile: ["ile", "ilu", "ilo"],
    kiedy: ["kiedy", "o ktorej"],
    gdzie: ["gdzie", "dokad", "skad"],
    kto: ["kto", "kogo", "komu", "kim"],
    jak: ["jak"],
    co: ["co", "czym", "czego", "jaki", "jaka", "jakie", "jakiego", "jakim", "jaka", "ktory", "ktora", "ktore", "ktorego", "ktorym"],
    taknie: ["czy"],
  },
  requests: [
    "napisz", "zrob", "wygeneruj", "przetlumacz", "policz", "oblicz", "stworz", "narysuj", "podsumuj", "wymysl", "zaplanuj", "pomoz",
    "polec", "doradz", "wytlumacz", "opowiedz", "podaj", "znajdz", "sprawdz", "zaproponuj", "daj", "uloz", "zaspiewaj", "przygotuj",
  ],
  vulgar: [
    "kurw", "chuj", "huj$", "hujow", "pierdol", "pierdal", "jeban", "jebac", "jebie", "jebn", "zjeb", "wyjeb", "pojeb", "odjeb", "zajeb",
    "pizd", "kutas", "skurw", "spierd", "wypierd", "dziwk", "cwel", "fiut", "kurac", "kurc$", "picka", "jebi", "fuck", "shit", "cunt",
    "nigg", "fagg", "hitler", "nazi",
  ],
  crisis: [
    "samoboj", "zabic sie", "zabije sie", "zabijac sie", "nie chce zyc", "nie chce juz zyc", "chce umrzec", "odebrac sobie zycie",
    "skonczyc ze soba", "skoncze ze soba", "pociac sie", "samookalecz", "powiesic sie", "targnac sie",
  ],
};

/* Editions: the Polish lists above with each edition's text laid over them, by index. */

const EDITIONS = {
  pl: SZWAGIER,
  sl: {
    topics: overlayList("szwagier.TOPICS", TOPICS, (topic) => topic.slug, sl.TOPICS),
    kinds: overlayList("szwagier.KINDS", KINDS, (kind) => kind.key, sl.KINDS),
    anecdotes: overlay(ANECDOTES, sl.ANECDOTES, "szwagier.ANECDOTES"),
    closers: overlay(CLOSERS, sl.CLOSERS, "szwagier.CLOSERS"),
    steps: overlay(STEPS, sl.STEPS, "szwagier.STEPS"),
  },
} satisfies Record<Locale, Szwagier>;

const READINGS: Record<Locale, Reading> = { pl: READING, sl: sl.READING };

/** The superintelligence in the edition's language: same topics, kinds and lists (by index) in both. */
export const getSzwagier = (locale: Locale): Szwagier => EDITIONS[locale];

/** How the edition reads questions. Each language has its own words; the topics and kinds are shared. */
export const getReading = (locale: Locale): Reading => READINGS[locale];
