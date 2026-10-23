import type { CSSProperties } from "react";

/**
 * The mallet the Hammer and Bonk-the-bear labs swing: a pink barrel head with
 * ink end caps on a wooden handle, drawn upright in a 200×200 box. Rotate it
 * around (100, 190), the end of its handle, to swing it.
 */
export function Mallet({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" overflow="visible" className={className} style={style}>
      <g stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round">
        <rect x="91" y="78" width="18" height="118" rx="7" fill="var(--orange)" />
        <rect x="86" y="170" width="28" height="26" rx="6" fill="var(--ink)" />
        <rect x="44" y="34" width="112" height="56" rx="12" fill="var(--pink)" />
        <rect x="38" y="30" width="20" height="64" rx="6" fill="var(--ink)" />
        <rect x="142" y="30" width="20" height="64" rx="6" fill="var(--ink)" />
      </g>
      <rect x="66" y="44" width="56" height="10" rx="5" fill="var(--paper-raised)" opacity="0.75" />
    </svg>
  );
}
