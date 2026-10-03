import { getReports, reportBySlug } from "@/content/reports";
import { hasLocale } from "@/i18n/config";
import { OG_SIZE, reportCard } from "@/lib/og-cards";

export const alt = "Raport Instytutu Badań nad Dziaderstwem · Poročilo Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getReports(params.lang).map((report) => ({ slug: report.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const report = hasLocale(lang) ? reportBySlug(slug, lang) : undefined;
  if (!hasLocale(lang) || !report) return new Response("Nie znaleziono", { status: 404 });
  return reportCard(report, lang);
}
