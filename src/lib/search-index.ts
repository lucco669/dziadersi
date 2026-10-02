import { OCCASIONS } from "@/content/bingo";
import { CASE_CATEGORIES, CASES, docket } from "@/content/cases";
import { DICTIONARY } from "@/content/dictionary";
import { SITUATIONS } from "@/content/phrasebook";
import { REPORTS } from "@/content/reports";
import { SPECIES } from "@/content/species";
import { sampleCard } from "./bingo";
import { seededLine } from "./phrasebook";
import { fold, type SearchEntry } from "./search";
import { EXTRA_PAGES, SECTIONS } from "./site";

const join = (...parts: (string | string[] | undefined)[]) => fold(parts.flat().filter(Boolean).join(" "));

/** The whole site as a search index. Built at build time; the content files are the source. */
export function buildSearchIndex(): SearchEntry[] {
  return [
    ...[...SECTIONS, ...EXTRA_PAGES].map((section) => ({
      k: "dzial" as const,
      t: section.label,
      s: section.summary,
      h: section.href,
      x: join(section.label, section.summary),
      i: section.href,
    })),
    ...SPECIES.map((species) => ({
      k: "gatunek" as const,
      t: species.name,
      s: `${species.latin} · ${species.teaser}`,
      h: `/atlas/${species.slug}`,
      x: join(species.name, species.latin, species.code, species.teaser, species.summary, species.description, species.calls, species.symptoms, species.handling, species.habitat, species.activity, species.fieldMarks, species.enemies, species.occasion),
      i: species.key,
    })),
    ...DICTIONARY.map((entry) => ({
      k: "haslo" as const,
      t: `„${entry.headword}”`,
      s: entry.senses[0].text,
      h: `/slownik/${entry.slug}`,
      x: join(entry.headword, entry.senses.map((sense) => sense.text), entry.example, entry.grammar),
    })),
    ...CASES.map((item) => ({
      k: "sprawa" as const,
      t: item.title,
      s: `${docket(item)} · ${CASE_CATEGORIES[item.category]}`,
      h: `/czy-to-juz-dziaderstwo/${item.slug}`,
      x: join(item.title, item.facts, item.defence, CASE_CATEGORIES[item.category]),
    })),
    ...REPORTS.map((report) => ({
      k: "raport" as const,
      t: report.title,
      s: `${report.number} · ${report.lede}`,
      h: `/raporty/${report.slug}`,
      x: join(report.title, report.category, report.lede, report.abstract, report.findings.map((finding) => finding.label)),
    })),
    ...OCCASIONS.map((occasion) => ({
      k: "bingo" as const,
      t: occasion.title,
      s: occasion.intro,
      h: `/bingo/${sampleCard(occasion).code}`,
      x: join(occasion.title, occasion.name, occasion.intro, occasion.squares),
    })),
    ...SITUATIONS.map((situation, i) => ({
      k: "rozmowki" as const,
      t: `Rozmówki: ${situation.name.toLowerCase()}`,
      s: `„${situation.claims[0]}”`,
      h: `/generator/${seededLine(31 + i, situation).code}`,
      x: join(situation.name, situation.short, situation.claims),
    })),
  ];
}
