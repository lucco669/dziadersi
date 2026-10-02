export const site = {
  name: "DZIADER.SI",
  institute: "Instytut Badań nad Dziaderstwem",
  founded: 2026,
  /** The day the site went public. */
  launched: "2026-10-01",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dziader.si",
  tagline: "Zbadaj się, zanim będzie za późno.",
  description:
    "Instytut Badań nad Dziaderstwem: Test Dziadersa z certyfikatem, Atlas Dziadersów, Słownik Dziaderski i Narodowy Indeks Dziaderstwa. Serwis satyryczny.",
  disclaimer: "Serwis satyryczny. Wszystkie dane są zmyślone, a mimo to się zgadzają. Instytut wyśmiewa nawyki, nie ludzi.",
  /** The data controller named in the privacy policy. Fill in before accounts go live. */
  controller: { name: "", email: "" },
  privacyDate: "2 października 2026",
} as const;

export type GroupKey = "badania" | "zbiory" | "dane" | "pomoce";

/** How the departments are grouped in the menu, like the Institute's organisational chart. */
export const GROUPS: { key: GroupKey; label: string; short: string; note: string }[] = [
  { key: "badania", label: "Badania", short: "Badania", note: "Diagnostyka i orzecznictwo" },
  { key: "zbiory", label: "Zbiory", short: "Zbiory", note: "Katalogi i publikacje" },
  { key: "dane", label: "Dane", short: "Dane", note: "Statystyka publiczna" },
  { key: "pomoce", label: "Pomoce naukowe", short: "Pomoce", note: "Do użytku przy stole" },
];

export type Department = {
  href: string;
  label: string;
  /** In the mobile menu row. */
  short: string;
  group: GroupKey;
  summary: string;
  isNew?: boolean;
};

/** The departments of the Institute, in the order of the footer and the menu. */
export const SECTIONS: Department[] = [
  {
    href: "/test",
    label: "Test Dziadersa",
    short: "Test",
    group: "badania",
    summary: "Badanie okresowe w pięciu gabinetach. Wynik w procentach, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat.",
  },
  {
    href: "/egzamin",
    label: "Egzamin terenowy",
    short: "Egzamin",
    group: "badania",
    summary: "Dwanaście pytań z oznaczania gatunków: wokalizacje, ryciny, siedliska. Ocena od niedostatecznej do celującej.",
    isNew: true,
  },
  {
    href: "/czy-to-juz-dziaderstwo",
    label: "Komisja Orzekająca",
    short: "Komisja",
    group: "badania",
    summary: "Czy to już dziaderstwo? Sprawy z życia wzięte, głosy ławników i uzasadnienie Komisji.",
    isNew: true,
  },
  {
    href: "/atlas",
    label: "Atlas Dziadersów",
    short: "Atlas",
    group: "zbiory",
    summary: "Katalog gatunków dziadersów występujących w Polsce: objawy, siedliska, naturalni wrogowie i klucz do oznaczania.",
  },
  {
    href: "/slownik",
    label: "Słownik Dziaderski",
    short: "Słownik",
    group: "zbiory",
    summary: "Zwroty, które każdy słyszał przy rodzinnym stole: znaczenie, wymowa i przykłady użycia.",
  },
  {
    href: "/raporty",
    label: "Raporty Instytutu",
    short: "Raporty",
    group: "zbiory",
    summary: "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów Instytutu.",
  },
  {
    href: "/biuletyn",
    label: "Biuletyn tygodniowy",
    short: "Biuletyn",
    group: "zbiory",
    summary: "Tydzień w liczbach: badania, obserwacje, sprawa tygodnia i prognoza. Co poniedziałek na stronie, a po zapisaniu także e-mailem.",
    isNew: true,
  },
  {
    href: "/indeks",
    label: "Narodowy Indeks Dziaderstwa",
    short: "Indeks",
    group: "dane",
    summary: "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę, z prognozą na Wigilię.",
  },
  {
    href: "/spis",
    label: "Narodowy Spis Dziadersów",
    short: "Spis",
    group: "dane",
    summary: "Wyniki wszystkich badań Instytutu, na żywo: gatunki, krzyżówki, najczęstsze odpowiedzi i województwa.",
  },
  {
    href: "/statystyki",
    label: "Mały Rocznik Statystyczny",
    short: "Rocznik",
    group: "dane",
    summary: "Wszystko, co policzył Instytut: badania, obserwacje, orzeczenia, skreślenia w bingo i trąbienia klaksonem.",
    isNew: true,
  },
  {
    href: "/obserwacje",
    label: "Mapa obserwacji",
    short: "Mapa",
    group: "dane",
    summary: "Gdzie widziano dziadersa: zgłoszenia obserwatorów terenowych według województw, z podziałem na gatunki.",
    isNew: true,
  },
  {
    href: "/tablica-honorowa",
    label: "Tablica Honorowa",
    short: "Tablica",
    group: "dane",
    summary: "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Sprawy, które podzieliły naród, i gatunki najlepiej obserwowane.",
    isNew: true,
  },
  {
    href: "/generator",
    label: "Rozmówki dziaderskie",
    short: "Rozmówki",
    group: "pomoce",
    summary: "Generator wypowiedzi na każdą okazję: samochód, remont, urlop, restauracja, komputer, pogoda, zakupy i dzieci sąsiadów.",
  },
  {
    href: "/bingo",
    label: "Dziaders Bingo",
    short: "Bingo",
    group: "pomoce",
    summary: "Karty bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę, do skreślania na telefonie albo do druku.",
  },
  {
    href: "/kalendarz",
    label: "Kartka z kalendarza",
    short: "Kalendarz",
    group: "pomoce",
    summary: "Codziennie nowa kartka: wschód słońca, przysłowie, porada i patron dnia. Zrywać rano, najlepiej przy herbacie.",
    isNew: true,
  },
];

/** Pages outside the departments, for search and the bottom of the menu. */
export const EXTRA_PAGES: Pick<Department, "href" | "label" | "summary">[] = [
  { href: "/profil", label: "Profil Dziaderski", summary: "Kartoteka badań, kolekcja gatunków, dziennik obserwacji, zakładki, odznaki i legitymacja obserwatora." },
  { href: "/szukaj", label: "Wyszukiwarka", summary: "Gatunki, hasła, sprawy, raporty i działy Instytutu w jednym miejscu." },
  { href: "/o-instytucie", label: "O Instytucie", summary: "Statut, historia, struktura organizacyjna i najczęstsze pytania." },
  { href: "/regulamin", label: "Regulamin", summary: "Zasady korzystania z serwisu, kont, obserwacji i Komisji Orzekającej." },
  { href: "/prywatnosc", label: "Polityka prywatności", summary: "Jakie dane zbiera Instytut, po co, jak długo je trzyma i jak je usunąć." },
];
