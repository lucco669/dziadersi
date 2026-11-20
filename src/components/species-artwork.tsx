import type { SpecimenIndex } from "@/content/specimens";
import type { SpeciesKey } from "@/content/species";
import { SPECIES_ART_SIZE, speciesArtPath } from "@/lib/species-art";
import { StaticArtwork } from "./static-artwork";

/**
 * The illustrated species plate on its own: SpeciesPlate's default variant, importable by client
 * components without bringing the vector pictograms (every plate in pictograms.tsx) along.
 */
export function SpeciesArtwork({
  species,
  specimen,
  eager,
  className,
  title,
  animated,
  sizes = "(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 400px",
}: {
  species: SpeciesKey;
  specimen?: SpecimenIndex;
  eager?: boolean;
  className?: string;
  title?: string;
  animated?: boolean;
  sizes?: string;
}) {
  return (
    <StaticArtwork
      src={speciesArtPath(species, specimen)}
      eager={eager}
      {...SPECIES_ART_SIZE}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      sizes={sizes}
      className={["species-plate", animated ? "species-plate-enter" : "", className].filter(Boolean).join(" ")}
    />
  );
}
