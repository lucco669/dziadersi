import { decodeResult, encodeResult, evaluate } from "./test";

export type FamilyGroup = { id: string; expires: string; codes: string[] };

export function familyMembers(group: FamilyGroup) {
  return group.codes.flatMap((code, order) => {
    const draft = decodeResult(code);
    if (!draft) return [];
    const result = evaluate(draft);
    return [{ result, label: result.name || `Osoba badana nr ${order + 1}`, order }];
  });
}
export function validFamilyCode(value: unknown) {
  if (typeof value !== "string" || value.length > 200) return null;
  const draft = decodeResult(value);
  return draft ? encodeResult(draft) : null;
}
