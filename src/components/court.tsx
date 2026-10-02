import { Figure, INK, MUSTACHE_PATH, OCHRE, PAPER, RED, Tie } from "./pictograms";

/*
 * The Komisja Orzekająca: three judges behind the bench, the chair with the gavel raised.
 * 120 × 100, like the species plates, so it sits in the same grid and in share images.
 */

export function commissionDrawing() {
  return (
    <>
      <g transform="translate(-2 6)">
        <Figure glasses="eyes" torso={<Tie />} />
      </g>
      <g transform="translate(82 6)">
        <Figure beard torso={<Tie />} />
      </g>
      <g transform="translate(40 2)">
        <Figure right="up" glasses="forehead" torso={<Tie />} />
        <g className="pg-gavel">
          <line x1={38.6} y1={2.6} x2={44.6} y2={-6} stroke={OCHRE} strokeWidth={1.8} strokeLinecap="round" />
          <rect x={39.8} y={-12.4} width={12} height={6} rx={1} fill={INK} transform="rotate(35 45.8 -9.4)" />
        </g>
      </g>
      <rect x={0} y={52} width={120} height={5} fill={INK} />
      <rect x={4} y={57} width={112} height={43} fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <circle cx={60} cy={75.5} r={10} fill={RED} />
      <g transform="translate(53.6 73.4) scale(0.128)">
        <path d={MUSTACHE_PATH} fill={PAPER} />
      </g>
      <line x1={14} y1={64} x2={40} y2={64} stroke={INK} strokeWidth={0.8} />
      <line x1={80} y1={64} x2={106} y2={64} stroke={INK} strokeWidth={0.8} />
      <rect x={96} y={47.4} width={9} height={4.6} rx={0.8} fill={RED} />
      <rect x={99.2} y={43} width={2.6} height={4.6} fill={INK} />
    </>
  );
}

export function CommissionPlate({ className, animated }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 -14 120 114" className={[animated ? "pg-animated" : "", className].filter(Boolean).join(" ")} aria-hidden="true">
      {commissionDrawing()}
    </svg>
  );
}
