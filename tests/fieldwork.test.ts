import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "../src/app/sitemap";
import { getOccasions } from "../src/content/bingo";
import { getCases } from "../src/content/cases";
import { getDictionary } from "../src/content/dictionary";
import { dossierBySlug, DOSSIERS, getDossiers } from "../src/content/dossiers";
import { exhibitBySlug, EXHIBITS, getExhibits } from "../src/content/museum";
import { getReports } from "../src/content/reports";
import { getSpecies } from "../src/content/species";
import { DOSSIER_SLUGS } from "../src/content/sl/slugs/dossiers";
import { MUSEUM_SLUGS } from "../src/content/sl/slugs/museum";
import { alternatePath, localizePath, switchPath } from "../src/i18n/routes";
import { buildSearchIndex } from "../src/lib/search-index";
import { search } from "../src/lib/search";
import { site } from "../src/lib/site";

test("field guides and exhibits resolve all editorial references in both editions", () => {
  for (const locale of ["pl", "sl"] as const) {
    const referenceExists = (section: string, slug: string, entries: { slug: string }[]) => {
      const path = alternatePath("/" + section + "/" + slug, "pl", locale);
      assert.ok(
        entries.some((entry) => "/" + section + "/" + entry.slug === path),
        path,
      );
    };
    for (const item of getDossiers(locale)) {
      assert.ok(
        getOccasions(locale).some((occasion) => occasion.slug === item.bingo),
        item.bingo,
      );
      item.species.forEach((key) =>
        assert.ok(
          getSpecies(locale).some((species) => species.key === key),
          key,
        ),
      );
      item.dictionary.forEach((slug) => referenceExists("slownik", slug, getDictionary(locale)));
      referenceExists("czy-to-juz-dziaderstwo", item.caseSlug, getCases(locale));
      if (item.reportSlug) referenceExists("raporty", item.reportSlug, getReports(locale));
    }
    for (const item of getExhibits(locale)) {
      referenceExists("slownik", item.dictionarySlug, getDictionary(locale));
      if (item.reportSlug) referenceExists("raporty", item.reportSlug, getReports(locale));
    }
    assert.equal(dossierBySlug("missing-guide", locale), undefined);
    assert.equal(exhibitBySlug("missing-exhibit", locale), undefined);
  }
});

test("every new publication has a unique translated slug and reciprocal sitemap alternates", () => {
  const entries = sitemap();
  for (const [section, content, map] of [
    ["okazje", DOSSIERS, DOSSIER_SLUGS],
    ["muzeum", EXHIBITS, MUSEUM_SLUGS],
  ] as const) {
    assert.equal(new Set(Object.values(map)).size, content.length);
    for (const item of content) {
      assert.ok(map[item.slug], item.slug);
      const polish = "/" + section + "/" + item.slug;
      const slovenian = localizePath("/" + section + "/" + map[item.slug], "sl");
      assert.equal(switchPath(polish, "sl"), slovenian);
      assert.equal(switchPath(slovenian, "pl"), polish);
      for (const path of [polish, slovenian]) {
        const entry = entries.find((entry) => entry.url === site.url + path);
        assert.ok(entry, path);
        assert.deepEqual(entry.alternates?.languages, {
          pl: site.url + polish,
          sl: site.url + slovenian,
          "x-default": site.url + polish,
        });
      }
    }
  }
  for (const path of ["/dziaders", "/do-druku", "/okazje", "/muzeum"]) {
    for (const locale of ["pl", "sl"] as const)
      assert.ok(
        entries.some((entry) => entry.url === site.url + localizePath(path, locale)),
        path,
      );
  }
  assert.ok(
    entries.every(
      (entry) =>
        !/\/(?:karta|kartica|karty-gatunkow|kartice-vrst|przewodnik|vodnik)$/.test(new URL(entry.url).pathname),
    ),
  );
  assert.equal(switchPath("/do-druku/karty-gatunkow", "sl"), "/sl/za-tisk/kartice-vrst");
  assert.equal(switchPath("/sl/za-tisk/vodnik", "pl"), "/do-druku/przewodnik");
});

test("search discovers editorial guides and individual museum exhibits in each language", () => {
  for (const locale of ["pl", "sl"] as const) {
    const index = buildSearchIndex(locale);
    assert.equal(index.filter((item) => item.k === "okazja").length, DOSSIERS.length);
    assert.equal(index.filter((item) => item.k === "eksponat").length, EXHIBITS.length);
    for (const item of getExhibits(locale))
      assert.ok(
        search(index, item.name, locale).some((result) => result.h === "/muzeum/" + item.slug),
        item.name,
      );
    for (const item of getDossiers(locale))
      assert.ok(
        search(index, item.title, locale).some((result) => result.h === "/okazje/" + item.slug),
        item.title,
      );
  }
});
