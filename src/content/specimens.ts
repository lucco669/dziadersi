import type { SpeciesKey } from "./species";
import type { Locale } from "@/i18n/config";
import { SL_COMMON_SCENES, SL_SPECIMEN_OBSERVATIONS, SL_SPECIMEN_SCENES } from "./sl/specimens";

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

/**
 * What each plate shows, for its alt text: one scene per species, or one per specimen where the
 * drawings differ. Present tense, so the sentence fits a man or a woman alike. Slovenian: sl/specimens.ts.
 */
export type SpecimenScene = string | readonly [string, string, string];
export const SPECIMEN_SCENES = {
  grill: "w niebieskim fartuchu stoi przy okrągłym grillu węglowym ze szczypcami w dłoni",
  parking: "z założonymi rękami pilnuje miejsca parkingowego zajętego niebieskim wiadrem; obok widać przód niebieskiego samochodu",
  budowa: "wskazuje palcem niedokończony murek z cegieł, w drugiej ręce trzyma poziomicę; u stóp leży wiertarka",
  moto: "opiera stopę o oponę niebieskiego samochodu i wskazuje na błotnik; w dłoni ma kluczyki",
  wakacje: "z rękami na biodrach stoi przy niebiesko-białym parawanie plażowym; obok leży zwinięty ręcznik",
  facebook: "siedzi na krześle ze smartfonem w dłoni i poprawia wszystkich w grupie osiedlowej",
  smart: "pochyla się nad stolikiem z routerem wi-fi i wyciąga wtyczkę z gniazdka; w drugiej ręce trzyma smartfon",
  dzialka: "podlewa pomidory z niebieskiej konewki przy drucianym płotku; obok stoi stare radio",
  wedka: "siedzi na składanym stołku z wędką; obok stoją termos i puste wiadro",
  korpo: "w marynarce, ze stosem wydruków, stoi przy małej drukarce biurowej; u stóp leży teczka",
  zeglarz: "sprawdza węzeł na linie; u stóp leżą zwój liny i drewniany pachołek cumowniczy",
  grzybiarz: "w gumowcach, z wiklinowym koszykiem grzybów i nożykiem w dłoni, zerka podejrzliwie w bok",
  przygraniczny: "porównuje dwa długie paragony; u stóp stoją dwa kanistry, obok otwarty bagażnik samochodu",
  oszczednosciowy: "upycha torby wielokrotnego użytku w niebieskiej torbie; obok stoją puste słoiki",
  uzdrowiskowy: "tanecznym krokiem stoi przy parkowej ławce, z kubeczkiem wody zdrojowej i kartą zabiegów",
  gorski: "stoi na szarym kamieniu z plecakiem i kijem do chodzenia, pouczając resztę wycieczki",
  festiwalowy: "siedzi w niebieskim fotelu z pilotem w dłoni i unosi drugą rękę, poprawiając piosenkarza w telewizji",
  golebiarz: "trzyma w dłoniach szarego gołębia pocztowego; obok stoją drewniany kosz transportowy i stary zegar gołębiarski",
  jurajski: "z uniesionym palcem stoi przy dużym skamieniałym amonicie",
  meteorologiczny: "unosi okrągły barometr, a drugą ręką trzyma się za kolano",
  krupowkowy: "w grubym wełnianym swetrze, z ciupagą w jednej ręce i oscypkiem w drugiej",
  bieszczadzki: "z dużym plecakiem i karimatą patrzy w zamyśleniu w bok, z rozłożoną mapą w dłoniach",
  weselny: [
    "z krawatem zawiązanym na czole wygłasza toast z uniesioną ręką; obok krzesło z marynarką",
    "z uniesioną ręką i kartką w drugiej wygłasza przemowę weselną; obok krzesło z marynarką",
    "z uniesioną ręką i kartką w drugiej wygłasza przemowę weselną; obok krzesło z marynarką",
  ],
  wigilijny: [
    "w świątecznym swetrze drzemie w ochrowym fotelu; obok stołek z talerzykiem i serwetką",
    "siedzi w ochrowym fotelu i wskazuje palcem plan rozsadzenia gości przy stole; obok stołek z talerzykiem",
    "siedzi w ochrowym fotelu i wskazuje palcem plan rozsadzenia gości przy stole; obok stołek z talerzykiem",
  ],
  parapetowy: "z rękami skrzyżowanymi na niebieskiej poduszce wygląda przez okno spomiędzy firanek",
  kolejkowy: [
    "z teczką pod pachą wskazuje palcem koniec kolejki",
    "uniesioną dłonią zatrzymuje kogoś, kto wpycha się do kolejki, w drugiej ręce trzyma numerek; obok słupek z taśmą",
    "uniesioną dłonią zatrzymuje kogoś, kto wpycha się do kolejki, w drugiej ręce trzyma numerek; obok słupek z taśmą",
  ],
  kibicowski: [
    "w biało-czerwonym szaliku siedzi w niebieskim fotelu z pilotem i wskazuje palcem przed siebie; u stóp leży piłka",
    "w szaliku klubowym, z pilotem w dłoni, poucza sędziego meczu w małym telewizorze",
    "w szaliku klubowym, z pilotem w dłoni, poucza sędziego meczu w małym telewizorze",
  ],
  kempingowy: [
    "z założonymi rękami siedzi na składanym krzesełku przy przyczepie kempingowej",
    "trzyma poziomicę przy małej przyczepie kempingowej",
    "trzyma poziomicę przy małej przyczepie kempingowej",
  ],
} as const satisfies Record<SpeciesKey, SpecimenScene>;

/** The general portraits (COMMON_SPECIMENS), in the same order. */
export const COMMON_SCENES = [
  "w krótkich spodenkach, ze skarpetami w sandałach, okularami na czole i saszetką przy pasku",
  "z ręką na biodrze unosi palec, by udzielić niezamówionej rady",
  "z ręką na biodrze unosi palec, by udzielić niezamówionej rady",
] as const;

const scene = (scenes: SpecimenScene, index: SpecimenIndex) => (typeof scenes === "string" ? scenes : scenes[index]);
/** "65 lat", "33 lata": the Polish plural after a number. */
const plYears = (age: number) => `${age} ${age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 12 || age % 100 > 14) ? "lata" : "lat"}`;

/** Who a plate shows and what they do: "Kobieta, 46 lat: w niebieskim fartuchu stoi…". */
function plateAlt(person: { age: number; gender: "man" | "woman" }, scenes: { pl: SpecimenScene; sl: SpecimenScene }, index: SpecimenIndex, locale: Locale) {
  const who = locale === "sl"
    ? `${person.gender === "woman" ? "Ženska" : "Moški"}, ${person.age} let`
    : `${person.gender === "woman" ? "Kobieta" : "Mężczyzna"}, ${plYears(person.age)}`;
  return `${who}: ${scene(scenes[locale], index)}.`;
}

/** The alt text of a species plate in an edition. */
export const speciesArtAlt = (species: SpeciesKey, index: SpecimenIndex = defaultSpecimen(species), locale: Locale = "pl") =>
  plateAlt(SPECIMENS[species][index], { pl: SPECIMEN_SCENES[species], sl: SL_SPECIMEN_SCENES[species] }, index, locale);

/** The alt text of a general portrait in an edition. */
export const commonArtAlt = (index: SpecimenIndex = 0, locale: Locale = "pl") =>
  plateAlt(COMMON_SPECIMENS[index], { pl: COMMON_SCENES[index], sl: SL_COMMON_SCENES[index] }, index, locale);
