import type { Locale } from "./config";

/**
 * Interface copy for one file, in both editions. The Polish object sets the shape; the Slovenian one
 * must have the same keys and types, so a string added in Polish fails the type check until it is
 * translated. Values can be functions for interpolation and plurals.
 *
 *   const COPY = defineCopy({
 *     pl: { title: "Opis gatunku", symptoms: (name: string) => `7 objawów ${name}` },
 *     sl: { title: "Opis vrste", symptoms: (name: string) => `7 simptomov: ${name}` },
 *   });
 *   const t = COPY[locale];
 */
export function defineCopy<T>(copy: { pl: T; sl: NoInfer<T> }): Record<Locale, T> {
  return copy;
}
