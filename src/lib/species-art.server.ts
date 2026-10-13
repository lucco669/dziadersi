import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SpeciesKey } from "@/content/species";
import type { SpecimenIndex } from "@/content/specimens";
import { commonArtKey, speciesArtKey } from "./species-art";

const images = new Map<string, string>();

/** Satori needs embedded PNGs; cache each local plate once per server instance, with no HTTP fetch. */
export function speciesArtDataUri(species: SpeciesKey, specimen?: SpecimenIndex): string {
  const key = speciesArtKey(species, specimen);
  return artDataUri(key);
}

export const commonArtDataUri = (specimen: SpecimenIndex) => artDataUri(commonArtKey(specimen));

function artDataUri(key: string): string {
  let image = images.get(key);
  if (!image) {
    const file = join(process.cwd(), "assets/illustrations/species", `${key}.png`);
    image = `data:image/png;base64,${readFileSync(file).toString("base64")}`;
    images.set(key, image);
  }
  return image;
}
