import { hasLocale, LOCALES } from "@/i18n/config";
import { badgePng } from "@/lib/index-badge";

/** Both editions are drawn at build time and again every hour. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** The Narodowy Indeks as a PNG badge for other sites (1200 × 450, shown at 400 × 150). */
export async function GET(_request: Request, { params }: RouteContext<"/[lang]/indeks/plakietka">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const png = await badgePng(lang);
  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "x-robots-tag": "noindex",
    },
  });
}
