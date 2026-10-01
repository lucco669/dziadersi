import Link from "next/link";
import { DICTIONARY, entryByHeadword } from "@/content/dictionary";
import type { Bulletin } from "@/lib/bulletin";
import { plural, typo } from "@/lib/typo";
import { SectionHeading } from "./brand";

export function DictionarySection({ bulletin }: { bulletin: Bulletin }) {
  const entry = DICTIONARY[bulletin.today % DICTIONARY.length];
  const others = [1, 2, 3, 4, 5, 6].map((k) => DICTIONARY[(bulletin.today + k) % DICTIONARY.length]);

  return (
    <section id="slownik" aria-labelledby="slownik-title" className="wrap scroll-mt-20 py-20 md:py-28">
      <SectionHeading
        id="slownik-title"
        number="04"
        kicker="Leksykografia"
        aside={`Hasło dnia · ${bulletin.date}`}
        title="Słownik Dziaderski"
        dek={typo(
          "Zwroty, wykrzyknienia i formuły, które każdy słyszał przy rodzinnym stole. Opracowane naukowo, objaśnione bez litości.",
        )}
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <article aria-labelledby="haslo-dnia" className="lg:col-span-8 lg:pr-8">
          <p className="kicker text-bordo">Hasło dnia</p>
          <h3
            id="haslo-dnia"
            className="mt-5 font-display text-[clamp(2.75rem,6.6vw,5.5rem)] font-black leading-[0.92] tracking-[-0.03em]"
          >
            <Link href={`/slownik/${entry.slug}`} className="transition-colors hover:text-green">
              {entry.headword}
            </Link>
          </h3>
          <p className="mt-5 text-lg text-ink-soft">
            <em>{entry.grammar}</em>
            <span className="mx-2.5 text-rule">|</span>
            {entry.pronunciation}
          </p>

          <ol className="mt-8 space-y-4 border-t border-ink pt-8">
            {entry.senses.map((sense, i) => (
              <li key={sense.text} className="grid grid-cols-[2rem_1fr] gap-2 text-xl leading-relaxed md:text-[1.4rem]">
                <span className="font-display font-bold">{i + 1}.</span>
                <span>
                  {sense.figurative && <em className="text-ink-soft">przen. </em>}
                  {typo(sense.text)}
                </span>
              </li>
            ))}
          </ol>

          <blockquote className="mt-9 border-l-[3px] border-bordo pl-5">
            <p className="font-display text-2xl italic leading-snug">„{entry.example}”</p>
            {entry.exampleNote && <p className="kicker mt-3 text-ink-faint">{entry.exampleNote}</p>}
          </blockquote>

          <p className="mt-9 text-ink-soft">
            <span className="kicker mr-3 text-ink">Zob. też</span>
            {entry.seeAlso.map((term, i) => {
              const related = entryByHeadword(term);
              return (
                <span key={term}>
                  {i > 0 && <span className="mx-2 text-rule">·</span>}
                  {related ? (
                    <Link href={`/slownik/${related.slug}`} className="hover:text-green">
                      <em>{term}</em>
                    </Link>
                  ) : (
                    <em>{term}</em>
                  )}
                </span>
              );
            })}
          </p>
        </article>

        <aside className="lg:col-span-4" aria-label="Inne hasła">
          <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
            <h3 className="kicker">Inne hasła</h3>
            <span className="kicker text-ink-faint">
              {DICTIONARY.length} {plural(DICTIONARY.length, "hasło", "hasła", "haseł")}
            </span>
          </div>
          <ul>
            {others.map((item) => (
              <li key={item.slug} className="border-b border-rule">
                <Link href={`/slownik/${item.slug}`} className="group block py-3.5">
                  <span className="block font-display text-xl font-semibold leading-tight transition-colors group-hover:text-green">
                    {item.headword}
                  </span>
                  <span className="mt-0.5 block text-[0.9rem] text-ink-soft">{item.grammar}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/slownik" className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
              Pełny słownik <span aria-hidden="true">→</span>
            </Link>
          </p>
        </aside>
      </div>
    </section>
  );
}
