export type Region = {
  code: string;
  name: string;
  value: number;
  species: string;
  note: string;
};

/** Tile-grid layout: four rows of four, roughly following geography. */
export const REGION_GRID: string[][] = [
  ["ZP", "PM", "WN", "PD"],
  ["LB", "WP", "KP", "MZ"],
  ["DS", "LD", "SK", "LU"],
  ["OP", "SL", "MA", "PK"],
];

export const REGIONS: Record<string, Region> = {
  ZP: {
    code: "ZP",
    name: "Zachodniopomorskie",
    value: 66.2,
    species: "Dziaders Wędkarski",
    note: "Wstaje o 4:00, nie łowi nic, wraca zadowolony.",
  },
  PM: {
    code: "PM",
    name: "Pomorskie",
    value: 71.8,
    species: "Dziaders Wakacyjny",
    note: "Parawan stoi od 6:30, zanim słońce zdążyło się zorientować.",
  },
  WN: {
    code: "WN",
    name: "Warmińsko-mazurskie",
    value: 64.9,
    species: "Dziaders Żeglarski",
    note: "„Pływam tu od siedemdziesiątego ósmego.” Ostatni raz pływał w siedemdziesiątym ósmym.",
  },
  PD: {
    code: "PD",
    name: "Podlaskie",
    value: 69.3,
    species: "Dziaders Grzybiarski",
    note: "Zna miejsca. Nie powie.",
  },
  LB: {
    code: "LB",
    name: "Lubuskie",
    value: 61.4,
    species: "Dziaders Przygraniczny",
    note: "Jedzie 40 km, żeby zatankować 3 grosze taniej.",
  },
  WP: {
    code: "WP",
    name: "Wielkopolskie",
    value: 68.7,
    species: "Dziaders Oszczędnościowy",
    note: "Przechowuje reklamówki w reklamówce.",
  },
  KP: {
    code: "KP",
    name: "Kujawsko-pomorskie",
    value: 63.0,
    species: "Dziaders Uzdrowiskowy",
    note: "Ciechocinek, tężnie, dancing. Więcej nie trzeba mówić.",
  },
  MZ: {
    code: "MZ",
    name: "Mazowieckie",
    value: 65.5,
    species: "Dziaders Korporacyjny",
    note: "Mówi „zróbmy calla”, a potem drukuje notatkę ze spotkania.",
  },
  DS: {
    code: "DS",
    name: "Dolnośląskie",
    value: 60.3,
    species: "Dziaders Górski",
    note: "Na Śnieżkę w sandałach. W każdym schronisku pyta, ile kosztuje herbata.",
  },
  LD: {
    code: "LD",
    name: "Łódzkie",
    value: 62.8,
    species: "Dziaders Działkowy",
    note: "Altana z 1983 roku. Plany jej rozbudowy również.",
  },
  SK: {
    code: "SK",
    name: "Świętokrzyskie",
    value: 63.6,
    species: "Dziaders Jurajski",
    note: "Pamięta czasy, gdy wszystko było lepsze. Łącznie z dinozaurami.",
  },
  LU: {
    code: "LU",
    name: "Lubelskie",
    value: 67.1,
    species: "Dziaders Meteorologiczny",
    note: "Prognozuje pogodę kolanem. Skuteczność: 54%.",
  },
  OP: {
    code: "OP",
    name: "Opolskie",
    value: 59.7,
    species: "Dziaders Festiwalowy",
    note: "Co roku ogląda festiwal, żeby się upewnić, że kiedyś piosenki były lepsze.",
  },
  SL: {
    code: "SL",
    name: "Śląskie",
    value: 70.4,
    species: "Dziaders Gołębiarz",
    note: "Gołębnik ma nowszy dach niż dom.",
  },
  MA: {
    code: "MA",
    name: "Małopolskie",
    value: 66.8,
    species: "Dziaders Krupówkowy",
    note: "Kupuje oscypka i mówi, że kiedyś był większy.",
  },
  PK: {
    code: "PK",
    name: "Podkarpackie",
    value: 73.2,
    species: "Dziaders Bieszczadzki",
    note: "Od 30 lat planuje rzucić wszystko i wyjechać w Bieszczady. Mieszka w Bieszczadach.",
  },
};

/** Class breaks for the map legend, in percent. */
export const REGION_BINS = [62, 65, 68, 71];
