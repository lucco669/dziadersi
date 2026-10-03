import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasAuth, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

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

  // Refreshes the session if needed; the result itself is not used here.
  await supabase.auth.getClaims();
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
