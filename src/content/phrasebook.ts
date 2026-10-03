import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import * as sl from "./sl/phrasebook";

/*
 * Rozmówki dziaderskie: a line is an opener (zagajenie), a claim (teza) and a punchline (puenta).
 * Every part is a whole sentence, so any three of them read as one line.
 *
 * Lists are append-only: shared lines link to positions (one base36 digit each, so at most 36),
 * so never remove or reorder an entry. Add new ones at the end of a situation's own list.
 */

/** Frozen: every situation starts with these, in this order. */
const OPENERS = [
  "Ja ci powiem jedno.",
  "Słuchaj mnie teraz uważnie.",
  "Nie chcę się wtrącać, ale się wtrącę.",
  "Panie, ja w tym siedzę trzydzieści lat.",
  "Ja nic nie mówię, ja tylko mówię.",
  "Powiem krótko, bo nie lubię gadać.",
  "Ty się nie znasz, to ci wytłumaczę.",
  "Wiesz, co ja bym zrobił na twoim miejscu?",
];

/** Frozen: every situation ends with these, in this order. */
const CLOSERS = [
  "Ale co ja tam wiem.",
  "Potem nie mów, że nie mówiłem.",
  "Zapamiętaj, co mówię.",
  "Mój szwagier tak zrobił i do dziś żałuje.",
  "Kiedyś to było nie do pomyślenia.",
  "I tyle w temacie.",
  "Ja ci tylko radzę.",
  "Zobaczysz, że mam rację. Jak zawsze.",
];

export type Situation = {
  /** URL segment and part of every line code. Never change it. */
  slug: string;
  /** "W samochodzie": the phrasebook chapter. */
  name: string;
  /** "Samochód": tabs and labels. */
  short: string;
  openers: string[];
  claims: string[];
  closers: string[];
};

export const SITUATIONS: Situation[] = [
  {
    slug: "samochod",
    name: "W samochodzie",
    short: "Samochód",
    openers: [...OPENERS, "Daj, ja poprowadzę.", "Zjedź na pobocze, to ci pokażę."],
    claims: [
      "Diesel to jest diesel, a reszta to zabawki.",
      "Ten silnik jest nie do zajechania, jak się go nie rusza.",
      "Opony zmienia się w październiku, a nie jak spadnie śnieg.",
      "Za te pieniądze to są dwa Passaty z Niemiec.",
      "Elektryk? A jak prąd wyłączą, to co?",
      "Tu coś stuka. Słyszysz? Ja słyszę.",
      "Nawigacja nawigacją, ale ja tędy jeżdżę od dziewięćdziesiątego drugiego.",
      "Na trzecim biegu pod górę to on sam pojedzie.",
      "Klimatyzacja się psuje. Okno działa zawsze.",
      "Prawdziwy kierowca nie potrzebuje czujników parkowania.",
      "Olej sprawdza się co tydzień, a nie jak się zapali lampka.",
      "Takiego auta nie myje się w myjni. Tylko ręcznie, w niedzielę.",
    ],
    closers: [...CLOSERS, "A teraz zobacz, ile pali.", "I nie trzaskaj drzwiami."],
  },
  {
    slug: "remont",
    name: "Na remoncie",
    short: "Remont",
    openers: [...OPENERS, "Odsuń się, zaraz zobaczysz, jak to się robi.", "Kto ci to tak położył?"],
    claims: [
      "Płytki kładzie się od środka, a nie od ściany.",
      "Fachowiec? Ja to zrobię w weekend.",
      "Tu nie ma prostego kąta. Nigdzie nie ma.",
      "Tę ścianę bym wyburzył. Ale nie nośną. Chyba.",
      "Silikon to nie jest rozwiązanie, tylko przyznanie się do błędu.",
      "Ja bym tu dał panele. Wszędzie bym dał panele.",
      "Poziomica może kłamać, ale oko nie kłamie.",
      "Te śrubki zostały, bo są zapasowe.",
      "Kiedyś robiło się na wieki, a nie na gwarancję.",
      "Instrukcja jest dla tych, co nie umieją.",
      "Wiertarka musi być udarowa. Nawet do obrazka.",
      "Fuga szara, bo biała się brudzi. Wiem, co mówię.",
    ],
    closers: [...CLOSERS, "Dawaj wiertarkę.", "I nie wołaj fachowca, bo wstyd."],
  },
  {
    slug: "urlop",
    name: "Na urlopie",
    short: "Urlop",
    openers: [...OPENERS, "Wstawaj, jest piąta trzydzieści.", "Ja tu jeżdżę od lat, to wiem."],
    claims: [
      "Parawan rozstawia się przed siódmą, potem nie ma miejsca.",
      "Za te pieniądze to w Grecji mielibyśmy dwa tygodnie.",
      "Kanapki z domu. Przynajmniej wiadomo, co w nich jest.",
      "Woda ma czternaście stopni. Orzeźwiająca.",
      "Gofry po dwadzieścia złotych? Ja pamiętam po złotówce.",
      "Wyjeżdża się o czwartej, to się ominie korki.",
      "All inclusive trzeba wykorzystać. Do ostatniego śniadania.",
      "Skarpety do sandałów to jest wygoda, a nie moda.",
      "Morze jest najlepsze we wrześniu. Albo w maju. Ale nie teraz.",
      "Prognozę sprawdziłem w trzech aplikacjach. Wszystkie kłamią.",
      "Ręcznik kładzie się wieczorem, żeby rano było gdzie leżeć.",
      "Pamiątki kupuje się ostatniego dnia, wtedy są tańsze.",
    ],
    closers: [...CLOSERS, "Parawan bierzemy dwa.", "Wracamy w sobotę rano, przed korkami."],
  },
  {
    slug: "restauracja",
    name: "W restauracji",
    short: "Restauracja",
    openers: [...OPENERS, "Pan kierownik pozwoli na chwilę?", "Ja nic nie mówię, ale porcja jest mała."],
    claims: [
      "Schabowy powinien wystawać poza talerz.",
      "Za te pieniądze w domu byłyby trzy obiady.",
      "Ten stolik się chwieje. Ten obok też.",
      "Nie jem niczego, czego nie umiem wymówić.",
      "Tatar to jest surowe mięso, a nie danie.",
      "Kawa w tej filiżance to jest próbka, nie kawa.",
      "Zawsze biorę to samo, więc karta jest mi niepotrzebna.",
      "Ziemniaki muszą być z koperkiem. Bez dyskusji.",
      "Pierogi robi się w domu, a nie zamawia.",
      "Rosół z torebki poznam po pierwszej łyżce.",
      "Kiedyś do obiadu był kompot, i to w cenie.",
      "Rachunek dzielimy po równo, tylko deser liczymy osobno.",
    ],
    closers: [...CLOSERS, "I proszę resztę zapakować.", "Ocena w internecie: dwie gwiazdki."],
  },
  {
    slug: "komputer",
    name: "Przy komputerze",
    short: "Komputer",
    openers: [...OPENERS, "Zawołaj kogoś młodszego.", "Coś się zepsuło, ale ja nic nie ruszałem."],
    claims: [
      "Wyłącz i włącz. Zawsze działa.",
      "Router trzeba wyłączać na noc, żeby odpoczął.",
      "Hasło mam na karteczce pod klawiaturą. Bezpiecznie.",
      "Aktualizacji nie instaluję, bo potem nic nie działa.",
      "To jest wirus. Mówię ci, że to wirus.",
      "Wszystko drukuję, bo w komputerze się gubi.",
      "Kiedyś był jeden komputer na rodzinę i wystarczał.",
      "Ta cała chmura to są dane u obcych ludzi.",
      "Internet jest wolny, bo sąsiad podkrada.",
      "Myszka musi być na kabel, bo bateria się kończy.",
      "Ja tego nie kliknąłem. Samo się kliknęło.",
      "Ikonki mi się przestawiły. Ktoś tu grzebał.",
    ],
    closers: [...CLOSERS, "Wydrukuj mi to.", "A najlepiej daj mi to na pendrivie."],
  },
  {
    slug: "dzieci-sasiadow",
    name: "Dzieci sąsiadów",
    short: "Dzieci sąsiadów",
    openers: [...OPENERS, "Chwileczkę, młody człowieku.", "Gdzie są wasi rodzice?"],
    claims: [
      "Kiedyś dzieci bawiły się na trzepaku, a nie w telefonie.",
      "Piłka o tej porze? Przecież jest cisza poobiednia.",
      "Na moim trawniku się nie gra. To nie jest boisko.",
      "Rower się prowadzi po chodniku. Ja zawsze prowadziłem.",
      "Kiedyś dziecko wracało do domu, jak się zapalały latarnie.",
      "Kreda na chodniku? A kto to potem zmyje?",
      "W waszym wieku sam jeździłem do miasta po chleb.",
      "Te hulajnogi powinny mieć tablice rejestracyjne.",
      "Głośno jest. Ja nic nie mówię, ale głośno jest.",
      "Piłka wpadła do ogródka? To już jest moja piłka.",
      "Kiedyś mówiło się dzień dobry całemu blokowi.",
      "Rodzice nic nie mówią, to ja powiem.",
    ],
    closers: [...CLOSERS, "I powiedz to ojcu.", "Następnym razem piłka zostaje u mnie."],
  },
  {
    slug: "pogoda",
    name: "O pogodzie",
    short: "Pogoda",
    openers: [...OPENERS, "Wyłącz tę prognozę, ja ci powiem, jak będzie.", "Postukaj w barometr, tylko delikatnie."],
    claims: [
      "W telewizji mówią słońce, kolano mówi deszcz. Wierzę kolanu.",
      "Będzie burza, ja to czuję. I jaskółki latają nisko.",
      "Termometr za kuchennym oknem wisi od osiemdziesiątego czwartego i jeszcze się nie pomylił.",
      "Kiedyś latem było goręcej, a zimą zimniej. Teraz wszystko jest letnie.",
      "Prognozę robią w Warszawie. Skąd oni mają wiedzieć, co jest u nas na podwórku?",
      "Kiedyś bałwan pod blokiem stał do marca, a teraz nie postoi do obiadu.",
      "Kiedyś szyby zamarzały od środka i jakoś się żyło.",
      "Parasola nie noszę. Jak pada, to się staje w bramie i czeka.",
      "Kalesony zakłada się od pierwszego października. Pogoda nie ma tu nic do rzeczy.",
      "Nie patrz w telefon, tylko w niebo. Niebo się nie zawiesza.",
      "Jak wieje ze wschodu, to wieje trzy dni. Zawsze tak było.",
      "Dwadzieścia osiem stopni to nie jest upał. Upał to był w dziewięćdziesiątym czwartym.",
    ],
    closers: [...CLOSERS, "I zdejmij pranie z balkonu.", "A sweter i tak weź."],
  },
  {
    slug: "zakupy",
    name: "Na zakupach",
    short: "Zakupy",
    openers: [...OPENERS, "Pokaż no ten paragon.", "Odłóż to, w gazetce było taniej."],
    claims: [
      "Gazetkę czyta się z długopisem, jak umowę.",
      "Kostka masła w dziewięćdziesiątym dziewiątym kosztowała dwa złote. Mam to zapisane.",
      "Paragon sprawdza się przy kasie, a nie w domu. W domu jest już za późno.",
      "Kasa samoobsługowa? Niech się sama obsłuży.",
      "Ile to teraz kosztuje? Nie mów, bo mnie szlag trafi.",
      "Reklamówek się nie kupuje. Reklamówki się ma.",
      "Jak druga sztuka gratis, to bierze się cztery. To jest matematyka.",
      "Mleko bierze się z samego tyłu. Z przodu stawiają to z krótką datą.",
      "Jak otwierają drugą kasę, to się nie biegnie, tylko idzie szybkim krokiem.",
      "Czerwona cena to jeszcze nie promocja. Trzeba przeliczyć za kilogram.",
      "Żeton do wózka nosi się przy kluczach. Od dwudziestu lat ten sam.",
      "Na zakupy chodzi się wieczorem, jak przeceniają pieczywo.",
    ],
    closers: [...CLOSERS, "Paragon schowaj, na wszelki wypadek.", "Wziąłem sześć, bo była promocja."],
  },
];

/* Editions: the Polish chapters above with each edition's text laid over them. */

const EDITIONS = {
  pl: SITUATIONS,
  sl: overlayList("phrasebook.SITUATIONS", SITUATIONS, (situation) => situation.slug, sl.SITUATIONS),
} satisfies Record<Locale, Situation[]>;

/** The phrasebook in the edition's language: same chapters, slugs and lists (by index) as SITUATIONS. */
export const getSituations = (locale: Locale): Situation[] => EDITIONS[locale];
