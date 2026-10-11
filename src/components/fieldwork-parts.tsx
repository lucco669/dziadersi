import type { Dossier } from "@/content/dossiers";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { alternatePath } from "@/i18n/routes";
import { absoluteUrl, institute } from "@/lib/seo";
import { typo } from "@/lib/typo";
import { getSpecies } from "@/content/species";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: { open: "Otwórz przewodnik", field: "Przewodnik terenowy" },
  sl: { open: "Odpri vodnik", field: "Terenski vodnik" },
});

/** Resolve stable Polish editorial references to the edition's own content slugs. */
export const editorialPath = (section: string, slug: string, locale: Locale) =>
  alternatePath("/" + section + "/" + slug, "pl", locale);

export function publicationSchema(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  type: "Article" | "CollectionPage" = "CollectionPage",
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    ...(type === "Article" ? { headline: title, author: institute(locale) } : {}),
    description,
    url: absoluteUrl(path, locale),
    inLanguage: locale,
    publisher: institute(locale),
    isAccessibleForFree: true,
  };
}

export function DossierTile({ dossier, locale }: { dossier: Dossier; locale: Locale }) {
  const species = getSpecies(locale).find((item) => item.key === dossier.species[0])!;
  const t = COPY[locale];
  return (
    <Link
      href={"/okazje/" + dossier.slug}
      className="group flex h-full flex-col border border-rule bg-card p-6 transition-colors hover:border-ink md:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="label text-ink-soft">{dossier.code}</span>
        <span className="label text-red">{t.field}</span>
      </div>
      <SpeciesPlate
        species={species.key}
        className="mx-auto my-5 h-44 w-56 max-w-full transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none"
      />
      <h2 className="text-3xl font-bold leading-tight group-hover:text-red">{dossier.title}</h2>
      <p className="label mt-3 text-ink-faint">{dossier.season}</p>
      <p className="mt-4 flex-1 text-ink-soft">{typo(dossier.lead)}</p>
      <span className="link mt-6 self-start font-sans font-medium">{t.open} →</span>
    </Link>
  );
}
