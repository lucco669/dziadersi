import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { verifyUnsubscribe } from "@/lib/newsletter";
import { pageMetadata } from "@/lib/seo";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { typo } from "@/lib/typo";

export const metadata: Metadata = pageMetadata({
  title: "Wypisanie z biuletynu",
  description: "Rezygnacja z Biuletynu tygodniowego Instytutu Badań nad Dziaderstwem.",
  path: "/biuletyn/wypisz",
  noindex: true,
});

/** The button in the letter's footer: a page with a confirm button, so link scanners can't unsubscribe anyone. */
async function unsubscribe(formData: FormData) {
  "use server";
  const id = formData.get("u");
  if (!verifyUnsubscribe(id, formData.get("t")) || !hasAdmin) redirect("/biuletyn/wypisz?blad=1");
  await createAdminClient().from("profiles").update({ newsletter: false }).eq("id", id);
  redirect("/biuletyn/wypisz?gotowe=1");
}

async function Form({ searchParams }: { searchParams: PageProps<"/biuletyn/wypisz">["searchParams"] }) {
  const params = await searchParams;
  if (params.gotowe) {
    return (
      <p className="max-w-xl text-2xl leading-snug" role="status">
        {typo("Wypisano. Biuletyn nie przyjdzie więcej. Instytut przyjmuje to ze spokojem i nie będzie dzwonił.")}
      </p>
    );
  }
  const valid = verifyUnsubscribe(params.u, params.t);
  if (!valid) {
    return (
      <p className="max-w-xl text-xl leading-snug" role="alert">
        {typo("Ten link nie pasuje do żadnej kartoteki. Wypisać się można też w Profilu Dziaderskim, w ustawieniach.")}
      </p>
    );
  }
  return (
    <form action={unsubscribe}>
      <input type="hidden" name="u" value={String(params.u)} />
      <input type="hidden" name="t" value={String(params.t)} />
      <p className="max-w-xl text-xl leading-snug">{typo("Jedno kliknięcie i Biuletyn tygodniowy przestanie przychodzić. Konto i kartoteka zostają.")}</p>
      <button type="submit" className="btn mt-7 bg-ink text-paper hover:bg-red">
        Wypisz mnie z biuletynu
      </button>
    </form>
  );
}

export default function UnsubscribePage({ searchParams }: PageProps<"/biuletyn/wypisz">) {
  return (
    <main id="tresc">
      <PageHeader crumbs={[{ label: "Biuletyn tygodniowy", href: "/biuletyn" }, { label: "Wypisanie" }]} title="Wypisanie z biuletynu" />
      <section className="wrap pb-24 pt-12">
        <div className="border-t border-ink pt-8">
          <Suspense fallback={<p className="label text-ink-soft">Sekretariat sprawdza link…</p>}>
            <Form searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
