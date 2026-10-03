import { TASKS } from "@/content/test";
import { decodeGroup, radix } from "./test";
import { isAttemptId, isFamilyId } from "./write-policy";

export type Progress = {
  answers: (number | null)[];
  current: number;
  name: string;
  proxy: boolean;
  seed: number;
  group: string;
  region: string;
  untimed?: boolean;
  attempt?: string;
  family?: string;
  rooms?: number[];
};

export function readProgress(raw: string | null): Progress | null {
  try {
    if (!raw) return null;
    const p = JSON.parse(raw) as Progress;
    if (!p || !Number.isInteger(p.current) || p.current < 1 || p.current > TASKS.length ||
      !Array.isArray(p.answers) || p.answers.length !== TASKS.length ||
      !p.answers.every((value, i) => value === null ? i >= p.current : Number.isInteger(value) && value >= 0 && value < radix(TASKS[i])) ||
      typeof p.name !== "string" || typeof p.proxy !== "boolean" || !Number.isInteger(p.seed) ||
      typeof p.group !== "string" || (p.group && !decodeGroup(p.group)) ||
      (p.attempt !== undefined && !isAttemptId(p.attempt)) || (p.family !== undefined && (typeof p.family !== "string" || (p.family !== "" && !isFamilyId(p.family)))) ||
      (p.untimed !== undefined && typeof p.untimed !== "boolean") ||
      (p.rooms !== undefined && (!Array.isArray(p.rooms) || !p.rooms.every((room) => Number.isInteger(room) && room >= 0 && room < 5)))) return null;
    return { ...p, region: typeof p.region === "string" ? p.region : "" };
  } catch { return null; }
}
