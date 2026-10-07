import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { QUEUE_SL } from "./sl/queue";

export type QueueEffect = { minutes: number; advance: number; irritation: number; authority: number };
export type QueueChoice = { label: string; reply: string; effect: QueueEffect };
export type QueueEvent = {
  id: string;
  title: string;
  speaker: string;
  line: string;
  description: string;
  prop: "coat" | "window" | "paper" | "person" | "coffee";
  choices: [QueueChoice, QueueChoice, QueueChoice];
};

// This entire pool, its effects and choice order are frozen for game version 1.
// A changed pool needs a new game version and a migration for old saved decisions.
export const QUEUE_EVENTS: QueueEvent[] = [
  { id: "question", title: "Tylko jedno pytanie", speaker: "Obywatel z teczką", line: "Ja tylko zapytać.", description: "Teczka ma trzy przegródki. Każda zawiera osobną sprawę.", prop: "person", choices: [
    { label: "Proszę bardzo. Jedno pytanie.", reply: "Pytanie miało siedem podpunktów. Kolejka uznała twoją uprzejmość za zgodę na następne.", effect: { minutes: 6, advance: 0, irritation: 8, authority: 8 } },
    { label: "Pan tu nie stał!", reply: "Teczka wycofuje się na koniec. Dwie osoby kiwają głowami. Jedna sporządza notatkę.", effect: { minutes: 3, advance: 2, irritation: 16, authority: -12 } },
    { label: "Informacja jest w okienku obok.", reply: "Obywatel odkrywa instytucję informacji. Kolejka odkrywa w tobie potencjał kierowniczy.", effect: { minutes: 4, advance: 1, irritation: 0, authority: 10 } },
  ] },
  { id: "coat", title: "Obywatel płaszcz", speaker: "Głos z końca sali", line: "Ten płaszcz jest przede mną.", description: "Na krześle siedzi płaszcz. Właściciela ostatnio widziano przed remontem.", prop: "coat", choices: [
    { label: "Uznaj podmiotowość płaszcza.", reply: "Płaszcz nie protestuje. Przez następne sześć minut nie robi też niczego innego.", effect: { minutes: 6, advance: 0, irritation: -10, authority: 5 } },
    { label: "Poproś płaszcz o numer sprawy.", reply: "Płaszcz nie przedstawia dokumentów. Zostaje przeniesiony do szatni.", effect: { minutes: 3, advance: 2, irritation: 5, authority: -10 } },
    { label: "Zapytaj spokojnie, kto jest ostatni.", reply: "Po krótkiej debacie ustalono, że ostatni jest człowiek. To postęp proceduralny.", effect: { minutes: 4, advance: 1, irritation: -5, authority: 5 } },
  ] },
  { id: "window", title: "Okienko numer trzy", speaker: "Komunikat wewnętrzny", line: "Zapraszamy do okienka numer trzy.", description: "Roleta unosi się o dwanaście centymetrów. W sali budzi się nadzieja.", prop: "window", choices: [
    { label: "Przejdź z całą kolejką.", reply: "Okienko trzy przyjmuje wyłącznie skargi na okienko dwa. Wracacie bogatsi o tę wiedzę.", effect: { minutes: 6, advance: 0, irritation: 12, authority: 6 } },
    { label: "Najpierw przeczytaj tabliczkę.", reply: "Tabliczka oszczędza ci wycieczki. Dwie osoby przed tobą nadal ją odbywają.", effect: { minutes: 3, advance: 2, irritation: -4, authority: 4 } },
    { label: "Zarządź zachowanie kolejności.", reply: "Kolejność zachowano w obu kolejkach jednocześnie. Nikt nie wie jak, ale działa.", effect: { minutes: 2, advance: 2, irritation: 12, authority: -15 } },
  ] },
  { id: "copy", title: "Oryginał kopii", speaker: "Pani z okienka", line: "Potrzebna kopia. Ale oryginalna.", description: "Ksero stoi pod ścianą. Na nim kartka: „Kartka nie oznacza awarii”.", prop: "paper", choices: [
    { label: "Zrób kopię i zachowaj spokój.", reply: "Urządzenie wydaje kopię, potem kopię kopii. Wybierasz bardziej oryginalną.", effect: { minutes: 5, advance: 1, irritation: -8, authority: 4 } },
    { label: "Wskaż oryginał już w teczce.", reply: "Oryginał zostaje uznany za dostatecznie podobny do swojej kopii.", effect: { minutes: 2, advance: 2, irritation: 12, authority: -14 } },
    { label: "Poproś o pisemne wyjaśnienie.", reply: "Otrzymujesz druk wyjaśniający, dlaczego wyjaśnienia udziela się ustnie.", effect: { minutes: 6, advance: 0, irritation: 5, authority: 15 } },
  ] },
  { id: "coffee", title: "Przerwa techniczna", speaker: "Tabliczka służbowa", line: "Zaraz wracam.", description: "Obok tabliczki stygnie herbata. Nie wiadomo, czy pierwsza.", prop: "coffee", choices: [
    { label: "Usiądź. Rozluźnij ramiona.", reply: "Przez chwilę nie walczysz z administracją. Administracja też odpoczywa.", effect: { minutes: 6, advance: 0, irritation: -25, authority: 5 } },
    { label: "Sprawdź sąsiednie okienko.", reply: "Sąsiednie okienko działa. Przyjmuje nawet ten sam rodzaj człowieka.", effect: { minutes: 4, advance: 1, irritation: -5, authority: 3 } },
    { label: "Przypomnij godziny przyjęć.", reply: "Tabliczka zostaje zdjęta. Westchnienie urzędnika doliczono do czasu obsługi.", effect: { minutes: 2, advance: 2, irritation: 18, authority: -15 } },
  ] },
  { id: "return", title: "Pan tylko wyszedł", speaker: "Powracający obywatel", line: "Ja tu byłem. Pan potwierdzi.", description: "Wskazany świadek udaje, że bardzo dokładnie czyta gaśnicę.", prop: "person", choices: [
    { label: "Uwierz na słowo.", reply: "Pan wraca na miejsce. Po chwili wraca również jego szwagier.", effect: { minutes: 5, advance: -1, irritation: 8, authority: 12 } },
    { label: "Poproś świadka o potwierdzenie.", reply: "Gaśnica przestaje być interesująca. Świadek potwierdza miejsce, ale na końcu.", effect: { minutes: 4, advance: 1, irritation: 2, authority: 8 } },
    { label: "Zażądaj dowodu wcześniejszego stania.", reply: "Obywatel nie ma zaświadczenia o staniu. Po raz pierwszy to brak dokumentu pomaga tobie.", effect: { minutes: 2, advance: 2, irritation: 16, authority: -12 } },
  ] },
  { id: "ticket", title: "System numerkowy", speaker: "Automat biletowy", line: "Proszę pobrać numerek.", description: "Masz A-038. Wyświetlacz pokazuje B-004. Litera nabiera znaczenia.", prop: "paper", choices: [
    { label: "Sprawdź kategorię sprawy.", reply: "Litera A była właściwa. B oznacza bufet. Cała sala wzdycha z ulgą.", effect: { minutes: 3, advance: 1, irritation: -10, authority: 8 } },
    { label: "Weź jeszcze jeden, na zapas.", reply: "Masz już dwa numerki i dokładnie tę samą sprawę. Statystycznie jest postęp.", effect: { minutes: 5, advance: 0, irritation: 8, authority: 5 } },
    { label: "Zorganizuj kolejkę według liter.", reply: "Powstaje porządek alfabetyczny. Obywatele z literą Ą zgłaszają zastrzeżenia.", effect: { minutes: 2, advance: 2, irritation: 10, authority: -10 } },
  ] },
  { id: "pen", title: "Długopis na uwięzi", speaker: "Obywatel przy stoliku", line: "Pisze pan? To ja po panu.", description: "Jedyny długopis jest na sznurku. Sznurek ma większy zasięg niż tusz.", prop: "paper", choices: [
    { label: "Pożycz własny długopis.", reply: "Kolejka rusza. Długopis zostaje dobrem wspólnym. Odzyskanie nie jest objęte symulacją.", effect: { minutes: 3, advance: 2, irritation: 5, authority: 10 } },
    { label: "Rozpisz urzędowy długopis.", reply: "Powstaje osiem kółek. Dziewiąte okazuje się czytelnym podpisem.", effect: { minutes: 5, advance: 1, irritation: -8, authority: 3 } },
    { label: "Podyktuj skargę na brak tuszu.", reply: "Skargę przyjęto ustnie. Pisemne potwierdzenie nastąpi po dostawie tuszu.", effect: { minutes: 4, advance: 0, irritation: 12, authority: 18 } },
  ] },
  { id: "expert", title: "Ekspert miejscowy", speaker: "Pan w kamizelce", line: "Ja tu wszystko załatwiam od lat.", description: "Ekspert proponuje przejście do innego budynku. Nie podaje którego.", prop: "person", choices: [
    { label: "Wysłuchaj całej historii.", reply: "Historia zaczyna się w 1987 roku. Do teraźniejszości nie dochodzi.", effect: { minutes: 6, advance: 0, irritation: -12, authority: 8 } },
    { label: "Sprawdź wykaz spraw na ścianie.", reply: "Wykaz potwierdza właściwy budynek. Ekspert stwierdza, że właśnie to miał na myśli.", effect: { minutes: 3, advance: 1, irritation: -4, authority: 5 } },
    { label: "Powołaj się na własne doświadczenie.", reply: "Ekspert uznaje eksperta. W ramach wzajemnego uznania przepuszcza cię dalej.", effect: { minutes: 2, advance: 2, irritation: 16, authority: -12 } },
  ] },
  { id: "lunch", title: "Zapach zamknięcia", speaker: "Głos zza szyby", line: "Ostatnia sprawa przed przerwą.", description: "Z zaplecza dobiega dźwięk mikrofalówki. To nie jest sygnał dla klientów.", prop: "coffee", choices: [
    { label: "Przygotuj dokumenty w kolejności.", reply: "Sprawa przed tobą kończy się szybciej. Segregacja papieru po raz pierwszy daje rezultat.", effect: { minutes: 3, advance: 2, irritation: 5, authority: 5 } },
    { label: "Spokojnie poczekaj na powrót.", reply: "Zupa została rozpatrzona pozytywnie. Ty nadal czekasz na rozpatrzenie.", effect: { minutes: 7, advance: 0, irritation: -20, authority: 5 } },
    { label: "Zgłoś pilność swojej sprawy.", reply: "Sprawa otrzymuje status pilny. Urzędnik otrzymuje zimną zupę.", effect: { minutes: 2, advance: 2, irritation: 18, authority: -15 } },
  ] },
  { id: "form", title: "Druk w nowym wydaniu", speaker: "Pani z pieczątką", line: "Ten formularz jest już nieaktualny.", description: "Nowy formularz różni się miejscem na datę. Data pozostaje ta sama.", prop: "paper", choices: [
    { label: "Przepisz. Bez komentarza.", reply: "Data trafia trzy centymetry w lewo. Państwo może działać dalej.", effect: { minutes: 5, advance: 1, irritation: -10, authority: 4 } },
    { label: "Zapytaj o okres przejściowy.", reply: "Okres przejściowy istnieje. Właśnie przez niego przechodzisz.", effect: { minutes: 2, advance: 2, irritation: 10, authority: -12 } },
    { label: "Zabierz po trzy egzemplarze obu wersji.", reply: "Jesteś przygotowany na sześć możliwych przeszłości. Na przyszłość nadal nie.", effect: { minutes: 4, advance: 0, irritation: -5, authority: 12 } },
  ] },
  { id: "phone", title: "Rozmowa publiczna", speaker: "Telefon w kolejce", line: "NIE MOGĘ TERAZ, W URZĘDZIE JESTEM.", description: "Rozmówca szczegółowo wyjaśnia, dlaczego nie może rozmawiać.", prop: "person", choices: [
    { label: "Policz kafelki na podłodze.", reply: "Czterdzieści osiem. Dzięki temu coś dziś udało się ustalić.", effect: { minutes: 4, advance: 1, irritation: -15, authority: 3 } },
    { label: "Poproś o ściszenie głosu.", reply: "Rozmowa przechodzi w tryb półpubliczny. Kolejka docenia inicjatywę.", effect: { minutes: 3, advance: 1, irritation: -8, authority: 10 } },
    { label: "Wskaż rozmówcy wolny korytarz.", reply: "Obywatel przenosi transmisję na korytarz. Zyskujesz miejsce i ciszę, ale spojrzenie zostaje.", effect: { minutes: 2, advance: 2, irritation: 8, authority: -10 } },
  ] },
  { id: "delivery", title: "Przesyłka urzędowa", speaker: "Pan z wózkiem", line: "Tylko zostawię te pieczątki.", description: "Wózek blokuje przejście. Na kartonach napis: „Pilne, 2019”.", prop: "paper", choices: [
    { label: "Pomóż odsunąć wózek.", reply: "Droga do okienka odzyskuje drożność. Dostawa zyskuje siedem lat terminowości.", effect: { minutes: 3, advance: 2, irritation: 4, authority: 8 } },
    { label: "Poczekaj na protokół odbioru.", reply: "Protokół wymaga pieczątki, która jest w kartonie. Karton czeka na protokół.", effect: { minutes: 6, advance: 0, irritation: 10, authority: 10 } },
    { label: "Wyznacz objazd kolejki.", reply: "Powstaje tymczasowa organizacja ruchu. Po raz pierwszy wszyscy jej przestrzegają.", effect: { minutes: 2, advance: 2, irritation: 12, authority: -10 } },
  ] },
  { id: "witness", title: "Lista społeczna", speaker: "Samozwańczy sekretarz", line: "Ja tu zapisuję, żeby był porządek.", description: "Lista ma dwie strony. Obie zaczynają się od numeru jeden.", prop: "paper", choices: [
    { label: "Pomóż uzgodnić obie listy.", reply: "Połączono dwie kolejki bez powołania komisji. To się jeszcze nie zdarzyło.", effect: { minutes: 4, advance: 2, irritation: 3, authority: 10 } },
    { label: "Dopisz się na obu, dla pewności.", reply: "Oficjalnie czekasz dwa razy. Praktycznie stoisz w tym samym miejscu.", effect: { minutes: 5, advance: 0, irritation: 5, authority: 6 } },
    { label: "Uznaj wyłącznie numerki.", reply: "Sekretarz zamyka zeszyt. Kolejka wraca do państwowego systemu liczenia.", effect: { minutes: 2, advance: 2, irritation: 14, authority: -12 } },
  ] },
  { id: "draft", title: "Spór o przeciąg", speaker: "Dwie strony postępowania", line: "Zamknąć! Otworzyć!", description: "Okno dzieli salę na dwa obozy. Kolejka stoi w obu.", prop: "window", choices: [
    { label: "Zaproponuj uchylenie.", reply: "Obie strony są jednakowo niezadowolone. Instytut uznaje to za kompromis.", effect: { minutes: 3, advance: 1, irritation: -10, authority: 10 } },
    { label: "Zostań bezstronnym obserwatorem.", reply: "Spór trwa. Przynajmniej nie jesteś jego przewodniczącym.", effect: { minutes: 5, advance: 1, irritation: -15, authority: 2 } },
    { label: "Zakończ debatę regulaminem.", reply: "Regulamin nie wspomina o oknach. Nikt nie prosi o okazanie regulaminu.", effect: { minutes: 2, advance: 2, irritation: 15, authority: -14 } },
  ] },
  { id: "stamp", title: "Pieczęć wędrowna", speaker: "Urzędnik zastępujący", line: "Pieczątka jest u koleżanki.", description: "Koleżanka jest u kolegi. Kolega jest na szkoleniu z dostępności usług.", prop: "paper", choices: [
    { label: "Zapytaj o zastępczą pieczęć.", reply: "W szufladzie znajduje się pieczęć zastępująca zastępczą. Ma pełne uprawnienia.", effect: { minutes: 3, advance: 2, irritation: 4, authority: 5 } },
    { label: "Zaczekaj na powrót koleżanki.", reply: "Koleżanka wraca. Pieczątka została na szkoleniu.", effect: { minutes: 6, advance: 0, irritation: -8, authority: 8 } },
    { label: "Zażądaj ciągłości obsługi.", reply: "Ciągłość zostaje przywrócona przez mocniejsze przyciśnięcie starej pieczątki.", effect: { minutes: 2, advance: 2, irritation: 16, authority: -12 } },
  ] },
];

const EDITIONS = { pl: QUEUE_EVENTS, sl: overlayList("queue", QUEUE_EVENTS, (event) => event.id, QUEUE_SL) };
export const getQueueEvents = (locale: Locale): QueueEvent[] => EDITIONS[locale];
