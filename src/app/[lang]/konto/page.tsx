import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { Figure } from "@/components/pictograms";
import { SignInForm } from "@/components/sign-in-form";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { safeNext } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    metaTitle: "Logowanie do Profilu Dziaderskiego",
    metaDescription: "Profil Dziaderski: zapisane wyniki, kolekcja gatunków i odznaki. Logowanie bez hasła, przez skierowanie na e-mail.",
    profile: "Profil Dziaderski",
    title: "Rejestracja",
    lead: "Profil Dziaderski przechowuje wyniki badań, kolekcję rozpoznanych gatunków i odznaki. Wystarczy adres e-mail: Instytut wyśle skierowanie.",
    loading: "Rejestracja otwiera okienko…",
    closed: "Rejestracja jest chwilowo nieczynna. Instytut zaprasza później.",
  },
  sl: {
    metaTitle: "Prijava v Dziaderski profil",
    metaDescription: "Dziaderski profil: shranjeni izvidi, zbirka vrst in značke. Prijava brez gesla, z napotnico po e-pošti.",
    profile: "Dziaderski profil",
    title: "Prijavna služba",
    lead: "Dziaderski profil hrani izvide pregledov, zbirko prepoznanih vrst in značke. Dovolj je e-naslov: Inštitut ti pošlje napotnico.",
    loading: "Prijavna služba odpira okence …",
    closed: "Prijavna služba je začasno zaprta. Inštitut vabi pozneje.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.metaDescription, path: "/konto", noindex: true, defaultImage: true });
}

/**
 * `dalej` is an internal path from a sign-in link (signInHref) or a public one from a redirect;
 * the form gets the public path of this edition, which is what the email link returns to.
 */
async function SignIn({ searchParams }: { searchParams: PageProps<"/[lang]/konto">["searchParams"] }) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const next = localizePath(safeNext(params.dalej), locale);
  return <SignInForm next={next} linkFailed={params.blad === "link"} />;
}

export default async function AccountPage({ searchParams }: PageProps<"/[lang]/konto">) {
  const t = COPY[await getLocale()];
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.profile }]}
        title={t.title}
        lead={typo(t.lead)}
        aside={
          <svg viewBox="-4 -1 56 97" className="ml-auto hidden h-44 lg:block" aria-hidden="true">
            <Figure right="point" glasses="eyes" />
          </svg>
        }
      />
      <section className="wrap pb-24 pt-12 md:pt-16">
        <div className="border-t border-ink pt-10">
          {hasAuth ? (
            <Suspense fallback={<p className="label text-ink-soft">{t.loading}</p>}>
              <SignIn searchParams={searchParams} />
            </Suspense>
          ) : (
            <p className="max-w-xl text-xl leading-snug">{typo(t.closed)}</p>
          )}
        </div>
      </section>
    </main>
  );
}
