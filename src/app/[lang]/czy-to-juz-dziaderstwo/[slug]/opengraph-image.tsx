import { caseBySlug, getCases } from "@/content/cases";
import { hasLocale } from "@/i18n/config";
import { caseCard } from "@/lib/court-cards";
import { OG_SIZE } from "@/lib/og-cards";

export const alt = "Sprawa przed Komisją Orzekającą: czy to już dziaderstwo? · Primer pred Razsodno komisijo: je to že dziaderstvo?";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Each edition's own slugs. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getCases(params.lang).map((item) => ({ slug: item.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const item = hasLocale(lang) ? caseBySlug(slug, lang) : undefined;
  if (!hasLocale(lang) || !item) return new Response("Nie znaleziono", { status: 404 });
  return caseCard(item, lang);
}
