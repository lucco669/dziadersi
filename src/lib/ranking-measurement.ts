import { track } from "./analytics";
import { decodeGroup } from "./test";

/** Count a completed join to a one-person snapshot, including a whole table joining together. */
export function trackSecondParticipant(invitation: string, destination: string) {
  if (!invitation || !destination.startsWith("/grupa/")) return;
  if (decodeGroup(invitation)?.length !== 1) return;
  const participants = decodeGroup(destination.slice("/grupa/".length));
  if (participants && participants.length >= 2) track("Ranking: druga osoba");
}
