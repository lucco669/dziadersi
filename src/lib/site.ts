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

/** The departments of the Institute, in the order of the footer. */
export const SECTIONS = [
  {
    href: "/test",
    label: "Test Dziadersa",
    summary: "Badanie okresowe w pięciu gabinetach. Wynik w procentach, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat.",
  },
  {
    href: "/atlas",
    label: "Atlas Dziadersów",
    summary: "Katalog gatunków dziadersów występujących w Polsce: objawy, siedliska, naturalni wrogowie i klucz do oznaczania.",
  },
  {
    href: "/slownik",
    label: "Słownik Dziaderski",
    summary: "Zwroty, które każdy słyszał przy rodzinnym stole: znaczenie, wymowa i przykłady użycia.",
  },
  {
    href: "/raporty",
    label: "Raporty Instytutu",
    summary: "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów Instytutu.",
  },
  {
    href: "/indeks",
    label: "Narodowy Indeks Dziaderstwa",
    summary: "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę, z prognozą na Wigilię.",
  },
  {
    href: "/spis",
    label: "Narodowy Spis Dziadersów",
    summary: "Wyniki wszystkich badań Instytutu, na żywo: gatunki, krzyżówki, najczęstsze odpowiedzi i województwa.",
  },
  {
    href: "/generator",
    label: "Rozmówki dziaderskie",
    summary: "Generator wypowiedzi na każdą okazję: samochód, remont, urlop, restauracja, komputer i dzieci sąsiadów.",
  },
  {
    href: "/bingo",
    label: "Dziaders Bingo",
    summary: "Karty bingo na wesele, Wigilię, majówkę i plażę, do skreślania na telefonie albo do druku.",
  },
] as const;
