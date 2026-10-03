"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { parsePath } from "./routes";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** The edition being shown, for Client Components. */
export const useLocale = () => useContext(LocaleContext);

/**
 * The internal path of the current page ("/slownik/x"), the same during prerendering (where the
 * router sees "/pl/slownik/x") and in the browser (where the address is "/slownik/x" or "/sl/slovar/x").
 * Use it instead of usePathname() for comparisons with internal hrefs.
 */
export function useInternalPath() {
  return parsePath(usePathname() ?? "/").path;
}
