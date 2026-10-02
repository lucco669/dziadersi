import { accountState, buildProfile, loadRecords, warsawToday } from "@/lib/profile";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

const PRIVATE = { "cache-control": "private, no-store" };

/** The signed-in visitor's compact state, for personalising static pages in the browser. */
export async function GET() {
  if (!hasAuth) return Response.json({ user: null }, { headers: PRIVATE });
  const { supabase, user } = await currentUser();
  if (!user) return Response.json({ user: null }, { headers: PRIVATE });
  const profile = buildProfile(await loadRecords(supabase, user));
  return Response.json({ user: accountState(profile, user.email ?? "", warsawToday()) }, { headers: PRIVATE });
}
