import "server-only";
import { verifyConfirm, verifyUnsubscribe } from "./newsletter";
import { createAdminClient } from "./supabase/admin";

export { verifyConfirm, verifyUnsubscribe };

/**
 * A signed unsubscribe link names an account or a guest subscription; ids are random UUIDs, so
 * one id is never both. The account keeps its row with the opt-in off; a guest's address is
 * deleted, since nothing else is kept for it.
 */
export async function unsubscribe(id: string) {
  const db = createAdminClient();
  await Promise.all([
    db.from("profiles").update({ newsletter: false }).eq("id", id),
    db.from("newsletter_guests").delete().eq("id", id),
  ]);
}

/** The click on a guest's confirm page. False when the address is gone (unconfirmed for 7 days, or unsubscribed). */
export async function confirmGuest(id: string): Promise<boolean> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("newsletter_guests")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("id", id)
    .is("confirmed_at", null)
    .select("id");
  if (error) return false;
  if (data.length) return true;
  // Confirmed before (a second click): still a yes.
  const { data: existing } = await db.from("newsletter_guests").select("id").eq("id", id).maybeSingle();
  return Boolean(existing);
}
