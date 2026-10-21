"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Button, ComicButton } from "@streamuilib/react";

/** One 6s loop: the cursor tours the three buttons and clicks each. */
const LOOP = 6;

/** Where each button sits (left %), and when the cursor clicks it (s into the loop). */
const STOPS = [
  { left: "17%", at: 0.9, word: "CLICK!" },
  { left: "51%", at: 2.5, word: "POW!" },
  { left: "84%", at: 4.1, word: "BAM!" },
];

/**
 * The Buttons card on /components: a cartoon cursor tours a classic button,
 * a comic panel, and a burst, clicking each: the button squashes, impact
 * lines fly, and a sound effect pops. Pure CSS; a still lineup for reduced
 * motion.
 */
export function ButtonsPreview() {
  const pct = (t: number) => `${((t / LOOP) * 100).toFixed(2)}%`;
  // Cursor path: hover over each stop a moment before its click, then rest.
  const cursorKeys = STOPS.map((s, i) => {
    const arrive = Math.max(0, s.at - 0.45);
    return `${pct(arrive)}, ${pct(s.at - 0.08)} { left: ${s.left}; top: 62%; transform: scale(1); }
      ${pct(s.at)} { left: ${s.left}; top: 62%; transform: scale(.82); }
      ${pct(s.at + 0.18)} { left: ${s.left}; top: 62%; transform: scale(1); }${i === STOPS.length - 1 ? "" : ""}`;
  }).join("\n");
  return (
    <div className="buttons-preview relative h-44 w-full max-w-md">
      <style href="buttons-preview" precedence="default">{`
        @keyframes buttons-cursor {
          0% { left: -8%; top: 92%; transform: scale(1); }
          ${cursorKeys}
          ${pct(LOOP - 0.9)} { left: 84%; top: 62%; }
          100% { left: 108%; top: 96%; }
        }
        .buttons-preview .bp-cursor { animation: buttons-cursor ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; }
        .buttons-preview .bp-press { animation: buttons-press ${LOOP}s ease-out var(--at) infinite; }
        .buttons-preview .bp-pop { animation: buttons-pop ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite; }
        .buttons-preview .bp-lines { animation: buttons-lines ${LOOP}s ease-out var(--at) infinite; }
        .buttons-preview .bp-spin { animation: buttons-spin ${LOOP}s ease-out 4.1s infinite; }
        @keyframes buttons-press {
          0% { transform: translate(-50%, -50%) scale(1); }
          2% { transform: translate(calc(-50% + 3px), calc(-50% + 3px)) scale(.9, .84); }
          6% { transform: translate(-50%, -50%) scale(1.08, 1.04); }
          10%, 100% { transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes buttons-pop {
          0% { opacity: 0; transform: translate(-50%, 0) scale(.3) rotate(-25deg); }
          4% { opacity: 1; transform: translate(-50%, -14px) scale(1.2) rotate(8deg); }
          7% { transform: translate(-50%, -18px) scale(1) rotate(5deg); }
          18% { opacity: 1; transform: translate(-50%, -24px) scale(1) rotate(5deg); }
          24%, 100% { opacity: 0; transform: translate(-50%, -30px) scale(.9) rotate(5deg); }
        }
        @keyframes buttons-lines {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.5); }
          2% { opacity: 1; }
          9%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
        @keyframes buttons-spin {
          0% { rotate: 0deg; }
          12%, 100% { rotate: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .buttons-preview .bp-cursor, .buttons-preview .bp-press, .buttons-preview .bp-pop, .buttons-preview .bp-lines, .buttons-preview .bp-spin { animation: none; }
          .buttons-preview .bp-press { transform: translate(-50%, -50%); }
          .buttons-preview .bp-pop, .buttons-preview .bp-lines { opacity: 0; }
          .buttons-preview .bp-cursor { left: 84%; top: 62%; }
        }
      `}</style>

      {STOPS.map((s, i) => {
        // Centered on its spot before its animation first runs, too.
        const vars = { left: s.left, top: "50%", transform: "translate(-50%, -50%)", "--at": `${s.at}s` } as CSSProperties;
        return (
          <div key={i} aria-hidden>
            {/* Impact lines behind the button. */}
            <svg viewBox="-50 -50 100 100" className="bp-lines absolute size-28 opacity-0" style={vars}>
              <g stroke="var(--ink)" strokeWidth="5" strokeLinecap="round">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <line key={a} x1="0" y1="-34" x2="0" y2="-47" transform={`rotate(${a})`} />
                ))}
              </g>
            </svg>
            <div className="bp-press absolute" style={vars}>
              {i === 0 && (
                <Button size="sm">
                  Classic <ArrowRight aria-hidden />
                </Button>
              )}
              {i === 1 && (
                <ComicButton tone="pink" size="sm" pop={false}>
                  Comic!
                </ComicButton>
              )}
              {i === 2 && (
                <div className="bp-spin">
                  <ComicButton shape="burst" tone="orange" size="sm" tilt={8} pop={false}>
                    Go
                  </ComicButton>
                </div>
              )}
            </div>
            {/* The sound effect. */}
            <span
              className="bp-pop absolute z-20 border-[3px] border-ink bg-paper-raised px-1.5 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-ink opacity-0 shadow-[2px_2px_0_var(--ink)]"
              style={{ left: s.left, top: "14%", transform: "translate(-50%, 0)", "--at": `${s.at}s` } as CSSProperties}
            >
              {s.word}
            </span>
          </div>
        );
      })}

      {/* The cursor: a chunky arrow that tours the buttons. */}
      <svg aria-hidden viewBox="0 0 30 36" className="bp-cursor absolute z-30 h-9 w-7.5 origin-top-left" style={{ left: "84%", top: "62%" }}>
        <path d="M3 2 L3 28 L10 22 L15 33 L20 31 L15 20 L25 20 Z" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** The Comic card inside Buttons: three shapes, small enough for the card. */
export function ComicButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ComicButton>Get started</ComicButton>
      <ComicButton shape="bubble" tone="paper">
        Say hi!
      </ComicButton>
      <ComicButton shape="burst" tone="pink" size="sm" tilt={8}>
        Buy!
      </ComicButton>
    </div>
  );
}
