import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPath, publicationSchema } from "@/components/fieldwork-parts";
import { MuseumActions } from "@/components/museum-actions";
import { MuseumDrawing } from "@/components/museum-drawing";
import { breadcrumbList, JsonLd, PageHeader, Pager, Section } from "@/components/page";
import { ShareBar } from "@/components/share-bar";
import { getDictionary } from "@/content/dictionary";
import { exhibitBySlug, getExhibits } from "@/content/museum";
import { getReports } from "@/content/reports";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { quote, typo } from "@/lib/typo";

type Props = { params: Promise<{ lang: string; slug: string }> };
const COPY = defineCopy({
  pl: {
    museum: "Muzeum rzeczy",
    card: "Karta inwentarzowa",
    fields: ["Pochodzenie", "Stan zachowania", "Lokalizacja"],
    history: "Historia eksponatu",
    reason: "Uzasadnienie przechowywania",
    use: "Przewidywane zastosowanie",
    keep: "Decyzja konserwatorska",
    download: "Pobierz kartę muzealną · PNG",
    documentation: "Dokumentacja pokrewna",
    previous: "Poprzedni eksponat",
    next: "Następny eksponat",
    pager: "Sąsiednie eksponaty",
  },
  sl: {
    museum: "Muzej stvari",
    card: "Inventarna kartica",
    fields: ["Izvor", "Stanje ohranjenosti", "Lokacija"],
    history: "Zgodovina eksponata",
    reason: "Utemeljitev shranjevanja",
    use: "Predvidena uporaba",
    keep: "Konservatorska odločitev",
    download: "Prenesi muzejsko kartico · PNG",
    documentation: "Sorodna dokumentacija",
    previous: "Prejšnji eksponat",
    next: "Naslednji eksponat",
    pager: "Sosednji eksponati",
  },
});
export const instant = false;
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getExhibits(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const exhibit = exhibitBySlug((await params).slug, locale);
  return exhibit
    ? pageMetadata(locale, {
        title: exhibit.name + " · " + COPY[locale].museum,
        description: exhibit.subtitle + " " + exhibit.history[0],
        path: "/muzeum/" + exhibit.slug,
        type: "article",
      })
    : {};
}
export default async function ExhibitPage({ params }: Props) {
  const locale = await getLocale();
  const t = COPY[locale];
  const exhibit = exhibitBySlug((await params).slug, locale);
  if (!exhibit) notFound();
  const exhibits = getExhibits(locale);
  const index = exhibits.indexOf(exhibit);
  const previous = exhibits[index - 1];
  const next = exhibits[index + 1];
  const dictionaryPath = editorialPath("slownik", exhibit.dictionarySlug, locale);
  const entry = getDictionary(locale).find((item) => "/slownik/" + item.slug === dictionaryPath)!;
  const reportPath = exhibit.reportSlug ? editorialPath("raporty", exhibit.reportSlug, locale) : undefined;
  const report = getReports(locale).find((item) => "/raporty/" + item.slug === reportPath);
  const path = "/muzeum/" + exhibit.slug;
  const crumbs = [{ label: t.museum, href: "/muzeum" }, { label: exhibit.name }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          publicationSchema(locale, path, exhibit.name, exhibit.subtitle, "Article"),
        ]}
      />
      <PageHeader
        crumbs={crumbs}
        title={exhibit.name}
        lead={exhibit.subtitle}
        meta={exhibit.code + " · " + t.card}
        aside={<MuseumDrawing kind={exhibit.kind} className="mx-auto w-80 max-w-full" />}
      />
      <Section id="karta" title={t.card}>
        <dl className="grid gap-8 border border-rule bg-card p-6 md:grid-cols-3 md:p-8">
          {[exhibit.provenance, exhibit.condition, exhibit.location].map((value, i) => (
            <div key={value}>
              <dt className="label text-ink-faint">{t.fields[i]}</dt>
              <dd className="mt-3 text-xl">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section id="historia" title={t.history}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-xl leading-relaxed">
            {exhibit.history.map((text) => (
              <p key={text}>{typo(text)}</p>
            ))}
          </div>
          <aside className="border-l-2 border-red pl-6">
            <h3 className="label text-red">{t.reason}</h3>
            <blockquote className="mt-4 text-3xl font-bold leading-snug">{quote(exhibit.reason, locale)}</blockquote>
            <h3 className="label mt-8 text-ink-faint">{t.use}</h3>
            <p className="mt-3 text-ink-soft">{typo(exhibit.nextUse)}</p>
          </aside>
        </div>
      </Section>
      <Section id="zachowaj" title={t.keep}>
        <MuseumActions kind={exhibit.kind} />
        <p className="mt-6">
          <Link
            href={path + "/karta"}
            download={exhibit.slug + ".png"}
            prefetch={false}
            className="link font-sans font-medium"
          >
            {t.download} ↓
          </Link>
        </p>
        <div className="mt-8">
          <ShareBar path={path} text={exhibit.name + ". " + exhibit.subtitle} kind="eksponat" />
        </div>
      </Section>
      <Section id="dokumentacja" title={t.documentation}>
        <div className="space-y-4">
          <Link href={dictionaryPath} className="link text-xl font-bold">
            {quote(entry.headword, locale)}
          </Link>
          {report && (
            <p>
              <Link href={reportPath!} className="link text-xl">
                {report.title}
              </Link>
            </p>
          )}
        </div>
        <Pager
          label={t.pager}
          previous={
            previous ? { href: "/muzeum/" + previous.slug, label: t.previous, title: previous.name } : undefined
          }
          next={next ? { href: "/muzeum/" + next.slug, label: t.next, title: next.name } : undefined}
        />
      </Section>
    </main>
  );
}
