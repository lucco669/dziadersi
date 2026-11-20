import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { DICTIONARY } from "../src/content/dictionary";
import { SPECIES } from "../src/content/species";
import { CASTS, getWax, PROPHECIES } from "../src/content/wax";
import { localizePath } from "../src/i18n/routes";
import { random } from "../src/lib/random";
import { sections } from "../src/lib/site";
import { decodeReading, phrasesOf, sampleReading, waxTable } from "../src/lib/wax";
import { encodeReading, pour, waxSeason, yearFor } from "../src/lib/wax-code";

const ROOT = join(__dirname, "..");

test("every cast decodes from its code, in both editions, to the same picks", () => {
  const table = waxTable();
  const next = random(42);
  for (let i = 0; i < 500; i++) {
    const picks = pour(table, next, 2027);
    const code = encodeReading(table.slugs, picks);
    const pl = decodeReading(code, "pl");
    const sl = decodeReading(code, "sl");
    assert.ok(pl && sl, code);
    assert.deepEqual(pl.picks, picks);
    assert.deepEqual(sl.picks, picks);
    assert.equal(pl.species.key, sl.species.key);
    assert.equal(pl.year, 2027);
  }
});

test("a published code keeps its meaning", () => {
  // Codes in links and share images must never change their reading: lists are append-only.
  const reading = decodeReading("sandal-10k1a7", "pl")!;
  assert.equal(reading.cast.slug, "sandal");
  assert.equal(reading.species.key, "kempingowy");
  assert.equal(reading.prophecy, PROPHECIES[20]);
  assert.equal(reading.entry.slug, DICTIONARY[46].slug);
  assert.equal(reading.year, 2027);
});

test("malformed and non-canonical codes do not decode", () => {
  for (const code of ["", "sandal", "sandal-10k1a", "nieznany-00000", "sandal-20k1a7", "szczypce-10k1a7", "sandal-1zz1a7", "sandal-10kzz7", "Sandal-10k1a7"]) {
    assert.equal(decodeReading(code, "pl"), null, code);
  }
});

test("all 28 species can be foretold and every species has first words", () => {
  const foretold = new Set(CASTS.flatMap((cast) => cast.species));
  assert.equal(foretold.size, SPECIES.length);
  for (const species of SPECIES) assert.ok(phrasesOf(species.key).length > 0, species.key);
  assert.equal(new Set(CASTS.map((cast) => cast.slug)).size, CASTS.length);
  for (const cast of CASTS) assert.match(cast.slug, /^[a-z]+$/);
});

test("both editions read the same casts and prophecies, in order", () => {
  const sl = getWax("sl");
  assert.equal(sl.CASTS.length, CASTS.length);
  assert.equal(sl.PROPHECIES.length, PROPHECIES.length);
  sl.CASTS.forEach((cast, i) => {
    assert.equal(cast.slug, CASTS[i].slug);
    assert.notEqual(cast.reading, CASTS[i].reading, `${cast.slug} is not translated`);
  });
  sl.PROPHECIES.forEach((text, i) => assert.notEqual(text, PROPHECIES[i], `prophecy ${i} is not translated`));
});

test("every cast has its artwork, share images and saved prompt", () => {
  const prompts = JSON.parse(readFileSync(join(ROOT, "assets/wosk/prompts.json"), "utf8")) as { sharedPrompt: string; subjects: Record<string, string> };
  assert.ok(prompts.sharedPrompt.length > 200);
  for (const { slug } of CASTS) {
    assert.ok(prompts.subjects[slug], `${slug}: prompt`);
    for (const file of [`public/wosk/${slug}.webp`, `public/wosk/${slug}-600.webp`, `public/wosk/${slug}-360.webp`, `assets/wosk/${slug}.png`, `assets/wosk/${slug}-cien.png`]) {
      assert.ok(existsSync(join(ROOT, file)), file);
    }
  }
});

test("samples and seasons", () => {
  assert.equal(sampleReading(3, "pl").code, sampleReading(3, "sl").code);
  assert.equal(yearFor(2026, 11), 2027);
  assert.equal(yearFor(2027, 1), 2027);
  assert.equal(waxSeason(11, 29, "pl"), "andrzejki");
  assert.equal(waxSeason(11, 29, "sl"), null);
  assert.equal(waxSeason(12, 31, "sl"), "sylwester");
  assert.equal(waxSeason(6, 1, "pl"), null);
});

test("the Pracownia has its address in both editions and a place in the menu", () => {
  assert.equal(localizePath("/lanie-wosku", "sl"), "/sl/vlivanje-voska");
  assert.equal(localizePath("/lanie-wosku/sandal-10k1a7/karta", "sl"), "/sl/vlivanje-voska/sandal-10k1a7/kartica");
  assert.ok(sections("pl").some((section) => section.href === "/lanie-wosku"));
  assert.ok(sections("sl").some((section) => section.href === "/lanie-wosku"));
});
