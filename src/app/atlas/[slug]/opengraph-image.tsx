import { SPECIES, speciesBySlug } from "@/content/species";
import { OG_SIZE, speciesCard } from "@/lib/og-cards";

export const alt = "Karta gatunku z Atlasu Dziadersów";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return SPECIES.map((species) => ({ slug: species.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const species = speciesBySlug((await params).slug);
  if (!species) return new Response("Nie znaleziono", { status: 404 });
  return speciesCard(species);
}
