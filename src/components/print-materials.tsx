import type { Metadata } from "next";
import { getSpecies } from "@/content/species";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { quote, typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";
import { PrintButton } from "./print-button";
import styles from "./print-materials.module.css";

type Material = "cards" | "guide";
const COPY = defineCopy({
  pl: {
    back: "← Materiały do druku",
    cards: "Karty oznaczania gatunków",
    guide: "Kieszonkowy przewodnik obserwatora",
    cardsLead:
      "Dziesięć gatunków rozpoznawanych w teście. Trzy arkusze A4, po cztery karty. Wydrukuj w skali 100%, rozetnij i zabierz w teren.",
    guideLead:
      "Jeden arkusz A4, cztery pola. Wydrukuj w skali 100% i złóż na cztery wzdłuż przerywanych linii. Możesz też zapisać arkusz jako PDF w oknie drukowania.",
    code: "IBD-P · pomoce terenowe",
    call: "Wokalizacja",
    habitat: "Siedlisko",
    marks: "Rozpoznanie",
    sheet: (number: number) => "Arkusz " + number + "/3",
    title: "Obserwator terenowy",
    first: "Klucz I · gatunki 01–05",
    second: "Klucz II · gatunki 06–10",
    protocol: "Protokół obserwacji",
    steps: [
      "Zanotuj zachowanie, nie nazwisko.",
      "Jedna wypowiedź nie przesądza o gatunku.",
      "Nie prowokuj reakcji dla lepszego wyniku.",
      "Porównaj obserwację z pełnym Atlasem.",
    ],
    instructions:
      "Oznaczaj po wypowiedzi i zachowaniu. Piktogram pomaga odnaleźć gatunek; sam wygląd nie jest rozpoznaniem.",
    note: "Miejsce na własne obserwacje",
    disclaimer: "Katalog satyryczny. Nawyki, nie ludzie.",
    atlas: "Pełny Atlas",
    test: "Sprawdź siebie",
  },
  sl: {
    back: "← Gradivo za tisk",
    cards: "Kartice za določanje vrst",
    guide: "Žepni vodnik za opazovalca",
    cardsLead:
      "Deset vrst, ki jih prepozna test. Tri strani A4, po štiri kartice. Natisni v merilu 100 %, razreži in vzemi na teren.",
    guideLead:
      "Ena stran A4, štiri polja. Natisni v merilu 100 % in prepogni na četrtine po črtkanih črtah. V oknu za tisk lahko stran tudi shraniš kot PDF.",
    code: "IBD-P · terenski pripomočki",
    call: "Oglašanje",
    habitat: "Habitat",
    marks: "Prepoznavanje",
    sheet: (number: number) => "Stran " + number + "/3",
    title: "Terenski opazovalec",
    first: "Ključ I · vrste 01–05",
    second: "Ključ II · vrste 06–10",
    protocol: "Opazovalni zapisnik",
    steps: [
      "Zapiši vedenje, ne imena.",
      "Ena izjava ne zadošča za določitev vrste.",
      "Ne izzivaj odziva za boljši rezultat.",
      "Primerjaj opažanje s celotnim Atlasom.",
    ],
    instructions: "Določaj po izjavah in vedenju. Piktogram pomaga najti vrsto; sam videz ni določitev.",
    note: "Prostor za lastna opažanja",
    disclaimer: "Satirični katalog. Navade, ne ljudje.",
    atlas: "Celotni Atlas",
    test: "Preveri sebe",
  },
});
const pathOf = (kind: Material) => "/do-druku/" + (kind === "cards" ? "karty-gatunkow" : "przewodnik");
export async function printMaterialMetadata(kind: Material): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t[kind],
    description: kind === "cards" ? t.cardsLead : t.guideLead,
    path: pathOf(kind),
    noindex: true,
    defaultImage: true,
  });
}
export async function PrintMaterial({ kind }: { kind: Material }) {
  const locale = await getLocale();
  const t = COPY[locale];
  const species = getSpecies(locale).filter((item) => !item.region && !item.occasion);
  return (
    <main id="tresc" className="wrap pb-16 pt-8 print:max-w-none print:p-0">
      <div className="print:hidden">
        <Link href="/do-druku" className="link label">
          {t.back}
        </Link>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{t[kind]}</h1>
        <p className="mt-4 max-w-2xl text-xl text-ink-soft">{typo(kind === "cards" ? t.cardsLead : t.guideLead)}</p>
        <div className="mt-6">
          <PrintButton kind={kind} />
        </div>
      </div>
      {kind === "cards" ? (
        [0, 4, 8].map((start, index) => (
          <section key={start} className={styles.sheet} aria-label={t.sheet(index + 1)}>
            <div className="label mb-3 flex justify-between text-ink-soft print:mb-[3mm] print:text-[8pt]">
              <span>DZIADER.SI · {t.code}</span>
              <span>{t.sheet(index + 1)}</span>
            </div>
            <div className={styles.cards}>
              {species.slice(start, start + 4).map((item) => (
                <article key={item.key} className={styles.card}>
                  <p className="label text-red print:text-[8pt]">{item.code}</p>
                  <h2 className="mt-2 text-2xl font-bold">{item.name}</h2>
                  <p className="text-sm italic text-ink-soft print:text-[8pt]">{item.latin}</p>
                  <SpeciesPlate species={item.key} className="mx-auto my-4 h-36 w-48 max-w-full" />
                  <p>
                    <strong>{t.call}: </strong>
                    {quote(item.calls[0], locale)}
                  </p>
                  <p className="mt-3">
                    <strong>{t.habitat}: </strong>
                    {typo(item.habitat)}
                  </p>
                  <p className="mt-3">
                    <strong>{t.marks}: </strong>
                    {typo(item.fieldMarks)}
                  </p>
                  <p className="mt-4 break-all font-sans text-xs text-ink-faint print:text-[7pt]">
                    {"dziader.si" + localizePath("/atlas/" + item.slug, locale)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))
      ) : (
        <section className={styles.sheet}>
          <div className={styles.pocket}>
            <div className={styles.panel}>
              <p className="label text-red">DZIADER.SI · IBD-P 02</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight">{t.title}</h2>
              <SpeciesPlate species="grill" className="mx-auto my-5 h-28 w-40" />
              <p>{typo(t.instructions)}</p>
              <p className="mt-5 text-sm text-ink-soft">{t.disclaimer}</p>
              <p className="mt-5 font-sans text-sm">
                {t.atlas}: {"dziader.si" + localizePath("/atlas", locale)}
              </p>
            </div>
            {[species.slice(0, 5), species.slice(5, 10)].map((items, index) => (
              <div key={index} className={styles.panel}>
                <h2 className="text-2xl font-bold">{index === 0 ? t.first : t.second}</h2>
                <ol className="mt-4 space-y-4">
                  {items.map((item) => (
                    <li key={item.key}>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-ink-soft">{quote(item.calls[0], locale)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <div className={styles.panel}>
              <h2 className="text-2xl font-bold">{t.protocol}</h2>
              <ol className="mt-5 list-decimal space-y-3 pl-5">
                {t.steps.map((step) => (
                  <li key={step}>{typo(step)}</li>
                ))}
              </ol>
              <p className="label mt-6 text-ink-faint">{t.note}</p>
              <div className={styles.notes} />
              <p className="mt-5 font-sans text-sm">
                {t.test}: {"dziader.si" + localizePath("/test", locale)}
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
