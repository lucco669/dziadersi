import { REGIONS } from "@/content/regions";
import { SPECIES } from "@/content/species";
import { warsawToday } from "@/lib/profile";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

type Body = { species?: unknown; region?: unknown };

/** A field observation from an Atlas page: one per species per day, signed-in visitors only. */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(null, { status: 400 });
  }
  const species = SPECIES.find((item) => item.key === body.species);
  if (!species) return new Response(null, { status: 400 });
  const region = typeof body.region === "string" && body.region in REGIONS ? body.region : null;

  if (!hasAuth) return new Response(null, { status: 503 });
  const { supabase, user } = await currentUser();
  if (!user) return new Response(null, { status: 401 });

  const { error } = await supabase
    .from("sightings")
    .upsert(
      { user_id: user.id, species: species.key, region, observed_on: warsawToday() },
      { onConflict: "user_id,species,observed_on", ignoreDuplicates: true },
    );
  if (error) {
    console.error("Obserwacje:", error.message);
    return new Response(null, { status: 500 });
  }

  const { count } = await supabase
    .from("sightings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("species", species.key);
  return Response.json({ count: count ?? 1 });
}
