import { ImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";
import { commissionDrawing } from "@/components/court";
import { Figure, Sweater } from "@/components/pictograms";
import { caseCategories, docket, getVerdicts, type Case } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { ExamResult } from "./exam";
import { C, OG_FONTS, OgLogo, OgStamp, bold, italic, printedUrl, sans, serif } from "./og";
import { OgBinoculars } from "./og-cards";
import type { Line } from "./phrasebook";
import { STORY_QUERY, type StoryFormat } from "./share-file";
import { siteCopy } from "./site";
import { svgDataUri } from "./svg-string";
import type { Answer } from "./szwagier";
import { formatNumber, quote, typo } from "./typo";

/*
 * Portrait share images for Instagram, Facebook and TikTok: a post (4:5) and a story (9:16).
 * The landscape link previews stay in og-cards.tsx, toy-cards.tsx and court-cards.tsx; these are
 * the same objects stood upright. Every toy's image route serves both from `?format=post|relacja`.
 *
 * A story keeps its words between 250 px from the top and 300 px from the bottom, where Instagram
 * draws its own bars, and ends with the question and the address in paper on ink.
 */

export const STORY_SIZES = {
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

export { STORY_QUERY, type StoryFormat };

/** `?format=relacja` is the story, anything else the post. */
export const storyFormat = (value: string | null | undefined): StoryFormat => (value === STORY_QUERY.story ? "story" : "post");

const IMMUTABLE = "public, max-age=86400, s-maxage=31536000, immutable";

/**
 * Response for an image route: `?format=relacja` for the story, `?pobierz` to download it as
 * `<file>-post.png` / `<file>-relacja.png`. `render` returns null for a code that doesn't decode.
 */
export function storyResponse(
  searchParams: URLSearchParams,
  render: (format: StoryFormat) => ReactElement | null,
  { file, cache = IMMUTABLE }: { file: string; cache?: string },
) {
  const format = storyFormat(searchParams.get("format"));
  const node = render(format);
  if (!node) return new Response("Nie znaleziono", { status: 404 });
  const headers: Record<string, string> = { "cache-control": cache, "x-robots-tag": "noindex" };
  if (searchParams.has("pobierz")) headers["content-disposition"] = `attachment; filename="${file}-${STORY_QUERY[format]}.png"`;
  return new ImageResponse(node, { ...STORY_SIZES[format], fonts: OG_FONTS, headers });
}

/**
 * The upright frame: the logo and section on paper, the content, then the address. A story adds an
 * ink band with `ask` and the address, the way the certificate's story does.
 * `path` is the internal path the image sends people to.
 */
export function StoryFrame({
  locale,
  format,
  section,
  path,
  ask,
  children,
}: {
  locale: Locale;
  format: StoryFormat;
  section: string;
  path: string;
  /** The line under a story, such as "A ty? Zbadaj się na". The address follows it. */
  ask: string;
  children: ReactNode;
}) {
  const story = format === "story";
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.paper, color: C.ink }}>
      <div style={{ display: "flex", height: 14, background: C.red }} />
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: story ? "170px 80px 40px" : "64px 72px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <OgLogo size={story ? 46 : 42} />
        </div>
        <div
          style={{
            ...sans,
            display: "flex",
            marginTop: 26,
            paddingBottom: 18,
            borderBottom: `2px solid ${C.ink}`,
            fontSize: 26,
            color: C.soft,
          }}
        >
          {section}
        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>{children}</div>
        {!story && (
          <div
            style={{
              ...sans,
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 56,
              paddingTop: 18,
              borderTop: `2px solid ${C.ink}`,
              fontSize: 24,
            }}
          >
            {/* A long address takes the whole line. */}
            {printedUrl(path, locale).length <= 36 && <span style={{ color: C.soft }}>{siteCopy(locale).institute}</span>}
            <span style={{ color: C.red }}>{printedUrl(path, locale)}</span>
          </div>
        )}
      </div>
      {story && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "50px 80px 270px",
            background: C.ink,
            color: C.paper,
          }}
        >
          <div style={{ ...italic, display: "flex", fontSize: 50, lineHeight: 1.1 }}>{ask}</div>
          <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 34, color: C.paper }}>
            {printedUrl(path, locale)}
          </div>
        </div>
      )}
    </div>
  );
}

/** The red speech bubble of the Rozmówki and SZWAGIER, its tail pointing left at the figure. */
function Bubble({ text, size }: { text: string; size: number }) {
  return (
    <div style={{ position: "relative", display: "flex", padding: "34px 40px", background: C.red }}>
      <svg width="30" height="40" viewBox="0 0 24 34" style={{ position: "absolute", left: -29, top: 44 }}>
        <path d="M24 0V34L0 17Z" fill={C.red} />
      </svg>
      <div style={{ ...bold, display: "flex", fontSize: size, lineHeight: 1.16, color: C.paper }}>{typo(text)}</div>
    </div>
  );
}

/** A pointing figure on the left, what it says on the right. */
function Speaker({ figure, story, children }: { figure: ReactElement; story: boolean; children: ReactNode }) {
  const width = story ? 220 : 190;
  return (
    <div style={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
      <img src={svgDataUri("-4 -1 56 97", figure)} width={width} height={(width * 97) / 56} alt="" />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 44, marginTop: 10 }}>{children}</div>
    </div>
  );
}

const fit = (length: number, steps: [number, number][], smallest: number) => steps.find(([max]) => length <= max)?.[1] ?? smallest;

const COPY = defineCopy({
  pl: {
    question: "Czy to już dziaderstwo?",
    docket: "Sygn. akt",
    defence: "Obrona strony",
    facts: "Stan faktyczny",
    judge: "Orzeknij jako ławnik:",
    caseAsk: "A ty jak orzekasz? Głosuj na",
    phrasebook: (chapter: string) => `Rozmówki dziaderskie · ${chapter}`,
    line: (number: number, total: number) => `Wypowiedź nr ${number} z ${total}`,
    lineAsk: "Wylosuj swoją na",
    exam: (date: string) => `Egzamin terenowy · ${date}`,
    points: (points: number) => `${points} z 12 oznaczeń poprawnych`,
    grade: "Ocena",
    examAsk: "A ty rozpoznasz gatunek? Zdawaj na",
    szwagier: "Superinteligencja · SZWAGIER 1.9 TDI",
    asked: "Pytanie",
    withheld: "Pytanie zawierało słowa, których Instytut nie drukuje.",
    answerAsk: "Zapytaj SZWAGRA na",
  },
  sl: {
    question: "Je to že dziaderstvo?",
    docket: "Opr. št.",
    defence: "Zagovor stranke",
    facts: "Dejansko stanje",
    judge: "Razsodi kot porotnik:",
    caseAsk: "Kako razsodiš ti? Glasuj na",
    phrasebook: (chapter: string) => `Dziaderski pogovornik · ${chapter}`,
    line: (number: number, total: number) => `Izjava št. ${formatNumber("sl", number)} od ${formatNumber("sl", total)}`,
    lineAsk: "Izžrebaj svojo na",
    exam: (date: string) => `Terenski izpit · ${date}`,
    points: (points: number) => `${points} od 12 pravilnih določitev`,
    grade: "Ocena",
    examAsk: "Pa ti prepoznaš vrsto? Opravljaj na",
    szwagier: "Superinteligenca · SZWAGIER 1.9 TDI",
    asked: "Vprašanje",
    withheld: "Vprašanje je vsebovalo besede, ki jih Inštitut ne tiska.",
    answerAsk: "Vprašaj SZWAGRA na",
  },
});

const STAMP_ROTATIONS = [-2, 1, -3];

/** The three stamps of the Komisja, one under another like a ballot. */
export function StoryBallot({ locale, fontSize = 30 }: { locale: Locale; fontSize?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: Math.round(fontSize * 0.7) }}>
      {getVerdicts(locale).map((verdict, i) => (
        <div key={verdict.key} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", width: fontSize * 1.2, height: fontSize * 1.2, marginRight: fontSize * 0.7, border: `3px solid ${C.ink}` }} />
          <OgStamp label={verdict.short} fontSize={fontSize} rotate={STAMP_ROTATIONS[i]} />
        </div>
      ))}
    </div>
  );
}

/** A case of the Komisja: the bench, the title, the facts and defence, and the three stamps to choose from. */
export function caseStory(item: Case, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const facts = story && item.facts.length <= 240;
  return (
    <StoryFrame
      locale={locale}
      format={format}
      section={`${t.docket} ${docket(item)} · ${caseCategories(locale)[item.category]}`}
      path={`/czy-to-juz-dziaderstwo/${item.slug}`}
      ask={t.caseAsk}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ ...sans, display: "flex", marginBottom: 24, fontSize: 32, color: C.red }}>{t.question}</div>
        <img src={svgDataUri("0 -14 120 114", commissionDrawing())} width={230} height={(230 * 114) / 120} alt="" />
      </div>
      <div
        style={{
          ...bold,
          display: "flex",
          marginTop: 18,
          fontSize: fit(item.title.length, [[24, 96], [40, 82]], 70),
          lineHeight: 0.98,
          letterSpacing: -1.6,
        }}
      >
        {item.title}
      </div>
      {facts && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ ...sans, display: "flex", marginTop: 30, fontSize: 24, color: C.soft }}>{t.facts}</div>
          <div style={{ ...serif, display: "flex", marginTop: 8, fontSize: 29, lineHeight: 1.3 }}>{typo(item.facts)}</div>
        </div>
      )}
      <div style={{ ...sans, display: "flex", marginTop: 34, fontSize: 24, color: C.soft }}>{t.defence}</div>
      <div
        style={{
          ...italic,
          display: "flex",
          marginTop: 8,
          paddingLeft: 26,
          borderLeft: `4px solid ${C.red}`,
          fontSize: fit(item.defence.length, [[90, 42], [150, 37]], 33),
          lineHeight: 1.22,
        }}
      >
        {quote(typo(item.defence), locale)}
      </div>
      <div style={{ ...sans, display: "flex", marginTop: 40, marginBottom: 20, fontSize: 26 }}>{t.judge}</div>
      <StoryBallot locale={locale} fontSize={story ? 28 : 26} />
    </StoryFrame>
  );
}

/** A line from the Rozmówki in the red bubble, said by the pointing figure. */
export function lineStory(line: Line, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const size = fit(line.text.length, [[110, story ? 58 : 52], [150, story ? 52 : 46]], story ? 46 : 42);
  return (
    <StoryFrame locale={locale} format={format} section={t.phrasebook(line.situation.name)} path={`/generator/${line.code}`} ask={t.lineAsk}>
      <Speaker figure={<Figure right="point" glasses="eyes" />} story={story}>
        <Bubble text={line.text} size={size} />
        <div style={{ ...sans, display: "flex", marginTop: 20, fontSize: 26, color: C.soft }}>{t.line(line.number, line.total)}</div>
      </Speaker>
    </StoryFrame>
  );
}

/** An exam result: the grade as on a Polish school report, its stamp and twelve squares for the answers. */
export function examStory(result: ExamResult, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const squares = result.questions.map((question, i) => (
    <rect key={i} x={(i % 6) * 36} y={Math.floor(i / 6) * 36} width={32} height={32} fill={result.answers[i] === question.correct ? C.ink : C.red} />
  ));
  return (
    <StoryFrame locale={locale} format={format} section={t.exam(result.date)} path="/egzamin" ask={t.examAsk}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ ...sans, display: "flex", fontSize: 26, color: C.soft }}>{t.grade}</div>
          <div style={{ ...bold, display: "flex", fontSize: story ? 380 : 330, lineHeight: 0.8, letterSpacing: -10 }}>{result.grade.value}</div>
        </div>
        <OgBinoculars height={story ? 470 : 400} />
      </div>
      <div style={{ ...bold, display: "flex", marginTop: 30, fontSize: 76, lineHeight: 1 }}>{result.grade.name}</div>
      <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 30, color: C.soft }}>{t.points(result.points)}</div>
      <div style={{ display: "flex", marginTop: 38 }}>
        <OgStamp label={result.grade.title} fontSize={30} />
      </div>
      <div style={{ display: "flex", marginTop: 46 }}>
        <img src={svgDataUri("0 0 212 68", squares)} width={636} height={204} alt="" />
      </div>
    </StoryFrame>
  );
}

/**
 * An answer of SZWAGIER: the question, then the gist in the red bubble. A withheld question (vulgar
 * words, crisis topics) is never printed: decodeAnswer leaves it empty and the card says so.
 */
export function answerStory(answer: Answer, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const { sentences } = answer;
  const gist = (answer.topic.special ? sentences : [sentences[0], sentences[1], sentences[sentences.length - 1]]).map((sentence) => sentence.text).join(" ");
  const size = fit(gist.length, [[90, 52], [130, 46], [170, 42]], 37) + (story ? 6 : 0);
  const question = answer.question;
  return (
    <StoryFrame locale={locale} format={format} section={t.szwagier} path="/superinteligencja" ask={t.answerAsk}>
      <div style={{ ...sans, display: "flex", fontSize: 26, color: C.soft }}>{t.asked}</div>
      <div
        style={{
          ...(question ? bold : italic),
          display: "flex",
          marginTop: 8,
          fontSize: question ? fit(question.length, [[50, 50], [80, 44]], 38) : 34,
          lineHeight: 1.15,
          color: question ? C.ink : C.soft,
        }}
      >
        {question ? quote(typo(question), locale) : t.withheld}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
        <Speaker figure={<Figure right="point" glasses="eyes" torso={<Sweater />} />} story={story}>
          <Bubble text={gist} size={size} />
          <div style={{ ...sans, display: "flex", marginTop: 20, fontSize: 26, color: C.soft }}>{answer.thought}</div>
        </Speaker>
      </div>
    </StoryFrame>
  );
}
