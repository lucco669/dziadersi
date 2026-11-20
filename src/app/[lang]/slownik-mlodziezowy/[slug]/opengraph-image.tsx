import { notFound } from "next/navigation";
import { getSlang, slangBySlug } from "@/content/slang";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "@/lib/fieldwork-cards";
import { OgPlate } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { section: "Słownik młodzieżowy dla dziadersów", title: (word: string) => `${word} — co to znaczy?` },
  sl: { section: "Mladinski slovar za dziaderse", title: (word: string) => `${word} — kaj pomeni?` },
});

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSlang(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((entry) => ({ slug: entry.slug }));
}

/** The word and the first sentence of its plain meaning, beside the Atlas's youngest Facebook specimen. */
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const entry = slangBySlug(slug, locale);
  if (!entry) notFound();
  const t = COPY[locale];
  const first = entry.meaning.split(/(?<=[.:])\s/)[0];
  return fieldworkCard(locale, {
    title: t.title(entry.word),
    subtitle: first.length > 150 ? first.slice(0, first.lastIndexOf(" ", 148)) + "…" : first,
    section: t.section,
    path: "/slownik-mlodziezowy/" + entry.slug,
    art: <OgPlate species="facebook" specimen={1} width={360} />,
  });
}
