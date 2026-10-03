"use server";

import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

export type SubmissionState = { status: "idle" | "sent" | "error" | "signin"; message?: string; body?: string };

const DAILY_LIMIT = 3;

const COPY = defineCopy({
  pl: {
    closed: "Sekretariat Komisji jest chwilowo nieczynny.",
    short: "Komisja prosi o co najmniej dwa zdania stanu faktycznego.",
    long: "Najwyżej 600 znaków. Komisja czyta, ale nie wszystko.",
    limit: "Trzy sprawy na dobę to limit ławnika. Komisja też musi spać.",
    failed: "Sekretariat nie przyjął pisma. Spróbuj za chwilę.",
  },
  sl: {
    closed: "Tajništvo Komisije je začasno zaprto.",
    short: "Komisija prosi za vsaj dva stavka dejanskega stanja.",
    long: "Največ 600 znakov. Komisija bere, a ne vsega.",
    limit: "Trije primeri na dan so porotnikova omejitev. Tudi Komisija mora spati.",
    failed: "Tajništvo vloge ni sprejelo. Poskusi čez trenutek.",
  },
});

/**
 * A case proposed by a signed-in judge. It goes to a moderation queue, never straight onto the site.
 * The form carries the edition in a hidden field, for the messages.
 */
export async function submitCase(_: SubmissionState, formData: FormData): Promise<SubmissionState> {
  const edition = formData.get("jezyk");
  const t = COPY[typeof edition === "string" && hasLocale(edition) ? edition : DEFAULT_LOCALE];
  const body = String(formData.get("sprawa") ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!hasAuth) return { status: "error", message: t.closed, body };
  const { supabase, user } = await currentUser();
  if (!user) return { status: "signin", body };
  if (body.length < 30) return { status: "error", message: t.short, body };
  if (body.length > 600) return { status: "error", message: t.long, body };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("case_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_LIMIT) {
    return { status: "error", message: t.limit, body };
  }

  const { error } = await supabase.from("case_submissions").insert({ user_id: user.id, body });
  if (error) {
    console.error("Komisja:", error.message);
    return { status: "error", message: t.failed, body };
  }
  return { status: "sent" };
}
