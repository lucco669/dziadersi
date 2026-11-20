import { hasLocale } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { decodeReading } from "@/lib/wax";
import { waxCard } from "@/lib/wax-cards";

export const alt = "Odczyt z Pracowni Wróżb: cień odlewu z wosku · Branje Laboratorija za vedeževanje: senca voščenega odlitka";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const reading = hasLocale(lang) ? decodeReading(kod, lang) : null;
  if (!hasLocale(lang) || !reading) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing, in the edition's language.
  return waxCard(reading, lang, { cached: true });
}
