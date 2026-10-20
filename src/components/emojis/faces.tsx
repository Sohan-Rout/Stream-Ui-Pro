/**
 * The round face emojis (the Smileys group), built from parts: each face is
 * eyes + mouth + brows + extras on the same comic base (ink outline, hard
 * shadow). Black and white uses only ink and paper; colored adds the face
 * yellow (or a tint), blue tears, pink hearts and tongues, and so on.
 *
 * The animated variant shares one scoped stylesheet: the face moves (bob,
 * bounce, shake, sob, tilt, pulse, float), open eyes blink, and extras do
 * their own thing (tears drip, Zs rise, steam puffs, hearts beat, stars
 * spin). It holds still for reduced motion.
 */
import type { ReactNode } from "react";

const INK = "#0e0f14";
const PAPER = "#ffffff";
const FACE = "#ffd84d";
const PINK = "#ff70b3";
const BLUE = "#70ccee";
const LIME = "#bdf952";
const ORANGE = "#ff9e53";
const VIOLET = "#c0a2f5";

export type FaceProps = { animated?: boolean; colored?: boolean; size?: number; title?: string };

type EyeKind =
  | "dot" | "small" | "happy" | "closed" | "squint" | "flat" | "wide" | "roll" | "plead"
  | "heart" | "star" | "spiral" | "cross" | "money" | "sunglasses" | "nerd" | "monocle"
  | "lidded" | "lidded-side" | "tired" | "none";
type MouthKind =
  | "smile" | "small-smile" | "grin" | "beam" | "laugh" | "flat" | "frown" | "slight-frown"
  | "o" | "big-o" | "scream" | "open-frown" | "wavy" | "zip" | "tongue" | "tongue-side"
  | "kiss" | "smirk" | "grimace" | "diagonal" | "sob" | "none";
type BrowKind = "worried" | "angry" | "raised" | "sad";
type Extra =
  | "tear" | "tears-joy" | "sweat" | "zzz" | "halo" | "hearts" | "kiss-heart" | "blush" | "cheeks"
  | "steam" | "thermometer" | "bandage" | "tissue" | "cowboy" | "party" | "disguise"
  | "hand-mouth" | "hand-chin" | "salute" | "hugs" | "shush" | "peek" | "clouds" | "exhale"
  | "nose" | "shake" | "melt" | "explode" | "horns" | "mask" | "icicles" | "vomit" | "drool"
  | "dizzy" | "holding-tears" | "symbols" | "tear-pool";
type Motion = "bob" | "bounce" | "shake" | "sob" | "tilt" | "pulse" | "float" | "tremble" | "spin";

export type FaceDef = {
  slug: string;
  name: string;
  /** The emoji itself, for search. */
  char: string;
  eyes: EyeKind | [EyeKind, EyeKind];
  mouth: MouthKind;
  brows?: BrowKind;
  extras?: Extra[];
  /** Colored face fill, when it isn't the usual yellow. */
  tint?: string;
  /** Tongue color, colored only. */
  tongue?: string;
  motion?: Motion;
  /** Draw the whole face upside down. */
  flip?: boolean;
  /** A dashed outline instead of a solid one. */
  dashed?: boolean;
};

/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */

const CSS = `
.sui-f, .sui-f * { transform-box: fill-box; }
.sui-f-bob { transform-origin: 50% 100%; animation: sui-f-bob 2s ease-in-out infinite; }
.sui-f-bounce { transform-origin: 50% 100%; animation: sui-f-bounce 1.4s cubic-bezier(.3,0,.3,1) infinite; }
.sui-f-shake { transform-origin: 50% 50%; animation: sui-f-shake .4s linear infinite; }
.sui-f-sob { transform-origin: 50% 100%; animation: sui-f-sob .5s ease-in-out infinite; }
.sui-f-tilt { transform-origin: 50% 50%; animation: sui-f-tilt 2.4s ease-in-out infinite; }
.sui-f-pulse { transform-origin: 50% 50%; animation: sui-f-pulse 1s ease-in-out infinite; }
.sui-f-float { transform-origin: 50% 50%; animation: sui-f-float 3s ease-in-out infinite; }
.sui-f-tremble { transform-origin: 50% 50%; animation: sui-f-tremble .18s linear infinite; }
.sui-f-spin { transform-origin: 50% 50%; animation: sui-f-spin 3s cubic-bezier(.6,0,.4,1) infinite; }
.sui-f-blink { transform-origin: 50% 50%; animation: sui-f-blink 3.4s steps(1, end) infinite; }
.sui-f-drip { transform-origin: 50% 0%; animation: sui-f-drip 1.2s cubic-bezier(.5,0,1,1) infinite; }
.sui-f-drip.b { animation-delay: .6s; }
.sui-f-rise { transform-origin: 50% 50%; animation: sui-f-rise 2.4s ease-out infinite; }
.sui-f-rise.b { animation-delay: .8s; }
.sui-f-rise.c { animation-delay: 1.6s; }
.sui-f-puff { transform-origin: 50% 50%; animation: sui-f-puff 1.2s ease-out infinite; }
.sui-f-puff.b { animation-delay: .6s; }
.sui-f-beat { transform-origin: 50% 50%; animation: sui-f-beat .9s ease-in-out infinite; }
.sui-f-beat.b { animation-delay: .3s; }
.sui-f-beat.c { animation-delay: .6s; }
.sui-f-twirl { transform-origin: 50% 50%; animation: sui-f-twirl 2s linear infinite; }
.sui-f-wave { transform-origin: 50% 100%; animation: sui-f-wave .8s ease-in-out infinite; }
.sui-f-hover { transform-origin: 50% 50%; animation: sui-f-hover 2s ease-in-out infinite; }
@keyframes sui-f-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes sui-f-bounce { 0%, 100% { transform: translateY(0) scale(1, 1); } 12% { transform: translateY(0) scale(1.07, .91); } 38% { transform: translateY(-8px) scale(.96, 1.05); } 60% { transform: translateY(0) scale(1.05, .94); } 72% { transform: translateY(0) scale(1, 1); } }
@keyframes sui-f-shake { 0%, 100% { transform: translateX(0) rotate(0); } 25% { transform: translateX(-3px) rotate(-4deg); } 75% { transform: translateX(3px) rotate(4deg); } }
@keyframes sui-f-sob { 0%, 100% { transform: translateY(0) scale(1, 1); } 30% { transform: translateY(2px) scale(1.03, .97); } 60% { transform: translateY(-1px) scale(.99, 1.01); } }
@keyframes sui-f-tilt { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes sui-f-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes sui-f-float { 0%, 100% { transform: translate(0, 0) rotate(-3deg); } 50% { transform: translate(0, -5px) rotate(3deg); } }
@keyframes sui-f-tremble { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-1px, 1px); } 50% { transform: translate(1px, -1px); } 75% { transform: translate(1px, 1px); } }
@keyframes sui-f-spin { 0%, 15% { transform: rotate(0); } 85%, 100% { transform: rotate(360deg); } }
@keyframes sui-f-blink { 0%, 92% { transform: scaleY(1); } 94% { transform: scaleY(.12); } 97% { transform: scaleY(1); } }
@keyframes sui-f-drip { 0% { opacity: 0; transform: translateY(-3px) scale(.6); } 15% { opacity: 1; transform: translateY(0) scale(1); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px) scale(.8); } }
@keyframes sui-f-rise { 0% { opacity: 0; transform: translate(0, 6px) scale(.6); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(8px, -16px) scale(1.1); } }
@keyframes sui-f-puff { 0% { opacity: 0; transform: scale(.4); } 30% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5) translateY(-4px); } }
@keyframes sui-f-beat { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.25); } 50% { transform: scale(.95); } }
@keyframes sui-f-twirl { to { transform: rotate(360deg); } }
@keyframes sui-f-wave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-12deg); } }
@keyframes sui-f-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@media (prefers-reduced-motion: reduce) { .sui-f * { animation: none !important; } }
`;

/* ------------------------------------------------------------------ */
/* Parts                                                               */
/* ------------------------------------------------------------------ */

type Ctx = { colored: boolean; anim: boolean; face: string };
const fill = (ctx: Ctx, color: string) => (ctx.colored ? color : PAPER);
const cls = (ctx: Ctx, c: string) => (ctx.anim ? c : undefined);

const L = 43;
const R = 73;
const EY = 48;

function heart(x: number, y: number, s: number, color: string, key?: string | number, className?: string) {
  const d = `M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.1} ${x - s * 0.9} ${y - s * 1.2} ${x} ${y - s * 0.4} C${x + s * 0.9} ${y - s * 1.2} ${x + s * 1.6} ${y - s * 0.1} ${x} ${y + s * 0.9} Z`;
  return <path key={key} className={className} d={d} fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
}

function star(x: number, y: number, r: number, color: string, key?: string | number, className?: string) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  });
  return <path key={key} className={className} d={`M${pts.join("L")}Z`} fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
}

/** A teardrop with its tip at (x, y). */
function drop(x: number, y: number, s: number, color: string, key?: string | number, className?: string) {
  const d = `M${x} ${y} Q${x + s} ${y + s * 1.5} ${x + s} ${y + s * 2.1} A${s} ${s} 0 0 1 ${x - s} ${y + s * 2.1} Q${x - s} ${y + s * 1.5} ${x} ${y} Z`;
  return <path key={key} className={className} d={d} fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
}

function eye(kind: EyeKind, x: number, side: "l" | "r", ctx: Ctx): ReactNode {
  const s = { stroke: INK, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const dir = side === "l" ? 1 : -1;
  const blink = cls(ctx, "sui-f-blink");
  switch (kind) {
    case "dot":
      return (
        <g className={blink}>
          <ellipse cx={x} cy={EY} rx="6" ry="10" fill={INK} />
          <circle cx={x + 2} cy={EY - 4} r="2.4" fill={PAPER} />
        </g>
      );
    case "small":
      return <circle className={blink} cx={x} cy={EY + 2} r="5.5" fill={INK} />;
    case "happy":
      return <path {...s} d={`M${x - 8} ${EY + 3} Q${x} ${EY - 8} ${x + 8} ${EY + 3}`} />;
    case "closed":
      return <path {...s} d={`M${x - 8} ${EY - 1} Q${x} ${EY + 7} ${x + 8} ${EY - 1}`} />;
    case "squint":
      return <path {...s} d={`M${x - 7 * dir} ${EY - 7} L${x + 6 * dir} ${EY} L${x - 7 * dir} ${EY + 7}`} />;
    case "flat":
      return <path {...s} d={`M${x - 8} ${EY + 1} H${x + 8}`} />;
    case "wide":
      return (
        <g className={blink}>
          <circle cx={x} cy={EY} r="10" fill={PAPER} stroke={INK} strokeWidth="4" />
          <circle cx={x} cy={EY + 1} r="4.5" fill={INK} />
        </g>
      );
    case "roll":
      return (
        <g>
          <circle cx={x} cy={EY} r="10" fill={PAPER} stroke={INK} strokeWidth="4" />
          <circle cx={x + 2} cy={EY - 5} r="4" fill={INK} />
        </g>
      );
    case "plead":
      return (
        <g className={blink}>
          <circle cx={x} cy={EY + 1} r="11" fill={INK} />
          <circle cx={x + 3} cy={EY - 3} r="4" fill={PAPER} />
          <circle cx={x - 3} cy={EY + 5} r="2" fill={PAPER} />
        </g>
      );
    case "heart":
      return heart(x, EY, 9, ctx.colored ? PINK : INK, undefined, cls(ctx, "sui-f-beat"));
    case "star":
      return star(x, EY, 11, fill(ctx, ORANGE), undefined, cls(ctx, "sui-f-twirl"));
    case "spiral":
      return <path {...s} strokeWidth={4} className={cls(ctx, "sui-f-twirl")} d={`M${x} ${EY} m0 -1 a1.5 1.5 0 1 1 -1.5 2 a4 4 0 1 1 5.5 -4 a7 7 0 1 1 -10 7.5 a9.5 9.5 0 1 1 14 -10`} />;
    case "cross":
      return <path {...s} d={`M${x - 7} ${EY - 7} L${x + 7} ${EY + 7} M${x + 7} ${EY - 7} L${x - 7} ${EY + 7}`} />;
    case "money":
      return (
        <text x={x} y={EY + 8} textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontWeight="900" fontSize="24" fill={ctx.colored ? "#3a9d3a" : INK} stroke={INK} strokeWidth="1">
          $
        </text>
      );
    case "lidded":
    case "lidded-side":
    case "tired": {
      const px = kind === "lidded-side" ? x + 5 : x;
      return (
        <g>
          <path d={`M${x - 9} ${EY - 1} A9 8 0 0 0 ${x + 9} ${EY - 1} Z`} fill={PAPER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx={px} cy={EY + 3} r="3.5" fill={INK} />
          <path {...s} d={`M${x - 10} ${EY - 1} H${x + 10}`} />
          {kind === "tired" && <path {...s} strokeWidth={3} d={`M${x - 7} ${EY + 11} Q${x} ${EY + 14} ${x + 7} ${EY + 11}`} />}
        </g>
      );
    }
    default:
      return null;
  }
}

function eyesPart(def: FaceDef, ctx: Ctx) {
  const [l, r] = Array.isArray(def.eyes) ? def.eyes : [def.eyes, def.eyes];
  if (l === "sunglasses") {
    return (
      <g>
        <path d="M26 40 H90 L88 46 Q86 58 72 58 Q62 58 60 48 L56 48 Q54 58 44 58 Q30 58 28 46 Z" fill={INK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M34 44 L40 44" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
        <path d="M66 44 L72 44" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (l === "nerd") {
    return (
      <g>
        <circle cx={L} cy={EY} r="12" fill={PAPER} stroke={INK} strokeWidth="5" />
        <circle cx={R} cy={EY} r="12" fill={PAPER} stroke={INK} strokeWidth="5" />
        <path d="M55 46 Q58 42 61 46" stroke={INK} strokeWidth="4" fill="none" />
        <g className={cls(ctx, "sui-f-blink")}>
          <circle cx={L + 1} cy={EY + 1} r="4.5" fill={INK} />
          <circle cx={R - 1} cy={EY + 1} r="4.5" fill={INK} />
        </g>
      </g>
    );
  }
  if (r === "monocle") {
    return (
      <g>
        {eye(l, L, "l", ctx)}
        <circle cx={R} cy={EY} r="12" fill={PAPER} stroke={INK} strokeWidth="5" />
        <circle cx={R} cy={EY + 1} r="4.5" fill={INK} />
        <path d={`M${R + 6} ${EY + 11} Q${R + 14} ${EY + 30} ${R + 6} ${EY + 46}`} stroke={INK} strokeWidth="2.5" fill="none" />
      </g>
    );
  }
  return (
    <g>
      {eye(l, L, "l", ctx)}
      {eye(r, R, "r", ctx)}
    </g>
  );
}

function mouthPart(def: FaceDef, ctx: Ctx) {
  const s = { stroke: INK, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const tongue = ctx.colored ? (def.tongue ?? PINK) : PAPER;
  switch (def.mouth) {
    case "smile":
      return <path {...s} d="M40 73 Q58 88 76 73" />;
    case "small-smile":
      return <path {...s} d="M46 76 Q58 84 70 76" />;
    case "grin":
      return (
        <g>
          <path d="M38 70 Q58 74 78 70 Q76 94 58 94 Q40 94 38 70 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M46 86 Q58 79 70 86 Q65 91 58 91 Q51 91 46 86 Z" fill={tongue} />
        </g>
      );
    case "beam":
      return (
        <g>
          <path d="M34 69 Q58 74 82 69 Q79 93 58 93 Q37 93 34 69 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M38 71 Q58 75 78 71 L77 78 Q58 82 39 78 Z" fill={PAPER} />
        </g>
      );
    case "laugh":
      return (
        <g>
          <path d="M34 68 Q58 73 82 68 Q80 96 58 96 Q36 96 34 68 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M38 70 Q58 74 78 70 L77 76 Q58 80 39 76 Z" fill={PAPER} />
          <path d="M46 88 Q58 81 70 88 Q65 93 58 93 Q51 93 46 88 Z" fill={tongue} />
        </g>
      );
    case "flat":
      return <path {...s} d="M44 80 H72" />;
    case "frown":
      return <path {...s} d="M42 86 Q58 72 74 86" />;
    case "slight-frown":
      return <path {...s} d="M46 83 Q58 76 70 83" />;
    case "o":
      return <ellipse cx="58" cy="81" rx="5" ry="6.5" fill={INK} />;
    case "big-o":
      return <ellipse cx="58" cy="82" rx="9" ry="12" fill={INK} />;
    case "scream":
      return <ellipse cx="58" cy="84" rx="10" ry="15" fill={INK} />;
    case "open-frown":
      return <path d="M42 89 Q58 70 74 89 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />;
    case "wavy":
      return <path {...s} strokeWidth={4} d="M38 82 l5 -5 l5 5 l5 -5 l5 5 l5 -5 l5 5 l5 -5 l4 4" />;
    case "zip":
      return (
        <g>
          <path {...s} d="M38 80 H78" />
          <path {...s} strokeWidth={3} d="M43 75 v10 M50 75 v10 M57 75 v10 M64 75 v10 M71 75 v10" />
          <rect x="76" y="76" width="8" height="10" rx="2" fill={PAPER} stroke={INK} strokeWidth="3" />
        </g>
      );
    case "tongue":
    case "tongue-side": {
      const dx = def.mouth === "tongue-side" ? 8 : 0;
      return (
        <g>
          <path d="M40 73 Q58 79 76 73 Q74 85 58 85 Q42 85 40 73 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d={`M${50 + dx} 82 Q${50 + dx} 98 ${58 + dx} 98 Q${66 + dx} 98 ${66 + dx} 82 Z`} fill={tongue} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d={`M${58 + dx} 84 V92`} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
    case "kiss":
      return <path {...s} strokeWidth={4} d="M55 72 Q65 74 57 79 Q65 82 56 87" />;
    case "smirk":
      return <path {...s} d="M46 82 Q62 84 74 72" />;
    case "grimace":
      return (
        <g>
          <rect x="36" y="71" width="44" height="17" rx="5" fill={PAPER} stroke={INK} strokeWidth="4.5" />
          <path d="M36 79.5 H80 M47 71 V88 M58 71 V88 M69 71 V88" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case "diagonal":
      return <path {...s} d="M44 85 L72 76" />;
    case "sob":
      return (
        <g className={cls(ctx, "sui-f-pulse")}>
          <path d="M42 72 Q58 64 74 72 Q78 86 70 92 Q64 88 58 92 Q52 88 46 92 Q38 86 42 72 Z" fill={INK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M50 86 Q58 80 66 86 Q62 89 58 90 Q54 89 50 86 Z" fill={tongue} />
        </g>
      );
    default:
      return null;
  }
}

function browsPart(kind: BrowKind | undefined) {
  const s = { stroke: INK, strokeWidth: 5, strokeLinecap: "round" as const, fill: "none" };
  switch (kind) {
    case "worried":
      return <g {...s}><path d="M30 33 Q38 27 48 30" /><path d="M68 30 Q78 27 86 33" /></g>;
    case "sad":
      return <g {...s}><path d="M32 32 L48 28" /><path d="M68 28 L84 32" /></g>;
    case "angry":
      return <g {...s}><path d="M31 29 L50 37" /><path d="M85 29 L66 37" /></g>;
    case "raised":
      return <g {...s}><path d="M33 34 H49" /><path d="M66 30 Q75 22 84 29" /></g>;
    default:
      return null;
  }
}

/** Extras drawn behind the face (hats' back, halo, explosions) vs. in front. */
const BEHIND = new Set<Extra>(["halo", "explode", "horns", "hearts", "dizzy", "zzz", "melt"]);

function extraPart(x: Extra, ctx: Ctx, key: string): ReactNode {
  const s = { stroke: INK, strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const tear = fill(ctx, BLUE);
  switch (x) {
    case "tear":
      return <g key={key}>{drop(80, 54, 5, tear, "a", cls(ctx, "sui-f-drip"))}</g>;
    case "tear-pool":
      return <g key={key} {...s} fill="none"><path d={`M${L - 8} ${EY + 10} Q${L} ${EY + 14} ${L + 8} ${EY + 10}`} stroke={ctx.colored ? BLUE : INK} /><path d={`M${R - 8} ${EY + 10} Q${R} ${EY + 14} ${R + 8} ${EY + 10}`} stroke={ctx.colored ? BLUE : INK} /></g>;
    case "holding-tears":
      return (
        <g key={key}>
          <path d={`M${L - 9} ${EY + 6} Q${L} ${EY + 12} ${L + 9} ${EY + 6}`} fill={tear} stroke={INK} strokeWidth="3" />
          <path d={`M${R - 9} ${EY + 6} Q${R} ${EY + 12} ${R + 9} ${EY + 6}`} fill={tear} stroke={INK} strokeWidth="3" />
        </g>
      );
    case "tears-joy":
      return (
        <g key={key}>
          <path d="M30 50 Q14 46 10 58 Q14 66 26 60 Z" fill={tear} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" className={cls(ctx, "sui-f-puff")} />
          <path d="M86 50 Q102 46 106 58 Q102 66 90 60 Z" fill={tear} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" className={cls(ctx, "sui-f-puff b")} />
        </g>
      );
    case "sweat":
      return <g key={key}>{drop(90, 22, 6, tear, "a", cls(ctx, "sui-f-drip"))}</g>;
    case "drool":
      return <g key={key}>{drop(44, 82, 4, tear, "a", cls(ctx, "sui-f-drip"))}</g>;
    case "zzz":
      return (
        <g key={key} fontFamily="ui-monospace, Menlo, monospace" fontWeight="900" fill={INK}>
          <text className={cls(ctx, "sui-f-rise")} x="88" y="26" fontSize="16">z</text>
          <text className={cls(ctx, "sui-f-rise b")} x="98" y="16" fontSize="12">z</text>
          <text className={cls(ctx, "sui-f-rise c")} x="106" y="8" fontSize="9">z</text>
        </g>
      );
    case "halo":
      return (
        <g key={key} className={cls(ctx, "sui-f-hover")}>
          <ellipse cx="58" cy="12" rx="28" ry="7" fill="none" stroke={INK} strokeWidth="10" />
          <ellipse cx="58" cy="12" rx="28" ry="7" fill="none" stroke={fill(ctx, BLUE)} strokeWidth="4" />
        </g>
      );
    case "hearts":
      return <g key={key}>{[heart(16, 30, 7, fill(ctx, PINK), 1, cls(ctx, "sui-f-beat")), heart(102, 26, 7, fill(ctx, PINK), 2, cls(ctx, "sui-f-beat b")), heart(104, 82, 6, fill(ctx, PINK), 3, cls(ctx, "sui-f-beat c"))]}</g>;
    case "kiss-heart":
      return <g key={key}>{heart(88, 84, 7, fill(ctx, PINK), 1, cls(ctx, "sui-f-beat"))}</g>;
    case "blush":
      return ctx.colored ? (
        <g key={key} fill={PINK} opacity="0.85"><ellipse cx="28" cy="68" rx="8" ry="5" /><ellipse cx="88" cy="68" rx="8" ry="5" /></g>
      ) : (
        <g key={key} {...s} strokeWidth={3}><path d="M23 66 l6 -3 M24 73 l6 -3 M93 63 l-6 -3 M92 70 l-6 -3" /></g>
      );
    case "cheeks":
      return <g key={key} {...s} strokeWidth={3.5}><path d="M24 66 l6 -3 M25 73 l6 -3 M92 63 l-6 -3 M91 70 l-6 -3" /></g>;
    case "steam":
      return (
        <g key={key} fill={PAPER} stroke={INK} strokeWidth="3.5">
          <path className={cls(ctx, "sui-f-puff")} d="M20 82 a7 7 0 1 1 8 -8 a6 6 0 1 1 6 8 Z" />
          <path className={cls(ctx, "sui-f-puff b")} d="M84 82 a6 6 0 1 1 6 -8 a7 7 0 1 1 8 8 Z" />
        </g>
      );
    case "thermometer":
      return (
        <g key={key}>
          <path d="M66 78 L94 98" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M66 78 L94 98" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />
          <circle cx="96" cy="99" r="6" fill={fill(ctx, PINK)} stroke={INK} strokeWidth="3" />
        </g>
      );
    case "bandage":
      return (
        <g key={key}>
          <path d="M18 34 Q58 6 98 34 L96 44 Q58 18 20 44 Z" fill={PAPER} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M80 22 v10 M75 27 h10" stroke={fill(ctx, PINK)} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "tissue":
      return <path key={key} d="M48 64 Q58 56 70 64 L74 86 Q60 92 46 86 Z" fill={PAPER} stroke={INK} strokeWidth="4" strokeLinejoin="round" className={cls(ctx, "sui-f-wave")} />;
    case "cowboy":
      return (
        <g key={key}>
          <path d="M6 30 Q58 44 110 30 Q100 40 58 42 Q16 40 6 30 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M30 32 Q30 6 44 8 Q58 14 72 8 Q86 6 86 32 Q58 38 30 32 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M31 27 Q58 33 85 27" stroke={INK} strokeWidth="4" fill="none" />
        </g>
      );
    case "party":
      return (
        <g key={key}>
          <path d="M70 22 L92 -6 L98 30 Z" fill={fill(ctx, LIME)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="92" cy="-6" r="4" fill={fill(ctx, PINK)} stroke={INK} strokeWidth="3" />
          <path className={cls(ctx, "sui-f-wave")} d="M66 82 L98 92" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M66 82 L98 92" stroke={fill(ctx, PINK)} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "disguise":
      return (
        <g key={key}>
          <circle cx={L} cy={EY} r="11" fill="none" stroke={INK} strokeWidth="5" />
          <circle cx={R} cy={EY} r="11" fill="none" stroke={INK} strokeWidth="5" />
          <path d="M33 32 Q43 26 53 32 M63 32 Q73 26 83 32" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="58" cy="64" rx="9" ry="8" fill={fill(ctx, PINK)} stroke={INK} strokeWidth="4" />
          <path d="M38 76 Q48 70 58 75 Q68 70 78 76 Q68 82 58 78 Q48 82 38 76 Z" fill={INK} />
        </g>
      );
    case "hand-mouth":
      return <path key={key} d="M38 72 Q38 62 48 66 L56 66 Q66 60 74 66 Q82 74 76 90 Q60 100 44 92 Q34 84 38 72 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
    case "hand-chin":
      return (
        <g key={key} className={cls(ctx, "sui-f-wave")}>
          <path d="M38 104 Q30 90 40 84 L52 86 Q60 78 54 70 Q60 66 64 74 Q70 86 60 98 Q50 108 38 104 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>
      );
    case "salute":
      return (
        <g key={key} className={cls(ctx, "sui-f-wave")}>
          <path d="M66 32 L100 20 Q108 22 104 30 L74 44 Q64 44 66 32 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>
      );
    case "hugs":
      return (
        <g key={key} fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path className={cls(ctx, "sui-f-wave")} d="M8 88 Q10 74 24 76 Q36 80 34 92 Q26 102 14 98 Q8 96 8 88 Z" />
          <path className={cls(ctx, "sui-f-wave")} d="M108 88 Q106 74 92 76 Q80 80 82 92 Q90 102 102 98 Q108 96 108 88 Z" />
        </g>
      );
    case "shush":
      return <path key={key} d="M54 100 L54 72 Q54 64 60 64 Q66 64 66 72 L66 100 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
    case "peek":
      return (
        <g key={key} fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path d="M14 30 Q30 18 52 26 L54 46 Q40 44 30 52 L18 70 Q8 50 14 30 Z" />
          <path d="M62 64 Q80 52 102 60 L104 82 Q86 96 64 88 Z" />
        </g>
      );
    case "clouds":
      return (
        <g key={key} fill={PAPER} stroke={INK} strokeWidth="4" className={cls(ctx, "sui-f-float")}>
          <path d="M6 70 a12 12 0 0 1 14 -18 a16 16 0 0 1 30 -4 a14 14 0 0 1 22 10 a10 10 0 0 1 -2 20 H14 a8 8 0 0 1 -8 -8 Z" />
        </g>
      );
    case "exhale":
      return (
        <g key={key} fill={PAPER} stroke={INK} strokeWidth="3.5" className={cls(ctx, "sui-f-puff")}>
          <path d="M80 84 a6 6 0 0 1 8 -6 a7 7 0 0 1 12 2 a6 6 0 0 1 -2 10 H84 a5 5 0 0 1 -4 -6 Z" />
        </g>
      );
    case "nose":
      return (
        <g key={key}>
          <path d="M60 62 L104 64" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M60 62 L104 64" stroke={fill(ctx, FACE)} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "shake":
      return <g key={key} {...s} fill="none"><path d="M8 44 Q2 60 8 76 M16 40 Q10 60 16 80 M108 44 Q114 60 108 76 M100 40 Q106 60 100 80" /></g>;
    case "melt":
      return <path key={key} d="M14 74 Q10 100 24 104 Q36 106 44 100 Q54 110 68 104 Q80 112 96 102 Q108 92 104 72 Z" fill={ctx.face} stroke={INK} strokeWidth="5" strokeLinejoin="round" className={cls(ctx, "sui-f-pulse")} />;
    case "explode":
      return (
        <g key={key} className={cls(ctx, "sui-f-pulse")}>
          <path d="M20 26 L28 0 L42 18 L56 -6 L66 16 L82 -2 L86 22 L106 14 L94 34 Z" fill={fill(ctx, ORANGE)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>
      );
    case "horns":
      return (
        <g key={key} fill={ctx.face} stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path d="M26 30 Q10 14 14 0 Q24 16 40 20 Z" />
          <path d="M90 30 Q106 14 102 0 Q92 16 76 20 Z" />
        </g>
      );
    case "mask":
      return (
        <g key={key}>
          <path d="M16 62 Q22 60 30 64 M100 62 Q94 60 86 64" stroke={INK} strokeWidth="3" fill="none" />
          <path d="M30 64 Q58 56 86 64 L84 86 Q58 100 32 86 Z" fill={PAPER} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M36 72 Q58 66 80 72 M36 80 Q58 74 80 80" stroke={INK} strokeWidth="2.5" fill="none" />
        </g>
      );
    case "icicles":
      return <path key={key} d="M38 100 l4 10 l4 -10 M54 103 l4 12 l4 -12 M70 101 l4 9 l4 -9" fill={fill(ctx, BLUE)} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
    case "vomit":
      return <path key={key} className={cls(ctx, "sui-f-wave")} d="M48 84 Q46 104 34 116 L84 116 Q70 104 68 84 Z" fill={fill(ctx, LIME)} stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
    case "dizzy":
      return <g key={key} className={cls(ctx, "sui-f-twirl")}>{[star(30, 12, 6, fill(ctx, ORANGE), 1), star(86, 10, 6, fill(ctx, ORANGE), 2), star(58, 2, 5, fill(ctx, ORANGE), 3)]}</g>;
    case "symbols":
      return (
        <g key={key}>
          <rect x="34" y="70" width="48" height="20" rx="4" fill={INK} />
          <text x="58" y="85" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontWeight="900" fontSize="14" fill={fill(ctx, ORANGE)}>#!@%</text>
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* The face                                                            */
/* ------------------------------------------------------------------ */

export function Face({ def, animated = false, colored = false, size = 96, title }: FaceProps & { def: FaceDef }) {
  const face = colored ? (def.tint ?? FACE) : PAPER;
  const ctx: Ctx = { colored, anim: animated, face };
  const extras = def.extras ?? [];
  const motion = animated ? `sui-f-${def.motion ?? "bob"}` : undefined;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -10 132 132" width={size} height={size} role="img" aria-label={title ?? def.name} className={animated ? "sui-f" : undefined}>
      {animated && <style>{CSS}</style>}
      <g className={motion}>
        <g transform={def.flip ? "rotate(180 58 60)" : undefined}>
          {extras.filter((x) => BEHIND.has(x)).map((x, i) => extraPart(x, ctx, `b${i}`))}
          <circle cx="64" cy="66" r="44" fill={INK} />
          <circle cx="58" cy="60" r="44" fill={face} stroke={INK} strokeWidth="6" strokeDasharray={def.dashed ? "10 7" : undefined} />
          {browsPart(def.brows)}
          {eyesPart(def, ctx)}
          {mouthPart(def, ctx)}
          {extras.filter((x) => !BEHIND.has(x)).map((x, i) => extraPart(x, ctx, `f${i}`))}
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The faces, in Unicode order (Smileys group)                        */
/* ------------------------------------------------------------------ */

export const faceDefs: FaceDef[] = [
  // face-smiling
  { slug: "grinning", name: "Grinning", char: "😀", eyes: "dot", mouth: "beam", motion: "bounce" },
  { slug: "grin-smiling-eyes", name: "Grin with smiling eyes", char: "😄", eyes: "happy", mouth: "laugh", motion: "bounce" },
  { slug: "beaming", name: "Beaming", char: "😁", eyes: "happy", mouth: "beam", motion: "bounce" },
  { slug: "laughing", name: "Laughing", char: "😆", eyes: "squint", mouth: "laugh", motion: "shake" },
  { slug: "grin-sweat", name: "Grin with sweat", char: "😅", eyes: "happy", mouth: "laugh", extras: ["sweat"], motion: "bob" },
  { slug: "rofl", name: "Rolling on the floor laughing", char: "🤣", eyes: "squint", mouth: "laugh", extras: ["tears-joy"], motion: "spin" },
  { slug: "joy", name: "Tears of joy", char: "😂", eyes: "squint", mouth: "laugh", extras: ["tears-joy"], motion: "shake" },
  { slug: "slight-smile", name: "Slightly smiling", char: "🙂", eyes: "dot", mouth: "small-smile" },
  { slug: "upside-down", name: "Upside down", char: "🙃", eyes: "dot", mouth: "small-smile", flip: true, motion: "tilt" },
  { slug: "melting", name: "Melting", char: "🫠", eyes: "dot", mouth: "small-smile", extras: ["melt"], motion: "float" },
  { slug: "wink", name: "Wink", char: "😉", eyes: ["dot", "happy"], mouth: "smile", motion: "tilt" },
  { slug: "smiling-eyes", name: "Smiling eyes", char: "😊", eyes: "happy", mouth: "smile", extras: ["blush"] },
  { slug: "halo", name: "Halo", char: "😇", eyes: "happy", mouth: "smile", extras: ["halo"], motion: "float" },
  // face-affection
  { slug: "smiling-hearts", name: "Smiling with hearts", char: "🥰", eyes: "happy", mouth: "smile", extras: ["blush", "hearts"] },
  { slug: "heart-eyes", name: "Heart eyes", char: "😍", eyes: "heart", mouth: "beam", motion: "pulse" },
  { slug: "star-struck", name: "Star-struck", char: "🤩", eyes: "star", mouth: "beam", motion: "bounce" },
  { slug: "blowing-kiss", name: "Blowing a kiss", char: "😘", eyes: ["happy", "closed"], mouth: "kiss", extras: ["kiss-heart"] },
  { slug: "kissing", name: "Kissing", char: "😗", eyes: "dot", mouth: "kiss" },
  { slug: "relaxed", name: "Smiling", char: "☺️", eyes: "closed", mouth: "smile", extras: ["blush"] },
  { slug: "kissing-closed-eyes", name: "Kissing, closed eyes", char: "😚", eyes: "closed", mouth: "kiss", extras: ["blush"] },
  { slug: "kissing-smiling-eyes", name: "Kissing, smiling eyes", char: "😙", eyes: "happy", mouth: "kiss" },
  { slug: "smiling-tear", name: "Smiling with tear", char: "🥲", eyes: "happy", mouth: "small-smile", extras: ["tear"] },
  // face-tongue
  { slug: "yum", name: "Savoring food", char: "😋", eyes: "happy", mouth: "tongue-side", extras: ["blush"] },
  { slug: "tongue-out", name: "Tongue out", char: "😛", eyes: "dot", mouth: "tongue" },
  { slug: "winking-tongue", name: "Winking with tongue", char: "😜", eyes: ["dot", "squint"], mouth: "tongue-side", motion: "tilt" },
  { slug: "zany", name: "Zany", char: "🤪", eyes: ["wide", "small"], mouth: "tongue-side", brows: "raised", motion: "shake" },
  { slug: "squinting-tongue", name: "Squinting with tongue", char: "😝", eyes: "squint", mouth: "tongue", motion: "shake" },
  { slug: "money-mouth", name: "Money mouth", char: "🤑", eyes: "money", mouth: "tongue", tongue: LIME, motion: "bounce" },
  // face-hand
  { slug: "hugging", name: "Hugging", char: "🤗", eyes: "happy", mouth: "smile", extras: ["hugs"] },
  { slug: "hand-over-mouth", name: "Hand over mouth", char: "🤭", eyes: "happy", mouth: "none", extras: ["hand-mouth", "blush"] },
  { slug: "gasp", name: "Open eyes, hand over mouth", char: "🫢", eyes: "wide", mouth: "none", extras: ["hand-mouth"], motion: "tremble" },
  { slug: "peeking", name: "Peeking", char: "🫣", eyes: ["none", "dot"], mouth: "o", extras: ["peek"], motion: "tremble" },
  { slug: "shushing", name: "Shushing", char: "🤫", eyes: "dot", mouth: "kiss", brows: "raised", extras: ["shush"] },
  { slug: "thinking", name: "Thinking", char: "🤔", eyes: ["dot", "small"], mouth: "diagonal", brows: "raised", extras: ["hand-chin"], motion: "tilt" },
  { slug: "saluting", name: "Saluting", char: "🫡", eyes: "dot", mouth: "flat", extras: ["salute"] },
  // face-neutral-skeptical
  { slug: "zipper-mouth", name: "Zipper mouth", char: "🤐", eyes: "dot", mouth: "zip" },
  { slug: "raised-eyebrow", name: "Raised eyebrow", char: "🤨", eyes: ["lidded", "dot"], mouth: "flat", brows: "raised" },
  { slug: "neutral", name: "Neutral", char: "😐", eyes: "dot", mouth: "flat" },
  { slug: "expressionless", name: "Expressionless", char: "😑", eyes: "flat", mouth: "flat" },
  { slug: "no-mouth", name: "No mouth", char: "😶", eyes: "dot", mouth: "none" },
  { slug: "dotted-line", name: "Dotted line", char: "🫥", eyes: "dot", mouth: "flat", dashed: true, motion: "float" },
  { slug: "in-clouds", name: "In clouds", char: "😶‍🌫️", eyes: "closed", mouth: "none", extras: ["clouds"] },
  { slug: "smirk", name: "Smirk", char: "😏", eyes: ["lidded-side", "lidded-side"], mouth: "smirk", motion: "tilt" },
  { slug: "unamused", name: "Unamused", char: "😒", eyes: ["lidded-side", "lidded-side"], mouth: "slight-frown" },
  { slug: "rolling-eyes", name: "Rolling eyes", char: "🙄", eyes: "roll", mouth: "flat", motion: "tilt" },
  { slug: "grimacing", name: "Grimacing", char: "😬", eyes: "dot", mouth: "grimace", motion: "tremble" },
  { slug: "exhaling", name: "Exhaling", char: "😮‍💨", eyes: "closed", mouth: "o", extras: ["exhale"] },
  { slug: "lying", name: "Lying", char: "🤥", eyes: ["lidded-side", "lidded-side"], mouth: "smirk", extras: ["nose"] },
  { slug: "shaking", name: "Shaking", char: "🫨", eyes: "wide", mouth: "big-o", extras: ["shake"], motion: "shake" },
  // face-sleepy
  { slug: "relieved", name: "Relieved", char: "😌", eyes: "closed", mouth: "small-smile", extras: ["blush"], motion: "float" },
  { slug: "pensive", name: "Pensive", char: "😔", eyes: "closed", mouth: "slight-frown", brows: "sad" },
  { slug: "sleepy", name: "Sleepy", char: "😪", eyes: "closed", mouth: "o", extras: ["sweat"] },
  { slug: "drooling", name: "Drooling", char: "🤤", eyes: "closed", mouth: "smile", extras: ["drool"] },
  { slug: "sleeping", name: "Sleeping", char: "😴", eyes: "closed", mouth: "o", extras: ["zzz"], motion: "float" },
  // face-unwell
  { slug: "medical-mask", name: "Medical mask", char: "😷", eyes: "dot", mouth: "none", extras: ["mask"] },
  { slug: "thermometer", name: "Thermometer", char: "🤒", eyes: "tired", mouth: "none", extras: ["thermometer"], motion: "tremble" },
  { slug: "head-bandage", name: "Head bandage", char: "🤕", eyes: "tired", mouth: "slight-frown", extras: ["bandage"] },
  { slug: "nauseated", name: "Nauseated", char: "🤢", eyes: "closed", mouth: "wavy", tint: LIME, motion: "tremble" },
  { slug: "vomiting", name: "Vomiting", char: "🤮", eyes: "squint", mouth: "big-o", tint: LIME, extras: ["vomit"], motion: "shake" },
  { slug: "sneezing", name: "Sneezing", char: "🤧", eyes: "squint", mouth: "none", extras: ["tissue"], motion: "shake" },
  { slug: "hot", name: "Hot", char: "🥵", eyes: "tired", mouth: "tongue", tint: ORANGE, extras: ["sweat"], motion: "tremble" },
  { slug: "cold", name: "Cold", char: "🥶", eyes: "wide", mouth: "grimace", tint: BLUE, extras: ["icicles"], motion: "tremble" },
  { slug: "woozy", name: "Woozy", char: "🥴", eyes: ["dot", "closed"], mouth: "wavy", extras: ["blush"], motion: "tilt" },
  { slug: "dizzy", name: "Dizzy", char: "😵", eyes: "cross", mouth: "o", extras: ["dizzy"], motion: "tilt" },
  { slug: "spiral-eyes", name: "Spiral eyes", char: "😵‍💫", eyes: "spiral", mouth: "wavy", motion: "tilt" },
  { slug: "exploding-head", name: "Exploding head", char: "🤯", eyes: "wide", mouth: "big-o", extras: ["explode"], motion: "pulse" },
  // face-hat
  { slug: "cowboy", name: "Cowboy hat", char: "🤠", eyes: "dot", mouth: "beam", extras: ["cowboy"], motion: "tilt" },
  { slug: "partying", name: "Partying", char: "🥳", eyes: "happy", mouth: "small-smile", extras: ["party"], motion: "bounce" },
  { slug: "disguised", name: "Disguised", char: "🥸", eyes: "dot", mouth: "small-smile", extras: ["disguise"], motion: "tilt" },
  // face-glasses
  { slug: "sunglasses", name: "Sunglasses", char: "😎", eyes: "sunglasses", mouth: "smile", motion: "tilt" },
  { slug: "nerd", name: "Nerd", char: "🤓", eyes: "nerd", mouth: "beam", motion: "bounce" },
  { slug: "monocle", name: "Monocle", char: "🧐", eyes: ["lidded", "monocle"], mouth: "flat", brows: "raised" },
  // face-concerned
  { slug: "confused", name: "Confused", char: "😕", eyes: "dot", mouth: "diagonal", motion: "tilt" },
  { slug: "diagonal-mouth", name: "Diagonal mouth", char: "🫤", eyes: "dot", mouth: "diagonal" },
  { slug: "worried", name: "Worried", char: "😟", eyes: "dot", mouth: "frown", brows: "worried" },
  { slug: "slight-frown", name: "Slightly frowning", char: "🙁", eyes: "dot", mouth: "slight-frown" },
  { slug: "frowning", name: "Frowning", char: "☹️", eyes: "dot", mouth: "frown" },
  { slug: "open-mouth", name: "Open mouth", char: "😮", eyes: "dot", mouth: "o" },
  { slug: "hushed", name: "Hushed", char: "😯", eyes: "dot", mouth: "o", brows: "raised" },
  { slug: "astonished", name: "Astonished", char: "😲", eyes: "wide", mouth: "big-o", motion: "tremble" },
  { slug: "flushed", name: "Flushed", char: "😳", eyes: "wide", mouth: "flat", extras: ["blush"], motion: "tremble" },
  { slug: "pleading", name: "Pleading", char: "🥺", eyes: "plead", mouth: "slight-frown", brows: "worried", motion: "pulse" },
  { slug: "holding-back-tears", name: "Holding back tears", char: "🥹", eyes: "plead", mouth: "small-smile", extras: ["holding-tears"], motion: "tremble" },
  { slug: "frowning-open-mouth", name: "Frowning, open mouth", char: "😦", eyes: "dot", mouth: "open-frown" },
  { slug: "anguished", name: "Anguished", char: "😧", eyes: "dot", mouth: "open-frown", brows: "worried" },
  { slug: "fearful", name: "Fearful", char: "😨", eyes: "wide", mouth: "open-frown", brows: "worried", extras: ["tear-pool"], motion: "tremble" },
  { slug: "anxious-sweat", name: "Anxious with sweat", char: "😰", eyes: "wide", mouth: "open-frown", brows: "worried", extras: ["sweat"], motion: "tremble" },
  { slug: "sad-relieved", name: "Sad but relieved", char: "😥", eyes: "closed", mouth: "slight-frown", brows: "worried", extras: ["sweat"] },
  { slug: "crying", name: "Crying", char: "😢", eyes: "closed", mouth: "frown", brows: "worried", extras: ["tear"] },
  { slug: "scream", name: "Screaming in fear", char: "😱", eyes: "wide", mouth: "scream", extras: ["shake"], motion: "shake" },
  { slug: "confounded", name: "Confounded", char: "😖", eyes: "squint", mouth: "wavy", motion: "shake" },
  { slug: "persevering", name: "Persevering", char: "😣", eyes: "squint", mouth: "grimace", motion: "tremble" },
  { slug: "disappointed", name: "Disappointed", char: "😞", eyes: "closed", mouth: "frown", brows: "sad" },
  { slug: "downcast-sweat", name: "Downcast with sweat", char: "😓", eyes: "closed", mouth: "frown", extras: ["sweat"] },
  { slug: "weary", name: "Weary", char: "😩", eyes: "squint", mouth: "open-frown", brows: "worried", motion: "sob" },
  { slug: "tired", name: "Tired", char: "😫", eyes: "squint", mouth: "big-o", brows: "worried", motion: "sob" },
  { slug: "yawning", name: "Yawning", char: "🥱", eyes: "closed", mouth: "scream", motion: "pulse" },
  // face-negative
  { slug: "triumph", name: "Steam from nose", char: "😤", eyes: "squint", mouth: "frown", brows: "angry", extras: ["steam"] },
  { slug: "pouting", name: "Pouting", char: "😡", eyes: "dot", mouth: "frown", brows: "angry", tint: PINK, motion: "tremble" },
  { slug: "angry", name: "Angry", char: "😠", eyes: "dot", mouth: "frown", brows: "angry", tint: ORANGE, motion: "tremble" },
  { slug: "cursing", name: "Cursing", char: "🤬", eyes: "dot", mouth: "none", brows: "angry", tint: PINK, extras: ["symbols"], motion: "shake" },
  { slug: "smiling-horns", name: "Smiling with horns", char: "😈", eyes: "lidded", mouth: "smile", brows: "angry", tint: VIOLET, extras: ["horns"], motion: "tilt" },
  { slug: "angry-horns", name: "Angry with horns", char: "👿", eyes: "dot", mouth: "frown", brows: "angry", tint: VIOLET, extras: ["horns"], motion: "tremble" },
];
