import assert from "node:assert/strict";
import { test } from "node:test";
import { getQueueEvents, QUEUE_EVENTS } from "../src/content/queue";
import { overlayProblems } from "../src/i18n/overlay";
import { actionEffect, canChoose, chooseQueue, dailyQueueSeed, managerOutcome, newQueue, parseQueueCode, queueCode, queueDeck, queueEventIndex, queueScore, restoreQueue, saveQueue, type QueueAction } from "../src/lib/queue";
import { localizePath, switchPath } from "../src/i18n/routes";

test("queue translations preserve all encounters and mechanics", () => {
  const sl = getQueueEvents("sl");
  assert.equal(sl.length, QUEUE_EVENTS.length);
  assert.deepEqual(overlayProblems, []);
  QUEUE_EVENTS.forEach((event, i) => {
    assert.notEqual(sl[i].title, event.title);
    assert.equal(sl[i].id, event.id);
    assert.equal(sl[i].choices.length, 3);
    event.choices.forEach((choice, j) => {
      assert.notEqual(sl[i].choices[j].label, choice.label);
      assert.notEqual(sl[i].choices[j].reply, choice.reply);
      assert.deepEqual(sl[i].choices[j].effect, choice.effect);
      assert.ok(choice.effect.minutes >= 2);
    });
  });
  assert.equal(localizePath("/kolejka", "sl"), "/sl/cakalna-vrsta");
  assert.equal(switchPath("/sl/cakalna-vrsta", "pl"), "/kolejka");
});

test("challenge codes and deterministic decks are bounded and reproducible", () => {
  for (const seed of [1, 41, 20261007, 0xffffffff]) {
    assert.equal(parseQueueCode(queueCode(seed)), seed);
    assert.deepEqual(queueDeck(seed), queueDeck(seed));
    assert.equal(new Set(queueDeck(seed)).size, QUEUE_EVENTS.length);
  }
  for (const bad of [null, "", "0.abc", "1.0", "1.01", "1.-1", "1.zzzzzzz", "1.1junk!", "2.123"]) assert.equal(parseQueueCode(bad), null);
  assert.notDeepEqual(queueDeck(1), queueDeck(2));
  assert.equal(dailyQueueSeed(new Date("2026-10-07T22:30:00Z")), 20261008);
});

test("authority requirements, single-use manager and terminal states cannot be bypassed", () => {
  const state = { ...newQueue(41), authority: 0 };
  const choices: QueueAction[] = [0, 1, 2];
  for (const action of choices) if (actionEffect(state, action).authority < 0) assert.equal(chooseQueue(state, action), state);
  const used = chooseQueue(state, "manager");
  assert.equal(used.managerUsed, true);
  assert.equal(chooseQueue(used, "manager"), used);
  assert.equal(chooseQueue(state, 8 as QueueAction), state);
  const closed = chooseQueue({ ...newQueue(41), minutes: 1, ahead: 1 }, 0);
  assert.equal(closed.status, "closed");
  assert.equal(chooseQueue(closed, 1), closed);
  const base = newQueue(41);
  const angry = choices.find((action) => actionEffect(base, action).irritation > 0)!;
  assert.equal(chooseQueue({ ...base, irritation: 99 }, angry).status, "walked");
  assert.ok(managerOutcome(base) >= 0 && managerOutcome(base) < 3);
});

test("saved decisions replay exactly, reject malformed or impossible saves", () => {
  let state = newQueue(20261007);
  state = chooseQueue(state, 0);
  state = chooseQueue(state, "manager");
  assert.deepEqual(restoreQueue(saveQueue(state)), state);
  for (const raw of ["null", "{}", "broken", JSON.stringify({ version: 1, seed: 1, actions: ["manager", "manager"] }), JSON.stringify({ version: 1, seed: 1, actions: [null] }), JSON.stringify({ version: 2, seed: 1, actions: [] })]) assert.equal(restoreQueue(raw), null);
});

test("version 1 sample keeps its encounters and scoring", () => {
  let state = newQueue(20261007);
  const ids: string[] = [];
  for (const action of [1, 0, "manager", 2, 0, 0] as const) {
    ids.push(QUEUE_EVENTS[queueEventIndex(state)].id);
    state = chooseQueue(state, action);
  }
  assert.deepEqual(ids, ["form", "witness", "delivery", "return", "draft", "pen"]);
  assert.deepEqual([state.status, state.minutes, state.irritation, state.authority], ["served", 18, 59, 51]);
  assert.equal(queueScore(state), 948);
});

test("a sensible strategy can finish varied queues, and every play is finite", () => {
  for (let seed = 1; seed <= 200; seed++) {
    let state = newQueue(seed);
    while (state.status === "playing") {
      const event = QUEUE_EVENTS[queueEventIndex(state)];
      const choices = ([0, 1, 2] as const).filter((a) => canChoose(state, a));
      assert.ok(choices.length > 0);
      choices.sort((a, b) => {
        const value = (i: 0 | 1 | 2) => { const e = event.choices[i].effect; return e.advance * 12 - e.minutes - Math.max(0, state.irritation + e.irritation - 70) * 2 + e.authority / 4; };
        return value(b) - value(a);
      });
      state = chooseQueue(state, choices[0]);
      assert.ok(state.actions.length <= 20);
      assert.ok(state.irritation >= 0 && state.irritation <= 100);
      assert.ok(state.authority >= 0 && state.authority <= 100);
    }
    assert.equal(state.status, "served", `seed ${seed}`);
    let slow = newQueue(seed);
    while (slow.status === "playing") slow = chooseQueue(slow, ([0, 1, 2] as const).find((a) => canChoose(slow, a))!);
    assert.ok(slow.actions.length <= 20);
  }
});
