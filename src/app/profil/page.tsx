import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PageHeader, Section } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { CASES, docket, VERDICTS } from "@/content/cases";
import { REGIONS } from "@/content/regions";
import { SPECIES, speciesByKey } from "@/content/species";
import { decodeCard } from "@/lib/bingo";
import { decodeLine } from "@/lib/phrasebook";
import { buildProfile, loadRecords, type Badge } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { DIAGNOSABLE } from "@/lib/test";
import { cx, plural, typo } from "@/lib/typo";
import { deleteAccount, removeBookmark, removeResult, removeSighting, saveNickname, signOut } from "./actions";

export const metadata: Metadata = pageMetadata({
  title: "Profil Dziaderski",
  description: "Zapisane wyniki Testu Dziadersa, kolekcja gatunków, dziennik obserwacji terenowych, zakładki i odznaki Instytutu.",
  path: "/profil",
  noindex: true,
});

const longDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Warsaw" });
const shortDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", timeZone: "UTC" });
/** "2026-10-02" from Postgres, as a date. */
const day = (value: string) => new Date(`${value}T12:00:00Z`);

const STATUS: Record<string, string> = { nowe: "W rozpatrzeniu", przyjete: "Przyjęta do wokandy", odrzucone: "Umorzona" };
const SAVED_NOTICE: Record<string, string> = {
  rozmowki: "Wypowiedź dopisana do zakładek.",
  bingo: "Karta bingo dopisana do zakładek.",
  egzamin: "Egzamin dopisany do zakładek.",
};

function BadgeStamp({ badge }: { badge: Badge }) {
  return (
    <li
      className={cx(
        "flex min-h-28 flex-col justify-between border-4 border-double p-3",
        badge.earned ? "ink-worn rotate-[-1.5deg] border-red text-red" : "border-rule text-ink-faint",
      )}
    >
      <span className="font-sans text-[0.8rem] font-bold uppercase leading-tight tracking-[0.1em]">{badge.name}</span>
      <span className={cx("font-sans text-[0.8rem] leading-snug", badge.earned ? "text-red/80" : "text-ink-faint")}>
        {badge.earned ? "Przyznano" : badge.hint}
      </span>
    </li>
  );
}

function RemoveButton({ action, fields, label }: { action: (data: FormData) => Promise<void>; fields: Record<string, string>; label: string }) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="label py-2 text-ink-soft transition-colors hover:text-red" aria-label={label}>
        Usuń
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

async function ProfileContent({ searchParams }: { searchParams: PageProps<"/profil">["searchParams"] }) {
  const { supabase, user } = await currentUser();
  if (!user) redirect("/konto?dalej=/profil");
  const params = await searchParams;

  const profile = buildProfile(await loadRecords(supabase, user));
  const earned = profile.badges.filter((badge) => badge.earned).length;
  const voted = CASES.filter((item) => profile.verdicts[item.slug]);
  const agreed = voted.filter((item) => profile.verdicts[item.slug] === item.expert).length;
  const lines = profile.bookmarks.rozmowki.flatMap((item) => {
    const line = decodeLine(item.code);
    return line ? [{ ...item, line }] : [];
  });
  const cards = profile.bookmarks.bingo.flatMap((item) => {
    const card = decodeCard(item.code);
    return card ? [{ ...item, card }] : [];
  });
  const bookmarks = lines.length + cards.length + profile.exams.length;
  const notice = params.zapisano ? "Wynik dopisany do kartoteki." : typeof params.zachowano === "string" ? SAVED_NOTICE[params.zachowano] : null;

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
            ["Kartoteka", profile.nickname || user.email || ""],
            ["Badania", String(profile.results.length)],
            ["Średni wynik", profile.average === null ? "—" : `${profile.average}%`],
            ["Kolekcja", `${profile.collected.size} z ${DIAGNOSABLE.length}`],
            ["Obserwacje", `${profile.observed.size} z ${SPECIES.length}`],
            ["Odznaki", `${earned} z ${profile.badges.length}`],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-rule py-4 pr-4">
              <dt className="label text-ink-soft">{label}</dt>
              <dd className="mt-1 truncate text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
        <nav aria-label="Działy kartoteki" className="label mt-4 flex flex-wrap gap-x-5 gap-y-1 text-ink-soft">
          {[
            ["#kolekcja", "Kolekcja"],
            ["#obserwacje", "Dziennik obserwacji"],
            ["#odznaki", "Odznaki"],
            ["#kartoteka", "Badania"],
            ["#zakladki", "Zakładki"],
            ["#komisja", "Komisja"],
            ["#ustawienia", "Ustawienia"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-red">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <Section
        id="kolekcja"
        title="Kolekcja gatunków"
        aside={`${profile.collected.size} z ${DIAGNOSABLE.length}`}
        intro={typo("Każde rozpoznanie w Teście Dziadersa dopisuje gatunek do kolekcji. Wywiady rodzinne się liczą: Instytut nie pyta, kogo badano.")}
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {DIAGNOSABLE.map((species) => {
            const has = profile.collected.has(species.key);
            return (
              <li key={species.key}>
                <Link href={`/atlas/${species.slug}`} className="group block">
                  <SpeciesPlate species={species.key} className={cx("w-full transition", !has && "opacity-15 grayscale")} />
                  <span className={cx("mt-2 block font-bold leading-tight", has ? "group-hover:text-red" : "text-ink-faint")}>
                    {has ? species.name : "Gatunek nierozpoznany"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section
        id="obserwacje"
        title="Dziennik obserwacji"
        aside={`${profile.observed.size} z ${SPECIES.length} ${plural(SPECIES.length, "gatunku", "gatunków", "gatunków")}`}
        intro={typo(
          "Obserwacje terenowe zgłasza się na stronie gatunku w Atlasie, przyciskiem „Widziałem” przy karcie gatunku. Jedna obserwacja gatunku dziennie. Wesela i Wigilia się liczą.",
        )}
      >
        <ol className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-7 lg:grid-cols-[repeat(14,minmax(0,1fr))]">
          {SPECIES.map((species) => {
            const entry = profile.observed.get(species.key);
            return (
              <li key={species.key}>
                <Link href={`/atlas/${species.slug}#obserwacja`} className="group block" title={species.name}>
                  <SpeciesPlate species={species.key} className={cx("w-full transition", !entry && "opacity-15 grayscale")} />
                  <span className={cx("label mt-1 block text-[0.72rem] leading-tight", entry ? "text-ink" : "text-ink-faint")}>
                    {entry ? `${species.name.replace("Dziaders ", "")} ×${entry.count}` : species.code}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {profile.sightings.length > 0 && (
          <div className="mt-12">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">Ostatnie zgłoszenia</h3>
            <ol>
              {profile.sightings.slice(0, 12).map((sighting) => {
                const species = speciesByKey(sighting.species);
                return (
                  <li
                    key={`${sighting.species}-${sighting.observedOn}`}
                    className="grid grid-cols-[5rem_1fr_auto] items-center gap-x-5 border-b border-rule py-3 md:grid-cols-[7rem_1fr_14rem_auto]"
                  >
                    <span className="label text-ink-soft">{shortDate.format(day(sighting.observedOn))}</span>
                    <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                      {species.name}
                    </Link>
                    <span className="label col-start-2 text-ink-faint md:col-start-3">
                      {sighting.region ? REGIONS[sighting.region]?.name : "Województwo nie podane"}
                    </span>
                    <div className="col-start-3 row-span-2 row-start-1 md:col-start-4 md:row-span-1">
                      <RemoveButton
                        action={removeSighting}
                        fields={{ gatunek: sighting.species, dzien: sighting.observedOn }}
                        label={`Usuń obserwację: ${species.name}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </Section>

      <Section id="odznaki" title="Odznaki" aside={`${earned} z ${profile.badges.length}`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {profile.badges.map((badge) => (
            <BadgeStamp key={badge.key} badge={badge} />
          ))}
        </ul>
      </Section>

      <Section
        id="kartoteka"
        title="Kartoteka badań"
        aside={`${profile.results.length} ${plural(profile.results.length, "wpis", "wpisy", "wpisów")}`}
        intro={typo("Wyniki z testów zrobionych po zalogowaniu dopisują się same. Starsze można dopisać przyciskiem na stronie wyniku.")}
      >
        {profile.results.length === 0 ? (
          <Empty href="/test" cta="Wykonaj test">
            {typo("Kartoteka pusta. Instytut czeka na pierwsze badanie.")}
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
                  <span className="label mt-0.5 block text-ink-soft">
                    {result.proxy ? `Wywiad rodzinny${result.name ? `: ${result.name}` : ""}` : result.name || "Badanie własne"}
                  </span>
                </Link>
                <span className="label col-start-2 text-ink-faint md:col-start-3">{longDate.format(new Date(result.savedAt))}</span>
                <div className="col-start-3 row-span-2 row-start-1 md:col-start-4 md:row-span-1">
                  <RemoveButton action={removeResult} fields={{ kod: result.code }} label={`Usuń wynik ${result.score}% z kartoteki`} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section
        id="zakladki"
        title="Zakładki"
        aside={`${bookmarks} ${plural(bookmarks, "zakładka", "zakładki", "zakładek")}`}
        intro={typo("Wypowiedzi z Rozmówek, wygrane karty bingo i egzaminy terenowe. Przycisk „Zachowaj” jest przy każdym z nich.")}
      >
        {bookmarks === 0 ? (
          <Empty href="/generator" cta="Rozmówki dziaderskie">
            {typo("Na razie pusto. Zacznij od Rozmówek: wypowiedź, która się przyda, warto mieć pod ręką.")}
          </Empty>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            <div>
              <h3 className="label border-b border-ink pb-3 text-ink-soft">Rozmówki · {lines.length}</h3>
              <ul>
                {lines.map(({ code, line }) => (
                  <li key={code} className="grid grid-cols-[1fr_auto] gap-4 border-b border-rule py-4">
                    <Link href={`/generator/${code}`} className="group">
                      <span className="label block text-ink-soft">{line.situation.name}</span>
                      <span className="mt-1 block italic leading-snug group-hover:text-red">„{typo(line.text)}”</span>
                    </Link>
                    <RemoveButton action={removeBookmark} fields={{ rodzaj: "rozmowki", kod: code }} label="Usuń wypowiedź z zakładek" />
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
                      <span className="block font-bold leading-tight group-hover:text-red">
                        {card.occasion.title}, karta {card.number}
                      </span>
                      <span className="label block text-ink-soft">Bingo zgłoszone {longDate.format(new Date(savedAt))}</span>
                    </Link>
                    <RemoveButton action={removeBookmark} fields={{ rodzaj: "bingo", kod: code }} label={`Usuń kartę ${card.number} z zakładek`} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label border-b border-ink pb-3 text-ink-soft">Egzaminy terenowe · {profile.exams.length}</h3>
              <ul>
                {profile.exams.map((exam) => (
                  <li key={exam.code} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-rule py-4">
                    <span className="text-[2rem] font-bold leading-none">{exam.grade.value}</span>
                    <Link href={`/egzamin/${exam.code}`} className="group">
                      <span className="block font-bold leading-tight group-hover:text-red">{exam.grade.title}</span>
                      <span className="label block text-ink-soft">
                        {exam.points} z 12 · {exam.date}
                      </span>
                    </Link>
                    <RemoveButton action={removeBookmark} fields={{ rodzaj: "egzamin", kod: exam.code }} label="Usuń egzamin z zakładek" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Section>

      <Section
        id="komisja"
        title="Komisja Orzekająca"
        aside={`${voted.length} ${plural(voted.length, "orzeczenie", "orzeczenia", "orzeczeń")}`}
        intro={
          voted.length
            ? typo(`Zgodność z Komisją: ${agreed} z ${voted.length}. Ławnik nie musi się zgadzać, ale Komisja to odnotowuje.`)
            : typo("Ławnicy orzekają w sprawach z życia wziętych. Zalogowany ławnik ma swoje orzeczenia w kartotece.")
        }
      >
        {voted.length === 0 ? (
          <Empty href="/czy-to-juz-dziaderstwo" cta="Do Komisji">
            {typo("Brak orzeczeń. Na wokandzie czekają sprawy.")}
          </Empty>
        ) : (
          <ol className="border-t border-ink">
            {voted.map((item) => {
              const mine = VERDICTS.find((verdict) => verdict.key === profile.verdicts[item.slug]);
              const expert = VERDICTS.find((verdict) => verdict.key === item.expert);
              return (
                <li key={item.slug} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[8rem_1fr_12rem_12rem]">
                  <span className="label text-ink-soft">{docket(item)}</span>
                  <Link href={`/czy-to-juz-dziaderstwo/${item.slug}`} className="font-bold leading-tight hover:text-red">
                    {item.title}
                  </Link>
                  <span className="label">Ty: {mine?.short}</span>
                  <span className={cx("label", mine?.key === expert?.key ? "text-ink-soft" : "text-red")}>Komisja: {expert?.short}</span>
                </li>
              );
            })}
          </ol>
        )}
        {profile.submissions.length > 0 && (
          <div className="mt-12">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">Zgłoszone sprawy</h3>
            <ul>
              {profile.submissions.map((submission) => (
                <li key={submission.created_at} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 md:grid-cols-[1fr_12rem]">
                  <span className="leading-snug">{submission.body}</span>
                  <span className="label text-ink-soft md:text-right">
                    {STATUS[submission.status] ?? submission.status} · {longDate.format(new Date(submission.created_at))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section id="ustawienia" title="Ustawienia">
        <div className="grid gap-12 lg:grid-cols-3">
          <form action={saveNickname} className="border-t border-ink pt-5">
            <label htmlFor="pseudonim" className="label text-ink-soft">
              Pseudonim w kartotece
            </label>
            <input
              id="pseudonim"
              name="pseudonim"
              defaultValue={profile.nickname}
              maxLength={24}
              placeholder="np. Zenek"
              className="mt-2 block w-full border-0 border-b-2 border-ink bg-transparent px-0 py-1.5 font-serif text-xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none"
            />
            <button type="submit" className="btn mt-5 border border-ink hover:bg-ink hover:text-paper">
              Zapisz
            </button>
          </form>

          <form action={signOut} className="border-t border-ink pt-5">
            <p className="label text-ink-soft">Zalogowano jako</p>
            <p className="mt-2 truncate text-xl font-bold">{user.email}</p>
            <button type="submit" className="btn mt-5 border border-ink hover:bg-ink hover:text-paper">
              Wyloguj
            </button>
          </form>

          <form action={deleteAccount} className="border-t border-ink pt-5">
            <p className="label text-ink-soft">Usunięcie konta</p>
            <p className="mt-2 leading-snug text-ink-soft">
              {typo(
                "Konto, pseudonim, kartoteka, obserwacje, zakładki i zgłoszone sprawy znikają od razu i na zawsze. Anonimowe wyniki w Narodowym Spisie i głosy w Komisji zostają, bo nie wiadomo, czyje są.",
              )}
            </p>
            <label className="mt-4 flex items-center gap-3 font-sans text-[0.95rem]">
              <input type="checkbox" name="potwierdzam" value="tak" required className="size-5 accent-red" />
              Tak, usuwam konto
            </label>
            {params.usuwanie === "blad" && (
              <p className="mt-2 font-sans text-sm text-red" role="alert">
                Nie udało się usunąć konta. Spróbuj za chwilę.
              </p>
            )}
            <button type="submit" className="btn mt-5 border border-red text-red hover:bg-red hover:text-paper">
              Usuń konto
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}

export default function ProfilePage({ searchParams }: PageProps<"/profil">) {
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Profil Dziaderski" }]}
        title="Profil Dziaderski"
        lead={typo("Kartoteka badań, kolekcja gatunków, dziennik obserwacji terenowych, zakładki i odznaki Instytutu.")}
      />
      {hasAuth ? (
        <Suspense fallback={<p className="wrap label pb-24 pt-12 text-ink-soft">Instytut wyszukuje kartotekę…</p>}>
          <ProfileContent searchParams={searchParams} />
        </Suspense>
      ) : (
        <p className="wrap pb-24 pt-12 text-xl">{typo("Profile są chwilowo nieczynne.")}</p>
      )}
    </main>
  );
}
