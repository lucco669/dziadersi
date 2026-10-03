import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { SITUATIONS } from "./phrasebook";
import * as SL from "./sl/institute";

/*
 * O Instytucie (/o-instytucie): the statute, the history, the organisation chart and the FAQ.
 *
 * Deadpan, but true about the site: every unit runs a real department, and every FAQ answer
 * describes how the site actually works. When a department changes, update its unit and any
 * answer that mentions it. Answers about data must agree with /prywatnosc.
 */

/** Paragraph 1 of the statute: what the Institute is for. Three or four sentences. */
export const MISSION =
  "Instytut Badań nad Dziaderstwem, zwany dalej „Instytutem”, jest niezależną placówką badawczą powołaną w celu opisywania, klasyfikowania i mierzenia dziaderstwa w Polsce. Instytut realizuje ten cel w szczególności przez badania okresowe, obserwacje terenowe, prowadzenie Atlasu i Słownika oraz publikowanie raportów i danych statystycznych. Przedmiotem badań Instytutu są nawyki, a nie osoby. Instytut działa w interesie publicznym, a zwłaszcza w interesie osób, którym odebrano szczypce.";

export type Milestone = {
  /** As printed: "27 lipca 2025", or only the month when the day is not settled: "Październik 2026". */
  date: string;
  /** Two or three short sentences, in the historic present. */
  text: string;
  /** Translator's notes (op. prev.), Slovenian edition only. */
  notes?: string[];
};

/** Mock history, oldest first. The 2026 entries match the real launch dates of the site. */
export const HISTORY: Milestone[] = [
  {
    date: "27 lipca 2025",
    text: "Podczas rodzinnego grilla na działce spór o to, kto trzyma szczypce, trwa 3 godziny i 20 minut. Jeden z uczestników zauważa, że nikt dotąd nie opisał tego zjawiska naukowo. Ustalenia zostają spisane na tekturowym talerzyku, który jest dziś protokołem nr 1 w Archiwum Instytutu.",
  },
  {
    date: "18 października 2025",
    text: "W garażu jednego z uczestników grilla zbiera się Społeczny Komitet Badań nad Dziaderstwem. Krzesło jest tam jedno, zajęte od pierwszego posiedzenia, więc pozostali członkowie obradują na stojąco. Do zbiorów Komitetu trafiają zapiski o domowych usterkach, prowadzone od 2019 roku.",
  },
  {
    date: "24 grudnia 2025",
    text: "Komitet przeprowadza badanie pilotażowe przy wigilijnym stole. Wyników nie opublikowano na prośbę rodziny, ale posłużyły do kalibracji Narodowego Indeksu Dziaderstwa. Indeks do dziś wskazuje Wigilię jako dzień najwyższego zagrożenia w roku.",
  },
  {
    date: "2 stycznia 2026",
    text: "Komitet przyjmuje statut i przekształca się w Instytut Badań nad Dziaderstwem. Statut ma 14 stron i jeden załącznik: rysunek dziadersa w szacie letniej, znany dziś jako Rys. 1.",
  },
  {
    date: "16 lutego 2026",
    text: "Pracownia Terenowa publikuje pierwszy raport Instytutu: inwentaryzację 2 847 szuflad z kablami w 1 200 gospodarstwach domowych. Przeznaczenia większości kabli nie ustalono do dziś.",
  },
  {
    date: "1 października 2026",
    text: "Instytut otwiera się dla publiczności pod adresem dziader.si. Od pierwszego dnia działają Test Dziadersa, Atlas Dziadersów, Słownik Dziaderski, Raporty Instytutu i Narodowy Indeks Dziaderstwa.",
  },
  {
    date: "2 października 2026",
    text: "Rusza Narodowy Spis Dziadersów: każde ukończone badanie zostaje policzone, anonimowo i bez imienia z certyfikatu. Spis trwa do odwołania. Tego samego dnia Instytut otwiera Profil Dziaderski i uruchamia Rozmówki dziaderskie oraz Dziaders Bingo.",
  },
  {
    date: "Październik 2026",
    text: "Powstają Komisja Orzekająca „Czy to już dziaderstwo?”, Egzamin terenowy, Mały Rocznik Statystyczny, Tablica Honorowa, Biuletyn tygodniowy i Kalendarz Instytutu. Zalogowani odwiedzający zaczynają zgłaszać obserwacje terenowe gatunków z Atlasu. Po raz pierwszy w historii Instytut przyjmuje ławników i obserwatorów spoza rodziny założycieli.",
  },
];

export type Unit = {
  name: string;
  /** Who runs the unit: a role, never a person's name. "Kierownik: wakat od 2026 r." */
  head: string;
  /** Two to four short sentences: what the unit does, then one deadpan detail. */
  text: string;
  /** The part of the site the unit runs. */
  href?: string;
};

/** The organisation chart. Each unit runs one department of the site. */
export const UNITS: Unit[] = [
  {
    name: "Zakład Diagnostyki Dziaderstwa",
    head: "Kierownik: podpis nieczytelny",
    text: "Przeprowadza badanie okresowe formularzem IBD-T2: szesnaście zadań w pięciu gabinetach, około czterech minut. Wydaje rozpoznanie gatunku, wyniki laboratoryjne i certyfikat. Przyjmuje bez skierowania, także w niedziele i święta.",
    href: "/test",
  },
  {
    name: "Pracownia Taksonomii",
    head: "Kierownik: wakat od 2026 r.",
    text: "Opisuje i klasyfikuje gatunki dziadersów występujące w Polsce, nadaje im kody i nazwy łacińskie. Prowadzi Atlas Dziadersów, klucz do oznaczania i Egzamin terenowy. Konkurs na kierownika rozpisano dwa razy. Za każdym razem kandydaci rozpoznali się w Atlasie i wycofali zgłoszenia.",
    href: "/atlas",
  },
  {
    name: "Pracownia Leksykograficzna",
    head: "Kierownik: osoba mająca ostatnie słowo",
    text: "Gromadzi zwroty słyszane przy rodzinnym stole i opracowuje je jak hasła słownikowe: znaczenie, wymowa, przykład użycia. Zwrot trafia do Słownika, jeśli padł co najmniej trzy razy podczas jednego obiadu.",
    href: "/slownik",
  },
  {
    name: "Pracownia Terenowa",
    head: "Kierownik: w terenie, na ławce",
    text: "Prowadzi badania terenowe, przeglądy systematyczne i eksperymenty, a ich wyniki publikuje w Raportach Instytutu. Obserwacje prowadzi z ławki: na tyle blisko, żeby wszystko słyszeć, i na tyle daleko, żeby się nie wtrącać.",
    href: "/raporty",
  },
  {
    name: "Ośrodek Prognoz i Ostrzeżeń",
    head: "Synoptyk dyżurny: zmiana co godzinę",
    text: "Wylicza Narodowy Indeks Dziaderstwa w skali 0–100 i aktualizuje go co godzinę. Ogłasza ostrzeżenia sezonowe, tak jak ogłasza się ostrzeżenia meteorologiczne. Prognoza szczytu w Wigilię sprawdza się od początku pomiarów.",
    href: "/indeks",
  },
  {
    name: "Dział Statystyki",
    head: "p.o. kierownika: kalkulator z baterią słoneczną",
    text: "Prowadzi Narodowy Spis Dziadersów i wydaje Mały Rocznik Statystyczny. Liczy wszystko, co da się policzyć bez imion: badania, głosy ławników, obserwacje terenowe, skreślone pola bingo i użycia klaksonu. Zestawień ze spisu nie publikuje, dopóki nie zbierze 30 badań.",
    href: "/statystyki",
  },
  {
    name: "Komisja Orzekająca",
    head: "Przewodniczący: osoba trzymająca pilota",
    text: "Rozpatruje sprawy z życia codziennego i rozstrzyga, czy to już dziaderstwo. Orzeka w trzech wariantach: „to jeszcze nie dziaderstwo”, „to już dziaderstwo” i „dziaderstwo kliniczne”. W składzie orzekającym zasiadają ławnicy, czyli odwiedzający, a opinię Komisji ujawnia się dopiero po ich głosowaniu.",
    href: "/czy-to-juz-dziaderstwo",
  },
  {
    name: "Sieć Obserwatorów Terenowych",
    head: "Koordynator: dyżur na balkonie",
    text: "Zrzesza zalogowanych odwiedzających, którzy zgłaszają obserwacje gatunków z Atlasu. Obserwatorzy pracują społecznie, w godzinach, w których i tak by patrzyli. Każdy gatunek można zgłosić raz dziennie: kolejne zgłoszenia tego samego dnia Instytut uznaje za tego samego osobnika.",
    href: "/profil",
  },
  {
    name: "Wydawnictwo Instytutu",
    head: "Redaktor naczelny: kto pierwszy wstanie",
    text: "Wydaje Kalendarz Instytutu i Biuletyn tygodniowy. Kalendarz ukazuje się codziennie o północy, biuletyn w poniedziałki rano. Kartek na zapas Wydawnictwo nie drukuje, bo kto zrywa na zapas, ten oszukuje sam siebie.",
    href: "/kalendarz",
  },
  {
    name: "Archiwum Wokalizacji",
    head: "Archiwista: słyszał wszystko dwa razy",
    text: "Przechowuje wypowiedzi dziadersów z ośmiu sytuacji, od samochodu po dzieci sąsiadów, i udostępnia je jako Rozmówki dziaderskie. Każda wypowiedź składa się z zagajenia, tezy i puenty, zawsze w tej kolejności. Na życzenie Archiwum odczytuje je na głos.",
    href: "/generator",
  },
];

/** Headline figure. `label` continues `value` as one phrase: "0 zł" + "grantów i dotacji…". */
export type Figure = { value: string; label: string };

/** Headline figures. `label` continues `value` as one phrase: "0 zł" + "grantów i dotacji…". */
export const FIGURES: Figure[] = [
  { value: "0 zł", label: "grantów i dotacji otrzymanych od dnia założenia" },
  { value: "5", label: "gabinetów diagnostycznych czynnych całą dobę" },
  {
    value: new Intl.NumberFormat("pl-PL").format(
      SITUATIONS.reduce((sum, item) => sum + item.openers.length * item.claims.length * item.closers.length, 0),
    ),
    label: "wypowiedzi w zbiorach Archiwum Wokalizacji",
  },
  { value: "3 812", label: "zszywek zużytych na protokoły" },
  { value: "0", label: "osób wpisanych do Atlasu z imienia i nazwiska" },
];

export type Question = { question: string; answer: string };

/** Frequently asked questions. In voice, but every answer must stay true about the site. */
export const FAQ: Question[] = [
  {
    question: "Czy Instytut naprawdę istnieje?",
    answer:
      "Tak, jako serwis satyryczny. Jako instytucja naukowa nie istnieje: nie ma siedziby, portierni ani wpisu do żadnego rejestru. Istnieje natomiast zjawisko, które Instytut bada. Łatwo to sprawdzić przy najbliższym grillu.",
  },
  {
    question: "Kto finansuje Instytut?",
    answer:
      "Nikt z zewnątrz. Instytut nie otrzymuje grantów ani dotacji, nie wyświetla reklam i nie sprzedaje danych. Utrzymuje się z własnych środków. Jedyny wniosek o dofinansowanie odpadł na etapie oceny formalnej, bo w rubryce „Cel badań” wpisano „żeby wreszcie oddał szczypce”.",
  },
  {
    question: "Czy dane Instytutu są prawdziwe?",
    answer:
      "Częściowo. Raporty, Atlas i Narodowy Indeks Dziaderstwa są zmyślone, choć starannie. Indeks jest modelem, a nie pomiarem: wynika z pór roku i kalendarza zagrożeń, dlatego w danej godzinie każdy widzi tę samą wartość. Prawdziwe są natomiast liczby w Narodowym Spisie Dziadersów, w Komisji Orzekającej i w Małym Roczniku Statystycznym: pokazują to, co odwiedzający naprawdę zrobili w serwisie. Za prawdziwość obserwacji terenowych odpowiadają obserwatorzy.",
  },
  {
    question: "Czy wyniki testu są przechowywane?",
    answer:
      "Wynik jest zapisany w samym linku: kod w adresie zawiera wszystkie odpowiedzi, a imię z certyfikatu dopisuje się na jego końcu. Instytut tego imienia nie przechowuje. Do Narodowego Spisu Dziadersów trafia anonimowa kopia badania: między innymi odpowiedzi, wynik, rozpoznanie i pora badania, a także województwo, jeśli ktoś je podał. Nie trafiają tam imię, adres IP ani żaden identyfikator. Wyniki osób zalogowanych zapisują się także w Profilu Dziaderskim, skąd można je usunąć pojedynczo albo razem z kontem. Szczegóły opisuje polityka prywatności.",
  },
  {
    question: "Czy można zostać wypisanym z Atlasu?",
    answer:
      "Instytut nie może nikogo wypisać z Atlasu, bo nikogo do niego nie wpisał. Atlas opisuje gatunki, czyli nawyki, i nie wymienia nikogo z imienia. Kto rozpoznał się w opisie, może zmienić nawyk: oddać szczypce albo zabrać wiadro z parkingu. Gatunki w kolekcji Profilu Dziaderskiego znikają razem z wynikami, w których je rozpoznano, albo z całym kontem.",
  },
  {
    question: "Czy dziaderstwo zależy od wieku?",
    answer:
      "Nie. Instytut bada nawyki, a nie metrykę. Szczypce można przejąć w każdym wieku, a kartkę za wycieraczką napisać jeszcze przed trzydziestką. Test Dziadersa nie pyta o datę urodzenia, tylko o to, gdzie ktoś parkuje.",
  },
  {
    question: "Jak zostać obserwatorem terenowym?",
    answer:
      "Trzeba założyć Profil Dziaderski. Wystarczy adres e-mail, bez hasła: Instytut wyśle list z przyciskiem i kodem do logowania. Zalogowany obserwator zgłasza obserwacje na stronach gatunków w Atlasie, z województwem albo bez. Zdjęć Instytut nie przyjmuje: obserwator ma patrzeć, a nie fotografować.",
  },
  {
    question: "Kto może orzekać w Komisji Orzekającej?",
    answer:
      "Każdy odwiedzający, bez logowania i bez zaświadczeń. Ławnik zapoznaje się ze stanem faktycznym i wyjaśnieniami strony, oddaje jeden głos w sprawie i dopiero wtedy poznaje opinię Komisji. Wyniki głosowań są publikowane wyłącznie zbiorczo.",
  },
];

/** The contact paragraph. No address here: the controller's email lives in `site.controller`. */
export const CONTACT =
  "Instytut przyjmuje korespondencję w sprawach naukowych, organizacyjnych i dotyczących danych osobowych. Adres do korespondencji podaje polityka prywatności. Pisma rozpatruje się w kolejności wpływu. Wiadomości napisane wielkimi literami nie są rozpatrywane szybciej, a kartki zostawione za wycieraczką nie są rozpatrywane wcale.";

/* Editions */

export type Institute = {
  MISSION: string;
  HISTORY: Milestone[];
  UNITS: Unit[];
  FIGURES: Figure[];
  FAQ: Question[];
  CONTACT: string;
};

/** Figures print their numbers the Polish way ("3 812"); an edition reprints every grouped number its own way ("3812", "12.345"). */
function reprintNumbers(value: string, locale: Locale) {
  const format = new Intl.NumberFormat(LOCALE_INFO[locale].intl);
  return value.replace(/\d{1,3}(?:\s\d{3})+/g, (digits) => format.format(Number(digits.replace(/\s/g, ""))));
}

const EDITIONS: Record<Locale, Institute> = {
  pl: { MISSION, HISTORY, UNITS, FIGURES, FAQ, CONTACT },
  sl: {
    MISSION: SL.MISSION,
    HISTORY: overlayList("institute.HISTORY", HISTORY, (milestone) => milestone.date, SL.HISTORY),
    UNITS: overlayList("institute.UNITS", UNITS, (unit) => unit.href ?? unit.name, SL.UNITS),
    FIGURES: overlayList("institute.FIGURES", FIGURES, (figure) => figure.label, SL.FIGURES).map((figure) => ({
      ...figure,
      value: reprintNumbers(figure.value, "sl"),
    })),
    // The Slovenian edition answers one more question: why it exists.
    FAQ: [...overlayList("institute.FAQ", FAQ, (item) => item.question, SL.FAQ), SL.EDITION_QUESTION],
    CONTACT: SL.CONTACT,
  },
};

/** The statute, history, organisation chart, figures, FAQ and contact paragraph of the edition. */
export const getInstitute = (locale: Locale): Institute => EDITIONS[locale];
