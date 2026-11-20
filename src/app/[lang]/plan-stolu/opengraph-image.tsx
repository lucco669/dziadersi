import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { samplePlan } from "@/lib/seating";
import { seatingCard } from "@/lib/seating-cards";

export const alt = "Plan stołu: protokół rozsadzenia gości · Sedežni red: zapisnik o posedanju gostov";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // The sample Wigilia, flashpoints and all.
  return seatingCard(samplePlan("wigilia", lang), lang);
}
