import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { getSpecies } from "../src/content/species";
import { COMMON_SPECIMENS, defaultSpecimen, getSpecimens, SPECIMEN_COUNT, SPECIMENS } from "../src/content/specimens";
import { commonArtPath, speciesArtKey, speciesArtPath } from "../src/lib/species-art";
import { commonArtDataUri, speciesArtDataUri } from "../src/lib/species-art.server";
import { staticArtSrcSet } from "../src/components/static-artwork";
import { decodeGroup, decodeResult, encodeResult, evaluate, groupPath, resultAppearanceCodes, SAMPLE_DRAFT } from "../src/lib/test";
import { buildProfile, type Records } from "../src/lib/profile";
import { labResults } from "../src/lib/lab";

test("every species has three independent translated specimens and the curated cast spans ages and genders", () => {
  assert.equal(SPECIMEN_COUNT, 84);
  const main = getSpecies("pl").map(({ key }) => getSpecimens(key, "pl")[defaultSpecimen(key)]);
  assert.ok(main.filter(person => person.gender === "woman").length >= 10);
  assert.ok(main.some(person => person.age < 40));
  assert.ok(main.some(person => person.age >= 60));
  for (const { key } of getSpecies("pl")) {
    const pl = getSpecimens(key, "pl"), sl = getSpecimens(key, "sl");
    assert.equal(pl.length, 3);
    assert.deepEqual(pl.map(({ index, age, gender }) => ({ index, age, gender })), sl.map(({ index, age, gender }) => ({ index, age, gender })));
    assert.deepEqual(pl.map(person => person.index), [0, 1, 2]);
    for (let i = 0; i < 3; i++) {
      assert.ok(pl[i].observation.length > 10);
      assert.ok(sl[i].observation.length > 10);
      assert.notEqual(pl[i].observation, sl[i].observation);
    }
  }
});

test("every specimen has all five static WebP sizes and a local transparent PNG for share cards", () => {
  const prompts = JSON.parse(readFileSync("assets/illustrations/specimens/prompts.json", "utf8"));
  for (const { key } of getSpecies("pl")) {
    for (const { index } of SPECIMENS[key]) {
      const name = speciesArtKey(key, index);
      if (index > 0) assert.ok(prompts.subjects[name], name);
      verifyWebps(speciesArtPath(key, index));
      verifyPng(name, speciesArtDataUri(key, index));
    }
  }
  for (const { index } of COMMON_SPECIMENS) {
    const name = index === 0 ? "common" : `common-${index}`;
    assert.ok(prompts.subjects[name]);
    verifyWebps(commonArtPath(index));
    verifyPng(name, commonArtDataUri(index));
  }
  assert.match(readFileSync("next.config.ts", "utf8"), /images:\s*\{\s*unoptimized:\s*true\s*\}/);
});

function verifyWebps(path: string) {
  const sources = staticArtSrcSet(path, 1200).split(", ");
  assert.equal(sources.length, 5);
  assert.deepEqual(sources.map(source => Number(source.split(" ")[1].slice(0, -1))), [180, 360, 600, 900, 1200]);
  for (const source of sources) {
    assert.ok(!source.includes("/_next/image"));
    const data = readFileSync(join(process.cwd(), "public", source.split(" ")[0]));
    assert.equal(data.toString("ascii", 0, 4), "RIFF", source);
    assert.equal(data.toString("ascii", 8, 12), "WEBP", source);
    assert.ok(data.length > 100, source);
  }
}

function verifyPng(name: string, uri: string) {
  const data = readFileSync(`assets/illustrations/species/${name}.png`);
  assert.equal(data.readUInt32BE(16), 600);
  assert.equal(data.readUInt32BE(20), 500);
  assert.equal(data[25], 6);
  assert.equal(uri, `data:image/png;base64,${data.toString("base64")}`);
}

test("cosmetic choices round-trip through named T1 and T2 links without changing scores, certificates or lab readings", () => {
  const retired = decodeResult("1000000000007l")!;
  for (const initial of [retired, SAMPLE_DRAFT]) {
    const base = { ...initial, ...(initial.version === 2 ? { proxy: !!initial.proxy } : {}), name: "Žaneta" };
    const original = evaluate(base, "pl");
    for (const specimen of [0, 1, 2] as const) {
      const draft = { ...base, specimen };
      const code = encodeResult(draft), decoded = decodeResult(code)!;
      assert.deepEqual(decoded, draft);
      const pl = evaluate(decoded, "pl"), sl = evaluate(decoded, "sl");
      assert.equal(pl.specimen, specimen);
      assert.equal(sl.specimen, specimen);
      assert.equal(pl.score, original.score);
      assert.equal(pl.certificate, original.certificate);
      assert.deepEqual(pl.affinity, original.affinity);
      assert.deepEqual(labResults(pl, "pl"), labResults(original, "pl"));
      assert.equal(evaluate(decodeResult(encodeResult({ ...decoded, name: "Ana" }))!, "sl").specimen, specimen);
    }
  }
  assert.equal(decodeResult(`${encodeResult(SAMPLE_DRAFT)}!3`), null);
  assert.equal(decodeResult(`${encodeResult(SAMPLE_DRAFT)}!1!2`), null);
  assert.equal(evaluate(SAMPLE_DRAFT, "pl").specimen, evaluate(SAMPLE_DRAFT, "sl").specimen);
});

test("portrait changes never add a second respondent to a ranking or a second examination to profile statistics", () => {
  const original = encodeResult({ ...SAMPLE_DRAFT, name: "Ana" });
  const chosen = encodeResult({ ...SAMPLE_DRAFT, name: "Ana", specimen: 2 });
  const otherPerson = encodeResult({ ...SAMPLE_DRAFT, name: "Jan" });
  assert.deepEqual(resultAppearanceCodes(chosen), [original, `${original}!0`, `${original}!1`, `${original}!2`]);
  assert.equal(decodeGroup([original, chosen, otherPerson].join("."))?.length, 2);
  assert.equal(groupPath([original, chosen, otherPerson]), `/grupa/${chosen}.${otherPerson}`);
  const records: Records = { nickname: "", newsletter: false, honor: false, calendar: [], sightings: [], items: [], verdicts: [], submissions: [],
    results: [{ code: chosen, saved_at: "2026-10-13T12:00:00Z" }, { code: original, saved_at: "2026-10-13T11:00:00Z" }, { code: otherPerson, saved_at: "2026-10-13T10:00:00Z" }] };
  const profile = buildProfile(records, "pl", "2026-10-13");
  assert.equal(profile.results.length, 2);
  assert.equal(profile.results[0].specimen, 2);
  assert.equal(profile.results[0].code, chosen);
});
