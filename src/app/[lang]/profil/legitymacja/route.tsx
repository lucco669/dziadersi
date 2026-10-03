import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { signInPath } from "@/lib/account";
import { idCardImage } from "@/lib/id-card";
import { buildProfile, loadRecords, type Records } from "@/lib/profile";
import { currentUser } from "@/lib/supabase/server";
import { formatDate } from "@/lib/typo";

/** A made-up observer, for checking the design in development: /profil/legitymacja?podglad. */
const SAMPLE: Records = {
  nickname: "Zenek z Bródna",
  newsletter: false,
  honor: true,
  calendar: ["2026-10-02", "2026-10-01", "2026-09-30"],
  results: [],
  sightings: ["grill", "parking", "parapetowy", "korpo", "kolejkowy", "zeglarz"].map((species) => ({
    species,
    region: "MZ",
    observed_on: "2026-10-01",
  })),
  items: [{ kind: "bingo", code: "wesele-3k9fz", saved_at: "2026-10-01T10:00:00Z" }],
  verdicts: [],
  submissions: [{ body: "Uczestnik od 2011 roku…", status: "nowe", created_at: "2026-10-01T10:00:00Z" }],
};

const FILE = defineCopy({
  pl: "legitymacja-obserwatora-ibd.png",
  sl: "opazovalska-izkaznica-ibd.png",
});

/** The signed-in visitor's Legitymacja Obserwatora as a PNG, in the edition's words; ?pobierz downloads it. */
export async function GET(request: NextRequest, { params }: RouteContext<"/[lang]/profil/legitymacja">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response(null, { status: 404 });
  const headers: Record<string, string> = { "cache-control": "private, no-store" };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = `attachment; filename="${FILE[lang]}"`;
  }
  if (process.env.NODE_ENV === "development" && request.nextUrl.searchParams.has("podglad")) {
    return idCardImage(buildProfile(SAMPLE, lang), "3f2a9c10-0000-4000-8000-000000000000", formatDate(lang, new Date()), headers, lang);
  }

  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.redirect(new URL(signInPath("/profil#legitymacja", lang), request.url));
  return idCardImage(buildProfile(await loadRecords(supabase, user), lang), user.id, formatDate(lang, new Date()), headers, lang);
}
