import type { Metadata } from "next";
import { JsonLd, Section, breadcrumbList } from "@/components/page";
import { TestRunner } from "@/components/test-runner";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Test Dziadersa",
    browserTitle: "Test Dziadersa: sprawdź, ile masz w sobie dziadersa",
    description:
      "Test Dziadersa: badanie okresowe w pięciu gabinetach, od plansz Rorschacha po próbę klaksonową. Wynik w procentach, rozpoznanie gatunku i certyfikat.",
    shareDescription: "Pięć gabinetów, około czterech minut. Plansze Rorschacha, próba klaksonowa, szuflada. Zbadaj się, zanim będzie za późno.",
    about: "Test na dziadersa: jak przebiega badanie",
    aboutText: [
      "Test Dziadersa to satyryczny test w formie badania okresowego. Osoba badana przechodzi przez pięć gabinetów: wywiad lekarski, pracownię psychologiczną z planszami Rorschacha, pracownię sprawności z próbą klaksonową, inwentaryzację szuflady i konsultację końcową.",
      "Wynik podaje poziom dziaderstwa w procentach, od śladowego po kliniczny, oraz rozpoznanie gatunku z Atlasu Dziadersów: środowisko, w którym objawy są najsilniejsze. Na koniec Instytut wydaje certyfikat do pokazania rodzinie.",
    ],
    questions: "Pytania o Test Dziadersa",
    faq: [
      {
        question: "Ile trwa Test Dziadersa?",
        answer: "Około czterech minut. Postęp zapisuje się w przeglądarce, więc badanie można przerwać i wrócić do niego później.",
      },
      {
        question: "Czy test na dziadersa jest na serio?",
        answer: "Nie. To satyra i zabawa. Wynik nie jest diagnozą psychologiczną ani medyczną, a certyfikat najlepiej sprawdza się na drzwiach lodówki.",
      },
      {
        question: "Czy mogę zbadać tatę, wujka albo szwagra?",
        answer: "Tak. Badanie ma tryb wywiadu rodzinnego: odpowiadasz tak, jak odpowiedziałaby osoba badana, a certyfikat wystawiany jest na jej imię. Osobie badanej najlepiej nic nie mówić.",
      },
      {
        question: "Co oznacza wynik?",
        answer: "Procent mówi, ile zachowań dziadersa ujawniło badanie. Poziomy to dziaderstwo śladowe, umiarkowane, podwyższone i kliniczne. Gatunek wskazuje, gdzie objawy są najsilniejsze, na przykład przy grillu, na parkingu albo przy pilocie.",
      },
    ],
    proxy: "Zbadaj kogoś z rodziny",
    meaning: "Co znaczy „dziaders”?",
    atlas: "Atlas Dziadersów: gatunki i objawy",
    exam: "Egzamin terenowy z rozpoznawania dziadersów",
  },
  sl: {
    title: "Test dziadersa",
    browserTitle: "Test dziadersa: preveri, koliko dziadersa je v tebi",
    description:
      "Test dziadersa: obdobni pregled v petih ordinacijah, od Rorschachovih tabel do preizkusa s hupo. Izvid v odstotkih, diagnoza vrste in certifikat.",
    shareDescription: "Pet ordinacij, približno štiri minute. Rorschachove table, preizkus s hupo, predal. Preglej se, preden bo prepozno.",
    about: "Test dziadersa: kako poteka pregled",
    aboutText: [
      "Test dziadersa je satirični test v obliki obdobnega pregleda. Preiskovana oseba gre skozi pet ordinacij: anamnezo, psihološki laboratorij z Rorschachovimi tablami, laboratorij za spretnost s preizkusom s hupo, inventuro predala in zaključni posvet.",
      "Izvid pove raven dziaderstva v odstotkih, od sledne do klinične, in diagnozo vrste iz Atlasa dziadersov: okolje, v katerem so simptomi najmočnejši. Na koncu Inštitut izda certifikat, ki ga lahko pokažeš družini.",
    ],
    questions: "Vprašanja o Testu dziadersa",
    faq: [
      {
        question: "Koliko časa traja Test dziadersa?",
        answer: "Približno štiri minute. Napredek se shrani v brskalniku, zato lahko pregled prekineš in se k njemu vrneš pozneje.",
      },
      {
        question: "Je test dziadersa resen?",
        answer: "Ne. Gre za satiro in igro. Izvid ni psihološka ali medicinska diagnoza, certifikat pa se najbolje obnese na vratih hladilnika.",
      },
      {
        question: "Lahko pregledam očeta, strica ali svaka?",
        answer: "Da. Pregled ima način heteroanamneze: odgovarjaš tako, kot bi odgovorila preiskovana oseba, certifikat pa se izda na njeno ime. Preiskovani osebi je najbolje ne povedati ničesar.",
      },
      {
        question: "Kaj pomeni izvid?",
        answer: "Odstotek pove, koliko vedenj dziadersa je pokazal pregled. Ravni so sledno, zmerno, povišano in klinično dziaderstvo. Vrsta pove, kje so simptomi najmočnejši, na primer ob žaru, na parkirišču ali pri daljincu.",
      },
    ],
    proxy: "Preglej koga iz družine",
    meaning: "Kaj pomeni »dziaders«?",
    atlas: "Atlas dziadersov: vrste in simptomi",
    exam: "Terenski izpit iz prepoznavanja dziadersov",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/test",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function TestPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/test" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/test", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            timeRequired: "PT4M",
            publisher: institute(locale),
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl("/test", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            mainEntity: t.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <TestRunner />
      {/* Hidden while the examination runs (globals.css), like the navigation and the footer. */}
      <div className="test-about">
        <Section id="o-badaniu" title={t.about}>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5 text-lg leading-relaxed">
              {t.aboutText.map((text) => (
                <p key={text}>{typo(text)}</p>
              ))}
              <ul className="space-y-3 pt-2 font-sans">
                <li>
                  <Link href="/test?tryb=wywiad" className="link">
                    {t.proxy} →
                  </Link>
                </li>
                <li>
                  <Link href="/dziaders" className="link">
                    {t.meaning} →
                  </Link>
                </li>
                <li>
                  <Link href="/atlas" className="link">
                    {t.atlas} →
                  </Link>
                </li>
                <li>
                  <Link href="/egzamin" className="link">
                    {t.exam} →
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="label text-ink-soft">{t.questions}</h3>
              <div className="mt-2 divide-y divide-rule">
                {t.faq.map((item) => (
                  <details key={item.question} className="py-4">
                    <summary className="cursor-pointer text-xl font-bold hover:text-red">{item.question}</summary>
                    <p className="mt-3 leading-relaxed text-ink-soft">{typo(item.answer)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
