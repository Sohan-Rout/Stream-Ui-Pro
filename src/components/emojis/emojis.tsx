/**
 * Comic emojis: black and white or colored (thick ink outlines, a hard
 * offset shadow), or glossy 3D (sphere-shaded, with a soft shadow).
 * Each one is a plain SVG, so it copies out of the page and works anywhere.
 * The animated variant carries its own <style> (scoped by a class prefix),
 * which also holds still for reduced motion.
 */
import type { ComponentType } from "react";
import { Face, FaceBase, faceDefs, variantOf, type FaceDef, type EmojiVariant } from "./faces";

const INK = "#0e0f14";
const PAPER = "#ffffff";
/** Colored variant: a classic emoji yellow, with the theme's pink for tongue and blush. */
const FACE = "#ffd84d";
const PINK = "#ff70b3";
const TEAR = "#70ccee";

type EmojiProps = { animated?: boolean; colored?: boolean; variant?: EmojiVariant; size?: number; title?: string };

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
export function Smile({ animated = false, colored, variant, size = 96, title = "Smiling face" }: EmojiProps) {
  const look = variantOf({ variant, colored });
  colored = look !== "mono";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -10 132 132" width={size} height={size} role="img" aria-label={title}>
      {animated && <style>{SMILE_CSS}</style>}
      {/* Comic pop lines, only in the animated variant. */}
      {animated && (
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path className="sui-smile-pop" d="M10 30 L2 24 M14 18 L10 8 M24 12 L24 2" />
          <path className="sui-smile-pop b" d="M110 30 L118 24 M106 18 L110 8 M96 12 L96 2" />
        </g>
      )}
      <g className={animated ? "sui-smile-face" : undefined}>
        <FaceBase variant={look} fill={colored ? FACE : PAPER} id="smile" />
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

/** The keyframes for the animated Cry, inside the SVG itself. */
const CRY_CSS = `
.sui-cry-face { transform-box: fill-box; transform-origin: 50% 100%; animation: sui-cry-sob .5s ease-in-out infinite; }
.sui-cry-mouth { transform-box: fill-box; transform-origin: 50% 0%; animation: sui-cry-wail .5s ease-in-out infinite; }
.sui-cry-drop { transform-box: fill-box; transform-origin: 50% 0%; animation: sui-cry-drip 1.1s cubic-bezier(.5,0,1,1) infinite; }
.sui-cry-drop.b { animation-delay: .55s; }
.sui-cry-drop.c { animation-delay: .3s; }
.sui-cry-drop.d { animation-delay: .85s; }
@keyframes sui-cry-sob { 0%, 100% { transform: translateY(0) scale(1, 1); } 30% { transform: translateY(2px) scale(1.03, .97); } 60% { transform: translateY(-1px) scale(.99, 1.01); } }
@keyframes sui-cry-wail { 0%, 100% { transform: scale(1, 1); } 40% { transform: scale(1.06, .86); } }
@keyframes sui-cry-drip { 0% { opacity: 0; transform: translateY(-4px) scale(.6); } 15% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(30px) scale(.8); } }
@media (prefers-reduced-motion: reduce) { .sui-cry-face, .sui-cry-mouth, .sui-cry-drop { animation: none; } .sui-cry-drop { opacity: 0; } }
`;

/** A loud comic sob: eyes squeezed shut, worried brows, a wailing mouth, and tears streaming down. */
export function Cry({ animated = false, colored, variant, size = 96, title = "Crying face" }: EmojiProps) {
  const look = variantOf({ variant, colored });
  colored = look !== "mono";
  const tear = colored ? TEAR : PAPER;
  /** A teardrop shape, its tip at (x, y). */
  const drop = (x: number, y: number) => `M${x} ${y} Q${x + 6} ${y + 9} ${x + 6} ${y + 13} A6 6 0 0 1 ${x - 6} ${y + 13} Q${x - 6} ${y + 9} ${x} ${y} Z`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -10 132 132" width={size} height={size} role="img" aria-label={title}>
      {animated && <style>{CRY_CSS}</style>}
      <g className={animated ? "sui-cry-face" : undefined}>
        <FaceBase variant={look} fill={colored ? FACE : PAPER} id="cry" />
        {/* Worried brows, slanting up toward the middle. */}
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M30 34 Q38 28 48 31" />
          <path d="M68 31 Q78 28 86 34" />
          {/* Eyes squeezed shut: > and <. */}
          <path d="M33 42 L46 48 L33 54" strokeLinejoin="round" />
          <path d="M83 42 L70 48 L83 54" strokeLinejoin="round" />
        </g>
        {/* Tear streams down each cheek. */}
        <g fill={tear} stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path d="M34 56 Q30 72 30 92 Q34 96 40 92 Q40 72 40 58 Z" />
          <path d="M82 56 Q86 72 86 92 Q82 96 76 92 Q76 72 76 58 Z" />
        </g>
        {/* A wide, wailing mouth with a wobbly lower lip. */}
        <g className={animated ? "sui-cry-mouth" : undefined}>
          <path d="M42 72 Q58 64 74 72 Q78 86 70 92 Q64 88 58 92 Q52 88 46 92 Q38 86 42 72 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M50 86 Q58 80 66 86 Q62 89 58 90 Q54 89 50 86 Z" fill={colored ? PINK : PAPER} />
        </g>
      </g>
      {/* Drops falling off the bottom of each stream, only in the animated variant. */}
      {animated && (
        <g fill={tear} stroke={INK} strokeWidth="3" strokeLinejoin="round">
          <path className="sui-cry-drop" d={drop(35, 94)} />
          <path className="sui-cry-drop b" d={drop(35, 94)} />
          <path className="sui-cry-drop c" d={drop(81, 94)} />
          <path className="sui-cry-drop d" d={drop(81, 94)} />
        </g>
      )}
    </svg>
  );
}

export type EmojiDoc = {
  slug: string;
  name: string;
  /** The emoji character, for search. */
  char: string;
  Component: ComponentType<EmojiProps>;
};

const faceDoc = (def: FaceDef): EmojiDoc => {
  const Component = (props: EmojiProps) => <Face def={def} {...props} />;
  Component.displayName = `Face(${def.slug})`;
  return { slug: def.slug, name: def.name, char: def.char, Component };
};

/** Every face emoji, in Unicode order. Smile (😃) and Cry (😭) are hand-drawn; the rest are built from parts. */
export const emojis: EmojiDoc[] = faceDefs.flatMap((def): EmojiDoc[] => {
  const doc = faceDoc(def);
  if (def.slug === "grinning") return [doc, { slug: "smile", name: "Grinning, big eyes", char: "😃", Component: Smile }];
  if (def.slug === "crying") return [doc, { slug: "cry", name: "Loudly crying", char: "😭", Component: Cry }];
  return [doc];
});
