import assert from "node:assert/strict";
import { test } from "node:test";
import { getRivalries, RIVALRIES, rivalryKey } from "../src/content/seating";
import { SPECIES, type SpeciesKey } from "../src/content/species";
import { analyticsUrl } from "../src/lib/analytics-url";
import {
  assess,
  decodePlan,
  encodePlan,
  MAX_GUESTS,
  MIN_GUESTS,
  optimalOrder,
  pairRisk,
  pairSubject,
  placeCount,
  planCost,
  protocolNumber,
  reorder,
  samplePlan,
  seatingLayout,
  shortName,
  switchMode,
  type Plan,
  type TableMode,
} from "../src/lib/seating";

const KEYS = SPECIES.map((species) => species.key);
const plan = (mode: TableMode, keys: (SpeciesKey | null)[], labels: string[] = []): Plan => ({
  mode,
  seats: keys.map((species, i) => ({ species, label: labels[i] ?? "" })),
});

test("rivalries name two Atlas species once, with a risk and a subject in both editions", () => {
  const keys = RIVALRIES.map(rivalryKey);
  assert.equal(new Set(keys).size, keys.length);
  for (const rivalry of RIVALRIES) {
    assert.ok(KEYS.includes(rivalry.a) && KEYS.includes(rivalry.b) && rivalry.a !== rivalry.b);
    assert.ok(rivalry.risk >= 50 && rivalry.risk <= 95);
  }
  getRivalries("sl").forEach((rivalry, i) => assert.notEqual(rivalry.subject, RIVALRIES[i].subject));
});

test("pair risk is symmetric, bounded, and zero next to the wanderer's empty place", () => {
  for (const mode of ["wigilia", "wesele"] as const) {
    for (const a of KEYS) {
      assert.deepEqual(pairRisk(a, null, mode), { risk: 0, reason: "empty" });
      for (const b of KEYS) {
        const forward = pairRisk(a, b, mode);
        assert.deepEqual(forward, pairRisk(b, a, mode));
        assert.ok(forward.risk >= 2 && forward.risk <= 97, `${a}+${b}`);
      }
    }
  }
});

test("natural enemies outrank strangers, strangers outrank related species", () => {
  const start = pairRisk("moto", "smart", "wigilia");
  assert.equal(start.reason, "rivalry");
  assert.ok(start.risk >= 80);
  assert.equal(pairSubject("moto", "smart", "pl"), "system start-stop");
  assert.equal(pairSubject("moto", "smart", "sl"), "sistem start-stop");
  const strangers = pairRisk("wedka", "festiwalowy", "wigilia");
  const related = pairRisk("grill", "dzialka", "wigilia");
  assert.equal(strangers.reason, "plain");
  assert.equal(related.reason, "related");
  assert.ok(start.risk > strangers.risk && strangers.risk > related.risk);
  // Two of a kind compete for one niche, named after their strongest trait.
  assert.equal(pairRisk("grill", "grill", "wesele").reason, "same");
  assert.equal(pairSubject("grill", "grill", "pl"), "kontrola nad szczypcami");
  assert.equal(pairSubject("wedka", "festiwalowy", "pl"), null);
});

test("the season matters: the Wigilijny is at its most active in December", () => {
  assert.ok(pairRisk("wigilijny", "korpo", "wigilia").risk > pairRisk("wigilijny", "korpo", "wesele").risk);
  assert.ok(pairRisk("grill", "grill", "wesele").risk > pairRisk("grill", "grill", "wigilia").risk);
});

test("layouts: every guest count fits, places have neighbours, Wigilia adds the empty place", () => {
  for (const mode of ["wigilia", "wesele"] as const) {
    for (let guests = MIN_GUESTS; guests <= MAX_GUESTS; guests++) {
      const places = placeCount(mode, guests);
      const layout = seatingLayout(mode, places);
      assert.equal(layout.places.length, places);
      const beside = new Array(places).fill(0);
      for (const edge of layout.edges) {
        assert.ok(edge.a !== edge.b && edge.a < places && edge.b < places);
        if (edge.kind === "beside") {
          beside[edge.a]++;
          beside[edge.b]++;
        }
      }
      // A long table's corner places have one neighbour; round tables have two everywhere.
      for (const count of beside) assert.ok(mode === "wigilia" ? count >= 1 && count <= 2 : count === 2);
      for (const place of layout.places) assert.ok(place.x > 0 && place.x < layout.width && place.y > 0 && place.y < layout.height);
    }
  }
  assert.equal(seatingLayout("wesele", 10).tables.length, 1);
  assert.equal(seatingLayout("wesele", 11).tables.length, 2);
});

test("codes round-trip with labels and reject what is not a plan", () => {
  const sample = samplePlan("wigilia", "pl");
  const code = encodePlan(sample);
  assert.match(code, /^wigilia-[0-9a-r_]{9}~/);
  assert.deepEqual(decodePlan(code), sample);
  assert.deepEqual(decodePlan(encodeURIComponent(code)), sample);
  const bare = plan("wesele", ["moto", "smart", "grill", "wedka", "korpo", "budowa"]);
  assert.equal(encodePlan(bare), "wesele-360892");
  assert.deepEqual(decodePlan("wesele-360892"), bare);
  for (const bad of ["wesele-36089", "wesele-360892_", "wigilia-360892", "wigilia-36_08_92", "obiad-360892", "wesele-3608z2", "wesele-" + "0".repeat(15), "", "wesele-360892~%%%"]) {
    assert.equal(decodePlan(bad), null, bad);
  }
  // Labels that don't match the places are dropped, never shifted onto someone else.
  assert.deepEqual(decodePlan(`wesele-360892~${Buffer.from("a|b").toString("base64url")}`)?.seats.map((seat) => seat.label), ["", "", "", "", "", ""]);
});

test("labels are cleaned like names on certificates", () => {
  const labelled = plan("wesele", ["moto", "smart", "grill", "wedka", "korpo", "budowa"], ["Wujek Rysiek <script>", "kurwa", "Żaneta Łęcka-Ślązak z Pcimia Dolnego", "", "ciocia | Halina", "teść"]);
  const labels = decodePlan(encodePlan(labelled))!.seats.map((seat) => seat.label);
  assert.deepEqual(labels, ["Wujek Rysiek script", "", "Żaneta Łęcka-Ślązak z Pc", "", "ciocia Halina", "teść"]);
  assert.ok(labels.every((label) => label.length <= 24));
});

test("assessment: flashpoints are named, the worst first; the wanderer's place calms the table", () => {
  const result = assess(plan("wigilia", ["moto", "smart", "wedka", null, "grill", "dzialka", "korpo"]));
  assert.ok(result.flashpoints.length >= 1);
  const top = result.flashpoints[0];
  // The Motoryzacyjny at the head, the Smart-Home first on his right.
  assert.deepEqual([top.a, top.b].sort(), [0, 1]);
  assert.equal(top.reason, "rivalry");
  for (let i = 1; i < result.flashpoints.length; i++) assert.ok(result.flashpoints[i - 1].risk >= result.flashpoints[i].risk);
  assert.ok(result.index >= 0 && result.index <= 100);
  assert.ok(Math.abs(result.disputes - result.pairs.reduce((sum, pair) => sum + pair.risk, 0) / 100) < 1e-9);
  const calm = assess(plan("wesele", ["grill", "dzialka", "wedka", "zeglarz", "wakacje", "kempingowy"]));
  assert.equal(calm.flashpoints.length, 0);
  assert.equal(calm.verdict, "calm");
  const hostile = assess(plan("wesele", ["moto", "smart", "korpo", "bieszczadzki", "smart", "meteorologiczny"]));
  assert.equal(hostile.verdict, "emergency");
});

test("the Institute's arrangement is a permutation, never worse, and deterministic", () => {
  for (const mode of ["wigilia", "wesele"] as const) {
    for (let guests = MIN_GUESTS; guests <= MAX_GUESTS; guests += 4) {
      const next = (seed: number) => KEYS[(seed * 7 + guests * 3) % KEYS.length];
      const keys: (SpeciesKey | null)[] = Array.from({ length: guests }, (_, i) => next(i));
      if (mode === "wigilia") keys.splice(2, 0, null);
      const start = plan(mode, keys);
      const order = optimalOrder(start);
      assert.deepEqual([...order].sort((a, b) => a - b), keys.map((_, i) => i));
      assert.deepEqual(optimalOrder(start), order);
      const layout = seatingLayout(mode, keys.length);
      assert.ok(planCost(order.map((i) => keys[i]), layout, mode) <= planCost(keys, layout, mode));
    }
  }
});

test("the arrangement finds the true optimum on small tables (checked by brute force)", () => {
  const cases: [TableMode, (SpeciesKey | null)[]][] = [
    ["wigilia", ["moto", "smart", "korpo", "wigilijny", "festiwalowy", "kibicowski", null]],
    ["wesele", ["moto", "smart", "grzybiarz", "meteorologiczny", "wedka", "kolejkowy", "weselny"]],
    ["wigilia", ["golebiarz", "parapetowy", "grill", "wigilijny", "przygraniczny", "oszczednosciowy", null]],
  ];
  for (const [mode, keys] of cases) {
    const layout = seatingLayout(mode, keys.length);
    let best = Infinity;
    const permute = (rest: (SpeciesKey | null)[], chosen: (SpeciesKey | null)[]) => {
      if (!rest.length) best = Math.min(best, planCost(chosen, layout, mode));
      rest.forEach((key, i) => permute([...rest.slice(0, i), ...rest.slice(i + 1)], [...chosen, key]));
    };
    permute(keys, []);
    const found = optimalOrder(plan(mode, keys));
    assert.ok(Math.abs(planCost(found.map((i) => keys[i]), layout, mode) - best) < 1e-9, `${mode}: ${keys.join(",")}`);
  }
});

test("the sample plans start with work to do and end calmer", () => {
  for (const mode of ["wigilia", "wesele"] as const) {
    for (const locale of ["pl", "sl"] as const) {
      const sample = samplePlan(mode, locale);
      assert.equal(sample.seats.length, placeCount(mode, 8));
      const before = assess(sample);
      assert.ok(before.flashpoints.length >= 2, `${mode} ${locale}`);
      const after = assess(reorder(sample, optimalOrder(sample)));
      assert.ok(after.index < before.index);
      assert.equal(after.flashpoints.length, 0);
    }
  }
});

test("switching the occasion adds or removes the empty place and keeps everyone", () => {
  const wigilia = samplePlan("wigilia", "pl");
  const wesele = switchMode(wigilia, "wesele");
  assert.equal(wesele.seats.length, 8);
  assert.ok(wesele.seats.every((seat) => seat.species));
  const back = switchMode(wesele, "wigilia");
  assert.equal(back.seats.filter((seat) => !seat.species).length, 1);
  assert.notEqual(decodePlan(encodePlan(back)), null);
});

test("protocol numbers are stable, short names drop the word dziaders", () => {
  const sample = samplePlan("wesele", "pl");
  assert.equal(protocolNumber(sample), protocolNumber(decodePlan(encodePlan(sample))!));
  assert.match(protocolNumber(sample), /^\d{4}$/);
  assert.equal(shortName("moto", "pl"), "Motoryzacyjny");
  assert.equal(shortName("smart", "pl"), "Smart-Home");
  assert.equal(shortName("grill", "sl"), "Žarni");
  assert.equal(shortName("golebiarz", "pl"), "Gołębiarz");
});

test("analytics never receives a seating plan or its labels", () => {
  const code = encodePlan(samplePlan("wigilia", "pl"));
  for (const path of [`/plan-stolu/${code}`, `/plan-stolu/${code}/karta?format=relacja`, `/sl/sedezni-red/${code}`, `/sl/sedezni-red/${code}/kartica`]) {
    const clean = analyticsUrl(`https://dziader.si${path}`);
    assert.ok(!clean.includes(code.split("~")[0]) && !clean.includes("~"), clean);
  }
  assert.equal(analyticsUrl("https://dziader.si/plan-stolu"), "https://dziader.si/plan-stolu");
});
