"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bomb, Flame, Ghost, Heart, Music, RotateCcw, Rocket, Star, Zap } from "lucide-react";
import { Button, cn } from "@streamuilib/react";
import { createDeck, shuffle, type Card } from "@/lib/games/memory";

const FACES: { name: string; icon: LucideIcon; tone: string }[] = [
  { name: "rocket", icon: Rocket, tone: "bg-lime" },
  { name: "heart", icon: Heart, tone: "bg-pink" },
  { name: "star", icon: Star, tone: "bg-blue" },
  { name: "bolt", icon: Zap, tone: "bg-orange" },
  { name: "ghost", icon: Ghost, tone: "bg-violet" },
  { name: "music", icon: Music, tone: "bg-lime" },
  { name: "flame", icon: Flame, tone: "bg-pink" },
  { name: "bomb", icon: Bomb, tone: "bg-blue" },
];

export function MemoryLab({
  mismatchDelay = 800,
  shuffleDeck = shuffle,
}: {
  /** How long a wrong pair stays face up, in ms. */
  mismatchDelay?: number;
  /** Injected so tests can use a known order. */
  shuffleDeck?: (deck: Card[]) => Card[];
}) {
  // Ordered deck on first render; it's shuffled on the first flip. Every card
  // is face down until then, so the order is never visible or mismatched.
  const [deck, setDeck] = useState(() => createDeck(FACES.length));
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Find all 8 pairs.");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const locked = open.length === 2;
  const solved = matched.size === FACES.length;

  function flip(index: number) {
    if (locked || open.includes(index)) return;
    let cards = deck;
    if (!started) {
      cards = shuffleDeck(deck);
      setDeck(cards);
      setStarted(true);
    }
    if (matched.has(cards[index].pair)) return;

    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) {
      setMessage(`Flipped a ${FACES[cards[index].pair].name}.`);
      return;
    }

    setMoves((m) => m + 1);
    const [a, b] = next.map((i) => cards[i]);
    if (a.pair === b.pair) {
      const done = new Set(matched).add(a.pair);
      setMatched(done);
      setOpen([]);
      setMessage(done.size === FACES.length ? `Solved in ${moves + 1} moves!` : `Match: ${FACES[a.pair].name}s.`);
    } else {
      setMessage(`No match: ${FACES[a.pair].name} and ${FACES[b.pair].name}.`);
      timer.current = setTimeout(() => setOpen([]), mismatchDelay);
    }
  }

  function reset() {
    clearTimeout(timer.current);
    setDeck(createDeck(FACES.length));
    setStarted(false);
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
    setMessage("Find all 8 pairs.");
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <ul aria-label="Cards" className="grid grid-cols-4 gap-2">
        {deck.map((card, i) => {
          const isMatched = matched.has(card.pair);
          const faceUp = isMatched || open.includes(i);
          const face = FACES[card.pair];
          return (
            <li key={card.id} className="perspective-[500px]">
              <button
                type="button"
                onClick={() => flip(i)}
                aria-label={`Card ${i + 1}: ${faceUp ? face.name : "face down"}${isMatched ? ", matched" : ""}`}
                aria-disabled={faceUp || locked}
                className="relative block size-14 cursor-pointer transition-transform duration-300 ease-out transform-3d aria-disabled:cursor-default"
                style={{ transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* Back */}
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center border-2 border-ink bg-paper-sunken bg-dots font-mono text-sm font-bold shadow-brutal-sm backface-hidden"
                >
                  S/
                </span>
                {/* Face */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 grid place-items-center border-2 border-ink text-on-bright backface-hidden",
                    isMatched ? face.tone : "bg-paper-raised",
                  )}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <face.icon className="size-6" strokeWidth={2.25} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="min-h-6 text-center font-mono text-sm font-bold">
        {message}
      </p>

      <div className="flex w-full max-w-60 items-center justify-between gap-4">
        <p className="font-mono text-xs tabular-nums">
          <span className="text-ink-muted">Moves</span> <span className="font-bold">{moves}</span>
          <span className="mx-2 text-ink-muted">·</span>
          <span className="text-ink-muted">Pairs</span>{" "}
          <span className="font-bold">
            {matched.size}/{FACES.length}
          </span>
        </p>
        <Button size="sm" variant={solved ? "primary" : "secondary"} onClick={reset}>
          <RotateCcw aria-hidden /> New
        </Button>
      </div>
    </div>
  );
}
