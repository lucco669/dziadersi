import type { NextConfig } from "next";

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
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

/** Images other sites may embed: share cards, certificates, lab results. */
const EMBEDDABLE = ["/opengraph-image", "/:path*/opengraph-image", "/wynik/:kod/certyfikat", "/wynik/:kod/badania"];

/** Files outside /_next/static that rarely change: icons, the manifest, the Rorschach plates. */
const LONG_LIVED = [
  "/favicon.ico",
  "/icon.svg",
  "/apple-touch-icon.png",
  "/icon-:size.png",
  "/icon-maskable-:size.png",
  "/manifest.webmanifest",
  "/plansze/:file*",
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
    "/wynik/**": ["./assets/fonts/*.ttf"],
    "/grupa/**": ["./assets/fonts/*.ttf"],
    "/generator/**": ["./assets/fonts/*.ttf"],
    "/bingo/**": ["./assets/fonts/*.ttf"],
    "/atlas/**": ["./assets/fonts/*.ttf"],
    "/slownik/**": ["./assets/fonts/*.ttf"],
    "/raporty/**": ["./assets/fonts/*.ttf"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
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
