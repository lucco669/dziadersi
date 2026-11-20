import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { sampleReading } from "@/lib/wax";
import { waxCard } from "@/lib/wax-cards";

export const alt = "Lanie wosku w Pracowni Wróżb · Vlivanje voska v Laboratoriju za vedeževanje";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // The sandal: the cast most readers recognise at once.
  return waxCard(sampleReading(1, lang), lang);
}
