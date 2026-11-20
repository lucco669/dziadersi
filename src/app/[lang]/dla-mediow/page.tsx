import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { TOTAL_LINES } from "@/lib/phrasebook";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site, socialProfiles } from "@/lib/site";
import { encodeResult, SAMPLE_DRAFT } from "@/lib/test";
import { formatDate, formatNumber, typo } from "@/lib/typo";

type Angle = { title: string; headline: string; text: string; fact: string; href: string; link: string };
type Download = { title: string; note: string; href: string; size: string };

const COPY = defineCopy({
  pl: {
    title: "Dla mediów",
    metaTitle: "Dla mediów: materiały prasowe Instytutu",
    description:
      "Materiały prasowe DZIADER.SI: kto prowadzi Instytut Badań nad Dziaderstwem, trzy tematy na tekst, wykresy i certyfikaty do pobrania, licencja CC BY 4.0 i kontakt.",
    lead: "Dla dziennikarzy, redakcji, blogerów i nauczycieli. Wszystko, co tu jest, można przedrukować z podaniem źródła.",
    meta: (launched: string) => `Serwis działa od ${launched} · wydanie polskie i słoweńskie`,
    who: "Kto prowadzi Instytut",
    whoText: (name: string) =>
      `Instytut Badań nad Dziaderstwem jest fikcyjną instytucją i serwisem satyrycznym. Prowadzi go ${name}. Wszystkie dane są zmyślone, a narzędzia działają naprawdę: test, egzamin, Komisja i model językowy liczą wyniki w przeglądarce, bez sztucznej inteligencji w chmurze.`,
    whoNote: "Instytut wyśmiewa nawyki, nie ludzi: bez nazwisk, bez polityki, bez żartów z wieku czy zdrowia.",
    figures: "W liczbach",
    figure: {
      species: "gatunków w Atlasie",
      cases: "spraw przed Komisją",
      entries: "haseł w Słowniku",
      reports: "raportów",
      lines: "wypowiedzi w Rozmówkach",
    },
    angles: "Trzy tematy na tekst",
    anglesIntro: "Każdy z nich działa bez kontekstu: czytelnik może od razu sprawdzić go na sobie.",
    angleList: [
      {
        title: "Mały Rocznik Statystyczny",
        headline: "Instytut prowadzi statystykę publiczną zjawiska, którego nikt nie zamówił",
        text: "Rocznik na wzór GUS: tablice numerowane, symbole Isotype, legenda znaków umownych. Jedno badanie przelicza się na garnki rosołu, a naciśnięcia klaksonu w teście na godziny w korku.",
        fact: "Dane na licencji CC BY 4.0, aktualizowane na bieżąco.",
        href: "/statystyki",
        link: "Otwórz Rocznik",
      },
      {
        title: "Komisja Orzekająca",
        headline: "Klucze w zamku, żeby nie zgubić. Czy to już dziaderstwo?",
        text: "Sprawy z życia rodzinnego rozpatrywane z powagą sądu: sygnatura akt, stan faktyczny, stanowisko strony. Czytelnicy głosują jako ławnicy trzema pieczątkami, potem Komisja publikuje uzasadnienie.",
        fact: "Każda sprawa ma obraz do relacji z trzema pieczątkami do wyboru.",
        href: "/czy-to-juz-dziaderstwo",
        link: "Otwórz wokandę",
      },
      {
        title: "SZWAGIER 1.9 TDI",
        headline: "Polski model językowy, który zawsze wie lepiej",
        text: "Superinteligencja Instytutu odpowiada na każde pytanie jak szwagier przy stole: z anegdotą, ze źródłem („kolega z pracy”) i z pewnością siebie. Temperatura 0, więc na to samo pytanie zawsze ta sama odpowiedź. Wersja „Elektryk” jest zapowiadana i nigdy nie wychodzi.",
        fact: "Działa w przeglądarce, bez API. Pytania wulgarne nie trafiają do linków ani obrazów.",
        href: "/superinteligencja",
        link: "Zapytaj SZWAGRA",
      },
    ] as Angle[],
    downloads: "Do pobrania",
    downloadsIntro: "Obrazy PNG generowane przez serwis. Inne rozmiary i dane w arkuszu na prośbę.",
    download: "Pobierz",
    downloadList: (sample: string, report: string, caseSlug: string): Download[] => [
      { title: "Narodowy Indeks Dziaderstwa", note: "Wykres roczny i dzisiejszy poziom", href: "/pl/indeks/opengraph-image", size: "1200 × 630" },
      { title: "Mały Rocznik Statystyczny", note: "Karta Rocznika", href: "/pl/statystyki/opengraph-image", size: "1200 × 630" },
      { title: "Raport Instytutu", note: "Najnowszy raport z wykresem", href: `/pl/raporty/${report}/opengraph-image`, size: "1200 × 630" },
      { title: "Certyfikat Dziaderstwa", note: "Przykładowy wynik testu, post", href: `/wynik/${sample}/certyfikat?format=post&pobierz`, size: "1080 × 1350" },
      { title: "Certyfikat Dziaderstwa", note: "Przykładowy wynik testu, relacja", href: `/wynik/${sample}/certyfikat?format=relacja&pobierz`, size: "1080 × 1920" },
      { title: "Wyniki badań laboratoryjnych", note: "Przykładowy wydruk", href: `/wynik/${sample}/badania?pobierz`, size: "1080 × 1350" },
      { title: "Sprawa przed Komisją", note: "Relacja z trzema pieczątkami", href: `/czy-to-juz-dziaderstwo/${caseSlug}/karta?format=relacja&pobierz`, size: "1080 × 1920" },
      { title: "Znak Instytutu", note: "Głowa z wąsem", href: "/icon-512.png", size: "512 × 512" },
    ],
    license: "Licencja i cytowanie",
    licenseText:
      "Dane Narodowego Indeksu, Narodowego Spisu, Małego Rocznika i Mapy obserwacji są na licencji Creative Commons Uznanie autorstwa 4.0 (CC BY 4.0). Obrazy z tej strony można publikować w całości.",
    cite: "Podpis źródła",
    citation: "Źródło: Instytut Badań nad Dziaderstwem, dziader.si",
    satire: "Prosimy zaznaczyć, że to serwis satyryczny. Liczby Instytutu nie są prawdziwą statystyką, choć zwykle się zgadzają.",
    licenseLink: "Pełna treść licencji",
    terms: "Regulamin, punkt 3.4",
    contact: "Kontakt dla mediów",
    contactText: "Prośby o komentarz Instytutu, dane w innym formacie lub obraz w innym rozmiarze:",
    social: "Instytut w mediach społecznościowych",
    promoTitle: "Przed napisaniem tekstu warto się zbadać.",
    promoText: "Test Dziadersa: pięć gabinetów, cztery minuty, certyfikat z pieczęcią. Redakcje badają się zbiorowo.",
  },
  sl: {
    title: "Za medije",
    metaTitle: "Za medije: gradivo Inštituta za novinarje",
    description:
      "Gradivo DZIADER.SI za medije: kdo vodi Inštitut za raziskave dziaderstva, tri teme za članek, grafikoni in certifikati za prenos, licenca CC BY 4.0 in kontakt.",
    lead: "Za novinarje, uredništva, blogerje in učitelje. Vse, kar je tukaj, lahko ponatisneš z navedbo vira.",
    meta: (launched: string) => `Stran deluje od ${launched} · poljska in slovenska izdaja`,
    who: "Kdo vodi Inštitut",
    whoText: (name: string) =>
      `Inštitut za raziskave dziaderstva je izmišljena ustanova in satirična stran. Vodi jo ${name}. Vsi podatki so izmišljeni, orodja pa delujejo zares: test, izpit, komisija in jezikovni model računajo rezultate v brskalniku, brez umetne inteligence v oblaku.`,
    whoNote: "Inštitut se norčuje iz navad, ne iz ljudi: brez imen, brez politike, brez šal na račun starosti ali zdravja.",
    figures: "V številkah",
    figure: {
      species: "vrst v Atlasu",
      cases: "primerov pred komisijo",
      entries: "gesel v slovarju",
      reports: "poročil",
      lines: "izjav v pogovorniku",
    },
    angles: "Tri teme za članek",
    anglesIntro: "Vsaka deluje brez konteksta: bralec jo lahko takoj preizkusi na sebi.",
    angleList: [
      {
        title: "Mali statistični letopis",
        headline: "Inštitut vodi javno statistiko pojava, ki ga ni nihče naročil",
        text: "Letopis po vzoru statističnega urada: oštevilčene tabele, simboli Isotype, legenda dogovorjenih znakov. En pregled se preračuna v lonce juhe, pritiski na hupo v testu pa v ure v zastoju.",
        fact: "Podatki pod licenco CC BY 4.0, sproti posodobljeni.",
        href: "/statystyki",
        link: "Odpri letopis",
      },
      {
        title: "Razsodna komisija",
        headline: "Ključi v ključavnici, da se ne izgubijo. Je to že dziaderstvo?",
        text: "Primeri iz družinskega življenja, obravnavani z resnostjo sodišča: opravilna številka, dejansko stanje, zagovor stranke. Bralci glasujejo kot porotniki s tremi žigi, nato komisija objavi obrazložitev.",
        fact: "Vsak primer ima sliko za zgodbo s tremi žigi na izbiro.",
        href: "/czy-to-juz-dziaderstwo",
        link: "Odpri seznam primerov",
      },
      {
        title: "SZWAGIER 1.9 TDI",
        headline: "Poljski jezikovni model, ki vedno ve bolje",
        text: "Superinteligenca Inštituta odgovori na vsako vprašanje kot svak pri mizi: z anekdoto, z virom (»sodelavec«) in s samozavestjo. Temperatura 0, zato na isto vprašanje vedno isti odgovor. Različica »Električni« je napovedana in nikoli ne izide.",
        fact: "Deluje v brskalniku, brez API. Vulgarna vprašanja ne pridejo v povezave ali slike.",
        href: "/superinteligencja",
        link: "Vprašaj SZWAGRA",
      },
    ] as Angle[],
    downloads: "Za prenos",
    downloadsIntro: "Slike PNG, ki jih ustvari stran. Druge velikosti in podatke v preglednici pošljemo na prošnjo.",
    download: "Prenesi",
    downloadList: (sample: string, report: string, caseSlug: string): Download[] => [
      { title: "Nacionalni indeks dziaderstva", note: "Letni grafikon in današnja raven", href: "/sl/indeks/opengraph-image", size: "1200 × 630" },
      { title: "Mali statistični letopis", note: "Kartica letopisa", href: "/sl/statystyki/opengraph-image", size: "1200 × 630" },
      { title: "Poročilo Inštituta", note: "Najnovejše poročilo z grafikonom", href: `/sl/raporty/${report}/opengraph-image`, size: "1200 × 630" },
      { title: "Certifikat dziaderstva", note: "Vzorčni izvid testa, objava", href: `/wynik/${sample}/certyfikat?format=post&pobierz`, size: "1080 × 1350" },
      { title: "Certifikat dziaderstva", note: "Vzorčni izvid testa, zgodba", href: `/wynik/${sample}/certyfikat?format=relacja&pobierz`, size: "1080 × 1920" },
      { title: "Laboratorijski izvidi", note: "Vzorčni izpis", href: `/wynik/${sample}/badania?pobierz`, size: "1080 × 1350" },
      { title: "Primer pred komisijo", note: "Zgodba s tremi žigi", href: `/czy-to-juz-dziaderstwo/${caseSlug}/karta?format=relacja&pobierz`, size: "1080 × 1920" },
      { title: "Znak Inštituta", note: "Glava z brki", href: "/icon-512.png", size: "512 × 512" },
    ],
    license: "Licenca in navajanje",
    licenseText:
      "Podatki Nacionalnega indeksa, Nacionalnega popisa, Malega statističnega letopisa in Zemljevida opazovanj so pod licenco Creative Commons Priznanje avtorstva 4.0 (CC BY 4.0). Slike s te strani lahko objaviš v celoti.",
    cite: "Navedba vira",
    citation: "Vir: Inštitut za raziskave dziaderstva, dziader.si",
    satire: "Prosimo, navedi, da gre za satirično stran. Številke Inštituta niso prava statistika, čeprav običajno držijo.",
    licenseLink: "Celotno besedilo licence",
    terms: "Pogoji uporabe, točka 3.4",
    contact: "Kontakt za medije",
    contactText: "Prošnje za komentar Inštituta, podatke v drugi obliki ali sliko v drugi velikosti:",
    social: "Inštitut na družbenih omrežjih",
    promoTitle: "Preden napišeš članek, se preglej.",
    promoText: "Test dziadersa: pet ordinacij, štiri minute, certifikat s pečatom. Uredništva se pregledajo skupaj.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description, path: "/dla-mediow", defaultImage: true });
}

/** A download link: share images keep their routed path, every other image is localised. */
const downloadHref = (href: string, locale: Locale) => (href.startsWith(`/${locale}/`) || href.startsWith("/icon") ? href : localizePath(href, locale));

export default async function PressPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const { name, email } = site.controller;
  const profiles = socialProfiles();
  const reports = getReports(locale);
  const latest = [...reports].sort((a, b) => b.date.localeCompare(a.date))[0];
  const cases = getCases(locale);
  const downloads = t.downloadList(encodeResult(SAMPLE_DRAFT), latest.slug, cases[0].slug);
  const figures = [
    [getSpecies(locale).length, t.figure.species],
    [cases.length, t.figure.cases],
    [getDictionary(locale).length, t.figure.entries],
    [reports.length, t.figure.reports],
    [TOTAL_LINES, t.figure.lines],
  ] as const;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/dla-mediow" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.metaTitle,
            description: t.description,
            url: absoluteUrl("/dla-mediow", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            about: institute(locale),
            publisher: institute(locale),
            license: site.dataLicense,
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(formatDate(locale, site.launched))} />

      <Section id="kto" title={t.who}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-3xl text-lg leading-relaxed">{typo(t.whoText(name))}</p>
            <p className="mt-4 max-w-3xl border-l-2 border-red pl-4 leading-relaxed text-ink-soft">{typo(t.whoNote)}</p>
          </div>
          <div className="lg:col-span-5">
            <p className="label text-ink-soft">{t.figures}</p>
            <dl className="mt-2">
              {figures.map(([value, label]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5">
                  <dt className="font-sans text-ink-soft">{label}</dt>
                  <dd className="text-2xl font-bold tabular-nums">{formatNumber(locale, value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section id="tematy" title={t.angles} intro={typo(t.anglesIntro)}>
        <ol className="mt-4">
          {t.angleList.map((angle, i) => (
            <li key={angle.href} className="grid gap-x-10 gap-y-3 border-b border-rule py-8 md:grid-cols-12">
              <p className="label text-red md:col-span-3">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {angle.title}
              </p>
              <div className="md:col-span-9">
                <h3 className="max-w-3xl text-[clamp(1.4rem,2.6vw,1.9rem)] font-bold leading-tight">{typo(angle.headline)}</h3>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed">{typo(angle.text)}</p>
                <p className="label mt-3 text-ink-soft">{typo(angle.fact)}</p>
                <p className="mt-4">
                  <Link href={angle.href} className="link font-sans font-medium">
                    {angle.link} <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="do-pobrania" title={t.downloads} intro={typo(t.downloadsIntro)}>
        <ul className="mt-4 font-sans">
          {downloads.map((item) => (
            <li key={item.href} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-rule py-3 sm:grid-cols-[1fr_auto_auto]">
              <span>
                <span className="block font-medium">{item.title}</span>
                <span className="block text-[0.9rem] text-ink-soft">{item.note}</span>
              </span>
              <span className="label hidden tabular-nums text-ink-faint sm:block">PNG · {item.size}</span>
              <a href={downloadHref(item.href, locale)} download className="link inline-flex min-h-6 items-center py-1.5 font-medium">
                {t.download}
                <span className="sr-only">
                  : {item.title}, {item.note}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="licencja" title={t.license}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-3xl text-lg leading-relaxed">{typo(t.licenseText)}</p>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">{typo(t.satire)}</p>
            <p className="mt-5 font-sans">
              <a href={`${site.dataLicense}deed.${locale}`} rel="license" className="link">
                {t.licenseLink}
              </a>
              {" · "}
              <Link href="/regulamin" className="link">
                {t.terms}
              </Link>
            </p>
          </div>
          <figure className="lg:col-span-5">
            <figcaption className="label text-ink-soft">{t.cite}</figcaption>
            <p className="mt-2 border border-ink bg-card px-5 py-4 font-sans text-[1.05rem]">{t.citation}</p>
          </figure>
        </div>
      </Section>

      <Section id="kontakt" title={t.contact}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.contactText)}</p>
        <p className="mt-4">
          <a href={`mailto:${email}`} className="btn bg-ink text-paper hover:bg-red">
            {email}
          </a>
        </p>
        {profiles.length > 0 && (
          <>
            <p className="label mt-10 text-ink-soft">{t.social}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-sans font-medium">
              {profiles.map((profile) => (
                <li key={profile.network}>
                  <a href={profile.url} rel="me noopener" target="_blank" className="link inline-flex min-h-6 items-center py-1.5">
                    {profile.label} <span className="ml-1.5 text-ink-soft">@{profile.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
