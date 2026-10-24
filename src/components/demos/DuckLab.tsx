"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { cn } from "@streamuilib/react";
import { blip, quack } from "@/lib/games/arcade-sound";

export type DuckColor = "yellow" | "pink" | "mint" | "lilac";

export type QuackersProps = {
  color?: DuckColor;
  /** Width of the duck, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const BODY: Record<DuckColor, string> = {
  yellow: "oklch(0.84 0.17 86)",
  pink: "oklch(0.78 0.13 355)",
  mint: "oklch(0.8 0.12 165)",
  lilac: "oklch(0.74 0.12 300)",
};
const BEAK = "oklch(0.72 0.18 50)";

type Action = "quack" | "quack-high" | "squeak" | "spin";

/** The tricks, in turn: what pops up in the bubble, what's announced, how long it lasts. */
const ACTIONS: { id: Action; word: string; say: string; ms: number }[] = [
  { id: "quack", word: "Quack!", say: "Quack!", ms: 700 },
  { id: "quack-high", word: "Quack!!", say: "Quack quack!", ms: 700 },
  { id: "squeak", word: "Squeak!", say: "Squeak! It gets squished.", ms: 900 },
  { id: "spin", word: "Wheee!", say: "It hops and spins around.", ms: 1100 },
];

/** Which lit surface a part belongs to. Parts in one group merge into one smooth, seamless form. */
type Group = "body" | "wing-1" | "wing1" | "bill" | "billLow" | "mouth" | "eye" | "glint";

/** A round part: an ellipsoid at a point, with radii along x (length), y (height), and z (width). */
/** `onHead` marks a feature on the head's surface, hidden once it turns away from you. */
type Part = { key: string; x: number; y: number; z: number; a: number; b: number; c: number; g: Group; onHead?: boolean };

const norm = (x: number, y: number, z: number) => {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l] as const;
};

const HEAD = { x: -24, y: -42, z: 0, r: 34 };

/**
 * The duck, in model units, facing -x (its left), y down, z toward its
 * right side. The body, neck, rising tail, and big round head are one
 * surface; the flat, wide bill, the teardrop wings, and the eyes sit on it.
 */
function model(beakOpen: number, squint: number, blink: boolean): Part[] {
  const parts: Part[] = [
    { key: "body", x: 8, y: 22, z: 0, a: 56, b: 33, c: 46, g: "body" },
    { key: "chest", x: -22, y: 14, z: 0, a: 30, b: 30, c: 38, g: "body" },
    { key: "rump", x: 38, y: 6, z: 0, a: 30, b: 26, c: 34, g: "body" },
    { key: "tail", x: 52, y: -9, z: 0, a: 17, b: 22, c: 21, g: "body" },
    { key: "tip", x: 59, y: -22, z: 0, a: 10, b: 13, c: 14, g: "body" },
    { key: "neck", x: -18, y: -14, z: 0, a: 24, b: 20, c: 27, g: "body" },
    { key: "head", x: HEAD.x, y: HEAD.y, z: 0, a: HEAD.r, b: HEAD.r, c: HEAD.r, g: "body" },
    { key: "bill", x: -58, y: -36 - beakOpen * 1.5, z: 0, a: 18, b: 7, c: 20, g: "bill" },
    { key: "bill-tip", x: -69, y: -38 - beakOpen * 1.5, z: 0, a: 9, b: 5.5, c: 17, g: "bill" },
    { key: "bill-low", x: -55 + beakOpen, y: -29 + beakOpen * 3.5, z: 0, a: 15, b: 5.5, c: 16, g: "billLow" },
  ];
  if (beakOpen) parts.push({ key: "mouth", x: -57, y: -32, z: 0, a: 11, b: 3.4, c: 11, g: "mouth" });
  for (const side of [-1, 1]) {
    const wing = side < 0 ? "wing-1" : "wing1";
    parts.push({ key: `${wing}-a`, x: 12, y: 12, z: side * 44, a: 24, b: 15, c: 7, g: wing });
    parts.push({ key: `${wing}-b`, x: 32, y: 6, z: side * 40, a: 14, b: 10, c: 6, g: wing });
    const [ex, ey, ez] = norm(-0.52, -0.3, side * 0.8);
    // Set just into the surface, so an eye never pokes past the head's outline.
    const eye = { x: HEAD.x + ex * HEAD.r * 0.92, y: HEAD.y + ey * HEAD.r * 0.92, z: ez * HEAD.r * 0.92 };
    const ry = blink ? 0.8 : 7 * (1 - squint * 0.75);
    parts.push({ key: `eye${side}`, ...eye, a: 5.4, b: ry, c: 5.4, g: "eye", onHead: true });
    if (!blink && squint < 0.5) parts.push({ key: `glint${side}`, x: eye.x - 0.8, y: eye.y - 2.6, z: eye.z + side * 1.5, a: 2, b: 2, c: 2, g: "glint", onHead: true });
  }
  return parts;
}

type Projected = Part & { sx: number; sy: number; z2: number; rx: number; ry: number };

/**
 * Turns the model by `yaw` (around the vertical, positive turns the bill
 * toward you) and `pitch` (looking down from above), giving each part its
 * on-screen ellipse and depth. Face features on the far side are dropped.
 */
function project(parts: Part[], yawDeg: number, pitchDeg: number): Projected[] {
  const t = (yawDeg * Math.PI) / 180;
  const p = (pitchDeg * Math.PI) / 180;
  const [ct, st, cp, sp] = [Math.cos(t), Math.sin(t), Math.cos(p), Math.sin(p)];
  const all = parts.map((q) => {
    const x1 = q.x * ct + q.z * st;
    const z1 = -q.x * st + q.z * ct;
    const y2 = q.y * cp + z1 * sp;
    const z2 = -q.y * sp + z1 * cp;
    const rx = Math.hypot(q.a * ct, q.c * st);
    const depth = Math.hypot(q.a * st, q.c * ct);
    const ry = Math.hypot(q.b * cp, depth * sp);
    return { ...q, sx: x1, sy: y2, z2, rx, ry };
  });
  const head = all.find((h) => h.key === "head")!;
  return all.filter((q) => !q.onHead || q.z2 > head.z2 + 1);
}

const BASE_YAW = 32;
const BASE_PITCH = 14;

/**
 * Quackers: a glossy rubber duck modeled in 3D. Round parts are placed in
 * space and turned; the body, neck, tail, and head are drawn as one shape and
 * lit with SVG lighting into one seamless plastic surface, with the bill and
 * wings lit the same way on their own, so it's round from every side. It rocks on the spot, glances around, and turns toward the
 * pointer. Each tap is the next trick, with a synthesized voice: a quack (the
 * beak opens), a double quack, a rubbery squeak as it squishes, and a hop with
 * a full spin. One labelled button.
 */
export function Quackers({ color = "yellow", size = 180, label = "Quackers" }: QuackersProps) {
  const [yaw, setYaw] = useState(BASE_YAW);
  const [pitch, setPitch] = useState(BASE_PITCH);
  const [action, setAction] = useState<{ id: Action; n: number } | null>(null);
  const [blink, setBlink] = useState(false);
  const statusId = useId();
  const uid = useId().replace(/:/g, "");
  const still = useRef(false);
  const count = useRef(0);
  const busy = useRef(false);
  const hovering = useRef(false);
  const current = useRef(BASE_YAW);
  const frame = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Turn to `deg` over `ms`, easing in and out, from wherever it is now. */
  const turnTo = (deg: number, ms = 600) => {
    cancelAnimationFrame(frame.current);
    if (still.current) {
      current.current = ((deg % 360) + 360) % 360;
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
        current.current = ((deg + 180) % 360 + 360) % 360 - 180;
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
    }, 3600);
    // Idle: glance about now and then.
    const looks = [BASE_YAW + 26, BASE_YAW, BASE_YAW - 30, BASE_YAW];
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
    setAction({ id: next.id, n });
    if (next.id === "quack") quack(1);
    else if (next.id === "quack-high") {
      quack(1.3);
      later(150, () => quack(1.35, 0.8));
    } else if (next.id === "squeak") {
      blip([
        { f: 1300, to: 1900, dur: 0.12, type: "sine", gain: 0.06 },
        { f: 1900, to: 1400, at: 0.13, dur: 0.16, type: "sine", gain: 0.05 },
      ]);
    } else {
      // A rising whee as it spins, and a quack on landing.
      blip([{ f: 700, to: 1500, dur: 0.45, type: "triangle", gain: 0.05 }]);
      turnTo(current.current + 360, 950);
      later(820, () => quack(1.15));
    }
    later(next.ms, () => {
      busy.current = false;
      setAction((a) => (a && a.n === n ? null : a));
    });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    hovering.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    if (still.current) return;
    setPitch(BASE_PITCH + dy * 16);
    if (!busy.current) turnTo(BASE_YAW + Math.max(-1, Math.min(1, dx * 2)) * 38, 200);
  };

  const id = action?.id;
  const beakOpen = id === "quack" || id === "quack-high" ? 1 : 0;
  const parts = project(model(beakOpen, id === "squeak" ? 1 : 0, blink), yaw, pitch);
  const fill = BODY[color];
  const by = (g: Group) => parts.filter((q) => q.g === g);
  const centerZ = (key: string) => parts.find((q) => q.key === key)!.z2;
  const ellipse = (q: Projected, fillColor: string) => <ellipse key={q.key} cx={q.sx} cy={q.sy} rx={q.rx} ry={q.ry} fill={fillColor} />;

  /** A group of parts drawn as one flat shape, then lit as one smooth plastic surface. */
  const lit = (key: string, groups: [Group, string][], filter: "big" | "small") => (
    <g key={key} filter={`url(#${uid}-${filter})`}>{groups.flatMap(([g, c]) => by(g).map((q) => ellipse(q, c)))}</g>
  );
  const wing = (g: Group) => lit(g, [[g, fill]], "small");
  const nearWing: Group = centerZ("wing1-a") > centerZ("wing-1-a") ? "wing1" : "wing-1";
  const farWing: Group = nearWing === "wing1" ? "wing-1" : "wing1";
  const bill = lit("bill", [["billLow", `color-mix(in oklab, ${BEAK} 85%, black)`], ["mouth", "oklch(0.42 0.12 30)"], ["bill", BEAK]], "small");
  const billInFront = centerZ("bill") > centerZ("head");

  return (
    <button
      type="button"
      aria-label={`${label}. Tap and it quacks.`}
      aria-describedby={statusId}
      onClick={perform}
      onPointerMove={onMove}
      onPointerLeave={() => {
        hovering.current = false;
        setPitch(BASE_PITCH);
        if (!busy.current) turnTo(BASE_YAW, 500);
      }}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.45, height: size * 1.25 }}
    >
      <style href="quackers-duck" precedence="default">{`
        @keyframes duck-rock { 0%, 100% { rotate: -3deg; } 50% { rotate: 3deg; } }
        @keyframes duck-quack { 0%, 100% { scale: 1 1; } 20% { scale: 1.07 0.92; } 45% { scale: 0.97 1.05; } 70% { scale: 1.02 0.99; } }
        @keyframes duck-squeak { 0%, 100% { scale: 1 1; } 18% { scale: 1.2 0.76; } 36% { scale: 0.92 1.1; } 54% { scale: 1.12 0.86; } 72% { scale: 0.98 1.03; } }
        @keyframes duck-hop { 0%, 100% { translate: 0 0; scale: 1 1; } 12% { translate: 0 0; scale: 1.1 0.88; } 50% { translate: 0 -26%; scale: 0.96 1.06; } 82% { translate: 0 0; scale: 1.08 0.92; } }
        @keyframes duck-shadow { 0%, 12%, 82%, 100% { scale: 1; opacity: 1; } 50% { scale: 0.6; opacity: 0.5; } }
        @keyframes duck-word { from { opacity: 0; scale: 0.4; rotate: -14deg; } 60% { opacity: 1; scale: 1.12; rotate: -6deg; } to { opacity: 1; scale: 1; rotate: -8deg; } }
        .duck-rock { animation: duck-rock 2.6s ease-in-out infinite; transform-origin: 50% 88%; }
        .duck-quack { animation: duck-quack 0.5s ease-out; transform-origin: 50% 88%; }
        .duck-squeak { animation: duck-squeak 0.8s ease-out; transform-origin: 50% 88%; }
        .duck-hop { animation: duck-hop 1s cubic-bezier(.4,0,.3,1); transform-origin: 50% 88%; }
        .duck-shadow-hop { animation: duck-shadow 1s cubic-bezier(.4,0,.3,1); }
        .duck-word { animation: duck-word 0.3s cubic-bezier(.2,.9,.3,1.3) both; }
        @media (prefers-reduced-motion: reduce) {
          .duck-rock, .duck-quack, .duck-squeak, .duck-hop, .duck-shadow-hop, .duck-word { animation: none; }
        }
      `}</style>

      <span
        aria-hidden
        key={`shadow-${action?.n ?? 0}`}
        className={cn("absolute bottom-[11%] left-1/2 block h-[9%] w-[48%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-[3px]", id === "spin" && "duck-shadow-hop")}
      />

      <div className="duck-rock" style={{ width: size }}>
        <div key={action?.n ?? 0} className={cn(beakOpen ? "duck-quack" : id === "squeak" ? "duck-squeak" : id === "spin" ? "duck-hop" : "")}>
          <svg aria-hidden viewBox="-86 -80 172 146" overflow="visible" className="block w-full">
            <defs>
              {/* Soft plastic: blur the shape's alpha into a height map, light it, and keep it inside the shape. */}
              {(
                [
                  ["big", 9, 6, true],
                  ["small", 4, 3.5, false],
                ] as const
              ).map(([name, blur, height, goo]) => (
                <filter key={name} id={`${uid}-${name}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                  {goo ? (
                    <>
                      {/* Melt the round parts into one smooth outline (no scallops where they meet), filled with the body color. */}
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
                    <feDistantLight azimuth="235" elevation="48" />
                  </feDiffuseLighting>
                  <feSpecularLighting in="height" surfaceScale={height} specularConstant="0.75" specularExponent="30" lightingColor="white" result="spec-raw">
                    <feDistantLight azimuth="235" elevation="55" />
                  </feSpecularLighting>
                  {/* Smooth out the grain the 8-bit height map leaves in the light. */}
                  <feGaussianBlur in="diffuse-raw" stdDeviation="0.9" result="diffuse" />
                  <feGaussianBlur in="spec-raw" stdDeviation="0.9" result="spec" />
                  <feComposite in="base" in2="diffuse" operator="arithmetic" k1="0.8" k2="0.3" k3="0" k4="0" result="shaded" />
                  <feComposite in="spec" in2="shape" operator="in" result="shine" />
                  <feComposite in="shaded" in2="shine" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0" result="lit" />
                  <feComposite in="lit" in2="shape" operator="in" />
                </filter>
              ))}
            </defs>

            {wing(farWing)}
            {!billInFront && bill}
            {lit("body", [["body", fill]], "big")}
            {wing(nearWing)}
            {billInFront && bill}
            {by("eye").map((q) => ellipse(q, "oklch(0.18 0.02 270)"))}
            {by("glint").map((q) => ellipse(q, "white"))}
          </svg>
        </div>
      </div>

      {/* What it says, in a comic bubble by its beak. */}
      {action && (
        <span
          key={`w-${action.n}`}
          aria-hidden
          className="duck-word absolute top-[2%] left-[4%] z-10 border-[3px] border-ink bg-paper-raised px-2.5 py-0.5 font-display text-lg whitespace-nowrap uppercase shadow-[3px_3px_0_var(--ink)]"
        >
          {ACTIONS.find((a) => a.id === id)?.word}
        </span>
      )}

      <span id={statusId} aria-live="polite" className="sr-only">
        {action ? ACTIONS.find((a) => a.id === action.id)?.say : ""}
      </span>
    </button>
  );
}

const COLORS: DuckColor[] = ["yellow", "pink", "mint", "lilac"];

/**
 * The lab: Quackers, with a color picker. `preview` (the Labs index card)
 * shows just the duck; the picker lives on the lab's own page.
 */
export function DuckLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<DuckColor>("yellow");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Quackers color={color} />
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
