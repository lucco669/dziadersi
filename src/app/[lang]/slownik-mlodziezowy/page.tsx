import type { Metadata } from "next";
import { publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { getSlang } from "@/content/slang";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatDate, typo } from "@/lib/typo";

const PATH = "/slownik-mlodziezowy";

const COPY = defineCopy({
  pl: {
    title: "Słownik młodzieżowy dla dziadersów",
    metaTitle: "Słownik młodzieżowy: co znaczy 67, sigma, tuff i sybau?",
    description: (count: number) =>
      `Co znaczy 67, sybau, tuff, sigma, rizz albo unc? ${count} słów młodzieżowych: najpierw zwykłe znaczenie, potem objaśnienie dla dziadersa. Przegląd co kwartał.`,
    lead: "Instytut tłumaczy język młodzieży na język dziaderski. Najpierw zwykłe, poprawne znaczenie. Potem objaśnienie dla dziadersa i przewidywana reakcja.",
    meta: (count: number, date: string) => `${count} haseł · stan na ${date} · przegląd co kwartał`,
    howTitle: "Instrukcja użycia",
    how: [
      "Słowa młodzieżowe starzeją się szybciej niż dziaders. Każde hasło ma datę ostatniego sprawdzenia; Instytut przegląda słownik co kwartał i usuwa słowa, których młodzież już nie używa, ze stosownym komunikatem.",
      "Słownika nie należy używać do rozmowy z młodzieżą. Służy do zrozumienia, co zostało powiedziane. Próba odpowiedzi w tym samym języku jest opisana w haśle „cringe”.",
    ],
    words: "Hasła",
    plain: "Znaczenie",
    reverse: "W drugą stronę",
    reverseText: "Słownik Dziaderski: co znaczy „za moich czasów”, „panie…” i „to się jeszcze przyda”, dla młodzieży, która chce zrozumieć dziadersa.",
    reverseLink: "Słownik Dziaderski",
    unc: "Młodzież ma też własne słowo na dziadersa: unc. Instytut porównał je z innymi określeniami w przewodniku",
    uncLink: "Boomer czy dziaders?",
    promo: "Rozumiesz już młodzież. A siebie?",
    promoText: "Test Dziadersa: pięć gabinetów, około czterech minut. Pytania są po polsku, bez skrótów.",
  },
  sl: {
    title: "Mladinski slovar za dziaderse",
    metaTitle: "Mladinski slovar: kaj pomenijo 67, sigma, tuff in sybau?",
    description: (count: number) =>
      `Kaj pomenijo 67, sybau, tuff, sigma, rizz ali unc? ${count} mladinskih besed: najprej običajni pomen, nato pojasnilo za dziadersa. Pregled vsako četrtletje.`,
    lead: "Inštitut prevaja jezik mladine v dziaderski jezik. Najprej običajni, pravilni pomen. Nato pojasnilo za dziadersa in predvideni odziv.",
    meta: (count: number, date: string) => `${count} gesel · stanje na dan ${date} · pregled vsako četrtletje`,
    howTitle: "Navodila za uporabo",
    how: [
      "Mladinske besede se starajo hitreje od dziadersa. Vsako geslo ima datum zadnjega preverjanja; Inštitut slovar pregleda vsako četrtletje in besede, ki jih mladina ne uporablja več, umakne z ustreznim sporočilom.",
      "Slovar ni namenjen pogovoru z mladino. Služi razumevanju povedanega. Poskus odgovora v istem jeziku je opisan pri geslu »cringe«.",
    ],
    words: "Gesla",
    plain: "Pomen",
    reverse: "V drugo smer",
    reverseText: "Dziaderski slovar: kaj pomenijo »v mojih časih«, »ja veš …« in »to bo še prav prišlo«, za mladino, ki želi razumeti dziadersa.",
    reverseLink: "Dziaderski slovar",
    unc: "Mladina ima za dziadersa tudi svojo besedo: unc. Inštitut jo je primerjal z drugimi izrazi v vodniku",
    uncLink: "Boomer ali dziaders?",
    promo: "Mladino zdaj razumeš. Kaj pa sebe?",
    promoText: "Test dziadersa: pet ordinacij, približno štiri minute. Vprašanja so brez kratic.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description(getSlang(locale).length), path: PATH });
}

export default async function SlangPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const entries = getSlang(locale);
  const checked = entries.map((entry) => entry.checked).sort().at(-1)!;
  const crumbs = [{ label: t.title }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          {
            ...publicationSchema(locale, PATH, t.title, t.description(entries.length)),
            dateModified: checked,
          },
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "@id": absoluteUrl(PATH, locale) + "#hasla",
            name: t.title,
            url: absoluteUrl(PATH, locale),
            inLanguage: LOCALE_INFO[locale].tag,
            hasDefinedTerm: entries.map((entry) => ({
              "@type": "DefinedTerm",
              name: entry.word,
              description: entry.meaning,
              url: absoluteUrl(PATH + "/" + entry.slug, locale),
            })),
          },
        ]}
      />
      <PageHeader crumbs={crumbs} title={t.title} lead={typo(t.lead)} meta={t.meta(entries.length, formatDate(locale, checked))} />
      <Section id="hasla" title={t.words}>
        <dl className="grid gap-x-12 md:grid-cols-2">
          {entries.map((entry) => (
            <div key={entry.slug} className="border-b border-rule py-5">
              <dt>
                <Link href={PATH + "/" + entry.slug} className="text-2xl font-bold hover:text-red">
                  {entry.word}
                </Link>
                <span className="ml-3 font-sans text-[0.85rem] italic text-ink-faint">{entry.grammar}</span>
              </dt>
              <dd className="mt-2 leading-snug text-ink-soft">{typo(entry.meaning)}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section id="instrukcja" title={t.howTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.how.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
          <p>
            {typo(t.unc)}{" "}
            <Link href="/dziaders/boomer" className="link">
              {t.uncLink}
            </Link>
            .
          </p>
        </div>
      </Section>
      <Section id="odwrotnie" title={t.reverse}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.reverseText)}</p>
        <p className="mt-6 font-sans text-lg">
          <Link href="/slownik" className="link">
            {t.reverseLink} →
          </Link>
        </p>
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
