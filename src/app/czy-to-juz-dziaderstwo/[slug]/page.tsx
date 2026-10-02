import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, breadcrumbList, JsonLd, Pager, TestPromo } from "@/components/page";
import { SpeciesTile } from "@/components/species-parts";
import { CaseFile } from "@/components/verdict";
import { CASES, caseBySlug, docket } from "@/content/cases";
import { speciesByKey } from "@/content/species";
import { getCommunity } from "@/lib/community";
import { describe, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

// Every case is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams() {
  return CASES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/czy-to-juz-dziaderstwo/[slug]">): Promise<Metadata> {
  const item = caseBySlug((await params).slug);
  if (!item) return {};
  return pageMetadata({
    title: `${item.title}: czy to już dziaderstwo?`,
    description: describe(item.facts, " Zagłosuj jako ławnik Komisji Orzekającej.", ""),
    path: `/czy-to-juz-dziaderstwo/${item.slug}`,
    shareTitle: `${item.title}. Czy to już dziaderstwo?`,
    shareDescription: `Sprawa ${docket(item)} przed Komisją Orzekającą. Orzekasz jako ławnik.`,
    type: "article",
  });
}

export default async function CasePage({ params }: PageProps<"/czy-to-juz-dziaderstwo/[slug]">) {
  const item = caseBySlug((await params).slug);
  if (!item) notFound();
  const community = await getCommunity();
  const index = CASES.indexOf(item);
  const previous = CASES[(index - 1 + CASES.length) % CASES.length];
  const next = CASES[(index + 1) % CASES.length];
  const url = `${site.url}/czy-to-juz-dziaderstwo/${item.slug}`;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([
            { label: "Komisja Orzekająca", href: "/czy-to-juz-dziaderstwo" },
            { label: `Sprawa ${docket(item)}`, href: `/czy-to-juz-dziaderstwo/${item.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${item.title}: czy to już dziaderstwo?`,
            description: item.facts,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            inLanguage: "pl",
            articleSection: "Komisja Orzekająca",
            datePublished: "2026-10-02",
            author: institute,
            publisher: institute,
          },
        ]}
      />

      <div className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
        <Breadcrumbs crumbs={[{ label: "Komisja Orzekająca", href: "/czy-to-juz-dziaderstwo" }, { label: `Sprawa ${docket(item)}` }]} />
        <div className="mt-10 md:mt-14">
          <CaseFile item={item} initial={community?.verdicts.cases[item.slug] ?? null} heading="h1" position={`Sprawa ${item.number} z ${CASES.length}`} />
        </div>

        {item.species && item.species.length > 0 && (
          <section aria-labelledby="gatunki" className="mt-20">
            <h2 id="gatunki" className="border-t border-ink pt-5 text-[clamp(1.6rem,2.8vw,2.1rem)] font-bold">
              Gatunki w aktach sprawy
            </h2>
            <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {item.species.map((key) => (
                <li key={key}>
                  <SpeciesTile species={speciesByKey(key)} />
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="mt-16">
          <Link href="/czy-to-juz-dziaderstwo#wokanda" className="btn border border-ink hover:bg-ink hover:text-paper">
            Cała wokanda: {CASES.length} spraw <span aria-hidden="true">→</span>
          </Link>
        </p>
        <Pager
          label="Sąsiednie sprawy"
          previous={{ href: `/czy-to-juz-dziaderstwo/${previous.slug}`, label: docket(previous), title: previous.title }}
          next={{ href: `/czy-to-juz-dziaderstwo/${next.slug}`, label: docket(next), title: next.title }}
        />
      </div>

      <TestPromo
        title="Komisja orzeka o innych. Test o tobie."
        text={typo("Pięć gabinetów, około czterech minut. Wynik, rozpoznanie gatunku i certyfikat.")}
      />
    </main>
  );
}
