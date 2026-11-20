import type { Species } from "@/content/species";
import { getVerdicts } from "@/content/test";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { pluralSl, plural, quote } from "./typo";
import type { GroupEntry, PrivateGroup } from "./family";
import { dominantSpecies, pairs, ranked, type Member } from "./group";
import { cleanName, decodeResult, evaluate, vulgar } from "./test";

/*
 * Badanie okresowe zespołu: an office orders a periodic check-up for up to 50 people, in up to
 * eight departments. Shared by the API (validation), the team page, its report and its card.
 */

export const TEAM_LIMIT = 50;
export const DEPARTMENT_LIMIT = 8;
export const TEAM_NAME_MAX = 60;
export const DEPARTMENT_MAX = 32;
/** Members with at least this score count as "podwyższone" or worse, the Isotype's red figures. */
export const ELEVATED = 50;

/** Letters, digits, spaces and office punctuation; nothing vulgar. */
function cleanLabel(raw: unknown, max: number) {
  if (typeof raw !== "string") return "";
  const text = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} .,&'’()/+-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
    .trim();
  return text && !vulgar(text) ? text : "";
}

export const cleanTeamName = (raw: unknown) => cleanLabel(raw, TEAM_NAME_MAX);

/** Departments as typed: blanks dropped, duplicates (regardless of case) refused, at most eight. */
export function cleanDepartments(raw: unknown): string[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > DEPARTMENT_LIMIT * 2) return null;
  const departments = raw.map((item) => cleanLabel(item, DEPARTMENT_MAX)).filter(Boolean);
  if (departments.length > DEPARTMENT_LIMIT) return null;
  const folded = departments.map((item) => item.toLocaleLowerCase("pl"));
  return new Set(folded).size === folded.length ? departments : null;
}

/** A nickname follows the certificate's rules for names, and must not be empty. */
export const cleanNickname = (raw: unknown) => (typeof raw === "string" ? cleanName(raw) : "");

/** A department index the team has, or null when it has none; undefined when the choice is invalid. */
export function validDepartment(raw: unknown, departments: string[]): number | null | undefined {
  if (departments.length === 0) return raw === undefined || raw === null ? null : undefined;
  return typeof raw === "number" && Number.isInteger(raw) && raw >= 0 && raw < departments.length ? raw : undefined;
}

/** What link holders get from the API and the team page: no attempt ids, no join times. */
export type TeamGroup = { id: string; expires: string; kind: "team"; name: string; departments: string[]; entries: GroupEntry[] };

export const teamView = (group: PrivateGroup): TeamGroup => ({
  id: group.id,
  expires: group.expires,
  kind: "team",
  name: group.name ?? "",
  departments: group.departments,
  entries: group.entries,
});

export type TeamMember = Member & { department: number | null };

const COPY = defineCopy({
  pl: {
    unnamed: (number: number) => `Pracownik nr ${number}`,
    whole: "Cały zespół",
    verdicts: {
      nie: {
        stamp: "To jeszcze nie dziaderstwo",
        finding: "Zespół zdolny do pracy bez ograniczeń. Objawy mają charakter pojedynczy, nie zbiorowy.",
        orders: [
          "Badanie kontrolne przed następną wigilią firmową.",
          "Nie wprowadzać papierowego obiegu wniosków urlopowych.",
          "Obserwować, czy ktoś nie zaczyna podpisywać wiadomości na czacie.",
        ],
      },
      tak: {
        stamp: "To już dziaderstwo",
        finding: "Zespół zdolny do pracy z ograniczeniami. Objawy występują grupowo, głównie na spotkaniach i w kuchni.",
        orders: [
          "Każdy call poprzedzić pytaniem, czy wystarczy mail.",
          "W kuchni jeden czajnik i jedna kartka z zasadami, nie trzy.",
          "Badanie kontrolne za sześć miesięcy.",
        ],
      },
      kliniczne: {
        stamp: "Dziaderstwo kliniczne",
        finding: "Zespół wymaga nadzoru. Dziaderstwo ma charakter systemowy i przenosi się przez stopkę maila.",
        orders: [
          "Wstrzymać calle przed dziesiątą i po piętnastej.",
          "Wiadomości z dopiskiem PILNE w temacie rozpatrywać w trybie zwykłym.",
          "Badanie kontrolne co kwartał. Dział kadr powiadomić niezwłocznie.",
        ],
      },
    },
    grounds: (count: number, departments: number, average: number) =>
      `Komisja Orzekająca, po zapoznaniu się z wynikami ${count} ${plural(count, "osoby", "osób", "osób")}${departments > 1 ? ` z ${departments} działów` : ""}, ustaliła średni poziom dziaderstwa zespołu na ${average}%.`,
    elevated: (count: number, total: number) =>
      count === 0
        ? "Nikt nie ma wyniku podwyższonego."
        : `${count} z ${total} ${plural(total, "osoby", "osób", "osób")} ma wynik co najmniej podwyższony.`,
    dominant: (name: string, count: number) => `Gatunek dominujący: ${name} (${count} ${plural(count, "osoba", "osoby", "osób")}).`,
    risk: (department: string, value: number, whole: boolean) =>
      whole
        ? `Ryzyko ${quote("zróbmy calla", "pl")} w zespole: ${value}%.`
        : `Najwyższe ryzyko ${quote("zróbmy calla", "pl")} stwierdzono w dziale ${department} (${value}%).`,
  },
  sl: {
    unnamed: (number: number) => `Zaposleni št. ${number}`,
    whole: "Ves kolektiv",
    verdicts: {
      nie: {
        stamp: "To še ni dziaderstvo",
        finding: "Kolektiv je sposoben za delo brez omejitev. Simptomi so posamični, ne skupinski.",
        orders: [
          "Kontrolni pregled pred naslednjo novoletno zabavo podjetja.",
          "Ne uvajati papirnatega kroženja prošenj za dopust.",
          "Opazovati, ali se kdo začenja podpisovati pod sporočila v klepetu.",
        ],
      },
      tak: {
        stamp: "To že je dziaderstvo",
        finding: "Kolektiv je sposoben za delo z omejitvami. Simptomi se pojavljajo skupinsko, predvsem na sestankih in v kuhinji.",
        orders: [
          "Pred vsakim callom vprašati, ali bi zadostoval mejl.",
          "V kuhinji en grelnik vode in en listek s pravili, ne trije.",
          "Kontrolni pregled čez šest mesecev.",
        ],
      },
      kliniczne: {
        stamp: "Klinično dziaderstvo",
        finding: "Kolektiv potrebuje nadzor. Dziaderstvo je sistemsko in se prenaša prek podpisa v mejlu.",
        orders: [
          "Ustaviti calle pred deseto in po tretji popoldne.",
          "Sporočila z oznako NUJNO v zadevi obravnavati po rednem postopku.",
          "Kontrolni pregled vsako četrtletje. Kadrovsko službo nemudoma obvestiti.",
        ],
      },
    },
    grounds: (count: number, departments: number, average: number) =>
      `Razsodna komisija je po pregledu izvidov ${count} ${pluralSl(count, "osebe", "oseb", "oseb", "oseb")}${departments > 1 ? ` iz ${departments} oddelkov` : ""} ugotovila, da je povprečna raven dziaderstva v kolektivu ${average} %.`,
    elevated: (count: number, total: number) =>
      count === 0
        ? "Nihče nima povišanega rezultata."
        : `${count} od ${total} ${pluralSl(total, "osebe", "oseb", "oseb", "oseb")} ima najmanj povišan rezultat.`,
    dominant: (name: string, count: number) => `Prevladujoča vrsta: ${name} (${count} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")}).`,
    risk: (department: string, value: number, whole: boolean) =>
      whole
        ? `Tveganje za ${quote("dajmo en call", "sl")} v kolektivu: ${value} %.`
        : `Največje tveganje za ${quote("dajmo en call", "sl")} je bilo ugotovljeno v oddelku ${department} (${value} %).`,
  },
});

/** The members, in the order they joined, labelled by nickname. */
export function teamMembers(team: TeamGroup, locale: Locale): TeamMember[] {
  return team.entries.flatMap((entry, order) => {
    const draft = decodeResult(entry.code);
    if (!draft) return [];
    const result = evaluate(draft, locale);
    return [{ result, label: entry.nickname || result.name || COPY[locale].unnamed(order + 1), order, department: entry.department }];
  });
}

const average = (members: Member[]) =>
  members.length ? Math.round(members.reduce((sum, member) => sum + member.result.score, 0) / members.length) : 0;

/**
 * The "zróbmy calla" index, 0–100: three fifths the Korporacyjny affinity, two fifths the score.
 * The species proposes the call, the general level decides whether it goes ahead.
 */
export function callRisk(members: Member[]) {
  if (members.length === 0) return 0;
  const each = members.map((member) => 0.6 * Math.min(1, Math.max(0, member.result.affinity.korpo ?? 0)) + 0.4 * (member.result.score / 100));
  return Math.round((100 * each.reduce((sum, value) => sum + value, 0)) / members.length);
}

export type DepartmentRow = {
  index: number | null;
  name: string;
  members: TeamMember[];
  average: number;
  elevated: number;
  dominant: { species: Species; count: number } | null;
  risk: number;
};

/** One row per department in the team's order, or one row for the whole team without departments. */
export function departmentRows(team: TeamGroup, members: TeamMember[], locale: Locale): DepartmentRow[] {
  const groups = team.departments.length
    ? team.departments.map((name, index) => ({ index: index as number | null, name, members: members.filter((member) => member.department === index) }))
    : [{ index: null, name: COPY[locale].whole, members }];
  return groups.map((group) => ({
    ...group,
    average: average(group.members),
    elevated: group.members.filter((member) => member.result.score >= ELEVATED).length,
    dominant: dominantSpecies(group.members),
    risk: callRisk(group.members),
  }));
}

export type TeamVerdict = { key: "nie" | "tak" | "kliniczne"; stamp: string; finding: string; orders: string[]; grounds: string[] };

/** The Commission's ruling on the whole team, from its average and how many are elevated. */
export function teamVerdict(team: TeamGroup, members: TeamMember[], rows: DepartmentRow[], locale: Locale): TeamVerdict {
  const t = COPY[locale];
  const mean = average(members);
  const elevated = members.filter((member) => member.result.score >= ELEVATED).length;
  const share = members.length ? elevated / members.length : 0;
  const key = mean >= 60 || share >= 0.75 ? "kliniczne" : mean >= 35 || share >= 0.4 ? "tak" : "nie";
  const dominant = dominantSpecies(members);
  const riskiest = riskiestDepartment(rows);
  const grounds = [
    t.grounds(members.length, rows.filter((row) => row.members.length > 0).length, mean),
    t.elevated(elevated, members.length),
    dominant && dominant.count >= 2 ? t.dominant(dominant.species.name, dominant.count) : "",
    riskiest ? t.risk(riskiest.name, riskiest.risk, riskiest.index === null) : "",
  ].filter(Boolean);
  return { key, ...t.verdicts[key], grounds };
}

/** The department most at risk of calling a meeting that could have been an email. */
export function riskiestDepartment(rows: DepartmentRow[]) {
  return [...rows].filter((row) => row.members.length > 0).sort((a, b) => b.risk - a.risk || b.members.length - a.members.length)[0] ?? null;
}

/** Everything the team page, the report and the card show, computed once. */
export function teamReport(team: TeamGroup, locale: Locale) {
  const members = teamMembers(team, locale);
  const rows = departmentRows(team, members, locale);
  const order = ranked(members);
  const { best, worst } = members.length >= 2 ? pairs(members) : { best: undefined, worst: undefined };
  const zone = (() => {
    const verdicts = getVerdicts(locale);
    const mean = average(members);
    return verdicts.findLast((verdict) => mean >= verdict.from) ?? verdicts[0];
  })();
  return {
    members,
    order,
    rows,
    average: average(members),
    zone,
    best,
    worst: worst && worst !== best ? worst : undefined,
    dominant: dominantSpecies(members),
    riskiest: riskiestDepartment(rows),
    verdict: members.length ? teamVerdict(team, members, rows, locale) : null,
  };
}

export type TeamReport = ReturnType<typeof teamReport>;

/** The case number on the report: the invitation's first characters, like a docket. */
export const docket = (team: TeamGroup) => `IBD-Z ${team.id.slice(0, 4).toUpperCase()}/${team.id.slice(4, 8).toUpperCase()}`;
