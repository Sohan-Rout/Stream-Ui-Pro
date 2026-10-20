import type { CSSProperties, ReactNode } from "react";
import { Badge, ComicBadge, type BadgeTone, type ComicBadgeShape } from "@streamuilib/react";

/** A 6s loop: stickers slam on one after another, hold, then pop off. */
const CYCLE = 6;

type Sticker = { x: string; y: string; at: number; rot: number; node: ReactNode };

const comic = (shape: ComicBadgeShape, tone: BadgeTone, text: ReactNode) => (
  <ComicBadge shape={shape} tone={tone} size="sm" tilt={0}>
    {text}
  </ComicBadge>
);

const STICKERS: Sticker[] = [
  { x: "13%", y: "26%", at: 0.35, rot: -14, node: comic("seal", "pink", <>50%<br />off</>) },
  { x: "86%", y: "28%", at: 0.7, rot: 12, node: comic("splat", "orange", "Hot") },
  { x: "20%", y: "80%", at: 1.05, rot: 8, node: comic("bubble", "paper", "Wow!") },
  { x: "80%", y: "80%", at: 1.4, rot: -9, node: comic("ribbon", "violet", "Best seller") },
  { x: "50%", y: "8%", at: 1.75, rot: 4, node: <Badge tone="blue">beta</Badge> },
  { x: "36%", y: "94%", at: 2.05, rot: -6, node: <Badge tone="lime">new</Badge> },
  { x: "64%", y: "95%", at: 2.3, rot: 7, node: <Badge tone="pink">v0.4</Badge> },
];

/**
 * The Badges card on /components: a big spinning BADGES! burst, with comic
 * stickers and pills slapped on around it, each with a dust ring, while the
 * whole board jolts on every hit. Pure CSS; a still collage for reduced motion.
 */
export function BadgesPreview() {
  return (
    <div className="badges-preview relative h-44 w-full max-w-md">
      <style href="badges-preview" precedence="default">{`
        @keyframes badges-slap {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(2.8) rotate(calc(var(--rot) * -3)); }
          5% { opacity: 1; transform: translate(-50%, -50%) scale(0.82) rotate(var(--rot)); }
          8% { transform: translate(-50%, -50%) scale(1.1) rotate(var(--rot)); }
          11%, 70% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--rot)); }
          74% { opacity: 1; transform: translate(-50%, -50%) scale(1.18) rotate(calc(var(--rot) + 8deg)); }
          79%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(calc(var(--rot) + 40deg)); }
        }
        @keyframes badges-dust {
          0%, 4% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          5% { opacity: 1; }
          16%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.7); }
        }
        @keyframes badges-hero {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(-6deg); }
          50% { transform: translate(-50%, -50%) scale(1.12) rotate(6deg); }
        }
        @keyframes badges-jolt {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 2px); }
          45% { transform: translate(2px, -1px); }
          70% { transform: translate(-1px, -1px); }
        }
        .badges-preview .bp-sticker { animation: badges-slap ${CYCLE}s cubic-bezier(0.2, 0.9, 0.3, 1.2) var(--at) infinite both; }
        .badges-preview .bp-dust { animation: badges-dust ${CYCLE}s ease-out var(--at) infinite both; }
        .badges-preview .bp-hero { animation: badges-hero 1.6s ease-in-out infinite; }
        .badges-preview .bp-board { animation: badges-jolt 0.35s steps(4) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .badges-preview .bp-sticker, .badges-preview .bp-hero, .badges-preview .bp-board { animation: none; }
          .badges-preview .bp-sticker { transform: translate(-50%, -50%) rotate(var(--rot)); }
          .badges-preview .bp-hero { transform: translate(-50%, -50%) rotate(-6deg); }
          .badges-preview .bp-dust { display: none; }
        }
      `}</style>

      <div className="bp-board absolute inset-0">
        {/* The star of the show: a big lime burst that spins its points and bobs. */}
        <div className="bp-hero absolute top-1/2 left-1/2 z-10">
          <ComicBadge shape="burst" tone="lime" size="lg" tilt={0} animate="spin">
            Badges!
          </ComicBadge>
        </div>

        {STICKERS.map((s, i) => {
          const vars = { left: s.x, top: s.y, "--at": `${s.at}s`, "--rot": `${s.rot}deg` } as CSSProperties;
          return (
            <span key={i} aria-hidden>
              {/* A comic dust ring where it hits. */}
              <svg viewBox="-50 -50 100 100" className="bp-dust absolute z-0 size-24" style={vars}>
                <g stroke="var(--ink)" strokeWidth="5" strokeLinecap="round">
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <line key={a} x1="0" y1="-30" x2="0" y2="-44" transform={`rotate(${a + 30})`} />
                  ))}
                </g>
              </svg>
              <span className="bp-sticker absolute z-20" style={vars}>
                {s.node}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
