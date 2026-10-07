import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { BLUE, Figure, GREY, INK, OCHRE, PAPER, RED } from "./pictograms";
import type { QueueEvent } from "@/content/queue";

const COPY = defineCopy({
  pl: { desk: "Obsługa obywatela", pause: "Przerwa", you: "Ty", closed: "Zamknięte", sign: "Sprawy niemożliwe: pokój 4", notice: "Prosimy o cierpliwość.", small: "Zapas urzędowy wyczerpany.", caption: "Rys. 1. Naturalne środowisko oczekiwania. Postać czerwona: badany.", alt: (ahead: number) => `Poczekalnia urzędu. Przed tobą: ${ahead}. Twoja postać jest czerwona.` },
  sl: { desk: "Obravnava strank", pause: "Odmor", you: "Ti", closed: "Zaprto", sign: "Nemogoče zadeve: soba 4", notice: "Prosimo za potrpežljivost.", small: "Uradna zaloga je pošla.", caption: "Sl. 1. Naravni habitat čakanja. Rdeča figura: preiskovanec.", alt: (ahead: number) => `Uradna čakalnica. Pred tabo: ${ahead}. Tvoja figura je rdeča.` },
});

export function QueueScene({ locale, ahead = 9, minutes = 40, prop = "coat", closed = false }: { locale: Locale; ahead?: number; minutes?: number; prop?: QueueEvent["prop"]; closed?: boolean }) {
  const t = COPY[locale];
  const count = Math.min(ahead, 10);
  return (
    <figure>
      <svg viewBox="0 0 960 340" role="img" aria-label={t.alt(ahead)} className="queue-scene w-full">
        <rect x="0" y="0" width="960" height="340" fill={PAPER} />
        <path d="M0 278H960M40 278L0 340M920 278L960 340M240 278L220 340M720 278L740 340" stroke={GREY} fill="none" />
        <path d="M44 278V30H264V278" stroke={INK} strokeWidth="2" fill="none" />
        <rect x="58" y="43" width="192" height="35" fill={INK} />
        <text x="154" y="67" textAnchor="middle" fill={PAPER} fontSize="18" fontFamily="sans-serif">01</text>
        <g transform="translate(132 107)"><Figure color={BLUE} glasses="eyes" legs="trousers" /></g>
        <rect x="57" y="174" width="194" height="86" fill={PAPER} stroke={INK} strokeWidth="2" />
        <path d="M50 173H258" stroke={INK} strokeWidth="7" />
        <text x="154" y="212" textAnchor="middle" fontSize="15" fontFamily="sans-serif" fill={INK}>{t.desk}</text>
        <path d="M74 227H233M74 234H233" stroke={GREY} />
        {closed && <g><rect x="58" y="83" width="192" height="88" fill={GREY} /><text x="154" y="133" textAnchor="middle" fontSize="20" fill={INK}>{t.closed}</text></g>}
        <g opacity="0.7"><rect x="302" y="32" width="139" height="110" fill="none" stroke={INK} /><path d="M303 53H440M303 61H440M303 69H440M303 77H440M303 85H440M303 93H440M303 101H440M303 109H440" stroke={GREY} strokeWidth="5" /><text x="371" y="48" textAnchor="middle" fontSize="14" fill={INK}>03</text><rect x="323" y="83" width="98" height="28" fill={PAPER} stroke={INK} /><text x="372" y="102" textAnchor="middle" fontSize="14" fill={INK}>{t.pause}</text></g>
        <g transform="translate(511 66)"><circle r="30" fill={PAPER} stroke={INK} strokeWidth="2" /><path d="M0 -24V-19M24 0H19M0 24V19M-24 0H-19" stroke={INK} strokeWidth="2" /><path d="M0 0L-11 -8" stroke={INK} strokeWidth="3" /><path d="M0 0V-22" stroke={RED} strokeWidth="2" transform={`rotate(${(60 - minutes) * 6})`} /><circle r="3" fill={INK} /></g>
        <path d="M591 26H906V116H591Z" fill="none" stroke={GREY} /><text x="610" y="54" fontSize="16" fontFamily="sans-serif" fill={INK}>{t.notice}</text><text x="610" y="77" fontSize="14" fontFamily="sans-serif" fill={INK}>{t.small}</text><text x="610" y="100" fontSize="13" fontFamily="sans-serif" fill={RED}>{t.sign}</text>
        <path d="M565 158H688M574 158V177M679 158V177" stroke={INK} strokeWidth="5" />
        {prop === "coat" && <path d="M607 110L594 120L586 151L600 155L606 139V158H647V139L653 155L667 151L659 120L646 110L637 119H616Z" fill={OCHRE} />}
        {prop === "paper" && <g transform="translate(608 123)"><path d="M0 0H34L44 10V34H0Z" fill={PAPER} stroke={INK} strokeWidth="2" /><path d="M7 13H34M7 20H34M7 27H25" stroke={INK} /><rect x="28" y="24" width="23" height="9" fill={RED} /></g>}
        {prop === "coffee" && <g transform="translate(612 127)"><path d="M0 0H28V24H0Z" fill={OCHRE} /><path d="M28 4H37V17H28" stroke={OCHRE} strokeWidth="4" fill="none" /><path d="M8 -5V-17M20 -5V-17" stroke={GREY} strokeWidth="2" /></g>}
        {Array.from({ length: count }, (_, i) => <g key={i} className="queue-person" style={{ transform: `translate(${298 + i * 49}px, 180px)` }}><Figure color={i % 3 === 0 ? BLUE : INK} right={i % 3 === 0 ? "cross" : "hip"} hat={i % 4 === 0 ? "cap" : undefined} legs={i % 2 === 0 ? "trousers" : "shorts"} /></g>)}
        <g className="queue-person" style={{ transform: `translate(${298 + count * 49}px, 180px)` }}><Figure color={RED} right="hip" left="down" /><path d="M11 110H29L20 99Z" fill={RED} /><text x="20" y="134" textAnchor="middle" fontSize="18" fontWeight="700" fill={RED}>{t.you}</text></g>
        <path d="M278 286H287M280 282L276 286L280 290" stroke={INK} fill="none" />
      </svg>
      <figcaption className="label border-t border-rule px-4 py-3 text-ink-soft">{t.caption}</figcaption>
    </figure>
  );
}
