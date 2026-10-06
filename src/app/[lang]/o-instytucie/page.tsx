import type { Metadata } from "next";
import { Seal } from "@/components/brand";
import { MenuIcon } from "@/components/menu-icons";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { getInstitute } from "@/content/institute";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site, siteCopy } from "@/lib/site";
import { typo } from "@/lib/typo";

/** The translators' preface: the Slovenian edition explains itself, the Polish original has none. */
type Preface = { title: string; aside: string; paragraphs: string[]; signature: string };

const COPY = defineCopy({
  pl: {
    title: "O Instytucie",
    metaTitle: "O Instytucie Badań nad Dziaderstwem",
    description:
      "Instytut Badań nad Dziaderstwem: statut, historia sporu o szczypce, struktura, najczęstsze pytania i kontakt. Poznaj autorów serwisu satyrycznego.",
    lead: "Statut, historia, struktura organizacyjna i odpowiedzi na pytania, które Instytut słyszy najczęściej. Zwykle przy grillu.",
    meta: (founded: number) => `Założony w ${founded} r. · siedziba: nieustalona · godziny otwarcia: całodobowo`,
    privacyPhrase: "polityka prywatności",
    statute: "Statut",
    statuteAside: "Wyciąg, art. 1",
    history: "Historia",
    historyAside: (from: string) => `${from} – dziś`,
    structure: "Struktura organizacyjna",
    units: (count: number) => `${count} jednostek`,
    faq: "Najczęstsze pytania",
    contact: "Kontakt",
    terms: "Regulamin serwisu",
    privacy: "Polityka prywatności",
    promoTitle: "Instytut bada wszystkich. Zacznij od siebie.",
    promoText: "Test Dziadersa: pięć gabinetów, około czterech minut, certyfikat z pieczęcią Instytutu.",
    preface: null as Preface | null,
  },
  sl: {
    title: "O Inštitutu",
    metaTitle: "O Inštitutu za raziskave dziaderstva",
    description:
      "Inštitut za raziskave dziaderstva: statut, zgodovina, struktura, pogosta vprašanja, kontakt in predgovor k slovenski izdaji. Spoznaj satirično stran.",
    lead: "Statut, zgodovina, organizacijska struktura in odgovori na vprašanja, ki jih Inštitut sliši najpogosteje. Običajno ob žaru.",
    meta: (founded: number) => `Ustanovljen leta ${founded} · sedež: nedoločen · uradne ure: ves dan`,
    privacyPhrase: "politika zasebnosti",
    statute: "Statut",
    statuteAside: "Izvleček, 1. člen",
    history: "Zgodovina",
    historyAside: (from: string) => `${from} – danes`,
    structure: "Organizacijska struktura",
    units: (count: number) => `${count} enot`,
    faq: "Pogosta vprašanja",
    contact: "Stik",
    terms: "Pogoji uporabe",
    privacy: "Politika zasebnosti",
    promoTitle: "Inštitut pregleda vsakogar. Začni pri sebi.",
    promoText: "Test dziadersa: pet ordinacij, približno štiri minute, certifikat s pečatom Inštituta.",
    preface: {
      title: "Predgovor k slovenski izdaji",
      aside: "Prevajalska služba IBD",
      paragraphs: [
        "Inštitut za raziskave dziaderstva deluje v Varšavi in raziskuje poljske dziaderse: od parkirišča pred gradbenim marketom do mize na sveti večer. Slovenska izdaja prinaša njegove publikacije v prevodu, brez krajšav in brez olepšav.",
        "Beseda dziaders je poljska. Označuje moškega določenih let in nespremenljivih nazorov, ki vsakomur pojasni, kako je bilo včasih in kako bi bilo treba. Ker slovenščina zanj nima natanko ustrezne besede (ali pa jih ima preveč), jo puščamo v izvirniku: dziaders, dziadersa, v množini dziadersi.",
        "Poljske posebnosti, od krajev in trgovin do praznikov in šolskih ocen, pojasnjujejo opombe prevajalca (op. prev.). Kjer ima poljski dziaders slovenskega sorodnika, ga omenimo. Takih opomb je več, kot smo pričakovali.",
        "Med prevajanjem je služba prejela številne prijave slovenskih družin, ki so v opisih prepoznale strica, tasta in soseda z vrtička. Zadeva je v obravnavi.",
      ],
      signature: "Prevajalska služba Inštituta, oktober 2026",
    },
  },
});

type Copy = (typeof COPY)[Locale];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/o-instytucie",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

/** FAQ answers point to the privacy policy by name; this turns the name into a link. */
function withPrivacyLink(text: string, t: Copy) {
  const phrase = t.privacyPhrase;
  const at = text.indexOf(phrase);
  if (at < 0) return typo(text);
  return (
    <>
      {typo(text.slice(0, at))}
      <Link href="/prywatnosc" className="link">
        {phrase}
      </Link>
      {typo(text.slice(at + phrase.length))}
    </>
  );
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const { MISSION, FIGURES, HISTORY, UNITS, FAQ, CONTACT } = getInstitute(locale);
  const { email } = site.controller;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/o-instytucie" }]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/o-instytucie", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            about: { ...institute(locale), foundingDate: String(site.founded), slogan: siteCopy(locale).tagline },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: LOCALE_INFO[locale].tag,
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta(site.founded)}
        aside={<Seal locale={locale} className="ml-auto size-56 rotate-[-10deg] text-red lg:size-64" />}
      />

      {t.preface && (
        <Section id="predgovor" title={t.preface.title} aside={t.preface.aside}>
          <div className="grid gap-10 border-t border-ink pt-6 lg:grid-cols-12">
            <div className="space-y-5 text-[1.2rem] leading-relaxed lg:col-span-8">
              {t.preface.paragraphs.map((paragraph) => (
                <p key={paragraph}>{typo(paragraph)}</p>
              ))}
              <p className="label pt-2 text-ink-soft">{t.preface.signature}</p>
            </div>
          </div>
        </Section>
      )}

      <Section id="statut" title={t.statute} aside={t.statuteAside}>
        <p className="max-w-4xl border-t border-ink pt-6 text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug">{typo(MISSION)}</p>
        <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {FIGURES.map((item) => (
            <div key={item.label} className="border-t border-ink pt-4">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block text-[clamp(2.6rem,4.4vw,3.5rem)] font-bold leading-none tracking-[-0.02em] text-red">{item.value}</span>
                <span className="mt-2 block font-sans text-[0.92rem] leading-snug text-ink-soft">{typo(item.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="historia" title={t.history} aside={t.historyAside(HISTORY[0].date)}>
        <ol className="border-t border-ink">
          {HISTORY.map((item) => (
            <li key={item.date} className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[14rem_1fr]">
              <span className="text-xl font-bold leading-tight">{item.date}</span>
              <div className="max-w-3xl">
                <p className="text-lg leading-relaxed">{typo(item.text)}</p>
                {item.notes?.map((note) => (
                  <p key={note} className="mt-2 font-sans text-[0.9rem] leading-relaxed text-ink-soft">
                    {note} <span className="italic text-ink-faint">(op. prev.)</span>
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="struktura" title={t.structure} aside={t.units(UNITS.length)}>
        <ul className="grid gap-x-10 border-t border-ink md:grid-cols-2">
          {UNITS.map((unit) => (
            <li key={unit.name} className="border-b border-rule">
              <Link href={unit.href ?? "/"} className="mi group grid grid-cols-[3.5rem_1fr] gap-4 py-6">
                <MenuIcon href={unit.href ?? ""} className="mt-1 w-14" />
                <span>
                  <span className="block text-[1.45rem] font-bold leading-tight transition-colors group-hover:text-red">{unit.name}</span>
                  <span className="label mt-1 block text-red">{unit.head}</span>
                  <span className="mt-3 block leading-relaxed text-ink-soft">{typo(unit.text)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="pytania" title={t.faq}>
        <dl className="border-t border-ink">
          {FAQ.map((item) => (
            <div key={item.question} className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[22rem_1fr]">
              <dt className="text-[1.35rem] font-bold leading-tight">{item.question}</dt>
              <dd className="max-w-3xl text-lg leading-relaxed">{withPrivacyLink(item.answer, t)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="kontakt" title={t.contact}>
        <div className="max-w-3xl border-t border-ink pt-6">
          <p className="text-lg leading-relaxed">{withPrivacyLink(CONTACT, t)}</p>
          {email && (
            <p className="mt-4 text-lg">
              <a href={`mailto:${email}`} className="link">
                {email}
              </a>
            </p>
          )}
          <p className="label mt-6 text-ink-soft">
            <Link href="/regulamin" className="link">
              {t.terms}
            </Link>{" "}
            ·{" "}
            <Link href="/prywatnosc" className="link">
              {t.privacy}
            </Link>
          </p>
        </div>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}

