import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { decodeResult, encodeResult, evaluate } from "./test";

/** A private group as families see it: the result codes in the order people joined. */
export type FamilyGroup = { id: string; expires: string; codes: string[] };

/**
 * Families and office teams share one table and one join. A team adds a name, departments and
 * a nickname and department per member (`entries`, in the order of `codes`).
 */
export type GroupKind = "family" | "team";
export type GroupEntry = { code: string; nickname: string | null; department: number | null };
export type PrivateGroup = FamilyGroup & { kind: GroupKind; name: string | null; departments: string[]; entries: GroupEntry[] };

const COPY = defineCopy({
  pl: { unnamed: (number: number) => `Osoba badana nr ${number}` },
  sl: { unnamed: (number: number) => `Preiskovana oseba št. ${number}` },
});

export function familyMembers(group: FamilyGroup, locale: Locale) {
  return group.codes.flatMap((code, order) => {
    const draft = decodeResult(code);
    if (!draft) return [];
    const result = evaluate(draft, locale);
    return [{ result, label: result.name || COPY[locale].unnamed(order + 1), order }];
  });
}
export function validFamilyCode(value: unknown) {
  if (typeof value !== "string" || value.length > 200) return null;
  const draft = decodeResult(value);
  return draft ? encodeResult(draft) : null;
}
