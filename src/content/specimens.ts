import type { SpeciesKey } from "./species";
import type { Locale } from "@/i18n/config";
import { SL_SPECIMEN_OBSERVATIONS } from "./sl/specimens";

/** Three independent people per behavioural species; no age-based progression or scoring. */
export type SpecimenIndex = 0 | 1 | 2;
export type Specimen = { index: SpecimenIndex; age: number; gender: "man" | "woman"; observation: string };
export const SPECIMENS = {
  "grill": [
    {
      "index": 0,
      "age": 65,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 33,
      "gender": "man",
      "observation": "Szczypce przejęte po pierwszym pytaniu o temperaturę."
    },
    {
      "index": 2,
      "age": 46,
      "gender": "woman",
      "observation": "Każda kiełbasa wymaga osobistego zatwierdzenia."
    }
  ],
  "parking": [
    {
      "index": 0,
      "age": 62,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 38,
      "gender": "man",
      "observation": "Miejsce kupione wyłącznie siłą przekonania."
    },
    {
      "index": 2,
      "age": 57,
      "gender": "woman",
      "observation": "Regulamin parkingu istnieje w jej pamięci."
    }
  ],
  "budowa": [
    {
      "index": 0,
      "age": 67,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 41,
      "gender": "man",
      "observation": "Po dwóch remontach wydaje opinie bez oględzin."
    },
    {
      "index": 2,
      "age": 35,
      "gender": "woman",
      "observation": "Instrukcja zostaje poprawiona przed otwarciem pudełka."
    }
  ],
  "moto": [
    {
      "index": 0,
      "age": 64,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 36,
      "gender": "man",
      "observation": "Zna usterkę po dźwięku wiadomości głosowej."
    },
    {
      "index": 2,
      "age": 44,
      "gender": "woman",
      "observation": "Przebieg służy głównie do podważania cudzych zakupów."
    }
  ],
  "wakacje": [
    {
      "index": 0,
      "age": 61,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 32,
      "gender": "man",
      "observation": "Parawan rozstawiony przed sprawdzeniem prognozy."
    },
    {
      "index": 2,
      "age": 39,
      "gender": "woman",
      "observation": "Plan odpoczynku obejmuje obowiązkową odprawę."
    }
  ],
  "facebook": [
    {
      "index": 0,
      "age": 69,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 34,
      "gender": "man",
      "observation": "Tytuł przeczytany. Dyskusja zakończona."
    },
    {
      "index": 2,
      "age": 52,
      "gender": "woman",
      "observation": "Wiadomość sprawdzona metodą: przysłała znajoma."
    }
  ],
  "smart": [
    {
      "index": 0,
      "age": 60,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 31,
      "gender": "man",
      "observation": "Zmienia wszystkim ustawienia. Dla ich wygody."
    },
    {
      "index": 2,
      "age": 43,
      "gender": "woman",
      "observation": "Dostęp administratora przyznany samodzielnie."
    }
  ],
  "dzialka": [
    {
      "index": 0,
      "age": 68,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 45,
      "gender": "man",
      "observation": "Granica działki nie zatrzymuje konsultacji."
    },
    {
      "index": 2,
      "age": 61,
      "gender": "woman",
      "observation": "Pomidor sąsiada wymaga pilnej interwencji."
    }
  ],
  "wedka": [
    {
      "index": 0,
      "age": 66,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 37,
      "gender": "man",
      "observation": "Wynik zerowy. Pewność metody stuprocentowa."
    },
    {
      "index": 2,
      "age": 48,
      "gender": "woman",
      "observation": "Ryba nie bierze z winy pozostałych uczestników."
    }
  ],
  "korpo": [
    {
      "index": 0,
      "age": 63,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 39,
      "gender": "man",
      "observation": "Nowe rozwiązanie odrzucone: w 2014 nie działało."
    },
    {
      "index": 2,
      "age": 47,
      "gender": "woman",
      "observation": "Spotkanie o spotkaniu zwołane bez konsultacji."
    }
  ],
  "zeglarz": [
    {
      "index": 0,
      "age": 70,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 42,
      "gender": "man",
      "observation": "Każdy węzeł innej osoby podlega ponownemu wiązaniu."
    },
    {
      "index": 2,
      "age": 36,
      "gender": "woman",
      "observation": "Załoga otrzymuje polecenia także na lądzie."
    }
  ],
  "grzybiarz": [
    {
      "index": 0,
      "age": 64,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 35,
      "gender": "man",
      "observation": "Miejsca odziedziczone. Dostęp do mapy zablokowany."
    },
    {
      "index": 2,
      "age": 58,
      "gender": "woman",
      "observation": "Aplikacja nie dostała zgody na wypowiedź."
    }
  ],
  "przygraniczny": [
    {
      "index": 0,
      "age": 61,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 44,
      "gender": "man",
      "observation": "Oszczędność obliczona bez kosztu dojazdu."
    },
    {
      "index": 2,
      "age": 40,
      "gender": "woman",
      "observation": "Promocja za granicą unieważnia cały plan dnia."
    }
  ],
  "oszczednosciowy": [
    {
      "index": 0,
      "age": 67,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 32,
      "gender": "man",
      "observation": "Słoik ma już zaplanowane trzy kolejne zastosowania."
    },
    {
      "index": 2,
      "age": 55,
      "gender": "woman",
      "observation": "Zakup wody wymaga pisemnego uzasadnienia."
    }
  ],
  "uzdrowiskowy": [
    {
      "index": 0,
      "age": 66,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 46,
      "gender": "man",
      "observation": "Ławka przy tężni wpisana do prywatnego harmonogramu."
    },
    {
      "index": 2,
      "age": 63,
      "gender": "woman",
      "observation": "Kolejność zabiegów skorygowana za cały turnus."
    }
  ],
  "gorski": [
    {
      "index": 0,
      "age": 65,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 34,
      "gender": "man",
      "observation": "Tempo grupy ustalone przed poznaniem grupy."
    },
    {
      "index": 2,
      "age": 41,
      "gender": "woman",
      "observation": "Mapa może służyć jako podkładka pod termos."
    }
  ],
  "festiwalowy": [
    {
      "index": 0,
      "age": 62,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 38,
      "gender": "man",
      "observation": "Najlepsza muzyka skończyła się razem z jego szkołą."
    },
    {
      "index": 2,
      "age": 49,
      "gender": "woman",
      "observation": "Playlista rodziny przechodzi obowiązkową weryfikację."
    }
  ],
  "golebiarz": [
    {
      "index": 0,
      "age": 69,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 43,
      "gender": "man",
      "observation": "Gołębnik ma pierwszeństwo przed każdym remontem."
    },
    {
      "index": 2,
      "age": 54,
      "gender": "woman",
      "observation": "Wyniki lotu omawiane do ostatniej sekundy."
    }
  ],
  "jurajski": [
    {
      "index": 0,
      "age": 72,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 40,
      "gender": "man",
      "observation": "Wspomina epoki, których nie obejmuje jego metryka."
    },
    {
      "index": 2,
      "age": 37,
      "gender": "woman",
      "observation": "Dawniej było lepiej. Także przed jej urodzeniem."
    }
  ],
  "meteorologiczny": [
    {
      "index": 0,
      "age": 64,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 36,
      "gender": "man",
      "observation": "Prognoza w telefonie wymaga zatwierdzenia kolanem."
    },
    {
      "index": 2,
      "age": 59,
      "gender": "woman",
      "observation": "Komunikat pogodowy wydany mimo braku zapytania."
    }
  ],
  "krupowkowy": [
    {
      "index": 0,
      "age": 68,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 45,
      "gender": "man",
      "observation": "Cenę oscypka porównuje z wakacjami z dzieciństwa."
    },
    {
      "index": 2,
      "age": 42,
      "gender": "woman",
      "observation": "Każdy parking ma obowiązek pamiętać dawne ceny."
    }
  ],
  "bieszczadzki": [
    {
      "index": 0,
      "age": 63,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 31,
      "gender": "man",
      "observation": "Plan wyjazdu dopracowany. Termin pozostaje ruchomy."
    },
    {
      "index": 2,
      "age": 45,
      "gender": "woman",
      "observation": "Rzuci wszystko po zakończeniu bieżących zobowiązań."
    }
  ],
  "weselny": [
    {
      "index": 0,
      "age": 66,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 35,
      "gender": "man",
      "observation": "Mikrofon przejęty poza kolejnością przemówień."
    },
    {
      "index": 2,
      "age": 51,
      "gender": "woman",
      "observation": "Harmonogram wesela wymaga jej osobistej korekty."
    }
  ],
  "wigilijny": [
    {
      "index": 0,
      "age": 65,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 43,
      "gender": "man",
      "observation": "Miejsce przy stole ustalone na podstawie tradycji."
    },
    {
      "index": 2,
      "age": 38,
      "gender": "woman",
      "observation": "Przepis rodzinny ma status dokumentu zamkniętego."
    }
  ],
  "parapetowy": [
    {
      "index": 0,
      "age": 71,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 39,
      "gender": "man",
      "observation": "Monitoring osiedla uruchomiony bez uchwały."
    },
    {
      "index": 2,
      "age": 64,
      "gender": "woman",
      "observation": "Każde wyjście sąsiadów otrzymuje komentarz."
    }
  ],
  "kolejkowy": [
    {
      "index": 0,
      "age": 62,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 32,
      "gender": "man",
      "observation": "Zasady kolejki wyjaśnia także automatowi."
    },
    {
      "index": 2,
      "age": 48,
      "gender": "woman",
      "observation": "Nieobecność w kolejce wymaga jej wcześniejszej zgody."
    }
  ],
  "kibicowski": [
    {
      "index": 0,
      "age": 64,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 37,
      "gender": "man",
      "observation": "Sędzia nie zna zasad. On zna je wszystkie."
    },
    {
      "index": 2,
      "age": 34,
      "gender": "woman",
      "observation": "Taktyka zespołu poprawiona z fotela."
    }
  ],
  "kempingowy": [
    {
      "index": 0,
      "age": 67,
      "gender": "man",
      "observation": "Okaz z kartoteki klasycznej. Własne doświadczenie uznaje za obowiązującą instrukcję."
    },
    {
      "index": 1,
      "age": 44,
      "gender": "man",
      "observation": "Przyczepa wypoziomowana. Sąsiedzi nadal wymagają korekty."
    },
    {
      "index": 2,
      "age": 56,
      "gender": "woman",
      "observation": "Cisza nocna obowiązuje według jej zegarka."
    }
  ]
} as const satisfies Record<SpeciesKey, readonly [Specimen, Specimen, Specimen]>;

export const SPECIMEN_COUNT = Object.keys(SPECIMENS).length * 3;
/** General portraits for results without a particular diagnosed species. */
export const COMMON_SPECIMENS = [{ index: 0, age: 65, gender: "man" }, { index: 1, age: 36, gender: "man" }, { index: 2, age: 40, gender: "woman" }] as const;
/** Curated defaults are independent of locale, navigation, time and render order. */
export const MAIN_SPECIMENS = {
  "grill": 1,
  "parking": 2,
  "budowa": 0,
  "moto": 2,
  "wakacje": 1,
  "facebook": 2,
  "smart": 1,
  "dzialka": 2,
  "wedka": 0,
  "korpo": 2,
  "zeglarz": 1,
  "grzybiarz": 2,
  "przygraniczny": 0,
  "oszczednosciowy": 2,
  "uzdrowiskowy": 0,
  "gorski": 1,
  "festiwalowy": 2,
  "golebiarz": 0,
  "jurajski": 1,
  "meteorologiczny": 2,
  "krupowkowy": 0,
  "bieszczadzki": 1,
  "weselny": 2,
  "wigilijny": 0,
  "parapetowy": 2,
  "kolejkowy": 1,
  "kibicowski": 2,
  "kempingowy": 1
} as const satisfies Record<SpeciesKey, SpecimenIndex>;
export const defaultSpecimen = (species: SpeciesKey): SpecimenIndex => MAIN_SPECIMENS[species];
export const getSpecimens = (species: SpeciesKey, locale: Locale): Specimen[] => SPECIMENS[species].map(person => ({ ...person, observation: locale === "sl" ? SL_SPECIMEN_OBSERVATIONS[species][person.index] : person.observation }));
export const specimenByIndex = (species: SpeciesKey, index: SpecimenIndex = defaultSpecimen(species), locale: Locale = "pl"): Specimen => getSpecimens(species, locale)[index];
