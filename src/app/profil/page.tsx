import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { pageMetadata } from "@/lib/seo";
import { buildProfile, type Badge } from "@/lib/profile";
import { hasAuth } from "@/lib/supabase/config";
import { currentUser } from "@/lib/supabase/server";
import { DIAGNOSABLE } from "@/lib/test";
import { cx, plural, typo } from "@/lib/typo";
import { deleteAccount, removeResult, saveNickname, signOut } from "./actions";

export const metadata: Metadata = pageMetadata({
  title: "Profil Dziaderski",
  description: "Zapisane wyniki Testu Dziadersa, kolekcja rozpoznanych gatunków i odznaki Instytutu.",
  path: "/profil",
  noindex: true,
});

const savedAt = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Warsaw" });

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

async function ProfileContent({ searchParams }: { searchParams: PageProps<"/profil">["searchParams"] }) {
  const { supabase, user } = await currentUser();
  if (!user) redirect("/konto?dalej=/profil");
  const params = await searchParams;

  const [{ data: profileRow }, { data: savedRows }] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id", user.id).maybeSingle(),
    supabase.from("saved_results").select("code, saved_at").order("saved_at", { ascending: false }),
  ]);
  const profile = buildProfile(savedRows ?? []);
  const nickname = profileRow?.nickname ?? "";
  const earned = profile.badges.filter((badge) => badge.earned).length;

  return (
    <>
      <section className="wrap pt-10">
        {params.zapisano && (
          <p className="mb-8 border-l-2 border-red pl-4 font-sans text-[0.95rem] text-red" role="status">
            Wynik dopisany do kartoteki.
          </p>
        )}
        <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-4">
          {[
            ["Kartoteka", nickname || user.email || ""],
            ["Badania", String(profile.results.length)],
            ["Średni wynik", profile.average === null ? "—" : `${profile.average}%`],
            ["Gatunki", `${profile.collected.size} z ${DIAGNOSABLE.length}`],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-rule py-4 pr-4">
              <dt className="label text-ink-soft">{label}</dt>
              <dd className="mt-1 truncate text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        id="kolekcja"
        title="Kolekcja gatunków"
        aside={`${profile.collected.size} z ${DIAGNOSABLE.length}`}
        intro={typo("Każde rozpoznanie dopisuje gatunek do kolekcji. Wywiady rodzinne się liczą: Instytut nie pyta, kogo badano.")}
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

      <Section id="odznaki" title="Odznaki" aside={`${earned} z ${profile.badges.length}`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
          <div className="border-t border-ink pt-6">
            <p className="max-w-xl text-xl leading-snug">{typo("Kartoteka pusta. Instytut czeka na pierwsze badanie.")}</p>
            <Link href="/test" className="btn mt-6 bg-ink text-paper hover:bg-red">
              Wykonaj test <span aria-hidden="true">→</span>
            </Link>
          </div>
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
                <span className="label col-start-2 text-ink-faint md:col-start-3">{savedAt.format(new Date(result.savedAt))}</span>
                <form action={removeResult} className="col-start-3 row-span-2 row-start-1 md:col-start-4 md:row-span-1">
                  <input type="hidden" name="kod" value={result.code} />
                  <button type="submit" className="label py-2 text-ink-soft transition-colors hover:text-red" aria-label={`Usuń wynik ${result.score}% z kartoteki`}>
                    Usuń
                  </button>
                </form>
              </li>
            ))}
          </ol>
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
              defaultValue={nickname}
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
              {typo("Konto, pseudonim i kartoteka znikają od razu i na zawsze. Anonimowe wyniki w Narodowym Spisie zostają, bo nie wiadomo, czyje są.")}
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
        lead={typo("Kartoteka badań, kolekcja rozpoznanych gatunków i odznaki Instytutu.")}
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
