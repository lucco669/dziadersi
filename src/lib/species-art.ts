import type { SpeciesKey } from "@/content/species";
import { defaultSpecimen, type SpecimenIndex } from "@/content/specimens";

/** Stable, edition-independent filenames. The exhaustive registry keeps new species visible in review. */
export const SPECIES_ART = {
  grill: "grill", parking: "parking", budowa: "budowa", moto: "moto",
  wakacje: "wakacje", facebook: "facebook", smart: "smart", dzialka: "dzialka",
  wedka: "wedka", korpo: "korpo", zeglarz: "zeglarz", grzybiarz: "grzybiarz",
  przygraniczny: "przygraniczny", oszczednosciowy: "oszczednosciowy",
  uzdrowiskowy: "uzdrowiskowy", gorski: "gorski", festiwalowy: "festiwalowy",
  golebiarz: "golebiarz", jurajski: "jurajski", meteorologiczny: "meteorologiczny",
  krupowkowy: "krupowkowy", bieszczadzki: "bieszczadzki", weselny: "weselny",
  wigilijny: "wigilijny", parapetowy: "parapetowy", kolejkowy: "kolejkowy",
  kibicowski: "kibicowski", kempingowy: "kempingowy",
} as const satisfies Record<SpeciesKey, string>;

export const SPECIES_ART_SIZE = { width: 1200, height: 1000 } as const;
export const commonArtKey = (specimen: SpecimenIndex = 0) => `common${specimen === 0 ? "" : `-${specimen}`}`;
export const commonArtPath = (specimen: SpecimenIndex = 0) => `/illustrations/species/${commonArtKey(specimen)}.webp`;

export const speciesArtKey = (species: SpeciesKey, specimen: SpecimenIndex = defaultSpecimen(species)) =>
  `${SPECIES_ART[species]}${specimen === 0 ? "" : `-${specimen}`}`;

export const speciesArtPath = (species: SpeciesKey, specimen?: SpecimenIndex) =>
  `/illustrations/species/${speciesArtKey(species, specimen)}.webp`;
