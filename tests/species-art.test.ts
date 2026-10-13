import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { getSpecies } from "../src/content/species";
import { SPECIES_ART, speciesArtPath } from "../src/lib/species-art";
import { speciesArtDataUri } from "../src/lib/species-art.server";

test("every species in both editions has one shared artwork key and a saved prompt", () => {
  const prompts = JSON.parse(readFileSync(join(process.cwd(), "assets/illustrations/species/prompts.json"), "utf8"));
  const keys = Object.keys(SPECIES_ART).sort();
  for (const locale of ["pl", "sl"] as const) {
    assert.deepEqual(getSpecies(locale).map(({ key }) => key).sort(), keys);
  }
  assert.deepEqual(Object.keys(prompts.subjects).sort(), keys);
});

test("each web plate exists and each embedded plate is a transparent 600 × 500 PNG", () => {
  for (const { key } of getSpecies("pl")) {
    const webp = readFileSync(join(process.cwd(), "public", speciesArtPath(key)));
    assert.equal(webp.toString("ascii", 0, 4), "RIFF", key);
    assert.equal(webp.toString("ascii", 8, 12), "WEBP", key);
    const png = readFileSync(join(process.cwd(), "assets/illustrations/species", `${SPECIES_ART[key]}.png`));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", key);
    assert.equal(png.readUInt32BE(16), 600, key);
    assert.equal(png.readUInt32BE(20), 500, key);
    assert.equal(png[25], 6, `${key}: RGBA colour type`);
    assert.equal(speciesArtDataUri(key, 0), `data:image/png;base64,${png.toString("base64")}`, key);
  }
});
