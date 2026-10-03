import assert from "node:assert/strict";
import { test } from "node:test";
import { TASKS } from "../src/content/test";
import { decodeGroup, decodeResult, encodeResult, evaluate, GROUP_LIMIT, groupPath, radix, SAMPLE_DRAFT } from "../src/lib/test";
import { analyticsUrl } from "../src/lib/analytics-url";
import { checkWriteRequest, readWriteBody } from "../src/lib/write-policy";
import { readProgress } from "../src/lib/test-progress";
import { familyMembers, validFamilyCode } from "../src/lib/family";

test("published T2 sample retains its diagnosis and certificate", () => {
  const draft = decodeResult("2doy25yboiqpc907l");
  assert.ok(draft);
  assert.deepEqual(draft.answers, [3, 2, 2, 2, 40, 2, 27, 2, 1, 41, 39, 3, 3, 2, 1, 201]);
  const result = evaluate(draft, "pl");
  assert.equal(result.score, 83);
  assert.equal(result.certificate, "983095");
  assert.equal(result.diagnosis.name, "Dziaders Grillowo-Motoryzacyjny");
  assert.equal(encodeResult(draft), "2doy25yboiqpc907l");
});

test("retired T1 links still decode and score", () => {
  const draft = decodeResult("1000000000007l");
  assert.ok(draft);
  assert.equal(draft.version, 1);
  assert.equal(draft.answers.length, 24);
  assert.equal(evaluate(draft, "pl").score, 1);
  assert.equal(evaluate(draft, "pl").diagnosis.name, "Dziaders Utajony");
  assert.equal(encodeResult(draft), "1000000000007l");
});

test("all task formats round-trip at their boundaries without changing scores", () => {
  for (let sample = 0; sample < 180; sample++) {
    const answers = TASKS.map((task, i) => (sample * (i + 1) + i) % radix(task));
    const draft = { version: 2 as const, answers, day: 273, name: "Żaneta", proxy: sample % 2 === 0 };
    const decoded = decodeResult(encodeResult(draft));
    assert.deepEqual(decoded, draft);
    const result = evaluate(decoded!, "pl");
    assert.ok(result.score >= 0 && result.score <= 100);
    assert.ok(Number.isInteger(result.score));
    assert.equal(evaluate({ ...draft, name: "" }, "pl").score, result.score);
  }
});

test("rejects corrupt codes and preserves legacy group links", () => {
  for (const code of ["", "2", "2zzzzzzzzzzzzzzz", "../wynik", "1000000000007l~%", "1999999999907l"]) assert.equal(decodeResult(code), null);
  const codes = Array.from({ length: GROUP_LIMIT + 1 }, (_, i) => encodeResult({ ...SAMPLE_DRAFT, day: i }));
  assert.equal(decodeGroup(codes.join(".")), null);
  assert.equal(decodeGroup(codes.slice(0, GROUP_LIMIT).join("."))?.length, GROUP_LIMIT);
  assert.equal(groupPath([codes[0], codes[0], codes[1]]), `/grupa/${codes[0]}.${codes[1]}`);
});

test("analytics never receives result names, invitation tokens or query values", () => {
  const code = encodeResult({ ...SAMPLE_DRAFT, name: "Żaneta" });
  for (const path of [`/wynik/${code}`, `/wynik/${code}/certyfikat?format=relacja`, `/grupa/${code}.${code}`, `/test?grupa=${encodeURIComponent(code)}&rodzina=secret`, "/grupy/abcdef123456", `/profil/zapisz/${code}`]) {
    const clean = analyticsUrl(`https://dziader.si${path}#private`);
    assert.ok(!clean.includes(code) && !clean.includes("secret") && !clean.includes("abcdef123456"));
    assert.equal(new URL(clean).search, "");
    assert.equal(new URL(clean).hash, "");
  }
  assert.equal(analyticsUrl("https://dziader.si/atlas/dziaders-grillowy"), "https://dziader.si/atlas/dziaders-grillowy");
  assert.equal(analyticsUrl("bad input"), "");
});

test("write policy accepts same-origin beacons and rejects cross-site and oversized bodies", async () => {
  const make = (headers: HeadersInit = {}, body = '{"kind":"bingo"}') => new Request("https://dziader.si/api/licznik", { method: "POST", headers, body });
  assert.equal(checkWriteRequest(make({ origin: "https://evil.example" }))?.status, 403);
  assert.equal(checkWriteRequest(make({ "sec-fetch-site": "cross-site" }))?.status, 403);
  assert.equal(checkWriteRequest(make({ "content-length": "9000" }))?.status, 413);
  assert.equal(checkWriteRequest(make({ origin: "https://dziader.si" })), null);
  assert.equal(checkWriteRequest(new Request("http://localhost:3000/api/grupy", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" } })), null);
  assert.equal(checkWriteRequest(make({ origin: "https://evil.example", "x-forwarded-host": "evil.example" }))?.status, 403);
  assert.equal(checkWriteRequest(make({ origin: "null" }))?.status, 403);
  assert.equal(checkWriteRequest(make({ origin: "http://dziader.si" }))?.status, 403);
  assert.deepEqual(await readWriteBody(make()), { kind: "bingo" });
  for (const body of ["null", "[]", "42", "broken", JSON.stringify({ x: "x".repeat(9000) })]) assert.equal(await readWriteBody(make({}, body)), null);
});

test("completed and untimed examinations survive reload; corrupt progress cannot resume", () => {
  const progress = { answers: SAMPLE_DRAFT.answers, current: TASKS.length, name: "", proxy: false, seed: 123, group: "", region: "", untimed: true, attempt: "a53dcc18-e0cd-4e9c-bd09-d87cf2ec35b2", rooms: [0, 1, 2, 3, 4] };
  assert.deepEqual(readProgress(JSON.stringify(progress)), progress);
  assert.equal(readProgress(JSON.stringify({ ...progress, answers: [null, ...progress.answers.slice(1)] })), null);
  assert.equal(readProgress(JSON.stringify({ ...progress, current: 999 })), null);
  assert.equal(readProgress(JSON.stringify({ ...progress, family: "../../bad" })), null);
  assert.equal(readProgress("broken"), null);
});

test("family rankings use the original scorer and keep distinct identical results", () => {
  const code = encodeResult(SAMPLE_DRAFT);
  const group = { id: "a".repeat(32), expires: "2027-01-01", codes: [code, code] };
  const members = familyMembers(group, "pl");
  assert.equal(members.length, 2);
  assert.equal(members[0].result.score, 83);
  assert.notEqual(members[0].label, members[1].label);
  assert.equal(validFamilyCode(code), code);
  assert.equal(validFamilyCode("bad"), null);
});

test("both editions diagnose the same result with their own names", () => {
  const draft = decodeResult("2doy25yboiqpc907l")!;
  const polish = evaluate(draft, "pl");
  const slovenian = evaluate(draft, "sl");
  assert.equal(slovenian.score, polish.score);
  assert.equal(slovenian.certificate, polish.certificate);
  assert.deepEqual(
    slovenian.diagnosis.species.map((species) => species.key),
    polish.diagnosis.species.map((species) => species.key),
  );
  assert.equal(slovenian.diagnosis.name, "Žarno-avtomobilski dziaders");
});
