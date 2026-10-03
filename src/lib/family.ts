import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { decodeResult, encodeResult, evaluate } from "./test";

export type FamilyGroup = { id: string; expires: string; codes: string[] };

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
