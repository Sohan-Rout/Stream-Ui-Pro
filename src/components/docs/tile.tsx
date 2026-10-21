/**
 * Shared pieces for the animated tiles on /components: the stage every tile
 * renders on, the loop length, and comic-book drawing bits.
 */
import type { CSSProperties, ReactNode } from "react";

/** One 6s loop. */
export const LOOP = 6;

/** The 14-spike starburst ComicBadge uses, for thumbs and flashes drawn here. */
export const BURST = (() => {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 14;
    const r = i % 2 ? 37 : 50;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
})();

export const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 13%, transparent) 1.2px, transparent 1.6px)",
  backgroundSize: "8px 8px",
};

/** The stage every tile shares: decorative and out of the tab order. */
export function Stage({ name, css, children }: { name: string; css: string; children: ReactNode }) {
  return (
    <div className={`${name} relative h-44 w-full max-w-md`}>
      <style href={name} precedence="default">
        {css}
      </style>
      <div aria-hidden inert className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

export function Burst({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" overflow="visible" className={className} style={style}>
      <path d={BURST} stroke="var(--ink)" strokeWidth={7} strokeLinejoin="round" />
    </svg>
  );
}

export const sketchy = "rounded-[14px_5px_12px_6px/6px_12px_5px_14px]";
export const comicBox = `${sketchy} border-[3px] border-ink bg-paper-raised shadow-[4px_4px_0_var(--ink)]`;


/** A chunky cartoon cursor; position and move it with a class. */
export function Cursor({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 36" className={`absolute z-30 h-9 w-7.5 origin-top-left ${className ?? ""}`} style={style}>
      <path d="M3 2 L3 28 L10 22 L15 33 L20 31 L15 20 L25 20 Z" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

/** Keyframe percentage for a time in the loop. */
export const pct = (t: number) => `${((t / LOOP) * 100).toFixed(2)}%`;
