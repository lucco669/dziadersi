import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanDepartments, cleanNickname, cleanTeamName, docket, teamReport, validDepartment, type TeamGroup } from "../src/lib/team";
import { encodeResult, SAMPLE_DRAFT } from "../src/lib/test";

const high = encodeResult({ ...SAMPLE_DRAFT, name: "Zenek" });
const low = encodeResult({ version: 2, answers: [1, 3, 3, 3, 3, 1, 52, 1, 2, 7, 8, 1, 1, 2, 2, 82], day: 273, name: "Basia" });
const middle = encodeResult({ version: 2, answers: [3, 2, 2, 2, 40, 2, 27, 1, 1, 41, 8, 1, 3, 2, 1, 82], day: 273 });

const team = (entries: TeamGroup["entries"], departments = ["Księgowość", "IT"]): TeamGroup => ({
  id: "0123456789abcdef0123456789abcdef",
  expires: "2027-02-18T00:00:00.000Z",
  kind: "team",
  name: "Biuro Rachunkowe Kaczmarek",
  departments,
  entries,
});

test("team names, departments and nicknames are cleaned like certificate names", () => {
  assert.equal(cleanTeamName("  Biuro  Rachunkowe <b>Kaczmarek</b> & Syn  "), "Biuro Rachunkowe bKaczmarek/b & Syn");
  assert.equal(cleanTeamName("Dział 2 (IT)"), "Dział 2 (IT)");
  assert.equal(cleanTeamName("x".repeat(80)).length, 60);
  assert.equal(cleanTeamName("Kurwa Mać sp. z o.o."), "");
  assert.equal(cleanTeamName(42), "");
  assert.deepEqual(cleanDepartments([" Księgowość ", "", "IT", "  "]), ["Księgowość", "IT"]);
  assert.deepEqual(cleanDepartments(undefined), []);
  assert.equal(cleanDepartments(["IT", "it"]), null);
  assert.equal(cleanDepartments(Array.from({ length: 9 }, (_, i) => `Dział ${i}`)), null);
  assert.equal(cleanDepartments("IT"), null);
  assert.equal(cleanNickname("  Marek z IT 2000 "), "Marek z IT");
  assert.equal(cleanNickname(""), "");
});

test("a department must be one the team has, or none when it has none", () => {
  assert.equal(validDepartment(1, ["A", "B"]), 1);
  assert.equal(validDepartment(2, ["A", "B"]), undefined);
  assert.equal(validDepartment(null, ["A", "B"]), undefined);
  assert.equal(validDepartment("1", ["A", "B"]), undefined);
  assert.equal(validDepartment(null, []), null);
  assert.equal(validDepartment(undefined, []), null);
  assert.equal(validDepartment(0, []), undefined);
});

test("three people in two departments: table, pairs, call risk and the Commission's ruling", () => {
  const checkup = team([
    { code: high, nickname: "Zenek", department: 0 },
    { code: low, nickname: "Basia", department: 1 },
    { code: middle, nickname: "Marek z IT", department: 1 },
  ]);
  for (const locale of ["pl", "sl"] as const) {
    const report = teamReport(checkup, locale);
    assert.deepEqual(report.members.map((member) => member.label), ["Zenek", "Basia", "Marek z IT"]);
    assert.deepEqual(report.rows.map((row) => [row.name, row.members.length]), [["Księgowość", 1], ["IT", 2]]);
    assert.equal(report.rows[0].average, report.members[0].result.score);
    assert.equal(report.rows[1].average, Math.round((report.members[1].result.score + report.members[2].result.score) / 2));
    assert.ok(report.rows.every((row) => row.risk >= 0 && row.risk <= 100));
    assert.equal(report.riskiest?.risk, Math.max(...report.rows.map((row) => row.risk)));
    assert.ok(report.best && report.worst && report.best.value >= report.worst.value);
    assert.equal(report.order[0].label, "Zenek");
    assert.ok(report.verdict);
    assert.ok(["nie", "tak", "kliniczne"].includes(report.verdict.key));
    assert.equal(report.verdict.orders.length, 3);
    assert.ok(report.verdict.grounds.some((line) => line.includes(report.riskiest!.name)));
  }
});

test("a team without departments is one department, and an empty team has no ruling", () => {
  const flat = teamReport(team([{ code: high, nickname: "Zenek", department: null }], []), "pl");
  assert.deepEqual(flat.rows.map((row) => [row.index, row.name, row.members.length]), [[null, "Cały zespół", 1]]);
  assert.equal(flat.best, undefined);
  const empty = teamReport(team([]), "sl");
  assert.equal(empty.verdict, null);
  assert.equal(empty.riskiest, null);
  assert.deepEqual(empty.rows.map((row) => row.members.length), [0, 0]);
});

test("results carry the Korporacyjny affinity the call index reads, and the docket comes from the id", () => {
  const korpo = teamReport(team([{ code: high, nickname: "A", department: 0 }]), "pl").members[0].result;
  assert.ok(korpo.affinity.korpo !== undefined);
  assert.equal(docket(team([])), "IBD-Z 0123/4567");
});
