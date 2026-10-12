import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountAccess } from "@/components/account-access";
import { breadcrumbList, JsonLd, PageHeader } from "@/components/page";
import { Figure } from "@/components/pictograms";
import { RegistrationBenefits, RegistrationDetails } from "@/components/registration-guide";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { safeNext } from "@/lib/account";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Rejestracja",
    metaTitle: "Rejestracja — bezpłatny Profil Dziaderski",
    description: "Załóż bezpłatny Profil Dziaderski. Zachowuj wyniki testu, zbieraj gatunki i odznaki. E-mail, Google lub link bez hasła. Poznaj zasady prywatności.",
    lead: "Otwórz własną kartotekę w Instytucie. Wyniki badań, obserwacje i odznaki w jednym miejscu. Bez opłat i bez zbędnych formalności.",
    loading: "Rejestracja otwiera okienko…",
    closed: "Rejestracja jest chwilowo nieczynna. Instytut zaprasza później.",
    start: "Załóż konto",
  },
  sl: {
    title: "Registracija",
    metaTitle: "Registracija — brezplačni Dziaderski profil",
    description: "Ustvari brezplačni Dziaderski profil. Shrani izvide testa, zbiraj vrste in značke. E-pošta, Google ali povezava brez gesla. Spoznaj pravila zasebnosti.",
    lead: "Odpri svojo kartoteko na Inštitutu. Izvidi pregledov, opazovanja in značke na enem mestu. Brez plačila in brez odvečnih formalnosti.",
    loading: "Prijavna služba odpira okence …",
    closed: "Prijavna služba je začasno zaprta. Inštitut vabi pozneje.",
    start: "Ustvari račun",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description, path: "/rejestracja", defaultImage: true });
}

async function Register({ searchParams }: { searchParams: PageProps<"/[lang]/rejestracja">["searchParams"] }) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const next = localizePath(safeNext(params.dalej), locale);
  return <AccountAccess mode="register" next={next} />;
}

export default async function RegistrationPage({ searchParams }: PageProps<"/[lang]/rejestracja">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const formId = `rejestracja-form-${locale}`;
  return (
    <main id="tresc">
      <JsonLd data={[
        breadcrumbList(locale, [{ label: t.title, href: "/rejestracja" }]),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t.metaTitle,
          description: t.description,
          url: absoluteUrl("/rejestracja", locale),
          inLanguage: LOCALE_INFO[locale].tag,
          isAccessibleForFree: true,
          about: institute(locale),
        },
      ]} />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={<a href={`#${formId}`} className="btn bg-ink text-paper hover:bg-red">{t.start} <span aria-hidden="true">↓</span></a>} aside={
        <svg viewBox="-4 -1 56 97" className="ml-auto hidden h-44 lg:block" aria-hidden="true"><Figure right="point" glasses="eyes" /></svg>
      } />
      <section className="wrap pb-8 pt-12 md:pt-16">
        <div className="grid gap-12 border-t border-ink pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7"><RegistrationBenefits locale={locale} /></div>
          <div id={formId} className="scroll-mt-6 border-t border-rule pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {hasAuth ? <Suspense fallback={<p className="label text-ink-soft">{t.loading}</p>}><Register searchParams={searchParams} /></Suspense> : <p className="text-xl leading-snug">{typo(t.closed)}</p>}
          </div>
        </div>
      </section>
      <RegistrationDetails locale={locale} formId={formId} />
    </main>
  );
}
