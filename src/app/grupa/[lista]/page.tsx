import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Stamp } from "@/components/brand";
import { Tally } from "@/components/crowd";
import { PageHeader, Section } from "@/components/page";
import { Figure, INK, PAPER, SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { VERDICTS } from "@/content/test";
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
import { cx, plural, typo } from "@/lib/typo";

// A ranking renders in one pass: the URL holds every result in it.
export const instant = false;

export function generateStaticParams() {
  return [{ lista: SAMPLE_GROUP }];
}

const pad = (value: number) => String(value).padStart(2, "0");

function heading(members: Member[]) {
  if (members.length === 2) return `${members[0].label} kontra ${members[1].label}`;
  return "Ranking dziaderstwa";
}

export async function generateMetadata({ params }: PageProps<"/grupa/[lista]">): Promise<Metadata> {
  const group = loadGroup((await params).lista);
  if (!group) return {};
  const top = ranked(group.members)
    .slice(0, 3)
    .map((member) => `${member.label} ${member.result.score}%`)
    .join(", ");
  return pageMetadata({
    title: heading(group.members),
    description: `Ranking Testu Dziadersa: ${top}. Zrób test i dopisz się do listy.`,
    path: `/grupa/${group.normalized}`,
    noindex: true,
  });
}

export default async function GroupPage({ params }: PageProps<"/grupa/[lista]">) {
  const group = loadGroup((await params).lista);
  if (!group) notFound();
  if (group.requested !== group.normalized) redirect(`/grupa/${group.normalized}`);

  const { members, normalized } = group;
  const order = ranked(members);
  const newest = members[members.length - 1];
  const average = Math.round(members.reduce((sum, member) => sum + member.result.score, 0) / members.length);
  const zone = VERDICTS.findLast((verdict) => average >= verdict.from) ?? VERDICTS[0];
  const full = members.length >= GROUP_LIMIT;
  const path = `/grupa/${normalized}`;

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Test Dziadersa", href: "/test" }, { label: "Ranking" }]}
        title={heading(members)}
        lead={typo(
          members.length === 1
            ? `Na razie jedna osoba: ${members[0].label}, ${members[0].result.score}%. Wyślij link znajomym. Każdy, kto zrobi test z tego linku, dopisze się do listy.`
            : `${members.length} ${plural(members.length, "osoba zbadana", "osoby zbadane", "osób zbadanych")} w Teście Dziadersa. Średnia grupy: ${average}%, ${zone.title.toLowerCase()}.`,
        )}
        meta={`Kolejność według wyniku. Najnowszy wpis: ${newest.label}.`}
      />

      {members.length === 2 && <Duel a={members[0]} b={members[1]} />}

      <Section id="lista" title="Lista" aside={`${members.length} z ${GROUP_LIMIT} miejsc`}>
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
                    {member === newest && members.length > 1 && <Stamp className="text-[0.62rem] [--stamp-rotate:-4deg]">Nowy wpis</Stamp>}
                    {member.result.proxy && <span className="label text-ink-faint">wywiad rodzinny</span>}
                  </span>
                  <span className="label mt-1 block text-ink-soft">{member.result.diagnosis.name}</span>
                </span>
                <Tally percent={member.result.score} className="hidden w-full md:block" />
                <span className="text-right text-[2rem] font-bold leading-none tabular-nums">
                  {member.result.score}
                  <span className="text-[0.5em]">%</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {members.length >= 3 && <GroupFacts members={members} />}
      </Section>

      <section aria-labelledby="dolacz" className="bg-ink text-paper">
        <div className="wrap flex flex-col gap-10 py-16 md:flex-row md:items-center md:py-20">
          <svg viewBox="-2 -1 56 97" className="hidden h-40 shrink-0 md:block" aria-hidden="true">
            <Figure color={PAPER} cutout={INK} right="point" />
          </svg>
          <div className="flex-1">
            <h2 id="dolacz" className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
              {full ? "Ranking pełny." : "Dopisz się do listy."}
            </h2>
            <p className="mt-4 max-w-xl text-paper/75">
              {typo(
                full
                  ? `W rankingu jest już ${GROUP_LIMIT} osób. Zrób test i załóż nowy, z własnym wynikiem na górze.`
                  : "Zrób test z tego linku, a wynik trafi na listę. Potem wyślij dalej nowy link: będzie już z tobą.",
              )}
            </p>
            <div className="mt-6">
              <ShareBar
                path={path}
                text={`Ranking dziaderstwa: ${order
                  .slice(0, 3)
                  .map((member) => `${member.label} ${member.result.score}%`)
                  .join(", ")}. A ty?`}
                kind="ranking"
                tone="paper"
              />
            </div>
          </div>
          <Link
            href={full ? "/test" : `/test?grupa=${normalized}`}
            className="btn self-start bg-paper text-ink hover:bg-red hover:text-paper md:self-center"
          >
            {full ? "Wykonaj test" : "Dołącz do rankingu"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function Duel({ a, b }: { a: Member; b: Member }) {
  const value = compatibility(a.result, b.result);
  const gap = a.result.score - b.result.score;
  const shared = sharedFindings(a.result, b.result);
  const leader = gap === 0 ? null : gap > 0 ? a : b;

  return (
    <section aria-label="Pojedynek" className="wrap pb-6 pt-14 md:pt-20">
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
          <p className="label text-ink-soft">Zgodność dziaderska</p>
          <p className="mt-1 text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tabular-nums">{value}%</p>
          <p className="mx-auto mt-3 max-w-[16rem] text-[1rem] italic leading-snug text-ink-soft">{typo(compatibilityNote(value))}</p>
        </div>
      </div>
      <p className="mt-8 max-w-2xl text-xl leading-snug">
        {typo(
          leader
            ? `Większym dziadersem jest ${leader.label}: o ${Math.abs(gap)} ${plural(Math.abs(gap), "punkt procentowy", "punkty procentowe", "punktów procentowych")}.`
            : "Remis. Instytut nie rozstrzyga sporów rodzinnych.",
        )}
      </p>
      {shared.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="label border-b border-ink pb-3 text-ink-soft">Wspólne objawy</h2>
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

function GroupFacts({ members }: { members: Member[] }) {
  const { best, worst } = pairs(members);
  const dominant = dominantSpecies(members);
  const facts = [
    dominant && dominant.count >= 2
      ? {
          label: "Gatunek dominujący",
          value: dominant.species.name,
          note: `${dominant.count} ${plural(dominant.count, "osoba", "osoby", "osób")} w grupie`,
        }
      : { label: "Gatunek dominujący", value: "Brak", note: "Każdy w grupie jest dziadersem na swój sposób." },
    best && { label: "Najbardziej zgodna para", value: `${best.a.label} i ${best.b.label}`, note: `${best.value}%. ${compatibilityNote(best.value)}` },
    worst &&
      worst !== best && {
        label: "Najmniej zgodna para",
        value: `${worst.a.label} i ${worst.b.label}`,
        note: `${worst.value}%. Nie sadzać obok siebie.`,
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
