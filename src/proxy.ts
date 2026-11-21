import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { signInPath } from "@/lib/account";
import { hasAuth, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * The profile of each edition. A guest is sent to the account page from here, as an HTTP redirect:
 * the page's own redirect() comes after streaming has begun, so it can only answer 200 with a
 * <meta http-equiv="refresh">, which crawlers report as a page with a meta refresh.
 */
const PROFILES = { "/profil": "pl", "/sl/profil": "sl" } as const;

/**
 * Keeps the Supabase session fresh on the pages that use it: Server Components can read
 * cookies but not write them, so expired access tokens are refreshed here.
 * Everything else on the site stays static and never passes through this.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!hasAuth) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Refreshes the session if needed.
  const { data } = await supabase.auth.getClaims();
  const profile = PROFILES[request.nextUrl.pathname as keyof typeof PROFILES];
  if (profile && !data?.claims) {
    const redirect = NextResponse.redirect(new URL(signInPath("/profil", profile), request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  return response;
}

export const config = {
  matcher: [
    "/profil/:path*",
    "/konto",
    "/sl/profil/:path*",
    "/sl/racun",
    "/auth/:path*",
    "/api/wyniki",
    "/api/konto",
    "/api/obserwacje",
    "/api/zakladki",
    "/api/orzeczenia",
    "/api/kalendarz",
  ],
};
