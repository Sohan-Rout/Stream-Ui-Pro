"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowUp, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@streamuilib/react";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/games/best-score";
import { NOTE, blip } from "@/lib/games/arcade-sound";
import {
  COUNTDOWN_START,
  DARTS_PER_TURN,
  RING,
  SCORE_TURNS,
  SECTORS,
  SPREAD,
  STEADY_FROM,
  STEADY_TO,
  createGame,
  landing,
  nextTurn,
  scoreAt,
  spreadAfter,
  swayAt,
  throwDart,
  turnTotal,
  windDirection,
  withNewWind,
  type DartsEvent,
  type DartsGame,
  type Hit,
  type Mode,
  type Point,
  type Wind,
} from "@/lib/games/darts";

/** SVG units per board unit; the viewBox leaves room for the number ring and the wall. */
const UNIT = 100;
const HALF = 125;
const NUMBER_RING = 1.2;
/** Darts that miss still stick in sight. */
const MAX_SHOWN = 1.17;
/** Starts on the treble 20. */
const START_AIM: Point = { x: 0, y: -(RING.tripleIn + RING.tripleOut) / 2 };
/** How far an arrow key moves the aim. */
const KEY_STEP = 0.03;
/** On touch the crosshair sits above the finger, so the finger doesn't hide it. */
const TOUCH_LIFT = 0.3;
const FLIGHT = 200;
/** How long darts stay in the board after a turn. */
const PULL_OUT = 1200;
const DART_TONES = ["fill-orange", "fill-blue", "fill-violet"];

const polar = (r: number, turn: number) => {
  const a = turn * 2 * Math.PI;
  return `${(r * UNIT * Math.sin(a)).toFixed(2)} ${(-r * UNIT * Math.cos(a)).toFixed(2)}`;
};

/** A slice of a ring, from one angle to another (in turns, clockwise from the top). */
function slice(inner: number, outer: number, from: number, to: number) {
  return `M${polar(inner, from)} A${inner * UNIT} ${inner * UNIT} 0 0 1 ${polar(inner, to)} L${polar(outer, to)} A${outer * UNIT} ${outer * UNIT} 0 0 0 ${polar(outer, from)} Z`;
}

/** The board never changes, so it's drawn once. */
const Board = memo(function Board() {
  const step = 1 / SECTORS.length;
  return (
    <g>
      <circle cx={5} cy={5} r={NUMBER_RING * UNIT} className="fill-ink" />
      <circle r={NUMBER_RING * UNIT} className="fill-ink" />
      {SECTORS.map((n, i) => {
        const from = (i - 0.5) * step;
        const to = (i + 0.5) * step;
        const even = i % 2 === 0;
        const flat = even ? "fill-ink" : "fill-paper-raised";
        const bright = even ? "fill-pink" : "fill-lime";
        const a = i * step * 2 * Math.PI;
        const r = 1.1 * UNIT;
        return (
          <g key={n} className="stroke-ink" strokeWidth={0.8}>
            <path d={slice(RING.outerBull, RING.tripleIn, from, to)} className={flat} />
            <path d={slice(RING.tripleIn, RING.tripleOut, from, to)} className={bright} />
            <path d={slice(RING.tripleOut, RING.doubleIn, from, to)} className={flat} />
            <path d={slice(RING.doubleIn, RING.doubleOut, from, to)} className={bright} />
            <text
              x={r * Math.sin(a)}
              y={-r * Math.cos(a)}
              textAnchor="middle"
              dominantBaseline="central"
              strokeWidth={0}
              className="fill-paper font-mono text-[11px] font-bold select-none"
            >
              {n}
            </text>
          </g>
        );
      })}
      <circle r={RING.doubleOut * UNIT} fill="none" className="stroke-paper-raised" strokeWidth={0.8} />
      <circle r={RING.outerBull * UNIT} className="fill-lime stroke-ink" strokeWidth={1} />
      <circle r={RING.innerBull * UNIT} className="fill-pink stroke-ink" strokeWidth={1} />
    </g>
  );
});

/** A dart, with its tip at the origin and its flight up and to the right. */
function DartArt({ tone }: { tone: string }) {
  return (
    <g transform="rotate(24)" className="stroke-ink" strokeWidth={1.2} strokeLinejoin="round">
      <path d="M0 0 L0 -13" strokeWidth={1.8} strokeLinecap="round" />
      <rect x={-2.4} y={-25} width={4.8} height={12} rx={1.4} className="fill-paper-raised" />
      <path d="M0 -25 L0 -33" strokeWidth={1.6} />
      <path d="M0 -30 L-7 -43 L0 -39 L7 -43 Z" className={tone} />
    </g>
  );
}

function clampShown({ x, y }: Point): Point {
  const r = Math.hypot(x, y);
  const k = r > MAX_SHOWN ? MAX_SHOWN / r : 1;
  return { x: x * k * UNIT, y: y * k * UNIT };
}

function sound(e: DartsEvent) {
  if (e.kind === "hit") {
    const { ring } = e.hit;
    if (ring === "miss") {
      blip([{ f: 130, dur: 0.09, type: "triangle", gain: 0.1, to: 80 }]);
      return;
    }
    blip([{ f: 110, dur: 0.07, type: "triangle", gain: 0.16, to: 70 }]);
    if (ring === "inner-bull") blip([NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6].map((f, i) => ({ f, at: 0.05 + i * 0.06, dur: 0.1 })));
    else if (ring === "triple" || ring === "outer-bull") blip([NOTE.E5, NOTE.G5, NOTE.C6].map((f, i) => ({ f, at: 0.05 + i * 0.05, dur: 0.08, gain: 0.04 })));
    else if (ring === "double") blip([NOTE.E5, NOTE.G5].map((f, i) => ({ f, at: 0.05 + i * 0.05, dur: 0.08, gain: 0.035 })));
  } else if (e.kind === "bust") {
    blip([NOTE.E4, NOTE.C4].map((f, i) => ({ f, at: 0.1 + i * 0.14, dur: 0.2, type: "triangle" as const, gain: 0.12 })));
  } else {
    blip([NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6].map((f, i) => ({ f, at: 0.1 + i * 0.08, dur: 0.14 })));
  }
}

const hitTone = (hit: Hit) =>
  hit.ring === "miss" ? "bg-paper-raised text-ink" : hit.ring === "single" ? "bg-paper-raised text-ink" : hit.ring === "triple" || hit.ring === "inner-bull" ? "bg-pink text-on-bright" : "bg-lime text-on-bright";

const windWords = (wind: Wind) => `Wind ${wind.speed} miles an hour, blowing ${windDirection(wind)}.`;

const prefersStill = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

type Popup = { id: number; left: number; top: number; text: string; tone: string };
type Banner = { id: number; text: string; tone: string };

export function DartsLab() {
  // The game lives in a ref (the source of truth); state only re-renders it.
  const [game, setGame] = useState<DartsGame>(createGame);
  const gameRef = useRef<DartsGame>(game);
  const [flying, setFlying] = useState<{ at: Point; wind: Wind } | null>(null);
  const flyingRef = useRef(false);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [aimLabel, setAimLabel] = useState(() => scoreAt(START_AIM).label);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [best, saveBest] = useBestScore("darts");
  const mutedRef = useRef(false);
  const aimRef = useRef<Point>(START_AIM);
  const holdStart = useRef<number | null>(null);
  const raf = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const uid = useRef(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const ringHaloRef = useRef<SVGCircleElement>(null);
  const statusId = useId();

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  /** Puts the crosshair and its ring where they belong, without a React render. */
  const drawReticle = useCallback((held: number | null) => {
    const spread = held === null ? SPREAD.start : spreadAfter(held);
    const drift = held === null || prefersStill() ? { x: 0, y: 0 } : swayAt(held, spread);
    const { x, y } = aimRef.current;
    reticleRef.current?.setAttribute("transform", `translate(${(x + drift.x) * UNIT} ${(y + drift.y) * UNIT})`);
    const r = String(spread * UNIT);
    ringRef.current?.setAttribute("r", r);
    ringHaloRef.current?.setAttribute("r", r);
    const steady = held !== null && held >= STEADY_FROM && held <= STEADY_TO;
    reticleRef.current?.setAttribute("data-steady", String(steady));
  }, []);

  const setAim = useCallback(
    (next: Point) => {
      // The crosshair can roam a little past the board, but not out of sight.
      const r = Math.hypot(next.x, next.y);
      const k = r > NUMBER_RING ? NUMBER_RING / r : 1;
      aimRef.current = { x: next.x * k, y: next.y * k };
      setAimLabel(scoreAt(aimRef.current).label);
      if (holdStart.current === null) drawReticle(null);
    },
    [drawReticle],
  );

  const pointerAim = useCallback(
    (e: PointerEvent) => {
      const box = boardRef.current?.getBoundingClientRect();
      if (!box?.width) return;
      const scale = (2 * HALF) / box.width / UNIT;
      setAim({
        x: (e.clientX - box.left - box.width / 2) * scale,
        y: (e.clientY - box.top - box.height / 2) * scale - (e.pointerType === "touch" ? TOUCH_LIFT : 0),
      });
    },
    [setAim],
  );

  const cancelHold = useCallback(() => {
    if (holdStart.current === null) return;
    holdStart.current = null;
    cancelAnimationFrame(raf.current);
    drawReticle(null);
  }, [drawReticle]);

  const finishTurn = useCallback(() => {
    const pulled = nextTurn(gameRef.current);
    const next = pulled.status === "over" ? pulled : withNewWind(pulled, Math.random);
    gameRef.current = next;
    setGame(next);
    setPopup(null);
    if (next.status === "over") {
      if (next.mode === "score") {
        saveBest(next.score);
        setMessage(`Game over. You scored ${next.score}.`);
      } else {
        setMessage(`Checkout! 301 in ${next.thrown} darts.`);
      }
    } else {
      setMessage(`Turn ${next.turn}. ${windWords(next.wind)}`);
    }
  }, [saveBest]);

  const land = useCallback(
    (at: Point) => {
      flyingRef.current = false;
      setFlying(null);
      const thrown = throwDart(gameRef.current, at);
      const events = thrown.events;
      const next = thrown.game.turnOver ? thrown.game : withNewWind(thrown.game, Math.random);
      gameRef.current = next;
      setGame(next);
      const id = ++uid.current;
      let line = "";
      for (const e of events) {
        if (!mutedRef.current) sound(e);
        if (e.kind === "hit") {
          const shown = clampShown(at);
          setPopup({
            id,
            left: Math.min(84, Math.max(16, ((shown.x + HALF) / (2 * HALF)) * 100)),
            top: Math.min(90, Math.max(10, ((shown.y + HALF) / (2 * HALF)) * 100)),
            text: e.hit.points ? `+${e.hit.points}` : "Miss",
            tone: hitTone(e.hit),
          });
          line = e.hit.points ? `${e.hit.label}, ${e.hit.points} points.` : "Miss.";
        } else if (e.kind === "bust") {
          setBanner({ id, text: "Bust!", tone: "bg-pink text-on-bright" });
          line += ` Bust. Back to ${next.score}.`;
        } else if (e.kind === "max") {
          setBanner({ id, text: "180!", tone: "bg-lime text-on-bright" });
          line += " One hundred and eighty!";
        } else if (e.kind === "win") {
          setBanner({ id, text: "Checkout!", tone: "bg-lime text-on-bright" });
        }
      }
      setMessage(next.turnOver ? line : `${line} ${windWords(next.wind)}`);
      later(() => setBanner((b) => (b?.id === id ? null : b)), PULL_OUT);
      later(() => setPopup((p) => (p?.id === id ? null : p)), 900);
      if (next.turnOver) later(finishTurn, PULL_OUT);
    },
    [finishTurn, later],
  );

  const canThrow = useCallback(() => gameRef.current.status === "playing" && !gameRef.current.turnOver && !flyingRef.current, []);

  const press = useCallback(() => {
    if (!canThrow() || holdStart.current !== null) return;
    const started = performance.now();
    holdStart.current = started;
    const frame = (now: number) => {
      drawReticle(Math.max(0, now - started) / 1000);
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  }, [canThrow, drawReticle]);

  const release = useCallback(() => {
    if (holdStart.current === null) return;
    const held = (performance.now() - holdStart.current) / 1000;
    holdStart.current = null;
    cancelAnimationFrame(raf.current);
    drawReticle(null);
    if (!canThrow()) return;
    const { wind } = gameRef.current;
    const at = landing(aimRef.current, held, Math.random, wind);
    if (!mutedRef.current) blip([{ f: 500, dur: 0.14, type: "sine", gain: 0.02, to: 1400 }]);
    if (prefersStill()) return land(at);
    flyingRef.current = true;
    setFlying({ at, wind });
    later(() => land(at), FLIGHT);
  }, [canThrow, drawReticle, land, later]);

  const start = useCallback(
    (mode: Mode) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      flyingRef.current = false;
      setFlying(null);
      setPopup(null);
      setBanner(null);
      gameRef.current = withNewWind(createGame(mode, "playing"), Math.random);
      setGame(gameRef.current);
      setMessage(`${mode === "score" ? `${SCORE_TURNS} turns.` : `Count down from ${COUNTDOWN_START} to exactly zero.`} ${windWords(gameRef.current.wind)}`);
      aimRef.current = START_AIM;
      setAimLabel(scoreAt(START_AIM).label);
      drawReticle(null);
      boardRef.current?.focus({ preventScroll: true });
    },
    [drawReticle],
  );

  function onKeyDown(e: KeyboardEvent) {
    if (gameRef.current.status !== "playing") return;
    const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (move) {
      e.preventDefault();
      setAim({ x: aimRef.current.x + move[0] * KEY_STEP, y: aimRef.current.y + move[1] * KEY_STEP });
      setMessage(`Aiming at ${scoreAt(aimRef.current).label}.`);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!e.repeat) press();
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      release();
    }
  }

  const playing = game.status === "playing";
  const left = DARTS_PER_TURN - game.darts.length;
  const countdown = game.mode === "301";

  return (
    <div className="flex w-full flex-col items-center gap-3 text-ink">
      <div className="flex w-full max-w-96 items-center justify-between gap-2 font-mono text-xs uppercase">
        <span>
          {countdown ? "Left" : "Score"} <span className="font-bold tabular-nums">{String(game.score).padStart(3, "0")}</span>
        </span>
        <span className="text-ink-muted">
          Turn{" "}
          <span className="font-bold text-ink tabular-nums">
            {game.turn}
            {countdown ? "" : `/${SCORE_TURNS}`}
          </span>
        </span>
        {countdown ? (
          <span className="text-ink-muted">
            Darts <span className="font-bold text-ink tabular-nums">{game.thrown}</span>
          </span>
        ) : (
          <span className="text-ink-muted">
            Best <span className="font-bold text-ink tabular-nums">{best}</span>
          </span>
        )}
        <button
          type="button"
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          aria-pressed={!muted}
          onClick={() => setMuted((m) => (mutedRef.current = !m))}
          className="grid size-6 place-items-center text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {muted ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
        </button>
      </div>

      <div
        ref={boardRef}
        role="group"
        tabIndex={0}
        aria-label="Darts board. Arrow keys aim; hold Space or Enter to steady your hand and let go to throw."
        aria-describedby={statusId}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={cancelHold}
        onPointerMove={(e) => {
          if (gameRef.current.status === "playing") pointerAim(e);
        }}
        onPointerDown={(e) => {
          if (gameRef.current.status !== "playing") return;
          e.preventDefault();
          boardRef.current?.focus({ preventScroll: true });
          e.currentTarget.setPointerCapture?.(e.pointerId);
          pointerAim(e);
          press();
        }}
        onPointerUp={() => release()}
        onPointerCancel={cancelHold}
        className={cn(
          "relative aspect-square w-full max-w-96 overflow-hidden border-2 border-ink bg-blue-soft bg-dots shadow-brutal-lg select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
          playing && "cursor-crosshair touch-none",
        )}
      >
        <svg viewBox={`${-HALF} ${-HALF} ${2 * HALF} ${2 * HALF}`} aria-hidden className="block size-full">
          <Board />

          {game.darts.map((d, i) => {
            const p = clampShown(d);
            return (
              <g key={i} transform={`translate(${p.x} ${p.y})`}>
                <g className="darts-stuck">
                  <DartArt tone={DART_TONES[i % DART_TONES.length]} />
                </g>
              </g>
            );
          })}

          {playing && (
            <g ref={reticleRef} transform={`translate(${START_AIM.x * UNIT} ${START_AIM.y * UNIT})`} data-steady="false" className="darts-reticle pointer-events-none">
              <circle ref={ringHaloRef} r={SPREAD.start * UNIT} fill="none" className="stroke-paper-raised" strokeWidth={4} />
              <circle ref={ringRef} r={SPREAD.start * UNIT} fill="none" strokeWidth={2} className="darts-ring stroke-ink" />
              <path d="M-7 0 H7 M0 -7 V7" className="stroke-paper-raised" strokeWidth={4} strokeLinecap="round" />
              <path d="M-7 0 H7 M0 -7 V7" className="stroke-ink" strokeWidth={2} strokeLinecap="round" />
              <g className="darts-now">
                <rect x={-14} y={-27} width={28} height={13} className="fill-lime stroke-ink" strokeWidth={1.5} />
                <text y={-20.5} textAnchor="middle" dominantBaseline="central" className="fill-on-bright font-mono text-[9px] font-bold uppercase">
                  Now
                </text>
              </g>
            </g>
          )}

          {flying &&
            (() => {
              const p = clampShown(flying.at);
              // The flight starts upwind, so the dart visibly drifts on its way in.
              const from = { "--darts-from-x": `${30 - flying.wind.x * UNIT * 1.6}px`, "--darts-from-y": `${130 - flying.wind.y * UNIT * 1.6}px` } as CSSProperties;
              return (
                <g transform={`translate(${p.x} ${p.y})`} className="pointer-events-none">
                  <g className="darts-flying" style={from}>
                    <DartArt tone={DART_TONES[game.darts.length % DART_TONES.length]} />
                  </g>
                </g>
              );
            })()}
        </svg>

        {playing && (
          <span aria-hidden className="pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1.5 border-2 border-ink bg-paper-raised px-1.5 py-0.5 font-mono text-xs font-bold shadow-brutal-sm">
            <ArrowUp
              className="size-4 transition-[rotate] duration-300 motion-reduce:transition-none"
              strokeWidth={3}
              style={{ rotate: `${(Math.atan2(game.wind.x, -game.wind.y) * 180) / Math.PI}deg` }}
            />
            <span className="tabular-nums">{game.wind.speed}</span>
            <span className="font-normal text-ink-muted">mph</span>
          </span>
        )}

        {popup && (
          <span
            key={popup.id}
            aria-hidden
            style={{ left: `${popup.left}%`, top: `${popup.top}%` }}
            className={cn(
              "pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full animate-[darts-pop_900ms_ease-out_forwards] border-2 border-ink px-1.5 font-mono text-sm font-bold shadow-brutal-sm motion-reduce:animate-none",
              popup.tone,
            )}
          >
            {popup.text}
          </span>
        )}

        {banner && (
          <span
            key={banner.id}
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 -rotate-3 animate-[darts-stamp_260ms_cubic-bezier(.3,1.6,.5,1)] border-2 border-ink px-4 py-1 font-display text-3xl tracking-tight whitespace-nowrap shadow-brutal motion-reduce:animate-none",
              banner.tone,
            )}
          >
            {banner.text}
          </span>
        )}

        {!playing && (
          <div className="absolute inset-0 z-40 grid place-items-center bg-paper/60 p-6">
            <div className="flex w-full max-w-64 flex-col items-center gap-3 border-2 border-ink bg-paper-raised p-5 text-center shadow-brutal">
              <p className="font-display text-2xl leading-none tracking-tight">{game.status === "ready" ? "Darts" : game.won ? "Checkout!" : "Game over"}</p>
              {game.status === "ready" ? (
                <p className="text-sm text-ink-muted">The wind pushes every dart, so aim off. Hold to steady your hand and let go when the ring says now.</p>
              ) : game.won ? (
                <p className="font-mono text-xs uppercase">
                  301 in <span className="font-bold">{game.thrown}</span> darts
                </p>
              ) : (
                <p className="font-mono text-xs uppercase">
                  Score <span className="font-bold">{game.score}</span> · Best <span className="font-bold">{Math.max(best, game.score)}</span>
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" onClick={() => start("score")}>
                  {game.status === "over" && !countdown ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                  {SCORE_TURNS} turns
                </Button>
                <Button size="sm" variant="secondary" onClick={() => start("301")}>
                  {game.status === "over" && countdown ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                  {COUNTDOWN_START}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-96 items-center justify-between gap-3 font-mono text-xs uppercase">
        <span role="img" aria-label={`${left} ${left === 1 ? "dart" : "darts"} left this turn`} className="flex gap-1">
          {Array.from({ length: DARTS_PER_TURN }, (_, i) => (
            <span key={i} className={cn("size-3 rotate-45 border-2 border-ink", i < left ? "bg-lime" : "bg-paper-sunken")} />
          ))}
        </span>
        <span className="truncate text-ink-muted">
          Aim <span className="font-bold text-ink">{aimLabel}</span>
        </span>
        <span className="text-ink-muted">
          Turn <span className="font-bold text-ink tabular-nums">{turnTotal(game)}</span>
        </span>
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      <style href="darts-lab" precedence="default">{`
        @keyframes darts-pop { from { opacity: 1; translate: 0 0; } 70% { opacity: 1; } to { opacity: 0; translate: 0 -24px; } }
        @keyframes darts-stamp { from { opacity: 0; scale: 2; } }
        @keyframes darts-fly { from { translate: var(--darts-from-x) var(--darts-from-y); scale: 3.2; opacity: .4; } to { translate: 0 0; scale: 1; opacity: 1; } }
        @keyframes darts-thud { 0% { rotate: 7deg; } 35% { rotate: -5deg; } 70% { rotate: 2deg; } 100% { rotate: 0; } }
        .darts-flying { animation: darts-fly ${FLIGHT}ms cubic-bezier(.4, 0, .7, .4) both; }
        .darts-stuck { animation: darts-thud 320ms ease-out; }
        .darts-now { display: none; }
        .darts-reticle[data-steady="true"] .darts-now { display: inline; }
        .darts-reticle[data-steady="true"] .darts-ring { stroke: var(--color-lime); }
        @media (prefers-reduced-motion: reduce) { .darts-flying, .darts-stuck { animation: none; } }
      `}</style>
    </div>
  );
}
