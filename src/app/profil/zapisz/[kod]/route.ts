import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@/lib/supabase/server";
import { decodeResult, encodeResult } from "@/lib/test";

/** "Zapisz w profilu" on a result page: signs in first if needed, then files the code. */
export async function GET(request: NextRequest, { params }: RouteContext<"/profil/zapisz/[kod]">) {
  const { kod } = await params;
  const draft = decodeResult(decodeURIComponent(kod));
  if (!draft) return NextResponse.redirect(new URL("/profil", request.url));
  const code = encodeResult(draft);

  const { supabase, user } = await currentUser();
  if (!user) {
    return NextResponse.redirect(new URL(`/konto?dalej=${encodeURIComponent(`/profil/zapisz/${code}`)}`, request.url));
  }

  await supabase.from("saved_results").upsert({ user_id: user.id, code }, { onConflict: "user_id,code", ignoreDuplicates: true });
  return NextResponse.redirect(new URL("/profil?zapisano=1#kartoteka", request.url));
}
