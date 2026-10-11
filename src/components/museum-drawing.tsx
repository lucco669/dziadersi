import type { ExhibitKind } from "@/content/museum";
import { BLUE, GREY, INK, OCHRE, PAPER, RED } from "./pictograms";

/** Catalogue drawings use the same limited palette and geometry as the Atlas. */
export function museumDrawing(kind: ExhibitKind) {
  const outline = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
  switch (kind) {
    case "cable":
      return (
        <g>
          <path
            d="M40 42C10 115 115 154 151 103C182 57 89 26 73 81C61 119 169 124 195 56"
            fill="none"
            stroke={INK}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path d="M28 28L51 34L44 60L21 54Z" fill={BLUE} {...outline} />
          <path d="M191 27H210V58H191Z" fill={INK} />
          <path d="M195 12H206V28H195Z" fill={GREY} {...outline} />
          <path d="M29 18L50 24L46 35L25 29Z" fill={GREY} {...outline} />
        </g>
      );
    case "remote":
      return (
        <g transform="rotate(-15 120 80)">
          <rect x={77} y={10} width={86} height={142} rx={12} fill={INK} />
          <rect x={86} y={19} width={68} height={124} rx={6} fill={PAPER} />
          <circle cx={99} cy={34} r={6} fill={RED} />
          <rect x={113} y={30} width={29} height={8} fill={GREY} />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect key={row + "-" + col} x={95 + col * 17} y={49 + row * 15} width={11} height={9} rx={2} fill={INK} />
            )),
          )}
          <circle cx={120} cy={109} r={20} fill={BLUE} />
          <circle cx={120} cy={109} r={7} fill={PAPER} />
        </g>
      );
    case "screws":
      return (
        <g>
          <rect x={65} y={24} width={111} height={17} rx={3} fill={RED} {...outline} />
          <path d="M70 43H172V133Q172 145 160 145H82Q70 145 70 133Z" fill={PAPER} {...outline} />
          <path d="M77 105H166V131Q166 139 158 139H85Q77 139 77 131Z" fill={GREY} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g
              key={i}
              transform={
                "translate(" +
                (88 + (i % 3) * 25) +
                " " +
                (72 + Math.floor(i / 3) * 34) +
                ") rotate(" +
                (i % 2 ? 30 : -25) +
                ")"
              }
              stroke={INK}
              strokeWidth={3}
            >
              <path d="M-8 0H8M0 0V25M-4 9H4M-4 15H4M-4 21H4" />
            </g>
          ))}
          <rect x={87} y={48} width={64} height={15} fill={OCHRE} />
        </g>
      );
    case "box":
      return (
        <g>
          <path d="M34 58L111 30L207 58L207 128L122 153L34 124Z" fill={OCHRE} {...outline} />
          <path d="M34 58L122 84L207 58M122 84V153" fill="none" {...outline} />
          <path d="M34 58L17 29L103 9L111 30M111 30L124 12L221 32L207 58" fill={PAPER} {...outline} />
          <path d="M53 85L103 100M53 93L89 104" stroke={INK} strokeWidth={3} />
          <rect x={158} y={91} width={23} height={23} fill={PAPER} />
        </g>
      );
    case "charger":
      return (
        <g>
          <path
            d="M105 105C122 148 206 150 209 107C212 57 135 54 135 94C135 120 177 123 190 89"
            fill="none"
            stroke={INK}
            strokeWidth={5}
          />
          <rect x={33} y={56} width={80} height={74} rx={8} fill={INK} />
          <path d="M52 36V56M87 36V56" stroke={INK} strokeWidth={7} />
          <rect x={47} y={75} width={52} height={24} fill={PAPER} />
          <path d="M55 84H90M55 92H77" stroke={BLUE} strokeWidth={3} />
          <path d="M179 67H201V90H179Z" fill={BLUE} {...outline} />
          <rect x={183} y={56} width={14} height={12} fill={GREY} {...outline} />
        </g>
      );
    case "manual":
      return (
        <g>
          <path d="M59 28L157 10L187 132L89 152Z" fill={GREY} {...outline} />
          <path d="M48 23L150 8L170 134L68 151Z" fill={PAPER} {...outline} />
          <path d="M65 46L139 35M69 62L143 51M77 107L147 96M80 119L129 112" stroke={INK} strokeWidth={3} />
          <rect x={88} y={72} width={39} height={22} fill={BLUE} transform="rotate(-8 108 83)" />
          <path d="M102 68V96" stroke={RED} strokeWidth={4} />
        </g>
      );
  }
}

export function MuseumDrawing({ kind, className }: { kind: ExhibitKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 164" className={className} aria-hidden="true">
      {museumDrawing(kind)}
    </svg>
  );
}
