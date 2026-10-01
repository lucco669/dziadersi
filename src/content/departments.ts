export type DepartmentStatus = "live" | "pilot" | "building" | "planned";

export const STATUS_LABEL: Record<DepartmentStatus, string> = {
  live: "Czynny",
  pilot: "Wersja próbna",
  building: "W przygotowaniu",
  planned: "Planowany",
};

export type Department = {
  name: string;
  description: string;
  status: DepartmentStatus;
  href?: string;
};

export const DEPARTMENTS: Department[] = [
  {
    name: "Test Dziadersa",
    description: "Badanie przesiewowe: wynik od 0 do 100%, rozpoznanie gatunku, certyfikat do udostępnienia.",
    status: "live",
    href: "/test",
  },
  {
    name: "Atlas Dziadersów",
    description: "Encyklopedia gatunków: siedliska, objawy, wokalizacje, naturalni wrogowie i status ochrony.",
    status: "live",
    href: "/atlas",
  },
  {
    name: "Narodowy Indeks Dziaderstwa",
    description: "Natężenie zjawiska w skali kraju, aktualizowane co godzinę.",
    status: "live",
    href: "/indeks",
  },
  {
    name: "Słownik Dziaderski",
    description: "Zwroty i formuły z objaśnieniami i przykładami użycia.",
    status: "live",
    href: "/slownik",
  },
  {
    name: "Raporty Instytutu",
    description: "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów.",
    status: "live",
    href: "/raporty",
  },
  {
    name: "Czy to już dziaderstwo?",
    description: "Opisujesz sytuację, społeczność orzeka: tak, nie albo dziaderstwo kliniczne.",
    status: "planned",
  },
  {
    name: "Generator wypowiedzi",
    description: "Wypowiedź dziadersa na każdą okazję: remont, wakacje, restauracja, komputer.",
    status: "planned",
  },
  {
    name: "Dziaders Bingo",
    description: "Plansze na wesele, Wigilię, majówkę i wyjazd nad morze.",
    status: "planned",
  },
  {
    name: "Dziaderometr",
    description: "Codzienna ankieta: oceń zachowanie w skali od 0 do 10 dziaderów.",
    status: "planned",
  },
  {
    name: "Hall of Fame",
    description: "Najlepsze anonimowe przypadki zgłoszone przez społeczność.",
    status: "planned",
  },
  {
    name: "Sklep Instytutu",
    description: "Rzeczy, które wyglądają jak dobra marka, a nie jak koszulka z bazaru.",
    status: "planned",
  },
];
