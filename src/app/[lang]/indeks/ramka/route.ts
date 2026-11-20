import { hasLocale, LOCALE_INFO, LOCALES } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { getBulletin } from "@/lib/bulletin";
import { BADGE_DISPLAY, badgeText } from "@/lib/index-badge";
import { site } from "@/lib/site";

/** Both editions are written at build time and again every hour. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The Narodowy Indeks for an iframe on another site: the badge, linked to the Index in a new tab.
 * next.config.ts lets any site frame this path (and only this one). Never indexed.
 */
export async function GET(_request: Request, { params }: RouteContext<"/[lang]/indeks/ramka">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const bulletin = await getBulletin(lang);
  const text = escape(badgeText(bulletin, lang));
  // A new address every hour, so a browser that keeps the page also fetches the new badge.
  const image = `${localizePath("/indeks/plakietka", lang)}?h=${bulletin.updated.slice(0, 13)}`;
  const html = `<!doctype html>
<html lang="${LOCALE_INFO[lang].tag}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escape(site.name)}</title>
<style>html,body{margin:0;background:#f4f0e7}a{display:block;line-height:0}img{display:block;width:100%;max-width:${BADGE_DISPLAY.width * 2}px;height:auto}a:focus-visible{outline:3px solid #c4362c;outline-offset:-3px}</style>
</head>
<body>
<a href="${site.url}${localizePath("/indeks", lang)}" target="_blank" rel="noopener"><img src="${image}" width="${BADGE_DISPLAY.width}" height="${BADGE_DISPLAY.height}" alt="${text}"></a>
</body>
</html>
`;
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
