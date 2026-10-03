import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { plural, pluralSl } from "@/lib/typo";
import type { Issue } from "@/lib/weekly";
import type { Letter } from "./layout";

export type Recipient = {
  nickname: string | null;
  results: number;
  sightings_week: number;
  verdicts: number;
  pages_week: number;
};

const COPY = defineCopy({
  pl: {
    subject: (issue: Issue) => `Biuletyn IBD nr ${issue.week}/${issue.year}: tydzień w liczbach`,
    department: "Dział Statystyki",
    title: (issue: Issue) => `Tydzień ${issue.week} w liczbach`,
    greeting: (nickname: string | null, period: string) => `${nickname ? `${nickname}, oto` : "Oto"} biuletyn za okres ${period}.`,
    own: (recipient: Recipient) =>
      `Twój tydzień: ${[
        `${recipient.sightings_week} ${plural(recipient.sightings_week, "obserwacja", "obserwacje", "obserwacji")}`,
        `${recipient.pages_week} ${plural(recipient.pages_week, "zerwana kartka", "zerwane kartki", "zerwanych kartek")}`,
      ].join(" i ")}. W kartotece: ${recipient.results} ${plural(recipient.results, "badanie", "badania", "badań")}, w Komisji: ${recipient.verdicts} ${plural(recipient.verdicts, "orzeczenie", "orzeczenia", "orzeczeń")}.`,
    notice: (notice: string) => `Komunikat Instytutu: ${notice}`,
    button: "Cały biuletyn na stronie",
    signature: "Dział Statystyki Instytutu",
    note: "Ten list dostajesz, bo w Profilu Dziaderskim zaznaczono Biuletyn tygodniowy. Wypisać się można jednym kliknięciem, bez logowania i bez tłumaczenia się.",
  },
  sl: {
    subject: (issue: Issue) => `Bilten IBD št. ${issue.week}/${issue.year}: teden v številkah`,
    department: "Služba za statistiko",
    title: (issue: Issue) => `${issue.week}. teden v številkah`,
    greeting: (nickname: string | null, period: string) => `${nickname ? `${nickname}, tu je` : "Tu je"} bilten za obdobje ${period}.`,
    own: (recipient: Recipient) =>
      `Tvoj teden: ${[
        `${recipient.sightings_week} ${pluralSl(recipient.sightings_week, "opazovanje", "opazovanji", "opazovanja", "opazovanj")}`,
        `${recipient.pages_week} ${pluralSl(recipient.pages_week, "odtrgan list", "odtrgana lista", "odtrgani listi", "odtrganih listov")}`,
      ].join(" in ")}. V kartoteki: ${recipient.results} ${pluralSl(recipient.results, "pregled", "pregleda", "pregledi", "pregledov")}, v Komisiji: ${recipient.verdicts} ${pluralSl(recipient.verdicts, "razsodba", "razsodbi", "razsodbe", "razsodb")}.`,
    notice: (notice: string) => `Obvestilo Inštituta: ${notice}`,
    button: "Celoten bilten na strani",
    signature: "Služba za statistiko Inštituta",
    note: "To pismo dobivaš, ker je v Dziaderskem profilu označen Tedenski bilten. Odjaviš se z enim klikom, brez prijave in brez pojasnjevanja.",
  },
});

/**
 * The Monday letter: the week in figures, a few sentences, the notice and the reader's own week.
 * `issue` is composed in the same edition; `unsubscribe` is the reader's link (unsubscribeLinks).
 */
export function bulletinLetter(issue: Issue, recipient: Recipient, origin: string, unsubscribe: string, locale: Locale): Letter {
  const t = COPY[locale];
  return {
    subject: t.subject(issue),
    preheader: issue.lines[0],
    department: t.department,
    title: t.title(issue),
    paragraphs: [t.greeting(recipient.nickname, issue.period), ...issue.lines, t.own(recipient), t.notice(issue.notice)],
    figures: issue.figures,
    button: { href: `${origin}${localizePath("/biuletyn", locale)}`, label: t.button },
    signature: t.signature,
    note: t.note,
    unsubscribe,
  };
}
