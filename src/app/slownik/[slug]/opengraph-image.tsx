import { DICTIONARY, entryBySlug } from "@/content/dictionary";
import { OG_SIZE, entryCard } from "@/lib/og-cards";

export const alt = "Hasło ze Słownika Dziaderskiego";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return DICTIONARY.map((entry) => ({ slug: entry.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const entry = entryBySlug((await params).slug);
  if (!entry) return new Response("Nie znaleziono", { status: 404 });
  return entryCard(entry);
}
