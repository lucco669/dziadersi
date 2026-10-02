"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { currentUser } from "@/lib/supabase/server";
import { cleanName } from "@/lib/test";

async function signedIn() {
  const { supabase, user } = await currentUser();
  if (!user) redirect("/konto?dalej=/profil");
  return { supabase, user };
}

export async function saveNickname(formData: FormData) {
  const { supabase, user } = await signedIn();
  const nickname = cleanName(String(formData.get("pseudonim") ?? "")) || null;
  await supabase.from("profiles").update({ nickname }).eq("id", user.id);
  revalidatePath("/profil");
}

export async function removeResult(formData: FormData) {
  const { supabase, user } = await signedIn();
  await supabase.from("saved_results").delete().eq("user_id", user.id).eq("code", String(formData.get("kod") ?? ""));
  revalidatePath("/profil");
}

export async function signOut() {
  const { supabase } = await currentUser();
  await supabase.auth.signOut();
  redirect("/");
}

/** Right to erasure: the account, the profile and every saved result go at once (on delete cascade). */
export async function deleteAccount(formData: FormData) {
  const { supabase, user } = await signedIn();
  if (formData.get("potwierdzam") !== "tak" || !hasAdmin) redirect("/profil?usuwanie=potwierdz");
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) redirect("/profil?usuwanie=blad");
  await supabase.auth.signOut();
  redirect("/?konto=usuniete");
}

export async function removeSighting(formData: FormData) {
  const { supabase, user } = await signedIn();
  await supabase
    .from("sightings")
    .delete()
    .eq("user_id", user.id)
    .eq("species", String(formData.get("gatunek") ?? ""))
    .eq("observed_on", String(formData.get("dzien") ?? ""));
  revalidatePath("/profil");
}

export async function removeBookmark(formData: FormData) {
  const { supabase, user } = await signedIn();
  await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", user.id)
    .eq("kind", String(formData.get("rodzaj") ?? ""))
    .eq("code", String(formData.get("kod") ?? ""));
  revalidatePath("/profil");
}

/** The two opt-ins: the weekly bulletin and the nickname on the Tablica Honorowa. */
export async function saveSettings(formData: FormData) {
  const { supabase, user } = await signedIn();
  const newsletter = formData.get("biuletyn") === "tak";
  await supabase
    .from("profiles")
    .update({ newsletter, honor: formData.get("tablica") === "tak", ...(newsletter ? { newsletter_at: new Date().toISOString() } : {}) })
    .eq("id", user.id);
  revalidatePath("/profil");
}

/** "Zapisz się" on /biuletyn, for a signed-in visitor. Returns the new state. */
export async function setNewsletter(on: boolean) {
  const { supabase, user } = await currentUser();
  if (!user) return null;
  const { error } = await supabase
    .from("profiles")
    .update({ newsletter: on, ...(on ? { newsletter_at: new Date().toISOString() } : {}) })
    .eq("id", user.id);
  return error ? null : on;
}
