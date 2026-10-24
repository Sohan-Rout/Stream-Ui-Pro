"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";

export type MochiColor = "mint" | "pink" | "lemon" | "sky";

export type MochiProps = {
  color?: MochiColor;
  /** Width of the blob, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const BODY: Record<MochiColor, string> = {
  mint: "oklch(0.86 0.12 160)",
  pink: "oklch(0.84 0.1 350)",
  lemon: "oklch(0.92 0.13 100)",
  sky: "oklch(0.84 0.09 230)",
};

type Action = "spin" | "hop" | "wave" | "jiggle" | "love" | "nap";

/** The tricks, in turn: what it does, what it's announced as, and how long it lasts. */
const ACTIONS: { id: Action; say: string; ms: number }[] = [
  { id: "hop", say: "Mochi hops for joy.", ms: 1300 },
  { id: "spin", say: "Mochi does a twirl.", ms: 1300 },
  { id: "wave", say: "Mochi waves hello.", ms: 1600 },
  { id: "jiggle", say: "Mochi jiggles.", ms: 1200 },
  { id: "love", say: "Mochi is in love.", ms: 1800 },
  { id: "nap", say: "Mochi takes a tiny nap.", ms: 2400 },
];

/** Its voice: short synthesized blips, all above 300 Hz so small speakers play them. */
const SOUNDS: Record<Action, Parameters<typeof blip>[0]> = {
  hop: [
    { f: 330, to: 660, dur: 0.15, type: "sine", gain: 0.07 },
    { f: 660, to: 440, at: 0.16, dur: 0.15, type: "sine", gain: 0.06 },
  ],
  spin: [{ f: 400, to: 1200, dur: 0.35, type: "triangle", gain: 0.05 }],
  wave: [
    { f: 880, dur: 0.06, type: "sine", gain: 0.06 },
    { f: 1100, at: 0.09, dur: 0.08, type: "sine", gain: 0.06 },
  ],
  jiggle: [
    { f: 520, to: 420, dur: 0.08, type: "triangle", gain: 0.06 },
    { f: 420, to: 540, at: 0.08, dur: 0.08, type: "triangle", gain: 0.06 },
    { f: 540, to: 440, at: 0.16, dur: 0.1, type: "triangle", gain: 0.05 },
  ],
  love: [
    { f: 660, dur: 0.1, type: "sine", gain: 0.06 },
    { f: 880, at: 0.11, dur: 0.1, type: "sine", gain: 0.06 },
    { f: 1320, at: 0.22, dur: 0.18, type: "sine", gain: 0.05 },
  ],
  nap: [{ f: 360, to: 310, dur: 0.45, type: "sine", gain: 0.04 }],
};

/**
 * The body, in a 200×190 box: a gumdrop, wide at the bottom and round on top.
 * It's the same from every side, so it never turns; the face, arms, sprout,
 * and the heart on its back are placed around it in 3D and move instead.
 */
const BODY_PATH = "M24 160 C14 110 46 34 100 34 C154 34 186 110 176 160 C172 174 28 174 24 160 Z";
const CX = 100;

/** Half the body's width at height y, roughly, so features hug its curve. */
const halfWidth = (y: number) => 77 * Math.sqrt(Math.max(0, 1 - ((y - 150) / 120) ** 2));

/**
 * Where a feature at angle `a` around the body (0 is the front) lands when
 * the blob has turned `rot` degrees: its x, how foreshortened it is, and
 * whether it faces us.
 */
function place(a: number, rot: number, y: number, out = 0) {
  const phi = ((a + rot) * Math.PI) / 180;
  const z = Math.cos(phi);
  return { x: CX + Math.sin(phi) * (halfWidth(y) * 0.92 + out), sx: Math.max(0.05, z), front: z > 0.08, z };
}

const HEART = "M0 4 C-7 -2 -7 -9 -2.5 -9 C-1 -9 0 -8 0 -6.5 C0 -8 1 -9 2.5 -9 C7 -9 7 -2 0 4 Z";

/**
 * Mochi: a jelly blob in faux 3D. The body is shaded like a glossy gumdrop,
 * and its face, cheeks, arms, leaf sprout, and back heart sit at angles
 * around it, so when it turns you see its face slide to the side and its back
 * come round. It looks about, peeks over its shoulder now and then, and
 * follows the pointer; each tap is a different trick (hop, twirl, wave,
 * jiggle, heart eyes, nap). One labelled button.
 */
export function Mochi({ color = "mint", size = 180, label = "Mochi" }: MochiProps) {
  const [rot, setRot] = useState(0);
  const [action, setAction] = useState<{ id: Action; n: number } | null>(null);
  const [blink, setBlink] = useState(false);
  const statusId = useId();
  const gradId = useId();

  const current = useRef(0);
  const frame = useRef(0);
  const hovering = useRef(false);
  const busy = useRef(false);
  const peeking = useRef(false);
  const still = useRef(false);
  const count = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /**
   * Turn to `deg` over `ms`, easing in and out, from wherever it is now (so a
   * new turn can take over mid-way). Full turns fold away when it settles.
   */
  const turnTo = (deg: number, ms = 600) => {
    cancelAnimationFrame(frame.current);
    if (still.current) {
      current.current = ((deg % 360) + 540) % 360 - 180;
      setRot(current.current);
      return;
    }
    const from = current.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      current.current = from + (deg - from) * e;
      if (t < 1) {
        setRot(current.current);
        frame.current = requestAnimationFrame(step);
      } else {
        current.current = ((deg % 360) + 540) % 360 - 180;
        setRot(current.current);
        frame.current = 0;
      }
    };
    frame.current = requestAnimationFrame(step);
  };

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const all = timers.current;
    return () => {
      cancelAnimationFrame(frame.current);
      all.forEach(clearTimeout);
    };
  }, []);

  // Blinking, every few seconds.
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3300);
    return () => clearInterval(t);
  }, []);

  // Idle: glance around, and every so often turn to show its back, then come round again.
  useEffect(() => {
    const looks = [-38, 0, 30, -18, 0];
    let tick = 0;
    const t = setInterval(() => {
      if (busy.current || hovering.current || peeking.current) return;
      tick += 1;
      if (tick % 6 === 0) {
        peeking.current = true;
        turnTo(180, 1100);
        later(2300, () => !busy.current && !hovering.current && turnTo(360, 1100));
        later(3500, () => (peeking.current = false));
      } else {
        turnTo(looks[tick % looks.length], 800);
      }
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const perform = () => {
    const next = ACTIONS[count.current % ACTIONS.length];
    count.current += 1;
    busy.current = true;
    blip(SOUNDS[next.id]);
    setAction({ id: next.id, n: count.current });
    if (next.id === "spin") turnTo(current.current + 360, 1000);
    else turnTo(next.id === "wave" ? -16 : 0, 300);
    later(next.ms, () => {
      busy.current = false;
      setAction((a) => (a && a.n === count.current ? null : a));
    });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    hovering.current = true;
    if (busy.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    turnTo(Math.max(-1, Math.min(1, dx * 2)) * 42, 220);
  };

  const id = action?.id;
  const fill = BODY[color];
  const ink = "var(--ink)";

  // Features around the body.
  const eyes = [-24, 24].map((a) => ({ a, ...place(a, rot, 98) }));
  const cheeks = [-44, 44].map((a) => ({ a, ...place(a, rot, 117) }));
  const mouth = place(0, rot, 114);
  // Arms hug the outline: pushed out toward the edge so they read as nubs, not spots on the face.
  const arms = [-90, 90].map((a) => {
    const p = place(a, rot, 130);
    const sn = Math.sin(((a + rot) * Math.PI) / 180);
    return { a, ...p, x: CX + Math.sign(sn) * Math.abs(sn) ** 0.35 * (halfWidth(130) + 2) };
  });
  const back = place(180, rot, 108);
  const sproutPhi = (rot * Math.PI) / 180;

  const eye = (e: (typeof eyes)[number]) => {
    const left = e.a < 0;
    let face: ReactNode;
    if (id === "love") face = <path d={HEART} transform="scale(1.35)" fill="oklch(0.62 0.22 15)" stroke={ink} strokeWidth="1.6" />;
    else if (id === "spin") face = <path d="M-8 3 Q0 -8 8 3" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />;
    else if (id === "nap") face = <path d="M-8 -1 Q0 7 8 -1" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />;
    else if (id === "jiggle")
      face = <path d={left ? "M-6 -7 L5 0 L-6 7" : "M6 -7 L-5 0 L6 7"} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
    else
      face = (
        <g transform={`scale(1 ${blink ? 0.12 : 1})`}>
          <ellipse rx="7.5" ry="10" fill={ink} />
          <circle cx="2.6" cy="-3.6" r="2.6" fill="white" />
        </g>
      );
    return (
      <g key={e.a} transform={`translate(${e.x} 98) scale(${e.sx} 1)`} opacity={Math.min(1, e.z * 3)}>
        {face}
      </g>
    );
  };

  const mouthShape =
    id === "hop" || id === "love" ? (
      <g>
        <path d="M-8 -2 Q0 12 8 -2 Z" fill="oklch(0.42 0.14 20)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cy="4.5" rx="3.6" ry="2" fill="oklch(0.72 0.16 15)" />
      </g>
    ) : id === "jiggle" || id === "wave" ? (
      <path d="M-10 -1 Q-5 6 0 0 Q5 6 10 -1" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : id === "nap" ? (
      <ellipse rx="3" ry="3.6" fill="none" stroke={ink} strokeWidth="3" />
    ) : (
      <path d="M-8 0 Q0 8 8 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    );

  const arm = (a: (typeof arms)[number]) => {
    const right = a.a > 0;
    const waving = id === "wave" && !right;
    return (
      <g key={a.a} transform={`translate(${a.x} 130)`}>
        <g className={cn(waving && "mochi-wave", id === "hop" && "mochi-flap")} style={{ transformBox: "fill-box", transformOrigin: right ? "0% 20%" : "100% 20%" }}>
          <ellipse rx="10" ry="15" transform={`rotate(${right ? -28 : 28})`} fill={`color-mix(in oklab, ${fill} 82%, black)`} stroke={ink} strokeWidth="3.5" />
        </g>
      </g>
    );
  };

  return (
    <button
      type="button"
      aria-label={`${label}. Tap for a cute trick.`}
      aria-describedby={statusId}
      onClick={perform}
      onPointerMove={onMove}
      onPointerLeave={() => {
        hovering.current = false;
        if (!busy.current) turnTo(0, 600);
      }}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.45, height: size * 1.3 }}
    >
      <style href="mochi-blob" precedence="default">{`
        @keyframes mochi-breathe { 0%, 100% { scale: 1 1; } 50% { scale: 1.03 0.97; } }
        @keyframes mochi-hop { 0% { translate: 0 0; scale: 1 1; } 15% { translate: 0 0; scale: 1.18 0.8; } 40% { translate: 0 -32%; scale: 0.88 1.14; } 62% { translate: 0 0; scale: 1.2 0.82; } 78% { scale: 0.95 1.06; } 100% { translate: 0 0; scale: 1 1; } }
        @keyframes mochi-jiggle { 0%, 100% { scale: 1 1; } 15% { scale: 1.16 0.86; } 30% { scale: 0.9 1.1; } 45% { scale: 1.08 0.93; } 60% { scale: 0.96 1.04; } 75% { scale: 1.03 0.98; } }
        @keyframes mochi-melt { 0%, 100% { scale: 1 1; } 30%, 80% { scale: 1.1 0.9; } }
        @keyframes mochi-twirl { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8%; } }
        @keyframes mochi-wave { 0%, 100% { rotate: 0deg; } 20% { rotate: 120deg; } 35% { rotate: 90deg; } 50% { rotate: 125deg; } 65% { rotate: 90deg; } 80% { rotate: 120deg; } }
        @keyframes mochi-flap { 0%, 100% { rotate: 0deg; } 40% { rotate: 50deg; } }
        @keyframes mochi-shadow { 0%, 100% { scale: 1; opacity: 1; } 40% { scale: 0.6; opacity: 0.5; } }
        @keyframes mochi-float { from { opacity: 0; translate: 0 0; scale: 0.4; } 20% { opacity: 1; scale: 1; } to { opacity: 0; translate: var(--dx) -150%; scale: 0.9; } }
        .mochi-breathe { animation: mochi-breathe 2.6s ease-in-out infinite; transform-origin: 50% 90%; }
        .mochi-hop { animation: mochi-hop 1s cubic-bezier(.3,0,.3,1); transform-origin: 50% 90%; }
        .mochi-jiggle { animation: mochi-jiggle 1s ease-out; transform-origin: 50% 90%; }
        .mochi-melt { animation: mochi-melt 2.4s ease-in-out; transform-origin: 50% 90%; }
        .mochi-twirl { animation: mochi-twirl 1s ease-in-out; }
        .mochi-wave { animation: mochi-wave 1.4s ease-in-out; }
        .mochi-flap { animation: mochi-flap 0.5s ease-in-out 2; }
        .mochi-shadow-hop { animation: mochi-shadow 1s cubic-bezier(.3,0,.3,1); }
        .mochi-float { animation: mochi-float 1.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .mochi-breathe, .mochi-hop, .mochi-jiggle, .mochi-melt, .mochi-twirl, .mochi-wave, .mochi-flap, .mochi-shadow-hop, .mochi-float { animation: none; }
        }
      `}</style>

      <span
        aria-hidden
        className={cn("absolute bottom-[9%] left-1/2 block h-[8%] w-[52%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-[3px]", id === "hop" && "mochi-shadow-hop")}
        key={`shadow-${action?.n ?? 0}`}
      />

      {/* Little extras that float up: hearts for love and hops, Zs for a nap. */}
      {(id === "love" || id === "hop" || id === "nap") && (
        <span aria-hidden key={`fx-${action?.n}`} className="pointer-events-none absolute inset-x-0 top-[12%] z-10 flex justify-center gap-6">
          {[-1, 0, 1].map((k, i) =>
            id === "nap" ? (
              <span key={k} className="mochi-float font-mono text-lg font-bold text-ink" style={{ animationDelay: `${i * 0.45}s`, "--dx": `${10 + i * 6}px` } as CSSProperties}>
                z
              </span>
            ) : (
              <svg key={k} viewBox="-10 -10 20 16" className="mochi-float size-5" style={{ animationDelay: `${i * 0.18}s`, "--dx": `${k * 18}px` } as CSSProperties}>
                <path d={HEART} fill="oklch(0.68 0.2 10)" stroke="var(--ink)" strokeWidth="1.5" />
              </svg>
            ),
          )}
        </span>
      )}

      <div className="mochi-breathe" style={{ width: size }}>
        <div
          key={action?.n ?? 0}
          className={cn(id === "hop" && "mochi-hop", id === "jiggle" && "mochi-jiggle", id === "nap" && "mochi-melt", id === "spin" && "mochi-twirl")}
        >
          <svg aria-hidden viewBox="0 0 200 190" overflow="visible" className="block w-full">
            <defs>
              <radialGradient id={gradId} cx="38%" cy="32%" r="78%">
                <stop offset="0%" stopColor={`color-mix(in oklab, ${fill} 45%, white)`} />
                <stop offset="45%" stopColor={fill} />
                <stop offset="100%" stopColor={`color-mix(in oklab, ${fill} 72%, black)`} />
              </radialGradient>
            </defs>

            {/* Arms that have turned behind it. */}
            {arms.filter((a) => !a.front).map(arm)}

            {/* A hard brutal shadow, then the jelly body with its gloss. */}
            <path d={BODY_PATH} transform="translate(6 6)" fill={ink} />
            <path d={BODY_PATH} fill={`url(#${gradId})`} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
            <ellipse cx="68" cy="66" rx="16" ry="9" transform="rotate(-32 68 66)" fill="white" opacity="0.7" />
            <circle cx="88" cy="52" r="4" fill="white" opacity="0.75" />

            {/* The leaf sprout on top, turning with it. */}
            <g transform={`translate(${CX + Math.sin(sproutPhi) * 4} 36)`}>
              <path d="M0 0 C0 -8 1 -12 2 -15" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
              <g transform={`translate(2 -15) scale(${Math.cos(sproutPhi) || 0.05} 1)`}>
                <path d="M0 0 C6 -10 18 -10 22 -4 C16 4 6 4 0 0 Z" fill="oklch(0.76 0.17 140)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
              </g>
            </g>

            {/* The heart on its back, seen when it turns around. */}
            {back.front && (
              <g transform={`translate(${back.x} 104) scale(${back.sx * 2.6} 2.6)`} opacity={Math.min(1, back.z * 3)}>
                <path d={HEART} fill="oklch(0.7 0.19 8)" stroke={ink} strokeWidth="1.3" />
              </g>
            )}

            {/* The face. */}
            {cheeks.filter((c) => c.front).map((c) => (
              <ellipse
                key={c.a}
                cx={c.x}
                cy={117}
                rx={9 * c.sx * (id === "love" ? 1.25 : 1)}
                ry={id === "love" ? 6 : 5}
                fill="oklch(0.72 0.16 10)"
                opacity={(id === "love" ? 0.9 : 0.6) * Math.min(1, c.z * 3)}
              />
            ))}
            {eyes.filter((e) => e.front).map(eye)}
            {mouth.front && (
              <g transform={`translate(${mouth.x} 114) scale(${mouth.sx} 1)`} opacity={Math.min(1, mouth.z * 3)}>
                {mouthShape}
              </g>
            )}

            {/* Arms on our side. */}
            {arms.filter((a) => a.front).map(arm)}
          </svg>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {action ? ACTIONS.find((a) => a.id === action.id)?.say : ""}
      </span>
    </button>
  );
}

const COLORS: MochiColor[] = ["mint", "pink", "lemon", "sky"];

/**
 * The lab: Mochi, with a color picker. `preview` (the Labs index card) shows
 * just the blob; the picker lives on the lab's own page.
 */
export function MochiLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<MochiColor>("mint");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Mochi color={color} />
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
              style={{ background: BODY[c] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
