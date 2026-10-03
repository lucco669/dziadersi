/** Local-only PostgREST adapter for browser QA against ephemeral Postgres. Never deploy. */
import { createServer } from "node:http";
import { databaseFixture } from "../tests/database-fixture";

async function main() {
  const db = await databaseFixture();
  const server = createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    const url = new URL(request.url || "/", "http://127.0.0.1:54329");
    const resource = url.pathname.replace("/rest/v1/", "");
    let raw = "";
    for await (const chunk of request) { raw += chunk; if (raw.length > 16384) { response.writeHead(413).end(); return; } }
    try {
      const body = raw ? JSON.parse(raw) : {};
      const rpcs: Record<string, string[]> = {
        take_write_budget: ["p_scope", "p_key", "p_limit"],
        create_family_group: ["p_group", "p_attempt", "p_code"],
        join_family_group: ["p_group", "p_attempt", "p_code"],
      };
      if (resource.startsWith("rpc/")) {
        const fn = resource.slice(4);
        const keys = rpcs[fn];
        if (!keys) { response.writeHead(404).end(JSON.stringify({ message: "Fixture: optional community service unavailable" })); return; }
        const { rows } = await db.query<{ result: unknown }>(`select public.${fn}(${keys.map((_, i) => `$${i + 1}`).join(",")}) as result`, keys.map((key) => body[key]));
        response.end(JSON.stringify(rows[0].result)); return;
      }
      if (request.method === "POST" && resource === "results") {
        const allowed = ["code", "version", "proxy", "score", "species", "answers", "region", "retake", "previous_score", "submission_key"];
        const keys = allowed.filter((key) => key in body);
        await db.query(`insert into public.results(${keys.join(",")}) values (${keys.map((_, i) => `$${i + 1}`).join(",")}) on conflict (submission_key) do nothing`, keys.map((key) => body[key]));
        response.writeHead(201).end(); return;
      }
      if (request.method === "GET" && ["family_groups", "family_members"].includes(resource)) {
        const column = resource === "family_groups" ? "id" : "group_id";
        const id = url.searchParams.get(column)?.replace(/^eq\./, "");
        const { rows } = await db.query(`select * from public.${resource} where ${column} = $1 ${resource === "family_groups" ? "and expires_at > now()" : "order by joined_at, attempt"}`, [id]);
        response.end(JSON.stringify(rows)); return;
      }
      response.writeHead(404).end(JSON.stringify({ message: "Fixture service unavailable" }));
    } catch (error) {
      response.writeHead(400).end(JSON.stringify({ message: error instanceof Error ? error.message : "Fixture error" }));
    }
  });
  server.listen(54329, "127.0.0.1", () => console.log("Ephemeral database fixture listening on 127.0.0.1:54329"));
}
void main();
