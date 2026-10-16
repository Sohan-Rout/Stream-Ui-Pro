"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Lets wheel events through untouched while a modal <dialog> is open, or over one. */
const preventSmoothing = (node: HTMLElement) =>
  node.tagName === "DIALOG" || document.querySelector("dialog:modal") !== null;

/**
 * Lenis smooth scrolling for the whole page (mouse wheel and trackpad; touch
 * stays native). Off for visitors who prefer reduced motion, and switches
 * on or off if that setting changes. Scroll areas inside the page (code
 * blocks, the docs sidebar, tables) keep scrolling on their own, and links
 * to #sections glide there, honoring each section's scroll-margin.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) {
        lenis?.destroy();
        lenis = null;
      } else if (!lenis) {
        lenis = new Lenis({ autoRaf: true, anchors: true, allowNestedScroll: true, prevent: preventSmoothing });
      }
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // A new page: drop any glide still running from the last one, so it can't
  // carry on scrolling the page Next.js just put at the top.
  useEffect(() => {
    lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
