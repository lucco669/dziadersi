import { hasLocale } from "@/i18n/config";
import { wishImage } from "@/lib/wish-cards";
import { decodeWish } from "@/lib/wishes";

export const alt = "Życzenia od Instytutu · Voščila Inštituta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const IMMUTABLE = { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" };

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const card = hasLocale(lang) ? decodeWish(kod, lang) : null;
  if (!hasLocale(lang) || !card) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return wishImage(card, "og", lang, IMMUTABLE);
}
