"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts its children only once they come near the viewport, and keeps them
 * after that. Live previews further down a long page then load their code
 * and start animating only when someone scrolls toward them. The placeholder
 * holds the space so nothing jumps.
 */
export function WhenVisible({ children, className, margin = "400px" }: { children: ReactNode; className?: string; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setShown(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, margin]);

  return (
    <div ref={ref} className={className}>
      {shown ? children : null}
    </div>
  );
}
