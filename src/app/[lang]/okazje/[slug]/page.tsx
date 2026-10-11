import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewCardButton } from "@/components/bingo-board";
import { BingoGrid } from "@/components/bingo-grid";
import { editorialPath, publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getOccasions } from "@/content/bingo";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { dossierBySlug, getDossiers } from "@/content/dossiers";
import { getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { sampleCard } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { quote, typo } from "@/lib/typo";

type Props = { params: Promise<{ lang: string; slug: string }> };
const COPY = defineCopy({
  pl: {
    occasions: "Okazje",
    terrain: "Rozpoznanie terenu",
    signals: "Sygnały obecności",
    protocol: "Protokół obserwacji",
    species: "Gatunki w środowisku",
    phrases: "Co można usłyszeć",
    bingo: "Bingo dla całego stołu",
    bingoIntro:
      "Każdy losuje własną kartę. Skreślaj zasłyszane zdania i zaobserwowane sytuacje. Pięć pól w jednej linii wygrywa. Nie trzeba wymuszać cytatu słowo w słowo.",
    draw: "Losuj kartę na telefon",
    print: "Cztery karty do druku",
    sample: "Przykładowa karta",
    packing: "Lista wyposażenia",
    case: "Sprawa do rozstrzygnięcia",
    vote: "Przeczytaj sprawę i zagłosuj",
    report: "Z dokumentacji Instytutu",
    materials: "Wszystkie materiały do druku",
    jump: "Przejdź do bingo",
    promo: "Rozpoznajesz kogoś przy stole?",
    promoText: "Sprawdź najpierw siebie. Test Dziadersa wydaje certyfikat, który można spokojnie pokazać rodzinie.",
  },
  sl: {
    occasions: "Priložnosti",
    terrain: "Izvid terena",
    signals: "Znaki prisotnosti",
    protocol: "Opazovalni zapisnik",
    species: "Vrste v okolju",
    phrases: "Kaj lahko slišiš",
    bingo: "Bingo za vso mizo",
    bingoIntro:
      "Vsak izžreba svoj listek. Prečrtaj slišane stavke in opažene situacije. Pet polj v eni vrsti zmaga. Dobesedni citat ni potreben.",
    draw: "Izžrebaj listek za telefon",
    print: "Štirje listki za tisk",
    sample: "Primer listka",
    packing: "Seznam opreme",
    case: "Primer za razsojo",
    vote: "Preberi primer in glasuj",
    report: "Iz dokumentacije Inštituta",
    materials: "Vse gradivo za tisk",
    jump: "Pojdi na bingo",
    promo: "Prepoznaš koga pri mizi?",
    promoText: "Najprej preveri sebe. Test dziadersa izda certifikat, ki ga lahko mirno pokažeš družini.",
  },
});
const META_COPY = defineCopy({
  pl: { title: (name: string) => name + ": przewodnik i bingo do druku" },
  sl: { title: (name: string) => name + ": vodnik in bingo za tisk" },
});
export const instant = false;
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getDossiers(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const dossier = dossierBySlug((await params).slug, locale);
  return dossier
    ? pageMetadata(locale, {
        title: META_COPY[locale].title(dossier.title),
        description: dossier.lead,
        path: "/okazje/" + dossier.slug,
        type: "article",
      })
    : {};
}
export default async function DossierPage({ params }: Props) {
  const locale = await getLocale();
  const t = COPY[locale];
  const dossier = dossierBySlug((await params).slug, locale);
  if (!dossier) notFound();
  const occasion = getOccasions(locale).find((item) => item.slug === dossier.bingo)!;
  const card = sampleCard(occasion);
  const species = dossier.species.map((key) => getSpecies(locale).find((item) => item.key === key)!);
  const phrases = dossier.dictionary.map((slug) =>
    getDictionary(locale).find((item) => "/slownik/" + item.slug === editorialPath("slownik", slug, locale))!,
  );
  const casePath = editorialPath("czy-to-juz-dziaderstwo", dossier.caseSlug, locale);
  const caseItem = getCases(locale).find((item) => "/czy-to-juz-dziaderstwo/" + item.slug === casePath)!;
  const reportPath = dossier.reportSlug ? editorialPath("raporty", dossier.reportSlug, locale) : undefined;
  const report = getReports(locale).find((item) => "/raporty/" + item.slug === reportPath);
  const path = "/okazje/" + dossier.slug;
  const crumbs = [{ label: t.occasions, href: "/okazje" }, { label: dossier.title }];
  return (
    <main id="tresc">
      <JsonLd
        data={[breadcrumbList(locale, crumbs), publicationSchema(locale, path, dossier.title, dossier.lead, "Article")]}
      />
      <PageHeader
        crumbs={crumbs}
        title={dossier.title}
        lead={typo(dossier.lead)}
        meta={dossier.code + " · " + dossier.season}
        aside={<SpeciesPlate species={species[0].key} className="mx-auto w-72 max-w-full" />}
      />
      <div className="wrap mt-8 flex flex-wrap gap-4">
        <Link href="#bingo" className="btn bg-ink text-paper hover:bg-red">
          {t.jump} ↓
        </Link>
        <Link href={"/bingo/" + card.code + "/druk"} className="btn border border-ink hover:bg-ink hover:text-paper">
          {t.print}
        </Link>
      </div>
      <Section id="teren" title={t.terrain}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-xl leading-relaxed">
            {dossier.introduction.map((text) => (
              <p key={text}>{typo(text)}</p>
            ))}
          </div>
          <div className="border border-rule bg-paper-deep p-6 md:p-8">
            <h3 className="label text-red">{t.signals}</h3>
            <ul className="mt-5 space-y-4">
              {dossier.signals.map((signal, i) => (
                <li key={signal} className="flex gap-4">
                  <span className="label text-ink-faint">0{i + 1}</span>
                  <span>{typo(signal)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section id="protokol" title={t.protocol}>
        <ol className="grid gap-8 md:grid-cols-3">
          {dossier.protocol.map((step, i) => (
            <li key={step.title}>
              <p className="label text-red">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 text-ink-soft">{typo(step.text)}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="gatunki" title={t.species}>
        <div className="grid gap-8 sm:grid-cols-3">
          {species.map((item) => (
            <Link key={item.key} href={"/atlas/" + item.slug} className="group">
              <SpeciesPlate species={item.key} className="mx-auto h-40 w-52 max-w-full" />
              <h3 className="mt-4 text-2xl font-bold group-hover:text-red">{item.name}</h3>
              <p className="mt-2 text-ink-soft">{typo(item.teaser)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section id="wokalizacje" title={t.phrases}>
        <div className="grid gap-8 md:grid-cols-3">
          {phrases.map((entry) => (
            <Link key={entry.slug} href={"/slownik/" + entry.slug} className="group border-t border-rule pt-5">
              <h3 className="text-2xl font-bold group-hover:text-red">{quote(entry.headword, locale)}</h3>
              <p className="mt-3 text-ink-soft">{typo(entry.senses[0].text)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section id="bingo" title={t.bingo}>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xl leading-relaxed">{typo(t.bingoIntro)}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <NewCardButton slug={occasion.slug} className="btn bg-ink text-paper hover:bg-red">
                {t.draw}
              </NewCardButton>
              <Link
                href={"/bingo/" + card.code + "/druk"}
                className="btn border border-ink hover:bg-ink hover:text-paper"
              >
                {t.print}
              </Link>
            </div>
            <h3 className="label mt-10 text-ink-soft">{t.packing}</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {dossier.packing.map((item) => (
                <li key={item}>{typo(item)}</li>
              ))}
            </ul>
            <p className="mt-7">
              <Link href="/do-druku" className="link font-sans">
                {t.materials} →
              </Link>
            </p>
          </div>
          <div>
            <p className="label mb-3 text-ink-faint">{t.sample}</p>
            <BingoGrid card={card} locale={locale} compact className="border border-ink" />
          </div>
        </div>
      </Section>
      <Section id="sprawa" title={t.case}>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold">{caseItem.title}</h3>
          <p className="mt-4 text-xl leading-relaxed text-ink-soft">{typo(caseItem.facts)}</p>
          <Link href={casePath} className="btn mt-6 bg-ink text-paper hover:bg-red">
            {t.vote} →
          </Link>
          {report && (
            <div className="mt-9 border-t border-rule pt-5">
              <p className="label text-ink-faint">{t.report}</p>
              <Link href={reportPath!} className="link mt-3 inline-block text-xl font-bold">
                {report.title}
              </Link>
            </div>
          )}
          <TranslatorNotes notes={dossier.notes} className="mt-10" />
          <div className="mt-10">
            <ShareBar path={path} text={dossier.title} kind="okazja" />
          </div>
        </div>
      </Section>
      <TestPromo title={t.promo} text={t.promoText} />
    </main>
  );
}
