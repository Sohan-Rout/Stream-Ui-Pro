import type { ComponentType } from "react";
import { ShapeRollerLab } from "@/components/demos/ShapeRollerLab";
import { MagneticLab } from "@/components/demos/MagneticLab";
import { WobbleLab } from "@/components/demos/WobbleLab";
import { DiceLab } from "@/components/demos/DiceLab";
import { TicTacToeLab } from "@/components/demos/TicTacToeLab";
import { MemoryLab } from "@/components/demos/MemoryLab";

export type LabDoc = {
  slug: string;
  name: string;
  description: string;
  file: string;
  Component: ComponentType;
  notes: string[];
};

export const labs: LabDoc[] = [
  {
    slug: "shape-roller",
    name: "Shape roller",
    description: "Randomizes shape, color, and rotation on each roll.",
    file: "src/components/demos/ShapeRollerLab.tsx",
    Component: ShapeRollerLab,
    notes: [
      "The first render is fixed and randomness only runs on click, so server and client markup match.",
      "Re-keying the shape replays its wiggle animation on every roll.",
    ],
  },
  {
    slug: "magnetic",
    name: "Magnetic button",
    description: "The button drifts toward the cursor within its area.",
    file: "src/components/demos/MagneticLab.tsx",
    Component: MagneticLab,
    notes: [
      "Only reacts to mouse pointers; touch and pen are ignored.",
      "Does nothing when the user prefers reduced motion.",
    ],
  },
  {
    slug: "wobble",
    name: "Wobble type",
    description: "Staggered CSS transitions on hover. No JavaScript.",
    file: "src/components/demos/WobbleLab.tsx",
    Component: WobbleLab,
    notes: ["Each letter gets its own transition-delay, which creates the wave.", "The word keeps a single aria-label so it reads as one word."],
  },
  {
    slug: "dice",
    name: "Dice roller",
    description: "A 3D die that tumbles and lands on a random face.",
    file: "src/components/demos/DiceLab.tsx",
    Component: DiceLab,
    notes: [
      "The die is six CSS faces in a preserve-3d cube; each roll adds two full turns on both axes, then the rotation that shows the result.",
      "Rolls come from crypto.getRandomValues, and opposite faces add up to 7 like a real die.",
      "The result is announced to screen readers when the die settles. Under reduced motion it lands instantly.",
    ],
  },
  {
    slug: "tic-tac-toe",
    name: "Cross and circle",
    description: "Tic-tac-toe against an easy or unbeatable CPU, or a friend.",
    file: "src/components/demos/TicTacToeLab.tsx",
    Component: TicTacToeLab,
    notes: [
      "Hard mode uses minimax with alpha-beta pruning, so it never loses; easy plays randomly but takes a win when it sees one.",
      "The rules live in src/lib/games/tictactoe.ts as pure functions, tested by playing every possible game against the hard CPU.",
      "Arrow keys move around the board, every cell announces its row, column, and mark, and the result is read out when the game ends.",
    ],
  },
  {
    slug: "memory",
    name: "Memory match",
    description: "Flip cards in 3D to find all eight pairs in as few moves as you can.",
    file: "src/components/demos/MemoryLab.tsx",
    Component: MemoryLab,
    notes: [
      "The deck shuffles on your first flip with an unbiased Fisher–Yates shuffle, so the server and browser render the same face-down grid.",
      "Cards flip with CSS 3D transforms and backface-visibility; under reduced motion they switch instantly.",
      "Every flip, match, and miss is announced, and each card's label says what's on it once it's face up.",
    ],
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}
