import { NextResponse, type NextRequest } from "next/server";
import { bookmarkCode } from "@/lib/bookmarks";
import { currentUser } from "@/lib/supabase/server";

/** "Zachowaj w Profilu" for a visitor who isn't signed in yet: sign in first, then file the bookmark. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const item = bookmarkCode(params.get("rodzaj"), params.get("kod"));
  if (!item) return NextResponse.redirect(new URL("/profil", request.url));

  const { supabase, user } = await currentUser();
  if (!user) {
    const back = `/profil/zachowaj?rodzaj=${item.kind}&kod=${encodeURIComponent(item.code)}`;
    return NextResponse.redirect(new URL(`/konto?dalej=${encodeURIComponent(back)}`, request.url));
  }

  await supabase.from("saved_items").upsert({ user_id: user.id, ...item }, { onConflict: "user_id,kind,code", ignoreDuplicates: true });
  return NextResponse.redirect(new URL(`/profil?zachowano=${item.kind}#zakladki`, request.url));
}
