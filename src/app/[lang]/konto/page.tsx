import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { Figure } from "@/components/pictograms";
import { AccountAccess } from "@/components/account-access";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { safeNext } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    metaTitle: "Logowanie do Profilu Dziaderskiego",
    metaDescription: "Profil Dziaderski: zapisane wyniki, kolekcja gatunków i odznaki. Zaloguj się hasłem, przez Google lub linkiem z e-maila.",
    profile: "Profil Dziaderski",
    title: "Rejestracja",
    lead: "Profil Dziaderski przechowuje wyniki badań, kolekcję rozpoznanych gatunków i odznaki. Zaloguj się lub załóż konto.",
    loading: "Rejestracja otwiera okienko…",
    closed: "Rejestracja jest chwilowo nieczynna. Instytut zaprasza później.",
  },
  sl: {
    metaTitle: "Prijava v Dziaderski profil",
    metaDescription: "Dziaderski profil: shranjeni izvidi, zbirka vrst in značke. Prijavi se z geslom, z Googlom ali s povezavo iz e-pošte.",
    profile: "Dziaderski profil",
    title: "Prijavna služba",
    lead: "Dziaderski profil hrani izvide pregledov, zbirko prepoznanih vrst in značke. Prijavi se ali ustvari račun.",
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
  const mode = params.tryb === "haslo" ? "password" : params.tryb === "register" ? "register" : params.tryb === "recovery" ? "recovery" : params.tryb === "magic" ? "magic" : "login";
  const failure = params.blad === "link" ? "link" : params.blad === "google" ? "google" : undefined;
  if (mode === "password") {
    const { user } = await currentUser();
    if (!user) return <AccountAccess mode="recovery" next={next} failure="link" />;
    return <AccountAccess mode={mode} next={next} email={user.email} />;
  }
  return <AccountAccess mode={mode} next={next} failure={failure} />;
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
