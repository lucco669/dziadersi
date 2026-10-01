import type { SpeciesKey } from "./species";

export type Answer = {
  text: string;
  points: 0 | 1 | 2 | 3;
  species?: Partial<Record<SpeciesKey, number>>;
};

export type Question = {
  section: string;
  text: string;
  answers: Answer[];
};

/** Formularz IBD-T1. Order matters: result codes store answers by position. */
export const QUESTIONS: Question[] = [
  {
    section: "Motoryzacja",
    text: "Sąsiad pokazuje ci swój nowy samochód. Co mówisz?",
    answers: [
      { text: "Gratuluję!", points: 0 },
      { text: "A ile pali?", points: 1, species: { moto: 1 } },
      { text: "Ile pan za niego dał?", points: 2, species: { moto: 1 } },
      { text: "Bez słowa kopię w oponę i kiwam głową.", points: 3, species: { moto: 3 } },
    ],
  },
  {
    section: "Wypoczynek",
    text: "Pierwszy dzień urlopu nad morzem, godzina 6:30. Co robisz?",
    answers: [
      { text: "Śpię. Jest urlop.", points: 0 },
      { text: "Idę pobiegać brzegiem morza.", points: 0 },
      { text: "Szukam otwartej piekarni.", points: 1, species: { wakacje: 1 } },
      { text: "Rozstawiam parawan. O siódmej nie będzie już miejsc.", points: 3, species: { wakacje: 3 } },
    ],
  },
  {
    section: "Technika",
    text: "Składasz nową szafę z paczki. Co z instrukcją?",
    answers: [
      { text: "Czytam ją od początku do końca.", points: 0 },
      { text: "Oglądam obrazki.", points: 1, species: { budowa: 1 } },
      { text: "Ja nie potrzebuję instrukcji.", points: 2, species: { budowa: 2 } },
      { text: "Zostały dwie śrubki. To zapasowe.", points: 3, species: { budowa: 3 } },
    ],
  },
  {
    section: "Komunikacja",
    text: "Dostajesz wiadomość: „UDOSTĘPNIJ, ZANIM USUNĄ!!!”. Co robisz?",
    answers: [
      { text: "Ignoruję.", points: 0 },
      { text: "Sprawdzam, czy to prawda.", points: 0 },
      { text: "Przesyłam rodzinie. Na wszelki wypadek.", points: 2, species: { facebook: 2 } },
      { text: "Udostępniam publicznie i dopisuję trzy wykrzykniki.", points: 3, species: { facebook: 3 } },
    ],
  },
  {
    section: "Życie towarzyskie",
    text: "Grill u znajomych. Gospodarz właśnie przewraca karkówkę. Ty:",
    answers: [
      { text: "Rozmawiam z ludźmi przy stole.", points: 0 },
      { text: "Pytam, czy w czymś pomóc.", points: 0 },
      { text: "Komentuję, że za wcześnie.", points: 2, species: { grill: 2 } },
      { text: "Przejmuję szczypce. Ktoś musi.", points: 3, species: { grill: 3 } },
    ],
  },
  {
    section: "Parkowanie",
    text: "Sobota, parking pod marketem. Gdzie stajesz?",
    answers: [
      { text: "Na pierwszym wolnym miejscu.", points: 0 },
      { text: "Krążę, aż zwolni się coś przy wejściu.", points: 1 },
      { text: "Na końcu parkingu, z dala od wszystkich. Wolę dojść.", points: 2, species: { parking: 2, moto: 1 } },
      { text: "Na dwóch miejscach naraz, żeby nikt nie obił.", points: 3, species: { parking: 3 } },
    ],
  },
  {
    section: "Gospodarstwo domowe",
    text: "Czy masz w domu szufladę z kablami, których przeznaczenia nie znasz?",
    answers: [
      // Zaprzeczenie jest pierwszym objawem.
      { text: "Nie.", points: 1 },
      { text: "Tak.", points: 2, species: { dzialka: 1, budowa: 1 } },
      { text: "To się jeszcze przyda.", points: 3, species: { dzialka: 2, budowa: 1 } },
    ],
  },
  {
    section: "Motoryzacja",
    text: "Samochód elektryczny to według ciebie:",
    answers: [
      { text: "Przyszłość.", points: 0 },
      { text: "Ciekawa opcja, jak stanieje.", points: 1 },
      { text: "Spisek producentów ładowarek.", points: 2, species: { facebook: 2 } },
      { text: "Zabawka. Diesel to jest diesel.", points: 3, species: { moto: 3 } },
    ],
  },
  {
    section: "Praca",
    text: "Jak kończysz wiadomości na firmowym czacie?",
    answers: [
      { text: "Nijak. Po prostu wysyłam.", points: 0 },
      { text: "Emotikoną.", points: 0 },
      { text: "„Pozdrawiam serdecznie”.", points: 3, species: { korpo: 3 } },
      { text: "Dzwonię, żeby sprawdzić, czy wiadomość doszła.", points: 3, species: { smart: 2, korpo: 1 } },
    ],
  },
  {
    section: "Czas wolny",
    text: "Idealna sobota zaczyna się o godzinie:",
    answers: [
      { text: "11:00, od kawy w łóżku.", points: 0 },
      { text: "8:00, od śniadania.", points: 1 },
      { text: "6:00 na działce. Pomidory same się nie podleją.", points: 3, species: { dzialka: 3 } },
      { text: "4:00 nad wodą. Termos spakowany wieczorem.", points: 3, species: { wedka: 3 } },
    ],
  },
  {
    section: "Pogoda",
    text: "Za oknem pada śnieg. Twój komentarz:",
    answers: [
      { text: "Ładnie.", points: 0 },
      { text: "Znowu będą korki.", points: 1, species: { moto: 1 } },
      { text: "Kiedyś to były zimy.", points: 3 },
      { text: "To nie jest śnieg. Śnieg był w siedemdziesiątym dziewiątym.", points: 3 },
    ],
  },
  {
    section: "Wypoczynek",
    text: "Hotel all inclusive za granicą. Co jesz pierwszego dnia?",
    answers: [
      { text: "Lokalne specjały.", points: 0 },
      { text: "Wszystkiego po trochu.", points: 1 },
      { text: "Szukam czegoś, co przypomina schabowego.", points: 2, species: { wakacje: 2 } },
      { text: "Kanapki z domu. Przynajmniej wiadomo, co w nich jest.", points: 3, species: { wakacje: 3 } },
    ],
  },
  {
    section: "Technika",
    text: "Internet przestał działać. Pierwszy krok:",
    answers: [
      { text: "Restartuję router.", points: 0 },
      { text: "Dzwonię na infolinię.", points: 1 },
      { text: "Dzwonię do kogoś młodszego.", points: 2, species: { smart: 2 } },
      { text: "Wyłączam router na noc, niech odpocznie.", points: 3, species: { smart: 3 } },
    ],
  },
  {
    section: "Remont",
    text: "Fachowiec kładzie płytki w twojej łazience. Co robisz?",
    answers: [
      { text: "Robię kawę i nie przeszkadzam.", points: 0 },
      { text: "Wychodzę z domu.", points: 0 },
      { text: "Stoję w drzwiach i patrzę.", points: 2, species: { budowa: 2 } },
      { text: "Tłumaczę, jak to się robi naprawdę.", points: 3, species: { budowa: 3 } },
    ],
  },
  {
    section: "Motoryzacja",
    text: "Kiedy zmieniasz opony na zimowe?",
    answers: [
      { text: "Kiedy przypomni mi warsztat.", points: 0 },
      { text: "Nie zmieniam, mam wielosezonowe.", points: 1 },
      { text: "Przed pierwszym przymrozkiem. Zawsze.", points: 2, species: { moto: 2 } },
      { text: "Sam, w garażu, kluczem po ojcu.", points: 3, species: { moto: 2, budowa: 1 } },
    ],
  },
  {
    section: "Komunikacja",
    text: "Widzisz w internecie artykuł z tytułem, który cię denerwuje. Co robisz?",
    answers: [
      { text: "Czytam artykuł.", points: 0 },
      { text: "Zamykam kartę.", points: 0 },
      { text: "Wysyłam link rodzinie z dopiskiem „No i proszę”.", points: 2, species: { facebook: 2 } },
      { text: "Komentuję bez czytania. Wielkimi literami.", points: 3, species: { facebook: 3 } },
    ],
  },
  {
    section: "Ubiór",
    text: "Lato, zakładasz sandały. Do tego:",
    answers: [
      { text: "Nic. To są sandały.", points: 0 },
      { text: "Cienkie skarpetki. Nikt nie zauważy.", points: 2, species: { wakacje: 1 } },
      { text: "Białe skarpety frotte. Klasyka.", points: 3, species: { wakacje: 2 } },
    ],
  },
  {
    section: "Czas wolny",
    text: "Kolega opowiada, jaką rybę złowił. Twoja reakcja:",
    answers: [
      { text: "Gratuluję.", points: 0 },
      { text: "Pytam, ile ważyła.", points: 1, species: { wedka: 1 } },
      { text: "Mówię, że w tym miejscu nie biorą od lat.", points: 2, species: { wedka: 2 } },
      { text: "Rozkładam ręce: „Moja była taka”.", points: 3, species: { wedka: 3 } },
    ],
  },
  {
    section: "Praca",
    text: "Spotkanie, które mogło być mailem. Co robisz?",
    answers: [
      { text: "Proponuję, żeby następne było mailem.", points: 0 },
      { text: "Słucham i robię notatki w telefonie.", points: 1 },
      { text: "Drukuję agendę. I notatkę z poprzedniego spotkania.", points: 3, species: { korpo: 3 } },
      { text: "Zwołuję kolejne, żeby to omówić.", points: 3, species: { korpo: 2 } },
    ],
  },
  {
    section: "Kultura",
    text: "Muzyka, która leci teraz w radiu:",
    answers: [
      { text: "Słucham z przyjemnością.", points: 0 },
      { text: "Niektóre kawałki są w porządku.", points: 1 },
      { text: "Kiedyś to były piosenki.", points: 3 },
      { text: "Nie wiem. Radio mam nastawione na jedną stację od 1991 roku.", points: 3, species: { dzialka: 1 } },
    ],
  },
  {
    section: "Parkowanie",
    text: "Ktoś zajął miejsce pod blokiem, na którym parkujesz od lat. Co robisz?",
    answers: [
      { text: "Staję gdzie indziej.", points: 0 },
      { text: "Trochę się irytuję i staję gdzie indziej.", points: 1 },
      { text: "Zostawiam kartkę za wycieraczką.", points: 3, species: { parking: 2 } },
      { text: "Od jutra, wyjeżdżając, zostawiam na miejscu wiadro.", points: 3, species: { parking: 3 } },
    ],
  },
  {
    section: "Wypoczynek",
    text: "Majówka. Plan na długi weekend:",
    answers: [
      { text: "Wyjazd w góry.", points: 0 },
      { text: "Odpoczynek w domu.", points: 0 },
      { text: "Grill. Rozpalam sam, bez podpałki w żelu.", points: 3, species: { grill: 3 } },
      { text: "Działka. Otwieram altanę i sezon.", points: 3, species: { dzialka: 3, grill: 1 } },
    ],
  },
  {
    section: "Technika",
    text: "Ile masz w domu inteligentnych urządzeń, których nie umiesz obsługiwać?",
    answers: [
      { text: "Żadnego.", points: 0 },
      { text: "Jedno, ale nie przeszkadza.", points: 1, species: { smart: 1 } },
      { text: "Nie wiem. Ustawiał je ktoś z rodziny.", points: 2, species: { smart: 2 } },
      { text: "Kilka. Inteligentne żarówki wyłączam pstryczkiem.", points: 3, species: { smart: 3 } },
    ],
  },
  {
    section: "Życie rodzinne",
    text: "Wigilia. Przy stole zaczyna się rozmowa o polityce. Ty:",
    answers: [
      { text: "Zmieniam temat na pierogi.", points: 0 },
      { text: "Słucham w milczeniu.", points: 1 },
      { text: "Mówię, że za moich czasów było inaczej.", points: 3 },
      { text: "Zaczynam od słów: „Ja wam powiem, jak jest”.", points: 3, species: { facebook: 1 } },
    ],
  },
];

export type Verdict = {
  from: number;
  label: string;
  title: string;
  description: string;
  recommendations: string[];
};

export const VERDICTS: Verdict[] = [
  {
    from: 0,
    label: "śladowe",
    title: "Dziaderstwo śladowe",
    description:
      "Objawy na poziomie błędu statystycznego. Instytut nie stwierdza zagrożenia, ale zaleca czujność: pierwsze objawy pojawiają się zwykle po zakupie pierwszej wiertarki.",
    recommendations: [
      "Badanie kontrolne za pięć lat.",
      "Unikać marketów budowlanych w soboty przed dziesiątą.",
      "Nie przyjmować w prezencie fartucha do grilla.",
    ],
  },
  {
    from: 25,
    label: "umiarkowane",
    title: "Dziaderstwo umiarkowane",
    description:
      "Objawy występują sezonowo, zwykle w okolicach grilla, Wigilii i wymiany opon. Stan stabilny, rokowania dobre.",
    recommendations: [
      "Ograniczyć zwrot „za moich czasów” do jednego dziennie.",
      "Nie komentować cudzych opon bez wyraźnej prośby.",
      "Raz w miesiącu przeczytać instrukcję. Dowolną.",
    ],
  },
  {
    from: 50,
    label: "podwyższone",
    title: "Dziaderstwo podwyższone",
    description:
      "Objawy utrwalone. Osoba badana posiada co najmniej jedną szufladę, której zawartości nie wolno ruszać, i co najmniej jedną opinię o dieslu.",
    recommendations: [
      "Raz w tygodniu wyrzucić jeden przedmiot, który „się jeszcze przyda”. Pod nadzorem.",
      "Przed udostępnieniem czegokolwiek odczekać 24 godziny.",
      "Pozwolić komuś innemu przewrócić karkówkę.",
    ],
  },
  {
    from: 75,
    label: "kliniczne",
    title: "Dziaderstwo kliniczne",
    description:
      "Stan zaawansowany. Instytut potwierdza rozpoznanie i składa wyrazy uznania. Leczenie nie jest zalecane, ponieważ i tak nie przyniesie efektu.",
    recommendations: [
      "Pogodzić się z rozpoznaniem.",
      "Zamówić fartuch z napisem „Certyfikowany”.",
      "Przekazać wiedzę młodszym. Najlepiej przy stole wigilijnym.",
    ],
  },
];

/** Diagnoses for answers that point to no particular Atlas species. */
export const UNSPECIFIED = {
  latent: {
    name: "Dziaders Utajony",
    latin: "Dziadersus latens",
    authority: "Wąsik, 2026",
    description:
      "Gatunek trudny do wykrycia. Objawy są niewidoczne gołym okiem i ujawniają się zwykle po trzydziestce albo po zakupie pierwszej wiertarki.",
  },
  common: {
    name: "Dziaders Pospolity",
    latin: "Dziadersus vulgaris",
    authority: "Linneusz, 1758",
    description:
      "Postać klasyczna, bez specjalizacji. Objawy rozłożone równomiernie na wszystkie dziedziny życia: od pogody po politykę.",
  },
};
