import { getSpecies, speciesBySlug } from "@/content/species";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { OG_SIZE, speciesCard } from "@/lib/og-cards";

export const alt = "Karta gatunku z Atlasu Dziadersów · Kartica vrste iz Atlasa dziadersov";
export const size = OG_SIZE;
export const contentType = "image/png";

// Each edition lists its own slugs.
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSpecies(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((species) => ({ slug: species.slug }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const species = hasLocale(lang) ? speciesBySlug(slug, lang) : undefined;
  if (!hasLocale(lang) || !species) return new Response("Nie znaleziono", { status: 404 });
  return speciesCard(species, lang);
}
