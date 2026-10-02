import { buildSearchIndex } from "@/lib/search-index";

/** The search index, prerendered with the site and cached like any static file. */
export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: { "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
