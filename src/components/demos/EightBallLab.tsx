"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";

/** A pool ball by its number (1 to 15), or the cue ball. */
export type PoolBall = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | "cue";

export type EightBallProps = {
  /** Which pool ball it is: solids 1 to 8, stripes 9 to 15, or the cue ball. */
  ball?: PoolBall;
  /** Its eyes: round (the default) or leaning pills. */
  eyes?: "round" | "pill";
  /** Width of the ball, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

/** The classic set's colours: 1 to 7 (and 9 to 15 as stripes of the same), then the 8. */
const POOL: Record<number, { color: string; light?: boolean }> = {
  1: { color: "oklch(0.85 0.17 90)", light: true },
  2: { color: "oklch(0.47 0.18 260)" },
  3: { color: "oklch(0.56 0.21 28)" },
  4: { color: "oklch(0.43 0.15 305)" },
  5: { color: "oklch(0.7 0.18 50)" },
  6: { color: "oklch(0.5 0.13 155)" },
  7: { color: "oklch(0.38 0.12 20)" },
  8: { color: "oklch(0.17 0.006 270)" },
};
const CUE = "oklch(0.97 0.012 95)";
const WHITE = "oklch(0.99 0 0)";
const INK = "var(--ink)";

/** A ball's paint: its base, its stripe (for 9 to 15), and whether its face needs dark features. */
function paint(ball: PoolBall) {
  if (ball === "cue") return { base: CUE, stripe: null, light: true };
  const solid = POOL[ball > 8 ? ball - 8 : ball];
  return ball > 8 ? { base: WHITE, stripe: solid.color, light: !!solid.light } : { base: solid.color, stripe: null, light: !!solid.light };
}

type Action = "boing" | "spin" | "squish" | "roll" | "wink";

/** The tricks, in turn: what it does, what's announced, how long it lasts. */
const ACTIONS: { id: Action; say: string; ms: number }[] = [
  { id: "boing", say: "Boing! A big happy bounce.", ms: 1100 },
  { id: "spin", say: "It spins all the way around.", ms: 1000 },
  { id: "squish", say: "Squish!", ms: 900 },
  { id: "roll", say: "It rolls away and back.", ms: 1500 },
  { id: "wink", say: "It winks.", ms: 1000 },
];

/** Its voice: short synthesized blips, all above 300 Hz so small speakers play them. */
const SOUNDS: Record<Action, Parameters<typeof blip>[0]> = {
  boing: [
    { f: 320, to: 760, dur: 0.16, type: "sine", gain: 0.07 },
    { f: 760, to: 420, at: 0.17, dur: 0.2, type: "sine", gain: 0.05 },
  ],
  spin: [{ f: 450, to: 1400, dur: 0.4, type: "triangle", gain: 0.05 }],
  squish: [
    { f: 560, to: 340, dur: 0.12, type: "square", gain: 0.03 },
    { f: 340, to: 620, at: 0.13, dur: 0.12, type: "square", gain: 0.025 },
  ],
  // Two balls clacking, then a roll.
  roll: [
    { f: 2400, to: 1800, dur: 0.03, type: "triangle", gain: 0.06 },
    ...Array.from({ length: 7 }, (_, i) => ({ f: 380 + (i % 3) * 40, at: 0.08 + i * 0.09, dur: 0.05, type: "triangle" as const, gain: 0.03 })),
  ],
  wink: [
    { f: 1200, dur: 0.07, type: "sine", gain: 0.05 },
    { f: 1600, at: 0.08, dur: 0.12, type: "sine", gain: 0.045 },
  ],
};

const R = 80;
const BASE = { yaw: 24, pitch: -16 };
/** How far above the ball we look from, for the stripe's curve. */
const ELEVATION = 14;
/** A stripe ball's band reaches this far above and below the equator, in degrees. */
const BAND = 38;

/**
 * Where a point on the ball lands, seen from a little above (the same view
 * as the stripe): `yaw` around it (0 faces you) and `lat` up from its
 * equator, in degrees. `k` is how squarely it faces you (1 head-on, 0 at the
 * edge).
 */
function onSphere(yaw: number, lat: number) {
  const t = (yaw * Math.PI) / 180;
  const l = (lat * Math.PI) / 180;
  const e = (ELEVATION * Math.PI) / 180;
  const x = R * Math.cos(l) * Math.sin(t);
  const y0 = -R * Math.sin(l);
  const z0 = R * Math.cos(l) * Math.cos(t);
  const y = y0 * Math.cos(e) + z0 * Math.sin(e);
  const k = (-y0 * Math.sin(e) + z0 * Math.cos(e)) / R;
  return { x, y, k, angle: (Math.atan2(y, x) * 180) / Math.PI };
}

/**
 * A flat decal stuck to the ball at (yaw, lat): squashed toward the
 * centre as it turns away, faded at the edge, and hidden on the back.
 */
function Decal({ yaw, lat, children }: { yaw: number; lat: number; children: ReactNode }) {
  const s = onSphere(yaw, lat);
  if (s.k <= 0.02) return null;
  return (
    <g transform={`translate(${s.x} ${s.y}) rotate(${s.angle}) scale(${s.k} 1) rotate(${-s.angle})`} opacity={Math.min(1, s.k * 4)}>
      {children}
    </g>
  );
}

/**
 * A stripe ball's band, between latitudes ±`lat`, seen from a little above:
 * the front arcs of its two edge circles, joined well outside the ball and
 * clipped to it.
 */
function bandPath(lat = BAND) {
  const e = (ELEVATION * Math.PI) / 180;
  const l = (lat * Math.PI) / 180;
  const rx = R * Math.cos(l);
  const ry = R * Math.cos(l) * Math.sin(e);
  const top = -R * Math.sin(l) * Math.cos(e);
  const bottom = R * Math.sin(l) * Math.cos(e);
  const far = R * 2;
  return `M${-far} ${top} L${-rx} ${top} A${rx} ${ry} 0 0 0 ${rx} ${top} L${far} ${top} L${far} ${bottom} L${rx} ${bottom} A${rx} ${ry} 0 0 1 ${-rx} ${bottom} L${-far} ${bottom} Z`;
}

/**
 * 8-Ball: a glossy pool-ball mascot in faux 3D, as any ball in the set. Its
 * face is stuck to the surface (and its number sticker to the back), so as it
 * turns the eyes slide across the curve and go round, and the number comes
 * into view. It hovers and bounces with squash and stretch, glances about,
 * turns all the way round now and then, and looks toward the pointer. Each
 * tap is the next trick: a big boing, a spin, a squish, a roll, and a wink.
 * One labelled button.
 */
export function EightBall({ ball = 8, eyes = "round", size = 180, label }: EightBallProps) {
  const [yaw, setYaw] = useState(BASE.yaw);
  const [pitch, setPitch] = useState(BASE.pitch);
  const [action, setAction] = useState<{ id: Action; n: number } | null>(null);
  const [blink, setBlink] = useState(false);
  const [hop, setHop] = useState(0);
  const statusId = useId();
  const gid = useId().replace(/:/g, "");
  const current = useRef(BASE.yaw);
  const frame = useRef(0);
  const busy = useRef(false);
  const hovering = useRef(false);
  const still = useRef(false);
  const count = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Turn the face to `deg` over `ms`, easing in and out, from wherever it is now. */
  const turnTo = (deg: number, ms = 600) => {
    cancelAnimationFrame(frame.current);
    if (still.current) {
      current.current = ((deg + 540) % 360) - 180;
      setYaw(current.current);
      return;
    }
    const from = current.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      current.current = from + (deg - from) * e;
      setYaw(current.current);
      if (k < 1) frame.current = requestAnimationFrame(step);
      else {
        current.current = ((((deg + 180) % 360) + 360) % 360) - 180;
        setYaw(current.current);
      }
    };
    frame.current = requestAnimationFrame(step);
  };

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const all = timers.current;
    const blinker = setInterval(() => {
      setBlink(true);
      all.push(setTimeout(() => setBlink(false), 130));
    }, 3400);
    // Idle: glance about, hop now and then, and every so often turn round to show its number.
    const looks = [BASE.yaw - 40, BASE.yaw, BASE.yaw + 30, BASE.yaw];
    let tick = 0;
    const idle = setInterval(() => {
      if (busy.current || hovering.current) return;
      tick += 1;
      if (tick % 5 === 0) {
        busy.current = true;
        turnTo(180 + BASE.yaw, 1000);
        all.push(setTimeout(() => turnTo(360 + BASE.yaw, 1000), 1900));
        all.push(setTimeout(() => (busy.current = false), 3000));
      } else {
        turnTo(looks[tick % looks.length], 800);
        if (tick % 2 === 0) setHop((h) => h + 1);
      }
    }, 2400);
    return () => {
      clearInterval(blinker);
      clearInterval(idle);
      cancelAnimationFrame(frame.current);
      all.forEach(clearTimeout);
    };
  }, []);

  const perform = () => {
    const next = ACTIONS[count.current % ACTIONS.length];
    count.current += 1;
    const n = count.current;
    busy.current = true;
    blip(SOUNDS[next.id]);
    setAction({ id: next.id, n });
    if (next.id === "spin") turnTo(current.current + 360, 900);
    else turnTo(BASE.yaw, 250);
    later(next.ms, () => {
      busy.current = false;
      setAction((a) => (a && a.n === n ? null : a));
    });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    hovering.current = true;
    if (still.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setPitch(Math.max(-38, Math.min(26, dy * 70 - 6)));
    if (!busy.current) turnTo(Math.max(-1, Math.min(1, dx * 2)) * 50, 200);
  };

  const id = action?.id;
  const { stripe, base, light } = paint(ball);
  // On a stripe ball the face sits a little lower, to stay on the band.
  const lift = stripe ? -12 : 0;
  const eyeLat = -pitch + 8 + lift;
  const smileLat = -pitch - 16 + lift;
  /** Dark features on light paint, white on dark: by what's under that spot. */
  const ink = (lat: number) => (stripe && Math.abs(lat) > BAND - 6 ? INK : light ? INK : WHITE);
  const face = ink(eyeLat);
  const happy = id === "boing" || id === "spin";
  const name = label ?? (ball === "cue" ? "Cue ball" : `${ball}-Ball`);

  /** One eye: round or a leaning pill, with arcs and chevrons for moods. */
  const eye = (side: -1 | 1) => {
    if (happy) return <path d="M-9 4 Q0 -10 9 4" fill="none" stroke={face} strokeWidth="6" strokeLinecap="round" />;
    if (id === "squish") return <path d={side < 0 ? "M-7 -9 L6 0 L-7 9" : "M7 -9 L-6 0 L7 9"} fill="none" stroke={face} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />;
    if (id === "wink" && side > 0) return <path d="M-9 0 Q0 7 9 0" fill="none" stroke={face} strokeWidth="6" strokeLinecap="round" />;
    if (eyes === "pill") return <rect x="-6.5" y="-16" width="13" height="32" rx="6.5" fill={face} transform={`rotate(-28) scale(1 ${blink ? 0.15 : 1})`} />;
    return <ellipse rx="10" ry="15" fill={face} transform={`scale(1 ${blink ? 0.12 : 1})`} />;
  };
  const smile = id === "squish" ? "M-10 0 Q-5 6 0 0 Q5 6 10 0" : happy || id === "wink" ? "M-14 -3 Q0 15 14 -3" : "M-11 0 Q0 9 11 0";

  return (
    <button
      type="button"
      aria-label={`${name}. Tap for a trick.`}
      aria-describedby={statusId}
      onClick={perform}
      onPointerMove={onMove}
      onPointerLeave={() => {
        hovering.current = false;
        setPitch(BASE.pitch);
        if (!busy.current) turnTo(BASE.yaw, 500);
      }}
      className="relative grid cursor-pointer place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.45, height: size * 1.45 }}
    >
      <style href="eight-ball-critter" precedence="default">{`
        @keyframes eightball-hover { 0%, 100% { translate: 0 0; } 50% { translate: 0 -4%; } }
        @keyframes eightball-hop { 0%, 100% { translate: 0 0; scale: 1 1; } 14% { translate: 0 0; scale: 1.1 0.9; } 45% { translate: 0 -16%; scale: 0.95 1.06; } 76% { translate: 0 0; scale: 1.12 0.88; } 88% { scale: 0.97 1.03; } }
        @keyframes eightball-boing { 0%, 100% { translate: 0 0; scale: 1 1; } 10% { translate: 0 0; scale: 1.18 0.8; } 40% { translate: 0 -34%; scale: 0.88 1.14; } 70% { translate: 0 0; scale: 1.22 0.78; } 82% { translate: 0 -6%; scale: 0.96 1.04; } 92% { translate: 0 0; scale: 1.04 0.97; } }
        @keyframes eightball-squish { 0%, 100% { scale: 1 1; } 20% { scale: 1.28 0.7; } 40% { scale: 0.88 1.14; } 58% { scale: 1.12 0.9; } 76% { scale: 0.97 1.03; } }
        @keyframes eightball-roll-x { 0%, 100% { translate: 0 0; } 40% { translate: 26% 0; } 70% { translate: -10% 0; } }
        @keyframes eightball-roll-face { 0%, 100% { rotate: 0deg; } 40% { rotate: 150deg; } 70% { rotate: -58deg; } }
        @keyframes eightball-shadow { 0%, 14%, 76%, 100% { scale: 1; opacity: 1; } 45% { scale: 0.7; opacity: 0.55; } }
        @keyframes eightball-shadow-big { 0%, 10%, 70%, 100% { scale: 1; opacity: 1; } 40% { scale: 0.5; opacity: 0.4; } }
        .eightball-hover { animation: eightball-hover 2.4s ease-in-out infinite; }
        .eightball-hop { animation: eightball-hop 0.7s cubic-bezier(.3,0,.3,1); transform-origin: 50% 100%; }
        .eightball-boing { animation: eightball-boing 1.05s cubic-bezier(.3,0,.3,1); transform-origin: 50% 100%; }
        .eightball-squish { animation: eightball-squish 0.85s ease-out; transform-origin: 50% 100%; }
        .eightball-roll-x { animation: eightball-roll-x 1.4s cubic-bezier(.45,0,.35,1); }
        /* view-box's origin is user space (0, 0): the ball's centre. */
        .eightball-roll-face { animation: eightball-roll-face 1.4s cubic-bezier(.45,0,.35,1); transform-box: view-box; transform-origin: 0 0; }
        .eightball-shadow-hop { animation: eightball-shadow 0.7s cubic-bezier(.3,0,.3,1); }
        .eightball-shadow-boing { animation: eightball-shadow-big 1.05s cubic-bezier(.3,0,.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .eightball-hover, .eightball-hop, .eightball-boing, .eightball-squish, .eightball-roll-x, .eightball-roll-face, .eightball-shadow-hop, .eightball-shadow-boing { animation: none; }
        }
      `}</style>

      <div className={cn("relative", id === "roll" && "eightball-roll-x")} key={`x-${id === "roll" ? action?.n : 0}`} style={{ width: size }}>
        <span
          aria-hidden
          key={`shadow-${action?.n ?? 0}-${hop}`}
          className={cn(
            "absolute -bottom-[2%] left-1/2 block h-[10%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/22 blur-[3px]",
            id === "boing" ? "eightball-shadow-boing" : !id && hop ? "eightball-shadow-hop" : "",
          )}
        />
        <div className="eightball-hover">
          <div
            key={`b-${action?.n ?? 0}-${hop}`}
            className={cn(id === "boing" ? "eightball-boing" : id === "squish" ? "eightball-squish" : !id && hop ? "eightball-hop" : "")}
          >
            <svg aria-hidden viewBox="-100 -100 200 200" overflow="visible" className="block w-full">
              <defs>
                <clipPath id={`${gid}-clip`}>
                  <circle r={R} />
                </clipPath>
                {/* Light from the top left, a darker edge: works over any paint. */}
                <radialGradient id={`${gid}-light`} cx="36%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.42" />
                  <stop offset="28%" stopColor="white" stopOpacity="0.06" />
                  <stop offset="62%" stopColor="black" stopOpacity="0" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.42" />
                </radialGradient>
              </defs>

              {/* The ball: its paint, its stripe, its face and number, then light and gloss over all of it. */}
              <g clipPath={`url(#${gid}-clip)`}>
                <circle r={R} fill={base} />
                {/* Everything painted on the ball; a roll turns it all around the middle. */}
                <g className={cn(id === "roll" && "eightball-roll-face")} key={`f-${id === "roll" ? action?.n : 0}`}>
                  {stripe && <path d={bandPath()} fill={stripe} />}

                  {ball !== "cue" && (
                    <Decal yaw={yaw + 180} lat={4}>
                      <circle r="31" fill={WHITE} stroke={INK} strokeOpacity="0.15" strokeWidth="1.5" />
                      <text y="1.5" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display), sans-serif" fontSize={ball > 9 ? 30 : 38} fill={INK}>
                        {ball}
                      </text>
                    </Decal>
                  )}
                  <Decal yaw={yaw - 18} lat={eyeLat}>
                    {eye(-1)}
                  </Decal>
                  <Decal yaw={yaw + 18} lat={eyeLat}>
                    {eye(1)}
                  </Decal>
                  <Decal yaw={yaw} lat={smileLat}>
                    <path d={smile} fill="none" stroke={ink(smileLat)} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </Decal>
                </g>

                <circle r={R} fill={`url(#${gid}-light)`} />
                <ellipse cx="-30" cy="-46" rx="20" ry="11" transform="rotate(-32 -30 -46)" fill="white" opacity="0.28" />
              </g>
              <circle r={R} fill="none" stroke={INK} strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {action ? ACTIONS.find((a) => a.id === action.id)?.say : ""}
      </span>
    </button>
  );
}

const SET: PoolBall[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "cue"];

/**
 * The lab: the 8-Ball, with the whole rack to pick from and the eye style.
 * `preview` (the Labs index card) shows just the 8; the pickers live on the
 * lab's own page.
 */
export function EightBallLab({ preview = false }: { preview?: boolean }) {
  const [ball, setBall] = useState<PoolBall>(8);
  const [eyes, setEyes] = useState<"round" | "pill">("round");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <EightBall ball={ball} eyes={eyes} />
      {!preview && (
        <>
          <div role="group" aria-label="Ball" className="flex max-w-sm flex-wrap justify-center gap-2">
            {SET.map((b) => {
              const p = paint(b);
              return (
                <button
                  key={b}
                  type="button"
                  aria-label={b === "cue" ? "Cue ball" : `${b} ball`}
                  aria-pressed={ball === b}
                  onClick={() => setBall(b)}
                  className={cn(
                    "relative grid size-9 place-items-center overflow-hidden rounded-full border-2 border-ink font-mono text-[10px] font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                    ball === b && "ring-2 ring-ink ring-offset-2",
                  )}
                  style={{ background: p.stripe ? `linear-gradient(${WHITE} 26%, ${p.stripe} 26% 74%, ${WHITE} 74%)` : p.base }}
                >
                  {b !== "cue" && <span className="grid size-4.5 place-items-center rounded-full bg-paper-raised text-ink">{b}</span>}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="Eyes" className="flex gap-2">
            {(["round", "pill"] as const).map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={eyes === e}
                onClick={() => setEyes(e)}
                className={cn(
                  "border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                  eyes === e ? "bg-lime text-on-bright" : "bg-paper-raised",
                )}
              >
                {e} eyes
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
