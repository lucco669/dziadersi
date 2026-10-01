import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  // Certificates are rendered at request time and read these from disk.
  outputFileTracingIncludes: {
    "/wynik/**": ["./assets/fonts/*.ttf"],
    "/grupa/**": ["./assets/fonts/*.ttf"],
    "/atlas/**": ["./assets/fonts/*.ttf"],
    "/slownik/**": ["./assets/fonts/*.ttf"],
    "/raporty/**": ["./assets/fonts/*.ttf"],
  },
};

export default nextConfig;
