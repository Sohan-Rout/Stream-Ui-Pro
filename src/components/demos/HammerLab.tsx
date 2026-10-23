"use client";

import { useCallback, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button, cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";
import { Mallet } from "@/lib/games/mallet";

export { Mallet };

const NAILS = 5;
/** Hits to drive a nail flush. */
const HITS = 3;

/** Swing geometry, in the mallet's 200×200 drawing: it pivots on the end of its handle. */
const PIVOT = { x: 100, y: 190 };
const ARM = 130; // pivot to the middle of the head
const REST = -20; // degrees: raised
const STRIKE = -55; // degrees: head down on the target
const SIZE = 0.62; // drawn at 62%


/** Where the mallet's box goes so its head lands on (x, y) at the strike angle. */
function placeFor(x: number, y: number) {
  const r = (STRIKE * Math.PI) / 180;
  const pivotX = x - ARM * SIZE * Math.sin(r);
  const pivotY = y + ARM * SIZE * Math.cos(r) - 14; // the head's face, not its middle, meets the target
  return { left: pivotX - PIVOT.x * SIZE, top: pivotY - PIVOT.y * SIZE };
}

const WORDS = ["BONK!", "WHAM!", "THUNK!", "POW!"];

type Hit = { id: number; x: number; y: number; word: string; tilt: number };

/**
 * Hammer: inside the board your cursor is a mallet. Click to swing it from
 * the handle; drive the five nails flush (three hits each). On touch the
 * mallet jumps to your tap; with a keyboard, each nail is a button. Motion
 * holds still for reduced motion: the hit still lands, without the swing.
 */
export function HammerLab() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const [swing, setSwing] = useState(0);
  const [depth, setDepth] = useState<number[]>(() => Array(NAILS).fill(0));
  const [hits, setHits] = useState<Hit[]>([]);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const hitId = useRef(0);
  const statusId = useId();

  const done = depth.filter((d) => d >= HITS).length;
  const allIn = done === NAILS;

  /** Swing at a point in board coordinates; `onNail` makes the thunk land harder. */
  const bonk = useCallback((x: number, y: number, onNail: boolean) => {
    setAim({ x, y });
    setSwing((n) => n + 1);
    const id = ++hitId.current;
    setHits((h) => [...h.slice(-4), { id, x, y, word: WORDS[id % WORDS.length], tilt: (id % 3) * 7 - 7 }]);
    setTimeout(() => setHits((h) => h.filter((x) => x.id !== id)), 600);
    if (!mutedRef.current) {
      blip([{ f: onNail ? 220 : 170, to: 70, dur: 0.18, type: "triangle", gain: onNail ? 0.2 : 0.12 }, { f: 1400, to: 2000, at: 0.03, dur: 0.07, gain: onNail ? 0.025 : 0.012 }]);
    }
  }, []);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = boardRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    const p = local(e);
    // Nails handle their own hit (so keyboard presses work too); this swings at the board.
    if (!(e.target as HTMLElement).closest("[data-nail]")) bonk(p.x, p.y, false);
  }

  function hitNail(i: number, from?: { x: number; y: number }) {
    if (depth[i] >= HITS) return;
    const head = boardRef.current?.querySelector<HTMLElement>(`[data-nail="${i}"] [data-head]`);
    const r = boardRef.current!.getBoundingClientRect();
    const h = head?.getBoundingClientRect();
    const at = from ?? (h ? { x: h.left + h.width / 2 - r.left, y: h.top - r.top } : { x: 0, y: 0 });
    bonk(at.x, at.y, true);
    setDepth((d) => d.map((v, j) => (j === i ? v + 1 : v)));
  }

  const place = aim ? placeFor(aim.x, aim.y) : null;

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <style href="hammer-lab" precedence="default">{`
        @keyframes hammer-lab-swing {
          0% { transform: rotate(${REST}deg); }
          18% { transform: rotate(${STRIKE}deg); }
          36% { transform: rotate(${STRIKE}deg); }
          100% { transform: rotate(${REST}deg); }
        }
        @keyframes hammer-lab-word {
          from { opacity: 1; transform: translate(-50%, -10%) scale(0.6) rotate(var(--tilt)); }
          30% { opacity: 1; transform: translate(-50%, -60%) scale(1.1) rotate(var(--tilt)); }
          to { opacity: 0; transform: translate(-50%, -110%) scale(1) rotate(var(--tilt)); }
        }
        @keyframes hammer-lab-burst { from { opacity: 1; transform: translate(-50%, -50%) scale(0.6); } to { opacity: 0; transform: translate(-50%, -50%) scale(1.25); } }
        .hammer-lab-swing { animation: hammer-lab-swing 420ms cubic-bezier(0.3, 0, 0.3, 1) both; }
        .hammer-lab-word { animation: hammer-lab-word 600ms ease-out forwards; }
        .hammer-lab-burst { animation: hammer-lab-burst 260ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .hammer-lab-swing { animation: none; transform: rotate(${STRIKE}deg); }
          .hammer-lab-word, .hammer-lab-burst { animation: none; opacity: 0; }
        }
      `}</style>

      <div className="flex w-full max-w-sm items-center justify-between font-mono text-xs uppercase">
        <span>
          Nails in <span className="font-bold tabular-nums">{done}</span>/{NAILS}
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

      <div
        ref={boardRef}
        role="group"
        aria-label="Hammer board. Click to swing the mallet; each nail is a button that takes three hits."
        aria-describedby={statusId}
        onPointerMove={(e) => e.pointerType === "mouse" && setAim(local(e))}
        onPointerLeave={(e) => e.pointerType === "mouse" && setAim(null)}
        onPointerDown={onPointerDown}
        className="relative h-64 w-full max-w-sm touch-none overflow-visible border-2 border-ink bg-violet-soft bg-dots shadow-brutal-lg select-none pointer-fine:cursor-none"
      >
        {/* The plank, with nails sticking up out of it. */}
        <div className="absolute inset-x-5 bottom-8 h-16 border-2 border-ink bg-orange shadow-brutal">
          <span aria-hidden className="absolute inset-x-3 top-4 h-0.5 bg-ink/25" />
          <span aria-hidden className="absolute inset-x-8 top-9 h-0.5 bg-ink/20" />
          <div className="absolute inset-x-4 -top-px flex -translate-y-full items-end justify-between">
            {depth.map((d, i) => {
              const inFully = d >= HITS;
              return (
                <button
                  key={i}
                  type="button"
                  data-nail={i}
                  aria-label={inFully ? `Nail ${i + 1}, all the way in` : `Nail ${i + 1}, ${HITS - d} ${HITS - d === 1 ? "hit" : "hits"} left`}
                  aria-disabled={inFully}
                  onClick={(e) => (e.detail === 0 ? hitNail(i) : hitNail(i, local(e)))}
                  className="group relative flex h-16 w-10 flex-col items-center justify-end focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink pointer-fine:cursor-none"
                >
                  <span data-head className={cn("block h-2.5 w-7 border-2 border-ink", inFully ? "bg-lime" : "bg-paper-raised")} />
                  {/* The shaft gets shorter with every hit. */}
                  <span
                    className="block w-2 border-x-2 border-ink bg-paper-sunken transition-[height] duration-100 ease-out motion-reduce:transition-none"
                    style={{ height: `${(HITS - d) * 12}px` }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Impact: burst lines and a comic word. */}
        {hits.map((h) => (
          <span key={h.id} aria-hidden className="pointer-events-none absolute z-20" style={{ left: h.x, top: h.y }}>
            <svg viewBox="-60 -60 120 120" className="hammer-lab-burst absolute top-0 left-0 size-20">
              <g stroke="var(--ink)" strokeWidth="7" strokeLinecap="round">
                <line x1="0" y1="-26" x2="0" y2="-50" /><line x1="22" y1="-16" x2="40" y2="-32" /><line x1="-22" y1="-16" x2="-40" y2="-32" />
                <line x1="28" y1="6" x2="50" y2="8" /><line x1="-28" y1="6" x2="-50" y2="8" />
              </g>
            </svg>
            <span
              className="hammer-lab-word absolute top-0 left-0 border-2 border-ink bg-lime px-1.5 font-display text-sm whitespace-nowrap text-on-bright shadow-brutal-sm"
              style={{ "--tilt": `${h.tilt}deg` } as CSSProperties}
            >
              {h.word}
            </span>
          </span>
        ))}

        {/* With the cursor hidden, a small ring shows exactly where the head will land. */}
        {aim && (
          <span
            aria-hidden
            className="pointer-events-none absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper-raised"
            style={{ left: aim.x, top: aim.y }}
          />
        )}

        {/* The mallet, following the pointer (mouse), or jumping to the last hit (touch, keyboard). */}
        {place && (
          <div className="pointer-events-none absolute z-10" style={{ left: place.left, top: place.top, width: 200 * SIZE, height: 200 * SIZE }}>
            <div key={swing} className={cn("size-full", swing > 0 && "hammer-lab-swing")} style={{ transformOrigin: `${PIVOT.x * SIZE}px ${PIVOT.y * SIZE}px`, transform: `rotate(${REST}deg)` }}>
              <Mallet className="size-full" />
            </div>
          </div>
        )}

        {allIn && (
          <div className="absolute inset-x-0 top-6 z-30 flex justify-center">
            <div className="flex items-center gap-3 border-2 border-ink bg-paper-raised px-3 py-2 shadow-brutal">
              <span className="font-display">All in!</span>
              <Button size="sm" variant="secondary" onPointerDown={(e) => e.stopPropagation()} onClick={() => setDepth(Array(NAILS).fill(0))}>
                <RotateCcw aria-hidden /> Pull them out
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {allIn ? "All five nails are in." : `${done} of ${NAILS} nails in.`}
      </p>
    </div>
  );
}
