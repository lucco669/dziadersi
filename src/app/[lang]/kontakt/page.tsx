import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section } from "@/components/page";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Kontakt",
    description: "Kontakt z administratorem DZIADER.SI: pytania o serwis, zgłoszenia błędów i sprawy danych osobowych. Napisz na admin@dziader.si.",
    lead: "Pytania o serwis, błędy na stronie i sprawy danych osobowych prosimy kierować do administratora.",
    write: "Napisz do administratora",
    administrator: "Administrator serwisu",
    operator: (name: string) => `Serwis prowadzi ${name}. Instytut Badań nad Dziaderstwem jest fikcyjną instytucją satyryczną.`,
    reporting: "Zgłaszanie błędów",
    reportingText: "Podaj adres strony i opisz, co się wydarzyło. Przy problemie technicznym przyda się nazwa przeglądarki. Nie przesyłaj haseł, linków do logowania ani danych innych osób.",
    privacy: "Dane osobowe i zasady korzystania",
    privacyText: "Pytania o dane, prośby o ich usunięcie i zgłoszenia dotyczące bezpieczeństwa przyjmujemy pod tym samym adresem e-mail.",
    policy: "Polityka prywatności",
    terms: "Regulamin",
    about: "O Instytucie",
  },
  sl: {
    title: "Kontakt",
    description: "Kontakt z administratorjem DZIADER.SI: vprašanja o strani, prijave napak in osebni podatki. Piši na admin@dziader.si.",
    lead: "Vprašanja o strani, napake na strani in zadeve glede osebnih podatkov pošlji administratorju.",
    write: "Piši administratorju",
    administrator: "Administrator strani",
    operator: (name: string) => `Stran upravlja ${name}. Inštitut za raziskave dziaderstva je izmišljena satirična ustanova.`,
    reporting: "Prijava napak",
    reportingText: "Navedi naslov strani in opiši, kaj se je zgodilo. Pri tehnični težavi pomaga ime brskalnika. Ne pošiljaj gesel, povezav za prijavo ali podatkov drugih oseb.",
    privacy: "Osebni podatki in pravila uporabe",
    privacyText: "Vprašanja o podatkih, zahteve za izbris in prijave varnostnih težav sprejemamo na istem e-naslovu.",
    policy: "Politika zasebnosti",
    terms: "Pogoji uporabe",
    about: "O Inštitutu",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/kontakt", defaultImage: true });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const { name, email } = site.controller;
  return (
    <main id="tresc">
      <JsonLd data={[
        breadcrumbList(locale, [{ label: t.title, href: "/kontakt" }]),
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: t.title,
          description: t.description,
          url: absoluteUrl("/kontakt", locale),
          inLanguage: LOCALE_INFO[locale].tag,
          about: institute(locale),
          mainEntity: { "@type": "Person", name, email },
        },
      ]} />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} />
      <div className="wrap py-10">
        <a href={`mailto:${email}`} className="btn bg-ink text-paper hover:bg-red">{t.write}</a>
        <p className="mt-5 text-lg"><a href={`mailto:${email}`} className="link">{email}</a></p>
      </div>
      <Section id="administrator" title={t.administrator}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.operator(name))}</p>
        <p className="mt-4"><Link href="/o-instytucie" className="link">{t.about}</Link></p>
      </Section>
      <Section id="zgloszenia" title={t.reporting}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.reportingText)}</p>
      </Section>
      <Section id="dane" title={t.privacy}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.privacyText)}</p>
        <p className="mt-5">
          <Link href="/prywatnosc" className="link">{t.policy}</Link>{" · "}
          <Link href="/regulamin" className="link">{t.terms}</Link>
        </p>
      </Section>
    </main>
  );
}
