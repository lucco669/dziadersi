import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { localizePath, parsePath } from "@/i18n/routes";
import { passwordResetPath, rememberEdition, safeNext } from "@/lib/account";
import { hasAuth } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * The button in every Institute email lands here: the token hash becomes a session cookie.
 * Outside the editions: `dalej` is a public path ("/profil", "/sl/profil"), and its edition decides
 * where the reader goes back to if the link has expired.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = safeNext(searchParams.get("dalej"));
  const { locale } = parsePath(next);

  const recovery = type === "recovery";
  const target = new URL(next, origin);
  const returnTo = recovery && parsePath(next).path === "/konto" ? safeNext(target.searchParams.get("dalej"), localizePath("/profil", locale)) : next;
  const destination = recovery ? passwordResetPath(returnTo, locale) : next;

  if (hasAuth && tokenHash && type && ["signup", "invite", "magiclink", "recovery", "email_change", "email"].includes(type)) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash });
      if (!error) {
        await rememberEdition(supabase, data.user, locale);
        return NextResponse.redirect(new URL(destination, origin), { headers: { "Cache-Control": "private, no-store" } });
      }
    } catch { /* Return to the translated retry form if the auth service is unavailable. */ }
  }

  return NextResponse.redirect(new URL(localizePath(`/konto?blad=link${recovery ? "&tryb=recovery" : ""}&dalej=${encodeURIComponent(returnTo)}`, locale), origin), { headers: { "Cache-Control": "private, no-store" } });
}
