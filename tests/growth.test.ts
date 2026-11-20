import assert from "node:assert/strict";
import { test } from "node:test";
import { localizePath, parsePath } from "../src/i18n/routes";
import { STORY_QUERY } from "../src/lib/share-file";
import { socialProfiles } from "../src/lib/site";

test("social profiles appear only once a handle is filled in", () => {
  assert.deepEqual(socialProfiles({ instagram: "", facebook: "", threads: "", tiktok: "" }), []);
  const profiles = socialProfiles({ instagram: "@dziader.si", facebook: "", threads: " dziader.si ", tiktok: "dziadersi" });
  assert.deepEqual(
    profiles.map(({ network, url }) => [network, url]),
    [
      ["instagram", "https://www.instagram.com/dziader.si/"],
      ["threads", "https://www.threads.com/@dziader.si"],
      ["tiktok", "https://www.tiktok.com/@dziadersi"],
    ],
  );
});

test("new routes have Slovenian addresses that map back to their folders", () => {
  const routes: [string, string][] = [
    ["/dla-mediow", "/sl/za-medije"],
    ["/indeks/ramka", "/sl/indeks/okvir"],
    ["/indeks/plakietka", "/sl/indeks/znacka"],
    ["/generator/samochod-3b7/karta", "/sl/pogovornik/samochod-3b7/kartica"],
    ["/egzamin/193ci8kqqs07m/karta", "/sl/izpit/193ci8kqqs07m/kartica"],
    ["/superinteligencja/samochod-0051aae06/karta", "/sl/superinteligenca/samochod-0051aae06/kartica"],
    ["/czy-to-juz-dziaderstwo/kljuci-v-kljucavnici/karta", "/sl/je-to-ze-dziaderstvo/kljuci-v-kljucavnici/kartica"],
  ];
  for (const [path, slovenian] of routes) {
    assert.equal(localizePath(path, "sl"), slovenian);
    assert.deepEqual(parsePath(slovenian), { locale: "sl", path });
  }
  // Story images keep the Polish query words in both editions.
  assert.deepEqual(STORY_QUERY, { post: "post", story: "relacja" });
});

test("only the Index widget may be framed by other sites, and its images may be embedded", async () => {
  const { default: config } = await import("../next.config");
  const rules = await config.headers!();
  const value = (source: string, key: string) =>
    rules.filter((rule) => rule.source === source || rule.source === "/:path*").flatMap((rule) => rule.headers).filter((header) => header.key === key).at(-1)?.value;

  for (const source of ["/indeks/ramka", "/sl/indeks/okvir"]) {
    assert.match(value(source, "Content-Security-Policy") ?? "", /frame-ancestors \*/);
  }
  for (const source of ["/indeks", "/dla-mediow", "/sl/indeks"]) {
    assert.match(value(source, "Content-Security-Policy") ?? "", /frame-ancestors 'none'/);
  }
  const framable = rules.filter((rule) => rule.headers.some((header) => header.key === "Content-Security-Policy" && header.value.includes("frame-ancestors *")));
  assert.deepEqual(framable.map((rule) => rule.source).sort(), ["/indeks/ramka", "/sl/indeks/okvir"]);
  for (const source of ["/indeks/plakietka", "/sl/indeks/znacka", "/indeks/ramka"]) {
    assert.equal(value(source, "Cross-Origin-Resource-Policy"), "cross-origin");
  }
});

test("Organization sameAs lists the social profiles only once there are some", async () => {
  const { institute } = await import("../src/lib/seo");
  const { SOCIAL } = await import("../src/lib/site");
  assert.equal("sameAs" in institute("pl"), Object.values(SOCIAL).some(Boolean));
});
