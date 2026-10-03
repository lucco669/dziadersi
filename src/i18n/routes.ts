import { CASE_SLUGS } from "@/content/sl/slugs/cases";
import { DICTIONARY_SLUGS } from "@/content/sl/slugs/dictionary";
import { REPORT_SLUGS } from "@/content/sl/slugs/reports";
import { SPECIES_SLUGS } from "@/content/sl/slugs/species";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { SEGMENTS } from "./segments";

/*
 * Three forms of a path:
 * - internal: the route folders without the locale, with the edition's own slugs: "/slownik/szwagier-mowi"
 *   in Polish, "/slownik/svak-pravi" in Slovenian. Code builds links in this form.
 * - public: what the reader sees: "/slownik/szwagier-mowi", "/sl/slovar/svak-pravi".
 * - routed: what the app router renders after the rewrites: "/pl/slownik/…", "/sl/slownik/…".
 */

const toSl = SEGMENTS;
const fromSl: Record<string, { pl: string; children: Record<string, string> }> = Object.fromEntries(
  Object.entries(SEGMENTS).map(([pl, { sl, children = {} }]) => [
    sl,
    { pl, children: Object.fromEntries(Object.entries(children).map(([childPl, childSl]) => [childSl, childPl])) },
  ]),
);

const split = (path: string) => {
  const match = /^([^?#]*)(.*)$/.exec(path)!;
  return { pathname: match[1], rest: match[2] };
};

const isExternal = (href: string) => !href.startsWith("/") || href.startsWith("//");

/** The public URL path of an internal path in an edition. Leaves external links and anchors alone. */
export function localizePath(href: string, locale: Locale): string {
  if (isExternal(href)) return href;
  const { pathname, rest } = split(href);
  if (locale === DEFAULT_LOCALE) return href;
  if (pathname === "/sl" || pathname.startsWith("/sl/")) return href;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/sl${rest}`;
  const section = toSl[segments[0]];
  const mapped = segments.map((segment, i) => {
    if (!section) return segment;
    if (i === 0) return section.sl;
    return section.children?.[segment] ?? segment;
  });
  return `/sl/${mapped.join("/")}${rest}`;
}

/** The edition and internal path of any path: public ("/sl/slovar/x", "/atlas") or routed ("/pl/atlas"). */
export function parsePath(pathname: string): { locale: Locale; path: string } {
  const { pathname: clean } = split(pathname);
  const segments = clean.split("/").filter(Boolean);
  if (segments[0] === "pl") return { locale: "pl", path: `/${segments.slice(1).join("/")}` };
  if (segments[0] !== "sl") return { locale: "pl", path: clean || "/" };
  const rest = segments.slice(1);
  if (rest.length === 0) return { locale: "sl", path: "/" };
  const section = fromSl[rest[0]];
  const polish = section ? section.pl : rest[0];
  const children = section?.children ?? {};
  const mapped = rest.map((segment, i) => (i === 0 ? polish : (children[segment] ?? segment)));
  return { locale: "sl", path: `/${mapped.join("/")}` };
}

/** Slug maps of the content sections, Polish slug → Slovenian slug. */
const SLUGS: Record<string, Record<string, string>> = {
  atlas: SPECIES_SLUGS,
  slownik: DICTIONARY_SLUGS,
  raporty: REPORT_SLUGS,
  "czy-to-juz-dziaderstwo": CASE_SLUGS,
};

const REVERSE: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(SLUGS).map(([section, map]) => [section, Object.fromEntries(Object.entries(map).map(([pl, sl]) => [sl, pl]))]),
);

/** The same page in the other edition, as an internal path: content slugs are swapped, codes stay. */
export function alternatePath(path: string, from: Locale, to: Locale): string {
  if (from === to) return path;
  const { pathname, rest } = split(path);
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const map = from === "pl" ? SLUGS[segments[0]] : REVERSE[segments[0]];
    if (map?.[segments[1]]) segments[1] = map[segments[1]];
  }
  return `/${segments.join("/")}${rest}`;
}

/** The public path of the current page in another edition. */
export function switchPath(publicPath: string, to: Locale): string {
  const { locale, path } = parsePath(publicPath);
  return localizePath(alternatePath(path, locale, to), to);
}
