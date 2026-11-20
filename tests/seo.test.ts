import assert from "node:assert/strict";
import { test } from "node:test";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { GET as securityRecord } from "../src/app/.well-known/security.txt/route";
import { signInPath } from "../src/lib/account";
import { readdirSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import { describe, institute, pageMetadata, SHARE_CARDS, shareImagePath } from "../src/lib/seo";
import { site } from "../src/lib/site";
import { legacyContentRedirects } from "../src/i18n/legacy-redirects";

test("descriptions retain fitting text and optional endings, with bounded overflow", () => {
  assert.equal(describe("A concise summary.", " Read more."), "A concise summary. Read more.");
  assert.equal(describe("a".repeat(160), " more"), "a".repeat(160));
  assert.equal(describe("a".repeat(180)), "a".repeat(159) + "…");
  const words = "Useful complete words ".repeat(15);
  const shortened = describe(words);
  assert.ok(shortened.length <= 160);
  assert.match(shortened, /(?:Useful|complete|words)…$/);
});

test("legal previews have an edition-specific fallback without replacing dedicated cards", () => {
  for (const locale of ["pl", "sl"] as const) {
    const metadata = pageMetadata(locale, { title: "Legal", description: "a".repeat(180), path: "/regulamin", defaultImage: true });
    assert.equal(metadata.description?.length, 160);
    const front = locale === "pl" ? "/opengraph-image" : "/sl/opengraph-image";
    assert.deepEqual(metadata.openGraph?.images, [{ url: front, width: 1200, height: 630, type: "image/png", alt: institute(locale).name }]);
    // Twitter inherits the Open Graph image.
    assert.equal(metadata.twitter?.images, undefined);
    const dedicated = pageMetadata(locale, { title: "Atlas", description: "An atlas", path: "/atlas" });
    assert.deepEqual(dedicated.openGraph?.images, [{ url: locale === "pl" ? "/atlas/opengraph-image" : "/sl/atlas/opengraph-image", width: 1200, height: 630, type: "image/png", alt: "Atlas · DZIADER.SI" }]);
    const privateResult = pageMetadata(locale, { title: "Result", description: "Private", path: "/wynik/code", noindex: true, nofollow: true });
    assert.deepEqual(privateResult.robots, { index: false, follow: false });
    const account = pageMetadata(locale, { title: "Account", description: "Sign in", path: "/konto", noindex: true });
    assert.deepEqual(account.robots, { index: false, follow: true });
  }
});

test("share cards are linked by their public address, never by the routed /pl or /sl/<Polish> path", () => {
  // The list in seo.ts names every opengraph-image route folder.
  const root = join(import.meta.dirname, "../src/app/[lang]");
  const files = readdirSync(root, { recursive: true, encoding: "utf8" })
    .filter((file) => basename(file) === "opengraph-image.tsx")
    .map((file) => (dirname(file) === "." ? "/" : `/${dirname(file).split(sep).join("/")}`))
    .sort();
  assert.deepEqual([...SHARE_CARDS].sort(), files);

  const cases: [string, string, string][] = [
    ["/", "/opengraph-image", "/sl/opengraph-image"],
    ["/kontakt", "/opengraph-image", "/sl/opengraph-image"],
    ["/atlas/dziaders-parkingowy", "/atlas/dziaders-parkingowy/opengraph-image", "/sl/atlas/dziaders-parkingowy/opengraph-image"],
    ["/slownik/x", "/slownik/x/opengraph-image", "/sl/slovar/x/opengraph-image"],
    ["/statystyki", "/statystyki/opengraph-image", "/sl/statistika/opengraph-image"],
    ["/dziaders/kobieta", "/dziaders/kobieta/opengraph-image", "/sl/dziaders/zenska/opengraph-image"],
    ["/wynik/2abc", "/wynik/2abc/opengraph-image", "/sl/izvid/2abc/opengraph-image"],
    // Pages without a card of their own inherit the nearest one above them, as in Next.js.
    ["/wynik/2abc/certyfikat?format=post", "/wynik/2abc/opengraph-image", "/sl/izvid/2abc/opengraph-image"],
    ["/bingo/wigilia-0nof0/druk", "/bingo/wigilia-0nof0/opengraph-image", "/sl/bingo/wigilia-0nof0/opengraph-image"],
    ["/muzeum/x/karta", "/muzeum/x/opengraph-image", "/sl/muzej/x/opengraph-image"],
    ["/do-druku/przewodnik", "/do-druku/opengraph-image", "/sl/za-tisk/opengraph-image"],
    ["/grupy/abc", "/opengraph-image", "/sl/opengraph-image"],
  ];
  for (const [path, pl, sl] of cases) {
    assert.equal(shareImagePath(path, "pl"), pl, path);
    assert.equal(shareImagePath(path, "sl"), sl, path);
  }
});

test("hreflang pairs only indexable pages", () => {
  for (const locale of ["pl", "sl"] as const) {
    const card = pageMetadata(locale, { title: "Card", description: "A bingo card", path: "/bingo/wigilia-0nof0", noindex: true });
    assert.equal(card.alternates?.languages, undefined);
    assert.equal(card.alternates?.canonical, locale === "pl" ? "/bingo/wigilia-0nof0" : "/sl/bingo/wigilia-0nof0");
    const guide = pageMetadata(locale, { title: "Guide", description: "A guide", path: "/dziaders" });
    assert.deepEqual(Object.keys(guide.alternates?.languages ?? {}), ["pl", "sl", "x-default"]);
  }
});

test("robots.txt keeps crawlers out of sign-in variants and auth steps, not out of public pages", () => {
  const rules = robots().rules;
  assert.ok(Array.isArray(rules));
  // Longest matching prefix wins, as Google and Bing read robots.txt.
  const allowed = (path: string, rule: (typeof rules)[number]) => {
    const match = (patterns: string | string[] | undefined) =>
      Math.max(-1, ...[patterns ?? []].flat().filter((pattern) => path.startsWith(pattern)).map((pattern) => pattern.length));
    return match(rule.allow) >= match(rule.disallow);
  };
  for (const rule of rules) {
    for (const path of ["/konto?dalej=%2Fatlas", "/sl/racun?tryb=login&dalej=%2Fsl", "/rejestracja?dalej=%2Fprofil", "/sl/registracija?dalej=%2Fsl", "/auth/google?dalej=%2F", "/profil/zachowaj?rodzaj=bingo", "/sl/profil/ohrani?rodzaj=bingo", "/profil/zapisz/code", "/sl/profil/shrani/code"]) {
      assert.equal(allowed(path, rule), false, path);
    }
    for (const path of ["/", "/sl", "/konto", "/sl/racun", "/rejestracja", "/sl/registracija", "/profil", "/atlas/dziaders-grillowy", "/sl/atlas/zarni-dziaders", "/kontakt", "/opengraph-image", "/_next/static/chunks/app.js"]) {
      assert.equal(allowed(path, rule), true, path);
    }
  }
});

test("both contact pages are in the sitemap with reciprocal language alternates", () => {
  const entries = sitemap();
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  for (const path of ["/kontakt", "/sl/kontakt"]) {
    const entry = entries.find((entry) => entry.url === `${site.url}${path}`);
    assert.ok(entry);
    assert.deepEqual(entry.alternates?.languages, { pl: `${site.url}/kontakt`, sl: `${site.url}/sl/kontakt`, "x-default": `${site.url}/kontakt` });
  }
  for (const entry of entries) assert.doesNotMatch(new URL(entry.url).pathname, /\/(?:konto|racun|profil|wynik|izvid|grupa|lestvica)(?:\/|$)/);
});

test("registration is discoverable in both editions with reciprocal canonical alternates", () => {
  const entries = sitemap();
  const languages = { pl: `${site.url}/rejestracja`, sl: `${site.url}/sl/registracija`, "x-default": `${site.url}/rejestracja` };
  for (const locale of ["pl", "sl"] as const) {
    const entry = entries.find((entry) => entry.url === languages[locale]);
    assert.ok(entry);
    assert.deepEqual(entry.alternates?.languages, languages);
    const metadata = pageMetadata(locale, { title: "Registration", description: "Create a free profile", path: "/rejestracja", defaultImage: true });
    assert.equal(metadata.alternates?.canonical, locale === "pl" ? "/rejestracja" : "/sl/registracija");
    assert.equal(metadata.robots, undefined);
  }
});

test("known Slovenian articles in the 404 report redirect directly to sitemap pages", async () => {
  const { getPathMatch } = await import("next/dist/shared/lib/router/utils/path-match.js");
  const { prepareDestination } = await import("next/dist/shared/lib/router/utils/prepare-destination.js");
  const { default: config } = await import("../next.config");
  const redirects = await config.redirects!();
  const redirect = (path: string, query: Record<string, string> = {}) => {
    for (const rule of redirects) {
      if (rule.has || rule.missing) continue;
      const params = getPathMatch(rule.source, { removeUnnamedParams: true, strict: true })(path);
      if (params) {
        assert.equal(rule.permanent, true);
        return prepareDestination({ appendParamsToQuery: false, destination: rule.destination, params, query }).parsedDestination;
      }
    }
    return null;
  };
  const publicPages = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
  for (const rule of legacyContentRedirects()) {
    const destination = redirect(rule.source, { utm_source: "report" });
    assert.ok(destination);
    assert.equal(destination.pathname, rule.destination, rule.source);
    assert.equal(destination.query.utm_source, "report");
    assert.ok(publicPages.has(rule.destination), rule.destination);
    assert.equal(redirect(rule.destination), null, `redirect loop: ${rule.destination}`);
  }
  assert.equal(redirect("/slownik/koliko-ste-pa-dali-za-to")?.pathname, "/sl/slovar/koliko-ste-pa-dali-za-to");
  assert.equal(redirect("/atlas/golobarski-dziaders")?.pathname, "/sl/atlas/golobarski-dziaders");
  for (const path of ["/$", "/&", "/atlas/nieznany-gatunek", "/atlas/dziaders-grillowy", "/slownik/za-moich-czasow", "/atlas/zarni-dziaders/opengraph-image"]) {
    assert.equal(redirect(path), null, path);
  }
});

test("private account and search headers agree with metadata and public registration stays indexable", async () => {
  const { getPathMatch } = await import("next/dist/shared/lib/router/utils/path-match.js");
  const { default: config } = await import("../next.config");
  const rules = await config.headers!();
  const headers = (path: string) => {
    const result: Record<string, string> = {};
    for (const rule of rules) {
      if (getPathMatch(rule.source)(path)) for (const header of rule.headers) result[header.key.toLowerCase()] = header.value;
    }
    return result;
  };
  for (const path of ["/konto", "/sl/racun", "/profil", "/sl/profil", "/szukaj", "/sl/iskanje"]) {
    assert.equal(headers(path)["x-robots-tag"], "noindex, follow", path);
  }
  for (const path of ["/konto", "/sl/racun", "/profil", "/sl/profil"]) assert.equal(headers(path)["referrer-policy"], "no-referrer", path);
  for (const path of ["/wynik/code", "/sl/izvid/code", "/profil/zapisz/code", "/sl/profil/shrani/code"]) {
    assert.equal(headers(path)["x-robots-tag"], "noindex, nofollow", path);
  }
  for (const path of ["/rejestracja", "/sl/registracija", "/sl", "/atlas/dziaders-grillowy", "/sl/atlas/zarni-dziaders"]) {
    assert.equal(headers(path)["x-robots-tag"], undefined, path);
  }
  // Share cards stay out of search results but open to link previews and other sites.
  for (const path of ["/opengraph-image", "/sl/opengraph-image", "/atlas/dziaders-grillowy/opengraph-image", "/sl/slovar/v-mojih-casih/opengraph-image"]) {
    assert.equal(headers(path)["x-robots-tag"], "noindex", path);
    assert.equal(headers(path)["cross-origin-resource-policy"], "cross-origin", path);
  }
});

test("a guest on the profile is sent to the bare, crawlable account page", () => {
  assert.equal(signInPath("/profil", "pl"), "/konto");
  assert.equal(signInPath("/profil", "sl"), "/sl/racun");
  assert.equal(signInPath("/profil#legitymacja", "pl"), "/konto?dalej=%2Fprofil%23legitymacja");
});

test("guest bookmarks go directly to sign-in and preserve the localised save destination", () => {
  for (const locale of ["pl", "sl"] as const) {
    const href = signInPath("/profil/zachowaj?rodzaj=rozmowki&kod=komputer-029", locale);
    const url = new URL(href, site.url);
    assert.equal(url.pathname, locale === "pl" ? "/konto" : "/sl/racun");
    assert.equal(url.searchParams.get("dalej"), locale === "pl" ? "/profil/zachowaj?rodzaj=rozmowki&kod=komputer-029" : "/sl/profil/ohrani?rodzaj=rozmowki&kod=komputer-029");
  }
});

test("organisation contact and security disclosure use the published administrator email", async () => {
  for (const locale of ["pl", "sl"] as const) {
    const contact = institute(locale).contactPoint;
    assert.equal(contact.email, site.controller.email);
    assert.equal(contact.url, `${site.url}${locale === "pl" ? "" : "/sl"}/kontakt`);
    assert.deepEqual(contact.availableLanguage, ["pl", "sl"]);
  }
  const response = securityRecord();
  assert.match(response.headers.get("content-type")!, /^text\/plain; charset=utf-8$/);
  const text = await response.text();
  assert.ok(text.includes(`Contact: mailto:${site.controller.email}\n`));
  assert.ok(text.includes(`Canonical: ${site.url}/.well-known/security.txt\n`));
  assert.match(text, /^Expires: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/m);
});
