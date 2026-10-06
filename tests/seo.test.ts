import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "../src/app/sitemap";
import { GET as securityRecord } from "../src/app/.well-known/security.txt/route";
import { signInPath } from "../src/lib/account";
import { describe, institute, pageMetadata } from "../src/lib/seo";
import { site } from "../src/lib/site";

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
