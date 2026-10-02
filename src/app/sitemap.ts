import type { MetadataRoute } from "next";
import { CASES } from "@/content/cases";
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
    page("/generator", "daily", 0.6),
    page("/bingo", "monthly", 0.6),
    page("/spis", "hourly", 0.7),
    page("/statystyki", "hourly", 0.6),
    page("/egzamin", "monthly", 0.7),
    page("/czy-to-juz-dziaderstwo", "weekly", 0.8),
    ...CASES.map((item) => page(`/czy-to-juz-dziaderstwo/${item.slug}`, "monthly", 0.6)),
    page("/o-instytucie", "yearly", 0.4),
    page("/regulamin", "yearly", 0.2),
    page("/prywatnosc", "yearly", 0.2),
  ];
}
