import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { randomUUID } from "node:crypto";
import type { PGlite } from "@electric-sql/pglite";
import { databaseFixture } from "./database-fixture";

let db: PGlite;
const code = "2doy25yboiqpc907l";
before(async () => { db = await databaseFixture(); });
after(async () => { await db?.close(); });

test("database budgets are shared and refuse excess requests", async () => {
  const take = (key: string) => db.query<{ allowed: boolean }>("select public.take_write_budget('results', $1, 3) as allowed", [key]);
  const responses = await Promise.all(Array.from({ length: 12 }, () => take("a".repeat(64))));
  assert.equal(responses.filter((r) => r.rows[0].allowed).length, 3);
  assert.equal((await take("b".repeat(64))).rows[0].allowed, true);
  await db.query("update public.write_budgets set window_start = now() - interval '2 days'");
  assert.equal((await take("a".repeat(64))).rows[0].allowed, true);
  assert.equal((await db.query("select * from public.write_budgets")).rows.length, 1);
});

test("retrying an examination writes once, while distinct identical examinations both count", async () => {
  const attempt = randomUUID();
  const insert = (id: string) => db.query("insert into public.results(code, version, score, answers, submission_key) values ($1, 2, 83, ARRAY[1]::smallint[], $2) on conflict (submission_key) do nothing", [code, id]);
  await Promise.all([insert(attempt), insert(attempt), insert(randomUUID())]);
  assert.equal((await db.query("select * from public.results")).rows.length, 2);
});

test("family joins are idempotent and cannot exceed twelve members", async () => {
  const id = "a".repeat(32);
  const first = randomUUID();
  await db.query("select public.create_family_group($1, $2, $3)", [id, first, code]);
  const join = (attempt: string) => db.query<{ status: string }>("select public.join_family_group($1, $2, $3) as status", [id, attempt, code]);
  assert.equal((await join(first)).rows[0].status, "repeated");
  const responses = await Promise.all(Array.from({ length: 20 }, () => join(randomUUID())));
  assert.equal(responses.filter((r) => r.rows[0].status === "joined").length, 11);
  assert.equal(responses.filter((r) => r.rows[0].status === "full").length, 9);
  assert.equal((await join(first)).rows[0].status, "repeated");
  assert.equal((await db.query("select * from public.family_members where group_id = $1", [id])).rows.length, 12);
});

test("expired invitations reject joins and cleanup cascades to members", async () => {
  const id = "b".repeat(32);
  await db.query("select public.create_family_group($1, $2, $3)", [id, randomUUID(), code]);
  await db.query("update public.family_groups set expires_at = now() - interval '1 second' where id = $1", [id]);
  const joined = await db.query<{ status: string }>("select public.join_family_group($1, $2, $3) as status", [id, randomUUID(), code]);
  assert.equal(joined.rows[0].status, "missing");
  await db.query("delete from public.family_groups where expires_at <= now()");
  assert.equal((await db.query("select * from public.family_members where group_id = $1", [id])).rows.length, 0);
});

test("group creation is atomic and public roles cannot read or write private tables", async () => {
  const id = "c".repeat(32);
  await assert.rejects(db.query("select public.create_family_group($1, $2, $3)", [id, randomUUID(), "bad"]));
  assert.equal((await db.query("select * from public.family_groups where id = $1", [id])).rows.length, 0);
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    try {
      await assert.rejects(db.query("select * from public.family_members"));
      await assert.rejects(db.query("select public.join_family_group($1, $2, $3)", [id, randomUUID(), code]));
      await assert.rejects(db.query("select public.take_write_budget('results', $1, 30)", ["d".repeat(64)]));
    } finally { await db.exec("reset role"); }
  }
});

test("word of the year: one vote per browser and per account, the first vote stands", async () => {
  const vote = (phrase: string, browser: string, user: string | null = null, year = 2026) =>
    db.query<{ result: string; recorded: string }>("select * from public.cast_word_vote($1::smallint, $2, $3, $4)", [year, phrase, browser, user]);
  const browser = randomUUID();
  assert.deepEqual((await vote("diesel-to-jest-diesel", browser)).rows[0], { result: "counted", recorded: "diesel-to-jest-diesel" });
  // The same browser again, also after signing in: the first vote stands.
  assert.deepEqual((await vote("ja-tu-stalem", browser)).rows[0], { result: "repeated", recorded: "diesel-to-jest-diesel" });
  const user = randomUUID();
  await db.query("insert into auth.users (id) values ($1)", [user]);
  assert.equal((await vote("ja-tu-stalem", browser, user)).rows[0].result, "repeated");
  // A signed-in voter on another browser counts once, and a second browser of the same account doesn't count.
  assert.equal((await vote("ja-tu-stalem", randomUUID(), user)).rows[0].result, "counted");
  assert.deepEqual((await vote("zrobmy-calla", randomUUID(), user)).rows[0], { result: "repeated", recorded: "ja-tu-stalem" });
  // Next year is a new vote.
  assert.equal((await vote("zrobmy-calla", browser, null, 2027)).rows[0].result, "counted");
  // Simultaneous retries from one browser write once.
  const racing = randomUUID();
  const results = await Promise.all(Array.from({ length: 6 }, () => vote("zrobmy-calla", racing)));
  assert.equal(results.filter((r) => r.rows[0].result === "counted").length, 1);
  const tally = await db.query<{ phrase: string; n: string }>("select phrase, n from public.word_tally(2026::smallint) order by phrase");
  assert.deepEqual(tally.rows.map((row) => [row.phrase, Number(row.n)]), [["diesel-to-jest-diesel", 1], ["ja-tu-stalem", 1], ["zrobmy-calla", 1]]);
  await assert.rejects(vote("Nie Słowo", randomUUID()));
  // Deleting the account keeps the vote, without its owner.
  await db.query("delete from auth.users where id = $1", [user]);
  assert.equal((await db.query("select * from public.word_votes where year = 2026")).rows.length, 3);
});

test("word of the year votes are server-only", async () => {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    try {
      await assert.rejects(db.query("select * from public.word_votes"));
      await assert.rejects(db.query("insert into public.word_votes (year, phrase, browser_key) values (2026, 'zrobmy-calla', $1)", [randomUUID()]));
      await assert.rejects(db.query("select * from public.cast_word_vote(2026::smallint, 'zrobmy-calla', $1, null)", [randomUUID()]));
      await assert.rejects(db.query("select * from public.word_tally(2026::smallint)"));
    } finally { await db.exec("reset role"); }
  }
});
