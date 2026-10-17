import type { ReactNode } from "react";

/** How much the preview shrinks: at 0.25 it lays out four times wider than the card. */
const ZOOM = 0.25;

/**
 * A live, shrunken render of a section for a thumbnail. Under `zoom`, a
 * block that fills the card lays out at card width ÷ zoom (4× here), so
 * its container queries pick the desktop layout, and it's drawn at the
 * card's size. Don't also widen it: zoom already does. Thumbnails
 * are decorative copies: hidden from assistive tech and inert, so the card's
 * own link is the only thing to focus or click.
 */
export function LiveThumb({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden inert className="relative aspect-video overflow-hidden border-2 border-ink bg-paper">
      <div className="pointer-events-none select-none" style={{ zoom: ZOOM }}>
        {children}
      </div>
    </div>
  );
}
