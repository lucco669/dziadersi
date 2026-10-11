import { exhibitBySlug } from "@/content/museum";
import { hasLocale } from "@/i18n/config";
import { museumCard } from "@/lib/fieldwork-cards";

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return new Response(null, { status: 404 });
  const exhibit = exhibitBySlug(slug, lang);
  if (!exhibit) return new Response(null, { status: 404 });
  return museumCard(exhibit, lang, {
    "Content-Disposition": 'attachment; filename="' + exhibit.slug + '.png"',
    "Cache-Control": "public, max-age=86400",
    "X-Robots-Tag": "noindex",
  });
}
