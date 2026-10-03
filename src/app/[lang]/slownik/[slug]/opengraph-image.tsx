import { entryBySlug, getDictionary } from "@/content/dictionary";
import { hasLocale } from "@/i18n/config";
import { OG_SIZE, entryCard } from "@/lib/og-cards";

export const alt = "Hasło ze Słownika Dziaderskiego · Geslo iz Dziaderskega slovarja";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getDictionary(params.lang).map((entry) => ({ slug: entry.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const entry = hasLocale(lang) ? entryBySlug(slug, lang) : undefined;
  if (!hasLocale(lang) || !entry) return new Response("Nie znaleziono", { status: 404 });
  return entryCard(entry, lang);
}
