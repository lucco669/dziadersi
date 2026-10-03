import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Stamp } from "@/components/brand";
import { Tally } from "@/components/crowd";
import { PageHeader, Section } from "@/components/page";
import { Figure, INK, PAPER, SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getVerdicts } from "@/content/test";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import {
  compatibilityNote,
  dominantSpecies,
  loadGroup,
  pairs,
  ranked,
  SAMPLE_GROUP,
  sharedFindings,
  type Member,
} from "@/lib/group";
import { pageMetadata } from "@/lib/seo";
import { compatibility, GROUP_LIMIT } from "@/lib/test";
import { cx, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    duel: (a: string, b: string) => `${a} kontra ${b}`,
    ranking: "Ranking dziaderstwa",
    entry: (label: string, score: number) => `${label} ${score}%`,
    description: (top: string) => `Ranking Testu Dziadersa: ${top}. Zrób test i dopisz się do listy.`,
    test: "Test Dziadersa",
    crumb: "Ranking",
    alone: (label: string, score: number) =>
      `Na razie jedna osoba: ${label}, ${score}%. Wyślij link znajomym. Każdy, kto zrobi test z tego linku, dopisze się do listy.`,
    group: (count: number, average: number, zone: string) =>
      `${count} ${plural(count, "osoba zbadana", "osoby zbadane", "osób zbadanych")} w Teście Dziadersa. Średnia grupy: ${average}%, ${zone}.`,
    order: (label: string) => `Kolejność według wyniku. Najnowszy wpis: ${label}.`,
    list: "Lista",
    places: (count: number, limit: number) => `${count} z ${limit} miejsc`,
    newest: "Nowy wpis",
    proxy: "wywiad rodzinny",
    fullTitle: "Ranking pełny.",
    joinTitle: "Dopisz się do listy.",
    fullText: (limit: number) => `W rankingu jest już ${limit} osób. Zrób test i załóż nowy, z własnym wynikiem na górze.`,
    joinText: "Zrób test z tego linku, a wynik trafi na listę. Potem wyślij dalej nowy link: będzie już z tobą.",
    share: (top: string) => `Ranking dziaderstwa: ${top}. A ty?`,
    takeTest: "Wykonaj test",
    join: "Dołącz do rankingu",
    duelLabel: "Pojedynek",
    compatibility: "Zgodność dziaderska",
    leader: (label: string, gap: number) =>
      `Większym dziadersem jest ${label}: o ${gap} ${plural(gap, "punkt procentowy", "punkty procentowe", "punktów procentowych")}.`,
    tie: "Remis. Instytut nie rozstrzyga sporów rodzinnych.",
    shared: "Wspólne objawy",
    dominant: "Gatunek dominujący",
    inGroup: (count: number) => `${count} ${plural(count, "osoba", "osoby", "osób")} w grupie`,
    none: "Brak",
    everyone: "Każdy w grupie jest dziadersem na swój sposób.",
    best: "Najbardziej zgodna para",
    worst: "Najmniej zgodna para",
    pair: (a: string, b: string) => `${a} i ${b}`,
    percent: (value: number) => `${value}%`,
    apart: "Nie sadzać obok siebie.",
  },
  sl: {
    duel: (a: string, b: string) => `${a} – ${b}`,
    ranking: "Lestvica dziaderstva",
    entry: (label: string, score: number) => `${label} ${score} %`,
    description: (top: string) => `Lestvica testa dziadersa: ${top}. Opravi test in se vpiši na seznam.`,
    test: "Test dziadersa",
    crumb: "Lestvica",
    alone: (label: string, score: number) =>
      `Zaenkrat ena oseba: ${label}, ${score} %. Pošlji povezavo prijateljem. Vsak, ki opravi test prek te povezave, se vpiše na seznam.`,
    group: (count: number, average: number, zone: string) =>
      `${count} ${pluralSl(count, "preiskovana oseba", "preiskovani osebi", "preiskovane osebe", "preiskovanih oseb")} na testu dziadersa. Povprečje skupine: ${average} %, ${zone}.`,
    order: (label: string) => `Razvrščeno po rezultatu. Najnovejši vpis: ${label}.`,
    list: "Seznam",
    places: (count: number, limit: number) => `${count} od ${limit} mest`,
    newest: "Nov vpis",
    proxy: "heteroanamneza",
    fullTitle: "Lestvica je polna.",
    joinTitle: "Vpiši se na seznam.",
    fullText: (limit: number) => `Na lestvici je že ${limit} oseb. Opravi test in odpri novo, s svojim rezultatom na vrhu.`,
    joinText: "Opravi test prek te povezave in rezultat bo na seznamu. Nato pošlji naprej novo povezavo: v njej boš že ti.",
    share: (top: string) => `Lestvica dziaderstva: ${top}. Pa ti?`,
    takeTest: "Opravi test",
    join: "Pridruži se lestvici",
    duelLabel: "Dvoboj",
    compatibility: "Dziaderska združljivost",
    leader: (label: string, gap: number) =>
      `Večji dziaders je ${label}: za ${gap} ${pluralSl(gap, "odstotno točko", "odstotni točki", "odstotne točke", "odstotnih točk")}.`,
    tie: "Neodločeno. Inštitut ne razsoja v družinskih sporih.",
    shared: "Skupni simptomi",
    dominant: "Prevladujoča vrsta",
    inGroup: (count: number) => `${count} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")} v skupini`,
    none: "Nobena",
    everyone: "Vsak v skupini je dziaders po svoje.",
    best: "Najbolj združljiv par",
    worst: "Najmanj združljiv par",
    pair: (a: string, b: string) => `${a} in ${b}`,
    percent: (value: number) => `${value} %`,
    apart: "Pri mizi ne posaditi skupaj.",
  },
});

// A ranking renders in one pass: the URL holds every result in it.
export const instant = false;

export function generateStaticParams() {
  return [{ lista: SAMPLE_GROUP }];
}

const pad = (value: number) => String(value).padStart(2, "0");

function heading(members: Member[], locale: Locale) {
  const t = COPY[locale];
  if (members.length === 2) return t.duel(members[0].label, members[1].label);
  return t.ranking;
}

/** The first three of a ranking, for descriptions and share texts. */
const top = (members: Member[], locale: Locale) =>
  ranked(members)
    .slice(0, 3)
    .map((member) => COPY[locale].entry(member.label, member.result.score))
    .join(", ");

export async function generateMetadata({ params }: PageProps<"/[lang]/grupa/[lista]">): Promise<Metadata> {
  const locale = await getLocale();
  const group = loadGroup((await params).lista, locale);
  if (!group) return {};
  return pageMetadata(locale, {
    title: heading(group.members, locale),
    description: COPY[locale].description(top(group.members, locale)),
    path: `/grupa/${group.normalized}`,
    noindex: true,
  });
}

export default async function GroupPage({ params }: PageProps<"/[lang]/grupa/[lista]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const group = loadGroup((await params).lista, locale);
  if (!group) notFound();
  if (group.requested !== group.normalized) redirect(localizePath(`/grupa/${group.normalized}`, locale));

  const { members, normalized } = group;
  const order = ranked(members);
  const newest = members[members.length - 1];
  const average = Math.round(members.reduce((sum, member) => sum + member.result.score, 0) / members.length);
  const verdicts = getVerdicts(locale);
  const zone = verdicts.findLast((verdict) => average >= verdict.from) ?? verdicts[0];
  const full = members.length >= GROUP_LIMIT;
  const path = `/grupa/${normalized}`;

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.test, href: "/test" }, { label: t.crumb }]}
        title={heading(members, locale)}
        lead={typo(
          members.length === 1
            ? t.alone(members[0].label, members[0].result.score)
            : t.group(members.length, average, zone.title.toLowerCase()),
        )}
        meta={t.order(newest.label)}
      />

      {members.length === 2 && <Duel a={members[0]} b={members[1]} locale={locale} />}

      <Section id="lista" title={t.list} aside={t.places(members.length, GROUP_LIMIT)}>
        <ol className="border-t border-ink">
          {order.map((member, i) => (
            <li key={member.result.code}>
              <Link
                href={`/wynik/${member.result.code}`}
                className="group grid grid-cols-[2.4rem_4.5rem_1fr_auto] items-center gap-x-4 border-b border-rule py-4 md:grid-cols-[3rem_6rem_minmax(0,1fr)_14rem_6rem] md:gap-x-6"
              >
                <span className="font-sans text-[0.95rem] font-semibold text-red">{pad(i + 1)}</span>
                {member.result.diagnosis.species[0] ? (
                  <SpeciesPlate species={member.result.diagnosis.species[0].key} className="w-full" />
                ) : (
                  <svg viewBox="-40 0 120 100" className="w-full" aria-hidden="true">
                    <Figure />
                  </svg>
                )}
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[1.45rem] font-bold leading-tight transition-colors group-hover:text-red">{member.label}</span>
                    {member === newest && members.length > 1 && <Stamp className="text-[0.62rem] [--stamp-rotate:-4deg]">{t.newest}</Stamp>}
                    {member.result.proxy && <span className="label text-ink-faint">{t.proxy}</span>}
                  </span>
                  <span className="label mt-1 block text-ink-soft">{member.result.diagnosis.name}</span>
                </span>
                <Tally percent={member.result.score} locale={locale} className="hidden w-full md:block" />
                <span className="text-right text-[2rem] font-bold leading-none tabular-nums">
                  {member.result.score}
                  <span className="text-[0.5em]">%</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {members.length >= 3 && <GroupFacts members={members} locale={locale} />}
      </Section>

      <section aria-labelledby="dolacz" className="bg-ink text-paper">
        <div className="wrap flex flex-col gap-10 py-16 md:flex-row md:items-center md:py-20">
          <svg viewBox="-2 -1 56 97" className="hidden h-40 shrink-0 md:block" aria-hidden="true">
            <Figure color={PAPER} cutout={INK} right="point" />
          </svg>
          <div className="flex-1">
            <h2 id="dolacz" className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
              {full ? t.fullTitle : t.joinTitle}
            </h2>
            <p className="mt-4 max-w-xl text-paper/75">{typo(full ? t.fullText(GROUP_LIMIT) : t.joinText)}</p>
            <div className="mt-6">
              <ShareBar path={path} text={t.share(top(members, locale))} kind="ranking" tone="paper" />
            </div>
          </div>
          <Link
            href={full ? "/test" : `/test?grupa=${normalized}`}
            className="btn self-start bg-paper text-ink hover:bg-red hover:text-paper md:self-center"
          >
            {full ? t.takeTest : t.join} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function Duel({ a, b, locale }: { a: Member; b: Member; locale: Locale }) {
  const t = COPY[locale];
  const value = compatibility(a.result, b.result);
  const gap = a.result.score - b.result.score;
  const shared = sharedFindings(a.result, b.result);
  const leader = gap === 0 ? null : gap > 0 ? a : b;

  return (
    <section aria-label={t.duelLabel} className="wrap pb-6 pt-14 md:pt-20">
      <div className="grid items-end gap-10 border-t border-ink pt-8 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        {[a, b].map((member, i) => (
          <div key={member.result.code} className={i === 0 ? "md:order-1" : "md:order-3 md:text-right"}>
            {member.result.diagnosis.species[0] ? (
              <SpeciesPlate
                species={member.result.diagnosis.species[0].key}
                animated={member === leader}
                className={cx("w-full max-w-64", i === 1 && "md:ml-auto md:-scale-x-100")}
              />
            ) : (
              <svg viewBox="-40 0 120 100" className={cx("w-full max-w-64", i === 1 && "md:ml-auto")} aria-hidden="true">
                <Figure />
              </svg>
            )}
            <p className="label mt-4 text-ink-soft">{member.result.diagnosis.name}</p>
            <p className="mt-1 text-[1.8rem] font-bold leading-tight">{member.label}</p>
            <p className={cx("mt-1 text-[clamp(4.5rem,11vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums", member === leader && "text-red")}>
              {member.result.score}
              <span className="text-[0.4em]">%</span>
            </p>
          </div>
        ))}
        <div className="text-center md:order-2 md:pb-4">
          <p className="label text-ink-soft">{t.compatibility}</p>
          <p className="mt-1 text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tabular-nums">{value}%</p>
          <p className="mx-auto mt-3 max-w-[16rem] text-[1rem] italic leading-snug text-ink-soft">{typo(compatibilityNote(value, locale))}</p>
        </div>
      </div>
      <p className="mt-8 max-w-2xl text-xl leading-snug">{typo(leader ? t.leader(leader.label, Math.abs(gap)) : t.tie)}</p>
      {shared.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="label border-b border-ink pb-3 text-ink-soft">{t.shared}</h2>
          <ul>
            {shared.slice(0, 5).map((finding) => (
              <li key={finding.number} className="grid gap-x-6 gap-y-1 border-b border-rule py-3 md:grid-cols-[10rem_1fr]">
                <span className="label text-ink-soft">{finding.section}</span>
                <span className="text-lg italic leading-snug">{typo(finding.answer)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function GroupFacts({ members, locale }: { members: Member[]; locale: Locale }) {
  const t = COPY[locale];
  const { best, worst } = pairs(members);
  const dominant = dominantSpecies(members);
  const facts = [
    dominant && dominant.count >= 2
      ? { label: t.dominant, value: dominant.species.name, note: t.inGroup(dominant.count) }
      : { label: t.dominant, value: t.none, note: t.everyone },
    best && { label: t.best, value: t.pair(best.a.label, best.b.label), note: `${t.percent(best.value)}. ${compatibilityNote(best.value, locale)}` },
    worst &&
      worst !== best && {
        label: t.worst,
        value: t.pair(worst.a.label, worst.b.label),
        note: `${t.percent(worst.value)}. ${t.apart}`,
      },
  ].filter((fact): fact is { label: string; value: string; note: string } => Boolean(fact));

  return (
    <dl className="mt-12 grid gap-8 md:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="border-t border-ink pt-4">
          <dt className="label text-ink-soft">{fact.label}</dt>
          <dd className="mt-2 text-2xl font-bold leading-tight">{fact.value}</dd>
          <dd className="mt-2 font-sans text-[0.92rem] leading-snug text-ink-soft">{typo(fact.note)}</dd>
        </div>
      ))}
    </dl>
  );
}
