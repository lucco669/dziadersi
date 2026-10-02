import { plural } from "@/lib/typo";
import type { Issue } from "@/lib/weekly";
import type { Letter } from "./layout";

export type Recipient = {
  nickname: string | null;
  results: number;
  sightings_week: number;
  verdicts: number;
  pages_week: number;
};

/** The Monday letter: the week in figures, a few sentences, the notice and the reader's own week. */
export function bulletinLetter(issue: Issue, recipient: Recipient, origin: string, unsubscribe: string): Letter {
  const own = [
    `${recipient.sightings_week} ${plural(recipient.sightings_week, "obserwacja", "obserwacje", "obserwacji")}`,
    `${recipient.pages_week} ${plural(recipient.pages_week, "zerwana kartka", "zerwane kartki", "zerwanych kartek")}`,
  ].join(" i ");
  return {
    subject: `Biuletyn IBD nr ${issue.week}/${issue.year}: tydzień w liczbach`,
    preheader: issue.lines[0],
    department: "Dział Statystyki",
    title: `Tydzień ${issue.week} w liczbach`,
    paragraphs: [
      `${recipient.nickname ? `${recipient.nickname}, oto` : "Oto"} biuletyn za okres ${issue.period}.`,
      ...issue.lines,
      `Twój tydzień: ${own}. W kartotece: ${recipient.results} ${plural(recipient.results, "badanie", "badania", "badań")}, w Komisji: ${recipient.verdicts} ${plural(recipient.verdicts, "orzeczenie", "orzeczenia", "orzeczeń")}.`,
      `Komunikat Instytutu: ${issue.notice}`,
    ],
    figures: issue.figures,
    button: { href: `${origin}/biuletyn`, label: "Cały biuletyn na stronie" },
    signature: "Dział Statystyki Instytutu",
    note: "Ten list dostajesz, bo w Profilu Dziaderskim zaznaczono Biuletyn tygodniowy. Wypisać się można jednym kliknięciem, bez logowania i bez tłumaczenia się.",
    unsubscribe,
  };
}
