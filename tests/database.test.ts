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
