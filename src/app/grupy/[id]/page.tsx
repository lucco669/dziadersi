import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { FamilyRanking } from "@/components/family-group";
import { getFamily } from "@/lib/family-server";

// Private rankings resolve at request time, like the existing URL-based rankings.
export const instant = false;

export const metadata: Metadata = { title: "Ranking rodzinny", description: "Wspólny ranking Testu Dziadersa. Zrób test i dołącz do rodziny.", robots: { index: false, follow: false }, referrer: "no-referrer" };

async function Ranking({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  let group;
  try { group = await getFamily(id); } catch {
    return <div className="wrap py-16"><h1 className="text-4xl font-bold">Ranking chwilowo niedostępny.</h1><p className="mt-4">Spróbuj ponownie za chwilę. Link do rodziny pozostaje ten sam.</p></div>;
  }
  if (!group) notFound();
  return <FamilyRanking initial={group} />;
}

export default function FamilyPage({ params }: { params: Promise<{ id: string }> }) {
  return <main id="tresc"><Suspense fallback={<p className="wrap py-16" role="status">Otwieranie rankingu rodzinnego…</p>}><Ranking params={params} /></Suspense></main>;
}
