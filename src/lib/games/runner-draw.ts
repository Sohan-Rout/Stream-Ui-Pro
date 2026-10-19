/**
 * Drawing for the runner (the 404 game, the Dino Runner lab, and the Dino
 * hero): one canvas frame of the scene from a game state. The rules live in
 * runner.ts; this file only paints.
 */
import { brand } from "@/lib/brand";
import { DINO, WORLD, GROUND, dinoBox, type Obstacle, type RunnerGame as Game } from "@/lib/games/runner";

export type Fonts = { display: string; mono: string };
type Pt = readonly [number, number];

const OUTLINE = 2.5;

/** Fill and outline a closed polygon, with a hard ink shadow behind it. */
function shape(ctx: CanvasRenderingContext2D, pts: readonly Pt[], fill: string, shadow = 3) {
  const path = () => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  };
  ctx.lineJoin = "round";
  if (shadow) {
    ctx.save();
    ctx.translate(shadow, shadow);
    path();
    ctx.fillStyle = brand.ink;
    ctx.fill();
    ctx.restore();
  }
  path();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
}

/** Repeat a layer across the strip, scrolled by `offset`. */
function tiled(offset: number, span: number, width: number, drawAt: (x: number) => void) {
  const start = -(((offset % span) + span) % span);
  for (let x = start; x < width + span; x += span) drawAt(x);
}

/**
 * A puffy cloud: three bumps on a flat base, with a hard shadow. Every part is
 * stroked thick, then filled on top, so only the outer edge keeps an outline.
 */
function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const parts = (dx: number, dy: number) => {
    ctx.beginPath();
    ctx.arc(x + dx + 14 * s, y + dy + 13 * s, 10 * s, 0, Math.PI * 2);
    ctx.moveTo(x + dx + 44 * s, y + dy + 8 * s);
    ctx.arc(x + dx + 30 * s, y + dy + 8 * s, 14 * s, 0, Math.PI * 2);
    ctx.moveTo(x + dx + 57 * s, y + dy + 13 * s);
    ctx.arc(x + dx + 48 * s, y + dy + 13 * s, 9 * s, 0, Math.PI * 2);
    ctx.rect(x + dx + 5 * s, y + dy + 12 * s, 52 * s, 10 * s);
  };
  parts(3, 3);
  ctx.fillStyle = brand.ink;
  ctx.fill();
  ctx.lineWidth = OUTLINE * 2;
  ctx.strokeStyle = brand.ink;
  ctx.lineJoin = "round";
  ctx.stroke();
  parts(0, 0);
  ctx.stroke();
  ctx.fillStyle = brand.raised;
  ctx.fill();
}

/*
 * The dino, standing, in a 60×56 box: big head and snout, tiny arm, two
 * legs, and a long tail. `a` and `b` lift the front and back foot for the
 * run cycle. Ducking squashes the same outline into the duck box.
 */
function dinoOutline(a: number, b: number): Pt[] {
  return [
    [28, 0], [55, 0], [60, 5], [60, 18], [48, 18], [48, 22], [56, 22], [56, 27], [42, 27], // head and jaw
    [42, 31], [50, 31], [50, 35], [42, 35], // arm
    [42, 47], [42, 56 - a], [34, 56 - a], [34, 49], // front leg
    [26, 49], [26, 56 - b], [18, 56 - b], [18, 47], // back leg
    [9, 41], [0, 26], [4, 25], [14, 32], // tail
    [20, 27], [28, 19], // back up to the neck
  ];
}
const SPIKES: Pt[][] = [
  [[6, 27], [8, 20], [12, 29]],
  [[13, 30], [15, 22], [19, 27]],
  [[20, 26], [22, 17], [26, 21]],
];

function dino(ctx: CanvasRenderingContext2D, game: Game, time: number) {
  const box = dinoBox(game);
  const dead = game.status === "over";
  const duck = box.h < DINO.h;
  const running = game.height === 0 && game.status === "playing";
  const phase = running ? Math.floor(game.distance / 26) % 2 : 0;
  const sx = box.w / DINO.w;
  const sy = box.h / DINO.h;
  const at = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [box.x + x * sx, box.y + y * sy]);

  for (const spike of SPIKES) shape(ctx, at(spike), brand.pink, 0);
  shape(ctx, at(dinoOutline(phase ? 5 : 0, phase ? 0 : 5)), brand.lime, 4);

  // Belly stripe, eye, cheek, and a nostril.
  const [[bx, by]] = at([[30, 36]]);
  ctx.fillStyle = brand.limeSoft;
  ctx.fillRect(bx, by, 9 * sx, 10 * sy);
  const [[ex, ey]] = at([[45, 5]]);
  const es = 8 * Math.min(sx, 1);
  ctx.fillStyle = brand.raised;
  ctx.fillRect(ex, ey, es, es);
  ctx.lineWidth = 2;
  ctx.strokeStyle = brand.ink;
  ctx.strokeRect(ex, ey, es, es);
  if (dead) {
    ctx.beginPath();
    ctx.moveTo(ex + 1.5, ey + 1.5);
    ctx.lineTo(ex + es - 1.5, ey + es - 1.5);
    ctx.moveTo(ex + es - 1.5, ey + 1.5);
    ctx.lineTo(ex + 1.5, ey + es - 1.5);
    ctx.stroke();
  } else {
    const blink = Math.floor(time * 10) % 45 === 0;
    ctx.fillStyle = brand.ink;
    ctx.fillRect(ex + es / 2, ey + (blink ? es / 2 : 2), 3, blink ? 1.5 : es - 4);
  }
  const [[cx, cy]] = at([[50, 13]]);
  ctx.fillStyle = brand.pink;
  ctx.fillRect(cx, cy, 6, 3);
  const [[nx, ny]] = at([[56, 5]]);
  ctx.fillStyle = brand.ink;
  ctx.fillRect(nx, ny, 2, 2);
  if (duck && running) {
    // Speed lines behind a crouching dash.
    ctx.strokeStyle = brand.muted;
    ctx.lineWidth = 2;
    for (const dy of [6, 14, 22]) {
      ctx.beginPath();
      ctx.moveTo(box.x - 16 - (dy % 8), box.y + dy);
      ctx.lineTo(box.x - 4, box.y + dy);
      ctx.stroke();
    }
  }
}

/** A cactus: a trunk with an arm or two, pink with white spines. */
function cactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const t = Math.max(10, w * 0.45); // trunk width
  const tx = x + (w - t) / 2;
  shape(ctx, [[tx, y + 3], [tx + 3, y], [tx + t - 3, y], [tx + t, y + 3], [tx + t, y + h], [tx, y + h]], brand.pink);
  // Arms: left one higher, right one lower.
  const arm = (side: -1 | 1, top: number) => {
    const ax = side < 0 ? x : tx + t;
    const aw = side < 0 ? tx - x : x + w - (tx + t);
    if (aw < 3) return;
    const pts: Pt[] =
      side < 0
        ? [[ax, top], [ax + 6, top], [ax + 6, top + h * 0.2], [tx, top + h * 0.2], [tx, top + h * 0.2 + 7], [ax, top + h * 0.2 + 7]]
        : [[ax + aw - 6, top], [ax + aw, top], [ax + aw, top + h * 0.2 + 7], [ax, top + h * 0.2 + 7], [ax, top + h * 0.2], [ax + aw - 6, top + h * 0.2]];
    shape(ctx, pts, brand.pink, 2);
  };
  arm(-1, y + h * 0.18);
  arm(1, y + h * 0.32);
  ctx.fillStyle = brand.raised;
  for (let sy = y + 8; sy < y + h - 6; sy += 9) {
    ctx.fillRect(tx + 3, sy, 2, 2);
    ctx.fillRect(tx + t - 5, sy + 4, 2, 2);
  }
}

/** A flyer: a violet body, a beak, a crest, and wings that flap. */
function flyer(ctx: CanvasRenderingContext2D, o: Obstacle, time: number) {
  const up = Math.floor(time * 7) % 2 === 0;
  const { x, y, w, h } = o;
  const midY = y + h / 2;
  shape(ctx, [[x + 14, midY - 2], [x + 26, up ? y - 12 : midY + 18], [x + 34, midY - 2]], brand.violet, 2); // wing
  shape(ctx, [[x, midY], [x + 12, midY - 4], [x + 40, midY - 6], [x + w, midY], [x + 40, midY + 6], [x + 12, midY + 4]], brand.violet);
  shape(ctx, [[x - 8, midY + 1], [x + 2, midY - 3], [x + 2, midY + 4]], brand.orange, 0); // beak
  shape(ctx, [[x + 8, midY - 4], [x + 2, midY - 12], [x + 14, midY - 5]], brand.violet, 0); // crest
  ctx.fillStyle = brand.ink;
  ctx.fillRect(x + 7, midY - 2, 3, 3);
}

export type SceneOptions = {
  fonts: Fonts;
  /** Screen-shake strength, 0 for none. */
  shake?: number;
  /** Visible world width; wider than the game world shows more scenery. */
  width?: number;
  /** Visible world height; taller adds sky above, the ground stays at the bottom. */
  height?: number;
  /** Big outlined text drifting in the far sky (the 404 page uses "404"); null for none. */
  label?: string | null;
};

/** Draw one frame of the runner: sky, sun, parallax layers, clouds, ground, obstacles, and the dino. */
export function drawScene(ctx: CanvasRenderingContext2D, game: Game, time: number, opts: SceneOptions) {
  const { fonts, shake = 0, width = WORLD.width, height = WORLD.height, label = "404" } = opts;
  const extra = Math.max(0, height - WORLD.height);
  const d = game.distance;
  ctx.save();
  ctx.translate(0, extra);
  if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * 30, (Math.random() - 0.5) * shake * 30);

  // Sky.
  ctx.fillStyle = brand.blueSoft;
  ctx.fillRect(-10, -10 - extra, width + 20, GROUND + 10 + extra);

  // Sun, nearly still.
  const sunX = width - 110 - ((d * 0.01) % 40);
  ctx.beginPath();
  ctx.arc(sunX + 4, 56 + 4, 30, 0, Math.PI * 2);
  ctx.fillStyle = brand.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sunX, 56, 30, 0, Math.PI * 2);
  ctx.fillStyle = brand.orange;
  ctx.fill();
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();

  // A giant outlined label (404 on the error page) in the far sky.
  ctx.font = `110px ${fonts.display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(14,15,20,0.12)";
  if (label) tiled(d * 0.04, width + 260, width, (x) => ctx.strokeText(label, x + 300, 120));

  // Far mountains, then near hills, each scrolling at its own pace.
  tiled(d * 0.12, 260, width, (x) =>
    shape(ctx, [[x, GROUND], [x + 70, GROUND - 74], [x + 110, GROUND - 46], [x + 160, GROUND - 92], [x + 260, GROUND]], brand.violetSoft, 0),
  );
  tiled(d * 0.35, 220, width, (x) => {
    ctx.beginPath();
    ctx.moveTo(x, GROUND);
    ctx.quadraticCurveTo(x + 55, GROUND - 58, x + 110, GROUND);
    ctx.quadraticCurveTo(x + 165, GROUND - 34, x + 220, GROUND);
    ctx.fillStyle = brand.limeSoft;
    ctx.fill();
    ctx.lineWidth = OUTLINE;
    ctx.strokeStyle = brand.ink;
    ctx.stroke();
  });

  // Clouds.
  tiled(d * 0.2, 300, width, (x) => {
    cloud(ctx, x + 20, 30, 1);
    cloud(ctx, x + 170, 74, 0.7);
  });

  // Ground: a lime grass edge over striped orange earth.
  ctx.fillStyle = brand.orange;
  ctx.fillRect(0, GROUND, width, WORLD.height - GROUND);
  ctx.fillStyle = "rgba(14,15,20,0.12)";
  tiled(d, 32, width, (x) => {
    ctx.fillRect(x + 6, GROUND + 18, 12, 4);
    ctx.fillRect(x + 22, GROUND + 30, 8, 4);
  });
  ctx.fillStyle = brand.lime;
  ctx.fillRect(0, GROUND, width, 9);
  ctx.fillStyle = brand.ink;
  ctx.fillRect(0, GROUND - 1, width, 3);
  ctx.fillRect(0, GROUND + 9, width, 2);
  tiled(d, 18, width, (x) => ctx.fillRect(x + 4, GROUND + 2, 2, 5));

  for (const o of game.obstacles) {
    if (o.kind.startsWith("bird")) flyer(ctx, o, time);
    else if (o.kind === "cluster") {
      cactus(ctx, o.x, o.y + 10, o.w * 0.45, o.h - 10);
      cactus(ctx, o.x + o.w * 0.4, o.y, o.w * 0.6, o.h);
    } else cactus(ctx, o.x, o.y, o.w, o.h);
  }
  dino(ctx, game, time);
  ctx.restore();
}


/** Read the page's display and mono font families (next/font variables), for canvas text. */
export function readFonts(): Fonts {
  const css = getComputedStyle(document.documentElement);
  return {
    display: css.getPropertyValue("--font-archivo-black").trim() || "sans-serif",
    mono: css.getPropertyValue("--font-space-mono").trim() || "monospace",
  };
}
