"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";

export type SnowballColor = "ink" | "plum" | "navy" | "forest";

export type SnowballProps = {
  color?: SnowballColor;
  /** Width of the ball, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const BALL: Record<SnowballColor, string> = {
  ink: "oklch(0.17 0.006 270)",
  plum: "oklch(0.3 0.09 330)",
  navy: "oklch(0.28 0.08 260)",
  forest: "oklch(0.3 0.07 160)",
};

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
  roll: Array.from({ length: 8 }, (_, i) => ({ f: 380 + (i % 3) * 40, at: i * 0.09, dur: 0.05, type: "triangle" as const, gain: 0.035 })),
  wink: [
    { f: 1200, dur: 0.07, type: "sine", gain: 0.05 },
    { f: 1600, at: 0.08, dur: 0.12, type: "sine", gain: 0.045 },
  ],
};

const R = 80;
const BASE = { yaw: 24, pitch: -18 };

/**
 * Where a point on the ball lands: `yaw` and `pitch` in degrees from the
 * ball's centre as you see it (0, 0 is dead centre; pitch up is negative).
 * `k` is how squarely it faces you (1 head-on, 0 at the edge).
 */
function onSphere(yaw: number, pitch: number) {
  const t = (yaw * Math.PI) / 180;
  const p = (pitch * Math.PI) / 180;
  const x = R * Math.sin(t) * Math.cos(p);
  const y = R * Math.sin(p);
  const z = Math.cos(t) * Math.cos(p);
  return { x, y, k: z, angle: (Math.atan2(y, x) * 180) / Math.PI };
}

/**
 * A flat decal stuck to the ball at (yaw, pitch): squashed toward the
 * centre as it turns away, faded at the edge, and hidden on the back.
 */
function Decal({ yaw, pitch, children }: { yaw: number; pitch: number; children: ReactNode }) {
  const s = onSphere(yaw, pitch);
  if (s.k <= 0.02) return null;
  return (
    <g transform={`translate(${s.x} ${s.y}) rotate(${s.angle}) scale(${s.k} 1) rotate(${-s.angle})`} opacity={Math.min(1, s.k * 4)}>
      {children}
    </g>
  );
}

/**
 * Snowball: a glossy black ball with white pill eyes and a smile, in faux 3D.
 * The face is stuck to the ball's surface, so as it turns the eyes slide
 * across the curve, narrow toward the edge, and go round the back. It hovers
 * and bounces with squash and stretch, glances about, turns all the way round
 * now and then, and looks toward the pointer. Each tap is the next trick: a
 * big boing, a spin, a squish, a roll, and a wink. One labelled button.
 */
export function Snowball({ color = "ink", size = 180, label = "Snowball" }: SnowballProps) {
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
    // Idle: glance about, hop now and then, and every so often turn all the way round.
    const looks = [BASE.yaw - 40, BASE.yaw, BASE.yaw + 30, BASE.yaw];
    let tick = 0;
    const idle = setInterval(() => {
      if (busy.current || hovering.current) return;
      tick += 1;
      if (tick % 5 === 0) turnTo(current.current + 360, 1800);
      else {
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
    setPitch(Math.max(-40, Math.min(30, dy * 70 - 6)));
    if (!busy.current) turnTo(Math.max(-1, Math.min(1, dx * 2)) * 50, 200);
  };

  const id = action?.id;
  const fill = BALL[color];
  const happy = id === "boing" || id === "spin";
  const white = "oklch(0.99 0 0)";

  /** One pill eye, leaning like the reference; arcs and chevrons for moods. */
  const eye = (side: -1 | 1) => {
    if (happy) return <path d="M-9 4 Q0 -10 9 4" fill="none" stroke={white} strokeWidth="6" strokeLinecap="round" />;
    if (id === "squish") return <path d={side < 0 ? "M-7 -9 L6 0 L-7 9" : "M7 -9 L-6 0 L7 9"} fill="none" stroke={white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />;
    if (id === "wink" && side > 0) return <path d="M-9 0 Q0 7 9 0" fill="none" stroke={white} strokeWidth="6" strokeLinecap="round" />;
    return <rect x="-6.5" y="-16" width="13" height="32" rx="6.5" fill={white} transform={`rotate(-28) scale(1 ${blink ? 0.15 : 1})`} />;
  };
  const smile = id === "squish" ? "M-10 0 Q-5 6 0 0 Q5 6 10 0" : happy || id === "wink" ? "M-14 -3 Q0 15 14 -3" : "M-11 0 Q0 9 11 0";

  return (
    <button
      type="button"
      aria-label={`${label}. Tap for a trick.`}
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
      <style href="snowball-critter" precedence="default">{`
        @keyframes snowball-hover { 0%, 100% { translate: 0 0; } 50% { translate: 0 -4%; } }
        @keyframes snowball-hop { 0%, 100% { translate: 0 0; scale: 1 1; } 14% { translate: 0 0; scale: 1.1 0.9; } 45% { translate: 0 -16%; scale: 0.95 1.06; } 76% { translate: 0 0; scale: 1.12 0.88; } 88% { scale: 0.97 1.03; } }
        @keyframes snowball-boing { 0%, 100% { translate: 0 0; scale: 1 1; } 10% { translate: 0 0; scale: 1.18 0.8; } 40% { translate: 0 -34%; scale: 0.88 1.14; } 70% { translate: 0 0; scale: 1.22 0.78; } 82% { translate: 0 -6%; scale: 0.96 1.04; } 92% { translate: 0 0; scale: 1.04 0.97; } }
        @keyframes snowball-squish { 0%, 100% { scale: 1 1; } 20% { scale: 1.28 0.7; } 40% { scale: 0.88 1.14; } 58% { scale: 1.12 0.9; } 76% { scale: 0.97 1.03; } }
        @keyframes snowball-roll-x { 0%, 100% { translate: 0 0; } 40% { translate: 26% 0; } 70% { translate: -10% 0; } }
        @keyframes snowball-roll-face { 0%, 100% { rotate: 0deg; } 40% { rotate: 150deg; } 70% { rotate: -58deg; } }
        @keyframes snowball-shadow { 0%, 14%, 76%, 100% { scale: 1; opacity: 1; } 45% { scale: 0.7; opacity: 0.55; } }
        @keyframes snowball-shadow-big { 0%, 10%, 70%, 100% { scale: 1; opacity: 1; } 40% { scale: 0.5; opacity: 0.4; } }
        .snowball-hover { animation: snowball-hover 2.4s ease-in-out infinite; }
        .snowball-hop { animation: snowball-hop 0.7s cubic-bezier(.3,0,.3,1); transform-origin: 50% 100%; }
        .snowball-boing { animation: snowball-boing 1.05s cubic-bezier(.3,0,.3,1); transform-origin: 50% 100%; }
        .snowball-squish { animation: snowball-squish 0.85s ease-out; transform-origin: 50% 100%; }
        .snowball-roll-x { animation: snowball-roll-x 1.4s cubic-bezier(.45,0,.35,1); }
        .snowball-roll-face { animation: snowball-roll-face 1.4s cubic-bezier(.45,0,.35,1); transform-box: view-box; transform-origin: 0 0; }
        .snowball-shadow-hop { animation: snowball-shadow 0.7s cubic-bezier(.3,0,.3,1); }
        .snowball-shadow-boing { animation: snowball-shadow-big 1.05s cubic-bezier(.3,0,.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .snowball-hover, .snowball-hop, .snowball-boing, .snowball-squish, .snowball-roll-x, .snowball-roll-face, .snowball-shadow-hop, .snowball-shadow-boing { animation: none; }
        }
      `}</style>

      <div className={cn("relative", id === "roll" && "snowball-roll-x")} key={`x-${id === "roll" ? action?.n : 0}`} style={{ width: size }}>
        <span
          aria-hidden
          key={`shadow-${action?.n ?? 0}-${hop}`}
          className={cn(
            "absolute -bottom-[2%] left-1/2 block h-[10%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/22 blur-[3px]",
            id === "boing" ? "snowball-shadow-boing" : !id && hop ? "snowball-shadow-hop" : "",
          )}
        />
        <div className="snowball-hover">
          <div
            key={`b-${action?.n ?? 0}-${hop}`}
            className={cn(id === "boing" ? "snowball-boing" : id === "squish" ? "snowball-squish" : !id && hop ? "snowball-hop" : "")}
          >
            <svg aria-hidden viewBox="-100 -100 200 200" overflow="visible" className="block w-full">
              <defs>
                <radialGradient id={`${gid}-ball`} cx="36%" cy="30%" r="80%">
                  <stop offset="0%" stopColor={`color-mix(in oklab, ${fill} 70%, white)`} />
                  <stop offset="38%" stopColor={fill} />
                  <stop offset="100%" stopColor={`color-mix(in oklab, ${fill} 70%, black)`} />
                </radialGradient>
                <radialGradient id={`${gid}-rim`} cx="50%" cy="50%" r="50%">
                  <stop offset="82%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.16" />
                </radialGradient>
              </defs>

              {/* The ball: a lit sphere, a faint rim light, and a soft gloss up top. */}
              <circle r={R} fill={`url(#${gid}-ball)`} />
              <circle r={R} fill={`url(#${gid}-rim)`} />
              <ellipse cx="-30" cy="-46" rx="20" ry="11" transform="rotate(-32 -30 -46)" fill="white" opacity="0.13" />

              {/* The face, stuck to its surface. A roll turns it around the middle. */}
              <g className={cn(id === "roll" && "snowball-roll-face")} key={`f-${id === "roll" ? action?.n : 0}`}>
                <Decal yaw={yaw - 17} pitch={pitch - 8}>
                  {eye(-1)}
                </Decal>
                <Decal yaw={yaw + 17} pitch={pitch - 8}>
                  {eye(1)}
                </Decal>
                <Decal yaw={yaw} pitch={pitch + 16}>
                  <path d={smile} fill="none" stroke={white} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                </Decal>
              </g>
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

const COLORS: SnowballColor[] = ["ink", "plum", "navy", "forest"];

/**
 * The lab: Snowball, with a color picker. `preview` (the Labs index card)
 * shows just the ball; the picker lives on the lab's own page.
 */
export function SnowballLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<SnowballColor>("ink");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Snowball color={color} />
      {!preview && (
        <div role="group" aria-label="Color" className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={cn("size-8 rounded-full border-2 border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue", color === c && "ring-2 ring-ink ring-offset-2")}
              style={{ background: BALL[c] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
