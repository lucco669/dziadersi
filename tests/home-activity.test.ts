import assert from "node:assert/strict";
import test from "node:test";
import { warsawTime } from "../src/lib/calendar";
import { homeActivity } from "../src/lib/home-activity";

test("the homepage changes activities at Warsaw midnight in each edition", () => {
  const cases = [
    ["2026-11-21T22:59:59Z", "grill", "grill"],
    ["2026-11-21T23:00:00Z", "andrzejki", "grill"],
    ["2026-11-30T22:59:59Z", "andrzejki", "grill"],
    ["2026-11-30T23:00:00Z", "table", "table"],
    ["2026-12-24T12:00:00Z", "table", "table"],
    ["2026-12-26T22:59:59Z", "table", "table"],
    ["2026-12-26T23:00:00Z", "sylwester", "sylwester"],
    ["2026-12-31T22:59:59Z", "sylwester", "sylwester"],
    ["2026-12-31T23:00:00Z", "grill", "grill"],
    ["2027-06-01T12:00:00Z", "grill", "grill"],
  ] as const;
  for (const [instant, pl, sl] of cases) {
    const { month, day } = warsawTime(new Date(instant));
    assert.equal(homeActivity(month, day, "pl"), pl, instant);
    assert.equal(homeActivity(month, day, "sl"), sl, instant);
  }
});
