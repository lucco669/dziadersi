import type { Metadata } from "next";
import Link from "next/link";
import { SituationIcon } from "@/components/occasions";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Phrasebook } from "@/components/phrasebook";
import { SITUATIONS } from "@/content/phrasebook";
import { getBulletin } from "@/lib/bulletin";
import { line, seededLine, TOTAL_LINES } from "@/lib/phrasebook";
import { shuffled } from "@/lib/random";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const title = "Rozmówki dziaderskie";
const description =
  "Generator tekstów dziadersa: samochód, remont, urlop, restauracja, komputer, dzieci sąsiadów, pogoda i zakupy. Losuj, zostaw najlepszą puentę i wyślij rodzinie.";

export const metadata: Metadata = pageMetadata({
  title: "Rozmówki dziaderskie: generator tekstów dziadersa",
  description,
  path: "/generator",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "Wypowiedzi na każdą okazję: zagajenie, teza i puenta. Losuj, posłuchaj, wyślij rodzinie.",
});

const lines = new Intl.NumberFormat("pl-PL").format(TOTAL_LINES);

export default async function GeneratorPage() {
  const { today } = await getBulletin();
  const daily = seededLine(today);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/generator" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            description,
            url: `${site.url}/generator`,
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            inLanguage: "pl",
            isAccessibleForFree: true,
            publisher: institute,
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Wypowiedzi na każdą okazję, w ośmiu rozdziałach. Każda składa się z zagajenia, tezy i puenty, a każda część była słyszana w terenie.",
        )}
        meta={`${lines} wypowiedzi · wydanie I, ${site.founded} · na dziś: ${daily.situation.name.toLowerCase()}`}
      />

      <section aria-label="Generator" className="wrap py-12 md:py-16">
        <Phrasebook initial={{ slug: daily.situation.slug, picks: daily.picks }} />
      </section>

      <Section id="rozdzialy" title="Spis rozdziałów" aside="Po trzy przykłady z każdego">
        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {SITUATIONS.map((situation, i) => (
            <li key={situation.slug} className="border-t border-ink pt-5">
              <div className="flex items-center gap-3">
                <SituationIcon slug={situation.slug} className="h-9 w-11" />
                <h3 className="text-[1.6rem] font-bold leading-tight">{situation.name}</h3>
              </div>
              <ul className="mt-4">
                {shuffled(situation.claims.length, 101 + i * 13)
                  .slice(0, 3)
                  .map((claim, n) => {
                    const base = seededLine(101 + i * 13 + n, situation);
                    const sample = line(situation, [base.picks[0], claim, base.picks[2]]);
                    return (
                      <li key={sample.code} className="border-b border-rule py-3">
                        <Link href={`/generator/${sample.code}`} className="group block leading-snug">
                          <span className="italic transition-colors group-hover:text-red">„{typo(sample.parts[1])}”</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <TestPromo
        title="Mówisz tak? To nie generator."
        text={typo("Jeśli te wypowiedzi brzmią znajomo, ale z twoich ust, czas na badanie. Pięć gabinetów, cztery minuty.")}
      />
    </main>
  );
}
