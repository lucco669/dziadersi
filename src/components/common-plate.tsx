import type { SpecimenIndex } from "@/content/specimens";
import { commonArtPath, SPECIES_ART_SIZE } from "@/lib/species-art";
import { StaticArtwork } from "./static-artwork";

export function CommonPlate({ specimen = 0, className, sizes = "160px" }: { specimen?: SpecimenIndex; className?: string; sizes?: string }) {
  return <StaticArtwork src={commonArtPath(specimen)} {...SPECIES_ART_SIZE} alt="" aria-hidden="true" sizes={sizes} className={className} />;
}
