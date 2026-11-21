import { speciesArtAlt, type SpecimenIndex } from "@/content/specimens";
import type { SpeciesKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { SPECIES_ART_SIZE, speciesArtPath } from "@/lib/species-art";
import { StaticArtwork } from "./static-artwork";

/**
 * The illustrated species plate on its own: SpeciesPlate's default variant, importable by client
 * components without bringing the vector pictograms (every plate in pictograms.tsx) along.
 * Its alt text says who the drawing shows and what they are doing (speciesArtAlt), in the edition's
 * language; `title` replaces it where the page needs more, such as the species' name.
 */
export function SpeciesArtwork({
  species,
  specimen,
  locale,
  eager,
  className,
  title,
  animated,
  sizes = "(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 400px",
}: {
  species: SpeciesKey;
  specimen?: SpecimenIndex;
  locale: Locale;
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
      alt={title ?? speciesArtAlt(species, specimen, locale)}
      sizes={sizes}
      className={["species-plate", animated ? "species-plate-enter" : "", className].filter(Boolean).join(" ")}
    />
  );
}
