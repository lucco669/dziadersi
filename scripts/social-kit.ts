/**
 * The daily social kit: the day's rotating content as ready-to-post images and captions.
 *
 *   pnpm social-kit                      today (Warsaw), both editions
 *   pnpm social-kit --date 2026-12-24    any day
 *   pnpm social-kit --lang sl --out DIR  one edition, another folder
 *
 * Four posts, each as a 1080 × 1350 post and a 1080 × 1920 story, in Polish and Slovenian:
 *   sprawa  the Komisja's case of the day as a three-stamp poll
 *   kartka  the page of the tear-off calendar
 *   haslo   the word of the day from the Słownik
 *   indeks  the Narodowy Indeks bulletin with the last thirty days
 * plus captions.md (and captions.json) with a caption, a story link and hashtags for each.
 * The picks are the site's own: the same case, word and page the front page shows that day.
 * Output goes to out/social-kit/<date>/ (ignored by git).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import { docket, getCases, getVerdicts } from "../src/content/cases";
import { getDictionary } from "../src/content/dictionary";
import { LOCALES, type Locale } from "../src/i18n/config";
import { localizePath } from "../src/i18n/routes";
import { sheetFor } from "../src/lib/almanac";
import { bulletinAt } from "../src/lib/bulletin";
import { warsawTime } from "../src/lib/calendar";
import { calendarStory, entryStory, indexStory } from "../src/lib/daily-cards";
import { OG_FONTS } from "../src/lib/og";
import { STORY_QUERY, type StoryFormat } from "../src/lib/share-file";
import { site } from "../src/lib/site";
import { caseStory, STORY_SIZES } from "../src/lib/story-cards";
import { pageFor } from "../src/lib/tear-off";
import { pct, quote, roman } from "../src/lib/typo";

type Post = { key: string; path: string; render: (format: StoryFormat) => ReactElement; caption: string; story: string };

function option(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

const HASHTAGS: Record<Locale, string> = {
  pl: "#dziaders #dziaderstwo #humor #satyra #polska",
  sl: "#dziaders #dziaderstvo #humor #satira #poljska",
};

const CAPTIONS = {
  pl: {
    case: (number: string, title: string, defence: string, stamps: string) =>
      `Sprawa ${number}: ${title}. Czy to już dziaderstwo?\n\nStrona broni się: ${defence}\n\nOrzeknij jako ławnik w komentarzu: ${stamps}. Uzasadnienie Komisji Orzekającej jest na stronie.`,
    calendar: (date: string, weekday: string, proverb: string, observance: string) =>
      `Kartka z kalendarza: ${weekday}, ${date}.\n\n${proverb}${observance ? `\n\n${observance}` : ""}\n\nNa odwrocie: porada dnia, rozkaz dzienny i patron dnia.`,
    entry: (headword: string, grammar: string, sense: string, example: string) =>
      `Hasło dnia: ${headword} (${grammar}).\n\n${sense}\n\nPrzykład użycia: ${example}`,
    index: (date: string, value: string, zone: string, level: string, alert: string) =>
      `Narodowy Indeks Dziaderstwa, ${date}: ${value}%, natężenie ${zone}. Ostrzeżenie ${level} stopnia.\n\n${alert}\n\nŹródło: IBD. Dane na licencji CC BY 4.0.`,
    link: (url: string) => `Link: ${url}`,
    story: "Naklejka z linkiem",
    title: (date: string) => `Zestaw na ${date}`,
  },
  sl: {
    case: (number: string, title: string, defence: string, stamps: string) =>
      `Primer ${number}: ${title}. Je to že dziaderstvo?\n\nZagovor stranke: ${defence}\n\nRazsodi kot porotnik v komentarju: ${stamps}. Obrazložitev Razsodne komisije je na strani.`,
    calendar: (date: string, weekday: string, proverb: string, observance: string) =>
      `Trgalni koledar: ${weekday}, ${date}.\n\n${proverb}${observance ? `\n\n${observance}` : ""}\n\nNa hrbtni strani: nasvet dneva, dnevno povelje in zavetnik dneva.`,
    entry: (headword: string, grammar: string, sense: string, example: string) =>
      `Geslo dneva: ${headword} (${grammar}).\n\n${sense}\n\nPrimer rabe: ${example}`,
    index: (date: string, value: string, zone: string, level: string, alert: string) =>
      `Nacionalni indeks dziaderstva, ${date}: ${value} %, jakost ${zone}. Opozorilo ${level}. stopnje.\n\n${alert}\n\nVir: IBD. Podatki pod licenco CC BY 4.0.`,
    link: (url: string) => `Povezava: ${url}`,
    story: "Nalepka s povezavo",
    title: (date: string) => `Komplet za ${date}`,
  },
} satisfies Record<Locale, unknown>;

/** The day's posts in one edition, picked the way the site picks them. */
function posts(locale: Locale, year: number, month: number, day: number): Post[] {
  const t = CAPTIONS[locale];
  // 08:00 in Warsaw, when a morning post goes out.
  const bulletin = bulletinAt(locale, new Date(Date.UTC(year, month - 1, day, 7)));
  const cases = getCases(locale);
  const dictionary = getDictionary(locale);
  const item = cases[bulletin.today % cases.length];
  const entry = dictionary[bulletin.today % dictionary.length];
  const page = pageFor(sheetFor(year, month, day, locale), locale);
  const { value, zone, season } = bulletin.index;
  const stamps = getVerdicts(locale).map((verdict) => verdict.short.toUpperCase()).join(" / ");
  const url = (path: string) => `${site.url}${localizePath(path, locale)}`;

  return [
    {
      key: "sprawa",
      path: `/czy-to-juz-dziaderstwo/${item.slug}`,
      render: (format) => caseStory(item, locale, format),
      caption: t.case(docket(item), item.title, quote(item.defence, locale), stamps),
      story: url(`/czy-to-juz-dziaderstwo/${item.slug}`),
    },
    {
      key: "kartka",
      path: "/kalendarz",
      render: (format) => calendarStory(page, locale, format),
      caption: t.calendar(
        page.date,
        page.weekday,
        page.proverb.split(" / ").join("\n"),
        page.observance ? `${page.observance.name}. ${page.observance.note}` : "",
      ),
      story: url("/kalendarz"),
    },
    {
      key: "haslo",
      path: `/slownik/${entry.slug}`,
      render: (format) => entryStory(entry, locale, format),
      caption: t.entry(quote(entry.headword, locale), entry.grammar, entry.senses[0].text, quote(entry.example, locale)),
      story: url(`/slownik/${entry.slug}`),
    },
    {
      key: "indeks",
      path: "/indeks",
      render: (format) => indexStory(bulletin, locale, format),
      caption: t.index(bulletin.date, pct(value), zone.label, roman(season.level), season.alert),
      story: url("/indeks"),
    },
  ];
}

async function main() {
  const now = warsawTime(new Date());
  const date = option("date") ?? `${now.year}-${String(now.month).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error(`--date must be YYYY-MM-DD, got "${date}"`);
  const [year, month, day] = match.slice(1).map(Number);
  const locales = (option("lang")?.split(",") ?? [...LOCALES]).filter((value): value is Locale => (LOCALES as readonly string[]).includes(value));
  const out = resolve(option("out") ?? join("out", "social-kit", date));
  mkdirSync(out, { recursive: true });

  const markdown: string[] = [];
  const json: Record<string, unknown>[] = [];
  for (const locale of locales) {
    const t = CAPTIONS[locale];
    markdown.push(`# ${t.title(date)} · ${locale.toUpperCase()}`, "");
    for (const post of posts(locale, year, month, day)) {
      const files: string[] = [];
      for (const format of ["post", "story"] as const) {
        const file = `${date}-${post.key}-${locale}-${STORY_QUERY[format]}.png`;
        const image = new ImageResponse(post.render(format), { ...STORY_SIZES[format], fonts: OG_FONTS });
        writeFileSync(join(out, file), Buffer.from(await image.arrayBuffer()));
        files.push(file);
        console.log(`  ${file}`);
      }
      const caption = `${post.caption}\n\n${t.link(`${site.url}${localizePath(post.path, locale)}`)}\n\n${HASHTAGS[locale]}`;
      markdown.push(`## ${post.key}`, "", `${files.map((file) => `\`${file}\``).join(" · ")}`, "", caption, "", `${t.story}: ${post.story}`, "");
      json.push({ date, locale, post: post.key, files, caption, storyLink: post.story });
    }
  }
  writeFileSync(join(out, "captions.md"), markdown.join("\n"));
  writeFileSync(join(out, "captions.json"), `${JSON.stringify(json, null, 2)}\n`);
  console.log(`Social kit for ${date}: ${json.length * 2} images and captions in ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
