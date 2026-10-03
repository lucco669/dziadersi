import type { NextConfig } from "next";
import { SEGMENTS, slovenianRewrites } from "./src/i18n/segments";

const isDev = process.env.NODE_ENV === "development";
// The Vercel Toolbar on preview deployments loads from vercel.live.
const toolbar = process.env.VERCEL_ENV === "preview";

/**
 * Pages are prerendered, so scripts can't carry a per-request nonce:
 * inline scripts (the React payload) stay allowed, everything else is same-origin.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${toolbar ? " https://vercel.live" : ""}`,
  `style-src 'self' 'unsafe-inline'${toolbar ? " https://vercel.live" : ""}`,
  `img-src 'self' data: blob:${toolbar ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self'${toolbar ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${toolbar ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${toolbar ? "https://vercel.live" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const sl = (pl: string) => SEGMENTS[pl].sl;

/** Images other sites may embed: share cards, certificates, lab results, and the letterhead in emails. */
const EMBEDDABLE = [
  "/opengraph-image",
  "/:path*/opengraph-image",
  "/wynik/:kod/certyfikat",
  "/wynik/:kod/badania",
  `/sl/${sl("wynik")}/:kod/certifikat`,
  `/sl/${sl("wynik")}/:kod/preiskave`,
  "/email/:file*",
];

/** Private pages: results, rankings and the save-to-profile links are never indexed or leak a referrer. */
const PRIVATE = ["grupy", "grupa", "wynik"].flatMap((pl) => [`/${pl}/:path*`, `/sl/${sl(pl)}/:path*`]).concat(["/profil/zapisz/:path*", "/sl/profil/shrani/:path*"]);

/** Paths the Polish edition must not rewrite: the other edition, the routed form, APIs and Next's own. */
const NOT_POLISH = ["sl", "pl", "si", "api", "auth", "_next", "_vercel"].map((segment) => `${segment}(?:/|$)`).join("|");

/** Files outside /_next/static that rarely change: icons, the manifest, the Rorschach plates. */
const LONG_LIVED = [
  "/favicon.ico",
  "/icon.svg",
  "/apple-touch-icon.png",
  "/icon-:size.png",
  "/icon-maskable-:size.png",
  "/manifest.webmanifest",
  "/plansze/:file*",
  "/email/:file*",
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  experimental: {
    // Tailwind's CSS is small: inlining it saves the render-blocking stylesheet request.
    inlineCss: true,
  },
  // Certificates are rendered at request time and read these from disk.
  outputFileTracingIncludes: {
    "/[lang]/wynik/**": ["./assets/fonts/*.ttf"],
    "/[lang]/grupa/**": ["./assets/fonts/*.ttf"],
    "/[lang]/generator/**": ["./assets/fonts/*.ttf"],
    "/[lang]/bingo/**": ["./assets/fonts/*.ttf"],
    "/[lang]/atlas/**": ["./assets/fonts/*.ttf"],
    "/[lang]/slownik/**": ["./assets/fonts/*.ttf"],
    "/[lang]/raporty/**": ["./assets/fonts/*.ttf"],
    "/[lang]/profil/**": ["./assets/fonts/*.ttf"],
    "/[lang]/egzamin/**": ["./assets/fonts/*.ttf"],
    "/[lang]/czy-to-juz-dziaderstwo/**": ["./assets/fonts/*.ttf"],
    "/[lang]/kalendarz/**": ["./assets/fonts/*.ttf"],
    "/[lang]/opengraph-image": ["./assets/fonts/*.ttf"],
  },
  async redirects() {
    return [
      // The routed form of the Polish edition is never a public address (share images excepted:
      // Next.js links them by the routed path).
      { source: "/pl", destination: "/", permanent: true },
      { source: "/pl/:path((?!.*opengraph-image).*)", destination: "/:path", permanent: true },
      // dziader.si/si reads well, but the language code is sl.
      { source: "/si", destination: "/sl", permanent: true },
      { source: "/si/:path*", destination: "/sl/:path*", permanent: true },
      // The front door follows a reader's choice of edition, or a browser that asks for Slovenian first.
      // Deeper pages never redirect: shared links and search engines get the page they asked for.
      { source: "/", has: [{ type: "cookie", key: "jezyk", value: "sl" }], destination: "/sl", permanent: false },
      {
        source: "/",
        has: [{ type: "header", key: "accept-language", value: "sl(?:-[A-Za-z]+)?(?:[,;].*)?" }],
        missing: [{ type: "cookie", key: "jezyk" }],
        destination: "/sl",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      // After public files and static routes (robots.txt, /api, /auth), before the dynamic [lang] tree.
      afterFiles: [
        ...slovenianRewrites(),
        { source: "/", destination: "/pl" },
        { source: `/:path((?!${NOT_POLISH}).*)`, destination: "/pl/:path" },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...PRIVATE.map((source) => ({ source, headers: [{ key: "Referrer-Policy", value: "no-referrer" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
      ...["/test", "/sl/test"].map((source) => ({ source, headers: [{ key: "Referrer-Policy", value: "no-referrer" }] })),
      ...EMBEDDABLE.map((source) => ({
        source,
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
      })),
      ...LONG_LIVED.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      })),
    ];
  },
};

export default nextConfig;
