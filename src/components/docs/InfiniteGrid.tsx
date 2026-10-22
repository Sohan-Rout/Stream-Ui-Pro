"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@streamuilib/react";

export type InfiniteGridProps = {
  /** The cards, each an <li>. Only the revealed ones mount, so their code and animations wait too. */
  children: ReactNode;
  /** Cards per batch: the first batch renders on the server, the rest as you scroll. */
  batch: number;
  /** Classes for the <ul>. */
  className?: string;
  /** What the cards are, for the status line: "components". */
  noun: string;
};

/**
 * A list that grows as you scroll: when the end comes within reach, the next
 * batch mounts. A real "Show more" button sits at the end for keyboards and
 * for browsers without IntersectionObserver, and a polite status line tells
 * screen readers how many are showing.
 */
export function InfiniteGrid({ children, batch, className, noun }: InfiniteGridProps) {
  const items = Children.toArray(children);
  const total = items.length;
  const [count, setCount] = useState(Math.min(batch, total));
  const more = () => setCount((c) => Math.min(total, c + batch));
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= total || typeof IntersectionObserver === "undefined") return;
    // Start loading well before the end is on screen, so scrolling never hits a wall. The margin
    // also reaches far above the viewport, so jumping past the end (a fling, the End key) counts too.
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setCount((c) => Math.min(total, c + batch));
    }, { rootMargin: "100000px 0px 900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [count, total, batch]);

  return (
    <>
      <ul className={className}>{items.slice(0, count)}</ul>
      {count < total && (
        <div ref={sentinel} className="flex justify-center">
          <Button variant="secondary" onClick={more}>
            Show more ({total - count} left)
          </Button>
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        Showing {count} of {total} {noun}
      </p>
    </>
  );
}
