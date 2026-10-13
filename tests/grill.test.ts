import assert from "node:assert/strict";
import { test } from "node:test";
import { advanceGrill, dailyGrillSeed, dismissGrillHazard, GRILL_SECONDS, grillRank, newGrill, readGrillBest, sausageBurnt, tapGrill, type GrillState, type Sausage } from "../src/lib/grill";
import { localizePath, switchPath } from "../src/i18n/routes";
import { sections } from "../src/lib/site";

const single = (): GrillState => ({ ...newGrill(42), slots: [newGrill(42).slots[0], null, null, null, null, null], nextEvent: 100 });
const cook = (state: GrillState, extra = 0.2) => advanceGrill(state, (state.slots[0]!.target - state.slots[0]!.sides[state.slots[0]!.side] + extra));

test("grill seeds are stable and slots differ in cooking time", () => {
  assert.deepEqual(newGrill(42), newGrill(42));
  assert.equal(newGrill(42).slots.length, 6);
  assert.notEqual(newGrill(42).slots[0]?.target, newGrill(42).slots[1]?.target);
  assert.throws(() => newGrill(NaN)); assert.throws(() => newGrill(-1));
});

test("a flip retains the first side and heats the second independently", () => {
  const first = cook(single());
  const flipped = tapGrill(first, 0);
  assert.equal(flipped.notice?.kind, "perfectFlip");
  assert.deepEqual(flipped.slots[0]!.sides, [first.slots[0]!.sides[0], 0]);
  const second = advanceGrill(flipped, 1);
  assert.equal(second.slots[0]!.sides[0], first.slots[0]!.sides[0]);
  assert.equal(second.slots[0]!.sides[1], 1);
  assert.equal(first.slots[0]!.side, 0, "previous state stays immutable");
});

test("two well timed sides make a perfect portion, never an uncooked one", () => {
  const served = tapGrill(cook(tapGrill(cook(single()), 0)), 0);
  assert.equal(served.perfect, 1); assert.equal(served.served, 1); assert.equal(served.score, 100);
  assert.equal(served.slots[0], null);
  const premature = tapGrill(tapGrill(single(), 0), 0);
  assert.equal(premature.served, 0); assert.equal(premature.raw, 1); assert.equal(premature.score, 0);
  const firstSideRaw = tapGrill(cook(tapGrill(single(), 0)), 0);
  assert.equal(firstSideRaw.raw, 1); assert.equal(firstSideRaw.perfect, 0);
});

test("perfect series bonus is capped and ordinary servings reset the series", () => {
  let state = single();
  for (let i = 0; i < 7; i++) {
    const sausage: Sausage = { id: i, sides: [6, 6], side: 1, target: 5.8, burnAt: 9 };
    state = tapGrill({ ...state, slots: [sausage, null, null, null, null, null] }, 0);
  }
  assert.equal(state.score, 100 + 125 + 150 + 175 + 200 + 200 + 200);
  assert.equal(state.bestCombo, 7);
  state = tapGrill({ ...state, slots: [{ id: 8, sides: [8, 6], side: 1, target: 5.8, burnAt: 9 }, null, null, null, null, null] }, 0);
  assert.equal(state.combo, 0); assert.equal(state.bestCombo, 7); assert.equal(state.notice?.points, 65);
});

test("burning increases smoke, clearing costs points, and unattended burns end the round", () => {
  const burned = advanceGrill(single(), 12);
  assert.ok(sausageBurnt(burned.slots[0]!)); assert.ok(burned.smoke > 0);
  const cleared = tapGrill({ ...burned, score: 100, combo: 2 }, 0);
  assert.equal(cleared.burnt, 1); assert.equal(cleared.score, 70); assert.equal(cleared.combo, 0);
  const end = advanceGrill(newGrill(42), 90);
  assert.equal(end.status, "finished"); assert.equal(end.smoke, 100); assert.equal(end.burnt, 3);
  assert.equal(grillRank(end), "smoke");
});

test("hazards reward one dismissal and expired tongs lock cooking controls", () => {
  const wasp = advanceGrill({ ...single(), nextEvent: 16 }, 16);
  assert.equal(wasp.hazard?.kind, "wasp");
  const defended = dismissGrillHazard(wasp);
  assert.equal(defended.score, 25); assert.equal(defended.swatted, 1);
  assert.equal(dismissGrillHazard(defended), defended);
  const tongs: GrillState = { ...single(), hazard: { kind: "tongs", left: 0.1, x: 50, y: 50 }, score: 100, combo: 3 };
  const expired = advanceGrill(tongs, .1);
  assert.equal(expired.locked, 2.5); assert.equal(expired.score, 80); assert.equal(expired.combo, 0);
  assert.equal(tapGrill(expired, 0), expired);
  assert.equal(advanceGrill(expired, 2.5).locked, 0);
});

test("time expires exactly, terminal input is inert, and invalid time cannot corrupt state", () => {
  const state: GrillState = { ...single(), slots: Array(6).fill(null), elapsed: 89.7 };
  const end = advanceGrill(state, 4);
  assert.equal(end.elapsed, GRILL_SECONDS); assert.equal(end.status, "finished");
  assert.equal(tapGrill(end, 0), end); assert.equal(advanceGrill(end, 1), end);
  assert.equal(advanceGrill(state, Infinity), state); assert.equal(advanceGrill(state, -1), state);
  assert.equal(tapGrill(state, NaN), state); assert.equal(tapGrill(state, 6), state);
});

test("daily layout uses Warsaw midnight and both editions have matching routes and menus", () => {
  assert.equal(dailyGrillSeed(new Date("2026-10-12T22:01:00Z")), dailyGrillSeed(new Date("2026-10-13T12:00:00Z")));
  assert.notEqual(dailyGrillSeed(new Date("2026-10-12T21:59:00Z")), dailyGrillSeed(new Date("2026-10-12T22:01:00Z")));
  assert.equal(localizePath("/krol-grilla", "sl"), "/sl/kralj-zara");
  assert.equal(switchPath("/sl/kralj-zara", "pl"), "/krol-grilla");
  assert.deepEqual(sections("pl").map((section) => section.href), sections("sl").map((section) => section.href));
});

test("malformed stored scores cannot poison the record", () => {
  for (const value of [null, "", "NaN", "Infinity", "-3", "3.5", "1000001", "99999999"]) assert.equal(readGrillBest(value), 0);
  assert.equal(readGrillBest("12345"), 12345);
});
