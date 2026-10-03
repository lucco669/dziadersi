import type { MapRegion } from "@/components/region-map";
import type { Locale } from "@/i18n/config";
import { getRegions } from "./regions";
import { speciesByKey } from "./species";

/** Map regions with their dominant species resolved, for server components to pass to the client map. */
const mapRegions = (locale: Locale): Record<string, MapRegion> =>
  Object.fromEntries(
    Object.values(getRegions(locale)).map((region) => {
      const species = speciesByKey(region.species, locale);
      return [region.code, { ...region, speciesName: species.name, speciesSlug: species.slug }];
    }),
  );

const EDITIONS = { pl: mapRegions("pl"), sl: mapRegions("sl") } satisfies Record<Locale, Record<string, MapRegion>>;

/** The voivodeship map in the edition's language, with the edition's species names and slugs. */
export const getMapRegions = (locale: Locale): Record<string, MapRegion> => EDITIONS[locale];
