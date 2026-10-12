import { CASE_SLUGS } from "../content/sl/slugs/cases";
import { DICTIONARY_SLUGS } from "../content/sl/slugs/dictionary";
import { DOSSIER_SLUGS } from "../content/sl/slugs/dossiers";
import { MUSEUM_SLUGS } from "../content/sl/slugs/museum";
import { REPORT_SLUGS } from "../content/sl/slugs/reports";
import { SPECIES_SLUGS } from "../content/sl/slugs/species";
import { SEGMENTS } from "./segments";

const CONTENT_SLUGS = {
  atlas: SPECIES_SLUGS,
  slownik: DICTIONARY_SLUGS,
  raporty: REPORT_SLUGS,
  "czy-to-juz-dziaderstwo": CASE_SLUGS,
  okazje: DOSSIER_SLUGS,
  muzeum: MUSEUM_SLUGS,
};

/**
 * Older links published Slovenian slugs without /sl. Only redirect known translations:
 * unknown URLs remain 404, and a slug that exists in Polish keeps its original page.
 * The /pl alias goes straight to the same destination, before the general /pl redirect.
 */
export function legacyContentRedirects() {
  return Object.entries(CONTENT_SLUGS).flatMap(([section, slugs]) =>
    Object.values(slugs)
      .filter((slug) => !Object.hasOwn(slugs, slug))
      .flatMap((slug) => ["", "/pl"].map((prefix) => ({
        source: `${prefix}/${section}/${slug}`,
        destination: `/sl/${SEGMENTS[section].sl}/${slug}`,
        permanent: true as const,
      }))),
  );
}
