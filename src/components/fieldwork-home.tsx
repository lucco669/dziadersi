import { getDossiers } from "@/content/dossiers";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { warsawTime } from "@/lib/calendar";
import { MuseumDrawing } from "./museum-drawing";
import { MenuIcon } from "./menu-icons";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: {
    title: "Zbiory do użytku rodzinnego",
    first: "Pierwsza wizyta?",
    guide: "Dziaders — kto to jest?",
    field: "Przewodnik terenowy",
    open: "Otwórz przewodnik",
    museum: "Nie wyrzucać.",
    museumText: "Sześć eksponatów, które jeszcze się przydadzą. Otwórz szufladę.",
    museumLink: "Muzeum rzeczy",
    print: "Weź na papierze.",
    printText: "Bingo, karty gatunków i kieszonkowy przewodnik. Gotowe arkusze A4.",
    printLink: "Materiały do druku",
  },
  sl: {
    title: "Zbirke za družinsko uporabo",
    first: "Prvi obisk?",
    guide: "Dziaders — kdo je to?",
    field: "Terenski vodnik",
    open: "Odpri vodnik",
    museum: "Ne zavrzi.",
    museumText: "Šest eksponatov, ki bodo še prišli prav. Odpri predal.",
    museumLink: "Muzej stvari",
    print: "Vzemi na papirju.",
    printText: "Bingo, kartice vrst in žepni vodnik. Pripravljene strani A4.",
    printLink: "Gradivo za tisk",
  },
});

export function FieldworkHome({ locale, updated }: { locale: Locale; updated: string }) {
  const t = COPY[locale];
  const month = warsawTime(new Date(updated)).month;
  const code = month >= 10 || month <= 2 ? "IBD-O 01" : month <= 5 ? "IBD-O 03" : "IBD-O 02";
  const dossier = getDossiers(locale).find((item) => item.code === code)!;
  return (
    <section aria-labelledby="zbiory-rodzinne" className="border-t border-ink bg-paper-deep">
      <div className="wrap py-14 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="zbiory-rodzinne" className="text-3xl font-bold leading-tight md:text-4xl">
            {t.title}
          </h2>
          <p className="font-sans text-sm text-ink-soft">
            {t.first}{" "}
            <Link href="/dziaders" className="link ml-2 text-ink">
              {t.guide} →
            </Link>
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href={"/okazje/" + dossier.slug}
            className="group flex flex-col justify-between border border-rule bg-card p-6 md:col-span-2 lg:p-8"
          >
            <p className="label text-red">
              {t.field} · {dossier.code}
            </p>
            <div className="mt-5 grid items-center gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-4xl font-bold leading-[1.02] group-hover:text-red">{dossier.title}</h3>
                <p className="mt-4 text-ink-soft">{dossier.season}</p>
              </div>
              <SpeciesPlate species={dossier.species[0]} className="mx-auto h-44 w-56 max-w-full" />
            </div>
            <span className="link mt-6 self-start font-sans font-medium">{t.open} →</span>
          </Link>
          <Link href="/muzeum" className="group flex flex-col border border-rule bg-card p-6">
            <MuseumDrawing kind="screws" className="mx-auto h-32 w-44 max-w-full" />
            <h3 className="mt-5 text-3xl font-bold group-hover:text-red">{t.museum}</h3>
            <p className="mt-4 flex-1 text-ink-soft">{t.museumText}</p>
            <span className="link mt-6 self-start font-sans font-medium">{t.museumLink} →</span>
          </Link>
          <Link href="/do-druku" className="group flex flex-col border border-rule bg-card p-6">
            <MenuIcon href="/do-druku" className="mx-auto h-32 w-36" />
            <h3 className="mt-5 text-3xl font-bold group-hover:text-red">{t.print}</h3>
            <p className="mt-4 flex-1 text-ink-soft">{t.printText}</p>
            <span className="link mt-6 self-start font-sans font-medium">{t.printLink} →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
