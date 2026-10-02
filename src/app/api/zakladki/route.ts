import { bookmarkCode } from "@/lib/bookmarks";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";

type Body = { kind?: unknown; code?: unknown };

async function handle(request: Request, remove: boolean) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(null, { status: 400 });
  }
  const item = bookmarkCode(body.kind, body.code);
  if (!item) return new Response(null, { status: 400 });

  if (!hasAuth) return new Response(null, { status: 503 });
  const { supabase, user } = await currentUser();
  if (!user) return new Response(null, { status: 401 });

  const { error } = remove
    ? await supabase.from("saved_items").delete().eq("user_id", user.id).eq("kind", item.kind).eq("code", item.code)
    : await supabase
        .from("saved_items")
        .upsert({ user_id: user.id, ...item }, { onConflict: "user_id,kind,code", ignoreDuplicates: true });
  if (error) {
    console.error("Zakładki:", error.message);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}

/** Keep a Rozmówki line, a winning bingo card or an exam in the profile. */
export function POST(request: Request) {
  return handle(request, false);
}

export function DELETE(request: Request) {
  return handle(request, true);
}
