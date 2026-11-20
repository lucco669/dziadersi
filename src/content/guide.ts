import type { Locale } from "@/i18n/config";
import { overlay } from "@/i18n/overlay";
import { GUIDE_TEXT } from "./sl/guide";
import type { SpeciesKey } from "./species";

export type Guide = {
  title: string;
  /** Browser title: the wording people search with ("co to znaczy"), while the page keeps its heading. */
  metaTitle: string;
  lead: string;
  definition: string;
  context: string;
  signs: { title: string; text: string }[];
  distinction: { title: string; text: string }[];
  /** Where the word comes from and how its meaning spread. */
  origin: string[];
  /** Related and confused words: the edition explains the Polish words, which stay Polish. */
  relatives: { word: string; meaning: string; difference: string }[];
  /** Where the behaviour is observed; each place points to its Atlas species. */
  settings: { title: string; text: string; species: SpeciesKey }[];
  /** Declension and example sentences: the edition's own grammar of the word. */
  usage: {
    intro: string;
    cases: { name: string; singular: string; plural: string }[];
    examples: string[];
    note: string;
  };
  /** `href` points to the page that answers the question at length; it is data, kept from the Polish entry. */
  questions: { question: string; answer: string; href?: string }[];
};
export const GUIDE: Guide = {
  title: "Dziaders — kto to jest?",
  metaTitle: "Dziaders — co to znaczy i kto to jest? Dziaderstwo: definicja",
  lead: "Co znaczy „dziaders”, po czym rozpoznać dziaderstwo i dlaczego sam wiek nie wystarcza. Wprowadzenie do zbiorów Instytutu.",
  definition:
    "Dziaders to potoczne, zwykle krytyczne określenie osoby, która poucza innych, traktuje własne doświadczenie jako ostateczny argument i niechętnie przyjmuje, że świat mógł się zmienić. Dziaderstwo to sama ta postawa, zestaw takich nawyków; nie zależy od wieku ani płci. W naszym Atlasie przyjmuje różne postacie: od strażnika grilla po eksperta od każdego remontu.",
  context:
    "Słowo bywa używane jako docinek i zależy od kontekstu. Instytut opisuje nawyki, nie orzeka o wartości człowieka. Nasz katalog jest satyrą, a test zabawą; wynik nie stanowi diagnozy psychologicznej ani medycznej.",
  signs: [
    {
      title: "Doświadczenie zamyka rozmowę",
      text: "„Robię to od trzydziestu lat” zastępuje odpowiedź na pytanie, czy można spróbować inaczej. Czas wykonywania czynności staje się certyfikatem poprawności.",
    },
    {
      title: "Pomoc przychodzi bez zamówienia",
      text: "Szczypce, pilot albo instrukcja zostają przejęte, zanim ich użytkownik zdąży poprosić o radę. Ekspert przystępuje do pracy z pominięciem wywiadu.",
    },
    {
      title: "Dawniej stanowi jednostkę miary",
      text: "Zima, stal, samochody i sposób wychowywania dzieci są porównywane z bliżej nieokreślonym okresem wzorcowym. Okres ten zwykle zbiega się z młodością mówiącego.",
    },
    {
      title: "Opinia dostaje status regulaminu",
      text: "„Ja bym tak nie robił” zmienia się w „tak się nie robi”. Własne przyzwyczajenie zostaje opublikowane jako przepis obowiązujący wszystkich.",
    },
  ],
  distinction: [
    {
      title: "Wiek",
      text: "Starsza osoba nie staje się dziadersem przez datę urodzenia. Młodsza nie otrzymuje zwolnienia. W Atlasie liczy się zachowanie, nie metryka.",
    },
    {
      title: "Wiedza",
      text: "Umiejętność naprawy kranu jest użyteczna. Dziaderstwo zaczyna się wtedy, gdy wyklucza pytania, inne rozwiązania i prawo właściciela do wezwania fachowca.",
    },
    {
      title: "Zwykła troska",
      text: "Pytanie, czy komuś jest zimno, to troska. Ustalenie za niego, że nie jest, bo termostat pokazuje dwójkę, wymaga już obserwacji terenowej.",
    },
  ],
  origin: [
    "„Dziaders” powstał od rzeczownika „dziad” przez dodanie żartobliwej, angielsko brzmiącej końcówki „-ers”, tej samej co w „dziadkersie”. Końcówka robi z obelgi przezwisko: „dziad” po prostu obraża, „dziaders” brzmi jak ksywka z podwórka i nazywa typ zachowania, a nie wiek.",
    "Do szerokiego obiegu słowo weszło około 2020 roku, w sporach pokoleniowych prowadzonych w mediach społecznościowych i w publicystyce. Nazywano nim wtedy przede wszystkim mężczyzn z pozycją, którzy pouczają młodszych i nie dopuszczają ich do głosu. Badacze nowego słownictwa, między innymi z Obserwatorium Językowego Uniwersytetu Warszawskiego, zaliczają je do rozbudowanej rodziny wyrazów od „dziada”.",
    "Z czasem znaczenie się rozszerzyło. Dziś dziadersem bywa także wujek przy grillu, szwagier od diesla i kolega z pracy, który drukuje maile. Instytut przyjmuje to szersze znaczenie: dziaderstwo to zbiór nawyków, a nie rocznik ani płeć.",
  ],
  relatives: [
    {
      word: "dziad",
      meaning: "Potocznie i obraźliwie: starszy mężczyzna, zwłaszcza zaniedbany, skąpy albo zacofany. Dawniej także żebrak.",
      difference: "Ostrzejsze i bardziej obraźliwe. Dziad bywa wyzwiskiem, dziaders opisuje postawę.",
    },
    {
      word: "dziadek",
      meaning: "Ojciec ojca albo matki; potocznie każdy starszy pan.",
      difference: "Pokrewieństwo, nie zachowanie. Dziadek nie musi mieć w sobie nic z dziadersa.",
    },
    {
      word: "dziadostwo",
      meaning: "Potocznie: tandeta, bylejakość, rzecz zrobiona byle jak albo z najtańszych materiałów; także bieda. „Ale dziadostwo” mówi się o źle wykonanej rzeczy.",
      difference: "Dotyczy rzeczy i jakości, nie ludzi. Postawa dziadersa to dziaderstwo, nie dziadostwo.",
    },
    {
      word: "boomer",
      meaning: "Osoba z powojennego wyżu demograficznego (urodzona mniej więcej w latach 1946–1964); potocznie każdy, kto nie nadąża za nowościami, jak w „OK boomer”.",
      difference: "Wskazuje rocznik. Dziaders wskazuje sposób prowadzenia rozmowy.",
    },
    {
      word: "zgred",
      meaning: "Potocznie: zrzędliwy, marudny starszy mężczyzna.",
      difference: "Zgred narzeka. Dziaders narzeka i dodatkowo wie, jak należy.",
    },
    {
      word: "Janusz",
      meaning: "Potoczny obraz Polaka w średnim wieku: sandały ze skarpetami, saszetka, targowanie się o wszystko.",
      difference: "Janusz to wizerunek klienta i turysty. Dziaders to stosunek do cudzego zdania. Zbiory częściowo się pokrywają.",
    },
  ],
  settings: [
    {
      title: "Dziaders w pracy",
      text: "Drukuje maile, zwołuje spotkanie w sprawie spotkania i wie, że za jego czasów nikt nie pracował zdalnie. Nowe narzędzia przyjmuje po trzech szkoleniach i jednej awarii.",
      species: "korpo",
    },
    {
      title: "Dziaders w domu",
      text: "Pilnuje pilota, termostatu i ustawień telewizora. Ustawienia zna wnuczek; dziaders zna zakaz ich ruszania.",
      species: "smart",
    },
    {
      title: "Dziaders przy rodzinnym stole",
      text: "Pojawia się na Wigilii, weselu i imieninach. Komentuje ceny, potrawy i plany życiowe młodszych, najlepiej wszystkie w jednym zdaniu.",
      species: "wigilijny",
    },
    {
      title: "Dziaders w internecie",
      text: "Udostępnia, zanim usuną, pyta, kto pamięta, i podpisuje komentarze imieniem i nazwiskiem. Internet uważa za telewizję, w której można odpowiadać.",
      species: "facebook",
    },
    {
      title: "Dziaders za kierownicą",
      text: "Ocenia cudze parkowanie, zużycie paliwa i wybór pasa. Diesel jest dla niego kategorią moralną.",
      species: "moto",
    },
    {
      title: "Dziaders w kolejce",
      text: "Pilnuje, kto stał, a kto nie stał, i domaga się otwarcia drugiej kasy. W urzędzie pyta tylko o jedną rzecz, bez kolejki.",
      species: "kolejkowy",
    },
  ],
  usage: {
    intro:
      "„Dziaders” to potoczny rzeczownik rodzaju męskiego i odmienia się regularnie. Od niego pochodzą przymiotnik „dziaderski” i rzeczownik „dziaderstwo”, nazwa całego zjawiska.",
    cases: [
      { name: "Mianownik (kto?)", singular: "dziaders", plural: "dziadersi" },
      { name: "Dopełniacz (kogo?)", singular: "dziadersa", plural: "dziadersów" },
      { name: "Celownik (komu?)", singular: "dziadersowi", plural: "dziadersom" },
      { name: "Biernik (kogo?)", singular: "dziadersa", plural: "dziadersów" },
      { name: "Narzędnik (z kim?)", singular: "dziadersem", plural: "dziadersami" },
      { name: "Miejscownik (o kim?)", singular: "dziadersie", plural: "dziadersach" },
    ],
    examples: [
      "Szwagier zachowywał się przy grillu jak typowy dziaders.",
      "Nie bądź dziadersem, pozwól mu samemu ustawić telewizor.",
      "W rodzinie mamy trzech dziadersów i jedną dziaderską ciocię.",
      "Dziadersie, oddaj pilota! (wołacz)",
    ],
    note: "Słowo jest potoczne i bywa docinkiem. W tekstach Instytutu występuje wyłącznie w znaczeniu opisowym: nazywa nawyki, nie osoby.",
  },
  questions: [
    {
      question: "Co to jest dziaderstwo?",
      answer:
        "Dziaderstwo to postawa, a nie metryka: pouczanie bez pytania, traktowanie własnych przyzwyczajeń jak przepisów i przekonanie, że dawniej wszystko było lepsze. Instytut opisuje je jako zbiór nawyków, które można zauważyć u osób w każdym wieku.",
    },
    {
      question: "Skąd pochodzi słowo „dziaders”?",
      answer:
        "Powstało od „dziad” z żartobliwą, angielsko brzmiącą końcówką „-ers”. W liczbie mnogiej: dziadersi. Od niego pochodzi „dziaderstwo”, nazwa całego zjawiska.",
    },
    {
      question: "Kiedy pojawiło się słowo „dziaders”?",
      answer:
        "Do szerokiego obiegu weszło około 2020 roku, w sporach pokoleniowych w mediach społecznościowych i w publicystyce. Początkowo dotyczyło głównie mężczyzn z pozycją, którzy pouczają młodszych; dziś odnosi się do każdego, kto zamyka rozmowę własnym doświadczeniem.",
    },
    {
      question: "Co znaczy „dziadostwo”?",
      answer:
        "To inne słowo. „Dziadostwo” potocznie oznacza tandetę, bylejakość albo biedę: rzecz zrobioną byle jak lub z najtańszych materiałów. Z dziadersem łączy je tylko źródłosłów. Postawę dziadersa nazywa się dziaderstwem.",
    },
    {
      question: "Czy „dziaders” to słowo obraźliwe?",
      answer:
        "Bywa. To potoczny docinek o zabarwieniu krytycznym, łagodniejszy od „dziada”, ale wciąż oceniający. Między znajomymi uchodzi za przytyk; użyty wobec obcej osoby albo w sporze może zostać odebrany jako lekceważenie jej wieku.",
    },
    {
      href: "/dziaders/boomer",
      question: "Czym różni się dziaders od boomera?",
      answer:
        "„Boomer” to określenie pokoleniowe: pochodzi od angielskiego „baby boomer”, czyli osoby z powojennego wyżu demograficznego (urodzonej mniej więcej w latach 1946–1964), i rozpowszechniło się w odzywce „OK boomer”. „Dziaders” nie wskazuje rocznika, tylko postawę: pouczanie, nieomylność i przekonanie, że dawniej było lepiej. Boomer nie musi być dziadersem, a dziadersem można zostać przed trzydziestką.",
    },
    {
      question: "Jakie są synonimy słowa „dziaders”?",
      answer:
        "Dokładnego synonimu nie ma. Najbliżej leżą „wszystkowiedzący”, „mądrala” i „zgred”. „Boomer” bywa używany zamiennie, choć mówi o pokoleniu, a nie o zachowaniu. Słowo „dziad”, od którego pochodzi „dziaders”, jest ostrzejsze i bardziej obraźliwe.",
    },
    {
      question: "Jak jest „dziaders” po angielsku?",
      answer:
        "Nie ma jednego odpowiednika. Sens oddają opisowo „know-it-all” (wszystkowiedzący) albo „condescending old-timer”. Najbliższy potoczny odpowiednik to „boomer” w znaczeniu znanym z „OK boomer”, choć ono dotyczy pokolenia. Instytut w żadnym wydaniu nie tłumaczy tego słowa.",
    },
    {
      question: "Czy dziadersi to pokolenie?",
      answer:
        "Nie. W przeciwieństwie do pokoleń X, Y (milenialsów) czy Z dziadersów nie wyznacza rok urodzenia. Słowo najczęściej trafia do starszych osób, ale opisuje sposób prowadzenia rozmowy, a ten można przejąć w każdym wieku.",
    },
    {
      href: "/atlas",
      question: "Jak rozpoznać dziadersa?",
      answer:
        "Po zachowaniu, nie po wieku: rada udzielana bez pytania, doświadczenie jako ostateczny argument, porównania z dawnymi czasami i własne przyzwyczajenia ogłaszane jako zasady. Atlas Dziadersów opisuje gatunki z objawami i kluczem do oznaczania, a Egzamin terenowy pozwala przećwiczyć rozpoznawanie.",
    },
    {
      question: "Czy każdy tata albo dziadek jest dziadersem?",
      answer:
        "Nie. Pokrewieństwo i wiek nie opisują tych nawyków. Wspólny grill też nie wystarcza; istotne jest to, czy przy grillu pozostaje miejsce na cudze zdanie.",
    },
    {
      href: "/dziaders/kobieta",
      question: "Czy kobieta też może być dziadersem?",
      answer:
        "Tak. Słowo ma rodzaj męski i najczęściej trafia do mężczyzn, ale Atlas przedstawia kobiety i mężczyzn w różnym wieku pod wspólnymi nazwami gatunków. O klasyfikacji decydują pouczanie, przekonanie o nieomylności i odrzucanie cudzych rozwiązań, a nie płeć ani data urodzenia.",
    },
    {
      href: "/test",
      question: "Jak sprawdzić, czy sam jestem dziadersem?",
      answer:
        "Możesz wykonać satyryczny Test Dziadersa. Trwa około czterech minut, obejmuje pięć gabinetów i kończy się wynikiem oraz certyfikatem do udostępnienia.",
    },
    {
      question: "Co zrobić, kiedy rozpoznaję te zachowania u bliskiej osoby?",
      answer:
        "Rozmawiaj o konkretnej sytuacji, zamiast przyklejać etykietę. W Instytucie możesz przeczytać podobną sprawę Komisji albo zagrać w bingo z osobami, które chcą uczestniczyć.",
    },
  ],
};
const EDITIONS = { pl: GUIDE, sl: overlay(GUIDE, GUIDE_TEXT, "guide") };
export const getGuide = (locale: Locale) => EDITIONS[locale];
