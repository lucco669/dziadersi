import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { signInPath } from "@/lib/account";
import { currentUser } from "@/lib/supabase/server";
import { decodeResult, encodeResult } from "@/lib/test";

/** "Zapisz w profilu" on a result page: signs in first if needed, then files the code. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/profil/zapisz/[kod]">) {
  const { lang, kod } = await params;
  if (!hasLocale(lang)) return new Response(null, { status: 404 });
  const at = (path: string) => new URL(localizePath(path, lang), request.url);
  const draft = decodeResult(decodeURIComponent(kod));
  if (!draft) return NextResponse.redirect(at("/profil"));
  const code = encodeResult(draft);

  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.redirect(new URL(signInPath(`/profil/zapisz/${code}`, lang), request.url));

  await supabase.from("saved_results").upsert({ user_id: user.id, code }, { onConflict: "user_id,code", ignoreDuplicates: true });
  return NextResponse.redirect(at("/profil?zapisano=1#kartoteka"));
}
