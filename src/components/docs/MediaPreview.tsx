/**
 * The animated tiles on /components for Audio Players, Track Lists,
 * Equalizers, and Animated Icons, and the compact comic specimens for their
 * Comic cards. Each tile is a 6s CSS loop of decorative, inert markup, still
 * for reduced motion.
 */
import type { CSSProperties } from "react";
import { Bell, Disc3, Heart, Pause, Rocket, SkipForward, Star } from "lucide-react";
import { ComicAnimatedIcon, ComicBadge, ComicEqualizer, ComicTrackList, Cube, Equalizer } from "@streamuilib/react";
import { BURST, comicBox, Cursor, DOTS, LOOP, pct, Stage } from "./tile";

const sticker =
  "border-[3px] border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase shadow-[2px_2px_0_var(--ink)]";

/* ---------- Audio players ---------- */

/** The comic player in full swing: disc spinning, seek racing, meter bouncing, and the play burst popping LA LA! when clicked. */
export function AudioPlayersPreview() {
  return (
    <Stage
      name="players-preview"
      css={`
        @keyframes players-seek { from { width: 4%; } to { width: 100%; } }
        @keyframes players-disc { to { rotate: 360deg; } }
        @keyframes players-cursor {
          0% { left: 96%; top: 96%; transform: scale(1); }
          ${pct(0.7)}, ${pct(0.86)} { left: 73%; top: 64%; transform: scale(1); }
          ${pct(0.95)} { left: 73%; top: 64%; transform: scale(.8); }
          ${pct(1.1)}, ${pct(3.4)} { left: 73%; top: 64%; transform: scale(1); }
          ${pct(3.5)} { left: 73%; top: 64%; transform: scale(.8); }
          ${pct(3.65)} { left: 73%; top: 64%; transform: scale(1); }
          100% { left: 96%; top: 96%; }
        }
        @keyframes players-press { 0%, 15%, 19%, 57%, 61%, 100% { scale: 1; } 16%, 58% { scale: .85; } 17.5%, 59.5% { scale: 1.12; } }
        @keyframes players-pop {
          0% { opacity: 0; transform: scale(.3) rotate(-25deg); }
          4% { opacity: 1; transform: translateY(-6px) scale(1.2) rotate(8deg); }
          8% { transform: translateY(-8px) scale(1) rotate(5deg); }
          20% { opacity: 1; transform: translateY(-14px) rotate(5deg); }
          26%, 100% { opacity: 0; transform: translateY(-20px) rotate(5deg); }
        }
        .players-preview .plp-seek { animation: players-seek ${LOOP}s linear infinite; }
        .players-preview .plp-disc { animation: players-disc 2.4s linear infinite; }
        .players-preview .plp-cursor { animation: players-cursor ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; }
        .players-preview .plp-play { animation: players-press ${LOOP}s ease-out infinite; }
        .players-preview .plp-pop { animation: players-pop ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .players-preview .plp-seek, .players-preview .plp-disc, .players-preview .plp-cursor, .players-preview .plp-play, .players-preview .plp-pop { animation: none; }
          .players-preview .plp-seek { width: 40%; }
          .players-preview .plp-pop { opacity: 0; }
        }
      `}
    >
      <div className={`absolute inset-x-[5%] top-1/2 -translate-y-1/2 -rotate-1 ${comicBox} shadow-[5px_5px_0_var(--ink)]`}>
        <div className="flex items-center gap-3 border-b-[3px] border-ink p-3" style={DOTS}>
          <span className="grid size-14 shrink-0 -rotate-3 place-items-center border-[3px] border-ink bg-pink text-on-bright shadow-[3px_3px_0_var(--ink)]">
            <Disc3 className="plp-disc size-7" strokeWidth={2} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate font-mono text-sm font-bold uppercase">Offset Shadow</p>
            <ComicEqualizer bars={6} className="h-6 w-fit" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-3">
          <div className="h-3.5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-paper-sunken">
            <div className="plp-seek h-full border-r-[3px] border-ink bg-pink" style={{ width: "40%" }} />
          </div>
          <span className="plp-play relative grid size-12 shrink-0 place-items-center text-on-bright">
            <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]">
              <path d={BURST} fill="var(--lime)" stroke="var(--ink)" strokeWidth={6} strokeLinejoin="round" />
            </svg>
            <Pause className="relative size-5" strokeWidth={3} />
          </span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper-raised shadow-[2px_2px_0_var(--ink)]">
            <SkipForward className="size-4" strokeWidth={3} />
          </span>
        </div>
      </div>
      {[
        { word: "La la!", at: 0.95 },
        { word: "Shh!", at: 3.5 },
      ].map((p) => (
        <span
          key={p.word}
          className={`plp-pop absolute top-[6%] right-[14%] z-20 bg-paper-raised opacity-0 ${sticker}`}
          style={{ "--at": `${p.at}s` } as CSSProperties}
        >
          {p.word}
        </span>
      ))}
      <Cursor className="plp-cursor" style={{ left: "96%", top: "96%" }} />
    </Stage>
  );
}

/** The Comic card inside Audio Players: a still of the player's top half. */
export function ComicAudioPlayerPreview() {
  return (
    <div aria-hidden className={`flex w-72 items-center gap-3 p-3 ${comicBox} shadow-[5px_5px_0_var(--ink)]`} style={DOTS}>
      <span className="grid size-14 shrink-0 -rotate-3 place-items-center border-[3px] border-ink bg-lime text-on-bright shadow-[3px_3px_0_var(--ink)]">
        <Disc3 className="size-7" strokeWidth={2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-mono text-sm font-bold uppercase">Hard Edges</p>
        <ComicEqualizer bars={6} className="h-6 w-fit" />
      </div>
      <span className="relative grid size-12 shrink-0 place-items-center text-on-bright">
        <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]">
          <path d={BURST} fill="var(--pink)" stroke="var(--ink)" strokeWidth={6} strokeLinejoin="round" />
        </svg>
        <Pause className="relative size-5" strokeWidth={3} />
      </span>
    </div>
  );
}

/* ---------- Track lists ---------- */

const SONGS = ["Hard Edges", "Offset Shadow", "Thick Ink"];

/** The current track hops down the comic playlist: halftone, meter, and a NOW! sticker slamming on each. */
export function TrackListsPreview() {
  const third = LOOP / 3;
  return (
    <Stage
      name="tracks-preview"
      css={`
        @keyframes tracks-row { 0%, 33% { background-color: var(--lime-soft); } 33.4%, 100% { background-color: var(--paper-raised); } }
        @keyframes tracks-now {
          0% { opacity: 0; transform: scale(2.2) rotate(-10deg); }
          4% { opacity: 1; transform: scale(.9) rotate(8deg); }
          7%, 31% { opacity: 1; transform: scale(1) rotate(6deg); }
          33.3%, 100% { opacity: 0; transform: scale(1) rotate(6deg); }
        }
        @keyframes tracks-num { 0%, 33% { opacity: 0; } 33.4%, 100% { opacity: 1; } }
        @keyframes tracks-eq { 0%, 33% { opacity: 1; } 33.4%, 100% { opacity: 0; } }
        .tracks-preview .trp-row { animation: tracks-row ${LOOP}s steps(1) var(--at) infinite both; }
        .tracks-preview .trp-now { animation: tracks-now ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        .tracks-preview .trp-num { animation: tracks-num ${LOOP}s steps(1) var(--at) infinite both; }
        .tracks-preview .trp-eq { animation: tracks-eq ${LOOP}s steps(1) var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .tracks-preview .trp-row, .tracks-preview .trp-now, .tracks-preview .trp-num, .tracks-preview .trp-eq { animation: none; }
          .tracks-preview .trp-now, .tracks-preview .trp-eq { opacity: 0; }
          .tracks-preview [data-i="0"] .trp-now, .tracks-preview [data-i="0"] .trp-eq { opacity: 1; }
          .tracks-preview [data-i="0"] .trp-num { opacity: 0; }
          .tracks-preview [data-i="0"] { background-color: var(--lime-soft); }
        }
      `}
    >
      <ol className="absolute inset-x-[10%] top-1/2 -translate-y-1/2 rotate-1 divide-y-[3px] divide-dashed divide-ink border-[3px] border-ink bg-paper-raised shadow-[5px_5px_0_var(--ink)]">
        {SONGS.map((song, i) => {
          const at = { "--at": `${i * third - (i ? LOOP : 0)}s` } as CSSProperties;
          return (
            <li key={song} data-i={i} className="trp-row relative flex h-11 items-center gap-3 px-3" style={at}>
              <span className="relative grid w-8 place-items-center">
                <span className="trp-num font-mono text-sm font-bold" style={at}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="trp-eq absolute" style={at}>
                  <ComicEqualizer bars={3} notes={false} className="h-5 gap-0.5 [&>span]:w-1.5 [&>span]:border-2" />
                </span>
              </span>
              <span className="flex-1 truncate text-sm font-bold">{song}</span>
              <span className={`trp-now bg-pink text-on-bright opacity-0 ${sticker}`} style={at}>
                Now!
              </span>
              <span className="font-mono text-xs text-ink-muted">0:2{i + 1}</span>
            </li>
          );
        })}
      </ol>
    </Stage>
  );
}

/** The Comic card inside Track Lists. */
export function ComicTrackListPreview() {
  return (
    <ComicTrackList
      className="w-72 border-[3px] border-ink shadow-[4px_4px_0_var(--ink)]"
      index={0}
      playing
      tracks={[
        { title: "Hard Edges", artist: "stream/ui demo", src: "", duration: 23, tone: "lime" },
        { title: "Offset Shadow", artist: "stream/ui demo", src: "", duration: 20, tone: "pink" },
      ]}
    />
  );
}

/* ---------- Equalizers ---------- */

/** A big comic meter pumps away, notes floating up, and BOOM! hits on the beat. */
export function EqualizersPreview() {
  return (
    <Stage
      name="eqs-preview"
      css={`
        @keyframes eqs-boom {
          0% { opacity: 0; transform: scale(.3) rotate(-30deg); }
          6% { opacity: 1; transform: scale(1.2) rotate(10deg); }
          12%, 30% { opacity: 1; transform: scale(1) rotate(6deg); }
          38%, 100% { opacity: 0; transform: scale(.6) rotate(6deg); }
        }
        .eqs-preview .eqp-boom { animation: eqs-boom ${LOOP / 2}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .eqs-preview .eqp-boom { animation: none; opacity: 0; }
        }
      `}
    >
      <div className="absolute top-[56%] left-1/2 flex -translate-1/2 items-end gap-8">
        <ComicEqualizer bars={8} className="h-24 gap-1.5 [&>.sui-eq-bar]:w-4" />
        <Equalizer bars={4} className="h-10" tone="pink" />
      </div>
      <span className="eqp-boom absolute top-[4%] left-[8%]" style={{ "--at": "0.2s" } as CSSProperties}>
        <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
          Boom!
        </ComicBadge>
      </span>
      <span className="eqp-boom absolute top-[6%] right-[8%]" style={{ "--at": "1.7s" } as CSSProperties}>
        <ComicBadge shape="splat" tone="pink" size="sm" tilt={0}>
          Tss!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/* ---------- Animated icons ---------- */

/** Four comic icon stickers on loops, each bursting impact lines as it moves. */
export function AnimatedIconsPreview() {
  return (
    <Stage name="icons-preview" css="">
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-11">
        <ComicAnimatedIcon animation="shake" trigger="loop" tone="lime" duration={1500}>
          <Bell aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <ComicAnimatedIcon animation="pop" trigger="loop" shape="seal" tone="pink" duration={1200}>
          <Heart aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <ComicAnimatedIcon animation="bounce" trigger="loop" shape="blob" tone="blue" duration={1000}>
          <Rocket aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <ComicAnimatedIcon animation="spin" trigger="loop" shape="splat" tone="orange" duration={2000}>
          <Star aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
      </div>
    </Stage>
  );
}

/* ---------- Cube ---------- */

/** The Cube card on /components: the three designs, turning slowly out of step. */
export function CubePreview() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-2">
      <Cube size="sm" spin="loop" />
      <Cube size="md" variant="lined" tone="pink" spin="loop" className="[&_.sui-cube-scene]:[animation-delay:-3s]" />
      <Cube size="sm" variant="beveled" tone="blue" spin="loop" className="[&_.sui-cube-scene]:[animation-delay:-6s]" />
    </div>
  );
}
