import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { formEdition } from "@/lib/account";
import { verifyUnsubscribe } from "@/lib/newsletter";
import { pageMetadata } from "@/lib/seo";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Wypisanie z biuletynu",
    description: "Rezygnacja z Biuletynu tygodniowego Instytutu Badań nad Dziaderstwem.",
    bulletin: "Biuletyn tygodniowy",
    crumb: "Wypisanie",
    done: "Wypisano. Biuletyn nie przyjdzie więcej. Instytut przyjmuje to ze spokojem i nie będzie dzwonił.",
    invalid: "Ten link nie pasuje do żadnej kartoteki. Wypisać się można też w Profilu Dziaderskim, w ustawieniach.",
    confirm: "Jedno kliknięcie i Biuletyn tygodniowy przestanie przychodzić. Konto i kartoteka zostają.",
    button: "Wypisz mnie z biuletynu",
    checking: "Sekretariat sprawdza link…",
  },
  sl: {
    title: "Odjava od biltena",
    description: "Odjava od Tedenskega biltena Inštituta za raziskave dziaderstva.",
    bulletin: "Tedenski bilten",
    crumb: "Odjava",
    done: "Odjavljeno. Bilten ne bo več prihajal. Inštitut to sprejema mirno in ne bo klical.",
    invalid: "Ta povezava se ne ujema z nobeno kartoteko. Odjaviš se lahko tudi v Dziaderskem profilu, v nastavitvah.",
    confirm: "En klik in Tedenski bilten ne bo več prihajal. Račun in kartoteka ostaneta.",
    button: "Odjavi me od biltena",
    checking: "Tajništvo preverja povezavo …",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/biuletyn/wypisz", noindex: true });
}

/** The button in the letter's footer: a page with a confirm button, so link scanners can't unsubscribe anyone. */
async function unsubscribe(formData: FormData) {
  "use server";
  const locale = formEdition(formData);
  const id = formData.get("u");
  if (!verifyUnsubscribe(id, formData.get("t")) || !hasAdmin) redirect(localizePath("/biuletyn/wypisz?blad=1", locale));
  await createAdminClient().from("profiles").update({ newsletter: false }).eq("id", id);
  redirect(localizePath("/biuletyn/wypisz?gotowe=1", locale));
}

async function Form({ searchParams, locale }: { searchParams: PageProps<"/[lang]/biuletyn/wypisz">["searchParams"]; locale: Locale }) {
  const t = COPY[locale];
  const params = await searchParams;
  if (params.gotowe) {
    return (
      <p className="max-w-xl text-2xl leading-snug" role="status">
        {typo(t.done)}
      </p>
    );
  }
  const valid = verifyUnsubscribe(params.u, params.t);
  if (!valid) {
    return (
      <p className="max-w-xl text-xl leading-snug" role="alert">
        {typo(t.invalid)}
      </p>
    );
  }
  return (
    <form action={unsubscribe}>
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

export default async function UnsubscribePage({ searchParams }: PageProps<"/[lang]/biuletyn/wypisz">) {
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
