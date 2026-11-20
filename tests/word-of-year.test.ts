import assert from "node:assert/strict";
import { test } from "node:test";
import { DICTIONARY, getDictionary } from "../src/content/dictionary";
import { reportBySlug, REPORTS } from "../src/content/reports";
import { REPORT_SLUGS } from "../src/content/sl/slugs/reports";
import { getWordOfYear, isNominee, WORD_OF_YEAR } from "../src/content/word-of-year";
import { localizePath } from "../src/i18n/routes";
import { indexYear } from "../src/lib/index-year";
import { decide, phaseAt, standings } from "../src/lib/word-of-year";
import { protocolText, verdictLine, wordEntry } from "../src/lib/word-of-year-text";

test("the phases follow Warsaw time and the announcement lands in the PWN week", () => {
  assert.equal(phaseAt(new Date("2026-11-30T22:59:59Z")), "upcoming");
  assert.equal(phaseAt(new Date("2026-11-30T23:00:00Z")), "voting"); // 1 December, 00:00 in Warsaw
  assert.equal(phaseAt(new Date("2026-12-08T22:59:59Z")), "voting");
  assert.equal(phaseAt(new Date("2026-12-08T23:00:00Z")), "closed");
  assert.equal(phaseAt(new Date("2026-12-10T08:59:59Z")), "closed");
  assert.equal(phaseAt(new Date("2026-12-10T09:00:00Z")), "announced"); // 10:00 in Warsaw
  const days = (Date.parse(WORD_OF_YEAR.announced) - Date.parse(`${WORD_OF_YEAR.pwn}T00:00:00+01:00`)) / 86_400_000;
  assert.ok(days > 0 && days < 5, "the Institute announces in the same week as PWN, after it");
});

test("the shortlist is twelve distinct dictionary phrases with species, translated in both editions", () => {
  const slugs = WORD_OF_YEAR.nominees.map((nominee) => nominee.slug);
  assert.equal(new Set(slugs).size, 12);
  assert.ok(isNominee(WORD_OF_YEAR.reserve));
  assert.ok(!isNominee("kiedys-to-byly-zimy-2"));
  for (const slug of slugs) {
    const entry = DICTIONARY.find((item) => item.slug === slug);
    assert.ok(entry?.species, `${slug}: in the Słownik, with a species`);
    assert.notEqual(wordEntry(slug, "sl").headword, entry.headword);
  }
  getWordOfYear("sl").nominees.forEach((nominee, i) => {
    assert.equal(nominee.slug, WORD_OF_YEAR.nominees[i].slug);
    assert.notEqual(nominee.nomination, WORD_OF_YEAR.nominees[i].nomination);
  });
  assert.equal(getDictionary("sl").length, DICTIONARY.length);
  assert.equal(localizePath("/slowo-roku", "sl"), "/sl/beseda-leta");
  assert.equal(localizePath("/slowo-roku/certyfikat?format=relacja", "sl"), "/sl/beseda-leta/certifikat?format=relacja");
});

test("the Komisja reads the ballot box honestly: votes, a tie, too few votes, no data", () => {
  const [a, b, c] = WORD_OF_YEAR.nominees.map((nominee) => nominee.slug).filter((slug) => slug !== WORD_OF_YEAR.reserve);
  const clear = decide({ [a]: 80, [b]: 60, [c]: 72 });
  assert.equal(clear.decision, "votes");
  assert.equal(clear.winner, a);
  assert.equal(clear.total, 212);
  assert.equal(verdictLine(clear, "pl"), "n = 212 · 38% głosów");
  assert.match(protocolText(clear, "pl"), /oddano 212 głosów.*otrzymał 80 głosów, czyli 38%/);

  const tie = decide({ [b]: 70, [a]: 70, [c]: 30 });
  assert.equal(tie.decision, "tie");
  assert.deepEqual(tie.tied, [a, b]);
  assert.equal(tie.winner, a, "the chair votes for the first nominated");
  assert.equal(verdictLine(tie, "pl"), "n = 170 · Komisja rozstrzygnęła remis");
  assert.equal(decide({ [a]: 40, [WORD_OF_YEAR.reserve]: 40 }).winner, WORD_OF_YEAR.reserve, "the chair prefers the Komisja's own choice");

  const few = decide({ [a]: 9, [b]: 3 });
  assert.equal(few.decision, "commission");
  assert.equal(few.winner, WORD_OF_YEAR.reserve);
  assert.match(protocolText(few, "pl"), /oddano 12 głosów, mniej niż wymagane 30/);
  assert.match(protocolText(few, "sl"), /Skupno število oddanih glasov: 12, kar je manj od zahtevanih 30/);

  const none = decide(null);
  assert.equal(none.decision, "no-data");
  assert.equal(verdictLine(none, "sl"), "Izbor Komisije");
  // Unknown phrases in the box are not counted.
  assert.equal(standings({ [a]: 1, "nie-ma-takiego": 99 }).reduce((sum, row) => sum + row.votes, 0), 1);
});

test("the year-end report quotes the Index model and has its Slovenian twin", () => {
  const year = indexYear(2026);
  const report = REPORTS.find((item) => item.slug === WORD_OF_YEAR.report)!;
  assert.equal(report.yearEnd, 2026);
  assert.equal(report.number, "IBD/2026/09");
  const decimal = (value: number) => String(value).replace(".", ",");
  assert.equal(report.findings[0].value, decimal(year.mean));
  assert.equal(report.findings[1].value, String(year.zones[2]));
  assert.equal(report.findings[2].value, decimal(year.peak.value));
  assert.deepEqual(report.chart.bars.map((bar) => bar.value), year.months);
  assert.equal(year.zones[3], year.clinical.length);
  assert.deepEqual([year.clinical[0], year.clinical.at(-1)], [{ month: 12, day: 22 }, { month: 12, day: 28 }]);
  assert.ok(report.lede.includes("od 22 do 28 grudnia"));
  assert.equal(new Set(REPORTS.map((item) => item.number)).size, REPORTS.length, "report numbers are unique");
  const twin = reportBySlug(REPORT_SLUGS[report.slug], "sl")!;
  assert.equal(twin.title, "Stanje dziaderstva na Poljskem 2026");
  assert.deepEqual(twin.chart.bars.map((bar) => bar.value), year.months);
});
