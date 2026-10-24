"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";

export type BeepColor = "white" | "mint" | "peach" | "lilac";
export type BeepGlow = "white" | "cyan" | "lime" | "pink";

export type BeepProps = {
  /** Body color. */
  color?: BeepColor;
  /** The screen's glow. */
  glow?: BeepGlow;
  /** Width of the robot, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const BODY: Record<BeepColor, string> = {
  white: "oklch(0.93 0.004 260)",
  mint: "oklch(0.86 0.08 165)",
  peach: "oklch(0.86 0.07 50)",
  lilac: "oklch(0.83 0.07 300)",
};
const GLOW: Record<BeepGlow, string> = {
  white: "oklch(0.99 0 0)",
  cyan: "oklch(0.88 0.13 200)",
  lime: "oklch(0.9 0.19 128)",
  pink: "oklch(0.82 0.14 355)",
};
const SCREEN = "oklch(0.17 0.012 270)";

type Action = "wave" | "wink" | "spin" | "jump" | "think";

/** The tricks, in turn: what it does, what's announced, how long it lasts. */
const ACTIONS: { id: Action; say: string; ms: number }[] = [
  { id: "wave", say: "Beep waves hello.", ms: 1500 },
  { id: "wink", say: "Beep winks.", ms: 1000 },
  { id: "spin", say: "Beep spins all the way around.", ms: 1100 },
  { id: "jump", say: "Beep jumps for joy, arms up.", ms: 1100 },
  { id: "think", say: "Beep is thinking.", ms: 1800 },
];

/** Its voice: little square-wave beeps, all above 300 Hz so small speakers play them. */
const SOUNDS: Record<Action, Parameters<typeof blip>[0]> = {
  wave: [
    { f: 880, dur: 0.07, gain: 0.035 },
    { f: 1175, at: 0.09, dur: 0.07, gain: 0.035 },
    { f: 1568, at: 0.18, dur: 0.12, gain: 0.03 },
  ],
  wink: [
    { f: 1320, dur: 0.06, gain: 0.035 },
    { f: 990, at: 0.1, dur: 0.1, gain: 0.03 },
  ],
  spin: [{ f: 500, to: 1500, dur: 0.45, type: "triangle", gain: 0.05 }],
  jump: [
    { f: 440, to: 880, dur: 0.14, gain: 0.03 },
    { f: 1320, at: 0.16, dur: 0.1, gain: 0.03 },
  ],
  think: Array.from({ length: 6 }, (_, i) => ({ f: [740, 990, 880, 1110, 830, 1240][i], at: i * 0.17, dur: 0.06, gain: 0.025 })),
};

/** A round part: an ellipsoid at a point, with radii along x (width), y (height), and z (depth). */
type Part = { key: string; x: number; y: number; z: number; a: number; b: number; c: number };

/**
 * The robot, in model units, facing you (+z), y down: a round head over a
 * rounder bottom with two cat-ear nubs (one surface), and two floating
 * paddle arms at its sides.
 */
const BODY_PARTS: Part[] = [
  { key: "head", x: 0, y: -8, z: 0, a: 54, b: 44, c: 46 },
  { key: "bottom", x: 0, y: 16, z: 0, a: 46, b: 32, c: 42 },
  ...[-1, 1].flatMap((side) => [
    { key: `ear${side}`, x: side * 28, y: -44, z: 2, a: 13, b: 12, c: 11 },
    { key: `ear-tip${side}`, x: side * 33, y: -54, z: 2, a: 7, b: 8, c: 7 },
  ]),
];
const ARM = (side: -1 | 1): Part => ({ key: `arm${side}`, x: side * 74, y: 8, z: 0, a: 11, b: 24, c: 12 });

/** Turns a part by `yaw` and looks down by `pitch`: its on-screen ellipse and depth. */
function project(q: Part, yawDeg: number, pitchDeg: number) {
  const t = (yawDeg * Math.PI) / 180;
  const p = (pitchDeg * Math.PI) / 180;
  const x1 = q.x * Math.cos(t) + q.z * Math.sin(t);
  const z1 = -q.x * Math.sin(t) + q.z * Math.cos(t);
  const y2 = q.y * Math.cos(p) + z1 * Math.sin(p);
  const z2 = -q.y * Math.sin(p) + z1 * Math.cos(p);
  const rx = Math.hypot(q.a * Math.cos(t), q.c * Math.sin(t));
  const depth = Math.hypot(q.a * Math.sin(t), q.c * Math.cos(t));
  const ry = Math.hypot(q.b * Math.cos(p), depth * Math.sin(p));
  return { sx: x1, sy: y2, z: z2, rx, ry };
}

const BASE_YAW = -14;
const PITCH = 10;

/**
 * Beep: a glossy robot in 3D, after the classic screen-face bot. A round
 * body with cat-ear nubs, lit with SVG lighting into one smooth plastic
 * surface with a bold outline; a dark screen face with glowing square eyes
 * that slides around the body as it turns; and two floating paddle arms. It
 * floats, blinks, glances about, and turns toward the pointer. Each tap is
 * the next trick: a wave, a wink, a spin, a jump with its arms up, and a
 * think with scanning eyes. One labelled button.
 */
export function Beep({ color = "white", glow = "white", size = 180, label = "Beep" }: BeepProps) {
  const [yaw, setYaw] = useState(BASE_YAW);
  const [action, setAction] = useState<{ id: Action; n: number } | null>(null);
  const [blink, setBlink] = useState(false);
  const statusId = useId();
  const uid = useId().replace(/:/g, "");
  const current = useRef(BASE_YAW);
  const frame = useRef(0);
  const busy = useRef(false);
  const hovering = useRef(false);
  const still = useRef(false);
  const count = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Turn to `deg` over `ms`, easing in and out, from wherever it is now. */
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
      all.push(setTimeout(() => setBlink(false), 140));
    }, 3200);
    // Idle: glance about now and then.
    const looks = [BASE_YAW + 34, BASE_YAW, BASE_YAW - 30, BASE_YAW];
    let tick = 0;
    const idle = setInterval(() => {
      if (busy.current || hovering.current) return;
      turnTo(looks[tick++ % looks.length], 900);
    }, 2600);
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
    if (next.id === "spin") turnTo(current.current + 360, 1000);
    else turnTo(BASE_YAW, 250);
    later(next.ms, () => {
      busy.current = false;
      setAction((a) => (a && a.n === n ? null : a));
    });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    hovering.current = true;
    if (still.current || busy.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    turnTo(BASE_YAW + Math.max(-1, Math.min(1, dx * 2)) * 44, 200);
  };

  const id = action?.id;
  const fill = BODY[color];
  const light = GLOW[glow];

  // The body as flat ellipses (lit into one surface by the filter), and where the arms and screen land.
  const body = BODY_PARTS.map((q) => ({ key: q.key, ...project(q, yaw, PITCH) }));
  const arms = ([-1, 1] as const).map((side) => ({ side, ...project(ARM(side), yaw, PITCH) }));
  const centre = project({ key: "c", x: 0, y: 0, z: 0, a: 1, b: 1, c: 1 }, yaw, PITCH);
  const screenAt = project({ key: "s", x: 0, y: -6, z: 46, a: 1, b: 1, c: 1 }, yaw, PITCH);
  const facing = Math.cos((yaw * Math.PI) / 180);

  /** One floating arm, tilted out at the top, waving or raised for some tricks. */
  const arm = (a: (typeof arms)[number]) => {
    const waving = id === "wave" && a.side === 1;
    const up = id === "jump";
    const shoulder = { x: a.sx, y: a.sy - a.ry * 0.8 };
    return (
      <g key={a.side} filter={`url(#${uid}-small)`}>
        <g
          className={cn(waving && "beep-wave", up && (a.side === 1 ? "beep-up-r" : "beep-up-l"))}
          style={{ transformBox: "view-box", transformOrigin: `${shoulder.x}px ${shoulder.y}px` }}
        >
          <ellipse cx={a.sx} cy={a.sy} rx={a.rx} ry={a.ry} fill={fill} transform={`rotate(${a.side * 18} ${a.sx} ${a.sy})`} />
        </g>
      </g>
    );
  };

  /** What the screen shows. */
  const glowing = (children: ReactNode) => (
    <g fill={light} stroke={light} filter={`url(#${uid}-glow)`}>
      {children}
    </g>
  );
  const eyes = (() => {
    const sq = (x: number) => <rect key={x} x={x - 7.5} y={-16} width="15" height={blink ? 3 : 17} rx="4" transform={blink ? "translate(0 7)" : undefined} stroke="none" />;
    if (id === "wave" || id === "jump" || id === "spin")
      return [-16, 16].map((x) => <path key={x} d={`M${x - 8} -4 Q${x} -15 ${x + 8} -4`} fill="none" strokeWidth="4.5" strokeLinecap="round" />);
    if (id === "wink") return [sq(-16), <path key="w" d="M8 -7 Q16 -1 24 -7" fill="none" strokeWidth="4.5" strokeLinecap="round" />];
    if (id === "think") return <g className="beep-scan">{[sq(-16), sq(16)]}</g>;
    return [sq(-16), sq(16)];
  })();
  const mouth =
    id === "think" ? <path d="M-6 12 H6" fill="none" strokeWidth="3.5" strokeLinecap="round" /> : <path d={id ? "M-8 9 Q0 17 8 9" : "M-6 10 Q0 15 6 10"} fill="none" strokeWidth="3.5" strokeLinecap="round" />;

  const near = arms.filter((a) => a.z >= centre.z);
  const far = arms.filter((a) => a.z < centre.z);

  return (
    <button
      type="button"
      aria-label={`${label}. Tap for a trick.`}
      aria-describedby={statusId}
      onClick={perform}
      onPointerMove={onMove}
      onPointerLeave={() => {
        hovering.current = false;
        if (!busy.current) turnTo(BASE_YAW, 500);
      }}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.35, height: size * 1.25 }}
    >
      <style href="beep-bot" precedence="default">{`
        @keyframes beep-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5%; } }
        @keyframes beep-shadow { 0%, 100% { scale: 1; opacity: 1; } 50% { scale: 0.86; opacity: 0.7; } }
        @keyframes beep-jump { 0%, 100% { translate: 0 0; scale: 1 1; } 14% { translate: 0 0; scale: 1.08 0.9; } 46% { translate: 0 -24%; scale: 0.96 1.05; } 78% { translate: 0 0; scale: 1.06 0.94; } }
        @keyframes beep-wave { 0%, 100% { rotate: 0deg; } 15% { rotate: -150deg; } 30% { rotate: -118deg; } 45% { rotate: -152deg; } 60% { rotate: -118deg; } 75% { rotate: -150deg; } }
        @keyframes beep-up-r { 0%, 100% { rotate: 0deg; } 30%, 70% { rotate: -155deg; } }
        @keyframes beep-up-l { 0%, 100% { rotate: 0deg; } 30%, 70% { rotate: 155deg; } }
        @keyframes beep-scan { 0%, 100% { translate: 0 0; } 25% { translate: -6px 0; } 75% { translate: 6px 0; } }
        .beep-float { animation: beep-float 2.8s ease-in-out infinite; }
        .beep-shadow { animation: beep-shadow 2.8s ease-in-out infinite; }
        .beep-jump { animation: beep-jump 1s cubic-bezier(.3,0,.3,1); transform-origin: 50% 90%; }
        .beep-wave { animation: beep-wave 1.4s ease-in-out; }
        .beep-up-r { animation: beep-up-r 1s ease-in-out; }
        .beep-up-l { animation: beep-up-l 1s ease-in-out; }
        .beep-scan { animation: beep-scan 0.9s ease-in-out 2; }
        @media (prefers-reduced-motion: reduce) {
          .beep-float, .beep-shadow, .beep-jump, .beep-wave, .beep-up-r, .beep-up-l, .beep-scan { animation: none; }
        }
      `}</style>

      <span aria-hidden className="beep-shadow absolute bottom-[8%] left-1/2 block h-[8%] w-[46%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-[3px]" />

      <div className="beep-float" style={{ width: size }}>
        <div key={action?.n ?? 0} className={cn(id === "jump" && "beep-jump")}>
          <svg aria-hidden viewBox="-104 -80 208 156" overflow="visible" className="block w-full">
            <defs>
              {/* Soft plastic: blur the shape's alpha into a height map, light it, keep it inside, and outline it. */}
              {(
                [
                  ["big", 10, 6, true, 3.2],
                  ["small", 4.5, 3.5, false, 2.8],
                ] as const
              ).map(([name, blur, height, goo, outline]) => (
                <filter key={name} id={`${uid}-${name}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                  {goo ? (
                    <>
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="soft" />
                      <feComponentTransfer in="soft" result="shape">
                        <feFuncA type="linear" slope="7" intercept="-3" />
                      </feComponentTransfer>
                      <feFlood floodColor={fill} result="paint" />
                      <feComposite in="paint" in2="shape" operator="in" result="base" />
                    </>
                  ) : (
                    <>
                      <feComposite in="SourceAlpha" in2="SourceAlpha" operator="over" result="shape" />
                      <feComposite in="SourceGraphic" in2="SourceGraphic" operator="over" result="base" />
                    </>
                  )}
                  <feGaussianBlur in="shape" stdDeviation={blur} result="height" />
                  <feDiffuseLighting in="height" surfaceScale={height} diffuseConstant="1" lightingColor="white" result="diffuse-raw">
                    <feDistantLight azimuth="235" elevation="50" />
                  </feDiffuseLighting>
                  <feSpecularLighting in="height" surfaceScale={height} specularConstant="0.8" specularExponent="28" lightingColor="white" result="spec-raw">
                    <feDistantLight azimuth="235" elevation="58" />
                  </feSpecularLighting>
                  <feGaussianBlur in="diffuse-raw" stdDeviation="0.9" result="diffuse" />
                  <feGaussianBlur in="spec-raw" stdDeviation="0.9" result="spec" />
                  <feComposite in="base" in2="diffuse" operator="arithmetic" k1="0.8" k2="0.24" k3="0" k4="0" result="shaded" />
                  <feComposite in="spec" in2="shape" operator="in" result="shine" />
                  <feComposite in="shaded" in2="shine" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" result="lit" />
                  <feComposite in="lit" in2="shape" operator="in" result="surface" />
                  <feMorphology in="shape" operator="dilate" radius={outline} result="fat" />
                  <feFlood style={{ floodColor: "var(--ink)" }} result="ink" />
                  <feComposite in="ink" in2="fat" operator="in" result="line" />
                  <feComposite in="surface" in2="line" operator="over" />
                </filter>
              ))}
              {/* The screen's glow: the shape, plus a soft halo of itself. */}
              <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="halo" />
                <feMerge>
                  <feMergeNode in="halo" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id={`${uid}-screen`} x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stopColor={`color-mix(in oklab, ${SCREEN} 80%, white)`} />
                <stop offset="55%" stopColor={SCREEN} />
              </linearGradient>
            </defs>

            {far.map(arm)}

            <g filter={`url(#${uid}-big)`}>
              {body.map((q) => (
                <ellipse key={q.key} cx={q.sx} cy={q.sy} rx={q.rx} ry={q.ry} fill={fill} />
              ))}
            </g>

            {/* The screen face, stuck to the front: it slides and narrows as Beep turns, and hides round the back. */}
            {facing > 0.12 && (
              <g transform={`translate(${screenAt.sx} ${screenAt.sy}) scale(${facing} 1)`} opacity={Math.min(1, (facing - 0.12) * 5)}>
                <rect x="-44" y="-33" width="88" height="64" rx="22" fill={`url(#${uid}-screen)`} stroke="var(--ink)" strokeWidth="2.5" />
                <path d="M-33 -22 Q-29 -28 -18 -28" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
                {glowing(
                  <>
                    {eyes}
                    {mouth}
                  </>,
                )}
              </g>
            )}

            {near.map(arm)}
          </svg>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {action ? ACTIONS.find((a) => a.id === action.id)?.say : ""}
      </span>
    </button>
  );
}

const COLORS: BeepColor[] = ["white", "mint", "peach", "lilac"];
const GLOWS: BeepGlow[] = ["white", "cyan", "lime", "pink"];

/**
 * The lab: Beep, with body and glow pickers. `preview` (the Labs index card)
 * shows just the robot; the pickers live on the lab's own page.
 */
export function BeepLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<BeepColor>("white");
  const [glow, setGlow] = useState<BeepGlow>("white");
  const swatch = (on: boolean) =>
    cn("size-8 rounded-full border-2 border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue", on && "ring-2 ring-ink ring-offset-2");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Beep color={color} glow={glow} />
      {!preview && (
        <div className="flex flex-wrap justify-center gap-6">
          <div role="group" aria-label="Body" className="flex gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" aria-label={`${c} body`} aria-pressed={color === c} onClick={() => setColor(c)} className={swatch(color === c)} style={{ background: BODY[c] }} />
            ))}
          </div>
          <div role="group" aria-label="Glow" className="flex gap-2">
            {GLOWS.map((g) => (
              <button
                key={g}
                type="button"
                aria-label={`${g} glow`}
                aria-pressed={glow === g}
                onClick={() => setGlow(g)}
                className={swatch(glow === g)}
                style={{ background: SCREEN, boxShadow: `inset 0 0 0 5px ${SCREEN}, inset 0 0 0 9px ${GLOW[g]}` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
