import { getOccasions } from "@/content/bingo";
import { caseCategories, docket, getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { getSituations } from "@/content/phrasebook";
import { getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { sampleCard } from "./bingo";
import { seededLine } from "./phrasebook";
import { fold, type SearchEntry } from "./search";
import { extraPages, sections } from "./site";
import { quote } from "./typo";

const join = (...parts: (string | string[] | undefined)[]) => fold(parts.flat().filter(Boolean).join(" "));

const COPY = defineCopy({
  pl: { phrasebook: (name: string) => `Rozmówki: ${name.toLowerCase()}` },
  sl: { phrasebook: (name: string) => `Pogovornik: ${name.toLowerCase()}` },
});

/**
 * The whole edition as a search index. Built at build time; the content files are the source.
 * Links are internal paths with the edition's slugs; the search UI localises them.
 */
export function buildSearchIndex(locale: Locale): SearchEntry[] {
  const categories = caseCategories(locale);
  return [
    ...[...sections(locale), ...extraPages(locale)].map((section) => ({
      k: "dzial" as const,
      t: section.label,
      s: section.summary,
      h: section.href,
      x: join(section.label, section.summary),
      i: section.href,
    })),
    ...getSpecies(locale).map((species) => ({
      k: "gatunek" as const,
      t: species.name,
      s: `${species.latin} · ${species.teaser}`,
      h: `/atlas/${species.slug}`,
      x: join(species.name, species.latin, species.code, species.teaser, species.summary, species.description, species.calls, species.symptoms, species.handling, species.habitat, species.activity, species.fieldMarks, species.enemies, species.occasion),
      i: species.key,
    })),
    ...getDictionary(locale).map((entry) => ({
      k: "haslo" as const,
      t: quote(entry.headword, locale),
      s: entry.senses[0].text,
      h: `/slownik/${entry.slug}`,
      x: join(entry.headword, entry.original, entry.senses.map((sense) => sense.text), entry.example, entry.grammar),
    })),
    ...getCases(locale).map((item) => ({
      k: "sprawa" as const,
      t: item.title,
      s: `${docket(item)} · ${categories[item.category]}`,
      h: `/czy-to-juz-dziaderstwo/${item.slug}`,
      x: join(item.title, item.facts, item.defence, categories[item.category]),
    })),
    ...getReports(locale).map((report) => ({
      k: "raport" as const,
      t: report.title,
      s: `${report.number} · ${report.lede}`,
      h: `/raporty/${report.slug}`,
      x: join(report.title, report.category, report.lede, report.abstract, report.findings.map((finding) => finding.label)),
    })),
    ...getOccasions(locale).map((occasion) => ({
      k: "bingo" as const,
      t: occasion.title,
      s: occasion.intro,
      h: `/bingo/${sampleCard(occasion).code}`,
      x: join(occasion.title, occasion.name, occasion.intro, occasion.squares),
    })),
    ...getSituations(locale).map((situation, i) => ({
      k: "rozmowki" as const,
      t: COPY[locale].phrasebook(situation.name),
      s: quote(situation.claims[0], locale),
      h: `/generator/${seededLine(31 + i, locale, situation).code}`,
      x: join(situation.name, situation.short, situation.claims),
    })),
  ];
}
