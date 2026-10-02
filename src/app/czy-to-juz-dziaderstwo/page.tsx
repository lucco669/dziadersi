import type { Metadata } from "next";
import Link from "next/link";
import { CaseSubmission } from "@/components/case-submission";
import { CommissionPlate } from "@/components/court";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Docket } from "@/components/verdict";
import { CASE_CATEGORIES, CASES, docket, VERDICTS } from "@/content/cases";
import { getCommunity } from "@/lib/community";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, plural, typo } from "@/lib/typo";

const title = "Czy to już dziaderstwo?";
const description = `Komisja Orzekająca Instytutu Badań nad Dziaderstwem: ${CASES.length} spraw z życia wziętych. Głosuj jako ławnik: to jeszcze nie dziaderstwo, to już dziaderstwo czy dziaderstwo kliniczne. Potem uzasadnienie Komisji.`;

export const metadata: Metadata = pageMetadata({
  title: "Czy to już dziaderstwo? Komisja Orzekająca",
  description,
  path: "/czy-to-juz-dziaderstwo",
  shareTitle: `${title} · Komisja Orzekająca`,
  shareDescription: "Sprawy z życia wzięte. Orzekasz jako ławnik, Komisja uzasadnia.",
});

const RULES = [
  "Ławnik orzeka raz w każdej sprawie. Zmiana zdania po głosowaniu jest możliwa wyłącznie przy rodzinnym stole.",
  "Komisja orzeka o zachowaniach, nie o ludziach. Sprawy nie mają imion, nazwisk ani adresów.",
  "Uzasadnienie Komisji jest jawne, ale dopiero po oddaniu głosu. Żeby nie sugerować.",
  "Zdanie odrębne ławnika odnotowuje się w aktach. Nie ma od niego odwołania, ale można o nim opowiadać.",
];

export default async function CommissionPage() {
  const community = await getCommunity();
  const votes = community?.verdicts.total ?? 0;
  const cases = community?.verdicts.cases ?? null;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: "Komisja Orzekająca", href: "/czy-to-juz-dziaderstwo" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${site.url}/czy-to-juz-dziaderstwo`,
            inLanguage: "pl",
            publisher: institute,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: CASES.length,
              itemListElement: CASES.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${docket(item)}: ${item.title}`,
                url: `${site.url}/czy-to-juz-dziaderstwo/${item.slug}`,
              })),
            },
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: "Komisja Orzekająca" }]}
        title={title}
        lead={typo(
          "Komisja Orzekająca Instytutu rozpatruje sprawy z życia wzięte. Ty orzekasz jako ławnik, Komisja uzasadnia. Orzeczenia są ostateczne, chyba że ktoś się odwoła do mamy.",
        )}
        meta={`${CASES.length} ${plural(CASES.length, "sprawa", "sprawy", "spraw")} na wokandzie${votes ? ` · ${votes.toLocaleString("pl-PL")} ${plural(votes, "głos", "głosy", "głosów")} ławników` : ""}`}
        aside={<CommissionPlate animated className="ml-auto w-full max-w-sm" />}
      />

      <Section id="wokanda" title="Wokanda" aside="Posiedzenie jawne">
        <Docket counts={cases} />
      </Section>

      <Section id="sprawy" title="Wszystkie sprawy" aside={`Sygn. akt IBD-K 1/26 – ${CASES.length}/26`}>
        <ol className="border-t border-ink">
          {CASES.map((item) => {
            const counts = cases?.[item.slug];
            const total = VERDICTS.reduce((sum, option) => sum + (counts?.[option.key] ?? 0), 0);
            return (
              <li key={item.slug}>
                <Link
                  href={`/czy-to-juz-dziaderstwo/${item.slug}`}
                  className="group grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[8rem_1fr_11rem_7rem] md:items-baseline"
                >
                  <span className="label text-ink-soft">{docket(item)}</span>
                  <span className="text-xl font-bold leading-tight transition-colors group-hover:text-red">{item.title}</span>
                  <span className="label text-ink-soft">{CASE_CATEGORIES[item.category]}</span>
                  <span className={cx("label md:text-right", total ? "text-ink" : "text-ink-faint")}>
                    {total ? `${total} ${plural(total, "głos", "głosy", "głosów")}` : "Czeka na ławnika"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section
        id="zglos"
        title="Zgłoś sprawę"
        aside="Sekretariat Komisji"
        intro={typo(
          "Znasz sprawę, która powinna trafić na wokandę? Opisz stan faktyczny i to, co Uczestnik mówi na swoją obronę. Komisja czyta zgłoszenia ręcznie i wybiera najlepsze.",
        )}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <CaseSubmission />
          </div>
          <div className="lg:col-span-4">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">Regulamin Komisji</h3>
            <ol>
              {RULES.map((rule, i) => (
                <li key={rule} className="grid grid-cols-[2rem_1fr] border-b border-rule py-3 leading-snug">
                  <span className="font-sans text-[0.85rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
                  {typo(rule)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <TestPromo
        title="Orzekanie o innych to jedno."
        text={typo("Test Dziadersa orzeka o tobie. Pięć gabinetów, około czterech minut, certyfikat bez prawa odwołania.")}
      />
    </main>
  );
}
