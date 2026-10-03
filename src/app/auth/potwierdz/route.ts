import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { localizePath, parsePath } from "@/i18n/routes";
import { rememberEdition, safeNext } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

/**
 * The button in every Institute email lands here: the token hash becomes a session cookie.
 * Outside the editions: `dalej` is a public path ("/profil", "/sl/profil"), and its edition decides
 * where the reader goes back to if the link has expired.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("dalej"));
  const { locale } = parsePath(next);

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      await rememberEdition(supabase, data.user, locale);
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL(localizePath(`/konto?blad=link&dalej=${encodeURIComponent(next)}`, locale), origin));
}
