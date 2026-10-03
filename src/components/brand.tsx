import { useId, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { cx } from "@/lib/typo";
import { MUSTACHE_PATH, PAPER } from "./pictograms";

/** The Institute's mark: the pictogram head. */
export function Mark({ className, cutout = PAPER }: { className?: string; cutout?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx={24} cy={24} r={24} fill="currentColor" />
      <path d={MUSTACHE_PATH} fill={cutout} transform="translate(6.2 21.6) scale(0.356)" />
    </svg>
  );
}

export function Wordmark({ className, dotClassName = "text-red" }: { className?: string; dotClassName?: string }) {
  return (
    <span className={cx("font-serif font-bold tracking-[-0.01em]", className)}>
      DZIADER<span className={dotClassName}>.</span>SI
    </span>
  );
}

const SEAL = defineCopy({
  pl: { ring: "INSTYTUT BADAŃ NAD DZIADERSTWEM · DZIADER.SI · ", label: "Pieczęć Instytutu Badań nad Dziaderstwem" },
  sl: { ring: "INŠTITUT ZA RAZISKAVE DZIADERSTVA · DZIADER.SI · ", label: "Pečat Inštituta za raziskave dziaderstva" },
});

/** Round rubber seal: ring text around the head. */
export function Seal({ locale, className, ring = SEAL[locale].ring }: { locale: Locale; className?: string; ring?: string }) {
  const id = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      className={cx("ink-worn", className)}
      role="img"
      aria-label={SEAL[locale].label}
    >
      <defs>
        <path id={id} d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="96" strokeWidth="4.5" />
        <circle cx="100" cy="100" r="89" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="58" strokeWidth="1.4" />
      </g>
      <text fill="currentColor" fontSize="14" fontWeight="700" letterSpacing="0.5" style={{ fontFamily: "var(--font-schibsted)" }}>
        <textPath href={`#${id}`} textLength="458" lengthAdjust="spacing">
          {ring}
        </textPath>
      </text>
      <circle cx="100" cy="90" r="27" fill="currentColor" />
      <path d={MUSTACHE_PATH} fill={PAPER} transform="translate(80.6 87.4) scale(0.4)" />
      <text
        x="100"
        y="139"
        textAnchor="middle"
        fill="currentColor"
        fontSize="19"
        fontWeight="700"
        letterSpacing="3"
        style={{ fontFamily: "var(--font-poltawski)" }}
      >
        IBD
      </text>
    </svg>
  );
}

/** Rectangular rubber stamp. */
export function Stamp({
  children,
  tone = "red",
  className,
}: {
  children: ReactNode;
  tone?: "red" | "ink" | "paper";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "ink-worn inline-block border-4 border-double px-3 py-1.5 font-sans text-[0.8rem] font-bold uppercase leading-none tracking-[0.12em]",
        tone === "red" && "border-red text-red",
        tone === "ink" && "border-ink text-ink",
        tone === "paper" && "border-paper text-paper",
        className,
      )}
    >
      {children}
    </span>
  );
}
