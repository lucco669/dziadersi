import type { NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { groupCardImage } from "@/lib/group-card";
import { loadGroup } from "@/lib/group";

const COPY = defineCopy({
  pl: { file: "ranking-dziaderstwa" },
  sl: { file: "lestvica-dziaderstva" },
});

/** The ranking as an upright PNG (1080 × 1350) for a chat; ?pobierz forces a download. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/grupa/[lista]/karta">) {
  const { lang, lista } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const group = loadGroup(lista, lang);
  if (!group) return new Response("Nie znaleziono", { status: 404 });
  const headers: Record<string, string> = {
    // A list always renders the same card.
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
    // Names travel in the URL; keep the picture out of search results like the ranking page.
    "x-robots-tag": "noindex, nofollow",
  };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${COPY[lang].file}-${group.members.length}.png"`;
  }
  return groupCardImage(group.members, lang, headers);
}
