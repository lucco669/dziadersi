import type { Metadata } from "next";
import { Stamp } from "@/components/brand";
import { breadcrumbList, DataLicense, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { BallotStatus, VoteStamp } from "@/components/word-ballot";
import { WordCertificate } from "@/components/word-certificate";
import { reportBySlug } from "@/content/reports";
import { REPORT_SLUGS } from "@/content/sl/slugs/reports";
import { speciesByKey } from "@/content/species";
import { getWordOfYear } from "@/content/word-of-year";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { cx, formatDate, formatNumber, quote, typo } from "@/lib/typo";
import type { WordPhase, WordTally } from "@/lib/word-of-year";
import { protocolText, verdictLine, wordEntry } from "@/lib/word-of-year-text";
import { getWordState } from "@/lib/word-of-year.server";

const PATH = "/slowo-roku";

const COPY = defineCopy({
  pl: {
    commission: "Komisja Orzekająca",
    title: (year: number) => `Dziaderskie Słowo Roku ${year}`,
    short: (year: number) => `Słowo Roku ${year}`,
    description: (year: number, count: number) =>
      `Dziaderskie Słowo Roku ${year}: Komisja Orzekająca nominowała ${count} zwrotów ze Słownika Dziaderskiego. Głosowanie w grudniu, jeden głos z przeglądarki, wynik ogłasza Komisja.`,
    share: "Komisja nominowała dwanaście zwrotów. Który w tym roku padał najczęściej?",
    shareWinner: (phrase: string, year: number) => `Dziaderskie Słowo Roku ${year}: ${phrase}. Orzeka Komisja Orzekająca IBD.`,
    lead: {
      upcoming: (opens: string, announced: string) =>
        `Komisja Orzekająca nominowała dwanaście zwrotów ze Słownika Dziaderskiego. Od ${opens} każdy może oddać głos na ten, który w tym roku padał najczęściej: przy stole, w kolejce, na parkingu. Wynik Komisja ogłosi ${announced}.`,
      voting: (closes: string, announced: string) =>
        `Komisja Orzekająca nominowała dwanaście zwrotów ze Słownika Dziaderskiego. Zagłosuj na ten, który w tym roku padał najczęściej: przy stole, w kolejce, na parkingu. Głosowanie trwa do ${closes}, wynik Komisja ogłosi ${announced}.`,
      closed: (announced: string) =>
        `Głosowanie zostało zamknięte. Komisja liczy głosy i obraduje przy zamkniętych drzwiach. Wynik zostanie ogłoszony ${announced}.`,
      announced: (phrase: string) => `Komisja Orzekająca ogłosiła Dziaderskie Słowo Roku. Został nim zwrot ${phrase}. Poniżej uchwała, protokół głosowania i pełna lista nominowanych.`,
    },
    meta: (count: number, range: string, announced: string) => `${count} zwrotów nominowanych · głosowanie ${range} · ogłoszenie ${announced}`,
    at: (date: string, time: string) => `${date}, godz. ${time}`,
    timeline: "Harmonogram",
    steps: { upcoming: "Nominacje", voting: "Głosowanie", closed: "Obrady Komisji", announced: "Ogłoszenie" } satisfies Record<WordPhase, string>,
    now: "teraz",
    ruling: "Uchwała Komisji",
    protocol: "Protokół głosowania",
    download: "Uchwała do pobrania",
    post: "Post (4:5)",
    story: "Relacja (9:16)",
    results: "Wyniki głosowania",
    resultsAside: (total: string) => `n = ${total}`,
    nominees: "Nominowani",
    nomineesAside: (count: number) => `${count} zwrotów ze Słownika`,
    intro: {
      upcoming: (opens: string) => `Głosowanie rozpocznie się ${opens}. Do tego czasu Komisja przyjmuje wyłącznie uwagi do uzasadnień, ustnie, przy stole.`,
      voting: "Jeden głos z przeglądarki. Przed oddaniem głosu warto przeczytać definicje: Komisja nie uwzględnia pomyłek.",
      closed: "Głosowanie jest zamknięte. Lista pozostaje do wglądu.",
      announced: "Pełna lista nominowanych, w kolejności głosów. Przy równej liczbie głosów decyduje kolejność nominacji.",
    },
    nomination: "Uzasadnienie nominacji",
    species: "Gatunek",
    entry: "Hasło w Słowniku",
    rules: "Regulamin plebiscytu",
    rulesAside: "Uchwała KO/2026/0",
    ruleList: (range: string, announced: string, from: number, quorum: number) => [
      "Komisja nominuje dwanaście zwrotów ze Słownika Dziaderskiego. Lista jest zamknięta i nie podlega uzupełnieniu, także na prośbę rodziny.",
      `Głosowanie trwa ${range}, czasu warszawskiego. Z jednej przeglądarki i z jednego konta oddaje się jeden głos. Liczy się pierwszy.`,
      `Wyniki cząstkowe publikuje się od ${formatNumber("pl", from)} oddanych głosów. Po zamknięciu głosowania Komisja liczy głosy i do ogłoszenia niczego nie publikuje.`,
      `Jeśli oddano mniej niż ${quorum} głosów, słowo roku wskazuje Komisja. Remis rozstrzyga przewodniczący Komisji. Oba przypadki odnotowuje się w protokole.`,
      `Wynik ogłasza się ${announced}. Urna zna tylko losowy numer przeglądarki i, u zalogowanych, numer konta. Wyniki publikuje się wyłącznie zbiorczo.`,
      "Plebiscyt nie konkuruje z Młodzieżowym Słowem Roku. Komisja ogłasza wynik dwa dni po nim, żeby nikomu nie przeszkadzać.",
    ],
    report: "Raport roczny",
    reportText: "Wynik plebiscytu trafia do raportu „Stan dziaderstwa w Polsce 2026” razem z rokiem Narodowego Indeksu Dziaderstwa, liczbami Małego Rocznika i najbardziej sporną sprawą Komisji.",
    reportLink: "Czytaj raport",
    press: "Dziennikarzom",
    pressText: "Uchwałę, listę nominowanych i wykresy z raportu można przedrukować z podaniem źródła (Instytut Badań nad Dziaderstwem, dziader.si).",
    promoTitle: "Słowo roku to jedno.",
    promoText: "Test Dziadersa sprawdza, ile z tych zwrotów padło z twoich ust. Pięć gabinetów, około czterech minut.",
  },
  sl: {
    commission: "Razsodna komisija",
    title: (year: number) => `Dziaderska beseda leta ${year}`,
    short: (year: number) => `Beseda leta ${year}`,
    description: (year: number, count: number) =>
      `Dziaderska beseda leta ${year}: Razsodna komisija je nominirala ${count} izrazov iz Dziaderskega slovarja. Glasovanje decembra, en glas na brskalnik, izid razglasi Komisija.`,
    share: "Komisija je nominirala dvanajst izrazov. Kateri je letos padel najpogosteje?",
    shareWinner: (phrase: string, year: number) => `Dziaderska beseda leta ${year}: ${phrase}. Razsoja Razsodna komisija IBD.`,
    lead: {
      upcoming: (opens: string, announced: string) =>
        `Razsodna komisija je nominirala dvanajst izrazov iz Dziaderskega slovarja. Od ${opens} lahko vsak glasuje za tistega, ki je letos padel najpogosteje: za mizo, v vrsti, na parkirišču. Izid bo Komisija razglasila ${announced}.`,
      voting: (closes: string, announced: string) =>
        `Razsodna komisija je nominirala dvanajst izrazov iz Dziaderskega slovarja. Glasuj za tistega, ki je letos padel najpogosteje: za mizo, v vrsti, na parkirišču. Glasovanje traja do ${closes}, izid bo Komisija razglasila ${announced}.`,
      closed: (announced: string) =>
        `Glasovanje je zaključeno. Komisija šteje glasove in zaseda za zaprtimi vrati. Izid bo razglašen ${announced}.`,
      announced: (phrase: string) => `Razsodna komisija je razglasila dziadersko besedo leta. Postal je izraz ${phrase}. Spodaj so sklep, zapisnik glasovanja in celoten seznam nominirancev.`,
    },
    meta: (count: number, range: string, announced: string) => `${count} nominiranih izrazov · glasovanje ${range} · razglasitev ${announced}`,
    at: (date: string, time: string) => `${date} ob ${time}`,
    timeline: "Časovnica",
    steps: { upcoming: "Nominacije", voting: "Glasovanje", closed: "Seja Komisije", announced: "Razglasitev" } satisfies Record<WordPhase, string>,
    now: "zdaj",
    ruling: "Sklep Komisije",
    protocol: "Zapisnik glasovanja",
    download: "Sklep za prenos",
    post: "Objava (4 : 5)",
    story: "Zgodba (9 : 16)",
    results: "Izid glasovanja",
    resultsAside: (total: string) => `n = ${total}`,
    nominees: "Nominiranci",
    nomineesAside: (count: number) => `${count} izrazov iz Slovarja`,
    intro: {
      upcoming: (opens: string) => `Glasovanje se bo začelo ${opens}. Do takrat Komisija sprejema samo pripombe k obrazložitvam, ustno, za mizo.`,
      voting: "En glas na brskalnik. Pred glasovanjem je priporočljivo prebrati definicije: Komisija zmot ne upošteva.",
      closed: "Glasovanje je zaključeno. Seznam ostaja na vpogled.",
      announced: "Celoten seznam nominirancev po številu glasov. Pri enakem številu glasov odloča vrstni red nominacije.",
    },
    nomination: "Obrazložitev nominacije",
    species: "Vrsta",
    entry: "Geslo v Slovarju",
    rules: "Pravilnik izbora",
    rulesAside: "Sklep KO/2026/0",
    ruleList: (range: string, announced: string, from: number, quorum: number) => [
      "Komisija nominira dvanajst izrazov iz Dziaderskega slovarja. Seznam je zaključen in se ne dopolnjuje, tudi na prošnjo družine ne.",
      `Glasovanje traja ${range}, po varšavskem času. Iz enega brskalnika in z enega računa se odda en glas. Šteje prvi.`,
      `Delni rezultati se objavljajo od ${formatNumber("sl", from)} oddanih glasov naprej. Po zaključku glasovanja Komisija šteje glasove in do razglasitve ničesar ne objavi.`,
      `Če je oddanih manj kot ${quorum} glasov, besedo leta določi Komisija. Izenačenje razreši predsednik Komisije. Oba primera se zabeležita v zapisniku.`,
      `Izid se razglasi ${announced}. Volilna skrinjica pozna samo naključno številko brskalnika in pri prijavljenih številko računa. Rezultati se objavljajo samo skupno.`,
      "Izbor ne tekmuje s poljsko Mladinsko besedo leta.¹ Komisija razglasi izid dva dni za njo, da ne bi nikogar motila.",
    ],
    report: "Letno poročilo",
    reportText: "Izid izbora gre v poročilo »Stanje dziaderstva na Poljskem 2026« skupaj z letom Nacionalnega indeksa dziaderstva, številkami Malega statističnega letopisa in najbolj spornim primerom Komisije.",
    reportLink: "Preberi poročilo",
    press: "Novinarjem",
    pressText: "Sklep, seznam nominirancev in grafe iz poročila je dovoljeno ponatisniti z navedbo vira (Inštitut za raziskave dziaderstva, dziader.si).",
    promoTitle: "Beseda leta je eno.",
    promoText: "Test dziadersa preveri, koliko teh izrazov je prišlo iz tvojih ust. Pet ordinacij, približno štiri minute.",
  },
});

const NOTES = defineCopy({
  pl: [] as string[],
  sl: ["¹ Mladinska beseda leta: izbor založbe PWN, ki ga na Poljskem vsako leto razglasijo v začetku decembra. Slovenski bralec pozna podobno izbiro besede leta pri ZRC SAZU."],
});

const time = (locale: Locale, iso: string) =>
  new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** The dates of the vote in the edition's words. */
function dates(locale: Locale) {
  const config = getWordOfYear(locale);
  const t = COPY[locale];
  const lastDay = new Date(Date.parse(config.closes) - 60_000).toISOString();
  const day = (iso: string, year = false) => formatDate(locale, iso, year ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "long" });
  const range = new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone: "Europe/Warsaw", day: "numeric", month: "long", year: "numeric" });
  return {
    opens: day(config.opens),
    /** "1–8 grudnia 2026", "1.–8. december 2026". */
    range: range.formatRange(new Date(config.opens), new Date(lastDay)),
    closes: day(lastDay),
    closesYear: day(lastDay, true),
    announced: t.at(day(config.announced), time(locale, config.announced)),
    announcedYear: t.at(day(config.announced, true), time(locale, config.announced)),
    announcedDay: day(config.announced, true),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const config = getWordOfYear(locale);
  return pageMetadata(locale, {
    title: t.title(config.year),
    description: t.description(config.year, config.nominees.length),
    path: PATH,
    shareTitle: `${t.title(config.year)} · ${t.commission}`,
    shareDescription: t.share,
  });
}

export default async function WordOfYearPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const config = getWordOfYear(locale);
  const state = await getWordState();
  const when = dates(locale);
  const { phase, result } = state;

  const nominees = config.nominees.map((nominee) => {
    const entry = wordEntry(nominee.slug, locale);
    return { ...nominee, entry, species: entry.species ? speciesByKey(entry.species, locale) : null };
  });
  const headwords = Object.fromEntries(nominees.map((nominee) => [nominee.slug, nominee.entry.headword]));
  const winner = result ? nominees.find((nominee) => nominee.slug === result.winner)! : null;
  // Shares are published from the threshold during the vote, and after the announcement when the votes decided.
  const published: WordTally | null = state.tally;
  const order = phase === "announced" && published ? result!.standings.map((standing) => nominees.find((nominee) => nominee.slug === standing.slug)!) : nominees;
  const report = reportBySlug(locale === "sl" ? (REPORT_SLUGS[config.report] ?? config.report) : config.report, locale);
  const url = absoluteUrl(PATH, locale);

  const lead =
    phase === "upcoming"
      ? t.lead.upcoming(when.opens, when.announcedYear)
      : phase === "voting"
        ? t.lead.voting(when.closesYear, when.announcedYear)
        : phase === "closed"
          ? t.lead.closed(when.announcedYear)
          : t.lead.announced(quote(winner!.entry.headword, locale));
  const intro = phase === "upcoming" ? t.intro.upcoming(when.opens) : t.intro[phase];
  const shareText = winner ? t.shareWinner(quote(winner.entry.headword, locale), config.year) : t.share;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [
            { label: t.commission, href: "/czy-to-juz-dziaderstwo" },
            { label: t.short(config.year), href: PATH },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Event",
            name: t.title(config.year),
            description: t.description(config.year, config.nominees.length),
            url,
            startDate: config.opens,
            endDate: config.announced,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url },
            inLanguage: LOCALE_INFO[locale].tag,
            organizer: institute(locale),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.commission, href: "/czy-to-juz-dziaderstwo" }, { label: t.short(config.year) }]}
        title={t.title(config.year)}
        lead={typo(lead)}
        meta={t.meta(config.nominees.length, when.range, when.announced)}
        aside={<Timeline phase={phase} locale={locale} />}
      />

      {phase === "announced" && winner && result && (
        <Section id="uchwala" title={t.ruling} aside={when.announcedDay}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <WordCertificate locale={locale} year={config.year} entry={winner.entry} verdict={verdictLine(result, locale)} date={when.announcedDay} />
            </div>
            <div className="space-y-10 lg:col-span-5">
              <section aria-labelledby="protokol" className="border-t border-ink pt-5">
                <h3 id="protokol" className="label text-ink-soft">
                  {t.protocol}
                </h3>
                <p className="mt-3 text-[1.2rem] leading-relaxed">{typo(protocolText(result, locale))}</p>
              </section>
              <section aria-labelledby="pobierz" className="border-t border-ink pt-5">
                <h3 id="pobierz" className="label text-ink-soft">
                  {t.download}
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={localizePath(`${PATH}/certyfikat?format=post&pobierz`, locale)} className="btn bg-ink text-paper hover:bg-red" download>
                    {t.post}
                  </a>
                  <a href={localizePath(`${PATH}/certyfikat?format=relacja&pobierz`, locale)} className="btn border border-ink hover:bg-ink hover:text-paper" download>
                    {t.story}
                  </a>
                </div>
              </section>
              <div className="border-t border-ink pt-5">
                <ShareBar path={PATH} text={shareText} kind="slowo-roku" />
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section
        id="nominowani"
        title={phase === "announced" && published ? t.results : t.nominees}
        aside={phase === "announced" && result?.total != null ? t.resultsAside(formatNumber(locale, result.total)) : t.nomineesAside(config.nominees.length)}
        intro={typo(intro)}
      >
        <div className="mb-6">
          <BallotStatus phase={phase} total={state.total} published={Boolean(state.tally)} standingsFrom={config.standingsFrom} headwords={headwords} />
        </div>
        <ol className="border-t border-ink">
          {order.map((nominee, i) => (
            <li
              key={nominee.slug}
              className={cx(
                "grid gap-x-8 gap-y-4 border-b border-rule py-7 md:grid-cols-[3rem_1fr_9rem] lg:grid-cols-[3rem_1fr_10rem_14rem]",
                winner?.slug === nominee.slug && "bg-paper-deep/60",
              )}
            >
              <span className="text-2xl font-bold tabular-nums text-red">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.05] tracking-[-0.01em]">
                  <Link href={`/slownik/${nominee.entry.slug}`} className="transition-colors hover:text-red">
                    {quote(nominee.entry.headword, locale)}
                  </Link>
                </h3>
                {nominee.entry.original && <p className="mt-1 italic text-ink-soft">{quote(nominee.entry.original, "pl")}</p>}
                <p className="mt-3 max-w-2xl leading-snug">{typo(nominee.entry.senses[0].text)}</p>
                <p className="label mt-4 text-ink-soft">{t.nomination}</p>
                <p className="mt-1 max-w-2xl italic leading-snug text-ink-soft">{typo(nominee.nomination)}</p>
              </div>
              {nominee.species ? (
                <Link href={`/atlas/${nominee.species.slug}`} className="group flex items-center gap-3 self-start md:block">
                  <SpeciesPlate species={nominee.species.key} variant="pictogram" className="w-20 md:w-full" />
                  <span className="font-sans text-[0.85rem] font-semibold leading-tight transition-colors group-hover:text-red">{nominee.species.name}</span>
                </Link>
              ) : (
                <span />
              )}
              <div className="md:col-start-2 lg:col-start-auto">
                <VoteStamp slug={nominee.slug} phrase={quote(nominee.entry.headword, locale)} phase={phase} tally={published} total={published ? state.total : null} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="regulamin" title={t.rules} aside={t.rulesAside}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <ol className="border-t border-ink lg:col-span-7">
            {t.ruleList(when.range, when.announcedYear, config.standingsFrom, config.quorum).map((rule, i) => (
              <li key={rule} className="grid grid-cols-[3rem_1fr] items-baseline border-b border-rule py-4">
                <span className="font-sans text-[0.9rem] font-semibold text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed">{typo(rule)}</span>
              </li>
            ))}
          </ol>
          <div className="space-y-10 lg:col-span-5">
            {report && (
              <section aria-labelledby="raport-roczny" className="border-t border-ink pt-5">
                <h3 id="raport-roczny" className="label text-ink-soft">
                  {t.report} · {report.number}
                </h3>
                <p className="mt-3 text-xl font-bold leading-tight">{report.title}</p>
                <p className="mt-2 leading-snug text-ink-soft">{typo(t.reportText)}</p>
                <Link href={`/raporty/${report.slug}`} className="btn mt-5 bg-ink text-paper hover:bg-red">
                  {t.reportLink} <span aria-hidden="true">→</span>
                </Link>
              </section>
            )}
            <section aria-labelledby="dziennikarze" className="border-t border-ink pt-5">
              <h3 id="dziennikarze" className="label text-ink-soft">
                {t.press}
              </h3>
              <p className="mt-3 leading-snug">{typo(t.pressText)}</p>
              <p className="label mt-3 text-ink-soft">
                <DataLicense />
              </p>
            </section>
            <TranslatorNotes notes={NOTES[locale]} />
          </div>
        </div>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}

/** The four steps of the vote, the current one stamped. */
function Timeline({ phase, locale }: { phase: WordPhase; locale: Locale }) {
  const t = COPY[locale];
  const steps: WordPhase[] = ["upcoming", "voting", "closed", "announced"];
  const current = steps.indexOf(phase);
  return (
    <figure className="ml-auto w-full max-w-sm">
      <figcaption className="label border-b border-ink pb-2 text-ink-soft">{t.timeline}</figcaption>
      <ol>
        {steps.map((step, i) => (
          <li key={step} className={cx("flex items-center justify-between gap-4 border-b border-rule py-3", i > current && "text-ink-faint")}>
            <span className="flex items-baseline gap-3">
              <span className="w-5 font-sans text-[0.8rem] font-semibold text-red tabular-nums">{i + 1}.</span>
              <span className={cx("text-lg leading-tight", i === current && "font-bold")}>{t.steps[step]}</span>
            </span>
            {i === current && (
              <Stamp className="animate-stamp text-[0.7rem] [--stamp-rotate:-4deg]">{t.now}</Stamp>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
