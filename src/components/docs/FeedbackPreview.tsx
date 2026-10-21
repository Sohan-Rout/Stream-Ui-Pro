/**
 * The animated tiles on /components for Progress Bars, Batteries, Skeletons,
 * and Avatars, and the compact comic specimens for their Comic cards. Each
 * tile is a 6s CSS loop of decorative, inert markup, still for reduced motion.
 */
import type { CSSProperties } from "react";
import { ComicAvatar, ComicBadge, ComicBattery, ComicProgress, ComicSkeleton, Progress } from "@streamuilib/react";
import { BURST, DOTS, LOOP, Stage } from "./tile";

const track =
  "overflow-hidden rounded-[12px_5px_10px_6px/6px_10px_5px_12px] border-[3px] border-ink bg-paper-sunken shadow-[4px_4px_0_var(--ink)]";
const stripes: CSSProperties = {
  backgroundImage: "repeating-linear-gradient(-60deg, rgb(255 255 255 / 0.4) 0 5px, transparent 5px 14px)",
  backgroundSize: "32.3px 28px",
};

/* ---------- Progress ---------- */

/** The comic bar races from 0 to 100 with its starburst counting along, then DONE! slams on. */
export function ProgressPreview() {
  return (
    <Stage
      name="progress-preview"
      css={`
        @property --pgv { syntax: "<integer>"; inherits: true; initial-value: 0; }
        @keyframes progress-v { 0%, 6% { --pgv: 0; } 30% { --pgv: 46; } 38% { --pgv: 52; } 58%, 88% { --pgv: 100; } 96%, 100% { --pgv: 0; } }
        @keyframes progress-speed { to { background-position: 32.3px 0; } }
        @keyframes progress-done {
          0%, 58% { opacity: 0; transform: scale(2.4) rotate(-20deg); }
          62% { opacity: 1; transform: scale(.9) rotate(-8deg); }
          65%, 86% { opacity: 1; transform: scale(1) rotate(-6deg); }
          92%, 100% { opacity: 0; transform: scale(.6) rotate(-6deg); }
        }
        @keyframes progress-pop { 0%, 57%, 66%, 100% { scale: 1; } 60% { scale: 1.3; } }
        .progress-preview .pgp-root { animation: progress-v ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; counter-reset: pgv var(--pgv); }
        .progress-preview .pgp-fill { width: calc(var(--pgv) * 1%); animation: progress-speed .7s linear infinite; }
        .progress-preview .pgp-at { left: calc(var(--pgv) * 1%); }
        .progress-preview .pgp-num::before { content: counter(pgv) "%"; }
        .progress-preview .pgp-burst { animation: progress-pop ${LOOP}s ease-out infinite; }
        .progress-preview .pgp-burst svg { rotate: calc(var(--pgv) * 3.6deg); }
        .progress-preview .pgp-done { animation: progress-done ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .progress-preview .pgp-root, .progress-preview .pgp-fill, .progress-preview .pgp-burst, .progress-preview .pgp-done { animation: none; }
          .progress-preview .pgp-root { --pgv: 64; }
          .progress-preview .pgp-done { opacity: 0; }
        }
      `}
    >
      <div className="pgp-root absolute inset-x-[10%] top-[36%] h-8">
        <div className={`absolute inset-0 ${track}`} style={DOTS}>
          <div className="pgp-fill h-full border-r-[3px] border-ink bg-pink" style={stripes} />
        </div>
        <span className="pgp-burst pgp-at absolute top-1/2 grid size-13 -translate-1/2 place-items-center font-mono text-[10px] font-bold">
          <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[2px_2px_0_var(--ink)]">
            <path d={BURST} fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={6} strokeLinejoin="round" />
          </svg>
          <span className="pgp-num relative" />
        </span>
        <span className="pgp-done absolute -top-9 left-2 z-10 border-[3px] border-ink bg-lime px-2 py-0.5 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]">
          Done!
        </span>
      </div>
      <div className="absolute inset-x-[10%] bottom-[12%]">
        <Progress value={40} tone="lime" aria-label="Classic" />
      </div>
    </Stage>
  );
}

/** The Comic card inside Progress Bars. */
export function ComicProgressPreview() {
  return <ComicProgress value={64} aria-label="Upload" className="w-60" />;
}

/* ---------- Battery ---------- */

/** The comic battery drains from full to LOW!, gets plugged in with a ZAP!, and charges back up. */
export function BatteriesPreview() {
  return (
    <Stage
      name="battery-preview"
      css={`
        @property --btv { syntax: "<integer>"; inherits: true; initial-value: 100; }
        @keyframes battery-v { 0%, 6% { --btv: 100; } 44%, 56% { --btv: 9; } 92%, 100% { --btv: 100; } }
        @keyframes battery-fill {
          0%, 22% { background-color: var(--lime); }
          23%, 37% { background-color: var(--orange); }
          38%, 62% { background-color: var(--pink); }
          63%, 76% { background-color: var(--orange); }
          77%, 100% { background-color: var(--lime); }
        }
        @keyframes battery-low {
          0%, 40% { opacity: 0; transform: scale(0) rotate(-30deg); }
          44% { opacity: 1; transform: scale(1.2) rotate(-12deg); }
          46% { transform: scale(1) rotate(-8deg) translateX(-3px); }
          48% { transform: scale(1) rotate(-8deg) translateX(3px); }
          50% { transform: scale(1) rotate(-8deg) translateX(-3px); }
          52%, 55% { opacity: 1; transform: scale(1) rotate(-8deg); }
          57%, 100% { opacity: 0; transform: scale(0); }
        }
        @keyframes battery-zap {
          0%, 56% { opacity: 0; transform: scale(0) rotate(-60deg); }
          60% { opacity: 1; transform: scale(1.3) rotate(16deg); }
          63%, 88% { opacity: 1; transform: scale(1) rotate(10deg); }
          94%, 100% { opacity: 0; transform: scale(0); }
        }
        @keyframes battery-plug { 0%, 50% { translate: -24px 0; opacity: .35; } 57%, 90% { translate: 0 0; opacity: 1; } 97%, 100% { translate: -24px 0; opacity: .35; } }
        @keyframes battery-stripes { to { background-position: 11.3px 0; } }
        .battery-preview .btp-root { animation: battery-v ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; counter-reset: btv var(--btv); }
        .battery-preview .btp-fill { width: calc(var(--btv) * 1%); animation: battery-fill ${LOOP}s steps(1) infinite, battery-stripes .8s linear infinite; }
        .battery-preview .btp-num::before { content: counter(btv) "%"; }
        .battery-preview .btp-low { animation: battery-low ${LOOP}s ease-out infinite both; }
        .battery-preview .btp-zap { animation: battery-zap ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        .battery-preview .btp-plug { animation: battery-plug ${LOOP}s cubic-bezier(.3,1.3,.4,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .battery-preview .btp-root, .battery-preview .btp-fill, .battery-preview .btp-low, .battery-preview .btp-zap, .battery-preview .btp-plug { animation: none; }
          .battery-preview .btp-root { --btv: 72; }
          .battery-preview .btp-fill { background-color: var(--lime); }
          .battery-preview .btp-low, .battery-preview .btp-zap { opacity: 0; }
        }
      `}
    >
      <div className="btp-root absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-4">
        {/* The plug slides in from the left. */}
        <span className="btp-plug flex items-center">
          <span className="h-[3px] w-8 bg-ink" />
          <span className="h-7 w-5 rounded-[3px] border-[3px] border-ink bg-paper-raised shadow-[2px_2px_0_var(--ink)]" />
          <span className="flex flex-col gap-1.5">
            <span className="h-[3px] w-2 bg-ink" />
            <span className="h-[3px] w-2 bg-ink" />
          </span>
        </span>
        <span className="relative inline-flex -rotate-2 items-center">
          <span className="relative block h-14 w-28 overflow-hidden rounded-[10px_5px_12px_5px/5px_12px_5px_10px] border-[3px] border-ink bg-paper-sunken p-1 shadow-[4px_4px_0_var(--ink)]" style={DOTS}>
            <span
              className="btp-fill block h-full rounded-[4px] bg-lime"
              style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.4) 0 4px, transparent 4px 8px)", backgroundSize: "11.3px 11.3px" }}
            />
          </span>
          <span className="block h-6 w-3 rounded-r-[4px] border-[3px] border-l-0 border-ink bg-ink" />
          <span className="btp-low absolute -top-11 -right-3">
            <ComicBadge shape="splat" tone="pink" size="sm" tilt={0}>
              Low!
            </ComicBadge>
          </span>
          <span className="btp-zap absolute -top-11 -right-3">
            <ComicBadge shape="burst" tone="orange" size="sm" tilt={0}>
              Zap!
            </ComicBadge>
          </span>
        </span>
        <span className="btp-num ml-1 w-16 font-mono text-xl font-bold tabular-nums" />
      </div>
    </Stage>
  );
}

/** The Comic card inside Batteries. */
export function ComicBatteryPreview() {
  return (
    <div className="flex items-center gap-10 pt-5">
      <ComicBattery value={72} charging />
      <ComicBattery value={12} />
    </div>
  );
}

/* ---------- Skeletons ---------- */

/** A comic panel loads: halftone placeholders drift, then the real content pops in with TA-DA! */
export function SkeletonsPreview() {
  return (
    <Stage
      name="skeletons-preview"
      css={`
        @keyframes skeletons-out { 0%, 48% { opacity: 1; } 52%, 92% { opacity: 0; } 96%, 100% { opacity: 1; } }
        @keyframes skeletons-in {
          0%, 48% { opacity: 0; transform: scale(.85) rotate(-2deg); }
          53% { opacity: 1; transform: scale(1.04) rotate(.5deg); }
          56%, 90% { opacity: 1; transform: none; }
          94%, 100% { opacity: 0; }
        }
        @keyframes skeletons-tada {
          0%, 52% { opacity: 0; transform: scale(0) rotate(-40deg); }
          57% { opacity: 1; transform: scale(1.25) rotate(14deg); }
          61%, 86% { opacity: 1; transform: scale(1) rotate(10deg); }
          92%, 100% { opacity: 0; transform: scale(0); }
        }
        .skeletons-preview .skp-out { animation: skeletons-out ${LOOP}s linear infinite; }
        .skeletons-preview .skp-in { animation: skeletons-in ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        .skeletons-preview .skp-tada { animation: skeletons-tada ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .skeletons-preview .skp-out, .skeletons-preview .skp-in, .skeletons-preview .skp-tada { animation: none; }
          .skeletons-preview .skp-in, .skeletons-preview .skp-tada { opacity: 0; }
        }
      `}
    >
      <div className="absolute top-1/2 left-1/2 h-32 w-64 -translate-1/2 -rotate-1 border-[3px] border-ink bg-paper-raised p-3.5 shadow-[5px_5px_0_var(--ink)]">
        <div className="skp-out absolute inset-3.5 flex gap-3">
          <ComicSkeleton className="size-14 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2.5 pt-1">
            <ComicSkeleton className="h-4 w-3/4" />
            <ComicSkeleton className="h-3 w-full" />
            <ComicSkeleton className="h-3 w-2/3" />
            <ComicSkeleton className="mt-1 h-6 w-20" />
          </div>
        </div>
        <div className="skp-in absolute inset-3.5 flex gap-3 opacity-0">
          <ComicAvatar initials="CB" shape="burst" tone="pink" size="sm" className="mt-1" />
          <div className="flex flex-1 flex-col gap-1">
            <p className="font-bold">Captain Brutal</p>
            <p className="text-xs leading-snug text-ink-muted">Saves the day with hard shadows and thick ink.</p>
            <span className="mt-1 w-fit border-[3px] border-ink bg-lime px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]">
              Follow
            </span>
          </div>
        </div>
      </div>
      <span className="skp-tada absolute top-[2%] right-[8%]">
        <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
          Ta-da!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/* ---------- Avatars ---------- */

const CREW = [
  { initials: "AL", tone: "lime", shape: "blob", rot: -8, at: 0.2 },
  { initials: "GH", tone: "pink", shape: "burst", rot: 6, at: 0.55 },
  { initials: "KJ", tone: "blue", shape: "seal", rot: -4, at: 0.9 },
  { initials: "MH", tone: "violet", shape: "blob", rot: 8, at: 1.25 },
  { initials: "+6", tone: "paper", shape: "splat", rot: -6, at: 1.6 },
] as const;

/** Avatar stickers slap onto the page one by one, bounce in a wave, and peel off again. */
export function AvatarsPreview() {
  return (
    <Stage
      name="avatars-preview"
      css={`
        @keyframes avatars-slap {
          0% { opacity: 0; transform: translateY(-60px) scale(1.6) rotate(calc(var(--rot) * -3)); }
          4% { opacity: 1; transform: translateY(4px) scale(.92) rotate(var(--rot)); }
          7%, 66% { opacity: 1; transform: translateY(0) scale(1) rotate(var(--rot)); }
          74%, 100% { opacity: 0; transform: translateY(30px) scale(.7) rotate(calc(var(--rot) * 4)); }
        }
        @keyframes avatars-wave { 0%, 38%, 50%, 100% { translate: 0 0; } 44% { translate: 0 -12px; } }
        .avatars-preview .avp-slap { animation: avatars-slap ${LOOP}s cubic-bezier(.2,.9,.3,1.2) var(--at) infinite both; }
        .avatars-preview .avp-wave { animation: avatars-wave ${LOOP}s ease-in-out var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .avatars-preview .avp-slap, .avatars-preview .avp-wave { animation: none; }
          .avatars-preview .avp-slap { transform: rotate(var(--rot)); }
        }
      `}
    >
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center">
        {CREW.map((c, i) => (
          <span
            key={c.initials}
            className={`avp-slap block ${i ? "-ml-3" : ""}`}
            style={{ "--at": `${c.at}s`, "--rot": `${c.rot}deg`, zIndex: CREW.length - i, transform: `rotate(${c.rot}deg)` } as CSSProperties}
          >
            <span className="avp-wave block" style={{ "--at": `${c.at * 0.5}s` } as CSSProperties}>
              <ComicAvatar initials={c.initials} tone={c.tone} shape={c.shape} size="lg" />
            </span>
          </span>
        ))}
      </div>
    </Stage>
  );
}
