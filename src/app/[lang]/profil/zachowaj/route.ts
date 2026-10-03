import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { signInPath } from "@/lib/account";
import { bookmarkCode } from "@/lib/bookmarks";
import { currentUser } from "@/lib/supabase/server";

/** "Zachowaj w Profilu" for a visitor who isn't signed in yet: sign in first, then file the bookmark. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/profil/zachowaj">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response(null, { status: 404 });
  const at = (path: string) => new URL(localizePath(path, lang), request.url);
  const search = request.nextUrl.searchParams;
  const item = bookmarkCode(search.get("rodzaj"), search.get("kod"));
  if (!item) return NextResponse.redirect(at("/profil"));

  const { supabase, user } = await currentUser();
  if (!user) {
    const back = `/profil/zachowaj?rodzaj=${item.kind}&kod=${encodeURIComponent(item.code)}`;
    return NextResponse.redirect(new URL(signInPath(back, lang), request.url));
  }

  await supabase.from("saved_items").upsert({ user_id: user.id, ...item }, { onConflict: "user_id,kind,code", ignoreDuplicates: true });
  return NextResponse.redirect(at(`/profil?zachowano=${item.kind}#zakladki`));
}
