import { commonArtAlt, type SpecimenIndex } from "@/content/specimens";
import type { Locale } from "@/i18n/config";
import { commonArtPath, SPECIES_ART_SIZE } from "@/lib/species-art";
import { StaticArtwork } from "./static-artwork";

export function CommonPlate({ specimen = 0, locale, className, sizes = "160px" }: { specimen?: SpecimenIndex; locale: Locale; className?: string; sizes?: string }) {
  return <StaticArtwork src={commonArtPath(specimen)} {...SPECIES_ART_SIZE} alt={commonArtAlt(specimen, locale)} sizes={sizes} className={className} />;
}
