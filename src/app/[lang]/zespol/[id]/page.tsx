import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { TeamCheckup } from "@/components/team";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { site } from "@/lib/site";
import { teamReport, TEAM_LIMIT } from "@/lib/team";
import { lookupTeam } from "@/lib/team-server";

// Private, live and per link: resolved at request time, like the family rankings.
export const instant = false;

const COPY = defineCopy({
  pl: {
    title: "Badanie okresowe zespołu",
    named: (name: string) => `${name}: badanie okresowe zespołu`,
    waiting: "Skierowanie wystawione. Zrób Test Dziadersa i dołącz do zespołu.",
    summary: (count: number, average: number, stamp: string | null) =>
      `Przebadano ${count} z ${TEAM_LIMIT} osób. Średni poziom dziaderstwa: ${average}%.${stamp ? ` Orzeczenie Komisji: ${stamp}.` : ""} Zrób test i dołącz.`,
    alt: (name: string) => `${name}: wyniki badania okresowego zespołu`,
    examined: "Przebadano",
    average: "Średni wynik",
    of: (count: number) => `${count} z ${TEAM_LIMIT}`,
    unavailable: "Badanie chwilowo niedostępne.",
    retry: "Spróbuj ponownie za chwilę. Link zespołu pozostaje ten sam.",
    loading: "Otwieranie badania zespołu…",
  },
  sl: {
    title: "Obdobni pregled kolektiva",
    named: (name: string) => `${name}: obdobni pregled kolektiva`,
    waiting: "Napotnica je izdana. Opravi test dziadersa in se pridruži kolektivu.",
    summary: (count: number, average: number, stamp: string | null) =>
      `Pregledanih ${count} od ${TEAM_LIMIT} oseb. Povprečna raven dziaderstva: ${average} %.${stamp ? ` Odločba Komisije: ${stamp}.` : ""} Opravi test in se pridruži.`,
    alt: (name: string) => `${name}: izvidi obdobnega pregleda kolektiva`,
    examined: "Pregledanih",
    average: "Povprečni rezultat",
    of: (count: number) => `${count} od ${TEAM_LIMIT}`,
    unavailable: "Pregled trenutno ni dosegljiv.",
    retry: "Poskusi znova čez trenutek. Povezava do kolektiva ostane enaka.",
    loading: "Odpiranje pregleda kolektiva …",
  },
});

/**
 * The link preview in Slack and Microsoft Teams: both read og:title, og:description and og:image
 * (Slackbot and Teams' SkypeUriPreview get blocking metadata, see htmlLimitedBots). Slack also
 * shows twitter:label1/data1 pairs under the description. The image URL carries the member count,
 * so a new member makes a new preview instead of the cached one.
 */
export async function generateMetadata({ params }: PageProps<"/[lang]/zespol/[id]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const { id } = await params;
  const found = await lookupTeam(id);
  const base = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };
  if (found.status !== "team") return { title: t.title, ...base };
  const { team } = found;
  const report = teamReport(team, locale);
  const count = report.members.length;
  const title = t.named(team.name);
  const description = count ? t.summary(count, report.average, report.verdict?.stamp ?? null) : t.waiting;
  const path = localizePath(`/zespol/${team.id}`, locale);
  const image = { url: `${localizePath(`/zespol/${team.id}/podglad`, locale)}?n=${count}`, width: 1200, height: 630, alt: t.alt(team.name) };
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    ...base,
    openGraph: { type: "website", siteName: site.name, locale: LOCALE_INFO[locale].og, url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    other: count
      ? { "twitter:label1": t.examined, "twitter:data1": t.of(count), "twitter:label2": t.average, "twitter:data2": `${report.average}${locale === "sl" ? " %" : "%"}` }
      : {},
  };
}

async function Checkup({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const locale = await getLocale();
  const { id } = await params;
  const found = await lookupTeam(id);
  if (found.status === "family") redirect(localizePath(`/grupy/${id}`, locale));
  if (found.status === "missing") notFound();
  if (found.status === "unavailable") {
    const t = COPY[locale];
    return <div className="wrap py-16"><h1 className="text-4xl font-bold">{t.unavailable}</h1><p className="mt-4">{t.retry}</p></div>;
  }
  return <TeamCheckup initial={found.team} />;
}

export default async function TeamPage({ params }: PageProps<"/[lang]/zespol/[id]">) {
  const t = COPY[await getLocale()];
  return <main id="tresc"><Suspense fallback={<p className="wrap py-16" role="status">{t.loading}</p>}><Checkup params={params} /></Suspense></main>;
}
