import type { CSSProperties, ReactNode } from "react";
import { Card, CardDescription, CardTitle, ComicBadge, ComicCard } from "@streamuilib/react";

/** One 6s loop. */
const LOOP = 6;

type Panel = { left: string; rot: number; at: number; node: ReactNode };

const PANELS: Panel[] = [
  {
    left: "16%",
    rot: -3,
    at: 0.2,
    node: (
      <Card className="w-24 p-3">
        <CardTitle className="text-sm">Classic</CardTitle>
        <CardDescription className="text-xs">Hard edges.</CardDescription>
      </Card>
    ),
  },
  {
    left: "50%",
    rot: 2,
    at: 0.75,
    node: (
      <ComicCard tone="pink" caption="Later…" tilt={0} className="w-28 px-3 pt-7 pb-3">
        <CardTitle className="text-sm">Comic</CardTitle>
        <CardDescription className="text-xs">Panels!</CardDescription>
      </ComicCard>
    ),
  },
  {
    left: "84%",
    rot: -2,
    at: 1.3,
    node: (
      <ComicCard tone="blue" tilt={0} className="w-24 px-3 pt-4 pb-3">
        <CardTitle className="text-sm">The end?</CardTitle>
        <CardDescription className="text-xs">To be continued.</CardDescription>
      </ComicCard>
    ),
  },
];

/**
 * The Cards tile on /components: a comic strip that assembles itself. Three
 * panels slam in, a KAPOW! bursts on the middle one with the strip jolting,
 * a speech bubble pops in the last, and then the strip clears and redraws.
 * Pure CSS; a still strip for reduced motion.
 */
export function CardsPreview() {
  return (
    <div className="cards-preview relative h-44 w-full max-w-md">
      <style href="cards-preview" precedence="default">{`
        @keyframes cards-slam {
          0% { opacity: 0; transform: translate(-50%, -150%) scale(1.5) rotate(calc(var(--rot) * -4)); }
          5% { opacity: 1; transform: translate(-50%, -46%) scale(.94) rotate(var(--rot)); }
          8% { transform: translate(-50%, -52%) scale(1.03) rotate(var(--rot)); }
          11%, 74% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--rot)); }
          82%, 100% { opacity: 0; transform: translate(-50%, 60%) scale(.8) rotate(calc(var(--rot) * 3)); }
        }
        @keyframes cards-burst {
          0%, 30% { opacity: 0; transform: scale(0) rotate(-40deg); }
          34% { opacity: 1; transform: scale(1.35) rotate(12deg); }
          38%, 70% { opacity: 1; transform: scale(1) rotate(8deg); }
          76%, 100% { opacity: 0; transform: scale(0) rotate(40deg); }
        }
        @keyframes cards-lines {
          0%, 30% { opacity: 0; transform: translate(-50%, -50%) scale(.4); }
          32% { opacity: 1; }
          44%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
        }
        @keyframes cards-bubble {
          0%, 42% { opacity: 0; transform: scale(0) translateY(10px); }
          46% { opacity: 1; transform: scale(1.15) translateY(0); }
          49%, 72% { opacity: 1; transform: scale(1); }
          76%, 100% { opacity: 0; transform: scale(0); }
        }
        @keyframes cards-jolt {
          0%, 31%, 37%, 100% { transform: translate(0, 0); }
          32% { transform: translate(-3px, 2px); }
          34% { transform: translate(3px, -2px); }
          36% { transform: translate(-1px, 1px); }
        }
        .cards-preview .cp-panel { animation: cards-slam ${LOOP}s cubic-bezier(.2,.9,.3,1.1) var(--at) infinite both; }
        .cards-preview .cp-burst { animation: cards-burst ${LOOP}s ease-out infinite both; }
        .cards-preview .cp-lines { animation: cards-lines ${LOOP}s ease-out infinite both; }
        .cards-preview .cp-bubble { animation: cards-bubble ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        .cards-preview .cp-strip { animation: cards-jolt ${LOOP}s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cards-preview .cp-panel, .cards-preview .cp-burst, .cards-preview .cp-bubble, .cards-preview .cp-strip { animation: none; }
          .cards-preview .cp-panel { transform: translate(-50%, -50%) rotate(var(--rot)); }
          .cards-preview .cp-lines { display: none; }
        }
      `}</style>

      <div className="cp-strip absolute inset-0">
        {PANELS.map((p, i) => (
          <div
            key={i}
            aria-hidden
            className="cp-panel absolute top-1/2"
            style={{ left: p.left, transform: "translate(-50%, -50%)", "--at": `${p.at}s`, "--rot": `${p.rot}deg` } as CSSProperties}
          >
            {p.node}
          </div>
        ))}

        {/* KAPOW! on the middle panel, with impact lines. */}
        <svg aria-hidden viewBox="-50 -50 100 100" className="cp-lines absolute z-10 size-32" style={{ left: "60%", top: "22%" }}>
          <g stroke="var(--ink)" strokeWidth="5" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-32" x2="0" y2="-46" transform={`rotate(${a})`} />
            ))}
          </g>
        </svg>
        <span aria-hidden className="cp-burst absolute z-20" style={{ left: "52%", top: "2%" }}>
          <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
            Kapow!
          </ComicBadge>
        </span>

        {/* A speech bubble pops in the last panel. */}
        <span aria-hidden className="cp-bubble absolute z-20 origin-bottom-left" style={{ left: "74%", top: "6%" }}>
          <ComicBadge shape="bubble" tone="paper" size="sm" tilt={-4}>
            Boom!
          </ComicBadge>
        </span>
      </div>
    </div>
  );
}

/** The Comic card inside Cards: one panel, small enough for the card. */
export function ComicCardPreview() {
  return (
    <ComicCard tone="pink" caption="Meanwhile…" sfx="Kapow!" className="w-60">
      <CardTitle>Pro plan</CardTitle>
      <CardDescription>For teams shipping every day.</CardDescription>
    </ComicCard>
  );
}
