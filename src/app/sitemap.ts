import type { MetadataRoute } from "next";
import { DICTIONARY } from "@/content/dictionary";
import { REPORTS } from "@/content/reports";
import { SPECIES } from "@/content/species";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  });

  return [
    page("", "daily", 1),
    page("/test", "monthly", 0.9),
    page("/atlas", "weekly", 0.8),
    ...SPECIES.map((species) => page(`/atlas/${species.slug}`, "monthly", 0.7)),
    page("/slownik", "weekly", 0.7),
    ...DICTIONARY.map((entry) => page(`/slownik/${entry.slug}`, "monthly", 0.6)),
    page("/raporty", "monthly", 0.7),
    ...REPORTS.map((report) => ({
      ...page(`/raporty/${report.slug}`, "yearly", 0.6),
      lastModified: report.date,
    })),
    page("/indeks", "daily", 0.6),
  ];
}
