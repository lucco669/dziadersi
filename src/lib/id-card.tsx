import { ImageResponse } from "next/og";
import { Binoculars, BLUE, Figure, GREY, RED } from "@/components/pictograms";
import { SPECIES } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OG_FONTS, OgMark, OgSeal, bold, italic, sans } from "./og";
import type { Profile } from "./profile";
import { siteCopy } from "./site";
import { svgDataUri } from "./svg-string";
import { DIAGNOSABLE } from "./test";

/*
 * Legitymacja Obserwatora Terenowego (Izkaznica terenskega opazovalca): the member card of the
 * Profil Dziaderski, as a PNG, in the edition it is downloaded from.
 * Shaped like a Polish ID card (85.6 × 54 mm), with guilloche lines, a passport-style
 * pictogram, the seal and up to six earned badges as stamps.
 */

export const ID_CARD = { width: 1240, height: 800 };

const COPY = defineCopy({
  pl: {
    /** From the most observations down: 20, 10, 5, 1, none. */
    ranks: ["Obserwator honorowy", "Starszy obserwator terenowy", "Obserwator terenowy", "Obserwator-stażysta", "Kandydat na obserwatora"],
    title: "Legitymacja Obserwatora Terenowego",
    photo: "Zdjęcie zgodne z rzeczywistością",
    anonymous: "Obserwator bez pseudonimu",
    nickname: "Pseudonim",
    rank: "Stopień",
    log: "Dziennik obserwacji",
    collection: "Kolekcja z testu",
    badges: "Odznaki",
    of: (count: number, total: number) => `${count} z ${total}`,
    noBadges: "Odznaki w drodze. Instytut wierzy w okaziciela.",
    issued: (date: string) => `Wydano: ${date}`,
    terms: "Ważna do odwołania. Okaziciel ma prawo obserwować, nie ma prawa komentować cudzego grilla.",
  },
  sl: {
    ranks: ["Častni opazovalec", "Višji terenski opazovalec", "Terenski opazovalec", "Opazovalec pripravnik", "Kandidat za opazovalca"],
    title: "Izkaznica terenskega opazovalca",
    photo: "Slika ustreza dejanskemu stanju",
    anonymous: "Opazovalec brez psevdonima",
    nickname: "Psevdonim",
    rank: "Naziv",
    log: "Dnevnik opazovanj",
    collection: "Zbirka iz testa",
    badges: "Značke",
    of: (count: number, total: number) => `${count} od ${total}`,
    noBadges: "Značke so na poti. Inštitut verjame v imetnika.",
    issued: (date: string) => `Izdano: ${date}`,
    terms: "Velja do preklica. Imetnik sme opazovati, ne sme pa komentirati tujega žara.",
  },
});

/** The rank printed on the card, from the observation log: stażysta → honorowy. */
export function rankFor(observed: number, locale: Locale) {
  const [honorary, senior, field, trainee, candidate] = COPY[locale].ranks;
  if (observed >= 20) return honorary;
  if (observed >= 10) return senior;
  if (observed >= 5) return field;
  if (observed >= 1) return trainee;
  return candidate;
}

/** A stable card number from the account id, without revealing it. */
export function cardNumber(id: string) {
  const digits = parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 1_000_000;
  return `OT ${String(digits).padStart(6, "0")}/26`;
}

const guilloche = (() => {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 40 + i * 70;
    const d = Array.from({ length: 33 }, (_, j) => `${j === 0 ? "M" : "L"}${j * 36} ${y + Math.sin(j * 0.7 + i) * 18}`).join("");
    return <path key={i} d={d} fill="none" stroke={i % 2 ? BLUE : RED} strokeWidth={1.2} opacity={0.13} />;
  });
  return svgDataUri("0 0 1152 712", <>{lines}</>);
})();

const portrait = svgDataUri(
  "-6 -4 52 64",
  <>
    <rect x={-6} y={-4} width={52} height={64} fill={GREY} />
    <Figure glasses="eyes" hat="bucket" torso={<Binoculars />} />
  </>,
);

function Field({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: 16 }}>
      <div style={{ ...sans, display: "flex", fontSize: 17, color: C.soft }}>{label}</div>
      <div style={{ ...bold, display: "flex", fontSize: large ? 52 : 32, lineHeight: 1.05, letterSpacing: large ? -1 : 0 }}>{value}</div>
    </div>
  );
}

/** The card in an edition; `profile` is built in the same locale, so the badges are in its words. */
export function idCardImage(profile: Profile, id: string, issued: string, headers: Record<string, string> | undefined, locale: Locale) {
  const t = COPY[locale];
  const earned = profile.badges.filter((badge) => badge.earned);
  const name = profile.nickname || t.anonymous;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: C.paper }}>
        <div
          style={{
            width: 1152,
            height: 712,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            background: C.card,
            border: `3px solid ${C.ink}`,
            borderRadius: 34,
            overflow: "hidden",
          }}
        >
          <img src={guilloche} width={1152} height={712} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 40px", background: C.ink, color: C.paper }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <OgMark size={46} color={C.paper} cutout={C.ink} />
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
                <div style={{ ...bold, display: "flex", fontSize: 30, lineHeight: 1 }}>{t.title}</div>
                <div style={{ ...sans, display: "flex", marginTop: 6, fontSize: 17, color: "#cec6b6" }}>{`${siteCopy(locale).institute} · dziader.si`}</div>
              </div>
            </div>
            <div style={{ ...sans, display: "flex", fontSize: 22 }}>{cardNumber(id)}</div>
          </div>
          <div style={{ height: 10, display: "flex", background: C.red }} />

          <div style={{ display: "flex", flex: 1, padding: "30px 40px 0 40px" }}>
            <div style={{ display: "flex", flexDirection: "column", width: 290 }}>
              <div style={{ display: "flex", border: `2px solid ${C.ink}` }}>
                <img src={portrait} width={286} height={352} alt="" />
              </div>
              <div style={{ ...sans, display: "flex", marginTop: 10, fontSize: 15, color: C.soft }}>{t.photo}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 44 }}>
              <Field label={t.nickname} value={name} large />
              <Field label={t.rank} value={rankFor(profile.observed.size, locale)} />
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", width: 250 }}>
                  <Field label={t.log} value={t.of(profile.observed.size, SPECIES.length)} />
                </div>
                <div style={{ display: "flex", width: 220 }}>
                  <Field label={t.collection} value={t.of(profile.collected.size, DIAGNOSABLE.length)} />
                </div>
                <Field label={t.badges} value={t.of(earned.length, profile.badges.length)} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 22, maxWidth: 760 }}>
                {earned.slice(0, 6).map((badge, i) => (
                  <div
                    key={badge.key}
                    style={{
                      display: "flex",
                      margin: "0 12px 12px 0",
                      padding: 3,
                      border: `2px solid ${C.red}`,
                      transform: `rotate(${i % 2 ? 2 : -2}deg)`,
                    }}
                  >
                    <div style={{ ...sans, display: "flex", padding: "5px 9px", border: `1px solid ${C.red}`, fontSize: 15, letterSpacing: 1.4, color: C.red }}>
                      {badge.name.toUpperCase()}
                    </div>
                  </div>
                ))}
                {earned.length === 0 && (
                  <div style={{ ...italic, display: "flex", fontSize: 22, color: C.soft }}>{t.noBadges}</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 40px 28px 40px" }}>
            <div style={{ ...sans, display: "flex", flexDirection: "column", fontSize: 17, color: C.soft }}>
              <span>{t.issued(issued)}</span>
              <span>{t.terms}</span>
            </div>
          </div>
          <div style={{ display: "flex", position: "absolute", right: 46, bottom: 66 }}>
            <OgSeal size={170} rotate={-14} />
          </div>
        </div>
      </div>
    ),
    { ...ID_CARD, fonts: OG_FONTS, headers },
  );
}
