"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@streamuilib/react";
import { blip } from "@/lib/games/arcade-sound";
import { Mallet } from "./HammerLab";

/** Swing geometry, matching the Hammer lab's mallet: it pivots on the end of its handle. */
const PIVOT = { x: 100, y: 190 };
const ARM = 130;
const REST = -20;
const STRIKE = -55;
const SIZE = 0.62;

/** The bear's honey palette, set on the board. */
const PALETTE = {
  "--bear-fur": "oklch(0.64 0.09 62)",
  "--bear-dark": "oklch(0.5 0.08 55)",
  "--bear-light": "oklch(0.87 0.05 78)",
} as CSSProperties;

/** The bump grows a size per bonk, up to this, and shrinks back after a quiet spell. */
const MAX_BUMP = 3;
const COOL_DOWN = 2200; // ms without a bonk before the bump goes down a size

const WORDS = ["BONK!", "THUNK!", "BOP!", "DOINK!"];

type Hit = { id: number; x: number; y: number; word: string; tilt: number };

/** Where the mallet's box goes so its head lands on (x, y) at the strike angle. */
function placeFor(x: number, y: number) {
  const r = (STRIKE * Math.PI) / 180;
  const pivotX = x - ARM * SIZE * Math.sin(r);
  const pivotY = y + ARM * SIZE * Math.cos(r) - 14;
  return { left: pivotX - PIVOT.x * SIZE, top: pivotY - PIVOT.y * SIZE };
}

/**
 * The bear, sitting, front on: round ears, a light muzzle, paws on his
 * knees, and feet out front with pads. `dazed` swaps his eyes for X's;
 * `bump` (0 to 3) grows a lump on his head; each new `bonks` count re-keys
 * the head so its squash plays again.
 */
function Bear({ dazed, bump, bonks }: { dazed: boolean; bump: number; bonks: number }) {
  const fur = "var(--bear-fur)";
  const dark = "var(--bear-dark)";
  const light = "var(--bear-light)";
  return (
    <svg viewBox="0 0 200 210" overflow="visible" className="size-full" aria-hidden>
      <g stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        {/* Body and belly. */}
        <ellipse cx="100" cy="150" rx="58" ry="50" fill={fur} />
        <ellipse cx="100" cy="158" rx="34" ry="32" fill={light} strokeWidth="4" />
        {/* Feet out front, with pads. */}
        {[62, 138].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="194" rx="22" ry="15" fill={fur} />
            <ellipse cx={x} cy="196" rx="11" ry="8" fill={light} strokeWidth="3.5" />
          </g>
        ))}
        {/* Arms resting on the knees. */}
        <path d="M52 124 C 36 140, 40 168, 58 172 C 70 168, 66 146, 70 132 Z" fill={fur} />
        <path d="M148 124 C 164 140, 160 168, 142 172 C 130 168, 134 146, 130 132 Z" fill={fur} />

        {/* The head squashes from its chin when bonked. */}
        <g key={bonks} className={bonks > 0 ? "bear-lab-squash" : undefined} style={{ transformOrigin: "100px 112px" }}>
          {/* Ears. */}
          {[54, 146].map((x) => (
            <g key={x}>
              <circle cx={x} cy="34" r="20" fill={fur} />
              <circle cx={x} cy="34" r="10" fill={dark} strokeWidth="3.5" />
            </g>
          ))}
          <circle cx="100" cy="70" r="50" fill={fur} />
          {/* The bump: a lump on the crown that grows a size per bonk. */}
          {bump > 0 && (
            <ellipse
              className="bear-lab-bump"
              cx="100"
              cy={26 - bump * 3}
              rx={8 + bump * 4}
              ry={6 + bump * 4}
              fill="oklch(0.78 0.12 25)"
            />
          )}
          {/* Muzzle, nose, mouth. */}
          <ellipse cx="100" cy="86" rx="24" ry="18" fill={light} strokeWidth="4" />
          <ellipse cx="100" cy="78" rx="9" ry="6" fill="var(--ink)" />
          <path d={dazed ? "M90 96 Q 95 92, 100 96 Q 105 100, 110 96" : "M92 92 Q 100 99, 108 92"} fill="none" strokeWidth="3.5" />
          {/* Eyes: dots, or X's while dazed. */}
          {dazed ? (
            <g strokeWidth="4">
              <path d="M74 58 L84 68 M84 58 L74 68" />
              <path d="M116 58 L126 68 M126 58 L116 68" />
            </g>
          ) : (
            <g stroke="none" fill="var(--ink)">
              <circle cx="79" cy="62" r="5.5" />
              <circle cx="121" cy="62" r="5.5" />
              <circle cx="81" cy="60" r="1.8" fill="var(--paper-raised)" />
              <circle cx="123" cy="60" r="1.8" fill="var(--paper-raised)" />
            </g>
          )}
          {/* Blush. */}
          <ellipse cx="66" cy="80" rx="7" ry="4" fill="var(--pink)" stroke="none" opacity="0.55" />
          <ellipse cx="134" cy="80" rx="7" ry="4" fill="var(--pink)" stroke="none" opacity="0.55" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Three little stars circling above the bear's head in a flat ring. Each
 * star swings side to side and bobs up and down a quarter-beat apart, which
 * traces an ellipse; the stars sit a third of the way round from each other.
 */
function DizzyStars() {
  return (
    <span aria-hidden className="pointer-events-none absolute top-[4%] left-1/2 block">
      {[0, 1, 2].map((i) => (
        <span key={i} className="bear-lab-star-x absolute block" style={{ "--i": i } as CSSProperties}>
          <svg viewBox="-10 -10 20 20" className="bear-lab-star-y block size-6 -translate-1/2" style={{ "--i": i } as CSSProperties}>
            <path d="M0 -9 L2.6 -2.8 L9 -2.8 L3.8 1.2 L5.6 8 L0 4 L-5.6 8 L-3.8 1.2 L-9 -2.8 L-2.6 -2.8 Z" fill="var(--orange)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </span>
  );
}

/**
 * Bonk the bear: a cartoon bear sits on a rug, and inside the board your
 * cursor is the Hammer lab's mallet. Bonk his head and he squashes, his eyes
 * go X, stars circle his head, a BONK! pops, and a bump grows (it shrinks
 * back when you let him be). His head is a button, so Enter or Space swings
 * from the keyboard; on touch the mallet jumps to your tap. Motion holds
 * still for reduced motion, and the bonk still counts.
 */
export function BearLab() {
  const boardRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLButtonElement>(null);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const [swing, setSwing] = useState(0);
  const [hits, setHits] = useState<Hit[]>([]);
  const [bonks, setBonks] = useState(0);
  const [bump, setBump] = useState(0);
  const [dazedUntil, setDazedUntil] = useState(0);
  const [now, setNow] = useState(0);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const hitId = useRef(0);
  const statusId = useId();

  // The bump goes down a size after each quiet spell.
  useEffect(() => {
    if (bump === 0) return;
    const t = setTimeout(() => setBump((b) => Math.max(0, b - 1)), COOL_DOWN);
    return () => clearTimeout(t);
  }, [bump, bonks]);

  // Wake from the daze on time (one timer per bonk).
  useEffect(() => {
    if (!dazedUntil) return;
    const t = setTimeout(() => setNow(Date.now()), Math.max(0, dazedUntil - Date.now()) + 10);
    return () => clearTimeout(t);
  }, [dazedUntil]);
  const dazed = dazedUntil > now;

  /** Swing at a point in board coordinates; `onBear` makes it count. */
  const swingAt = useCallback((x: number, y: number, onBear: boolean) => {
    setAim({ x, y });
    setSwing((n) => n + 1);
    if (!onBear) {
      if (!mutedRef.current) blip([{ f: 300, to: 180, dur: 0.12, type: "triangle", gain: 0.06 }]);
      return;
    }
    const id = ++hitId.current;
    setHits((h) => [...h.slice(-4), { id, x, y, word: WORDS[id % WORDS.length], tilt: (id % 3) * 8 - 8 }]);
    setTimeout(() => setHits((h) => h.filter((x) => x.id !== id)), 650);
    setBonks((n) => n + 1);
    setBump((b) => Math.min(MAX_BUMP, b + 1));
    const until = Date.now() + 900;
    setDazedUntil(until);
    setNow(Date.now());
    if (!mutedRef.current) {
      // A hollow bonk, then a little spring for the bump.
      blip([
        { f: 240, to: 90, dur: 0.16, type: "triangle", gain: 0.2 },
        { f: 520, to: 1300, at: 0.08, dur: 0.18, type: "sine", gain: 0.05 },
      ]);
    }
  }, []);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = boardRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /** The top of the bear's head, in board coordinates: where a keyboard bonk lands. */
  const crown = () => {
    const r = boardRef.current!.getBoundingClientRect();
    const h = headRef.current!.getBoundingClientRect();
    return { x: h.left + h.width / 2 - r.left, y: h.top + h.height * 0.15 - r.top };
  };

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    // The head button handles its own bonk (so keyboard presses work too); this is a miss.
    if (!(e.target as HTMLElement).closest("[data-head]")) {
      const p = local(e);
      swingAt(p.x, p.y, false);
    }
  }

  const place = aim ? placeFor(aim.x, aim.y) : null;
  const mood = bonks === 0 ? "Minding his own business." : bump >= MAX_BUMP ? "Seeing stars." : dazed ? "Ow." : "Grumbling.";

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <style href="bear-lab" precedence="default">{`
        @keyframes bear-lab-swing {
          0% { transform: rotate(${REST}deg); }
          18% { transform: rotate(${STRIKE}deg); }
          36% { transform: rotate(${STRIKE}deg); }
          100% { transform: rotate(${REST}deg); }
        }
        @keyframes bear-lab-squash {
          0% { transform: scale(1, 1); }
          20% { transform: scale(1.12, 0.8); }
          45% { transform: scale(0.95, 1.06); }
          70% { transform: scale(1.02, 0.98); }
          100% { transform: scale(1, 1); }
        }
        @keyframes bear-lab-bump { from { transform: scale(0.4); } 60% { transform: scale(1.2); } to { transform: scale(1); } }
        @keyframes bear-lab-orbit-x { from { translate: -56px 0; } to { translate: 56px 0; } }
        @keyframes bear-lab-orbit-y { from { translate: 0 -9px; } to { translate: 0 9px; } }
        @keyframes bear-lab-breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.015); } }
        @keyframes bear-lab-word {
          from { opacity: 1; transform: translate(-50%, -10%) scale(0.6) rotate(var(--tilt)); }
          30% { opacity: 1; transform: translate(-50%, -70%) scale(1.15) rotate(var(--tilt)); }
          to { opacity: 0; transform: translate(-50%, -120%) scale(1) rotate(var(--tilt)); }
        }
        @keyframes bear-lab-burst { from { opacity: 1; transform: translate(-50%, -50%) scale(0.6); } to { opacity: 0; transform: translate(-50%, -50%) scale(1.25); } }
        .bear-lab-swing { animation: bear-lab-swing 420ms cubic-bezier(0.3, 0, 0.3, 1) both; }
        .bear-lab-squash { animation: bear-lab-squash 480ms cubic-bezier(0.3, 0.9, 0.4, 1) 70ms both; }
        .bear-lab-bump { transform-box: fill-box; transform-origin: center bottom; animation: bear-lab-bump 300ms cubic-bezier(0.3, 1.4, 0.5, 1) both; }
        .bear-lab-star-x { animation: bear-lab-orbit-x 450ms ease-in-out calc(var(--i) * -300ms) infinite alternate; }
        .bear-lab-star-y { animation: bear-lab-orbit-y 450ms ease-in-out calc(var(--i) * -300ms - 225ms) infinite alternate; }
        .bear-lab-body { transform-origin: 50% 100%; animation: bear-lab-breathe 3.2s ease-in-out infinite; }
        .bear-lab-word { animation: bear-lab-word 650ms ease-out forwards; }
        .bear-lab-burst { animation: bear-lab-burst 260ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .bear-lab-swing { animation: none; transform: rotate(${STRIKE}deg); }
          .bear-lab-squash, .bear-lab-bump, .bear-lab-body { animation: none; }
          .bear-lab-star-x, .bear-lab-star-y { animation: none; }
          .bear-lab-star-x { translate: calc((var(--i) - 1) * 48px) 0; }
          .bear-lab-word, .bear-lab-burst { animation: none; opacity: 0; }
        }
      `}</style>

      <div className="flex w-full max-w-sm items-center justify-between font-mono text-xs uppercase">
        <span>
          Bonks <span className="font-bold tabular-nums">{bonks}</span>
          <span className="ml-2 text-ink-muted normal-case">· {mood}</span>
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
        aria-label="Bear board. Click anywhere to swing the mallet; the bear's head is a button to bonk."
        aria-describedby={statusId}
        onPointerMove={(e) => e.pointerType === "mouse" && setAim(local(e))}
        onPointerLeave={(e) => e.pointerType === "mouse" && setAim(null)}
        onPointerDown={onPointerDown}
        className="relative h-80 w-full max-w-sm touch-none overflow-visible border-2 border-ink bg-blue-soft bg-dots shadow-brutal-lg select-none pointer-fine:cursor-none"
        style={PALETTE}
      >
        {/* The rug he sits on. */}
        <span aria-hidden className="absolute bottom-5 left-1/2 block h-10 w-64 -translate-x-1/2 rounded-[50%] border-2 border-ink bg-pink shadow-brutal-sm" />
        <span aria-hidden className="absolute bottom-7 left-1/2 block h-6 w-52 -translate-x-1/2 rounded-[50%] border-2 border-dashed border-ink/40" />

        {/* The bear. */}
        <div className="absolute bottom-7 left-1/2 h-60 w-56 -translate-x-1/2">
          <div className="bear-lab-body size-full">
            <Bear dazed={dazed} bump={bump} bonks={bonks} />
          </div>
          {/* His head, as a button over the drawing: the only thing that counts as a bonk. */}
          <button
            ref={headRef}
            type="button"
            data-head
            aria-label={`Bonk the bear. ${bonks} ${bonks === 1 ? "bonk" : "bonks"} so far.`}
            onClick={(e) => {
              const at = e.detail === 0 ? crown() : local(e);
              swingAt(at.x, at.y, true);
            }}
            className="absolute top-[4%] left-1/2 h-[50%] w-[62%] -translate-x-1/2 rounded-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink pointer-fine:cursor-none"
          />
          {dazed && <DizzyStars />}
        </div>

        {/* Impact: burst lines and a comic word. */}
        {hits.map((h) => (
          <span key={h.id} aria-hidden className="pointer-events-none absolute z-20" style={{ left: h.x, top: h.y }}>
            <svg viewBox="-60 -60 120 120" className="bear-lab-burst absolute top-0 left-0 size-20">
              <g stroke="var(--ink)" strokeWidth="7" strokeLinecap="round">
                <line x1="0" y1="-26" x2="0" y2="-50" /><line x1="22" y1="-16" x2="40" y2="-32" /><line x1="-22" y1="-16" x2="-40" y2="-32" />
                <line x1="28" y1="6" x2="50" y2="8" /><line x1="-28" y1="6" x2="-50" y2="8" />
              </g>
            </svg>
            <span
              className="bear-lab-word absolute top-0 left-0 border-2 border-ink bg-lime px-1.5 font-display text-sm whitespace-nowrap text-on-bright shadow-brutal-sm"
              style={{ "--tilt": `${h.tilt}deg` } as CSSProperties}
            >
              {h.word}
            </span>
          </span>
        ))}

        {/* With the cursor hidden, a small ring shows where the head will land. */}
        {aim && (
          <span
            aria-hidden
            className="pointer-events-none absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper-raised"
            style={{ left: aim.x, top: aim.y }}
          />
        )}

        {/* The mallet, following the pointer (mouse), or jumping to the last swing (touch, keyboard). */}
        {place && (
          <div className="pointer-events-none absolute z-10" style={{ left: place.left, top: place.top, width: 200 * SIZE, height: 200 * SIZE }}>
            <div key={swing} className={cn("size-full", swing > 0 && "bear-lab-swing")} style={{ transformOrigin: `${PIVOT.x * SIZE}px ${PIVOT.y * SIZE}px`, transform: `rotate(${REST}deg)` }}>
              <Mallet className="size-full" />
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {bonks === 0 ? "The bear is sitting on his rug." : `Bonk! ${bonks} ${bonks === 1 ? "bonk" : "bonks"}. ${mood}`}
      </p>
    </div>
  );
}
