"use server";

import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

export type SubmissionState = { status: "idle" | "sent" | "error" | "signin"; message?: string; body?: string };

const DAILY_LIMIT = 3;

/** A case proposed by a signed-in judge. It goes to a moderation queue, never straight onto the site. */
export async function submitCase(_: SubmissionState, formData: FormData): Promise<SubmissionState> {
  const body = String(formData.get("sprawa") ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!hasAuth) return { status: "error", message: "Sekretariat Komisji jest chwilowo nieczynny.", body };
  const { supabase, user } = await currentUser();
  if (!user) return { status: "signin", body };
  if (body.length < 30) return { status: "error", message: "Komisja prosi o co najmniej dwa zdania stanu faktycznego.", body };
  if (body.length > 600) return { status: "error", message: "Najwyżej 600 znaków. Komisja czyta, ale nie wszystko.", body };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("case_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) {
    return { status: "error", message: "Trzy sprawy na dobę to limit ławnika. Komisja też musi spać.", body };
  }

  const { error } = await supabase.from("case_submissions").insert({ user_id: user.id, body });
  if (error) {
    console.error("Komisja:", error.message);
    return { status: "error", message: "Sekretariat nie przyjął pisma. Spróbuj za chwilę.", body };
  }
  return { status: "sent" };
}
