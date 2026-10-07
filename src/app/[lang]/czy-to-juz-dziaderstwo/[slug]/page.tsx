import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, breadcrumbList, JsonLd, Pager, TestPromo } from "@/components/page";
import { SpeciesTile } from "@/components/species-parts";
import { CaseFile } from "@/components/verdict";
import { caseBySlug, caseKey, docket, getCases } from "@/content/cases";
import { speciesByKey } from "@/content/species";
import { hasLocale, LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, describe, institute, pageMetadata } from "@/lib/seo";
import { pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    section: "Komisja Orzekająca",
    title: (title: string) => `${title}: czy to już dziaderstwo?`,
    vote: " Zagłosuj jako ławnik Komisji Orzekającej.",
    shareTitle: (title: string) => `${title}. Czy to już dziaderstwo?`,
    shareDescription: (number: string) => `Sprawa ${number} przed Komisją Orzekającą. Orzekasz jako ławnik.`,
    case: (number: string) => `Sprawa ${number}`,
    position: (number: number, total: number) => `Sprawa ${number} z ${total}`,
    species: "Gatunki w aktach sprawy",
    all: (total: number) => `Cała wokanda: ${total} spraw`,
    pager: "Sąsiednie sprawy",
    promoTitle: "Komisja orzeka o innych. Test o tobie.",
    promoText: "Pięć gabinetów, około czterech minut. Wynik, rozpoznanie gatunku i certyfikat.",
  },
  sl: {
    section: "Razsodna komisija",
    title: (title: string) => `${title}: je to že dziaderstvo?`,
    vote: " Glasuj kot porotnik Razsodne komisije.",
    shareTitle: (title: string) => `${title}. Je to že dziaderstvo?`,
    shareDescription: (number: string) => `Primer ${number} pred Razsodno komisijo. Razsojaš kot porotnik.`,
    case: (number: string) => `Primer ${number}`,
    position: (number: number, total: number) => `Primer ${number} od ${total}`,
    species: "Vrste v spisu primera",
    all: (total: number) => `Ves dnevni red: ${total} ${pluralSl(total, "primer", "primera", "primeri", "primerov")}`,
    pager: "Sosednji primeri",
    promoTitle: "Komisija razsoja o drugih. Test o tebi.",
    promoText: "Pet ordinacij, približno štiri minute. Rezultat, diagnoza vrste in certifikat.",
  },
});

// Every case is prerendered; unknown slugs 404.
export const instant = false;

/** Each edition's own slugs. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getCases(params.lang).map((item) => ({ slug: item.slug })) : [];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/czy-to-juz-dziaderstwo/[slug]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const item = caseBySlug((await params).slug, locale);
  if (!item) return {};
  return pageMetadata(locale, {
    title: t.title(item.title),
    description: describe(item.facts, t.vote, ""),
    path: `/czy-to-juz-dziaderstwo/${item.slug}`,
    shareTitle: t.shareTitle(item.title),
    shareDescription: t.shareDescription(docket(item)),
    type: "article",
  });
}

export default async function CasePage({ params }: PageProps<"/[lang]/czy-to-juz-dziaderstwo/[slug]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const cases = getCases(locale);
  const item = caseBySlug((await params).slug, locale);
  if (!item) notFound();
  const community = await getCommunity("counts");
  const index = cases.indexOf(item);
  const previous = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const path = `/czy-to-juz-dziaderstwo/${item.slug}`;
  const url = absoluteUrl(path, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [
            { label: t.section, href: "/czy-to-juz-dziaderstwo" },
            { label: t.case(docket(item)), href: path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t.title(item.title),
            description: item.facts,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            inLanguage: LOCALE_INFO[locale].tag,
            articleSection: t.section,
            datePublished: "2026-10-02",
            author: institute(locale),
            publisher: institute(locale),
          },
        ]}
      />

      <div className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
        <Breadcrumbs crumbs={[{ label: t.section, href: "/czy-to-juz-dziaderstwo" }, { label: t.case(docket(item)) }]} />
        <div className="mt-10 md:mt-14">
          <CaseFile
            item={item}
            initial={community?.verdicts.cases[caseKey(item)] ?? null}
            heading="h1"
            position={t.position(item.number, cases.length)}
          />
        </div>

        {item.species && item.species.length > 0 && (
          <section aria-labelledby="gatunki" className="mt-20">
            <h2 id="gatunki" className="border-t border-ink pt-5 text-[clamp(1.6rem,2.8vw,2.1rem)] font-bold">
              {t.species}
            </h2>
            <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {item.species.map((key) => (
                <li key={key}>
                  <SpeciesTile species={speciesByKey(key, locale)} />
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="mt-16">
          <Link href="/czy-to-juz-dziaderstwo#wokanda" className="btn border border-ink hover:bg-ink hover:text-paper">
            {t.all(cases.length)} <span aria-hidden="true">→</span>
          </Link>
        </p>
        <Pager
          label={t.pager}
          previous={{ href: `/czy-to-juz-dziaderstwo/${previous.slug}`, label: docket(previous), title: previous.title }}
          next={{ href: `/czy-to-juz-dziaderstwo/${next.slug}`, label: docket(next), title: next.title }}
        />
      </div>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
