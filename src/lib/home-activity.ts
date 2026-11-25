import type { Locale } from "@/i18n/config";
import { tableTestSeason } from "./calendar";
import { waxSeason } from "./wax-code";

export function homeActivity(month: number, day: number, locale: Locale) {
  return waxSeason(month, day, locale) ?? (tableTestSeason(month, day) ? "table" : "grill");
}
