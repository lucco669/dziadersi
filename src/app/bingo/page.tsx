import type { Metadata } from "next";
import Link from "next/link";
import { NewCardButton } from "@/components/bingo-board";
import { OccasionPlate } from "@/components/occasions";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { OCCASIONS } from "@/content/bingo";
import { sampleCard } from "@/lib/bingo";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Dziaders Bingo";
const description =
  "Bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę: karty z tym, co zawsze mówi wujek. Skreślaj na telefonie albo wydrukuj cztery karty na stół.";

export const metadata: Metadata = pageMetadata({
  title: "Dziaders Bingo: karty na wesele, Wigilię i majówkę",
  description,
  path: "/bingo",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "Karty bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę. Pięć w linii wygrywa.",
});

const RULES = [
  "Każdy gracz losuje własną kartę. Na jednej karcie gra się nieuczciwie.",
  "Skreślaj, co usłyszysz albo zobaczysz. Słowo w słowo nie jest wymagane, sens tak.",
  "Pięć skreśleń w linii, w poziomie, w pionie albo po skosie, to bingo. Należy wstać i krzyknąć.",
  "Środkowe pole jest wolne. Ktoś i tak zaraz powie „za moich czasów”.",
];

export default function BingoPage() {
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/bingo" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            description,
            url: `${site.url}/bingo`,
            applicationCategory: "GameApplication",
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
          "Karty na okazje, przy których dziaderstwo osiąga szczyt sezonowy. Skreślaj na telefonie albo wydrukuj karty dla całego stołu.",
        )}
        meta={`${OCCASIONS.length} ${plural(OCCASIONS.length, "okazja", "okazje", "okazji")} · ${OCCASIONS.reduce((sum, occasion) => sum + occasion.squares.length, 0)} pól w puli · każda karta inna`}
      />

      <Section id="okazje" title="Wybierz okazję" aside="Karta losowana przy każdym kliknięciu">
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {OCCASIONS.map((occasion) => {
            const sample = sampleCard(occasion);
            return (
              <li key={occasion.slug} className="group grid gap-6 border-t border-ink pt-6 sm:grid-cols-[11rem_1fr]">
                <OccasionPlate slug={occasion.slug} animated className="w-full max-w-48" />
                <div>
                  <h3 className="text-[1.9rem] font-bold leading-tight">{occasion.title}</h3>
                  <p className="mt-2 leading-snug text-ink-soft">{typo(occasion.intro)}</p>
                  <ul className="mt-4 space-y-1 font-sans text-[0.92rem] leading-snug">
                    {sample.squares
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((square) => (
                        <li key={square} className="flex gap-2">
                          <span aria-hidden="true" className="text-red">
                            ×
                          </span>
                          {typo(square)}
                        </li>
                      ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <NewCardButton slug={occasion.slug} className="btn bg-ink text-paper hover:bg-red">
                      Losuj kartę <span aria-hidden="true">→</span>
                    </NewCardButton>
                    <Link href={`/bingo/${sample.code}`} className="link font-sans font-medium">
                      Przykładowa karta
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="zasady" title="Zasady" aside="Regulamin gry IBD-B1">
        <ol className="max-w-2xl border-t border-ink">
          {RULES.map((rule, i) => (
            <li key={rule} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-4 text-lg leading-snug">
              <span className="font-sans text-[0.9rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
              {typo(rule)}
            </li>
          ))}
        </ol>
      </Section>

      <TestPromo
        title="Bingo to obserwacja. Test to diagnoza."
        text={typo("Zanim skreślisz wujka, sprawdź siebie. Pięć gabinetów, cztery minuty, certyfikat.")}
      />
    </main>
  );
}
