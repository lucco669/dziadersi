import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { MUSEUM_TEXT } from "./sl/museum";
import { MUSEUM_SLUGS } from "./sl/slugs/museum";

export type ExhibitKind = "cable" | "remote" | "screws" | "box" | "charger" | "manual";
export type Exhibit = {
  slug: string;
  kind: ExhibitKind;
  code: string;
  name: string;
  subtitle: string;
  provenance: string;
  condition: string;
  location: string;
  history: string[];
  reason: string;
  nextUse: string;
  dictionarySlug: string;
  reportSlug?: string;
};
/** Fictional exhibits. Slugs and catalogue codes are stable; local collections use kind. */
export const EXHIBITS: Exhibit[] = [
  {
    slug: "kabel-nieznanego-przeznaczenia",
    kind: "cable",
    code: "IBD-M 001",
    name: "Kabel nieznanego przeznaczenia",
    subtitle: "Oba końce znane. Zastosowanie nie.",
    provenance: "Szuflada pod telewizorem",
    condition: "Kompletny, zawiązany własnym końcem",
    location: "Szuflada I · połączenia",
    history: [
      "Zachowany po urządzeniu, którego nazwy nikt już nie pamięta. Wtyczka wygląda znajomo, co uznano za wystarczający dowód wartości użytkowej.",
      "Podczas każdej przeprowadzki trafia do osobnego worka z napisem „ważne”. Worek ma niższą trwałość niż eksponat.",
    ],
    reason: "Nie wyrzucaj. Jak będzie potrzebny, to akurat takiego nie kupisz.",
    nextUse: "Po zakupie urządzenia zgodnego z nieustalonym standardem.",
    dictionarySlug: "to-sie-jeszcze-przyda",
    reportSlug: "kabel-nieznanego-przeznaczenia",
  },
  {
    slug: "pilot-bez-telewizora",
    kind: "remote",
    code: "IBD-M 002",
    name: "Pilot bez telewizora",
    subtitle: "Odbiornik odszedł. Władza została.",
    provenance: "Koszyk obok obecnego pilota",
    condition: "Baterie wyjęte, autorytet zachowany",
    location: "Szuflada II · sterowanie",
    history: [
      "Telewizor przekazano dalej, ale pilot pozostał jako rezerwa. Nie pasuje do nowego odbiornika. To nie jest zarzut wobec pilota.",
      "Przycisk głośności nosi ślady wieloletniej służby. Przycisk wyciszenia zachował stan fabryczny.",
    ],
    reason: "Pilot jest dobry. To telewizory się pozmieniały.",
    nextUse: "Po powrocie właściwego telewizora do obiegu.",
    dictionarySlug: "a-gdzie-jest-pilot",
    reportSlug: "pilot-od-telewizora",
  },
  {
    slug: "sloik-ze-srubkami",
    kind: "screws",
    code: "IBD-M 003",
    name: "Słoik ze śrubkami",
    subtitle: "Zapas do wszystkich rzeczy poza tą naprawianą.",
    provenance: "Półka po przetworach",
    condition: "Mieszane gwinty, pełna gotowość",
    location: "Szuflada III · elementy złączne",
    history: [
      "Pojemnik rozpoczął działalność jako opakowanie ogórków. Po zmianie profilu gromadzi śruby, podkładki i jeden element, którego nie wolno dotykać.",
      "Przegląd polega na wysypaniu zawartości na gazetę, wybraniu trzech podobnych śrub i wsypaniu wszystkiego z powrotem.",
    ],
    reason: "Sklep jest zamknięty, a tu masz wszystko.",
    nextUse: "Gdy potrzebna będzie śruba o dowolnym wymiarze innym niż poszukiwany.",
    dictionarySlug: "ja-nie-potrzebuje-instrukcji",
    reportSlug: "zaraz-to-naprawie",
  },
  {
    slug: "karton-po-sprzecie",
    kind: "box",
    code: "IBD-M 004",
    name: "Karton po sprzęcie",
    subtitle: "Gwarancja minęła. Karton obowiązuje.",
    provenance: "Górna półka w piwnicy",
    condition: "Oryginalny styropian, nieoryginalna zawartość",
    location: "Szuflada IV · opakowania",
    history: [
      "Zachowany na wypadek reklamacji, przeprowadzki i sytuacji, której nie sposób przewidzieć. Sprzęt został wymieniony. Sytuacja nadal może nastąpić.",
      "W środku znajduje się mniejszy karton. Ten również ma przeznaczenie ochronne.",
    ],
    reason: "Bez oryginalnego kartonu tego nie przyjmą.",
    nextUse: "Podczas przeprowadzki, która pozostaje w planach.",
    dictionarySlug: "to-sie-jeszcze-przyda",
  },
  {
    slug: "ladowarka-do-starego-telefonu",
    kind: "charger",
    code: "IBD-M 005",
    name: "Ładowarka do starego telefonu",
    subtitle: "Gotowość energetyczna bez abonenta.",
    provenance: "Torba z elektroniką",
    condition: "Przewód owinięty wokół zasilacza",
    location: "Szuflada V · zasilanie",
    history: [
      "Telefon zniknął z użytku po zmianie taryfy. Ładowarka zachowała status wyposażenia strategicznego, ponieważ „takich już nie robią”.",
      "Wtyczka nie pasuje do żadnego obecnego urządzenia. W zbiorach jest jednak druga ładowarka z taką samą wtyczką.",
    ],
    reason: "To jest porządna ładowarka, nie to co te dzisiejsze.",
    nextUse: "Po odnalezieniu telefonu w pudełku po innym telefonie.",
    dictionarySlug: "tego-juz-teraz-nie-robia",
  },
  {
    slug: "instrukcja-do-niczego",
    kind: "manual",
    code: "IBD-M 006",
    name: "Instrukcja do niczego",
    subtitle: "Urządzenia brak. Dokumentacja kompletna.",
    provenance: "Segregator „sprzęt”",
    condition: "Polski tekst zakreślony, reszta nienaruszona",
    location: "Szuflada VI · dokumentacja",
    history: [
      "Instrukcja została zachowana mimo wieloletniej deklaracji, że instrukcje nie są potrzebne. Sprzeczność uznano za pozorną: dokumentacja jest dla przyszłych pokoleń.",
      "Na ostatniej stronie zapisano numer telefonu do serwisu. Numer ma za mało cyfr.",
    ],
    reason: "Ja tego nie czytam, ale niech leży.",
    nextUse: "Przy ustalaniu, do czego służy urządzenie, którego już nie ma.",
    dictionarySlug: "ja-nie-potrzebuje-instrukcji",
  },
];
const EDITIONS = {
  pl: EXHIBITS,
  sl: overlayList("museum", EXHIBITS, (item) => item.slug, MUSEUM_TEXT).map((item) => ({
    ...item,
    slug: MUSEUM_SLUGS[item.slug],
  })),
};
export const getExhibits = (locale: Locale) => EDITIONS[locale];
export const exhibitBySlug = (slug: string, locale: Locale) => getExhibits(locale).find((item) => item.slug === slug);
