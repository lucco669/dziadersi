import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { formEdition } from "@/lib/account";
import { confirmGuest, verifyConfirm } from "@/lib/newsletter-store";
import { pageMetadata } from "@/lib/seo";
import { hasAdmin } from "@/lib/supabase/admin";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Potwierdzenie prenumeraty",
    description: "Potwierdzenie prenumeraty Biuletynu tygodniowego Instytutu Badań nad Dziaderstwem.",
    bulletin: "Biuletyn tygodniowy",
    crumb: "Potwierdzenie",
    done: "Prenumerata potwierdzona. Pierwszy biuletyn przyjdzie w najbliższy poniedziałek rano. Wypisać się można w stopce każdego listu.",
    back: "Przeczytaj bieżący numer",
    gone: "Tego zamówienia już nie ma: niepotwierdzone adresy Instytut usuwa po siedmiu dniach. Zamów biuletyn jeszcze raz.",
    invalid: "Ten link nie pasuje do żadnego zamówienia. Sprawdź, czy skopiował się w całości.",
    confirm: "Jedno kliknięcie i od poniedziałku Biuletyn tygodniowy przychodzi na adres z tego zamówienia.",
    button: "Potwierdzam prenumeratę",
    checking: "Sekretariat sprawdza link…",
  },
  sl: {
    title: "Potrditev naročnine",
    description: "Potrditev naročnine na Tedenski bilten Inštituta za raziskave dziaderstva.",
    bulletin: "Tedenski bilten",
    crumb: "Potrditev",
    done: "Naročnina potrjena. Prvi bilten pride v ponedeljek zjutraj. Odjaviš se lahko v nogi vsakega pisma.",
    back: "Preberi tekočo številko",
    gone: "Tega naročila ni več: nepotrjene naslove Inštitut izbriše po sedmih dneh. Naroči bilten še enkrat.",
    invalid: "Ta povezava se ne ujema z nobenim naročilom. Preveri, ali se je skopirala v celoti.",
    confirm: "En klik in od ponedeljka Tedenski bilten prihaja na naslov iz tega naročila.",
    button: "Potrjujem naročnino",
    checking: "Tajništvo preverja povezavo …",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/biuletyn/potwierdz", noindex: true });
}

/** The button from the confirm letter: a page with a button, so link scanners can't subscribe anyone. */
async function confirm(formData: FormData) {
  "use server";
  const locale = formEdition(formData);
  const id = formData.get("u");
  if (!verifyConfirm(id, formData.get("t")) || !hasAdmin) redirect(localizePath("/biuletyn/potwierdz?blad=1", locale));
  redirect(localizePath((await confirmGuest(id)) ? "/biuletyn/potwierdz?gotowe=1" : "/biuletyn/potwierdz?brak=1", locale));
}

async function Form({ searchParams, locale }: { searchParams: PageProps<"/[lang]/biuletyn/potwierdz">["searchParams"]; locale: Locale }) {
  const t = COPY[locale];
  const params = await searchParams;
  if (params.gotowe || params.brak) {
    return (
      <div role="status">
        <p className="max-w-xl text-2xl leading-snug">{typo(params.gotowe ? t.done : t.gone)}</p>
        <Link href={params.gotowe ? "/biuletyn" : "/biuletyn#zapisy"} className="btn mt-7 bg-ink text-paper hover:bg-red">
          {t.back} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }
  if (!verifyConfirm(params.u, params.t)) {
    return (
      <p className="max-w-xl text-xl leading-snug" role="alert">
        {typo(t.invalid)}
      </p>
    );
  }
  return (
    <form action={confirm}>
      <input type="hidden" name="jezyk" value={locale} />
      <input type="hidden" name="u" value={String(params.u)} />
      <input type="hidden" name="t" value={String(params.t)} />
      <p className="max-w-xl text-xl leading-snug">{typo(t.confirm)}</p>
      <button type="submit" className="btn mt-7 bg-ink text-paper hover:bg-red">
        {t.button}
      </button>
    </form>
  );
}

export default async function ConfirmPage({ searchParams }: PageProps<"/[lang]/biuletyn/potwierdz">) {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <PageHeader crumbs={[{ label: t.bulletin, href: "/biuletyn" }, { label: t.crumb }]} title={t.title} />
      <section className="wrap pb-24 pt-12">
        <div className="border-t border-ink pt-8">
          <Suspense fallback={<p className="label text-ink-soft">{t.checking}</p>}>
            <Form searchParams={searchParams} locale={locale} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
