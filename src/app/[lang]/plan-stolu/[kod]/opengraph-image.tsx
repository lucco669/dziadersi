import { hasLocale } from "@/i18n/config";
import { OG_SIZE } from "@/lib/og-cards";
import { decodePlan } from "@/lib/seating";
import { seatingCard } from "@/lib/seating-cards";

export const alt = "Protokół rozsadzenia gości · Zapisnik o sedežnem redu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const plan = decodePlan(kod);
  if (!hasLocale(lang) || !plan) return new Response("Nie znaleziono", { status: 404 });
  // A code always describes the same table, in the edition's language.
  return seatingCard(plan, lang, { cached: true });
}
