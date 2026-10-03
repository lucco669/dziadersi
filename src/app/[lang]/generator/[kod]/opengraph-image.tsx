import { hasLocale } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { decodeLine } from "@/lib/phrasebook";
import { lineCard } from "@/lib/toy-cards";

export const alt = "Wypowiedź z Rozmówek dziaderskich · Izjava iz Dziaderskega pogovornika";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const line = hasLocale(lang) ? decodeLine(kod, lang) : null;
  if (!hasLocale(lang) || !line) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return lineCard(line, lang, { cached: true });
}
