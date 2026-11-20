import { notFound } from "next/navigation";
import { getWishChapters } from "@/content/wishes";
import { hasLocale, LOCALES } from "@/i18n/config";
import { wishImage } from "@/lib/wish-cards";
import { seededWish } from "@/lib/wishes";

export const alt = "Życzenia od Instytutu · Voščila Inštituta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return wishImage(seededWish(7, getWishChapters(lang)[0], lang), "og", lang);
}
