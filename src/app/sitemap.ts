import type { MetadataRoute } from "next";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import { LOCALES, type Locale } from "@/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/** Both editions of every public page, each listing its twin (hreflang) so search engines pair them. */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) => pages(locale));
}

function pages(locale: Locale): MetadataRoute.Sitemap {
  const page = (path: string, changeFrequency: Entry["changeFrequency"], priority: number): Entry => ({
    url: absoluteUrl(path, locale),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languageAlternates(path, locale)).map(([language, href]) => [language, `${site.url}${href === "/" ? "" : href}`]),
      ),
    },
  });

  return [
    page("/", "daily", 1),
    page("/test", "monthly", 0.9),
    page("/atlas", "weekly", 0.8),
    ...getSpecies(locale).map((species) => page(`/atlas/${species.slug}`, "monthly", 0.7)),
    page("/slownik", "weekly", 0.7),
    ...getDictionary(locale).map((entry) => page(`/slownik/${entry.slug}`, "monthly", 0.6)),
    page("/raporty", "monthly", 0.7),
    ...getReports(locale).map((report) => ({
      ...page(`/raporty/${report.slug}`, "yearly", 0.6),
      lastModified: report.date,
    })),
    page("/indeks", "daily", 0.6),
    page("/generator", "daily", 0.6),
    page("/superinteligencja", "monthly", 0.7),
    page("/bingo", "monthly", 0.6),
    page("/kolejka", "monthly", 0.7),
    page("/spis", "hourly", 0.7),
    page("/statystyki", "hourly", 0.6),
    page("/egzamin", "monthly", 0.7),
    page("/czy-to-juz-dziaderstwo", "weekly", 0.8),
    ...getCases(locale).map((item) => page(`/czy-to-juz-dziaderstwo/${item.slug}`, "monthly", 0.6)),
    page("/obserwacje", "hourly", 0.6),
    page("/tablica-honorowa", "daily", 0.6),
    page("/kalendarz", "daily", 0.7),
    page("/biuletyn", "weekly", 0.6),
    page("/o-instytucie", "yearly", 0.4),
    page("/kontakt", "yearly", 0.3),
    page("/regulamin", "yearly", 0.2),
    page("/prywatnosc", "yearly", 0.2),
  ];
}
