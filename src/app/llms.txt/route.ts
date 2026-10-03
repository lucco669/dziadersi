import { docket, getCases } from "@/content/cases";
import { getDictionarySorted } from "@/content/dictionary";
import { getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import { LOCALES, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { absoluteUrl } from "@/lib/seo";
import { extraPages, sections, site, siteCopy } from "@/lib/site";
import { quote } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    edition: "Wydanie polskie (oryginał)",
    sections: "Działy",
    atlas: "Atlas Dziadersów",
    dictionary: "Słownik Dziaderski",
    reports: "Raporty Instytutu",
    cases: "Komisja Orzekająca: czy to już dziaderstwo?",
    about: "O serwisie",
    searchNote: "zapytanie w parametrze ?q=.",
  },
  sl: {
    edition: "Slovenska izdaja (prevod)",
    sections: "Oddelki",
    atlas: "Atlas dziadersov",
    dictionary: "Dziaderski slovar",
    reports: "Poročila Inštituta",
    cases: "Razsodna komisija: je to že dziaderstvo?",
    about: "O strani",
    searchNote: "poizvedba v parametru ?q=.",
  },
});

const link = (label: string, path: string, locale: Locale, note: string) => `- [${label}](${absoluteUrl(path, locale)}): ${note}`;
const list = (lines: string[]) => lines.join("\n");

/** The edition's sections; the Slovenian ones are prefixed so the file reads as one index. */
function edition(locale: Locale) {
  const t = COPY[locale];
  const heading = (title: string) => (locale === "pl" ? `## ${title}` : `## ${t.edition}: ${title}`);
  return [
    heading(t.sections),
    list(sections(locale).map((section) => link(section.label, section.href, locale, section.summary))),
    heading(t.atlas),
    list(getSpecies(locale).map((species) => link(species.name, `/atlas/${species.slug}`, locale, species.summary))),
    heading(t.dictionary),
    list(getDictionarySorted(locale).map((entry) => link(quote(entry.headword, locale), `/slownik/${entry.slug}`, locale, entry.senses[0].text))),
    heading(t.reports),
    list(getReports(locale).map((report) => link(report.title, `/raporty/${report.slug}`, locale, `${report.lede} (${report.number}, ${report.date})`))),
    heading(t.cases),
    list(getCases(locale).map((item) => link(`${docket(item)}: ${item.title}`, `/czy-to-juz-dziaderstwo/${item.slug}`, locale, item.facts))),
    heading(t.about),
    list(
      extraPages(locale)
        .filter((page) => page.href !== "/profil")
        .map((page) => link(page.label, page.href, locale, page.href === "/szukaj" ? `${page.summary} ${t.searchNote}` : page.summary)),
    ),
  ].join("\n\n");
}

/** The site in Markdown for language models, after the llms.txt proposal (llmstxt.org): the original, then the translation. */
export function GET() {
  const pl = siteCopy("pl");
  const sl = siteCopy("sl");
  const text = [
    `# ${site.name} · ${pl.institute}`,
    `> ${pl.description}`,
    pl.disclaimer,
    `${COPY.sl.edition}, ${absoluteUrl("/", "sl")}: ${sl.description} ${sl.disclaimer}`,
    ...LOCALES.map(edition),
  ].join("\n\n");
  return new Response(`${text}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
