import type { Metadata } from "next";
import { CaseSubmission } from "@/components/case-submission";
import { CommissionPlate } from "@/components/court";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Docket } from "@/components/verdict";
import { caseCategories, caseKey, docket, getCases, getVerdicts } from "@/content/cases";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { cx, formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Czy to już dziaderstwo?",
    section: "Komisja Orzekająca",
    description: (cases: number) =>
      `Czy to już dziaderstwo? Komisja Orzekająca rozpatruje ${cases} spraw z życia wziętych. Głosuj jako ławnik i przeczytaj uzasadnienie Komisji.`,
    shareDescription: "Sprawy z życia wzięte. Orzekasz jako ławnik, Komisja uzasadnia.",
    rules: [
      "Ławnik orzeka raz w każdej sprawie. Zmiana zdania po głosowaniu jest możliwa wyłącznie przy rodzinnym stole.",
      "Komisja orzeka o zachowaniach, nie o ludziach. Sprawy nie mają imion, nazwisk ani adresów.",
      "Uzasadnienie Komisji jest jawne, ale dopiero po oddaniu głosu. Żeby nie sugerować.",
      "Zdanie odrębne ławnika odnotowuje się w aktach. Nie ma od niego odwołania, ale można o nim opowiadać.",
    ],
    lead: "Komisja Orzekająca Instytutu rozpatruje sprawy z życia wzięte. Ty orzekasz jako ławnik, Komisja uzasadnia. Orzeczenia są ostateczne, chyba że ktoś się odwoła do mamy.",
    meta: (cases: number, votes: number) =>
      `${cases} ${plural(cases, "sprawa", "sprawy", "spraw")} na wokandzie${votes ? ` · ${formatNumber("pl", votes)} ${plural(votes, "głos", "głosy", "głosów")} ławników` : ""}`,
    docket: "Wokanda",
    sitting: "Posiedzenie jawne",
    all: "Wszystkie sprawy",
    range: (cases: number) => `Sygn. akt IBD-K 1/26 – ${cases}/26`,
    votes: (total: number) => `${total} ${plural(total, "głos", "głosy", "głosów")}`,
    waiting: "Czeka na ławnika",
    propose: "Zgłoś sprawę",
    office: "Sekretariat Komisji",
    proposeIntro:
      "Znasz sprawę, która powinna trafić na wokandę? Opisz stan faktyczny i to, co Uczestnik mówi na swoją obronę. Komisja czyta zgłoszenia ręcznie i wybiera najlepsze.",
    statute: "Regulamin Komisji",
    promoTitle: "Orzekanie o innych to jedno.",
    promoText: "Test Dziadersa orzeka o tobie. Pięć gabinetów, około czterech minut, certyfikat bez prawa odwołania.",
  },
  sl: {
    title: "Je to že dziaderstvo?",
    section: "Razsodna komisija",
    description: (cases: number) =>
      `Je to že dziaderstvo? Razsodna komisija obravnava ${cases} primerov iz življenja. Glasuj kot porotnik in preberi obrazložitev Komisije.`,
    shareDescription: "Primeri iz življenja. Razsojaš kot porotnik, Komisija obrazloži.",
    rules: [
      "Porotnik o vsakem primeru odloči enkrat. Mnenje lahko po glasovanju spremeni samo še za družinsko mizo.",
      "Komisija razsoja o vedenju, ne o ljudeh. Primeri so brez imen, priimkov in naslovov.",
      "Obrazložitev Komisije je javna, a šele po oddanem glasu. Da ne bi sugerirala.",
      "Ločeno mnenje porotnika se zabeleži v spis. Zoper njega ni pritožbe, lahko pa se o njem pripoveduje.",
    ],
    lead: "Razsodna komisija Inštituta obravnava primere iz življenja. Ti razsojaš kot porotnik, Komisija obrazloži. Razsodbe so pravnomočne, razen če se kdo pritoži pri mami.",
    meta: (cases: number, votes: number) =>
      `${cases} ${pluralSl(cases, "primer", "primera", "primeri", "primerov")} na dnevnem redu${votes ? ` · ${formatNumber("sl", votes)} ${pluralSl(votes, "glas", "glasova", "glasovi", "glasov")} porotnikov` : ""}`,
    docket: "Dnevni red",
    sitting: "Javna seja",
    all: "Vsi primeri",
    range: (cases: number) => `Opr. št. IBD-K 1/26 – ${cases}/26`,
    votes: (total: number) => `${total} ${pluralSl(total, "glas", "glasova", "glasovi", "glasov")}`,
    waiting: "Čaka na porotnika",
    propose: "Predlagaj primer",
    office: "Tajništvo Komisije",
    proposeIntro:
      "Poznaš primer, ki bi moral priti na dnevni red? Opiši dejansko stanje in to, kar Udeleženec pravi v svoj zagovor. Komisija predloge bere ročno in izbere najboljše.",
    statute: "Poslovnik Komisije",
    promoTitle: "Razsojati o drugih je eno.",
    promoText: "Test dziadersa razsodi o tebi. Pet ordinacij, približno štiri minute, certifikat brez pravice do pritožbe.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: `${t.title} ${t.section}`,
    description: t.description(getCases(locale).length),
    path: "/czy-to-juz-dziaderstwo",
    shareTitle: `${t.title} · ${t.section}`,
    shareDescription: t.shareDescription,
  });
}

export default async function CommissionPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const cases = getCases(locale);
  const verdicts = getVerdicts(locale);
  const categories = caseCategories(locale);
  const community = await getCommunity("counts");
  const votes = community?.verdicts.total ?? 0;
  // Keyed by caseKey(): the Polish slug, in both editions.
  const counts = community?.verdicts.cases ?? null;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.section, href: "/czy-to-juz-dziaderstwo" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.title,
            description: t.description(cases.length),
            url: absoluteUrl("/czy-to-juz-dziaderstwo", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: cases.length,
              itemListElement: cases.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${docket(item)}: ${item.title}`,
                url: absoluteUrl(`/czy-to-juz-dziaderstwo/${item.slug}`, locale),
              })),
            },
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.section }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta(cases.length, votes)}
        aside={<CommissionPlate animated className="ml-auto w-full max-w-sm" />}
      />

      <Section id="wokanda" title={t.docket} aside={t.sitting}>
        <Docket counts={counts} />
      </Section>

      <Section id="sprawy" title={t.all} aside={t.range(cases.length)}>
        <ol className="border-t border-ink">
          {cases.map((item) => {
            const tally = counts?.[caseKey(item)];
            const total = verdicts.reduce((sum, option) => sum + (tally?.[option.key] ?? 0), 0);
            return (
              <li key={item.slug}>
                <Link
                  href={`/czy-to-juz-dziaderstwo/${item.slug}`}
                  className="group grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[8rem_1fr_11rem_7rem] md:items-baseline"
                >
                  <span className="label text-ink-soft">{docket(item)}</span>
                  <span className="text-xl font-bold leading-tight transition-colors group-hover:text-red">{item.title}</span>
                  <span className="label text-ink-soft">{categories[item.category]}</span>
                  <span className={cx("label md:text-right", total ? "text-ink" : "text-ink-faint")}>
                    {total ? t.votes(total) : t.waiting}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="zglos" title={t.propose} aside={t.office} intro={typo(t.proposeIntro)}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <CaseSubmission />
          </div>
          <div className="lg:col-span-4">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.statute}</h3>
            <ol>
              {t.rules.map((rule, i) => (
                <li key={rule} className="grid grid-cols-[2rem_1fr] border-b border-rule py-3 leading-snug">
                  <span className="font-sans text-[0.85rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
                  {typo(rule)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
