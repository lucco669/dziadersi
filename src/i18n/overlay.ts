/**
 * Translations of content are overlays: the Polish file stays the source of truth for structure and
 * data (points, weights, keys, dates, codes), and a translation lists only the text, in the same
 * shape. Arrays keep the Polish order and length, so seeds, result codes and indices mean the same
 * thing in both editions.
 *
 * `Text<T, Skip>` is the shape of the text in T: every string field, with string-literal unions
 * (keys such as SpeciesKey) treated as data and left out, and any field named in Skip left out too.
 * Required Polish fields are required in the translation, so the type check catches missing text.
 */
export type Text<T, Skip extends PropertyKey = never> = T extends string
  ? string extends T
    ? string
    : never
  : T extends number | boolean | bigint | symbol | null | undefined
    ? never
    : T extends (...args: never[]) => unknown
      ? never
      : T extends readonly (infer U)[]
        ? [Text<U, Skip>] extends [never]
          ? never
          : Text<U, Skip>[]
        : T extends object
          ? { [K in keyof T as K extends Skip ? never : [Text<T[K], Skip>] extends [never] ? never : K]: Text<T[K], Skip> }
          : never;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Problems found while laying a translation over its source; tests/i18n.test.ts fails on any. */
export const overlayProblems: string[] = [];

function report(problem: string) {
  overlayProblems.push(problem);
  if (process.env.NODE_ENV === "development") console.warn(`[i18n] ${problem}`);
}

/**
 * Lays translated text over the source. Fields missing from the translation keep the Polish value,
 * an array of a different length keeps the Polish array (and is reported), and fields that exist
 * only in the translation, such as translator's notes, are added.
 */
export function overlay<T>(base: T, text: unknown, path = "root"): T {
  if (text === undefined || text === null) return base;
  if (typeof base === "string") return (typeof text === "string" ? text : base) as T;
  if (Array.isArray(base)) {
    if (!Array.isArray(text) || text.length !== base.length) {
      report(`${path}: expected ${base.length} items, got ${Array.isArray(text) ? text.length : typeof text}`);
      return base;
    }
    return base.map((item, i) => overlay(item, text[i], `${path}[${i}]`)) as T;
  }
  if (isObject(base) && isObject(text)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) out[key] = overlay(base[key], text[key], `${path}.${key}`);
    for (const key of Object.keys(text)) if (!(key in base)) out[key] = text[key];
    return out as T;
  }
  return base;
}

/**
 * A top-level list translated entry by entry, keyed by a stable identifier (a species key, a Polish
 * slug, a case number), so reordering or inserting entries in Polish never misaligns the translation.
 * An entry without a translation stays Polish and is reported.
 */
export function overlayList<T, K extends PropertyKey>(name: string, base: readonly T[], keyOf: (item: T) => K, text: Partial<Record<K, unknown>>): T[] {
  return base.map((item) => {
    const key = keyOf(item);
    const translation = text[key];
    if (translation === undefined) {
      report(`${name}[${String(key)}]: no translation`);
      return item;
    }
    return overlay(item, translation, `${name}[${String(key)}]`);
  });
}
