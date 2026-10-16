import type { Locale } from "@/i18n/config";
import { overlay } from "@/i18n/overlay";
import { GUIDE_TEXT } from "./sl/guide";

export type Guide = {
  title: string;
  /** Browser title: the wording people search with ("co to znaczy"), while the page keeps its heading. */
  metaTitle: string;
  lead: string;
  definition: string;
  context: string;
  signs: { title: string; text: string }[];
  distinction: { title: string; text: string }[];
  questions: { question: string; answer: string }[];
};
export const GUIDE: Guide = {
  title: "Dziaders — kto to jest?",
  metaTitle: "Dziaders i dziaderstwo — co to znaczy? Definicja",
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
      question: "Czy każdy tata albo dziadek jest dziadersem?",
      answer:
        "Nie. Pokrewieństwo i wiek nie opisują tych nawyków. Wspólny grill też nie wystarcza; istotne jest to, czy przy grillu pozostaje miejsce na cudze zdanie.",
    },
    {
      question: "Czy dziaderstwo dotyczy tylko mężczyzn?",
      answer:
        "Nie. Atlas przedstawia kobiety i mężczyzn w różnym wieku pod wspólnymi nazwami gatunków. O klasyfikacji decydują pouczanie, przekonanie o nieomylności i odrzucanie cudzych rozwiązań, a nie płeć ani data urodzenia.",
    },
    {
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
