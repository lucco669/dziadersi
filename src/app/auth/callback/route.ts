import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { rememberEdition, safeNext } from "@/lib/account";
import { hasAuth } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Exchange an OAuth or email authorization code using the PKCE verifier in this browser's cookies. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const lang = searchParams.get("jezyk");
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const next = safeNext(searchParams.get("dalej"), localizePath("/profil", locale));
  const code = searchParams.get("code");
  if (hasAuth && code && !searchParams.has("error")) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        await rememberEdition(supabase, data.user, locale);
        return NextResponse.redirect(new URL(next, origin), { headers: { "Cache-Control": "private, no-store" } });
      }
    } catch { /* Expired codes and network failures share the same safe retry screen. */ }
  }
  const emailFlow = searchParams.get("flow") === "email";
  const target = new URL(next, origin);
  const recovery = emailFlow && target.searchParams.get("tryb") === "haslo";
  const returnTo = recovery ? safeNext(target.searchParams.get("dalej"), localizePath("/profil", locale)) : next;
  return NextResponse.redirect(new URL(localizePath(`/konto?blad=${emailFlow ? "link" : "google"}${recovery ? "&tryb=recovery" : ""}&dalej=${encodeURIComponent(returnTo)}`, locale), origin), { headers: { "Cache-Control": "private, no-store" } });
}
