import type { Metadata } from "next";
import Link from "next/link";
import { Seal } from "@/components/brand";
import { MenuIcon } from "@/components/menu-icons";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { CONTACT, FAQ, FIGURES, HISTORY, MISSION, UNITS } from "@/content/institute";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const title = "O Instytucie";
const description =
  "Instytut Badań nad Dziaderstwem: statut, historia od sporu o szczypce w 2025 roku, struktura organizacyjna i odpowiedzi na najczęstsze pytania. Serwis satyryczny.";

export const metadata: Metadata = pageMetadata({
  title: "O Instytucie Badań nad Dziaderstwem",
  description,
  path: "/o-instytucie",
  shareTitle: `${title} · ${site.name}`,
});

/** FAQ answers point to the privacy policy by name; this turns the name into a link. */
function withPrivacyLink(text: string) {
  const phrase = "polityka prywatności";
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

export default function AboutPage() {
  const { email } = site.controller;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/o-instytucie" }]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: title,
            description,
            url: `${site.url}/o-instytucie`,
            inLanguage: "pl",
            about: { ...institute, foundingDate: String(site.founded), slogan: site.tagline },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo("Statut, historia, struktura organizacyjna i odpowiedzi na pytania, które Instytut słyszy najczęściej. Zwykle przy grillu.")}
        meta={`Założony w ${site.founded} r. · siedziba: nieustalona · godziny otwarcia: całodobowo`}
        aside={<Seal className="ml-auto size-56 rotate-[-10deg] text-red lg:size-64" />}
      />

      <Section id="statut" title="Statut" aside="Wyciąg, art. 1">
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

      <Section id="historia" title="Historia" aside={`${HISTORY[0].date} – dziś`}>
        <ol className="border-t border-ink">
          {HISTORY.map((item) => (
            <li key={item.date} className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[14rem_1fr]">
              <span className="text-xl font-bold leading-tight">{item.date}</span>
              <p className="max-w-3xl text-lg leading-relaxed">{typo(item.text)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="struktura" title="Struktura organizacyjna" aside={`${UNITS.length} jednostek`}>
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

      <Section id="pytania" title="Najczęstsze pytania">
        <dl className="border-t border-ink">
          {FAQ.map((item) => (
            <div key={item.question} className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[22rem_1fr]">
              <dt className="text-[1.35rem] font-bold leading-tight">{item.question}</dt>
              <dd className="max-w-3xl text-lg leading-relaxed">{withPrivacyLink(item.answer)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="kontakt" title="Kontakt">
        <div className="max-w-3xl border-t border-ink pt-6">
          <p className="text-lg leading-relaxed">{withPrivacyLink(CONTACT)}</p>
          {email && (
            <p className="mt-4 text-lg">
              <a href={`mailto:${email}`} className="link">
                {email}
              </a>
            </p>
          )}
          <p className="label mt-6 text-ink-soft">
            <Link href="/regulamin" className="link">
              Regulamin serwisu
            </Link>{" "}
            ·{" "}
            <Link href="/prywatnosc" className="link">
              Polityka prywatności
            </Link>
          </p>
        </div>
      </Section>

      <TestPromo
        title="Instytut bada wszystkich. Zacznij od siebie."
        text={typo("Test Dziadersa: pięć gabinetów, około czterech minut, certyfikat z pieczęcią Instytutu.")}
      />
    </main>
  );
}
