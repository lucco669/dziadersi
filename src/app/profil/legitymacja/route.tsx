import { NextResponse, type NextRequest } from "next/server";
import { formatDate } from "@/lib/calendar";
import { idCardImage } from "@/lib/id-card";
import { buildProfile, loadRecords, type Records } from "@/lib/profile";
import { currentUser } from "@/lib/supabase/server";

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

/** The signed-in visitor's Legitymacja Obserwatora as a PNG; ?pobierz downloads it. */
export async function GET(request: NextRequest) {
  const headers: Record<string, string> = { "cache-control": "private, no-store" };
  if (request.nextUrl.searchParams.has("pobierz")) {
    headers["content-disposition"] = 'attachment; filename="legitymacja-obserwatora-ibd.png"';
  }
  if (process.env.NODE_ENV === "development" && request.nextUrl.searchParams.has("podglad")) {
    return idCardImage(buildProfile(SAMPLE), "3f2a9c10-0000-4000-8000-000000000000", formatDate(new Date()), headers);
  }

  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.redirect(new URL("/konto?dalej=/profil%23legitymacja", request.url));
  return idCardImage(buildProfile(await loadRecords(supabase, user)), user.id, formatDate(new Date()), headers);
}
