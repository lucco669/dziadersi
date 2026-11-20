import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Section, TestPromo } from "@/components/page";
import { SeatingPlanner } from "@/components/seating-planner";
import { SeatingShare } from "@/components/seating-share";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { assess, decodePlan, encodePlan, guestCount, optimalOrder, protocolNumber, reorder, samplePlan } from "@/lib/seating";
import { VERDICT_COPY } from "@/lib/seating-text";
import { pageMetadata } from "@/lib/seo";
import { formatNumber, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Plan stołu",
    protocol: (number: string) => `Protokół rozsadzenia nr ${number}`,
    meta: (mode: string, guests: number, index: number) => `${mode} · ${guests} gości · wskaźnik zapalności ${index}/100`,
    modes: { wigilia: "Wigilia", wesele: "Wesele" },
    description: (title: string, note: string) => `${title}. ${note}`,
    share: "Udostępnij protokół",
    shareAside: "Link, post i relacja",
    shareText: (title: string) => `Protokół rozsadzenia: ${title}. Sprawdź, kto z kim siedzi.`,
    promo: "Rozsadziłeś wszystkich. A ty?",
    promoText: "Zanim protokół trafi do rodziny, sprawdź, przy którym końcu stołu powinieneś siedzieć sam.",
  },
  sl: {
    title: "Sedežni red",
    protocol: (number: string) => `Zapisnik o sedežnem redu št. ${number}`,
    meta: (mode: string, guests: number, index: number) =>
      `${mode} · ${formatNumber("sl", guests)} ${pluralSl(guests, "gost", "gosta", "gostje", "gostov")} · indeks vnetljivosti ${index}/100`,
    modes: { wigilia: "Sveti večer", wesele: "Svatba" },
    description: (title: string, note: string) => `${title}. ${note}`,
    share: "Deli zapisnik",
    shareAside: "Povezava, objava in zgodba",
    shareText: (title: string) => `Zapisnik o sedežnem redu: ${title}. Poglej, kdo sedi s kom.`,
    promo: "Vse si posedel. Kaj pa ti?",
    promoText: "Preden zapisnik pride do družine, preveri, na katerem koncu mize bi moral sedeti sam.",
  },
});

// A protocol renders in one pass: the code holds the whole plan.
export const instant = false;

// Both sample plans and their Institute arrangements are prerendered; other codes render on first visit.
export function generateStaticParams() {
  return (["wigilia", "wesele"] as const).flatMap((mode) => {
    const sample = samplePlan(mode, "pl");
    return [sample, reorder(sample, optimalOrder(sample))].map((plan) => ({ kod: encodePlan(plan) }));
  });
}

export async function generateMetadata({ params }: PageProps<"/[lang]/plan-stolu/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const plan = decodePlan((await params).kod);
  if (!plan) return {};
  const verdict = VERDICT_COPY[locale][assess(plan).verdict];
  const code = encodePlan(plan);
  return pageMetadata(locale, {
    title: t.protocol(protocolNumber(plan)),
    description: t.description(verdict.title, verdict.note),
    path: `/plan-stolu/${code}`,
    shareTitle: `${t.protocol(protocolNumber(plan))} · ${verdict.title}`,
    shareDescription: verdict.note,
    // Labels are personal names: plans are never indexed.
    noindex: true,
  });
}

export default async function ProtocolPage({ params }: PageProps<"/[lang]/plan-stolu/[kod]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const plan = decodePlan((await params).kod);
  if (!plan) notFound();
  const code = encodePlan(plan);
  const assessment = assess(plan);
  const verdict = VERDICT_COPY[locale][assessment.verdict];
  const title = t.protocol(protocolNumber(plan));

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.title, href: "/plan-stolu" }, { label: title }]}
        title={title}
        lead={typo(`${verdict.title}. ${verdict.note}`)}
        meta={t.meta(t.modes[plan.mode], guestCount(plan), assessment.index)}
      />
      <section aria-label={t.title} className="wrap py-12 md:py-16">
        <SeatingPlanner initial={plan} issued={code} />
      </section>
      <Section id="udostepnij" title={t.share} aside={t.shareAside}>
        <SeatingShare code={code} text={t.shareText(verdict.title)} />
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
