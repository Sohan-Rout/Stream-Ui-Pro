/**
 * Brag shots: screenshots of the site's best moments, for posts and the README.
 *
 *   bun scripts/brag.ts                     # every shot, against http://localhost:3000
 *   bun scripts/brag.ts --base https://streamui.org
 *   bun scripts/brag.ts --only hero,pinball # shots whose name contains any of these
 *
 * Drives a headless Chrome through the DevTools protocol, so there is nothing to
 * install. The cookie banner is answered ("essential") before each page loads, so
 * it never covers a shot. Files land in brag/<date>/ (gitignored).
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { CONSENT_KEY } from "../src/lib/consent-key";

type Shot = {
  name: string;
  path: string;
  /** Viewport width; height follows unless `full`. */
  width?: number;
  height?: number;
  /** Clip to the first element matching this selector. */
  selector?: string;
  /** Capture the whole page instead of the viewport. */
  full?: boolean;
  /** Milliseconds to let animations and games run before the shot. */
  wait?: number;
  /** Runs in the page before the shot, e.g. to start a game. */
  before?: string;
};

/** The framed live preview on section and lab pages (the id is on its heading). */
const PREVIEW = "section[aria-labelledby=preview] > div:last-child";
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

/**
 * Starts a lab's game, then plays a few keys on its board: each step is a key
 * held for some milliseconds. Games read keys from their focused board.
 */
const play = (steps: [key: string, ms: number][]) => `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const start = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Start");
  start?.click();
  await wait(200);
  const board = document.querySelector("main [tabindex='0']");
  board?.focus();
  for (const [key, ms] of ${JSON.stringify(steps)}) {
    const opts = { key, bubbles: true };
    board?.dispatchEvent(new KeyboardEvent("keydown", opts));
    await wait(ms);
    board?.dispatchEvent(new KeyboardEvent("keyup", opts));
    await wait(60);
  }
})()`;

export const SHOTS: Shot[] = [
  { name: "home", path: "/", ...DESKTOP, wait: 1500 },
  { name: "home-phone", path: "/", ...PHONE, wait: 1500 },
  { name: "sections", path: "/sections", ...DESKTOP, full: true, wait: 2500 },
  ...["pixel", "blocks", "platformer", "maze", "flappy"].map((v) => ({
    name: `hero-${v}`,
    path: `/sections/hero/${v}`,
    ...DESKTOP,
    selector: PREVIEW,
    wait: 3000,
  })),
  ...["maze", "bento", "levels"].map((v) => ({
    name: `features-${v}`,
    path: `/sections/features/${v}`,
    ...DESKTOP,
    selector: PREVIEW,
    wait: 2000,
  })),
  { name: "labs", path: "/labs", ...DESKTOP, full: true, wait: 2000 },
  { name: "lab-tetris", path: "/labs/tetris", ...DESKTOP, selector: PREVIEW, wait: 4000, before: play([["ArrowLeft", 40], ["ArrowUp", 40], [" ", 40], ["ArrowRight", 40], [" ", 40], ["x", 40], [" ", 40]]) },
  { name: "lab-pinball", path: "/labs/pinball", ...DESKTOP, selector: PREVIEW, wait: 450, before: play([[" ", 1000]]) },
  { name: "lab-maze", path: "/labs/maze", ...DESKTOP, selector: PREVIEW, wait: 1500, before: play([["ArrowLeft", 900], ["ArrowUp", 600]]) },
  { name: "lab-jumper", path: "/labs/jumper", ...DESKTOP, selector: PREVIEW, wait: 300, before: play([["ArrowRight", 900], ["ArrowUp", 150], ["ArrowRight", 600]]) },
  { name: "components", path: "/components", ...DESKTOP, full: true, wait: 1500 },
  { name: "icons", path: "/icons", ...DESKTOP, wait: 1500 },
];

function arg(flag: string) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && Bun.file(p).size > 0);

/** A minimal DevTools protocol client over one page's WebSocket. */
class Page {
  private id = 0;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private waiters: { method: string; resolve: () => void }[] = [];
  private constructor(private ws: WebSocket) {
    ws.onmessage = (e) => {
      const msg = JSON.parse(String(e.data));
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id)!;
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error.message));
        else p.resolve(msg.result);
      } else if (msg.method) {
        this.waiters = this.waiters.filter((w) => (w.method === msg.method ? (w.resolve(), false) : true));
      }
    };
  }
  static async open(url: string) {
    const ws = new WebSocket(url);
    await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)));
    return new Page(ws);
  }
  send<T = Record<string, unknown>>(method: string, params: object = {}): Promise<T> {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject }));
  }
  once(method: string) {
    return new Promise<void>((resolve) => this.waiters.push({ method, resolve }));
  }
  close() {
    this.ws.close();
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!CHROME) throw new Error("No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.");
  const base = (arg("--base") ?? "http://localhost:3000").replace(/\/$/, "");
  const only = arg("--only")?.split(",").filter(Boolean);
  const shots = only ? SHOTS.filter((s) => only.some((o) => s.name.includes(o))) : SHOTS;
  if (shots.length === 0) throw new Error(`No shots match --only ${only?.join(",")}`);

  const ping = await fetch(base).catch(() => null);
  if (!ping) throw new Error(`${base} isn't answering. Start the dev server first (bun dev).`);

  const out = join("brag", new Date().toISOString().slice(0, 10));
  await mkdir(out, { recursive: true });

  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = join(process.env.TMPDIR ?? "/tmp", `brag-chrome-${port}`);
  const chrome = Bun.spawn(
    [CHROME, "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "about:blank"],
    { stdout: "ignore", stderr: "ignore" },
  );

  try {
    let target: { webSocketDebuggerUrl: string } | undefined;
    for (let i = 0; i < 50 && !target; i++) {
      await sleep(100);
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => null);
      target = list?.find((t: { type: string }) => t.type === "page");
    }
    if (!target) throw new Error("Chrome started but exposed no page.");
    const page = await Page.open(target.webSocketDebuggerUrl);
    await page.send("Page.enable");
    // Answer the cookie banner before any page script runs, and hide the Next.js dev badge.
    await page.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `try { localStorage.setItem(${JSON.stringify(CONSENT_KEY)}, "essential") } catch {}
        addEventListener("DOMContentLoaded", () => {
          const s = document.createElement("style");
          s.textContent = "nextjs-portal { display: none !important }";
          document.head.append(s);
        });`,
    });

    for (const s of shots) {
      const width = s.width ?? DESKTOP.width;
      const height = s.height ?? DESKTOP.height;
      const mobile = width < 768;
      await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });
      const loaded = page.once("Page.loadEventFired");
      await page.send("Page.navigate", { url: base + s.path });
      await loaded;
      await page.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
      if (s.before) await page.send("Runtime.evaluate", { expression: s.before, awaitPromise: true });
      await sleep(s.wait ?? 1000);

      let clip: { x: number; y: number; width: number; height: number; scale: number } | undefined;
      if (s.selector) {
        const { result } = await page.send<{ result: { value?: number[] } }>("Runtime.evaluate", {
          expression: `(() => {
            const el = document.querySelector(${JSON.stringify(s.selector)});
            if (!el) return undefined;
            el.scrollIntoView({ block: "center" });
            const r = el.getBoundingClientRect();
            return [r.x + scrollX, r.y + scrollY, r.width, r.height];
          })()`,
          returnByValue: true,
        });
        if (!result.value) throw new Error(`${s.name}: nothing matches ${s.selector} on ${s.path}`);
        // Pad the clip so the brutal drop shadow makes it into the shot.
        const [x, y, w, h] = result.value;
        const pad = 16;
        clip = { x: x - pad, y: y - pad, width: w + pad * 2, height: h + pad * 2, scale: 1 };
        await sleep(300);
      }

      const { data } = await page.send<{ data: string }>("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: Boolean(s.full || clip),
        ...(clip ? { clip } : {}),
        ...(s.full && !clip ? { clip: await fullPage(page, width) } : {}),
      });
      const file = join(out, `${s.name}.png`);
      await Bun.write(file, Buffer.from(data, "base64"));
      console.log(`✓ ${file}`);
    }
    page.close();
  } finally {
    chrome.kill();
  }
}

async function fullPage(page: Page, width: number) {
  const { result } = await page.send<{ result: { value: number } }>("Runtime.evaluate", {
    expression: "document.documentElement.scrollHeight",
    returnByValue: true,
  });
  return { x: 0, y: 0, width, height: result.value, scale: 1 };
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(`brag: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  });
}
