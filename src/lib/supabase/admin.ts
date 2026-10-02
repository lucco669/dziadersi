import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/*
 * Supabase as the Institute: the secret key bypasses row-level security.
 * Server-only. Used for the anonymous census, which no visitor may read or write directly,
 * and for deleting accounts.
 */

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";

export const hasAdmin = Boolean(SUPABASE_URL && SECRET_KEY);

export function createAdminClient() {
  if (!hasAdmin) throw new Error("Supabase: brak NEXT_PUBLIC_SUPABASE_URL albo SUPABASE_SECRET_KEY.");
  return createClient(SUPABASE_URL, SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
