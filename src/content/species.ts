export type Status = "EX" | "EW" | "CR" | "EN" | "VU" | "NT" | "LC";

export const STATUSES: { code: Status; label: string }[] = [
  { code: "EX", label: "wymarły" },
  { code: "EW", label: "wymarły na wolności" },
  { code: "CR", label: "krytycznie zagrożony" },
  { code: "EN", label: "zagrożony" },
  { code: "VU", label: "narażony" },
  { code: "NT", label: "bliski zagrożenia" },
  { code: "LC", label: "najmniejszej troski" },
];

export type Species = {
  code: string;
  name: string;
  latin: string;
  authority: string;
  status: Status;
  statusNote: string;
  teaser: string;
  habitat: string;
  activity: string;
  calls: string[];
  enemies: string;
  fieldMarks: string;
  traits: { label: string; value: number }[];
  isNew?: boolean;
};

export const SPECIES: Species[] = [
  {
    code: "DZI-01",
    name: "Dziaders Grillowy",
    latin: "Dziadersus grillensis",
    authority: "Nowak, 1989",
    status: "LC",
    statusNote: "Populacja rośnie od majówki do pierwszych przymrozków.",
    teaser: "Nie oddaje szczypiec.",
    habitat: "Ogrody, działki i balkony z widokiem na cudzy grill. Sezonowo cała Polska.",
    activity: "Przejmowanie szczypiec. Ocenianie, jak inni rozpalają.",
    calls: ["Nie tak się rozpala.", "Karkówka musi swoje odstać."],
    enemies: "Grill gazowy, rozpałka w żelu, gość, który przyniósł halloumi.",
    fieldMarks: "Fartuch z napisem. Szczypce trzymane w dłoni także z dala od rusztu.",
    traits: [
      { label: "Kontrola nad szczypcami", value: 97 },
      { label: "Nieufność wobec grilla gazowego", value: 91 },
      { label: "Gotowość do oddania rusztu", value: 6 },
    ],
  },
  {
    code: "DZI-02",
    name: "Dziaders Parkingowy",
    latin: "Dziadersus parkingus",
    authority: "Wiśniewski, 1994",
    status: "LC",
    statusNote: "Populacja stabilna, silnie terytorialna.",
    teaser: "Parkuje na dwóch miejscach, żeby nikt nie obił.",
    habitat: "Parkingi pod blokami i marketami. W niedziele także przed kościołami.",
    activity: "Zajmowanie dwóch miejsc naraz. Pilnowanie „swojego” miejsca pod blokiem.",
    calls: ["To jest moje miejsce od dziewięćdziesiątego siódmego.", "Pan tu nie stanie."],
    enemies: "Strefa płatnego parkowania, kierowca SUV-a, malowanie nowych linii.",
    fieldMarks: "Wyjeżdżając, zostawia na miejscu wiadro.",
    traits: [
      { label: "Terytorialność", value: 96 },
      { label: "Precyzja parkowania", value: 31 },
      { label: "Znajomość przepisów", value: 12 },
    ],
  },
  {
    code: "DZI-03",
    name: "Dziaders Budowlany",
    latin: "Dziadersus aedificator",
    authority: "Kamiński, 1991",
    status: "NT",
    statusNote: "Wypierany przez filmy instruktażowe w internecie.",
    teaser: "„Kto panu to tak zrobił?”",
    habitat: "Place budowy, markety budowlane, cudze remonty.",
    activity: "Komentowanie pracy fachowców. Kupowanie narzędzi „na zapas”.",
    calls: ["Kto panu to tak zrobił?", "Ja bym to inaczej poprowadził."],
    enemies: "Płyta kartonowo-gipsowa, fachowiec z kosztorysem, poziomica laserowa.",
    fieldMarks: "Ołówek stolarski za uchem, ostatnio używany w 2003 roku.",
    traits: [
      { label: "Krytyka cudzych fug", value: 93 },
      { label: "Pewność siebie przy elektryce", value: 88 },
      { label: "Kończenie rozpoczętych remontów", value: 14 },
    ],
  },
  {
    code: "DZI-04",
    name: "Dziaders Motoryzacyjny",
    latin: "Dziadersus automobilis",
    authority: "Kowalski, 1987",
    status: "LC",
    statusNote: "Lokalnie liczniejszy w okolicach stacji diagnostycznych.",
    teaser: "„Panie, tego już teraz nie robią.”",
    habitat: "Parkingi marketów budowlanych, garaże, grupy motoryzacyjne.",
    activity: "Podważanie zasadności silników poniżej dwóch litrów.",
    calls: ["Panie, tego już teraz nie robią.", "Diesel to jest diesel."],
    enemies: "Automatyczna skrzynia biegów, samochód elektryczny, system start-stop.",
    fieldMarks: "Przed zakupem kopie w opony. Brelok od samochodu, którego nie ma od 2004 roku.",
    traits: [
      { label: "Kopanie w opony przed zakupem", value: 94 },
      { label: "Nieufność wobec automatu", value: 88 },
      { label: "Tolerancja systemu start-stop", value: 4 },
    ],
  },
  {
    code: "DZI-05",
    name: "Dziaders Wakacyjny",
    latin: "Dziadersus parawanus",
    authority: "Zieliński, 1999",
    status: "LC",
    statusNote: "W lipcu migruje nad morze. Wraca z kompletem magnesów na lodówkę.",
    teaser: "Parawan, sandały, skarpety. Godzina 6:30.",
    habitat: "Pas nadmorski od Świnoujścia po Krynicę Morską. Sezonowo także Chorwacja.",
    activity: "Rozstawianie parawanu o świcie. Rezerwowanie leżaków ręcznikiem.",
    calls: ["Tu jest zajęte.", "Nad naszym morzem przynajmniej wiadomo, co się je."],
    enemies: "Zakaz parawanów, wiatr od morza, all inclusive bez schabowego.",
    fieldMarks: "Sandały ze skarpetą, saszetka na pasku, opalenizna w kształcie koszulki.",
    traits: [
      { label: "Wczesność rozstawienia parawanu", value: 95 },
      { label: "Opór wobec kremu z filtrem", value: 71 },
      { label: "Akceptacja cen gofrów", value: 7 },
    ],
  },
  {
    code: "DZI-06",
    name: "Dziaders Facebookowy",
    latin: "Dziadersus facebookensis",
    authority: "Lewandowski, 2012",
    status: "LC",
    statusNote: "Najszybciej rosnąca populacja w Atlasie.",
    teaser: "Udostępnia. Nie czyta. Komentuje wielkimi literami.",
    habitat: "Grupy lokalne, komentarze pod artykułami, łańcuszki.",
    activity: "Udostępnianie bez czytania. Pisanie wielkimi literami.",
    calls: ["UDOSTĘPNIJ, ZANIM USUNĄ!!!", "Kto pamięta?"],
    enemies: "Sprawdzanie faktów, link do źródła, wnuk tłumaczący, że to fotomontaż.",
    fieldMarks: "Zdjęcie profilowe z rybą albo z samochodem. Minimum trzy wykrzykniki.",
    traits: [
      { label: "Użycie caps locka", value: 92 },
      { label: "Wiara w łańcuszki", value: 78 },
      { label: "Czytanie artykułu przed komentarzem", value: 3 },
    ],
  },
  {
    code: "DZI-07",
    name: "Dziaders Smart-Home",
    latin: "Dziadersus technologicus",
    authority: "Wójcik, 2023",
    status: "VU",
    statusNote: "Gatunek młody, opisany w 2023 roku. Populacja zależna od wnuków.",
    teaser: "Inteligentne żarówki wyłącza wyłącznikiem.",
    habitat: "Nowe osiedla, domy jednorodzinne z bramą na pilota.",
    activity: "Kupowanie inteligentnych urządzeń i obsługiwanie ich ręcznie.",
    calls: ["Wnuczek mi to ustawił.", "Po co mi aplikacja, jak jest pstryczek?"],
    enemies: "Aktualizacja oprogramowania, hasło do Wi-Fi, weryfikacja dwuetapowa.",
    fieldMarks: "Hasło do Wi-Fi na karteczce przyklejonej pod routerem.",
    traits: [
      { label: "Liczba urządzeń smart w domu", value: 84 },
      { label: "Zależność od wnuka", value: 97 },
      { label: "Korzystanie z aplikacji", value: 9 },
    ],
    isNew: true,
  },
  {
    code: "DZI-08",
    name: "Dziaders Działkowy",
    latin: "Dziadersus hortensis",
    authority: "Szymański, 1983",
    status: "LC",
    statusNote: "Altana z 1983 roku. Plany jej rozbudowy również.",
    teaser: "Altana z 1983 roku. Plany rozbudowy też.",
    habitat: "Rodzinne ogrody działkowe. Altany z blachy i boazerii.",
    activity: "Porównywanie pomidorów. Doradzanie sąsiadom zza siatki.",
    calls: ["U mnie to już dawno zawiązane.", "Kiedyś to były pomidory."],
    enemies: "Nornica, ślimak bez skorupy, zarząd ogrodu.",
    fieldMarks: "Słomkowy kapelusz. Radio nastawione na jedną stację od 1991 roku.",
    traits: [
      { label: "Rywalizacja pomidorowa", value: 91 },
      { label: "Kontrola nad sąsiednią miedzą", value: 77 },
      { label: "Tolerancja wobec kretów", value: 2 },
    ],
  },
  {
    code: "DZI-09",
    name: "Dziaders Wędkarski",
    latin: "Dziadersus piscator",
    authority: "Dąbrowski, 1978",
    status: "NT",
    statusNote: "Ostoje znikają pod domkami letniskowymi.",
    teaser: "Wstaje o 4:00. Nie łowi nic. Wraca zadowolony.",
    habitat: "Brzegi jezior, zalewy, kanały. Zawsze „sprawdzone miejsce”.",
    activity: "Wstawanie o czwartej. Milczenie. Niełowienie.",
    calls: ["Taka była.", "Dziś nie brały."],
    enemies: "Kajakarz, ciśnienie atmosferyczne, kolega, który złowił.",
    fieldMarks: "Kamizelka z czternastoma kieszeniami, termos, brak ryby.",
    traits: [
      { label: "Wczesność pobudki", value: 96 },
      { label: "Przesada w opisie złowionej ryby", value: 88 },
      { label: "Liczba złowionych ryb", value: 4 },
    ],
  },
  {
    code: "DZI-10",
    name: "Dziaders Korporacyjny",
    latin: "Dziadersus corporatus",
    authority: "Kaczmarek, 2008",
    status: "LC",
    statusNote: "Odporny na kolejne restrukturyzacje.",
    teaser: "Drukuje maile. Mówi „zróbmy calla”.",
    habitat: "Biurowce klasy A, sale konferencyjne, biurko przy oknie.",
    activity: "Drukowanie maili. Zwoływanie spotkań, które mogły być mailem.",
    calls: ["Zróbmy calla.", "Kiedyś to się pracowało, a nie home office."],
    enemies: "Praca zdalna, komunikator firmowy, młodszy kierownik.",
    fieldMarks: "„Pozdrawiam serdecznie” w każdej wiadomości, także na czacie.",
    traits: [
      { label: "Spotkania, które mogły być mailem", value: 93 },
      { label: "Drukowanie maili", value: 86 },
      { label: "Zaufanie do chmury", value: 8 },
    ],
  },
];

export const ESTIMATED_SPECIES = 312;
