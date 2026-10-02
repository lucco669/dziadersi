import { addTally } from "@/lib/community";
import { calendarOf, warsawToday } from "@/lib/profile";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

/** A page torn off the calendar: counted for everyone, filed for signed-in visitors. */
export async function POST() {
  await addTally("kartka");
  if (!hasAuth) return Response.json({ calendar: null });
  const { supabase, user } = await currentUser();
  if (!user) return Response.json({ calendar: null });

  const today = warsawToday();
  const { error } = await supabase
    .from("calendar_pages")
    .upsert({ user_id: user.id, day: today }, { onConflict: "user_id,day", ignoreDuplicates: true });
  if (error) {
    console.error("Kalendarz:", error.message);
    return Response.json({ calendar: null });
  }
  const { data } = await supabase.from("calendar_pages").select("day").order("day", { ascending: false });
  return Response.json({ calendar: calendarOf((data ?? []).map((row: { day: string }) => row.day), today) });
}
