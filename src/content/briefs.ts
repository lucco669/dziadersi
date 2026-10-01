export type Brief = {
  category: string;
  title: string;
  dek: string;
};

/**
 * Three run each day: items i, i + 3 and i + 6 (mod 9).
 * Ordered so that each daily trio mixes categories.
 */
export const BRIEFS: Brief[] = [
  {
    category: "Badanie",
    title: "73% badanych ojców posiada kabel, którego przeznaczenia nie zna.",
    dek: "Kolejne 19% twierdzi, że zna, ale „nie będzie teraz szukać”. Pozostali odmówili otwarcia szuflady.",
  },
  {
    category: "Badanie",
    title: "Od „zaraz to naprawię” do wezwania fachowca mijają średnio 3 lata i 2 miesiące.",
    dek: "W 41% przypadków fachowcem okazuje się szwagier.",
  },
  {
    category: "Badanie",
    title: "Każde „Panie, to jest dobry samochód” wydłuża zakupy o 11 minut.",
    dek: "Dane z parkingów marketów budowlanych, soboty w godzinach 9:00–13:00.",
  },
  {
    category: "Nowy gatunek",
    title: "Do Atlasu wpisano Dziadersa Smart-Home.",
    dek: "Kupił inteligentne żarówki, ale wyłącza je wyłącznikiem. Aplikację zainstalował wnuk, hasło jest na karteczce pod routerem.",
  },
  {
    category: "Raport",
    title: "Sandał a skarpeta. Przegląd systematyczny 412 obserwacji terenowych.",
    dek: "Wniosek główny: skarpeta jest biała. Wniosek poboczny: zawsze.",
  },
  {
    category: "Obserwacja",
    title: "Odnotowano osobnika tłumaczącego kelnerowi, jak powinien wyglądać schabowy.",
    dek: "Obserwacja trwała czternaście minut. Schabowy wystygł.",
  },
  {
    category: "Komunikat",
    title: "„Ja nie potrzebuję instrukcji” to objaw, a nie kompetencja.",
    dek: "Jeżeli po montażu zostały dwie zapasowe śrubki, prosimy o kontakt z najbliższą placówką Instytutu.",
  },
  {
    category: "Alert",
    title: "Wykryto wokalizację: „To nie jest dobry moment na kupno mieszkania”.",
    dek: "Wokalizacja występuje nieprzerwanie od 1998 roku.",
  },
  {
    category: "Komunikat",
    title: "Pilot od telewizora pozostaje w rękach najstarszego mężczyzny w 87% domów.",
    dek: "W pozostałych 13% pilot zaginął w fotelu. Poszukiwania trwają.",
  },
];

export function briefsFor(day: number) {
  return [0, 1, 2].map((k) => BRIEFS[(day + k * 3) % BRIEFS.length]);
}
