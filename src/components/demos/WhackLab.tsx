"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@streamuilib/react";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/games/best-score";
import { NOTE, blip } from "@/lib/games/arcade-sound";
import { ROUND, createGame, multiplier, step, whack, type Hole, type Kind, type WhackEvent, type WhackGame } from "@/lib/games/whack";

/** Number keys in numpad layout: 7 8 9 on top, 1 2 3 on the bottom. */
const KEY_TO_HOLE: Record<string, number> = { "7": 0, "8": 1, "9": 2, "4": 3, "5": 4, "6": 5, "1": 6, "2": 7, "3": 8 };
const HOLE_KEY = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];

function sound(e: WhackEvent) {
  if (e.kind === "hit" && e.what === "bomb") blip([{ f: 140, dur: 0.25, type: "triangle", gain: 0.15, to: 60 }]);
  else if (e.kind === "hit" && e.what === "gold") blip([NOTE.C6, NOTE.E6, NOTE.G6].map((f, i) => ({ f, at: i * 0.05, dur: 0.08 })));
  else if (e.kind === "hit") blip([{ f: NOTE.G5, dur: 0.06, to: NOTE.C5, gain: 0.05 }, { f: 90, dur: 0.06, type: "triangle", gain: 0.12 }]);
  else if (e.kind === "pop") blip([{ f: NOTE.C5, dur: 0.05, gain: 0.015, to: NOTE.E5 }]);
  else if (e.kind === "miss") blip([{ f: 120, dur: 0.05, type: "triangle", gain: 0.08 }]);
  else if (e.kind === "combo") blip([NOTE.E5, NOTE.G5, NOTE.C6].map((f, i) => ({ f, at: 0.1 + i * 0.06, dur: 0.08, gain: 0.04 })));
  else if (e.kind === "over") blip([NOTE.G4, NOTE.E4, NOTE.C4].map((f, i) => ({ f, at: i * 0.15, dur: 0.2, type: "triangle" as const, gain: 0.12 })));
}

/** What pops out of a hole: a mole, a gold mole with a crown, or a bomb. Bonked ones get X eyes. */
function Critter({ kind, bonked }: { kind: Kind; bonked: boolean }) {
  if (kind === "bomb") {
    return (
      <span className="relative mx-auto block aspect-square w-[56%]">
        <span className="absolute top-0 left-1/2 block h-[22%] w-1 -translate-x-1/2 bg-ink" />
        <span className="absolute -top-[8%] left-1/2 block size-[22%] -translate-x-1/2 rounded-full border-2 border-ink bg-pink" />
        <span className="absolute inset-x-0 bottom-0 grid h-[82%] place-items-center rounded-full border-2 border-ink bg-ink font-display text-lg text-paper-raised shadow-brutal-sm">
          {bonked ? "×" : "!"}
        </span>
      </span>
    );
  }
  const gold = kind === "gold";
  return (
    <span className="relative mx-auto block w-[58%]">
      {gold && (
        <span className="absolute bottom-[94%] left-1/2 z-10 block aspect-[2/1] w-[60%] -translate-x-1/2 bg-ink [clip-path:polygon(0_100%,0_15%,25%_55%,50%_0,75%_55%,100%_15%,100%_100%)]">
          <span className="absolute inset-[3px] bottom-0 block bg-orange [clip-path:polygon(0_100%,0_15%,25%_55%,50%_0,75%_55%,100%_15%,100%_100%)]" />
        </span>
      )}
      <span
        className={cn(
          "relative block aspect-[4/5] rounded-t-full border-2 border-ink shadow-brutal-sm",
          gold ? "bg-lime" : "bg-violet",
        )}
      >
        {/* Eyes, then a muzzle with a pink nose. */}
        <span className="absolute top-[30%] left-[24%] font-mono text-[10px] leading-none font-bold">{bonked ? "×" : "●"}</span>
        <span className="absolute top-[30%] right-[24%] font-mono text-[10px] leading-none font-bold">{bonked ? "×" : "●"}</span>
        <span className="absolute top-[50%] left-1/2 block h-[24%] w-[54%] -translate-x-1/2 rounded-full border-2 border-ink bg-paper-raised">
          <span className="absolute top-[12%] left-1/2 block size-2 -translate-x-1/2 rounded-full bg-pink ring-2 ring-ink" />
        </span>
      </span>
    </span>
  );
}

function HoleButton({ hole, index, onWhack }: { hole: Hole; index: number; onWhack: (i: number) => void }) {
  const up = hole.state !== "empty";
  const what = hole.state === "empty" ? "empty" : hole.state === "bonked" ? `bonked ${hole.kind}` : hole.kind === "gold" ? "gold mole" : hole.kind;
  return (
    <button
      type="button"
      aria-label={`Hole ${HOLE_KEY[index]}: ${what}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onWhack(index);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.repeat) onWhack(index);
        }
      }}
      className="group relative block aspect-square w-full cursor-pointer touch-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {/* The critter rises out of a clipping box that ends at the hole's middle. */}
      <span className="absolute inset-x-0 -top-3 bottom-[22%] overflow-hidden">
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 block pt-[22%] transition-transform duration-100 ease-out motion-reduce:transition-none",
            up ? "translate-y-0" : "translate-y-full",
            hole.state === "bonked" && "origin-bottom scale-y-75",
          )}
        >
          <Critter kind={hole.state === "empty" ? "mole" : hole.kind} bonked={hole.state === "bonked"} />
        </span>
      </span>
      {/* The hole: a dark pit with a dirt rim in front. */}
      <span aria-hidden className="absolute inset-x-[8%] bottom-[12%] block h-[22%] rounded-[50%] border-2 border-ink bg-ink" />
      <span aria-hidden className="absolute inset-x-[4%] bottom-[4%] block h-[16%] rounded-b-[50%] border-2 border-t-0 border-ink bg-orange" />
      <span aria-hidden className="absolute top-1 left-1 font-mono text-[10px] font-bold text-ink-muted opacity-60 pointer-coarse:hidden">
        {HOLE_KEY[index]}
      </span>
    </button>
  );
}

type Popup = { id: number; hole: number; text: string; tone: string };

export function WhackLab() {
  // The game lives in a ref (the source of truth); state only re-renders it.
  const [game, setGame] = useState<WhackGame>(createGame);
  const gameRef = useRef<WhackGame>(game);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [best, saveBest] = useBestScore("whack");
  const mutedRef = useRef(false);
  const popupId = useRef(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const statusId = useId();

  const react = useCallback(
    (events: WhackEvent[], next: WhackGame) => {
      for (const e of events) {
        if (!mutedRef.current) sound(e);
        if (e.kind === "hit") {
          const id = ++popupId.current;
          const text = e.points > 0 ? `+${e.points}` : `${e.points}`;
          const tone = e.what === "bomb" ? "bg-pink" : e.what === "gold" ? "bg-orange" : "bg-lime";
          setPopups((p) => [...p, { id, hole: e.hole, text, tone }]);
          setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 650);
        }
        if (e.kind === "combo") setMessage(`Combo ×${e.mult}.`);
        if (e.kind === "over") {
          saveBest(next.score);
          setMessage(`Time's up. Score ${next.score}.`);
        }
      }
    },
    [saveBest],
  );

  // The round clock: step every animation frame while playing.
  useEffect(() => {
    if (game.status !== "playing") return;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const { game: next, events } = step(gameRef.current, dt, Math.random);
      gameRef.current = next;
      setGame(next);
      if (events.length) react(events, next);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [game.status, react]);

  const start = useCallback(() => {
    gameRef.current = createGame("playing");
    setGame(gameRef.current);
    setPopups([]);
    setMessage("Go! Whack the moles, skip the bombs.");
    boardRef.current?.querySelector("button")?.focus();
  }, []);

  const onWhack = useCallback(
    (i: number) => {
      if (gameRef.current.status !== "playing") return start();
      const { game: next, events } = whack(gameRef.current, i);
      gameRef.current = next;
      setGame(next);
      if (events.length) react(events, next);
    },
    [react, start],
  );

  function onKey(e: KeyboardEvent) {
    const i = KEY_TO_HOLE[e.key];
    if (i === undefined) return;
    e.preventDefault();
    if (!e.repeat) onWhack(i);
  }

  const time = Math.ceil(game.timeLeft);
  const timePct = (game.timeLeft / ROUND) * 100;
  const mult = multiplier(game.streak);

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <div className="flex w-full max-w-80 items-center justify-between gap-2 font-mono text-xs uppercase">
        <span>
          Score <span className="font-bold tabular-nums">{String(game.score).padStart(4, "0")}</span>
        </span>
        <span
          aria-label={`Combo ${mult}`}
          className={cn("border-2 border-ink px-1 font-bold tabular-nums", mult > 1 ? "bg-lime text-on-bright" : "text-ink-muted")}
        >
          ×{mult}
        </span>
        <span className="text-ink-muted">
          Best <span className="font-bold text-ink tabular-nums">{best}</span>
        </span>
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

      {/* Time left. */}
      <div aria-hidden className="flex w-full max-w-80 items-center gap-2">
        <div className="h-3 flex-1 border-2 border-ink bg-paper-sunken">
          <div
            className={cn("h-full", timePct > 50 ? "bg-lime" : timePct > 20 ? "bg-orange" : "bg-pink")}
            style={{ width: `${timePct}%` }}
          />
        </div>
        <span className="w-6 text-right font-mono text-xs font-bold tabular-nums">{time}s</span>
      </div>

      <div
        ref={boardRef}
        role="group"
        aria-label="Whack-a-mole field. Press a hole's button or its number key (numpad layout) to whack it."
        aria-describedby={statusId}
        onKeyDown={onKey}
        className="relative grid aspect-square w-full max-w-80 grid-cols-3 gap-2 border-2 border-ink bg-lime-soft bg-dots p-3 shadow-brutal-lg"
      >
        {game.holes.map((hole, i) => (
          <div key={i} className="relative">
            <HoleButton hole={hole} index={i} onWhack={onWhack} />
            {popups
              .filter((p) => p.hole === i)
              .map((p) => (
                <span
                  key={p.id}
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 animate-[whack-pop_650ms_ease-out_forwards] border-2 border-ink px-1.5 font-mono text-xs font-bold text-on-bright shadow-brutal-sm motion-reduce:animate-none",
                    p.tone,
                  )}
                >
                  {p.text}
                </span>
              ))}
          </div>
        ))}

        {game.status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-paper/60 p-6">
            <div className="flex w-full max-w-56 flex-col items-center gap-3 border-2 border-ink bg-paper-raised p-5 text-center shadow-brutal">
              <p className="font-display text-2xl leading-none tracking-tight">{game.status === "over" ? "Time's up" : "Whack-a-mole"}</p>
              {game.status === "ready" ? (
                <p className="text-sm text-ink-muted">{ROUND} seconds. Moles score, gold scores big, bombs cost you. Keep a streak for a combo.</p>
              ) : (
                <p className="font-mono text-xs uppercase">
                  Score <span className="font-bold">{game.score}</span> · {game.hits} hits
                </p>
              )}
              <Button size="sm" onClick={start}>
                {game.status === "over" ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                {game.status === "over" ? "Play again" : "Start"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      <style href="whack-lab" precedence="default">{`
        @keyframes whack-pop { from { opacity: 1; translate: -50% 10%; } to { opacity: 0; translate: -50% -90%; } }
      `}</style>
    </div>
  );
}
