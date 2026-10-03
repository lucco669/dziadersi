"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { formEdition, rememberEdition, signInPath } from "@/lib/account";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { currentUser } from "@/lib/supabase/server";
import { cleanName } from "@/lib/test";

/*
 * The profile's forms carry their edition in a hidden "jezyk" field: redirects go to that edition's
 * pages, and the page is revalidated by its routed path (/pl/profil, /sl/profil), as rewrites require.
 */

async function signedIn(locale: Locale) {
  const { supabase, user } = await currentUser();
  if (!user) redirect(signInPath("/profil", locale));
  return { supabase, user };
}

const refresh = (locale: Locale) => revalidatePath(`/${locale}/profil`);

export async function saveNickname(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  const nickname = cleanName(String(formData.get("pseudonim") ?? "")) || null;
  await supabase.from("profiles").update({ nickname }).eq("id", user.id);
  refresh(locale);
}

export async function removeResult(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  await supabase.from("saved_results").delete().eq("user_id", user.id).eq("code", String(formData.get("kod") ?? ""));
  refresh(locale);
}

export async function signOut(formData: FormData) {
  const { supabase } = await currentUser();
  await supabase.auth.signOut();
  redirect(localizePath("/", formEdition(formData)));
}

/** Right to erasure: the account, the profile and every saved result go at once (on delete cascade). */
export async function deleteAccount(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  if (formData.get("potwierdzam") !== "tak" || !hasAdmin) redirect(localizePath("/profil?usuwanie=potwierdz", locale));
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) redirect(localizePath("/profil?usuwanie=blad", locale));
  await supabase.auth.signOut();
  redirect(localizePath("/?konto=usuniete", locale));
}

export async function removeSighting(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  await supabase
    .from("sightings")
    .delete()
    .eq("user_id", user.id)
    .eq("species", String(formData.get("gatunek") ?? ""))
    .eq("observed_on", String(formData.get("dzien") ?? ""));
  refresh(locale);
}

export async function removeBookmark(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", user.id)
    .eq("kind", String(formData.get("rodzaj") ?? ""))
    .eq("code", String(formData.get("kod") ?? ""));
  refresh(locale);
}

/** The two opt-ins: the weekly bulletin and the nickname on the Tablica Honorowa. */
export async function saveSettings(formData: FormData) {
  const locale = formEdition(formData);
  const { supabase, user } = await signedIn(locale);
  const newsletter = formData.get("biuletyn") === "tak";
  await supabase
    .from("profiles")
    .update({ newsletter, honor: formData.get("tablica") === "tak", ...(newsletter ? { newsletter_at: new Date().toISOString() } : {}) })
    .eq("id", user.id);
  // The bulletin arrives in the edition the reader subscribed in.
  if (newsletter) await rememberEdition(supabase, user, locale);
  refresh(locale);
}

/** "Zapisz się" on /biuletyn, for a signed-in visitor. Returns the new state. */
export async function setNewsletter(on: boolean, edition: string) {
  const { supabase, user } = await currentUser();
  if (!user) return null;
  const { error } = await supabase
    .from("profiles")
    .update({ newsletter: on, ...(on ? { newsletter_at: new Date().toISOString() } : {}) })
    .eq("id", user.id);
  // The bulletin arrives in the edition the reader subscribed in.
  if (!error && on && hasLocale(edition)) await rememberEdition(supabase, user, edition);
  return error ? null : on;
}
