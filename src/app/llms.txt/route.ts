import { DICTIONARY_SORTED } from "@/content/dictionary";
import { REPORTS } from "@/content/reports";
import { SPECIES } from "@/content/species";
import { SECTIONS, site } from "@/lib/site";

const link = (label: string, path: string, note: string) => `- [${label}](${site.url}${path}): ${note}`;

/** The site in Markdown for language models, after the llms.txt proposal (llmstxt.org). */
export function GET() {
  const text = [
    `# ${site.name} · ${site.institute}`,
    `> ${site.description}`,
    site.disclaimer,
    "## Działy",
    SECTIONS.map((section) => link(section.label, section.href, section.summary)).join("\n"),
    "## Atlas Dziadersów",
    SPECIES.map((species) => link(species.name, `/atlas/${species.slug}`, species.summary)).join("\n"),
    "## Słownik Dziaderski",
    DICTIONARY_SORTED.map((entry) => link(`„${entry.headword}”`, `/slownik/${entry.slug}`, entry.senses[0].text)).join("\n"),
    "## Raporty Instytutu",
    REPORTS.map((report) => link(report.title, `/raporty/${report.slug}`, `${report.lede} (${report.number}, ${report.date})`)).join("\n"),
  ].join("\n\n");

  return new Response(`${text}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
