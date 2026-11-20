import assert from "node:assert/strict";
import { test } from "node:test";
import type { SpeciesKey } from "../src/content/species";
import { getShortTasks, SHORT_FORM, TASKS, type Option, type Task } from "../src/content/test";
import {
  choices,
  decodeGroup,
  decodeResult,
  DIAGNOSABLE,
  encodeResult,
  evaluate,
  formTasks,
  MAX_POINTS,
  radix,
  read,
  reflexValue,
  type Draft,
} from "../src/lib/test";
import { localizePath, parsePath } from "../src/i18n/routes";
import { loadGroup, sharedFindings } from "../src/lib/group";
import { checkNames, readTable, tableCapacity, tableCodes, tablePath, type TableState } from "../src/lib/table";

/*
 * Formularz IBD-T2S ("Badanie przy stole"): six IBD-T2 tasks under code version 3.
 * The simulation below is the calibration record for NAMING[3] in src/lib/test.ts.
 */

const SHORT = getShortTasks("pl");

/** A small seeded generator, so the simulation gives the same numbers on every run. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

const REFLEX = { red: reflexValue("red"), amber: reflexValue("amber"), fast: reflexValue(200), normal: reflexValue(600), slow: reflexValue(1500), none: reflexValue("none") };

/** The option that says most about a species (points break ties). */
const favourite = (options: Option[], species: SpeciesKey) =>
  options.reduce((best, option, i) => {
    const value = (option.species?.[species] ?? 0) * 10 + option.points / 100;
    const top = (options[best].species?.[species] ?? 0) * 10 + options[best].points / 100;
    return value > top ? i : best;
  }, 0);

/** Random answers; with `species`, each part leans to it with probability `lean`. */
function answer(task: Task, next: () => number, species?: SpeciesKey, lean = 0.7) {
  const leans = () => species !== undefined && next() < lean;
  const any = (count: number) => Math.floor(next() * count);
  switch (task.kind) {
    case "words":
      return task.words.reduce((total, word) => total * word.options.length + (leans() ? favourite(word.options, species!) : any(word.options.length)), 0);
    case "inventory":
    case "rapid": {
      const items = task.kind === "inventory" ? task.things : task.statements;
      return items.reduce((total, item, i) => total + ((leans() ? (item.species?.[species!] ?? 0) > 0 : next() < 0.5) ? 2 ** i : 0), 0);
    }
    case "reflex": {
      const outcomes = Object.keys(REFLEX) as (keyof typeof REFLEX)[];
      const pick = leans() ? favourite(outcomes.map((key) => task.outcomes[key]), species!) : any(outcomes.length);
      return REFLEX[outcomes[pick]];
    }
    default:
      return leans() ? favourite(choices(task), species!) : any(choices(task).length);
  }
}

const draft = (answers: number[]): Draft => ({ version: 3, answers, day: 357 });

test("the short form is one task per room plus one, and keeps IBD-T2's task objects", () => {
  assert.equal(SHORT_FORM.length, 6);
  assert.deepEqual([...new Set(SHORT.map((task) => task.station))], [0, 1, 2, 3, 4]);
  assert.equal(new Set(SHORT.map((task) => task.kind)).size, 6, "six different scenes");
  SHORT_FORM.forEach((index, i) => {
    assert.equal(SHORT[i], TASKS[index]);
    assert.equal(getShortTasks("sl")[i].kind, TASKS[index].kind);
  });
  assert.deepEqual(formTasks(3, "pl"), SHORT);
  // Frozen: changing this list changes what every published "3" code means.
  assert.deepEqual([...SHORT_FORM], [1, 3, 4, 6, 10, 15]);
  assert.equal(MAX_POINTS[3], 18);
  assert.equal(MAX_POINTS[2], 48);
});

test("short codes round-trip at every boundary, with names, specimens and the family flag", () => {
  const low = SHORT.map(() => 0);
  const high = SHORT.map((task) => radix(task) - 1);
  for (const answers of [low, high, [2, 1, 37, 260, 300, 999]]) {
    for (const extra of [{}, { name: "Ciocia Grażyna" }, { proxy: true }, { specimen: 2 as const }]) {
      const code = encodeResult({ ...draft(answers), ...extra });
      assert.match(code, /^3[0-9a-z]{8}[0-9a-z]{3}/);
      const decoded = decodeResult(code);
      assert.ok(decoded, code);
      assert.equal(decoded.version, 3);
      assert.deepEqual(decoded.answers, answers);
      assert.equal(encodeResult(decoded), code);
    }
  }
  const empty = evaluate(draft([0, 0, 0, REFLEX.none, 0, 0]), "pl");
  assert.equal(empty.score, 0);
  assert.equal(empty.diagnosis.name, "Dziaders Utajony");
  const full = evaluate(draft([3, 2, 63, REFLEX.red, 511, 1023]), "pl");
  assert.equal(full.score, 100);
  assert.equal(full.max, 18);
  assert.equal(full.reflex?.outcome, "red");
});

test("short codes never collide with IBD-T1 or IBD-T2, and corrupt ones are rejected", () => {
  const v2 = decodeResult("2doy25yboiqpc907l");
  assert.equal(v2?.version, 2);
  assert.equal(encodeResult(v2!), "2doy25yboiqpc907l");
  const code = encodeResult(draft([3, 2, 40, 27, 39, 201]));
  assert.equal(decodeResult(`2${code.slice(1)}`), null, "a short body is not a T2 code");
  assert.equal(decodeResult(`3zzzzzzzz${code.slice(9)}`), null, "outside the answer space");
  assert.equal(decodeResult(`${code}0`), null);
  // Rankings mix editions and keep decoding old links.
  const group = decodeGroup(["2doy25yboiqpc907l", code, encodeResult({ version: 1, answers: Array(24).fill(0), day: 273 })].join("."));
  assert.deepEqual(group?.map((item) => item.version), [2, 3, 1]);
});

test("an answer reads the same in the short form as in IBD-T2", () => {
  const next = random(7);
  for (let round = 0; round < 50; round++) {
    const answers = SHORT.map((task) => answer(task, next));
    const short = evaluate(draft(answers), "pl");
    const t2 = SHORT_FORM.reduce((sum, index, i) => sum + read(TASKS[index], answers[i], false, "pl").points, 0);
    assert.equal(short.points, t2);
    assert.equal(short.score, Math.round((short.points / 18) * 100));
    SHORT.forEach((task, i) => assert.deepEqual(read(task, answers[i], false, "sl").points, read(TASKS[SHORT_FORM[i]], answers[i], false, "sl").points));
  }
  // Both editions name the same species.
  const result = evaluate(draft([3, 2, 21, REFLEX.amber, 7, 8]), "pl");
  const sl = evaluate(draft([3, 2, 21, REFLEX.amber, 7, 8]), "sl");
  assert.deepEqual(result.diagnosis.species.map((s) => s.key), sl.diagnosis.species.map((s) => s.key));
});

test("calibration: under random answering every species wins and hybrids still occur", () => {
  const next = random(2026);
  const runs = 6000;
  const wins = new Map<string, number>();
  let hybrids = 0;
  let unspecified = 0;
  for (let i = 0; i < runs; i++) {
    const { diagnosis } = evaluate(draft(SHORT.map((task) => answer(task, next))), "pl");
    if (diagnosis.species.length === 0) unspecified++;
    if (diagnosis.species.length === 2) hybrids++;
    const first = diagnosis.species[0]?.key;
    if (first) wins.set(first, (wins.get(first) ?? 0) + 1);
  }
  for (const species of DIAGNOSABLE) {
    const share = (wins.get(species.key) ?? 0) / runs;
    assert.ok(share >= 0.04 && share <= 0.16, `${species.key} wins ${(share * 100).toFixed(1)}% of random examinations`);
  }
  // IBD-T2 under the same simulation: hybrids 13.7%, unspecified 5.9%.
  assert.ok(hybrids / runs >= 0.08 && hybrids / runs <= 0.22, `hybrids ${((hybrids / runs) * 100).toFixed(1)}%`);
  assert.ok(unspecified / runs <= 0.16, `unspecified ${((unspecified / runs) * 100).toFixed(1)}%`);
});

test("calibration: a respondent leaning to one species is recognised", () => {
  const next = random(1224);
  const runs = 800;
  for (const species of DIAGNOSABLE) {
    let recognised = 0;
    let hybrid = 0;
    for (let i = 0; i < runs; i++) {
      const { diagnosis } = evaluate(draft(SHORT.map((task) => answer(task, next, species.key))), "pl");
      if (diagnosis.species[0]?.key === species.key) recognised++;
      if (diagnosis.species.length === 2) hybrid++;
    }
    // IBD-T2 under the same simulation: 65–76%. The short form: about 61–79%.
    assert.ok(recognised / runs >= 0.55, `${species.key} recognised ${((recognised / runs) * 100).toFixed(1)}%`);
    assert.ok(hybrid > 0, `${species.key} also appears in hybrids`);
  }
});

test("the census stores short results without touching IBD-T2's per-task statistics", async () => {
  const { databaseFixture } = await import("./database-fixture");
  const { readFile } = await import("node:fs/promises");
  const { randomUUID } = await import("node:crypto");
  const db = await databaseFixture();
  try {
    await db.exec(await readFile("supabase/migrations/20261121100000_table_edition.sql", "utf8"));
    const insert = (version: number, score: number, answers: number[]) =>
      db.query("insert into public.results(code, version, score, species, answers, submission_key) values ($1, $2, $3, '{grill}', $4, $5)", [
        `${version}${"0".repeat(14)}`,
        version,
        score,
        answers,
        randomUUID(),
      ]);
    await insert(2, 83, [3, 2, 2, 2, 40, 2, 27, 2, 1, 41, 39, 3, 3, 2, 1, 201]);
    await insert(3, 40, [1, 1, 1, 1, 1, 1]);
    await assert.rejects(insert(4, 50, [1]));
    const summary = (await db.query<{ s: { total: number } }>("select public.census_summary() as s")).rows[0].s;
    assert.equal(summary.total, 2, "the census counts both examinations");
    const tasks = (await db.query<{ task: number; n: number }>("select * from public.answer_counts()")).rows;
    assert.equal(tasks.length, 16, "one row per IBD-T2 task: the short answers are not mistaken for tasks 1–6");
    const histogram = (await db.query<{ score: number }>("select * from public.score_histogram()")).rows;
    assert.deepEqual(histogram.map((row) => row.score), [83]);
  } finally {
    await db.close();
  }
});

test("the attendance list needs distinct names that survive cleaning", () => {
  assert.deepEqual(checkNames(["Zenek", "  ", "Grażyna"]), { names: ["Zenek", "Grażyna"], problems: [null, null, null], few: false, ok: true });
  assert.deepEqual(checkNames(["Zenek", "zenek"]).problems, [null, "duplicate"]);
  assert.deepEqual(checkNames(["Zenek", "1234"]).problems, [null, "invalid"]);
  assert.equal(checkNames(["Zenek", ""]).few, true);
  assert.equal(checkNames(["Zenek"], 1).ok, true, "one latecomer may join an existing ranking");
});

test("a table becomes one ranking that keeps the joined list first", () => {
  const state = { names: ["Zenek", "Grażyna", "Babcia"], answers: [[3, 2, 63, 0, 511, 1023], [0, 0, 0, 502, 0, 0], [1, 1, 21, 60, 7, 8]] };
  const codes = tableCodes(state, 357);
  assert.ok(codes.every((code) => code.startsWith("3")));
  const path = tablePath(codes, "");
  const group = loadGroup(path.split("/")[2], "pl");
  assert.deepEqual(group?.members.map((member) => member.label), ["Zenek", "Grażyna", "Babcia"]);
  assert.equal(group?.members[0].result.score, 100);
  // Joining a ranking: the earlier list stays first, and a full ranking leaves no seats.
  const joined = tablePath(codes.slice(0, 1), "2doy25yboiqpc907l");
  assert.equal(joined, `/grupa/2doy25yboiqpc907l.${codes[0]}`);
  assert.equal(tableCapacity(""), 8);
  assert.equal(tableCapacity(Array.from({ length: 10 }, (_, i) => encodeResult({ ...draft([0, 0, 0, 0, 0, 0]), name: `Osoba${"abcdefghij"[i]}` })).join(".")), 2);
  // Shared symptoms work across IBD-T2 and the short form, by task.
  const t2 = decodeGroup("2doy25yboiqpc907l")![0];
  const a = evaluate(t2, "pl");
  const b = evaluate(draft([2, 2, 40, 27, 39, 201]), "pl");
  assert.ok(sharedFindings(a, b).some((finding) => finding.section === "Plansza I"));
});

test("saved table progress resumes only when it is consistent", () => {
  const good: TableState = {
    names: ["Zenek", "Grażyna"],
    answers: [[3, 2, 63, 0, 511, 1023], [1, 2]],
    person: 1,
    task: 2,
    handover: false,
    seed: 42,
    attempts: ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"],
    untimed: false,
    group: "",
  };
  assert.deepEqual(readTable(JSON.stringify(good)), good);
  assert.ok(readTable(JSON.stringify({ ...good, task: 1 })), "going back keeps the later answer");
  for (const broken of [
    { ...good, answers: [[3, 2], [1, 2]] },
    { ...good, task: 3 },
    { ...good, handover: true },
    { ...good, names: ["Zenek", "zenek"] },
    { ...good, attempts: ["x", "y"] },
    { ...good, answers: [[3, 2, 63, 0, 511, 1024], [1, 2]] },
    { ...good, group: "nonsense" },
  ]) {
    assert.equal(readTable(JSON.stringify(broken)), null, JSON.stringify(broken));
  }
  assert.equal(readTable("{"), null);
});

test("table pages and ranking cards have Slovenian addresses", () => {
  assert.equal(localizePath("/test/przy-stole", "sl"), "/sl/test/za-mizo");
  assert.equal(parsePath("/sl/test/za-mizo").path, "/test/przy-stole");
  assert.equal(localizePath("/grupa/2abc/karta", "sl"), "/sl/lestvica/2abc/kartica");
});
