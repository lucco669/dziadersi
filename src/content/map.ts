import type { MapRegion } from "@/components/region-map";
import { REGIONS } from "./regions";
import { speciesByKey } from "./species";

/** Map regions with their dominant species resolved, for server components to pass to the client map. */
export const MAP_REGIONS: Record<string, MapRegion> = Object.fromEntries(
  Object.values(REGIONS).map((region) => {
    const species = speciesByKey(region.species);
    return [region.code, { ...region, speciesName: species.name, speciesSlug: species.slug }];
  }),
);
