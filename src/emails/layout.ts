import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { site, siteCopy } from "@/lib/site";
import { typo } from "@/lib/typo";

/*
 * The Institute's letterhead for email: a paper document with the red stripe of the certificate,
 * set in Poltawski where the mail client loads web fonts and in Georgia where it doesn't.
 * Tables and inline styles only: email clients ignore most of modern CSS.
 */

export type Letter = {
  subject: string;
  /** The line inbox previews show after the subject. */
  preheader: string;
  /** Department in the letterhead: "Rejestracja". */
  department: string;
  title: string;
  paragraphs: string[];
  button?: { href: string; label: string };
  /** A one-time code, shown as a stamp. */
  code?: { label: string; value: string };
  /** Small print under the signature. */
  note: string;
  /** Headline figures, two to a row: the weekly bulletin. */
  figures?: { value: string; label: string }[];
  /** Who signs the letter; the registry by default. */
  signature?: string;
  /** Unsubscribe link for mailings, shown in the footer. */
  unsubscribe?: string;
};

const COPY = defineCopy({
  pl: {
    /** The letterhead image in public/email: the mark, the wordmark and the Institute's name under it. */
    header: "naglowek.png",
    regards: "Z poważaniem",
    registry: "Rejestracja Instytutu",
    satire: "serwis satyryczny",
    privacy: "prywatność",
    unsubscribe: "wypisz się",
    unsubscribeText: "Wypisz się",
  },
  sl: {
    header: "naglowek-sl.png",
    regards: "S spoštovanjem",
    registry: "Prijavna služba Inštituta",
    satire: "satirična stran",
    privacy: "zasebnost",
    unsubscribe: "odjava",
    unsubscribeText: "Odjava",
  },
});

const C = {
  paper: "#f4f0e7",
  card: "#fbf8f1",
  ink: "#161513",
  soft: "#57524a",
  faint: "#6c665a",
  rule: "#d8d0c0",
  red: "#c4362c",
};

const SERIF = "'Poltawski Nowy', Georgia, 'Times New Roman', serif";
const SANS = "'Schibsted Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Escaped, with non-breaking spaces after one-letter words. */
const prose = (text: string) => escape(typo(text)).replace(/ /g, "&nbsp;");

/** "123456" → "123 456", "12345678" → "1234 5678": easier to copy by eye. */
const spaced = (code: string) => (code.length % 2 === 0 ? `${code.slice(0, code.length / 2)} ${code.slice(code.length / 2)}` : code);

/** The absolute address of an internal path in an edition; the Polish front page is the bare origin. */
const pageUrl = (origin: string, path: string, locale: Locale) => {
  const localized = localizePath(path, locale);
  return localized === "/" ? origin : `${origin}${localized}`;
};

/** The letter on the letterhead of the edition `locale`: its name, links and small print. */
export function renderHtml(letter: Letter, locale: Locale, origin = site.url) {
  const t = COPY[locale];
  const institute = siteCopy(locale).institute;
  const home = pageUrl(origin, "/", locale);
  const button = letter.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px 0;"><tr>
        <td style="background:${C.ink};">
          <a href="${escape(letter.button.href)}" style="display:inline-block;padding:15px 24px;font-family:${SANS};font-size:16px;font-weight:700;line-height:1;color:${C.paper};text-decoration:none;">${escape(letter.button.label)}&nbsp;&rarr;</a>
        </td>
      </tr></table>`
    : "";

  const code = letter.code
    ? `<p style="margin:26px 0 10px 0;font-family:${SANS};font-size:13px;line-height:1.4;color:${C.soft};">${prose(letter.code.label)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border:4px double ${C.red};padding:8px 18px;font-family:${SERIF};font-size:30px;font-weight:700;letter-spacing:6px;color:${C.red};">${escape(spaced(letter.code.value))}</td>
      </tr></table>`
    : "";

  const figures = letter.figures?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 4px 0;border-top:1px solid ${C.ink};">
        ${Array.from({ length: Math.ceil(letter.figures.length / 2) }, (_, row) =>
          `<tr>${letter.figures!
            .slice(row * 2, row * 2 + 2)
            .map(
              (item) =>
                `<td width="50%" style="padding:12px 12px 10px 0;border-bottom:1px solid ${C.rule};vertical-align:top;">
                  <div style="font-family:${SERIF};font-size:30px;font-weight:700;line-height:1;color:${C.ink};">${escape(item.value)}</div>
                  <div style="margin-top:4px;font-family:${SANS};font-size:13px;line-height:1.35;color:${C.soft};">${prose(item.label)}</div>
                </td>`,
            )
            .join("")}</tr>`,
        ).join("")}
      </table>`
    : "";

  return `<!doctype html>
<html lang="${LOCALE_INFO[locale].tag}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escape(letter.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Poltawski+Nowy:ital,wght@0,400;0,700;1,400&amp;family=Schibsted+Grotesk:wght@500;700&amp;display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${prose(letter.preheader)}&nbsp;&#8199;&#65279;&nbsp;&#8199;&#65279;&nbsp;&#8199;&#65279;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};">
  <tr><td align="center" style="padding:32px 16px 40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 0 20px 0;">
        <a href="${home}" style="text-decoration:none;"><img src="${origin}/email/${t.header}" width="316" height="64" alt="DZIADER.SI · ${escape(institute)}" style="display:block;border:0;width:316px;max-width:100%;height:auto;"></a>
      </td></tr>
      <tr><td style="background:${C.card};border:1px solid ${C.ink};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:${C.red};height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>
          <tr><td style="padding:26px 32px 32px 32px;">
            <p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.4;color:${C.soft};">${escape(institute)} &middot; ${escape(letter.department)}</p>
            <h1 style="margin:14px 0 0 0;font-family:${SERIF};font-size:30px;font-weight:700;line-height:1.08;letter-spacing:-0.3px;color:${C.ink};">${prose(letter.title)}</h1>
            ${letter.paragraphs
              .map(
                (paragraph) =>
                  `<p style="margin:16px 0 0 0;font-family:${SERIF};font-size:17px;line-height:1.55;color:${C.ink};">${prose(paragraph)}</p>`,
              )
              .join("\n            ")}
            ${figures}
            ${button}
            ${code}
            <p style="margin:30px 0 0 0;padding-top:16px;border-top:1px solid ${C.rule};font-family:${SERIF};font-size:16px;font-style:italic;line-height:1.4;color:${C.ink};">${escape(t.regards)}<br>${escape(letter.signature ?? t.registry)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 2px 0 2px;font-family:${SANS};font-size:12px;line-height:1.55;color:${C.faint};">
        ${prose(letter.note)}<br>
        <a href="${home}" style="color:${C.faint};">dziader.si</a> &middot; ${escape(t.satire)} &middot; <a href="${pageUrl(origin, "/prywatnosc", locale)}" style="color:${C.faint};">${escape(t.privacy)}</a>${letter.unsubscribe ? ` &middot; <a href="${escape(letter.unsubscribe)}" style="color:${C.faint};">${escape(t.unsubscribe)}</a>` : ""}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** The plain-text part of the letter, in the edition `locale`. */
export function renderText(letter: Letter, locale: Locale) {
  const t = COPY[locale];
  return [
    `${siteCopy(locale).institute} · ${letter.department}`,
    "",
    letter.title.toUpperCase(),
    "",
    ...letter.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    ...(letter.figures?.length ? [...letter.figures.map((item) => `${item.value}: ${item.label}`), ""] : []),
    ...(letter.button ? [`${letter.button.label}: ${letter.button.href}`, ""] : []),
    ...(letter.code ? [`${letter.code.label} ${spaced(letter.code.value)}`, ""] : []),
    t.regards,
    letter.signature ?? t.registry,
    "",
    "--",
    letter.note,
    `dziader.si · ${t.satire}`,
    ...(letter.unsubscribe ? [`${t.unsubscribeText}: ${letter.unsubscribe}`] : []),
  ].join("\n");
}
