import { OG_SIZE } from "@/lib/og-cards";
import { decodeLine } from "@/lib/phrasebook";
import { lineCard } from "@/lib/toy-cards";

export const alt = "Wypowiedź z Rozmówek dziaderskich";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ kod: string }> }) {
  const line = decodeLine((await params).kod);
  if (!line) return new Response("Nie znaleziono", { status: 404 });
  // A code always says the same thing.
  return lineCard(line, { cached: true });
}
