import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { verifyUnsubscribe } from "@/lib/newsletter";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";

/** One-click unsubscribe (RFC 8058): mail clients POST here from the List-Unsubscribe header. */
export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("u");
  if (!verifyUnsubscribe(id, request.nextUrl.searchParams.get("t")) || !hasAdmin) return new Response(null, { status: 400 });
  await createAdminClient().from("profiles").update({ newsletter: false }).eq("id", id);
  return new Response(null, { status: 204 });
}

/**
 * Mail clients without one-click support open the same link in the browser: they get the page with
 * the confirm button, in the reader's edition (`jezyk`, Polish without it). Opening never unsubscribes.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lang = params.get("jezyk");
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const query = new URLSearchParams({ u: params.get("u") ?? "", t: params.get("t") ?? "" });
  return Response.redirect(new URL(`${localizePath("/biuletyn/wypisz", locale)}?${query}`, request.nextUrl.origin), 303);
}
