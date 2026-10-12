import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "../src/app/sitemap";
import { GET as securityRecord } from "../src/app/.well-known/security.txt/route";
import { signInPath } from "../src/lib/account";
import { describe, institute, pageMetadata } from "../src/lib/seo";
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
    assert.deepEqual(metadata.openGraph?.images, [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: institute(locale).name }]);
    // Let Next inherit the final OG image, including the file-based card on other pages.
    assert.equal(metadata.twitter?.images, undefined);
    const dedicated = pageMetadata(locale, { title: "Atlas", description: "An atlas", path: "/atlas" });
    assert.equal(dedicated.openGraph?.images, undefined);
    const privateResult = pageMetadata(locale, { title: "Result", description: "Private", path: "/wynik/code", noindex: true, nofollow: true });
    assert.deepEqual(privateResult.robots, { index: false, follow: false });
    const account = pageMetadata(locale, { title: "Account", description: "Sign in", path: "/konto", noindex: true });
    assert.deepEqual(account.robots, { index: false, follow: true });
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
  for (const path of ["/rejestracja", "/sl/registracija", "/sl", "/atlas/dziaders-grillowy", "/sl/atlas/zarni-dziaders", "/sl/slownik/v-mojih-casih/opengraph-image"]) {
    assert.equal(headers(path)["x-robots-tag"], undefined, path);
  }
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
