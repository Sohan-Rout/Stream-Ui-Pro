import type { ComponentType } from "react";
import { ShapeRollerLab } from "@/components/demos/ShapeRollerLab";
import { MagneticLab } from "@/components/demos/MagneticLab";
import { WobbleLab } from "@/components/demos/WobbleLab";
import { DiceLab } from "@/components/demos/DiceLab";
import { TicTacToeLab } from "@/components/demos/TicTacToeLab";
import { MemoryLab } from "@/components/demos/MemoryLab";
import { SnakeLab } from "@/components/demos/SnakeLab";
import { FlappyLab } from "@/components/demos/FlappyLab";
import { TetrisLab } from "@/components/demos/TetrisLab";
import { MazeLab } from "@/components/demos/MazeLab";
import { JumperLab } from "@/components/demos/JumperLab";

export type LabDoc = {
  slug: string;
  name: string;
  description: string;
  file: string;
  Component: ComponentType;
  notes: string[];
  /** Spans both columns on the Labs page, for experiments that need the room. */
  wide?: boolean;
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
  {
    slug: "snake",
    name: "Snake",
    description: "The classic snake game in three looks: classic, funky, and pixelated.",
    file: "src/components/demos/SnakeLab.tsx",
    Component: SnakeLab,
    notes: [
      "Steer with the arrow keys or WASD on the focused board, swipe on touch screens, or use the on-screen pad. Space pauses.",
      "The rules live in src/lib/games/snake.ts as pure functions: walls and your own body end the game, and up to two turns are buffered between ticks.",
      "Classic, Funky, and Pixelated are only skins over the same game state, so you can switch looks mid-game.",
      "It speeds up a little with every food, and your best score is remembered in this browser.",
    ],
  },
  {
    slug: "flappy",
    name: "Flappy",
    description: "A neo-brutalist flappy bird: flap through the gaps between hard-shadowed pipes.",
    file: "src/components/demos/FlappyLab.tsx",
    Component: FlappyLab,
    notes: [
      "The world draws on a <canvas> at 60fps outside React; React state only changes when the score or status does.",
      "Physics live in src/lib/games/flappy.ts as pure functions in world units and seconds, so they're tested without a browser.",
      "Long frames are capped, so switching tabs mid-flight can't teleport the bird through a pipe.",
      "Space, Up, W, or a tap flaps; P pauses. A short grace period after a crash stops a mashed key from restarting instantly.",
    ],
  },
  {
    slug: "maze",
    name: "Muncher",
    description: "A maze chase: eat every dot, dodge three bots, and grab a power pellet to turn the tables.",
    file: "src/components/demos/MazeLab.tsx",
    Component: MazeLab,
    notes: [
      "Arrows or WASD steer on the focused board (a turn pressed early waits for the opening), swipe on touch screens, or use the pad. Space pauses.",
      "Each bot hunts differently: one chases you, one cuts you off ahead, and a shy one backs off up close. Power pellets scare them for a while; eat them for 200, 400, then 800.",
      "The rules live in src/lib/games/maze.ts as pure functions, one cell per tick, with a side tunnel that wraps around.",
      "Clear the board and the next level starts faster. Three lives; your best score is remembered once you accept the cookie banner.",
    ],
  },
  {
    slug: "jumper",
    name: "Jumper",
    description: "A side-scrolling platformer: run, jump, bump blocks for coins, stomp walkers, and reach the flag.",
    file: "src/components/demos/JumperLab.tsx",
    Component: JumperLab,
    notes: [
      "Arrows or A/D run, Space, Up, or W jumps (let go early for a short hop), and P pauses. On touch, hold the arrows and tap jump.",
      "Coyote time and a jump buffer make jumps forgiving: you can still jump a moment after leaving a ledge, or a moment before landing.",
      "Physics live in src/lib/games/jumper.ts in pixels and seconds. The level is built in code, and tests check every pit can be cleared.",
      "Halfway is a checkpoint, and a fresh life is briefly safe so you can't respawn into a walker.",
    ],
  },
  {
    slug: "tetris",
    name: "Tetris",
    description: "Neo-brutalist falling blocks: hard-edged tetrominoes, a ghost preview, and the next three pieces.",
    file: "src/components/demos/TetrisLab.tsx",
    Component: TetrisLab,
    wide: true,
    notes: [
      "Arrows move and rotate (Z rotates back), Down drops a row, Space drops to the ghost, and P pauses. On touch, tap to rotate, swipe sideways to move, and swipe down to drop.",
      "The rules live in src/lib/games/tetris.ts as pure functions: a 7-bag randomizer, wall kicks, classic scoring, and a level every 10 lines.",
      "Each piece gets a palette color with an ink border and a pixel bevel, so even the pale ones read on the board.",
      "Your best score is remembered in this browser once you accept the cookie banner.",
    ],
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}
