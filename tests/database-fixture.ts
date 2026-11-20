import { PGlite } from "@electric-sql/pglite";
import { readdir, readFile } from "node:fs/promises";

/**
 * Ephemeral Postgres, using the same migrations as production. No external credentials.
 * By default only the census and write-limit migrations; `all` runs every migration in order,
 * on a minimal stand-in for Supabase's auth schema (auth.users and auth.uid()).
 */
export async function databaseFixture({ all = false }: { all?: boolean } = {}) {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  if (all) {
    await db.exec(`
      create schema auth;
      create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz, raw_user_meta_data jsonb, created_at timestamptz not null default now());
      create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
    `);
  }
  const files = all
    ? (await readdir("supabase/migrations")).filter((file) => file.endsWith(".sql")).sort()
    : ["20261002130000_results.sql", "20261003100000_groups_and_write_limits.sql"];
  for (const file of files) {
    await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
  }
  return db;
}
