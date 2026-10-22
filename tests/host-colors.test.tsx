/**
 * Installed through the shadcn CLI (or opened in v0), sections, labs, and
 * surfaces render inside someone else's app, whose body color may be white
 * on a dark theme. Each one sets its own ink text color instead of
 * inheriting, so text never turns white-on-white.
 */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { Accordion, Card, Input, Tabs, TrackList } from "@streamuilib/react";
import { loadAllLive } from "./live";

const live = await loadAllLive();

afterEach(cleanup);

const rootHasInk = (el: Element | null) => expect(el?.classList.contains("text-ink")).toBe(true);

describe("sets its own text color", () => {
  for (const s of sections) {
    for (const v of s.variants) {
      test(`${s.name}: ${v.name}`, () => {
        const Variant = live.get(v.file)!;
        rootHasInk(render(<Variant />).container.firstElementChild);
      });
    }
  }

  for (const l of labs) {
    test(`lab: ${l.name}`, () => {
      const Lab = live.get(l.file)!;
      rootHasInk(render(<Lab />).container.firstElementChild);
    });
  }

  test("surface components", () => {
    rootHasInk(render(<Card>x</Card>).container.firstElementChild);
    cleanup();
    rootHasInk(render(<Accordion items={[{ id: "a", title: "A", content: "a" }]} />).container.querySelector("details"));
    cleanup();
    rootHasInk(render(<Tabs label="t" items={[{ id: "a", label: "A", content: "a" }]} />).container.firstElementChild);
    cleanup();
    rootHasInk(render(<TrackList tracks={[{ title: "t", src: "" }]} index={0} />).container.querySelector("ol"));
    cleanup();
    rootHasInk(render(<Input aria-label="x" />).container.querySelector(".border-2"));
  });
});
