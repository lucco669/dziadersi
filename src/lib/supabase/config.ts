/*
 * Supabase settings. The URL and the publishable key are public by design (row-level security
 * guards the data); the secret key is server-only and must never get a NEXT_PUBLIC_ prefix.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** Accounts work when the public settings are present. */
export const hasAuth = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
