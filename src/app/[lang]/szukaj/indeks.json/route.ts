import { hasLocale, LOCALES } from "@/i18n/config";
import { buildSearchIndex } from "@/lib/search-index";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** The edition's search index, prerendered with the site and cached like any static file. */
export async function GET(_request: Request, { params }: RouteContext<"/[lang]/szukaj/indeks.json">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response(null, { status: 404 });
  return Response.json(buildSearchIndex(lang), {
    headers: { "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
