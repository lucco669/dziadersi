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
  /** Subscribed with an address only (newsletter_guests): no figures of their own. */
  guest?: boolean;
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
    guestNote: "Ten list dostajesz, bo ten adres zamówił Biuletyn tygodniowy na dziader.si i potwierdził zamówienie. Wypisać się można jednym kliknięciem, bez tłumaczenia się.",
    guestOwn: "Twoich liczb Instytut nie zna: prenumerata bez Profilu Dziaderskiego obejmuje tylko kraj.",
    confirm: {
      subject: "Potwierdź prenumeratę Biuletynu IBD",
      preheader: "Jedno kliknięcie i od poniedziałku tydzień w liczbach przychodzi na ten adres.",
      title: "Potwierdzenie prenumeraty",
      paragraphs: [
        "Na ten adres zamówiono Biuletyn tygodniowy Instytutu: co poniedziałek rano liczby z całego kraju, sprawa tygodnia, rozpoznanie i obserwacja tygodnia.",
        "Prenumerata zacznie się po potwierdzeniu. Bez potwierdzenia Instytut zapomni ten adres po siedmiu dniach, bez przypominania.",
      ],
      button: "Potwierdzam prenumeratę",
      note: "Jeśli to nie ty, zignoruj tę wiadomość. Instytut niczego nie wyśle, najwyżej się zdziwi.",
    },
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
    guestNote: "To pismo dobivaš, ker je ta naslov na dziader.si naročil Tedenski bilten in naročilo potrdil. Odjaviš se z enim klikom, brez pojasnjevanja.",
    guestOwn: "Tvojih številk Inštitut ne pozna: naročnina brez Dziaderskega profila zajema samo državo.",
    confirm: {
      subject: "Potrdi naročnino na Bilten IBD",
      preheader: "En klik in od ponedeljka teden v številkah prihaja na ta naslov.",
      title: "Potrditev naročnine",
      paragraphs: [
        "Na ta naslov je bil naročen Tedenski bilten Inštituta: vsak ponedeljek zjutraj številke iz vse države, primer tedna, diagnoza in opazovanje tedna.",
        "Naročnina začne veljati po potrditvi. Brez potrditve Inštitut ta naslov po sedmih dneh pozabi, brez opominjanja.",
      ],
      button: "Potrjujem naročnino",
      note: "Če za to naročnino ne veš, sporočilo prezri. Inštitut ne bo poslal ničesar, kvečjemu se bo začudil.",
    },
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
    paragraphs: [
      t.greeting(recipient.nickname, issue.period),
      ...issue.lines,
      recipient.guest ? t.guestOwn : t.own(recipient),
      t.notice(issue.notice),
    ],
    figures: issue.figures,
    button: { href: `${origin}${localizePath("/biuletyn", locale)}`, label: t.button },
    signature: t.signature,
    note: recipient.guest ? t.guestNote : t.note,
    unsubscribe,
  };
}

/** The double opt-in letter for a guest: one button to the confirm page (confirmLink). */
export function confirmLetter(link: string, locale: Locale): Letter {
  const t = COPY[locale];
  return {
    subject: t.confirm.subject,
    preheader: t.confirm.preheader,
    department: t.department,
    title: t.confirm.title,
    paragraphs: t.confirm.paragraphs,
    button: { href: link, label: t.confirm.button },
    signature: t.signature,
    note: t.confirm.note,
  };
}
