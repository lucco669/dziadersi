import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { Figure } from "@/components/pictograms";
import { SignInForm } from "@/components/sign-in-form";
import { safeNext } from "@/lib/account";
import { pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { typo } from "@/lib/typo";

export const metadata: Metadata = pageMetadata({
  title: "Logowanie do Profilu Dziaderskiego",
  description: "Profil Dziaderski: zapisane wyniki, kolekcja gatunków i odznaki. Logowanie bez hasła, przez skierowanie na e-mail.",
  path: "/konto",
  noindex: true,
});

async function SignIn({ searchParams }: { searchParams: PageProps<"/konto">["searchParams"] }) {
  const params = await searchParams;
  const next = safeNext(params.dalej);
  return <SignInForm next={next} linkFailed={params.blad === "link"} />;
}

export default function AccountPage({ searchParams }: PageProps<"/konto">) {
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Profil Dziaderski" }]}
        title="Rejestracja"
        lead={typo(
          "Profil Dziaderski przechowuje wyniki badań, kolekcję rozpoznanych gatunków i odznaki. Wystarczy adres e-mail: Instytut wyśle skierowanie.",
        )}
        aside={
          <svg viewBox="-4 -1 56 97" className="ml-auto hidden h-44 lg:block" aria-hidden="true">
            <Figure right="point" glasses="eyes" />
          </svg>
        }
      />
      <section className="wrap pb-24 pt-12 md:pt-16">
        <div className="border-t border-ink pt-10">
          {hasAuth ? (
            <Suspense fallback={<p className="label text-ink-soft">Rejestracja otwiera okienko…</p>}>
              <SignIn searchParams={searchParams} />
            </Suspense>
          ) : (
            <p className="max-w-xl text-xl leading-snug">{typo("Rejestracja jest chwilowo nieczynna. Instytut zaprasza później.")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
