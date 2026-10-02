import type { NextRequest } from "next/server";
import { verifyUnsubscribe } from "@/lib/newsletter";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";

/** One-click unsubscribe (RFC 8058): mail clients POST here from the List-Unsubscribe header. */
export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("u");
  if (!verifyUnsubscribe(id, request.nextUrl.searchParams.get("t")) || !hasAdmin) return new Response(null, { status: 400 });
  await createAdminClient().from("profiles").update({ newsletter: false }).eq("id", id);
  return new Response(null, { status: 204 });
}
