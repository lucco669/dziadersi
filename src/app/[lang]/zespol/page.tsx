import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader } from "@/components/page";
import { TeamOrderForm } from "@/components/team";
import { MeetingTable } from "@/components/team-art";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    test: "Test Dziadersa",
    title: "Badanie okresowe zespołu",
    browserTitle: "Badanie okresowe zespołu: Test Dziadersa dla całego biura",
    description:
      "Test Dziadersa dla zespołu do 50 osób, z podziałem na działy: średnie i gatunki dominujące działów, pary najbardziej i najmniej zgodne, dział zagrożony „zróbmy calla”, orzeczenie Komisji i raport dla działu kadr do druku.",
    shareDescription: "Jeden link dla całego biura. Działy, orzeczenie Komisji i raport dla działu kadr z pieczątką.",
    lead: "Instytut przyjmuje zlecenia od zakładów pracy. Jeden link dla całego zespołu, do 50 osób, z podziałem na działy.",
    meta: "Bez konta · do 50 osób · do 8 działów · link ważny 90 dni",
    order: "Skierowanie",
    scope: "Zakres badania",
    items: [
      ["Pełny Test Dziadersa", "Każdy wykonuje formularz IBD-T2 na swoim telefonie, pod pseudonimem, i wybiera swój dział."],
      ["Zestawienie według działów", "Średni wynik, gatunek dominujący i piktogram osób z wynikiem co najmniej podwyższonym."],
      ["Pary i zagrożenia", "Para najbardziej i najmniej zgodna oraz dział, w którym najszybciej padnie „zróbmy calla”."],
      ["Orzeczenie i raport", "Orzeczenie Komisji Orzekającej dla zespołu i raport dla działu kadr na A4, z pieczątką i miejscem na podpisy."],
    ],
    office: "Słownik biurowy",
    words: [
      ["/slownik/zrobmy-calla", "zróbmy calla"],
      ["/slownik/wyslalem-ci-maila", "wysłałem ci maila"],
      ["/slownik/pozdrawiam-serdecznie", "pozdrawiam serdecznie"],
      ["/atlas/dziaders-korporacyjny", "Dziaders Korporacyjny"],
    ],
    drawing: "Pięć osób przy stole konferencyjnym. Na środku stołu telefon konferencyjny z czerwoną diodą.",
  },
  sl: {
    test: "Test dziadersa",
    title: "Obdobni pregled kolektiva",
    browserTitle: "Obdobni pregled kolektiva: test dziadersa za vso pisarno",
    description:
      "Test dziadersa za kolektiv do 50 oseb, razdeljen po oddelkih: povprečja in prevladujoče vrste oddelkov, najbolj in najmanj združljiv par, oddelek, ogrožen z »dajmo en call«, odločba Komisije in poročilo za kadrovsko službo za tisk.",
    shareDescription: "Ena povezava za vso pisarno. Oddelki, odločba Komisije in poročilo za kadrovsko službo z žigom.",
    lead: "Inštitut sprejema naročila delodajalcev. Ena povezava za ves kolektiv, do 50 oseb, razdeljenih po oddelkih.",
    meta: "Brez računa · do 50 oseb · do 8 oddelkov · povezava velja 90 dni",
    order: "Napotnica",
    scope: "Obseg pregleda",
    items: [
      ["Celoten test dziadersa", "Vsak izpolni obrazec IBD-T2 na svojem telefonu, pod vzdevkom, in izbere svoj oddelek."],
      ["Pregled po oddelkih", "Povprečni rezultat, prevladujoča vrsta in piktogram oseb z najmanj povišanim rezultatom."],
      ["Pari in tveganja", "Najbolj in najmanj združljiv par ter oddelek, v katerem bo najprej padel »dajmo en call«."],
      ["Odločba in poročilo", "Odločba Razsodne komisije za kolektiv in poročilo za kadrovsko službo na A4, z žigom in prostorom za podpise."],
    ],
    office: "Pisarniški slovar",
    words: [
      ["/slownik/dajmo-en-call", "dajmo en call"],
      ["/slownik/poslal-sem-ti-mejl", "poslal sem ti mejl"],
      ["/slownik/lep-pozdrav", "lep pozdrav"],
      ["/atlas/korporativni-dziaders", "Korporativni dziaders"],
    ],
    drawing: "Pet oseb za konferenčno mizo. Na sredi mize konferenčni telefon z rdečo lučko.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/zespol",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function TeamOrderPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.test, href: "/test" }, { label: t.title, href: "/zespol" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/zespol", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.test, href: "/test" }, { label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta}
        aside={<MeetingTable className="w-full max-w-sm" title={t.drawing} />}
      />
      <section aria-labelledby="skierowanie" className="wrap grid gap-14 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="skierowanie" className="label border-t border-ink pt-4 text-red">{t.order}</h2>
          <div className="mt-8">
            <TeamOrderForm />
          </div>
        </div>
        <aside className="lg:col-span-5">
          <h2 className="label border-t border-ink pt-4 text-ink-soft">{t.scope}</h2>
          <ol className="mt-2">
            {t.items.map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[2rem_1fr] border-b border-rule py-4">
                <span className="font-sans text-[0.95rem] font-semibold text-red">{i + 1}.</span>
                <span>
                  <strong className="block text-lg leading-tight">{title}</strong>
                  <span className="mt-1 block text-ink-soft">{typo(text)}</span>
                </span>
              </li>
            ))}
          </ol>
          <h2 className="label mt-10 text-ink-soft">{t.office}</h2>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {t.words.map(([href, label]) => (
              <li key={href}><Link href={href} className="link">{label}</Link></li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
