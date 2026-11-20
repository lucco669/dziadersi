import { Figure, GREY, INK, PAPER, RED, Tie } from "./pictograms";

/*
 * The office check-up's drawing: a meeting table seen from the side, people around it, and in
 * the middle the three-armed conference speakerphone, the device every "zróbmy calla" ends at.
 */

/** The speakerphone: a rounded three-armed star with a red light, `scale` 1 = 40 units wide. */
export function Speakerphone({ x, y, scale = 1, lit = true }: { x: number; y: number; scale?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-20 0Q-20 -5 -12 -6L-4 -7Q0 -12 4 -7L12 -6Q20 -5 20 0Q20 4 0 4Q-20 4 -20 0Z" fill={INK} stroke={PAPER} strokeWidth={1.2} strokeLinejoin="round" />
      <ellipse cx={0} cy={-5.4} rx={5.2} ry={1.6} fill={PAPER} opacity={0.18} />
      <circle cx={0} cy={-3} r={1.6} fill={lit ? RED : GREY} />
    </g>
  );
}

/** Five at the meeting table, the middle one in a tie pointing at the speakerphone; the rest grey. 250 × 118. */
export function MeetingTableDrawing() {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${i * 48 + 6} 0)`}>
          <Figure color={i === 2 ? INK : GREY} mustache={i === 2} legs="trousers" right={i === 2 ? "point" : "down"} torso={i === 2 ? <Tie /> : undefined} />
        </g>
      ))}
      <rect x={0} y={72} width={250} height={6} fill={INK} />
      <line x1={18} y1={78} x2={18} y2={118} stroke={INK} strokeWidth={3} />
      <line x1={232} y1={78} x2={232} y2={118} stroke={INK} strokeWidth={3} />
      {/* On the table top, in front of the colleague the speaker points at. */}
      <Speakerphone x={170} y={67.2} scale={1.2} />
    </g>
  );
}

export function MeetingTable({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 250 118" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <MeetingTableDrawing />
    </svg>
  );
}
