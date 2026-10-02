import { CASES, caseBySlug } from "@/content/cases";
import { caseCard } from "@/lib/court-cards";
import { OG_SIZE } from "@/lib/og-cards";

export const alt = "Sprawa przed Komisją Orzekającą: czy to już dziaderstwo?";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CASES.map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = caseBySlug((await params).slug);
  if (!item) return new Response("Nie znaleziono", { status: 404 });
  return caseCard(item);
}
