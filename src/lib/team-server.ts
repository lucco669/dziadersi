import "server-only";
import { cache } from "react";
import { getGroup } from "./family-server";
import { teamView, type TeamGroup } from "./team";

export type TeamLookup = { status: "team"; team: TeamGroup } | { status: "family" } | { status: "missing" } | { status: "unavailable" };

/** One read per request, shared by a team page's metadata and its body. */
export const lookupTeam = cache(async (id: string): Promise<TeamLookup> => {
  try {
    const group = await getGroup(id);
    if (!group) return { status: "missing" };
    return group.kind === "team" ? { status: "team", team: teamView(group) } : { status: "family" };
  } catch {
    return { status: "unavailable" };
  }
});
