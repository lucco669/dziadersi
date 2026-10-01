import { REPORTS, reportBySlug } from "@/content/reports";
import { OG_SIZE, reportCard } from "@/lib/og-cards";

export const alt = "Raport Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return REPORTS.map((report) => ({ slug: report.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const report = reportBySlug((await params).slug);
  if (!report) return new Response("Nie znaleziono", { status: 404 });
  return reportCard(report);
}
