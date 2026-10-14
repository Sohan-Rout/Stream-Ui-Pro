"use client";

import { useEffect, useRef, type ComponentProps, type CSSProperties } from "react";
import { cn } from "./cn";

export const iconAnimations = ["draw", "spin", "bounce", "wiggle", "pulse", "shake", "pop"] as const;
export type IconAnimation = (typeof iconAnimations)[number];

/**
 * - `hover`: plays while the icon, or its direct parent (e.g. a button), is hovered or focused
 * - `loop`: plays forever
 * - `once`: plays once when the icon mounts
 */
export type IconTrigger = "hover" | "loop" | "once";

export type AnimatedIconProps = ComponentProps<"span"> & {
  animation: IconAnimation;
  trigger?: IconTrigger;
  /** Length of one cycle in milliseconds. */
  duration?: number;
};

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

/**
 * Animates any SVG icon passed as its child. Works with lucide-react,
 * react-icons, or your own SVGs. The keyframes live in `theme.css`, and
 * every animation is switched off under `prefers-reduced-motion`.
 */
export function AnimatedIcon({
  animation,
  trigger = "hover",
  duration,
  className,
  style,
  children,
  ...props
}: AnimatedIconProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // "draw" animates stroke-dashoffset from 1 to 0, which needs every shape
  // normalized to pathLength="1". Icons can render late (lazy or dynamic
  // icons), so re-prime whenever the children change.
  useEffect(() => {
    const el = ref.current;
    if (animation !== "draw" || !el) return;
    const prime = () => {
      el.querySelectorAll(SHAPES).forEach((shape) => shape.setAttribute("pathLength", "1"));
      el.dataset.suiReady = "";
    };
    prime();
    const observer = new MutationObserver(prime);
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [animation]);

  return (
    <span
      ref={ref}
      data-sui-icon={animation}
      data-sui-trigger={trigger}
      className={cn("inline-flex shrink-0", className)}
      style={duration ? ({ ...style, "--sui-icon-duration": `${duration}ms` } as CSSProperties) : style}
      {...props}
    >
      {children}
    </span>
  );
}
