import { notFound } from "next/navigation";
import { dossierBySlug, getDossiers } from "@/content/dossiers";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { dossierImage } from "@/lib/fieldwork-image";
export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getDossiers(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((item) => ({ slug: item.slug }));
}
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const dossier = dossierBySlug(slug, locale);
  if (!dossier) notFound();
  return dossierImage(dossier, locale);
}
