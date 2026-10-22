"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

/** True when the visitor asked to save data or is on a 2G-class connection. */
function saveData() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || c.effectiveType === "slow-2g" || c.effectiveType === "2g");
}

/**
 * A Link that prefetches on intent (hover, focus, or touch) instead of on
 * sight. For long lists like the docs sidebar, where dozens of links are on
 * screen at once, this skips dozens of background fetches; the page the
 * visitor heads for still loads before the click lands. Visitors who asked
 * to save data get no prefetching at all.
 */
export function IntentLink({ href, onPointerEnter, onFocus, onTouchStart, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  const prefetch = () => {
    if (!saveData()) router.prefetch(href);
  };
  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        prefetch();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        prefetch();
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e);
        prefetch();
      }}
      {...props}
    />
  );
}
