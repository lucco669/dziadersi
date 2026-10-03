import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PageHeader, Section } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { caseKey, docket, getCases, getVerdicts } from "@/content/cases";
import { getRegions } from "@/content/regions";
import { getSpecies, speciesByKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { signInPath } from "@/lib/account";
import { decodeCard } from "@/lib/bingo";
import { decodeLine } from "@/lib/phrasebook";
import { buildProfile, loadRecords, warsawToday, type Badge } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { DIAGNOSABLE } from "@/lib/test";
import { cx, formatDate, plural, pluralSl, quote, typo } from "@/lib/typo";
import { deleteAccount, removeBookmark, removeResult, removeSighting, saveNickname, saveSettings, signOut } from "./actions";

const COPY = defineCopy({
  pl: {
    title: "Profil Dziaderski",
    description: "Zapisane wyniki Testu Dziadersa, kolekcja gatunków, dziennik obserwacji terenowych, zakładki i odznaki Instytutu.",
    lead: "Kartoteka badań, kolekcja gatunków, dziennik obserwacji terenowych, zakładki i odznaki Instytutu.",
    loading: "Instytut wyszukuje kartotekę…",
    closed: "Profile są chwilowo nieczynne.",
    status: { nowe: "W rozpatrzeniu", przyjete: "Przyjęta do wokandy", odrzucone: "Umorzona" } as Record<string, string>,
    savedNotice: {
      rozmowki: "Wypowiedź dopisana do zakładek.",
      bingo: "Karta bingo dopisana do zakładek.",
      egzamin: "Egzamin dopisany do zakładek.",
    } as Record<string, string>,
    filed: "Wynik dopisany do kartoteki.",
    awarded: "Przyznano",
    remove: "Usuń",
    of: (count: number, total: number) => `${count} z ${total}`,
    percent: (value: number) => `${value}%`,
    stats: { file: "Kartoteka", results: "Badania", average: "Średni wynik", collection: "Kolekcja", observations: "Obserwacje", badges: "Odznaki" },
    sectionsNav: "Działy kartoteki",
    nav: {
      legitymacja: "Legitymacja",
      kolekcja: "Kolekcja",
      obserwacje: "Dziennik obserwacji",
      odznaki: "Odznaki",
      kalendarz: "Kalendarz",
      kartoteka: "Badania",
      zakladki: "Zakładki",
      komisja: "Komisja",
      ustawienia: "Ustawienia",
    },
    card: {
      title: "Legitymacja Obserwatora",
      aside: "Ważna do odwołania",
      intro: "Legitymacja aktualizuje się sama: pseudonim, stopień, dziennik obserwacji i odznaki. Do pobrania jako obraz, do pokazania przy grillu.",
      alt: (nickname: string, observed: number, total: number) =>
        `Legitymacja Obserwatora Terenowego: ${nickname || "bez pseudonimu"}, ${observed} z ${total} gatunków w dzienniku`,
      download: "Pobierz legitymację",
      format: "Obraz PNG, 1240 × 800.",
      anonymous: "Bez pseudonimu legitymacja jest anonimowa. Pseudonim ustawia się niżej, w ustawieniach.",
    },
    collection: {
      title: "Kolekcja gatunków",
      intro: "Każde rozpoznanie w Teście Dziadersa dopisuje gatunek do kolekcji. Wywiady rodzinne się liczą: Instytut nie pyta, kogo badano.",
      unknown: "Gatunek nierozpoznany",
    },
    log: {
      title: "Dziennik obserwacji",
      aside: (observed: number, total: number) => `${observed} z ${total} ${plural(total, "gatunku", "gatunków", "gatunków")}`,
      intro:
        "Obserwacje terenowe zgłasza się na stronie gatunku w Atlasie, przyciskiem „Widziałem” przy karcie gatunku. Jedna obserwacja gatunku dziennie. Wesela i Wigilia się liczą.",
      /** The plate caption: the name without the genus word, and the count. */
      plate: (name: string, count: number) => `${name.replace("Dziaders ", "")} ×${count}`,
      latest: "Ostatnie zgłoszenia",
      noRegion: "Województwo nie podane",
      remove: (name: string) => `Usuń obserwację: ${name}`,
    },
    badges: { title: "Odznaki" },
    calendar: {
      title: "Kartki z kalendarza",
      aside: (streak: number) => `Seria: ${streak} ${plural(streak, "dzień", "dni", "dni")}`,
      intro: "Każda kartka zerwana na stronie Kalendarza trafia tutaj. Siedem dni z rzędu daje odznakę Zdzieraka, trzydzieści kartek odznakę Kalendarza ściennego.",
      last30: "Ostatnie 30 dni",
      day: (day: string, torn: boolean) => `${day}: ${torn ? "kartka zerwana" : "bez kartki"}`,
      total: "kartek w kolekcji",
      streak: "dni z rzędu",
      best: "rekord serii",
      today: "Dzisiejsza kartka",
      tear: "Zerwij dzisiejszą kartkę",
    },
    records: {
      title: "Kartoteka badań",
      aside: (count: number) => `${count} ${plural(count, "wpis", "wpisy", "wpisów")}`,
      intro: "Wyniki z testów zrobionych po zalogowaniu dopisują się same. Starsze można dopisać przyciskiem na stronie wyniku.",
      test: "Wykonaj test",
      empty: "Kartoteka pusta. Instytut czeka na pierwsze badanie.",
      proxy: (name: string) => `Wywiad rodzinny${name ? `: ${name}` : ""}`,
      own: "Badanie własne",
      remove: (score: number) => `Usuń wynik ${score}% z kartoteki`,
    },
    bookmarks: {
      title: "Zakładki",
      aside: (count: number) => `${count} ${plural(count, "zakładka", "zakładki", "zakładek")}`,
      intro: "Wypowiedzi z Rozmówek, wygrane karty bingo i egzaminy terenowe. Przycisk „Zachowaj” jest przy każdym z nich.",
      phrasebook: "Rozmówki dziaderskie",
      empty: "Na razie pusto. Zacznij od Rozmówek: wypowiedź, która się przyda, warto mieć pod ręką.",
      lines: "Rozmówki",
      exams: "Egzaminy terenowe",
      removeLine: "Usuń wypowiedź z zakładek",
      card: (title: string, number: string) => `${title}, karta ${number}`,
      bingo: (date: string) => `Bingo zgłoszone ${date}`,
      removeCard: (number: string) => `Usuń kartę ${number} z zakładek`,
      points: (points: number, date: string) => `${points} z 12 · ${date}`,
      removeExam: "Usuń egzamin z zakładek",
    },
    court: {
      title: "Komisja Orzekająca",
      aside: (count: number) => `${count} ${plural(count, "orzeczenie", "orzeczenia", "orzeczeń")}`,
      agreement: (agreed: number, voted: number) => `Zgodność z Komisją: ${agreed} z ${voted}. Ławnik nie musi się zgadzać, ale Komisja to odnotowuje.`,
      invite: "Ławnicy orzekają w sprawach z życia wziętych. Zalogowany ławnik ma swoje orzeczenia w kartotece.",
      cta: "Do Komisji",
      empty: "Brak orzeczeń. Na wokandzie czekają sprawy.",
      you: "Ty",
      court: "Komisja",
      submitted: "Zgłoszone sprawy",
    },
    settings: {
      title: "Ustawienia",
      bulletin: "Biuletyn tygodniowy",
      bulletinNote: "List w poniedziałek rano: tydzień w liczbach i twój tydzień. Wypisanie jednym kliknięciem.",
      honor: "Pseudonim na Tablicy Honorowej",
      honorNote: "Tylko pseudonim i liczby: obserwacje, orzeczenia, kartki.",
      honorNeedsNickname: "Najpierw ustaw pseudonim poniżej. Bez niego Tablica cię nie pokaże.",
      saveConsents: "Zapisz zgody",
      nickname: "Pseudonim w kartotece",
      nicknamePlaceholder: "np. Zenek",
      save: "Zapisz",
      signedInAs: "Zalogowano jako",
      signOut: "Wyloguj",
      deletion: "Usunięcie konta",
      deletionNote:
        "Konto, pseudonim, kartoteka, obserwacje, zakładki i zgłoszone sprawy znikają od razu i na zawsze. Anonimowe wyniki w Narodowym Spisie i głosy w Komisji zostają, bo nie wiadomo, czyje są.",
      confirm: "Tak, usuwam konto",
      deletionFailed: "Nie udało się usunąć konta. Spróbuj za chwilę.",
      delete: "Usuń konto",
    },
  },
  sl: {
    title: "Dziaderski profil",
    description: "Shranjeni izvidi testa dziadersa, zbirka vrst, dnevnik terenskih opazovanj, zaznamki in značke Inštituta.",
    lead: "Kartoteka pregledov, zbirka vrst, dnevnik terenskih opazovanj, zaznamki in značke Inštituta.",
    loading: "Inštitut išče kartoteko …",
    closed: "Profili so začasno zaprti.",
    status: { nowe: "V obravnavi", przyjete: "Uvrščen na razpored", odrzucone: "Postopek ustavljen" },
    savedNotice: {
      rozmowki: "Izjava dodana med zaznamke.",
      bingo: "Bingo listek dodan med zaznamke.",
      egzamin: "Izpit dodan med zaznamke.",
    },
    filed: "Izvid vpisan v kartoteko.",
    awarded: "Podeljeno",
    remove: "Odstrani",
    of: (count: number, total: number) => `${count} od ${total}`,
    percent: (value: number) => `${value} %`,
    stats: { file: "Kartoteka", results: "Pregledi", average: "Povprečni rezultat", collection: "Zbirka", observations: "Opazovanja", badges: "Značke" },
    sectionsNav: "Razdelki kartoteke",
    nav: {
      legitymacja: "Izkaznica",
      kolekcja: "Zbirka",
      obserwacje: "Dnevnik opazovanj",
      odznaki: "Značke",
      kalendarz: "Koledar",
      kartoteka: "Pregledi",
      zakladki: "Zaznamki",
      komisja: "Komisija",
      ustawienia: "Nastavitve",
    },
    card: {
      title: "Opazovalska izkaznica",
      aside: "Velja do preklica",
      intro: "Izkaznica se posodablja sama: psevdonim, naziv, dnevnik opazovanj in značke. Prenesi jo kot sliko in jo pokaži ob žaru.",
      alt: (nickname: string, observed: number, total: number) =>
        `Izkaznica terenskega opazovalca: ${nickname || "brez psevdonima"}, ${observed} od ${total} vrst v dnevniku`,
      download: "Prenesi izkaznico",
      format: "Slika PNG, 1240 × 800.",
      anonymous: "Brez psevdonima je izkaznica anonimna. Psevdonim nastaviš spodaj, v nastavitvah.",
    },
    collection: {
      title: "Zbirka vrst",
      intro: "Vsaka diagnoza v testu dziadersa doda vrsto v zbirko. Heteroanamneze štejejo: Inštitut ne sprašuje, koga so pregledali.",
      unknown: "Neprepoznana vrsta",
    },
    log: {
      title: "Dnevnik opazovanj",
      aside: (observed: number, total: number) => `${observed} od ${total} ${pluralSl(total, "vrste", "vrst", "vrst", "vrst")}`,
      intro:
        "Terenska opazovanja prijaviš na strani vrste v Atlasu, z gumbom ob kartici vrste. Eno opazovanje vrste na dan. Svatbe in sveti večer štejejo.",
      plate: (name: string, count: number) => `${name.replace(/ dziaders$/, "")} ×${count}`,
      latest: "Zadnje prijave",
      noRegion: "Vojvodstvo ni navedeno",
      remove: (name: string) => `Odstrani opazovanje: ${name}`,
    },
    badges: { title: "Značke" },
    calendar: {
      title: "Listi s koledarja",
      aside: (streak: number) => `Niz: ${streak} ${pluralSl(streak, "dan", "dneva", "dnevi", "dni")}`,
      intro: "Vsak list, odtrgan na strani Koledarja, pride sem. Sedem dni zapored prinese značko Trgalec, trideset listov značko Stenski koledar.",
      last30: "Zadnjih 30 dni",
      day: (day: string, torn: boolean) => `${day}: ${torn ? "list odtrgan" : "brez lista"}`,
      total: "listov v zbirki",
      streak: "dni zapored",
      best: "rekordni niz",
      today: "Današnji list",
      tear: "Odtrgaj današnji list",
    },
    records: {
      title: "Kartoteka pregledov",
      aside: (count: number) => `${count} ${pluralSl(count, "vpis", "vpisa", "vpisi", "vpisov")}`,
      intro: "Izvidi testov, opravljenih po prijavi, se vpišejo sami. Starejše lahko vpišeš z gumbom na strani izvida.",
      test: "Opravi test",
      empty: "Kartoteka je prazna. Inštitut čaka na prvi pregled.",
      proxy: (name: string) => `Heteroanamneza${name ? `: ${name}` : ""}`,
      own: "Lastni pregled",
      remove: (score: number) => `Odstrani izvid ${score} % iz kartoteke`,
    },
    bookmarks: {
      title: "Zaznamki",
      aside: (count: number) => `${count} ${pluralSl(count, "zaznamek", "zaznamka", "zaznamki", "zaznamkov")}`,
      intro: "Izjave iz Pogovornika, zmagovalni bingo listki in terenski izpiti. Gumb »Ohrani« je pri vsakem od njih.",
      phrasebook: "Dziaderski pogovornik",
      empty: "Zaenkrat prazno. Začni s Pogovornikom: izjavo, ki pride prav, je dobro imeti pri roki.",
      lines: "Pogovornik",
      exams: "Terenski izpiti",
      removeLine: "Odstrani izjavo iz zaznamkov",
      card: (title: string, number: string) => `${title}, listek ${number}`,
      bingo: (date: string) => `Bingo prijavljen ${date}`,
      removeCard: (number: string) => `Odstrani listek ${number} iz zaznamkov`,
      points: (points: number, date: string) => `${points} od 12 · ${date}`,
      removeExam: "Odstrani izpit iz zaznamkov",
    },
    court: {
      title: "Razsodna komisija",
      aside: (count: number) => `${count} ${pluralSl(count, "razsodba", "razsodbi", "razsodbe", "razsodb")}`,
      agreement: (agreed: number, voted: number) => `Ujemanje s Komisijo: ${agreed} od ${voted}. Porotniku se ni treba strinjati, a Komisija to zabeleži.`,
      invite: "Porotniki razsojajo v primerih iz življenja. Prijavljen porotnik ima svoje razsodbe v kartoteki.",
      cta: "Na Komisijo",
      empty: "Ni razsodb. Na razporedu čakajo primeri.",
      you: "Ti",
      court: "Komisija",
      submitted: "Prijavljeni primeri",
    },
    settings: {
      title: "Nastavitve",
      bulletin: "Tedenski bilten",
      bulletinNote: "Pismo v ponedeljek zjutraj: teden v številkah in tvoj teden. Odjava z enim klikom.",
      honor: "Psevdonim na Častni tabli",
      honorNote: "Samo psevdonim in številke: opazovanja, razsodbe, listi.",
      honorNeedsNickname: "Najprej spodaj nastavi psevdonim. Brez njega te Tabla ne pokaže.",
      saveConsents: "Shrani soglasja",
      nickname: "Psevdonim v kartoteki",
      nicknamePlaceholder: "npr. Jože",
      save: "Shrani",
      signedInAs: "Prijavljeni e-naslov",
      signOut: "Odjava",
      deletion: "Izbris računa",
      deletionNote:
        "Račun, psevdonim, kartoteka, opazovanja, zaznamki in prijavljeni primeri izginejo takoj in za vedno. Anonimni rezultati v Nacionalnem popisu in glasovi v Komisiji ostanejo, ker se ne ve, čigavi so.",
      confirm: "Da, izbrišem račun",
      deletionFailed: "Računa ni bilo mogoče izbrisati. Poskusi znova čez trenutek.",
      delete: "Izbriši račun",
    },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/profil", noindex: true });
}

/** "2026-10-02" from Postgres, as a date. */
const day = (value: string) => new Date(`${value}T12:00:00Z`);
const longDate = (locale: Locale, value: string) => formatDate(locale, new Date(value));
const shortDate = (locale: Locale, value: string) => formatDate(locale, day(value), { day: "numeric", month: "short", timeZone: "UTC" });

/** The edition travels with every form, so the actions redirect within it. */
function EditionField({ locale }: { locale: Locale }) {
  return <input type="hidden" name="jezyk" value={locale} />;
}

function BadgeStamp({ badge, locale }: { badge: Badge; locale: Locale }) {
  return (
    <li
      className={cx(
        "flex min-h-28 flex-col justify-between border-4 border-double p-3",
        badge.earned ? "ink-worn rotate-[-1.5deg] border-red text-red" : "border-rule text-ink-faint",
      )}
    >
      <span className="font-sans text-[0.8rem] font-bold uppercase leading-tight tracking-[0.1em]">{badge.name}</span>
      <span className={cx("font-sans text-[0.8rem] leading-snug", badge.earned ? "text-red/80" : "text-ink-faint")}>
        {badge.earned ? COPY[locale].awarded : badge.hint}
      </span>
    </li>
  );
}

function RemoveButton({
  action,
  fields,
  label,
  locale,
}: {
  action: (data: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: string;
  locale: Locale;
}) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <EditionField locale={locale} />
      <button type="submit" className="label py-2 text-ink-soft transition-colors hover:text-red" aria-label={label}>
        {COPY[locale].remove}
      </button>
    </form>
  );
}

function Empty({ children, href, cta }: { children: ReactNode; href: string; cta: string }) {
  return (
    <div className="border-t border-ink pt-6">
      <p className="max-w-xl text-xl leading-snug">{children}</p>
      <Link href={href} className="btn mt-6 border border-ink hover:bg-ink hover:text-paper">
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

async function ProfileContent({ searchParams }: { searchParams: PageProps<"/[lang]/profil">["searchParams"] }) {
  const locale = await getLocale();
  const t = COPY[locale];
  const { supabase, user } = await currentUser();
  if (!user) redirect(signInPath("/profil", locale));
  const params = await searchParams;

  const records = await loadRecords(supabase, user);
  const profile = buildProfile(records, locale);
  const species = getSpecies(locale);
  const regions = getRegions(locale);
  const verdicts = getVerdicts(locale);
  const earned = profile.badges.filter((badge) => badge.earned).length;
  const voted = getCases(locale).filter((item) => profile.verdicts[caseKey(item)]);
  const agreed = voted.filter((item) => profile.verdicts[caseKey(item)] === item.expert).length;
  const lines = profile.bookmarks.rozmowki.flatMap((item) => {
    const line = decodeLine(item.code, locale);
    return line ? [{ ...item, line }] : [];
  });
  const cards = profile.bookmarks.bingo.flatMap((item) => {
    const card = decodeCard(item.code, locale);
    return card ? [{ ...item, card }] : [];
  });
  const bookmarks = lines.length + cards.length + profile.exams.length;
  const today = warsawToday();
  const torn = new Set(profile.calendar.total ? records.calendar : []);
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const key = new Date(Date.parse(`${today}T12:00:00Z`) - (29 - i) * 86_400_000).toISOString().slice(0, 10);
    return { key, torn: torn.has(key) };
  });
  const notice = params.zapisano ? t.filed : typeof params.zachowano === "string" ? t.savedNotice[params.zachowano] : null;

  return (
    <>
      <section className="wrap pt-10">
        {notice && (
          <p className="mb-8 border-l-2 border-red pl-4 font-sans text-[0.95rem] text-red" role="status">
            {notice}
          </p>
        )}
        <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
          {[
            [t.stats.file, profile.nickname || user.email || ""],
            [t.stats.results, String(profile.results.length)],
            [t.stats.average, profile.average === null ? "—" : t.percent(profile.average)],
            [t.stats.collection, t.of(profile.collected.size, DIAGNOSABLE.length)],
            [t.stats.observations, t.of(profile.observed.size, species.length)],
            [t.stats.badges, t.of(earned, profile.badges.length)],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-rule py-4 pr-4">
              <dt className="label text-ink-soft">{label}</dt>
              <dd className="mt-1 truncate text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
        <nav aria-label={t.sectionsNav} className="label mt-4 flex flex-wrap gap-x-5 gap-y-1 text-ink-soft">
          {Object.entries(t.nav).map(([id, label]) => (
            <a key={id} href={`#${id}`} className="transition-colors hover:text-red">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <Section id="legitymacja" title={t.card.title} aside={t.card.aside} intro={typo(t.card.intro)}>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated per account, never optimised */}
          <img
            src={localizePath("/profil/legitymacja", locale)}
            alt={t.card.alt(profile.nickname, profile.observed.size, species.length)}
            width={1240}
            height={800}
            className="w-full lg:col-span-8"
          />
          <div className="lg:col-span-4">
            <a href={localizePath("/profil/legitymacja?pobierz", locale)} download className="btn bg-ink text-paper hover:bg-red">
              {t.card.download} <span aria-hidden="true">↓</span>
            </a>
            <p className="label mt-4 max-w-xs text-ink-soft">{typo(profile.nickname ? t.card.format : t.card.anonymous)}</p>
          </div>
        </div>
      </Section>

      <Section
        id="kolekcja"
        title={t.collection.title}
        aside={t.of(profile.collected.size, DIAGNOSABLE.length)}
        intro={typo(t.collection.intro)}
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {DIAGNOSABLE.map(({ key }) => {
            const item = speciesByKey(key, locale);
            const has = profile.collected.has(key);
            return (
              <li key={key}>
                <Link href={`/atlas/${item.slug}`} className="group block">
                  <SpeciesPlate species={key} className={cx("w-full transition", !has && "opacity-15 grayscale")} />
                  <span className={cx("mt-2 block font-bold leading-tight", has ? "group-hover:text-red" : "text-ink-faint")}>
                    {has ? item.name : t.collection.unknown}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="obserwacje" title={t.log.title} aside={t.log.aside(profile.observed.size, species.length)} intro={typo(t.log.intro)}>
        <ol className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-7 lg:grid-cols-[repeat(14,minmax(0,1fr))]">
          {species.map((item) => {
            const entry = profile.observed.get(item.key);
            return (
              <li key={item.key}>
                <Link href={`/atlas/${item.slug}#obserwacja`} className="group block" title={item.name}>
                  <SpeciesPlate species={item.key} className={cx("w-full transition", !entry && "opacity-15 grayscale")} />
                  <span className={cx("label mt-1 block text-[0.72rem] leading-tight", entry ? "text-ink" : "text-ink-faint")}>
                    {entry ? t.log.plate(item.name, entry.count) : item.code}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {profile.sightings.length > 0 && (
          <div className="mt-12">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.log.latest}</h3>
            <ol>
              {profile.sightings.slice(0, 12).map((sighting) => {
                const item = speciesByKey(sighting.species, locale);
                return (
                  <li
                    key={`${sighting.species}-${sighting.observedOn}`}
                    className="grid grid-cols-[5rem_1fr_auto] items-center gap-x-5 border-b border-rule py-3 md:grid-cols-[7rem_1fr_14rem_auto]"
                  >
                    <span className="label text-ink-soft">{shortDate(locale, sighting.observedOn)}</span>
                    <Link href={`/atlas/${item.slug}`} className="font-bold leading-tight hover:text-red">
                      {item.name}
                    </Link>
                    <span className="label col-start-2 text-ink-faint md:col-start-3">
                      {sighting.region ? regions[sighting.region]?.name : t.log.noRegion}
                    </span>
                    <div className="col-start-3 row-span-2 row-start-1 md:col-start-4 md:row-span-1">
                      <RemoveButton
                        action={removeSighting}
                        fields={{ gatunek: sighting.species, dzien: sighting.observedOn }}
                        label={t.log.remove(item.name)}
                        locale={locale}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </Section>

      <Section id="odznaki" title={t.badges.title} aside={t.of(earned, profile.badges.length)}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {profile.badges.map((badge) => (
            <BadgeStamp key={badge.key} badge={badge} locale={locale} />
          ))}
        </ul>
      </Section>

      <Section id="kalendarz" title={t.calendar.title} aside={t.calendar.aside(profile.calendar.streak)} intro={typo(t.calendar.intro)}>
        <ol className="grid grid-cols-10 gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))]" aria-label={t.calendar.last30}>
          {last30.map((day) => (
            <li
              key={day.key}
              title={day.key}
              className={cx("aspect-square", day.torn ? "bg-red" : "bg-ink/10", day.key === today && "outline outline-2 outline-offset-1 outline-ink")}
            >
              <span className="sr-only">{t.calendar.day(day.key, day.torn)}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-8 grid max-w-xl grid-cols-3 border-t border-ink">
          {[
            [String(profile.calendar.total), t.calendar.total],
            [String(profile.calendar.streak), t.calendar.streak],
            [String(profile.calendar.best), t.calendar.best],
          ].map(([value, label]) => (
            <div key={label} className="pt-3">
              <dd className="text-3xl font-bold leading-none">{value}</dd>
              <dt className="label mt-1 text-ink-soft">{label}</dt>
            </div>
          ))}
        </dl>
        <Link href="/kalendarz" className="btn mt-8 border border-ink hover:bg-ink hover:text-paper">
          {profile.calendar.today ? t.calendar.today : t.calendar.tear} <span aria-hidden="true">→</span>
        </Link>
      </Section>

      <Section id="kartoteka" title={t.records.title} aside={t.records.aside(profile.results.length)} intro={typo(t.records.intro)}>
        {profile.results.length === 0 ? (
          <Empty href="/test" cta={t.records.test}>
            {typo(t.records.empty)}
          </Empty>
        ) : (
          <ol className="border-t border-ink">
            {profile.results.map((result) => (
              <li key={result.code} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 gap-y-1 border-b border-rule py-4 md:grid-cols-[6rem_1fr_12rem_auto]">
                <span className="text-[2rem] font-bold leading-none tabular-nums">
                  {result.score}
                  <span className="text-[0.5em]">%</span>
                </span>
                <Link href={`/wynik/${result.code}`} className="group min-w-0">
                  <span className="block font-bold leading-tight group-hover:text-red">{result.diagnosis.name}</span>
                  <span className="label mt-0.5 block text-ink-soft">{result.proxy ? t.records.proxy(result.name) : result.name || t.records.own}</span>
                </Link>
                <span className="label col-start-2 text-ink-faint md:col-start-3">{longDate(locale, result.savedAt)}</span>
                <div className="col-start-3 row-span-2 row-start-1 md:col-start-4 md:row-span-1">
                  <RemoveButton action={removeResult} fields={{ kod: result.code }} label={t.records.remove(result.score)} locale={locale} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section id="zakladki" title={t.bookmarks.title} aside={t.bookmarks.aside(bookmarks)} intro={typo(t.bookmarks.intro)}>
        {bookmarks === 0 ? (
          <Empty href="/generator" cta={t.bookmarks.phrasebook}>
            {typo(t.bookmarks.empty)}
          </Empty>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            <div>
              <h3 className="label border-b border-ink pb-3 text-ink-soft">
                {t.bookmarks.lines} · {lines.length}
              </h3>
              <ul>
                {lines.map(({ code, line }) => (
                  <li key={code} className="grid grid-cols-[1fr_auto] gap-4 border-b border-rule py-4">
                    <Link href={`/generator/${code}`} className="group">
                      <span className="label block text-ink-soft">{line.situation.name}</span>
                      <span className="mt-1 block italic leading-snug group-hover:text-red">{quote(typo(line.text), locale)}</span>
                    </Link>
                    <RemoveButton action={removeBookmark} fields={{ rodzaj: "rozmowki", kod: code }} label={t.bookmarks.removeLine} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label border-b border-ink pb-3 text-ink-soft">Bingo · {cards.length}</h3>
              <ul>
                {cards.map(({ code, card, savedAt }) => (
                  <li key={code} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-rule py-4">
                    <Link href={`/bingo/${code}`} className="group">
                      <span className="block font-bold leading-tight group-hover:text-red">{t.bookmarks.card(card.occasion.title, card.number)}</span>
                      <span className="label block text-ink-soft">{t.bookmarks.bingo(longDate(locale, savedAt))}</span>
                    </Link>
                    <RemoveButton
                      action={removeBookmark}
                      fields={{ rodzaj: "bingo", kod: code }}
                      label={t.bookmarks.removeCard(card.number)}
                      locale={locale}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label border-b border-ink pb-3 text-ink-soft">
                {t.bookmarks.exams} · {profile.exams.length}
              </h3>
              <ul>
                {profile.exams.map((exam) => (
                  <li key={exam.code} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-rule py-4">
                    <span className="text-[2rem] font-bold leading-none">{exam.grade.value}</span>
                    <Link href={`/egzamin/${exam.code}`} className="group">
                      <span className="block font-bold leading-tight group-hover:text-red">{exam.grade.title}</span>
                      <span className="label block text-ink-soft">{t.bookmarks.points(exam.points, exam.date)}</span>
                    </Link>
                    <RemoveButton action={removeBookmark} fields={{ rodzaj: "egzamin", kod: exam.code }} label={t.bookmarks.removeExam} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Section>

      <Section
        id="komisja"
        title={t.court.title}
        aside={t.court.aside(voted.length)}
        intro={voted.length ? typo(t.court.agreement(agreed, voted.length)) : typo(t.court.invite)}
      >
        {voted.length === 0 ? (
          <Empty href="/czy-to-juz-dziaderstwo" cta={t.court.cta}>
            {typo(t.court.empty)}
          </Empty>
        ) : (
          <ol className="border-t border-ink">
            {voted.map((item) => {
              const mine = verdicts.find((verdict) => verdict.key === profile.verdicts[caseKey(item)]);
              const expert = verdicts.find((verdict) => verdict.key === item.expert);
              return (
                <li key={item.slug} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[8rem_1fr_12rem_12rem]">
                  <span className="label text-ink-soft">{docket(item)}</span>
                  <Link href={`/czy-to-juz-dziaderstwo/${item.slug}`} className="font-bold leading-tight hover:text-red">
                    {item.title}
                  </Link>
                  <span className="label">
                    {t.court.you}: {mine?.short}
                  </span>
                  <span className={cx("label", mine?.key === expert?.key ? "text-ink-soft" : "text-red")}>
                    {t.court.court}: {expert?.short}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {profile.submissions.length > 0 && (
          <div className="mt-12">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.court.submitted}</h3>
            <ul>
              {profile.submissions.map((submission) => (
                <li key={submission.created_at} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[1fr_12rem]">
                  <span className="leading-snug">{submission.body}</span>
                  <span className="label text-ink-soft md:text-right">
                    {t.status[submission.status] ?? submission.status} · {longDate(locale, submission.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section id="ustawienia" title={t.settings.title}>
        <form action={saveSettings} className="mb-14 grid gap-6 border-t border-ink pt-5 lg:grid-cols-3">
          <EditionField locale={locale} />
          <label className="flex items-start gap-3">
            <input type="checkbox" name="biuletyn" value="tak" defaultChecked={profile.newsletter} className="mt-1 size-5 shrink-0 accent-red" />
            <span>
              <span className="block font-bold leading-tight">{t.settings.bulletin}</span>
              <span className="label mt-1 block text-ink-soft">{typo(t.settings.bulletinNote)}</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="tablica" value="tak" defaultChecked={profile.honor} className="mt-1 size-5 shrink-0 accent-red" />
            <span>
              <span className="block font-bold leading-tight">{t.settings.honor}</span>
              <span className="label mt-1 block text-ink-soft">{typo(profile.nickname ? t.settings.honorNote : t.settings.honorNeedsNickname)}</span>
            </span>
          </label>
          <div>
            <button type="submit" className="btn border border-ink hover:bg-ink hover:text-paper">
              {t.settings.saveConsents}
            </button>
          </div>
        </form>
        <div className="grid gap-12 lg:grid-cols-3">
          <form action={saveNickname} className="border-t border-ink pt-5">
            <EditionField locale={locale} />
            <label htmlFor="pseudonim" className="label text-ink-soft">
              {t.settings.nickname}
            </label>
            <input
              id="pseudonim"
              name="pseudonim"
              defaultValue={profile.nickname}
              maxLength={24}
              placeholder={t.settings.nicknamePlaceholder}
              className="mt-2 block w-full border-0 border-b-2 border-ink bg-transparent px-0 py-1.5 font-serif text-xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none"
            />
            <button type="submit" className="btn mt-5 border border-ink hover:bg-ink hover:text-paper">
              {t.settings.save}
            </button>
          </form>

          <form action={signOut} className="border-t border-ink pt-5">
            <EditionField locale={locale} />
            <p className="label text-ink-soft">{t.settings.signedInAs}</p>
            <p className="mt-2 truncate text-xl font-bold">{user.email}</p>
            <button type="submit" className="btn mt-5 border border-ink hover:bg-ink hover:text-paper">
              {t.settings.signOut}
            </button>
          </form>

          <form action={deleteAccount} className="border-t border-ink pt-5">
            <EditionField locale={locale} />
            <p className="label text-ink-soft">{t.settings.deletion}</p>
            <p className="mt-2 leading-snug text-ink-soft">{typo(t.settings.deletionNote)}</p>
            <label className="mt-4 flex items-center gap-3 font-sans text-[0.95rem]">
              <input type="checkbox" name="potwierdzam" value="tak" required className="size-5 accent-red" />
              {t.settings.confirm}
            </label>
            {params.usuwanie === "blad" && (
              <p className="mt-2 font-sans text-sm text-red" role="alert">
                {t.settings.deletionFailed}
              </p>
            )}
            <button type="submit" className="btn mt-5 border border-red text-red hover:bg-red hover:text-paper">
              {t.settings.delete}
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}

export default async function ProfilePage({ searchParams }: PageProps<"/[lang]/profil">) {
  const t = COPY[await getLocale()];
  return (
    <main id="tresc">
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} />
      {hasAuth ? (
        <Suspense fallback={<p className="wrap label pb-24 pt-12 text-ink-soft">{t.loading}</p>}>
          <ProfileContent searchParams={searchParams} />
        </Suspense>
      ) : (
        <p className="wrap pb-24 pt-12 text-xl">{typo(t.closed)}</p>
      )}
    </main>
  );
}
