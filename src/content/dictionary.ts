export type Entry = {
  headword: string;
  grammar: string;
  pronunciation: string;
  senses: { text: string; figurative?: boolean }[];
  example: string;
  exampleNote?: string;
  seeAlso: string[];
};

export const DICTIONARY: Entry[] = [
  {
    headword: "to się jeszcze przyda",
    grammar: "zwrot konserwujący",
    pronunciation: "wym. stanowczo, z ręką na klamce piwnicy",
    senses: [
      { text: "Formuła uzasadniająca przechowywanie przedmiotu, który od 1997 roku nie znalazł zastosowania." },
      { text: "Deklaracja nienaruszalności piwnicy, garażu i szuflady pod telewizorem.", figurative: true },
    ],
    example: "Zostaw ten karton od telewizora, to się jeszcze przyda.",
    exampleNote: "Telewizor wyrzucono w 2011 roku.",
    seeAlso: ["za moich czasów", "ja nie potrzebuję instrukcji"],
  },
  {
    headword: "panie…",
    grammar: "wykrzyknik otwierający",
    pronunciation: "wym. z westchnieniem, po którym następuje pauza",
    senses: [
      { text: "Uniwersalny wstęp do wypowiedzi eksperckiej. Zapowiada, że kiedyś było lepiej, taniej albo z prawdziwej stali." },
    ],
    example: "Panie… to już nie ta stal.",
    seeAlso: ["za moich czasów", "ile pan za to dał?"],
  },
  {
    headword: "za moich czasów",
    grammar: "wyrażenie przyimkowe, jednostka czasu",
    pronunciation: "wym. z naciskiem na „moich”",
    senses: [
      { text: "Okres o nieustalonych granicach, w którym wszystko było tańsze, trwalsze i uczciwsze." },
      { text: "Argument kończący dyskusję, niezależnie od jej tematu.", figurative: true },
    ],
    example: "Za moich czasów bułka kosztowała dwadzieścia groszy i była większa.",
    seeAlso: ["kiedyś to były zimy", "panie…"],
  },
  {
    headword: "kiedyś to były zimy",
    grammar: "zdanie meteorologiczne",
    pronunciation: "wym. niezależnie od pory roku",
    senses: [
      { text: "Twierdzenie, że opady śniegu w latach 1979–1987 przewyższały wszystko, co nastąpiło później. Nie wymaga danych." },
    ],
    example: "Kiedyś to były zimy. Do szkoły pięć kilometrów pod górę. W obie strony.",
    seeAlso: ["za moich czasów"],
  },
  {
    headword: "ja nie potrzebuję instrukcji",
    grammar: "deklaracja kompetencji",
    pronunciation: "wym. pewnie, na chwilę przed zgubieniem śrubki",
    senses: [
      { text: "Oświadczenie poprzedzające montaż mebla, po którym jeden element zostaje „zapasowy”." },
    ],
    example: "Ja nie potrzebuję instrukcji. Te dwie śrubki są zapasowe.",
    seeAlso: ["to się jeszcze przyda", "nie ruszaj, mam to poustawiane"],
  },
  {
    headword: "ile pan za to dał?",
    grammar: "pytanie wstępne",
    pronunciation: "wym. z niedowierzaniem przygotowanym zawczasu",
    senses: [
      { text: "Otwarcie każdej rozmowy o zakupie. Każda odpowiedź jest za wysoka." },
    ],
    example: "Ile pan za to dał? Ja bym to panu załatwił za połowę.",
    seeAlso: ["panie…"],
  },
  {
    headword: "nie ruszaj, mam to poustawiane",
    grammar: "formuła ochronna",
    pronunciation: "wym. szybko, z ręką wyciągniętą w stronę pilota",
    senses: [
      { text: "Zakaz dotyczący pilota, telewizora, fotela i lusterek w samochodzie." },
    ],
    example: "Nie ruszaj tego pilota, mam to poustawiane.",
    exampleNote: "Ustawiony jest jeden kanał.",
    seeAlso: ["ja nie potrzebuję instrukcji"],
  },
];
