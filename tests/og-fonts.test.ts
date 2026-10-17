/**
 * Share images must render even when Google Fonts can't be reached: a build
 * on Vercel once failed with "No fonts are loaded" when the downloads failed.
 */
import { afterEach, expect, test } from "bun:test";
import { renderIcon, renderOgImage } from "@/lib/og";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("with Google Fonts unreachable, share images and icons still render as PNGs", async () => {
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    throw new Error("network down");
  }) as unknown as typeof fetch;

  const image = await renderOgImage({
    eyebrow: "Test",
    title: "Offline build",
    description: "Fonts failed to load.",
    accent: "lime",
    art: { kind: "section", variant: "pixel" },
  });
  const png = new Uint8Array(await image.arrayBuffer());
  expect(image.headers.get("content-type")).toBe("image/png");
  expect([...png.slice(1, 4)].map((c) => String.fromCharCode(c)).join("")).toBe("PNG");

  const icon = await renderIcon(32);
  expect((await icon.arrayBuffer()).byteLength).toBeGreaterThan(0);
  // It retried before giving up.
  expect(calls).toBeGreaterThan(3);
}, 30_000);
