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
