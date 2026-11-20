import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { Seal, Wordmark } from "@/components/brand";
import { PrintButton } from "@/components/print-button";
import { CommissionVerdict, DepartmentTable, TeamFacts, TeamRoster } from "@/components/team-report";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { siteCopy } from "@/lib/site";
import { docket, teamReport, TEAM_LIMIT, type TeamGroup } from "@/lib/team";
import { lookupTeam } from "@/lib/team-server";
import { formatDate, typo } from "@/lib/typo";

export const instant = false;

const COPY = defineCopy({
  pl: {
    title: (name: string) => `${name}: raport dla działu kadr`,
    back: "← Wróć do badania zespołu",
    heading: "Raport dla działu kadr",
    lead: "Strona A4 do wydruku albo zapisania jako PDF. Pieczątka jest, podpisy trzeba złożyć ręcznie.",
    print: "Drukuj raport",
    unit: "Pracownia Medycyny Pracy",
    place: (date: string) => `Warszawa, ${date}`,
    sign: (sign: string) => `Sygn. ${sign}`,
    document: "Raport z badania okresowego zespołu",
    to: "Do",
    hr: (name: string) => `Dział Kadr, ${name}`,
    subject: "Dotyczy",
    subjectText: "badania okresowego w zakresie dziaderstwa, formularz IBD-T2",
    examined: "Przebadano",
    examinedText: (count: number) => `${count} z ${TEAM_LIMIT} osób`,
    departments: "I. Zestawienie według działów",
    facts: "II. Ustalenia",
    verdict: "III. Orzeczenie",
    roster: "Załącznik: lista obecności",
    pending: "Komisja Orzekająca wydaje orzeczenie od trzech przebadanych osób. Do tego czasu raport ma charakter informacyjny.",
    signatures: ["Kierownik Pracowni Psychologicznej", "Przewodniczący Komisji Orzekającej", "Przyjęto do akt: Dział Kadr"],
    signature: "data i podpis",
    ring: "KOMISJA ORZEKAJĄCA · INSTYTUT BADAŃ NAD DZIADERSTWEM ·",
    disclaimer: "Dokument satyryczny serwisu dziader.si. Nie jest orzeczeniem lekarskim ani dokumentem w rozumieniu przepisów prawa pracy. Wyniki widzi każdy, kto ma link do badania.",
    unavailable: "Raport chwilowo niedostępny.",
    loading: "Przygotowywanie raportu…",
  },
  sl: {
    title: (name: string) => `${name}: poročilo za kadrovsko službo`,
    back: "← Nazaj na pregled kolektiva",
    heading: "Poročilo za kadrovsko službo",
    lead: "Stran A4 za tisk ali shranitev kot PDF. Žig je, podpise je treba dodati ročno.",
    print: "Natisni poročilo",
    unit: "Laboratorij za medicino dela",
    place: (date: string) => `Varšava, ${date}`,
    sign: (sign: string) => `Opr. št. ${sign}`,
    document: "Poročilo o obdobnem pregledu kolektiva",
    to: "Naslovnik",
    hr: (name: string) => `Kadrovska služba, ${name}`,
    subject: "Zadeva",
    subjectText: "obdobni pregled glede dziaderstva, obrazec IBD-T2",
    examined: "Pregledanih",
    examinedText: (count: number) => `${count} od ${TEAM_LIMIT} oseb`,
    departments: "I. Pregled po oddelkih",
    facts: "II. Ugotovitve",
    verdict: "III. Odločba",
    roster: "Priloga: seznam prisotnih",
    pending: "Razsodna komisija izda odločbo, ko so pregledane vsaj tri osebe. Do takrat je poročilo informativno.",
    signatures: ["Vodja Psihološkega laboratorija", "Predsednik Razsodne komisije", "Prejela v arhiv: kadrovska služba"],
    signature: "datum in podpis",
    ring: "RAZSODNA KOMISIJA · INŠTITUT ZA RAZISKAVE DZIADERSTVA ·",
    disclaimer: "Satirični dokument strani dziader.si. Ni zdravniško spričevalo ne dokument po predpisih delovnega prava. Rezultate vidi vsak, ki ima povezavo do pregleda.",
    unavailable: "Poročilo trenutno ni dosegljivo.",
    loading: "Pripravljanje poročila …",
  },
});

export async function generateMetadata({ params }: PageProps<"/[lang]/zespol/[id]/raport">): Promise<Metadata> {
  const t = COPY[await getLocale()];
  const found = await lookupTeam((await params).id);
  return {
    title: found.status === "team" ? t.title(found.team.name) : t.heading,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

function Sheet({ team, locale }: { team: TeamGroup; locale: Locale }) {
  const t = COPY[locale];
  const report = teamReport(team, locale);
  const count = report.members.length;
  return (
    <article className="mx-auto mt-10 max-w-[210mm] border border-ink bg-card p-[clamp(1.2rem,4vw,14mm)] text-[0.95rem] print:mt-0 print:max-w-none print:border-0 print:bg-transparent print:p-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <Wordmark className="h-7 w-auto" />
          <p className="label mt-2 text-ink-soft">{siteCopy(locale).institute}</p>
          <p className="label text-ink-soft">{t.unit}</p>
        </div>
        <div className="text-right">
          <p className="label text-red">{t.sign(docket(team))}</p>
          <p className="label mt-1 text-ink-soft">{t.place(formatDate(locale, new Date()))}</p>
        </div>
      </header>

      <h2 className="mt-8 text-[clamp(1.6rem,4vw,2.3rem)] font-bold uppercase leading-tight tracking-[0.04em]">{t.document}</h2>
      <dl className="mt-5 grid grid-cols-[7rem_1fr] gap-y-1">
        <dt className="label pt-0.5 text-ink-soft">{t.to}</dt>
        <dd className="font-bold">{t.hr(team.name)}</dd>
        <dt className="label pt-0.5 text-ink-soft">{t.subject}</dt>
        <dd>{t.subjectText}</dd>
        <dt className="label pt-0.5 text-ink-soft">{t.examined}</dt>
        <dd>{t.examinedText(count)}</dd>
      </dl>

      <section className="mt-9 print:break-inside-avoid">
        <h3 className="label border-b border-ink pb-2">{t.departments}</h3>
        <DepartmentTable rows={report.rows} locale={locale} print />
      </section>

      {count >= 2 && (
        <section className="mt-9 print:break-inside-avoid">
          <h3 className="label mb-4 border-b border-ink pb-2">{t.facts}</h3>
          <TeamFacts report={report} locale={locale} />
        </section>
      )}

      <section className="mt-9 print:break-inside-avoid">
        <h3 className="label mb-4 border-b border-ink pb-2">{t.verdict}</h3>
        {report.verdict && count >= 3 ? <CommissionVerdict verdict={report.verdict} locale={locale} heading="h4" compact /> : <p>{typo(t.pending)}</p>}
      </section>

      <footer className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 print:grid-cols-3 print:break-inside-avoid">
        {t.signatures.map((role, i) => (
          <div key={role} className="relative pt-14">
            {i === 1 && <Seal locale={locale} ring={t.ring} className="pointer-events-none absolute -top-6 left-1/2 size-32 -translate-x-1/2 rotate-[-12deg] text-red opacity-90" />}
            <div className="border-t border-dotted border-ink pt-2">
              <p className="label text-ink-faint">{t.signature}</p>
              <p className="mt-1 font-sans text-[0.85rem] font-semibold leading-snug">{role}</p>
            </div>
          </div>
        ))}
      </footer>

      <section className="mt-12 print:break-before-page">
        <h3 className="label mb-2 border-b border-ink pb-2">{t.roster}</h3>
        <TeamRoster members={report.order} departments={team.departments} locale={locale} links={false} />
      </section>

      <p className="label mt-8 text-ink-faint">{t.disclaimer}</p>
    </article>
  );
}

async function Report({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const locale = await getLocale();
  const t = COPY[locale];
  const { id } = await params;
  const found = await lookupTeam(id);
  if (found.status === "family") redirect(localizePath(`/grupy/${id}`, locale));
  if (found.status === "missing") notFound();
  if (found.status === "unavailable") return <p className="py-16 text-2xl font-bold">{t.unavailable}</p>;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 print:hidden">
        <div>
          <p className="label text-ink-soft"><Link href={`/zespol/${id}`} className="link">{t.back}</Link></p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.02em]">{t.heading}</h1>
          <p className="mt-3 max-w-xl text-ink-soft">{typo(t.lead)}</p>
        </div>
        <PrintButton label={t.print} kind="raport zespołu" />
      </div>
      <Sheet team={found.team} locale={locale} />
    </>
  );
}

export default async function TeamReportPage({ params }: PageProps<"/[lang]/zespol/[id]/raport">) {
  const t = COPY[await getLocale()];
  return (
    <main id="tresc" className="wrap pb-20 pt-8 md:pt-12 print:max-w-none print:p-0">
      <Suspense fallback={<p className="py-16" role="status">{t.loading}</p>}>
        <Report params={params} />
      </Suspense>
    </main>
  );
}
