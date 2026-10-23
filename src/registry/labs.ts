export type LabDoc = {
  slug: string;
  name: string;
  description: string;
  file: string;
  notes: string[];
  /** A wide game (a landscape strip) gets more room on its own page. */
  wide?: boolean;
};

export const labs: LabDoc[] = [
  {
    slug: "shape-roller",
    name: "Shape roller",
    description: "Randomizes shape, color, and rotation on each roll.",
    file: "src/components/demos/ShapeRollerLab.tsx",
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
    notes: ["Each letter gets its own transition-delay, which creates the wave.", "The word keeps a single aria-label so it reads as one word."],
  },
  {
    slug: "dice",
    name: "Dice roller",
    description: "A 3D die that tumbles and lands on a random face.",
    file: "src/components/demos/DiceLab.tsx",
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
    notes: [
      "Arrows or A/D run, Space, Up, or W jumps (let go early for a short hop), and P pauses. On touch, hold the arrows and tap jump.",
      "Coyote time and a jump buffer make jumps forgiving: you can still jump a moment after leaving a ledge, or a moment before landing.",
      "Physics live in src/lib/games/jumper.ts in pixels and seconds. The level is built in code, and tests check every pit can be cleared.",
      "Halfway is a checkpoint, and a fresh life is briefly safe so you can't respawn into a walker.",
    ],
  },
  {
    slug: "pinball",
    name: "Pinball",
    description: "A neo-brutalist pinball table: light the S/UI lanes, knock down the drop targets, and stack up the multiplier.",
    file: "src/components/demos/PinballLab.tsx",
    notes: [
      "Hold Space (or Down) to pull the plunger and let go to launch; Z or Left and slash or Right work the flippers. On touch, hold the buttons.",
      "Flippers hand their own swing speed to the ball, so timing matters: flip as it rolls down for a strong shot up the table.",
      "Physics live in src/lib/games/pinball.ts: several substeps a frame keep a fast ball from passing through walls, and tests check a full launch reaches the table.",
      "Light all four S/UI rollover lanes, or clear the pink drop-target bank, to raise the multiplier (up to ×5). Pressing a flipper shifts the lit lanes, as on a real table.",
      "A drain in the first five seconds after launch is saved, one extra ball comes at 15,000, and a drain resets the multiplier.",
      "Score popups, banners, a ball trail, and a small shake come from events the physics step reports; the shake and trail turn off under reduced motion. Sounds are synthesized in C major, with a mute button.",
    ],
  },
  {
    slug: "tetris",
    name: "Tetris",
    description: "Neo-brutalist falling blocks: hard-edged tetrominoes, a ghost preview, and the next three pieces.",
    file: "src/components/demos/TetrisLab.tsx",
    notes: [
      "Arrows move and rotate (Z rotates back), Down drops a row, Space drops to the ghost, and P pauses. On touch, tap to rotate, swipe sideways to move, and swipe down to drop.",
      "The rules live in src/lib/games/tetris.ts as pure functions: a 7-bag randomizer, wall kicks, classic scoring, and a level every 10 lines.",
      "Each piece gets a palette color with an ink border and a pixel bevel, so even the pale ones read on the board.",
      "Your best score is remembered in this browser once you accept the cookie banner.",
    ],
  },
];

labs.push({
  slug: "runner",
  name: "Dino Runner",
  description: "A neo-brutalist endless runner: jump the pink cacti, duck the flyers, and outrun a world that keeps speeding up.",
  file: "src/components/demos/RunnerLab.tsx",
  wide: true,
  notes: [
    "Click the strip (or tap it) to start, then Space or Up to jump and Down to duck. A tap is a short hop and a held jump goes higher; Down in the air drops you faster.",
    "Past 300, flyers come at three heights: jump the low ones, duck the middle ones, and run under the high ones.",
    "The rules live in src/lib/games/runner.ts as pure functions with tests, including that every gap leaves room to land and jump again, even at top speed.",
    "The scene is drawn in layers that scroll at different speeds, and the canvas renders at its on-screen size so it stays crisp. It's the same game as the site's 404 page, where it listens to the whole window instead of the focused strip.",
  ],
});

labs.push({
  slug: "whack-a-mole",
  name: "Whack-a-Mole",
  description: "A neo-brutalist whack-a-mole: 30 seconds, moles that get quicker, gold ones worth more, and bombs to leave alone.",
  file: "src/components/demos/WhackLab.tsx",
  notes: [
    "Click or tap a hole, or press its number key in numpad layout (7 8 9 along the top). Each hole is a real button, so Tab and Enter work too.",
    "Moles score 10 and gold ones 50; bombs cost 30. Five hits in a row raise the combo multiplier, up to ×4, and a miss, a bomb, or a mole that gets away resets it.",
    "The rules live in src/lib/games/whack.ts as pure functions with tests: pops speed up and stay up for less time as the clock runs down, and more can be up at once.",
    "Score popups and the pop-up motion turn off under reduced motion. Your best score is remembered in this browser once you accept the cookie banner.",
  ],
});

labs.push({
  slug: "hammer",
  name: "Hammer",
  description: "Your cursor becomes a neo-brutalist mallet: click to swing it from the handle and drive five nails into a plank.",
  file: "src/components/demos/HammerLab.tsx",
  notes: [
    "Inside the board the mouse cursor is a mallet. A click swings it from the end of its handle, lands the head on the spot, and pops a burst and a BONK!.",
    "Each nail takes three hits to go flush; all five in and you can pull them back out. On touch the mallet jumps to your tap, and with a keyboard each nail is a button.",
    "The swing is one CSS keyframe around the handle's pivot, restarted per hit. Reduced motion skips the swing and the popups; the hit still lands.",
    "Mallet is exported on its own (a plain SVG that takes the theme colors), so you can drop it into a whack-a-mole or a 404 page.",
  ],
});

labs.push({
  slug: "bear",
  name: "Bonk the bear",
  description: "A cartoon bear sits on his rug; your cursor is the Hammer mallet. Bonk his head for X-eyes, dizzy stars, and a growing bump.",
  file: "src/components/demos/BearLab.tsx",
  notes: [
    "Inside the board the cursor is the Hammer lab's mallet. A swing anywhere is a whiff; on his head it's a bonk: he squashes, his eyes go X, stars circle, and a BONK! pops.",
    "The bump on his crown grows a size per bonk (up to three) and goes down a size after each quiet spell, so let him rest.",
    "His head is a real button: Enter or Space bonks from the keyboard, and the count is announced. On touch the mallet jumps to your tap.",
    "Reduced motion skips the swing, squash, orbit, and popups; the bonk still counts and the X-eyes and bump still show.",
  ],
});

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}
