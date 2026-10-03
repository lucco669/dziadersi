import assert from "node:assert/strict";
import { test } from "node:test";
import { CASE_SLUGS } from "../src/content/sl/slugs/cases";
import { DICTIONARY_SLUGS } from "../src/content/sl/slugs/dictionary";
import { REPORT_SLUGS } from "../src/content/sl/slugs/reports";
import { SPECIES_SLUGS } from "../src/content/sl/slugs/species";
import { alternatePath, localizePath, parsePath, switchPath } from "../src/i18n/routes";
import { SEGMENTS } from "../src/i18n/segments";

test("Polish paths are public as they are; Slovenian ones get /sl and Slovenian words", () => {
  assert.equal(localizePath("/", "pl"), "/");
  assert.equal(localizePath("/atlas/dziaders-grillowy", "pl"), "/atlas/dziaders-grillowy");
  assert.equal(localizePath("/", "sl"), "/sl");
  assert.equal(localizePath("/slownik/x", "sl"), "/sl/slovar/x");
  assert.equal(localizePath("/wynik/2abc/certyfikat?format=post", "sl"), "/sl/izvid/2abc/certifikat?format=post");
  assert.equal(localizePath("/profil/zapisz/2abc", "sl"), "/sl/profil/shrani/2abc");
  assert.equal(localizePath("/czy-to-juz-dziaderstwo#wokanda", "sl"), "/sl/je-to-ze-dziaderstvo#wokanda");
  assert.equal(localizePath("/test?grupa=a.b", "sl"), "/sl/test?grupa=a.b");
  // Already public, external and API paths pass through.
  assert.equal(localizePath("/sl/slovar/x", "sl"), "/sl/slovar/x");
  assert.equal(localizePath("https://example.com/x", "sl"), "https://example.com/x");
  assert.equal(localizePath("#tresc", "sl"), "#tresc");
});

test("every route segment round-trips between internal and public form", () => {
  for (const [pl, { children = {} }] of Object.entries(SEGMENTS)) {
    const paths = [`/${pl}`, `/${pl}/kod`, ...Object.keys(children).flatMap((child) => [`/${pl}/${child}`, `/${pl}/kod/${child}`])];
    for (const path of paths) {
      assert.deepEqual(parsePath(localizePath(path, "sl")), { locale: "sl", path }, path);
      assert.deepEqual(parsePath(localizePath(path, "pl")), { locale: "pl", path }, path);
      assert.deepEqual(parsePath(`/pl${path}`), { locale: "pl", path }, path);
    }
  }
});

test("Slovenian segments are unambiguous", () => {
  const slovenian = Object.values(SEGMENTS).map(({ sl }) => sl);
  assert.equal(new Set(slovenian).size, slovenian.length);
  for (const [pl, { sl }] of Object.entries(SEGMENTS)) {
    // A Slovenian word that is also a Polish folder must be the same section.
    if (SEGMENTS[sl]) assert.equal(sl, pl, `${sl} is both a Slovenian and a Polish segment`);
    assert.match(sl, /^[a-z0-9-]+$/);
  }
});

test("content slugs map one to one and the switcher finds the twin page", () => {
  for (const [section, map] of Object.entries({ atlas: SPECIES_SLUGS, slownik: DICTIONARY_SLUGS, raporty: REPORT_SLUGS, "czy-to-juz-dziaderstwo": CASE_SLUGS })) {
    const slugs = Object.values(map);
    assert.equal(new Set(slugs).size, slugs.length, `${section}: duplicate Slovenian slugs`);
    for (const [pl, sl] of Object.entries(map)) {
      assert.match(sl, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${section}: ${sl}`);
      assert.equal(alternatePath(`/${section}/${pl}`, "pl", "sl"), `/${section}/${sl}`);
      assert.equal(alternatePath(`/${section}/${sl}`, "sl", "pl"), `/${section}/${pl}`);
      assert.equal(switchPath(localizePath(`/${section}/${pl}`, "pl"), "sl"), localizePath(`/${section}/${sl}`, "sl"));
      assert.equal(switchPath(localizePath(`/${section}/${sl}`, "sl"), "pl"), `/${section}/${pl}`);
    }
  }
  // Codes are the same in both editions.
  assert.equal(switchPath("/wynik/2doy25yboiqpc907l", "sl"), "/sl/izvid/2doy25yboiqpc907l");
  assert.equal(switchPath("/sl/bingo/wesele-3k9fz/tisk", "pl"), "/bingo/wesele-3k9fz/druk");
  assert.equal(switchPath("/sl", "pl"), "/");
  assert.equal(switchPath("/", "sl"), "/sl");
});

test("every content module has a complete Slovenian translation", async () => {
  const { overlayProblems } = await import("../src/i18n/overlay");
  const modules = await Promise.all([
    import("../src/content/species"),
    import("../src/content/dictionary"),
    import("../src/content/reports"),
    import("../src/content/institute"),
    import("../src/content/test"),
    import("../src/content/test-v1"),
    import("../src/content/lab"),
    import("../src/content/cases"),
    import("../src/content/bingo"),
    import("../src/content/phrasebook"),
    import("../src/content/calendar"),
    import("../src/content/regions"),
  ]);
  assert.equal(modules.length, 12);
  const [species, dictionary, reports, , test2, , , cases, bingo, phrasebook] = modules;
  assert.equal(species.getSpecies("sl").length, species.SPECIES.length);
  assert.equal(dictionary.getDictionary("sl").length, dictionary.DICTIONARY.length);
  assert.equal(reports.getReports("sl").length, reports.REPORTS.length);
  assert.equal(test2.getTasks("sl").length, test2.TASKS.length);
  assert.equal(cases.getCases("sl").length, cases.CASES.length);
  assert.equal(bingo.getOccasions("sl").length, bingo.OCCASIONS.length);
  assert.equal(phrasebook.getSituations("sl").length, phrasebook.SITUATIONS.length);
  assert.deepEqual(overlayProblems, []);
});

test("Slovenian slugs exist for every Polish entry", async () => {
  const [{ SPECIES }, { DICTIONARY }, { REPORTS }, { CASES }] = await Promise.all([
    import("../src/content/species"),
    import("../src/content/dictionary"),
    import("../src/content/reports"),
    import("../src/content/cases"),
  ]);
  for (const [name, entries, map] of [
    ["species", SPECIES, SPECIES_SLUGS],
    ["dictionary", DICTIONARY, DICTIONARY_SLUGS],
    ["reports", REPORTS, REPORT_SLUGS],
    ["cases", CASES, CASE_SLUGS],
  ] as const) {
    for (const entry of entries) assert.ok(map[entry.slug], `${name}: no Slovenian slug for ${entry.slug}`);
  }
});
