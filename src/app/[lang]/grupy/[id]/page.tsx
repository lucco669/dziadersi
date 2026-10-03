import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { FamilyRanking } from "@/components/family-group";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { getFamily } from "@/lib/family-server";

// Private rankings resolve at request time, like the existing URL-based rankings.
export const instant = false;

const COPY = defineCopy({
  pl: {
    title: "Ranking rodzinny",
    description: "Wspólny ranking Testu Dziadersa. Zrób test i dołącz do rodziny.",
    unavailable: "Ranking chwilowo niedostępny.",
    retry: "Spróbuj ponownie za chwilę. Link do rodziny pozostaje ten sam.",
    loading: "Otwieranie rankingu rodzinnego…",
  },
  sl: {
    title: "Družinska lestvica",
    description: "Skupna lestvica testa dziadersa. Opravi test in se pridruži družini.",
    unavailable: "Lestvica trenutno ni dosegljiva.",
    retry: "Poskusi znova čez trenutek. Povezava do družine ostane enaka.",
    loading: "Odpiranje družinske lestvice …",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = COPY[await getLocale()];
  return { title: t.title, description: t.description, robots: { index: false, follow: false }, referrer: "no-referrer" };
}

async function Ranking({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  let group;
  try { group = await getFamily(id); } catch {
    const t = COPY[await getLocale()];
    return <div className="wrap py-16"><h1 className="text-4xl font-bold">{t.unavailable}</h1><p className="mt-4">{t.retry}</p></div>;
  }
  if (!group) notFound();
  return <FamilyRanking initial={group} />;
}

export default async function FamilyPage({ params }: PageProps<"/[lang]/grupy/[id]">) {
  const t = COPY[await getLocale()];
  return <main id="tresc"><Suspense fallback={<p className="wrap py-16" role="status">{t.loading}</p>}><Ranking params={params} /></Suspense></main>;
}
