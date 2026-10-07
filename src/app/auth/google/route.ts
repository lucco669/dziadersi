import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { safeNext } from "@/lib/account";
import { hasAuth } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** A top-level navigation keeps OAuth independent of JavaScript and the site's form-action CSP. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const lang = searchParams.get("jezyk");
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const next = safeNext(searchParams.get("dalej"), localizePath("/profil", locale));
  const callback = new URL("/auth/callback", origin);
  callback.search = new URLSearchParams({ dalej: next, jezyk: locale }).toString();
  if (hasAuth) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback.href, skipBrowserRedirect: true } });
      if (!error && data.url) return NextResponse.redirect(data.url, { headers: { "Cache-Control": "private, no-store" } });
    } catch { /* A network failure returns to the translated sign-in form. */ }
  }
  return NextResponse.redirect(new URL(localizePath(`/konto?blad=google&dalej=${encodeURIComponent(next)}`, locale), origin), { headers: { "Cache-Control": "private, no-store" } });
}
