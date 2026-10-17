"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Layout widths to try: real breakpoints, so the section's container queries pick a real layout. */
const WIDTHS = [1280, 1024, 768];

type Fit = { width: number; height: number; scale: number };

/**
 * A live miniature of a section for a thumbnail card.
 *
 * The section lays out at a real page width, then is scaled to fit inside
 * the frame, whole and centered. Of the widths tried, it keeps the one that
 * fills the frame best: a wide split hero stays at desktop, a layout that
 * gets tall and narrow at desktop can use a smaller breakpoint. Sizes are
 * measured, so tall and short sections fit without blank bands or cropping.
 * Thumbnails are decorative copies: hidden from assistive tech and inert,
 * so the card's own link is the only thing to focus or click.
 */
export function LiveThumb({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit | null>(null);

  useLayoutEffect(() => {
    const f = frame.current;
    const c = content.current;
    if (!f || !c) return;

    const measure = () => {
      const style = getComputedStyle(f);
      const availW = f.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const availH = f.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      if (availW <= 0 || availH <= 0) return;

      // Lay out at each width (offsetHeight ignores the scale transform) and
      // keep the one whose scaled miniature covers the most of the frame.
      let best: Fit | null = null;
      for (const w of WIDTHS) {
        c.style.width = `${w}px`;
        const h = c.offsetHeight;
        if (!h) continue;
        const s = Math.min(availW / w, availH / h);
        if (!best || w * h * s * s > best.width * best.height * best.scale * best.scale * 1.02) {
          best = { width: w, height: h, scale: s };
        }
      }
      if (!best) return;
      c.style.width = `${best.width}px`;
      const { width, height, scale } = best;
      setFit((prev) =>
        prev && prev.width === width && prev.height === height && Math.abs(prev.scale - scale) < 1e-4
          ? prev
          : { width, height, scale },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(f);
    observer.observe(c);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frame}
      aria-hidden
      inert
      className="grid aspect-video place-items-center overflow-hidden border-2 border-ink bg-paper-sunken bg-dots p-4 sm:p-5"
    >
      {/* Sized to the scaled section, so the border and shadow stay crisp at full size. */}
      <div
        className="relative overflow-hidden border-2 border-ink shadow-brutal-sm"
        style={
          fit
            ? { width: fit.width * fit.scale + 4, height: fit.height * fit.scale + 4 }
            : { visibility: "hidden", width: "100%", height: "100%" }
        }
      >
        <div
          ref={content}
          className="pointer-events-none absolute top-0 left-0 origin-top-left select-none"
          style={{ width: fit?.width ?? WIDTHS[0], transform: fit ? `scale(${fit.scale})` : undefined }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
