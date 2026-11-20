import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import type { PGlite } from "@electric-sql/pglite";
import { databaseFixture } from "./database-fixture";

// The signing secret is read when the module loads.
process.env.CRON_SECRET = "test-cron-secret";

let db: PGlite;
before(async () => { db = await databaseFixture({ all: true }); });
after(async () => { await db?.close(); });

const request = async (email: string, edition = "pl") =>
  (await db.query<{ id: string | null }>("select public.request_newsletter_guest($1, $2) as id", [email, edition])).rows[0].id;

test("a guest address gets one confirm letter an hour, none once confirmed", async () => {
  const first = await request("zenek@example.pl");
  assert.ok(first);
  assert.equal(await request("zenek@example.pl", "sl"), null, "a second request within the hour sends nothing");
  await db.query("update public.newsletter_guests set letter_at = now() - interval '2 hours' where id = $1", [first]);
  assert.equal(await request("zenek@example.pl", "sl"), first, "after an hour the same row asks again");
  assert.equal((await db.query<{ edition: string }>("select edition from public.newsletter_guests where id = $1", [first])).rows[0].edition, "sl");
  await db.query("update public.newsletter_guests set confirmed_at = now(), letter_at = now() - interval '2 hours' where id = $1", [first]);
  assert.equal(await request("zenek@example.pl"), null, "confirmed addresses never get another letter");
  await assert.rejects(request("Zenek@Example.pl"), "the server lower-cases addresses before they reach the table");
  await assert.rejects(request("bez-malpy"));
});

test("Monday recipients are subscribed accounts and confirmed guests, each address once", async () => {
  const member = randomUUID();
  await db.query("insert into auth.users (id, email, email_confirmed_at) values ($1, 'jozef@example.pl', now())", [member]);
  await db.query("update public.profiles set newsletter = true where id = $1", [member]);
  const pending = await request("halina@example.pl");
  const confirmed = await request("wiesia@example.pl", "sl");
  const twin = await request("jozef@example.pl");
  await db.query("update public.newsletter_guests set confirmed_at = now() where id = any($1)", [[confirmed, twin]]);

  const { rows } = await db.query<{ id: string; email: string; guest: boolean; edition: string | null; results: string }>("select * from public.newsletter_recipients() order by email");
  assert.deepEqual(rows.map((row) => [row.email, row.guest, row.edition]), [
    ["jozef@example.pl", false, null],
    ["wiesia@example.pl", true, "sl"],
    ["zenek@example.pl", true, "sl"],
  ]);
  assert.ok(!rows.some((row) => row.id === pending), "unconfirmed guests get nothing");
  assert.equal(Number(rows.find((row) => row.guest)!.results), 0);
});

test("visitors cannot read, write or request guest subscriptions directly", async () => {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    try {
      await assert.rejects(db.query("select * from public.newsletter_guests"));
      await assert.rejects(db.query("insert into public.newsletter_guests (email) values ('x@example.pl')"));
      await assert.rejects(db.query("select public.request_newsletter_guest('x@example.pl', 'pl')"));
      await assert.rejects(db.query("select * from public.newsletter_recipients()"));
    } finally { await db.exec("reset role"); }
  }
});

test("confirm and unsubscribe links are signed for their own purpose", async () => {
  const { confirmLink, normalizeEmail, unsubscribeLinks, verifyConfirm, verifyUnsubscribe } = await import("../src/lib/newsletter");
  const id = randomUUID();
  const confirm = new URL(confirmLink(id, "sl", "https://dziader.si"));
  assert.equal(confirm.pathname, "/sl/bilten/potrditev");
  assert.equal(confirm.searchParams.get("u"), id);
  const confirmToken = confirm.searchParams.get("t");
  const unsubscribeToken = new URL(unsubscribeLinks(id, "pl", "https://dziader.si").page).searchParams.get("t");
  assert.ok(verifyConfirm(id, confirmToken));
  assert.ok(verifyUnsubscribe(id, unsubscribeToken));
  assert.ok(!verifyConfirm(id, unsubscribeToken), "an unsubscribe link cannot confirm");
  assert.ok(!verifyUnsubscribe(id, confirmToken), "a confirm link cannot unsubscribe");
  assert.ok(!verifyConfirm(randomUUID(), confirmToken));

  assert.equal(normalizeEmail("  Zenek@Example.PL "), "zenek@example.pl");
  for (const bad of ["", "zenek", "zenek@", "a@b", "ze nek@example.pl", 42, null, `${"x".repeat(250)}@example.pl`]) assert.equal(normalizeEmail(bad), null);
});

test("a guest's bulletin carries no personal figures and its own footnote", async () => {
  const { bulletinLetter, confirmLetter } = await import("../src/emails/bulletin");
  const issue = { week: 47, year: 2026, period: "16–22 listopada", lines: ["Linia."], figures: [], notice: "Komunikat." } as unknown as Parameters<typeof bulletinLetter>[0];
  const member = bulletinLetter(issue, { nickname: "Zenek", results: 2, sightings_week: 1, verdicts: 3, pages_week: 0 }, "https://dziader.si", "u", "pl");
  const guest = bulletinLetter(issue, { nickname: null, results: 0, sightings_week: 0, verdicts: 0, pages_week: 0, guest: true }, "https://dziader.si", "u", "pl");
  assert.ok(member.paragraphs.some((line) => line.startsWith("Twój tydzień")));
  assert.ok(!guest.paragraphs.some((line) => line.startsWith("Twój tydzień")));
  assert.notEqual(guest.note, member.note);
  for (const locale of ["pl", "sl"] as const) {
    const letter = confirmLetter("https://dziader.si/biuletyn/potwierdz?u=x&t=y", locale);
    assert.equal(letter.button?.href, "https://dziader.si/biuletyn/potwierdz?u=x&t=y");
    assert.ok(letter.subject && letter.paragraphs.length === 2 && !letter.unsubscribe);
  }
});
