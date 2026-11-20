import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "../src/app/sitemap";
import { getCalendar, observanceBySlug, OBSERVANCES } from "../src/content/calendar";
import { getDictionary } from "../src/content/dictionary";
import { getSlang, SLANG, slangBySlug } from "../src/content/slang";
import { getSpecies } from "../src/content/species";
import { CALENDAR_SLUGS } from "../src/content/sl/slugs/calendar";
import { SLANG_SLUGS } from "../src/content/sl/slugs/slang";
import { alternatePath, localizePath, switchPath } from "../src/i18n/routes";
import { dayLabel, daysUntil, nextSheet, observancesFrom } from "../src/lib/observances";
import { site } from "../src/lib/site";

/** A public path is in the sitemap and lists both editions as alternates. */
function assertPaired(polish: string, slovenian: string) {
  const entries = sitemap();
  for (const path of [polish, slovenian]) {
    const entry = entries.find((item) => item.url === site.url + path);
    assert.ok(entry, path);
    assert.deepEqual(entry.alternates?.languages, { pl: site.url + polish, sl: site.url + slovenian, "x-default": site.url + polish });
  }
}

test("the calendar has about one observance a week, on distinct dates, never on fixed public holidays", () => {
  assert.ok(OBSERVANCES.length >= 52, String(OBSERVANCES.length));
  const dates = OBSERVANCES.map((item) => item.date);
  assert.deepEqual(dates, [...dates].sort());
  assert.equal(new Set(dates).size, dates.length);
  for (const holiday of ["01-01", "01-06", "05-01", "05-03", "08-15", "11-01", "11-11", "12-24", "12-25", "12-26"])
    assert.ok(!dates.includes(holiday), holiday);
  const days = dates.map((date) => {
    const [month, day] = date.split("-").map(Number);
    return Date.UTC(2001, month - 1, day) / 86_400_000;
  });
  days.forEach((day, i) => assert.ok((i === 0 ? day + 365 - days.at(-1)! : day - days[i - 1]) <= 14, dates[i]));
});

test("every observance has a unique slug in both editions and resolves its patron and entry", () => {
  assert.equal(new Set(OBSERVANCES.map((item) => item.slug)).size, OBSERVANCES.length);
  assert.equal(new Set(Object.values(CALENDAR_SLUGS)).size, OBSERVANCES.length);
  assert.ok(!OBSERVANCES.some((item) => item.slug === "swieta"));
  for (const locale of ["pl", "sl"] as const) {
    for (const item of getCalendar(locale).OBSERVANCES) {
      assert.equal(observanceBySlug(item.slug, locale)?.date, item.date);
      assert.ok(item.rite.length > 20, item.date);
      assert.ok(getSpecies(locale).some((species) => species.key === item.species), item.species);
      if (item.entry) {
        const path = alternatePath("/slownik/" + item.entry, "pl", locale);
        assert.ok(getDictionary(locale).some((entry) => "/slownik/" + entry.slug === path), path);
      }
    }
  }
  for (const item of OBSERVANCES) {
    const polish = "/kalendarz/" + item.slug;
    const slovenian = localizePath("/kalendarz/" + CALENDAR_SLUGS[item.slug], "sl");
    assert.equal(switchPath(polish, "sl"), slovenian);
    assert.equal(switchPath(slovenian, "pl"), polish);
    assertPaired(polish, slovenian);
  }
  assert.equal(localizePath("/kalendarz/swieta", "sl"), "/sl/koledar/prazniki");
  assertPaired("/kalendarz/swieta", "/sl/koledar/prazniki");
});

test("observance dates: labels, the next occurrence and today's observance", () => {
  const skarpeta = observanceBySlug("dzien-bialej-skarpety", "pl")!;
  assert.equal(dayLabel(skarpeta, "pl"), "20 maja");
  assert.equal(dayLabel(observanceBySlug("dan-bele-nogavice", "sl")!, "sl"), "20. maj");
  const before = { year: 2026, month: 5, day: 19 };
  assert.equal(nextSheet(skarpeta, before, "pl").year, 2026);
  assert.equal(daysUntil(nextSheet(skarpeta, before, "pl"), before), 1);
  assert.equal(nextSheet(skarpeta, { year: 2026, month: 5, day: 21 }, "pl").year, 2027);
  const on = observancesFrom({ year: 2026, month: 5, day: 20 }, "pl", 2);
  assert.equal(on.today?.item.slug, "dzien-bialej-skarpety");
  assert.equal(on.upcoming.length, 2);
  assert.notEqual(on.upcoming[0].item.slug, "dzien-bialej-skarpety");
  const off = observancesFrom({ year: 2026, month: 12, day: 31 }, "pl", 1);
  assert.equal(off.today, undefined);
  assert.equal(off.upcoming[0].sheet.key, "2027-01-05");
});

test("the boomer guide is published in both editions", () => {
  assertPaired("/dziaders/boomer", "/sl/dziaders/boomer");
});

test("the youth dictionary: plain meaning first, a review date, both editions and working references", () => {
  assert.ok(SLANG.length >= 15 && SLANG.length <= 25, String(SLANG.length));
  assert.equal(new Set(SLANG.map((entry) => entry.slug)).size, SLANG.length);
  assert.equal(new Set(Object.values(SLANG_SLUGS)).size, SLANG.length);
  for (const locale of ["pl", "sl"] as const) {
    for (const entry of getSlang(locale)) {
      assert.equal(slangBySlug(entry.slug, locale)?.word, entry.word);
      assert.match(entry.checked, /^\d{4}-\d{2}-\d{2}$/);
      for (const field of [entry.meaning, entry.origin, entry.example, entry.dziaders, entry.reaction]) assert.ok(field.length > 5, entry.slug);
      if (entry.phrase) {
        const path = alternatePath("/slownik/" + entry.phrase, "pl", locale);
        assert.ok(getDictionary(locale).some((item) => "/slownik/" + item.slug === path), path);
      }
    }
  }
  // Slovenian text differs from Polish: a missing overlay would leave Polish behind.
  getSlang("sl").forEach((entry, i) => assert.notEqual(entry.meaning, SLANG[i].meaning, entry.slug));
  assertPaired("/slownik-mlodziezowy", "/sl/mladinski-slovar");
  for (const entry of SLANG) {
    const polish = "/slownik-mlodziezowy/" + entry.slug;
    const slovenian = localizePath("/slownik-mlodziezowy/" + SLANG_SLUGS[entry.slug], "sl");
    assert.equal(switchPath(polish, "sl"), slovenian);
    assert.equal(switchPath(slovenian, "pl"), polish);
    assertPaired(polish, slovenian);
  }
});
