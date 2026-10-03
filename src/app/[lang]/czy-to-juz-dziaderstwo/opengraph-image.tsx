import { CASES } from "@/content/cases";
import { hasLocale, LOCALES } from "@/i18n/config";
import { commissionCard } from "@/lib/court-cards";
import { OG_SIZE } from "@/lib/og-cards";

export const alt = "Komisja Orzekająca: czy to już dziaderstwo? · Razsodna komisija: je to že dziaderstvo?";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  return commissionCard(CASES.length, lang);
}
