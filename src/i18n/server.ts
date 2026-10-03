import { lang } from "next/root-params";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "./config";

/**
 * The edition being rendered, from the [lang] root segment. For Server Components and server
 * utilities (also inside "use cache", where it becomes part of the cache key). Route handlers,
 * Server Actions and Client Components get the locale another way: params, a form field, useLocale().
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return hasLocale(value) ? value : DEFAULT_LOCALE;
}
