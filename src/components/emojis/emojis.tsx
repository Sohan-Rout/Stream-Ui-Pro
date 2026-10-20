/**
 * Comic emojis: black-and-white, thick ink outlines, a hard offset shadow.
 * Each one is a plain SVG, so it copies out of the page and works anywhere.
 * The animated variant carries its own <style> (scoped by a class prefix),
 * which also holds still for reduced motion.
 */
import type { ComponentType } from "react";

const INK = "#0e0f14";
const PAPER = "#ffffff";
/** Colored variant: a classic emoji yellow, with the theme's pink for tongue and blush. */
const FACE = "#ffd84d";
const PINK = "#ff70b3";

type EmojiProps = { animated?: boolean; colored?: boolean; size?: number; title?: string };

/** The keyframes for the animated Smile, inside the SVG itself. */
const SMILE_CSS = `
.sui-smile-face { transform-box: fill-box; transform-origin: 50% 100%; animation: sui-smile-bounce 1.6s cubic-bezier(.3,0,.3,1) infinite; }
.sui-smile-eye { transform-box: fill-box; transform-origin: 50% 50%; animation: sui-smile-blink 3.2s steps(1, end) infinite; }
.sui-smile-grin { transform-box: fill-box; transform-origin: 50% 0%; animation: sui-smile-grin 1.6s ease-in-out infinite; }
.sui-smile-pop { transform-box: fill-box; transform-origin: 50% 50%; animation: sui-smile-pop 1.6s ease-out infinite; }
.sui-smile-pop.b { animation-delay: .12s; }
@keyframes sui-smile-bounce {
  0%, 100% { transform: translateY(0) scale(1, 1); }
  12% { transform: translateY(0) scale(1.08, .9); }
  38% { transform: translateY(-9px) scale(.95, 1.06); }
  60% { transform: translateY(0) scale(1.06, .93); }
  72% { transform: translateY(0) scale(1, 1); }
}
@keyframes sui-smile-blink { 0%, 92% { transform: scaleY(1); } 94% { transform: scaleY(.12); } 97% { transform: scaleY(1); } }
@keyframes sui-smile-grin { 0%, 100% { transform: scale(1, 1); } 38% { transform: scale(1.12, 1.18); } }
@keyframes sui-smile-pop { 0%, 30% { opacity: 0; transform: scale(.4); } 42% { opacity: 1; transform: scale(1.15); } 60% { opacity: 1; transform: scale(1); } 74%, 100% { opacity: 0; transform: scale(.8); } }
@media (prefers-reduced-motion: reduce) { .sui-smile-face, .sui-smile-eye, .sui-smile-grin, .sui-smile-pop { animation: none; } .sui-smile-pop { opacity: 0; } }
`;

/** A big comic grin (black and white, or colored with `colored`): round face, oval eyes with glints, an open smile with a tongue. */
export function Smile({ animated = false, colored = false, size = 96, title = "Smiling face" }: EmojiProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={title}>
      {animated && <style>{SMILE_CSS}</style>}
      {/* Comic pop lines, only in the animated variant. */}
      {animated && (
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path className="sui-smile-pop" d="M10 30 L2 24 M14 18 L10 8 M24 12 L24 2" />
          <path className="sui-smile-pop b" d="M110 30 L118 24 M106 18 L110 8 M96 12 L96 2" />
        </g>
      )}
      <g className={animated ? "sui-smile-face" : undefined}>
        {/* The hard shadow, then the face. */}
        <circle cx="64" cy="66" r="44" fill={INK} />
        <circle cx="58" cy="60" r="44" fill={colored ? FACE : PAPER} stroke={INK} strokeWidth="6" />
        {colored && (
          <g fill={PINK}>
            <ellipse cx="28" cy="70" rx="8" ry="5" />
            <ellipse cx="88" cy="67" rx="8" ry="5" />
          </g>
        )}
        {/* Eyes: tall ink ovals with a white glint. */}
        <g className={animated ? "sui-smile-eye" : undefined}>
          <ellipse cx="43" cy="48" rx="7" ry="11" fill={INK} />
          <ellipse cx="73" cy="48" rx="7" ry="11" fill={INK} />
          <circle cx="45" cy="43" r="2.6" fill={PAPER} />
          <circle cx="75" cy="43" r="2.6" fill={PAPER} />
        </g>
        {/* Cheek marks. */}
        <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          <path d="M24 66 l6 -3 M25 73 l6 -3" />
          <path d="M92 63 l-6 -3 M91 70 l-6 -3" />
        </g>
        {/* An open grin with a tongue. */}
        <g className={animated ? "sui-smile-grin" : undefined}>
          <path d="M34 70 Q58 74 82 70 Q80 98 58 98 Q36 98 34 70 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M44 88 Q58 80 72 88 Q66 95 58 95 Q50 95 44 88 Z" fill={colored ? PINK : PAPER} />
          <path d="M58 84 L58 92" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export type EmojiDoc = {
  slug: string;
  name: string;
  /** The React component's name, for copying JSX. */
  component: string;
  Component: ComponentType<EmojiProps>;
};

/** The emoji catalog. More to come. */
export const emojis: EmojiDoc[] = [{ slug: "smile", name: "Smile", component: "Smile", Component: Smile }];
