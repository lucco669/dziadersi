import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";

/** Ephemeral Postgres, using the same migrations as production. No external credentials. */
export async function databaseFixture() {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  // Supabase's auth schema, as far as the migrations reference it.
  await db.exec("create schema auth; create table auth.users (id uuid primary key);");
  for (const file of ["20261002130000_results.sql", "20261003100000_groups_and_write_limits.sql", "20261120120000_word_of_year.sql"]) {
    await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
  }
  return db;
}
