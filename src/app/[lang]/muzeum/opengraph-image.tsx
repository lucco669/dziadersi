import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { fieldworkSectionImage } from "@/lib/fieldwork-image";
export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return fieldworkSectionImage("museum", hasLocale(lang) ? lang : DEFAULT_LOCALE);
}
