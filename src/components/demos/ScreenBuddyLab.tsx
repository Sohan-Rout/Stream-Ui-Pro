"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Heart, Music, Rocket, Star } from "lucide-react";
import { cn } from "@streamuilib/react";

export type BuddyExpression = "idle" | "happy" | "love" | "wink" | "surprised" | "sleepy" | "sad";
export type ScreenAnimation = "bounce" | "float" | "wiggle" | "pulse" | "spin" | "none";
type Glow = "amber" | "lime" | "pink" | "blue" | "violet";

export type ScreenBuddyProps = {
  /** One thing to show on the screen, glowing: any icon or SVG. Overrides the eyes. */
  content?: ReactNode;
  /** Things to cycle through on the screen instead of the eyes. */
  faces?: ReactNode[];
  /** The eye expressions to cycle through (when there's no content or faces). */
  expressions?: BuddyExpression[];
  /** Milliseconds between expressions or faces; 0 stops the cycle (taps still change it). */
  interval?: number;
  /** How icons or SVGs on the screen move. The eyes have their own life. */
  animation?: ScreenAnimation;
  /** The bezel's glow. */
  glow?: Glow;
  /** Edge of the cube, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const GLOWS: Record<Glow, [string, string]> = {
  amber: ["oklch(0.72 0.19 50)", "oklch(0.88 0.17 85)"],
  lime: ["oklch(0.78 0.2 135)", "oklch(0.93 0.2 120)"],
  pink: ["oklch(0.68 0.21 355)", "oklch(0.84 0.13 350)"],
  blue: ["oklch(0.68 0.15 235)", "oklch(0.86 0.1 215)"],
  violet: ["oklch(0.62 0.18 295)", "oklch(0.82 0.11 300)"],
};

const ALL_EXPRESSIONS: BuddyExpression[] = ["idle", "happy", "love", "wink", "surprised", "sleepy", "sad"];

/** The body's off-white and the darker tones its sides and dial take. */
const BODY = "oklch(0.96 0.006 90)";
const SIDE = "oklch(0.86 0.01 90)";
const SCREEN = "oklch(0.2 0.035 20)";

/** One glowing eye, in the shape its expression asks for. */
function Eye({ shape, side }: { shape: BuddyExpression; side: "l" | "r" }) {
  const glow = "drop-shadow(0 0 0.35em rgb(255 255 255 / 0.85))";
  if (shape === "happy" || (shape === "wink" && side === "r")) {
    // An arc, like ^.
    return <span className="block h-[0.55em] w-[1.15em] rounded-t-full border-[0.24em] border-b-0 border-white" style={{ filter: glow }} />;
  }
  if (shape === "sad") {
    return <span className="block h-[0.5em] w-[1em] translate-y-[0.3em] rounded-b-full border-[0.22em] border-t-0 border-white" style={{ filter: glow }} />;
  }
  if (shape === "sleepy") {
    return <span className="block h-[0.22em] w-[1.1em] rounded-full bg-white" style={{ filter: glow }} />;
  }
  if (shape === "love") {
    return (
      <svg viewBox="0 0 24 22" className="buddy-beat block w-[1.3em]" style={{ filter: glow }}>
        <path d="M12 21s-9-5.6-9-12.2C3 5 5.6 2.5 8.6 2.5c1.6 0 2.8.7 3.4 1.9.6-1.2 1.8-1.9 3.4-1.9 3 0 5.6 2.5 5.6 6.3C21 15.4 12 21 12 21z" fill="white" />
      </svg>
    );
  }
  if (shape === "surprised") {
    return <span className="block size-[1.15em] rounded-full border-[0.22em] border-white" style={{ filter: glow }} />;
  }
  // idle, and the open eye of a wink: a dot that blinks and glances.
  return <span className="buddy-blink block size-[0.95em] rounded-full bg-white" style={{ filter: glow }} />;
}

/** Both eyes, plus the little extras some expressions carry (z's, a tear). */
function Eyes({ expression }: { expression: BuddyExpression }) {
  return (
    <span className={cn("relative flex items-center gap-[1.15em]", expression === "idle" && "buddy-glance")}>
      <Eye shape={expression} side="l" />
      <Eye shape={expression} side="r" />
      {expression === "sleepy" && (
        <span aria-hidden className="buddy-zzz absolute -top-[1.4em] -right-[1.2em] font-mono text-[0.7em] font-bold text-white">
          z
        </span>
      )}
      {expression === "sad" && <span aria-hidden className="buddy-tear absolute top-[1.1em] left-[0.35em] block h-[0.5em] w-[0.32em] rounded-b-full bg-[oklch(0.8_0.1_230)]" />}
    </span>
  );
}

/**
 * Screen buddy: a soft, rounded cube of a device with a big dark screen for
 * a face, framed by a glowing bezel that opens on one side, and a dial on its
 * flank. Its two glowing eyes blink, glance about, and change expression; or
 * hand it any icon or SVG to show. It's real CSS 3D (the rounded body is
 * stacked slices, so the corners stay round in depth), tilts toward the
 * pointer, and hops when tapped. The whole buddy is one button.
 */
export function ScreenBuddy({
  content,
  faces,
  expressions = ALL_EXPRESSIONS,
  interval = 2600,
  animation = "float",
  glow = "amber",
  size = 200,
  label = "Screen buddy",
}: ScreenBuddyProps) {
  const S = size;
  const DEPTH = Math.round(S * 0.42);
  const SLICES = 14;
  const items: ReactNode[] | null = content ? [content] : (faces ?? null);
  const count = items ? items.length : expressions.length;
  const [index, setIndex] = useState(0);
  const [hops, setHops] = useState(0);
  const [tilt, setTilt] = useState({ x: -12, y: -30 });
  const statusId = useId();
  const reduce = useRef(false);
  const [from, to] = GLOWS[glow];

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Cycle on a timer; a tap restarts the wait.
  useEffect(() => {
    if (!interval || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(t);
  }, [interval, count, hops]);

  const at = index % count;
  const expression = expressions[at % expressions.length];

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -12 - dy * 16, y: -30 + dx * 44 });
  };

  const radius = "26%";

  return (
    <button
      type="button"
      aria-label={`${label}. Tap to change its face.`}
      aria-describedby={statusId}
      onClick={() => {
        setIndex((i) => (i + 1) % count);
        setHops((n) => n + 1);
      }}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: -12, y: -30 })}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: S * 1.75, height: S * 1.5, perspective: 1200 }}
    >
      <style href="screen-buddy" precedence="default">{`
        @keyframes buddy-hop { 0%, 100% { translate: 0 0; } 35% { translate: 0 -14%; } 55% { translate: 0 0; } 72% { translate: 0 -4%; } }
        @keyframes buddy-blink { 0%, 92%, 100% { scale: 1 1; } 95% { scale: 1 0.1; } }
        @keyframes buddy-glance { 0%, 30%, 100% { translate: 0 0; } 40%, 55% { translate: -0.45em 0; } 65%, 80% { translate: 0.45em -0.1em; } }
        @keyframes buddy-beat { 0%, 100% { scale: 1; } 25% { scale: 1.18; } 40% { scale: 0.96; } 55% { scale: 1.1; } }
        @keyframes buddy-zzz { 0% { opacity: 0; translate: 0 0.4em; } 30% { opacity: 1; } 100% { opacity: 0; translate: 0.5em -0.9em; } }
        @keyframes buddy-tear { 0%, 20% { opacity: 0; translate: 0 0; } 40% { opacity: 1; } 100% { opacity: 0; translate: 0 1.2em; } }
        @keyframes buddy-in { from { opacity: 0; scale: 0.6; } 70% { scale: 1.06; } to { opacity: 1; scale: 1; } }
        @keyframes buddy-bounce { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8%; } }
        @keyframes buddy-float { 0%, 100% { translate: 0 4%; } 50% { translate: 0 -4%; } }
        @keyframes buddy-wiggle { 0%, 100% { rotate: -8deg; } 50% { rotate: 8deg; } }
        @keyframes buddy-pulse { 0%, 100% { scale: 1; } 50% { scale: 1.12; } }
        @keyframes buddy-spin { to { rotate: 360deg; } }
        @keyframes buddy-hum { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        .buddy-hop { animation: buddy-hop 520ms cubic-bezier(.3,0,.4,1); }
        .buddy-blink { animation: buddy-blink 3.6s ease-in-out infinite; }
        .buddy-glance { animation: buddy-glance 5.2s ease-in-out infinite; }
        .buddy-beat { animation: buddy-beat 1.1s ease-in-out infinite; }
        .buddy-zzz { animation: buddy-zzz 1.8s ease-out infinite; }
        .buddy-tear { animation: buddy-tear 1.8s ease-in infinite; }
        .buddy-in { animation: buddy-in 340ms cubic-bezier(.2,.9,.3,1.3) both; }
        .buddy-a-bounce { animation: buddy-bounce 1.4s ease-in-out infinite; }
        .buddy-a-float { animation: buddy-float 2.6s ease-in-out infinite; }
        .buddy-a-wiggle { animation: buddy-wiggle 1.2s ease-in-out infinite; }
        .buddy-a-pulse { animation: buddy-pulse 1.2s ease-in-out infinite; }
        .buddy-a-spin { animation: buddy-spin 3s linear infinite; }
        .buddy-hum { animation: buddy-hum 2.4s ease-in-out infinite; }
        .buddy-box { transition: transform 180ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .buddy-hop, .buddy-blink, .buddy-glance, .buddy-beat, .buddy-zzz, .buddy-tear, .buddy-in, .buddy-a-bounce,
          .buddy-a-float, .buddy-a-wiggle, .buddy-a-pulse, .buddy-a-spin, .buddy-hum { animation: none; }
          .buddy-box { transition: none; }
        }
      `}</style>

      {/* A soft shadow on the ground under it. */}
      <span aria-hidden className="absolute bottom-[4%] left-1/2 block h-[9%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-sm" />

      {/* Keyed by taps so each tap replays the hop. */}
      <div key={hops} className={cn(hops > 0 && "buddy-hop")} style={{ width: S, height: S }}>
        <div
          className="buddy-box relative"
          style={{ width: S, height: S, transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* The body's depth: rounded slices stacked back to front, so the corners stay round.
              Only the back slice is inked; the rest blend from the side's grey toward the face's white. */}
          {Array.from({ length: SLICES }, (_, i) => {
            const z = -DEPTH / 2 + (i * DEPTH) / (SLICES - 1);
            const back = i === 0;
            const shade = `color-mix(in oklab, ${SIDE} ${100 - (i / (SLICES - 1)) * 55}%, ${BODY})`;
            return (
              <span
                key={i}
                aria-hidden
                className="absolute inset-0 block border-[3px]"
                style={{ borderRadius: radius, transform: `translateZ(${z}px)`, background: shade, borderColor: back ? "var(--ink)" : shade }}
              />
            );
          })}

          {/* The dial on its right flank: a short stack of discs standing off the side. */}
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={`dial-${i}`}
              aria-hidden
              className="absolute block rounded-full border-[3px] border-ink"
              style={{
                width: S * 0.3,
                height: S * 0.3,
                left: S - S * 0.15 - 3,
                top: S * 0.38,
                transform: `rotateY(90deg) translateZ(${S * 0.15 + 4 + i * 3}px)`,
                background: i === 5 ? BODY : SIDE,
                backgroundImage: i === 5 ? `repeating-conic-gradient(${BODY} 0 12deg, ${SIDE} 12deg 24deg)` : undefined,
              }}
            />
          ))}

          {/* The front: the bezel, its glow, and the screen. */}
          <div
            className="absolute inset-0 border-[3px] border-ink"
            style={{ borderRadius: radius, transform: `translateZ(${DEPTH / 2 + 0.5}px)`, background: BODY }}
          >
            {/* The glowing bezel: a C that opens on the right, with a soft halo. */}
            <span
              aria-hidden
              className="buddy-hum absolute inset-[7%] block"
              style={{
                borderRadius: "22%",
                // 0° is the top: bright along the top, deep along the bottom-left, and open on the right.
                background: `conic-gradient(${to} 0deg 30deg, ${BODY} 55deg 125deg, ${to} 150deg, ${from} 205deg 245deg, ${to} 320deg 360deg)`,
                boxShadow: `0 0 ${S * 0.08}px ${from}, inset 0 0 0 3px var(--ink)`,
              }}
            />
            {/* The screen. */}
            <div
              className="absolute inset-[15%] grid place-items-center overflow-hidden border-[3px] border-ink"
              style={{
                borderRadius: "16%",
                background: SCREEN,
                backgroundImage: `radial-gradient(transparent 55%, rgb(0 0 0 / 0.55)), linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)`,
                backgroundSize: `100% 100%, ${S * 0.085}px ${S * 0.085}px, ${S * 0.085}px ${S * 0.085}px`,
                backgroundPosition: "center",
                fontSize: S * 0.13,
              }}
            >
              <span key={at} className="buddy-in relative grid place-items-center text-white" style={{ width: "60%", height: "60%" }}>
                {items ? (
                  <span
                    className={cn("grid size-full place-items-center [&>svg]:size-full", animation !== "none" && `buddy-a-${animation}`)}
                    style={{ filter: "drop-shadow(0 0 0.25em rgb(255 255 255 / 0.6))" }}
                  >
                    {items[at]}
                  </span>
                ) : (
                  <Eyes expression={expression} />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {items ? `Showing ${at + 1} of ${items.length}` : `Looking ${expression}`}
      </span>
    </button>
  );
}

/** A custom SVG for the demo: a little pixel ghost, in currentColor. */
function PixelGhost() {
  const rows = ["..XXXX..", ".XXXXXX.", "XX.XX.XX", "XXXXXXXX", "XXXXXXXX", "XXXXXXXX", "X.XX.XX.", "........"];
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" role="img" aria-label="Pixel ghost">
      {rows.flatMap((row, y) => [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null)))}
    </svg>
  );
}

const SHOWS = [
  { id: "eyes", label: "Its eyes" },
  { id: "icon", label: "An icon" },
  { id: "icons", label: "A few icons" },
  { id: "svg", label: "Custom SVG" },
] as const;
const ANIMATIONS: ScreenAnimation[] = ["float", "bounce", "wiggle", "pulse", "spin", "none"];
const GLOW_SWATCHES: Glow[] = ["amber", "lime", "pink", "blue", "violet"];

/** The lab: the buddy, with pickers for what it shows, how icons move, and its glow. */
export function ScreenBuddyLab() {
  const [show, setShow] = useState<(typeof SHOWS)[number]["id"]>("eyes");
  const [animation, setAnimation] = useState<ScreenAnimation>("float");
  const [glow, setGlow] = useState<Glow>("amber");

  const props: ScreenBuddyProps =
    show === "icon"
      ? { content: <Heart strokeWidth={2.5} fill="currentColor" /> }
      : show === "icons"
        ? { faces: [<Star key="s" strokeWidth={2.5} fill="currentColor" />, <Music key="m" strokeWidth={2.5} />, <Rocket key="r" strokeWidth={2.5} />] }
        : show === "svg"
          ? { content: <PixelGhost /> }
          : {};

  const pill = (on: boolean) =>
    cn(
      "border-2 border-ink px-2.5 py-1 font-mono text-xs font-bold uppercase focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
      on ? "bg-ink text-paper" : "bg-paper-raised hover:bg-lime-soft",
    );

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <ScreenBuddy {...props} animation={animation} glow={glow} size={170} />

      <div className="flex flex-col items-center gap-3">
        <div role="group" aria-label="Show" className="flex flex-wrap justify-center gap-2">
          {SHOWS.map((s) => (
            <button key={s.id} type="button" aria-pressed={show === s.id} onClick={() => setShow(s.id)} className={pill(show === s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        {show !== "eyes" && (
          <div role="group" aria-label="Animation" className="flex flex-wrap justify-center gap-2">
            {ANIMATIONS.map((a) => (
              <button key={a} type="button" aria-pressed={animation === a} onClick={() => setAnimation(a)} className={pill(animation === a)}>
                {a}
              </button>
            ))}
          </div>
        )}
        <div role="group" aria-label="Glow" className="flex gap-2">
          {GLOW_SWATCHES.map((g) => (
            <button
              key={g}
              type="button"
              aria-label={`${g} glow`}
              aria-pressed={glow === g}
              onClick={() => setGlow(g)}
              className={cn("size-7 rounded-full border-2 border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue", glow === g && "ring-2 ring-ink ring-offset-2")}
              style={{ background: `linear-gradient(135deg, ${GLOWS[g][1]}, ${GLOWS[g][0]})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
