import type { MetadataRoute } from "next";
import { site, siteCopy } from "@/lib/site";

/** One manifest for the domain: the installed app opens the Polish original, which links to the translation. */
export default function manifest(): MetadataRoute.Manifest {
  const copy = siteCopy("pl");
  return {
    name: `${site.name} · ${copy.institute}`,
    short_name: site.name,
    description: copy.description,
    lang: "pl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f0e7",
    theme_color: "#f4f0e7",
    categories: ["entertainment"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
