/**
 * The animated tiles on /components for Tabs, Accordions, Dialogs, and
 * Tooltips, and the compact comic specimens for their Comic cards. Each tile
 * is a 6s CSS loop of decorative, inert markup, still for reduced motion.
 */
import type { CSSProperties } from "react";
import { Bell, Settings, Share2, Zap } from "lucide-react";
import { Button, ComicAccordion, ComicBadge, ComicButton, ComicTabs } from "@streamuilib/react";
import { BURST, comicBox, Cursor, DOTS, LOOP, pct, sketchy, Stage } from "./tile";

const caption =
  "border-[3px] border-ink bg-lime px-2.5 py-1 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[3px_3px_0_var(--ink)]";

/* ---------- Tabs ---------- */

const TABS = [
  { label: "Origin", left: "6%", rot: -2, text: "Fell into a vat of hard shadows.", sfx: "Splash!" },
  { label: "Powers", left: "31%", rot: 1.5, text: "Thick ink and a mighty POW!", sfx: "Pow!" },
  { label: "Nemesis", left: "57%", rot: -1, text: "Gradient Man. Blurs every edge.", sfx: "Boo!" },
];

/** A cursor clicks through three tilted tabs; each one stands up lime and its panel slams in. */
export function TabsPreview() {
  const third = LOOP / 3;
  const cursor = TABS.map((t, i) => {
    const at = i * third;
    const x = `calc(${t.left} + 2.6rem)`;
    return `${pct(Math.max(0, at - 0.5))} { left: ${x}; top: 18%; transform: scale(1); }
      ${pct(at + 0.02)} { left: ${x}; top: 18%; transform: scale(.8); }
      ${pct(at + 0.2)} { left: ${x}; top: 18%; transform: scale(1); }`;
  }).join("\n");
  return (
    <Stage
      name="tabs-preview"
      css={`
        @keyframes tabs-on {
          0% { background-color: var(--lime); color: var(--on-bright); rotate: 0deg; translate: 0 -4px; scale: .9; box-shadow: 3px 3px 0 var(--ink); }
          3% { scale: 1.1; }
          6%, 32% { background-color: var(--lime); color: var(--on-bright); rotate: 0deg; translate: 0 -4px; scale: 1; box-shadow: 3px 3px 0 var(--ink); }
          34%, 100% { background-color: var(--paper-sunken); color: var(--ink-muted); rotate: var(--rot); translate: 0 0; scale: 1; box-shadow: none; }
        }
        @keyframes tabs-panel {
          0% { opacity: 0; transform: scale(.85) rotate(-3deg); }
          4% { opacity: 1; transform: scale(1.04) rotate(.5deg); }
          7%, 31% { opacity: 1; transform: none; }
          33.3%, 100% { opacity: 0; transform: none; }
        }
        @keyframes tabs-cursor {
          ${cursor}
          ${pct(LOOP - 0.6)} { left: calc(${TABS[2].left} + 2.6rem); top: 18%; }
          100% { left: calc(${TABS[0].left} + 2.6rem); top: 18%; }
        }
        .tabs-preview .tbp-tab { animation: tabs-on ${LOOP}s ease-out var(--at) infinite both; }
        .tabs-preview .tbp-panel { animation: tabs-panel ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        .tabs-preview .tbp-cursor { animation: tabs-cursor ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tabs-preview .tbp-tab, .tabs-preview .tbp-panel, .tabs-preview .tbp-cursor { animation: none; }
          .tabs-preview .tbp-tab { rotate: var(--rot); }
          .tabs-preview .tbp-tab[data-i="0"] { background-color: var(--lime); rotate: 0deg; translate: 0 -4px; box-shadow: 3px 3px 0 var(--ink); }
          .tabs-preview .tbp-panel:not([data-i="0"]) { opacity: 0; }
        }
      `}
    >
      {TABS.map((t, i) => (
        <span
          key={t.label}
          data-i={i}
          className="tbp-tab absolute top-[8%] z-10 border-[3px] border-ink bg-paper-sunken px-3 py-1 font-mono text-xs font-bold tracking-wide uppercase"
          style={{ left: t.left, rotate: `${t.rot}deg`, "--rot": `${t.rot}deg`, "--at": `${i * third - (i ? LOOP : 0)}s` } as CSSProperties}
        >
          {t.label}
        </span>
      ))}
      <div className={`absolute inset-x-[4%] top-[27%] bottom-[6%] ${comicBox}`} style={DOTS}>
        {TABS.map((t, i) => (
          <div
            key={t.label}
            data-i={i}
            className="tbp-panel absolute inset-0 flex items-center gap-4 px-5"
            style={{ "--at": `${i * third - (i ? LOOP : 0)}s` } as CSSProperties}
          >
            <ComicBadge shape={i === 1 ? "burst" : i === 0 ? "splat" : "seal"} tone={i === 1 ? "pink" : i === 0 ? "blue" : "orange"} size="sm" tilt={-8}>
              {t.sfx}
            </ComicBadge>
            <p className="text-sm leading-snug font-semibold">{t.text}</p>
          </div>
        ))}
      </div>
      <Cursor className="tbp-cursor" style={{ left: `calc(${TABS[0].left} + 2.6rem)`, top: "18%" }} />
    </Stage>
  );
}

/** The Comic card inside Tabs. */
export function ComicTabsPreview() {
  return (
    <ComicTabs
      label="Episode"
      className="w-72"
      items={[
        { id: "origin", label: "Origin", content: <p className="text-sm">Fell into a vat of hard shadows.</p> },
        { id: "powers", label: "Powers", content: <p className="text-sm">Thick ink and a mighty POW!</p> },
      ]}
    />
  );
}

/* ---------- Accordions ---------- */

const QUESTIONS = [
  { q: "Is it free?", a: "Yes! MIT licensed.", rot: -0.8 },
  { q: "React 19?", a: "18 or 19, both work.", rot: 0.7 },
  { q: "Dark mode?", a: "Comics are printed on paper.", rot: -0.4 },
];

/** Three hand-inked rows open one after another, their starbursts spinning, answers popping in. */
export function AccordionsPreview() {
  const third = LOOP / 3;
  return (
    <Stage
      name="accordions-preview"
      css={`
        @keyframes accordions-open { 0% { height: 0; } 5%, 29% { height: 1.9rem; } 34%, 100% { height: 0; } }
        @keyframes accordions-text { 0%, 3% { opacity: 0; translate: 0 -4px; } 7%, 28% { opacity: 1; translate: 0 0; } 31%, 100% { opacity: 0; } }
        @keyframes accordions-burst { 0% { rotate: 0deg; fill: var(--paper-raised); } 5%, 29% { rotate: 135deg; fill: var(--pink); } 34%, 100% { rotate: 270deg; fill: var(--paper-raised); } }
        @keyframes accordions-row { 0%, 33% { background-color: var(--lime-soft); } 34%, 100% { background-color: var(--paper-raised); } }
        .accordions-preview .acp-body { animation: accordions-open ${LOOP}s cubic-bezier(.2,.9,.3,1.2) var(--at) infinite both; }
        .accordions-preview .acp-text { animation: accordions-text ${LOOP}s ease-out var(--at) infinite both; }
        .accordions-preview .acp-burst { animation: accordions-burst ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        .accordions-preview .acp-row { animation: accordions-row ${LOOP}s steps(1) var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .accordions-preview .acp-body, .accordions-preview .acp-text, .accordions-preview .acp-burst, .accordions-preview .acp-row { animation: none; }
          .accordions-preview .acp-body { height: 0; }
          .accordions-preview [data-i="0"] .acp-body { height: 1.9rem; }
        }
      `}
    >
      <div className="absolute inset-x-[10%] top-[4%] flex flex-col gap-2">
        {QUESTIONS.map((x, i) => {
          const at = { "--at": `${i * third - (i ? LOOP : 0)}s` } as CSSProperties;
          return (
            <div key={x.q} data-i={i} className={`acp-row overflow-hidden border-[3px] border-ink bg-paper-raised shadow-[3px_3px_0_var(--ink)] ${sketchy}`} style={{ rotate: `${x.rot}deg`, ...at }}>
              <div className="flex h-8 items-center justify-between px-3 text-sm font-bold">
                {x.q}
                <span className="relative grid size-7 place-items-center">
                  <svg viewBox="0 0 100 100" overflow="visible" className="acp-burst absolute inset-0 size-full" style={at}>
                    <path d={BURST} stroke="var(--ink)" strokeWidth={7} strokeLinejoin="round" />
                  </svg>
                  <span className="relative font-mono text-sm leading-none font-bold">+</span>
                </span>
              </div>
              <div className="acp-body h-0 overflow-hidden border-t-[3px] border-dashed border-ink" style={{ ...DOTS, ...at }}>
                <p className="acp-text px-3 py-1 text-sm" style={at}>
                  {x.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/** The Comic card inside Accordions. */
export function ComicAccordionPreview() {
  return (
    <ComicAccordion
      className="w-72 [&_summary]:py-2 [&_summary]:text-sm"
      defaultOpen={["free"]}
      items={[
        { id: "free", title: "Is it free?", content: <span className="text-sm">Yes! MIT licensed.</span> },
        { id: "react", title: "React 19?", content: <span className="text-sm">18 or 19, both work.</span> },
      ]}
    />
  );
}

/* ---------- Dialogs ---------- */

/** A cursor clicks Delete; a halftone backdrop drops, the comic panel slams in with GULP!, then Nope closes it. */
export function DialogsPreview() {
  return (
    <Stage
      name="dialogs-preview"
      css={`
        @keyframes dialogs-cursor {
          0% { left: 92%; top: 92%; transform: scale(1); }
          ${pct(0.6)} { left: 52%; top: 62%; transform: scale(1); }
          ${pct(0.72)} { left: 52%; top: 62%; transform: scale(.8); }
          ${pct(0.9)}, ${pct(3.6)} { left: 52%; top: 62%; transform: scale(1); }
          ${pct(4.3)} { left: 50%; top: 60%; transform: scale(1); }
          ${pct(4.42)} { left: 50%; top: 60%; transform: scale(.8); }
          ${pct(4.6)} { left: 50%; top: 60%; transform: scale(1); }
          100% { left: 92%; top: 92%; }
        }
        @keyframes dialogs-press { 0%, 11%, 15%, 100% { scale: 1; } 12.5% { scale: .9; } }
        @keyframes dialogs-backdrop { 0%, ${pct(0.75)} { opacity: 0; } ${pct(1)}, ${pct(4.5)} { opacity: 1; } ${pct(4.8)}, 100% { opacity: 0; } }
        @keyframes dialogs-panel {
          0%, ${pct(0.8)} { opacity: 0; transform: translate(-50%, -80%) scale(.6) rotate(-8deg); }
          ${pct(1.1)} { opacity: 1; transform: translate(-50%, -48%) scale(1.04) rotate(1deg); }
          ${pct(1.3)}, ${pct(4.45)} { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-1deg); }
          ${pct(4.75)}, 100% { opacity: 0; transform: translate(-50%, -40%) scale(.85) rotate(4deg); }
        }
        @keyframes dialogs-gulp {
          0%, ${pct(1.3)} { opacity: 0; transform: scale(0) rotate(-60deg); }
          ${pct(1.55)} { opacity: 1; transform: scale(1.25) rotate(14deg); }
          ${pct(1.75)}, ${pct(4.4)} { opacity: 1; transform: scale(1) rotate(10deg); }
          ${pct(4.6)}, 100% { opacity: 0; transform: scale(0); }
        }
        .dialogs-preview .dp-cursor { animation: dialogs-cursor ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; }
        .dialogs-preview .dp-trigger { animation: dialogs-press ${LOOP}s ease-out infinite; }
        .dialogs-preview .dp-backdrop { animation: dialogs-backdrop ${LOOP}s linear infinite both; }
        .dialogs-preview .dp-panel { animation: dialogs-panel ${LOOP}s cubic-bezier(.2,.9,.3,1.2) infinite both; }
        .dialogs-preview .dp-gulp { animation: dialogs-gulp ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .dialogs-preview .dp-cursor, .dialogs-preview .dp-trigger, .dialogs-preview .dp-backdrop, .dialogs-preview .dp-panel, .dialogs-preview .dp-gulp { animation: none; }
          .dialogs-preview .dp-panel { transform: translate(-50%, -50%) rotate(-1deg); }
          .dialogs-preview .dp-cursor { opacity: 0; }
        }
      `}
    >
      {/* The page behind: some lines and the trigger. */}
      <div className="absolute inset-x-[8%] top-[10%] flex flex-col gap-2 opacity-60">
        <span className="h-3 w-1/2 bg-ink" />
        <span className="h-2 w-3/4 bg-ink-faint" />
        <span className="h-2 w-2/3 bg-ink-faint" />
      </div>
      <div className="dp-trigger absolute top-[58%] left-1/2 -translate-1/2">
        <ComicButton tone="pink" size="sm" pop={false} tabIndex={-1}>
          Delete
        </ComicButton>
      </div>
      <div
        className="dp-backdrop absolute -inset-4"
        style={{
          backgroundColor: "color-mix(in oklab, var(--ink) 40%, transparent)",
          backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 55%, transparent) 1.4px, transparent 1.9px)",
          backgroundSize: "10px 10px",
        }}
      />
      <div className={`dp-panel absolute top-1/2 left-1/2 w-60 bg-paper-raised ${comicBox} shadow-[6px_6px_0_var(--ink)]`} style={{ transform: "translate(-50%, -50%)" }}>
        <span className={`absolute -top-3.5 -left-3 -rotate-3 ${caption}`}>Delete it?</span>
        <p className="px-4 pt-6 pb-2 text-sm leading-snug">This can&rsquo;t be undone.</p>
        <div className="flex justify-end gap-2 border-t-[3px] border-dashed border-ink px-3 py-2.5">
          <span className="border-[3px] border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs font-bold shadow-[2px_2px_0_var(--ink)]">Nope</span>
          <span className="border-[3px] border-ink bg-pink px-2 py-0.5 font-mono text-xs font-bold text-on-bright shadow-[2px_2px_0_var(--ink)]">Do it</span>
        </div>
        <span className="dp-gulp absolute -top-8 -right-7">
          <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
            Gulp!
          </ComicBadge>
        </span>
      </div>
      <Cursor className="dp-cursor" style={{ left: "92%", top: "92%" }} />
    </Stage>
  );
}

/** The Comic card inside Dialogs: a still of the open panel. */
export function ComicDialogPreview() {
  return (
    <div aria-hidden className="relative pt-3">
      <div className={`relative w-64 bg-paper-raised ${comicBox} shadow-[6px_6px_0_var(--ink)]`}>
        <span className={`absolute -top-3.5 -left-3 -rotate-3 ${caption}`}>Delete this project?</span>
        <p className="px-4 pt-6 pb-3 text-sm leading-snug text-ink-muted">This removes all deployments.</p>
        <div className="flex justify-end gap-2 border-t-[3px] border-dashed border-ink px-3 py-2.5">
          <span className="border-[3px] border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs font-bold shadow-[2px_2px_0_var(--ink)]">Cancel</span>
          <span className="border-[3px] border-ink bg-pink px-2 py-0.5 font-mono text-xs font-bold text-on-bright shadow-[2px_2px_0_var(--ink)]">Delete</span>
        </div>
        <span className="absolute -top-8 -right-7">
          <ComicBadge shape="burst" tone="lime" size="sm" tilt={10}>
            Gulp!
          </ComicBadge>
        </span>
      </div>
    </div>
  );
}

/* ---------- Tooltips ---------- */

const TIPS = [
  { Icon: Bell, tip: "Ding!", left: "25%", at: 0.4, fill: "var(--paper-raised)" },
  { Icon: Share2, tip: "Share it!", left: "50%", at: 2.3, fill: "var(--lime)" },
  { Icon: Settings, tip: "Tweak!", left: "75%", at: 4.2, fill: "var(--pink)" },
];

/** A cursor hovers three icon buttons; a speech bubble pops over each in turn. */
export function TooltipsPreview() {
  const cursor = TIPS.map(
    (t) => `${pct(Math.max(0, t.at - 0.35))}, ${pct(t.at + 1.3)} { left: calc(${t.left} + 4px); top: 66%; }`,
  ).join("\n");
  return (
    <Stage
      name="tooltips-preview"
      css={`
        @keyframes tooltips-cursor { 0% { left: 6%; top: 92%; } ${cursor} 100% { left: 6%; top: 92%; } }
        @keyframes tooltips-tip {
          0% { opacity: 0; scale: .3; rotate: -12deg; }
          4% { opacity: 1; scale: 1.15; rotate: 4deg; }
          7%, 22% { opacity: 1; scale: 1; rotate: 0deg; }
          25%, 100% { opacity: 0; scale: .6; }
        }
        @keyframes tooltips-lift { 0%, 25%, 100% { translate: 0 0; } 2%, 22% { translate: -2px -2px; } }
        .tooltips-preview .ttp-cursor { animation: tooltips-cursor ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; }
        .tooltips-preview .ttp-tip { animation: tooltips-tip ${LOOP}s cubic-bezier(.2,.9,.3,1.4) var(--at) infinite both; transform-origin: 50% 100%; }
        .tooltips-preview .ttp-btn { animation: tooltips-lift ${LOOP}s ease-out var(--at) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tooltips-preview .ttp-cursor, .tooltips-preview .ttp-tip, .tooltips-preview .ttp-btn { animation: none; }
          .tooltips-preview .ttp-tip:not([data-i="1"]) { opacity: 0; }
          .tooltips-preview .ttp-cursor { left: calc(50% + 4px); top: 66%; }
        }
      `}
    >
      {TIPS.map((t, i) => {
        const at = { "--at": `${t.at}s` } as CSSProperties;
        return (
          <div key={t.tip}>
            <div className="ttp-btn absolute top-[62%] -translate-1/2" style={{ left: t.left, ...at }}>
              <Button size="icon" variant="secondary" tabIndex={-1} aria-label={t.tip}>
                <t.Icon aria-hidden />
              </Button>
            </div>
            <span
              data-i={i}
              className="ttp-tip absolute top-[25%] -translate-x-1/2 rounded-xl border-[3px] border-ink px-3 py-1 text-sm font-bold whitespace-nowrap opacity-0 shadow-[3px_3px_0_var(--ink)]"
              style={{ left: t.left, backgroundColor: t.fill, ...at }}
            >
              {t.tip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[9px] border-t-[12px] border-x-transparent border-t-ink" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent" style={{ borderTopColor: t.fill }} />
            </span>
          </div>
        );
      })}
      <Cursor className="ttp-cursor" style={{ left: "6%", top: "92%" }} />
    </Stage>
  );
}

/** The Comic card inside Tooltips: a still of an open bubble. */
export function ComicTooltipPreview() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-4">
      <span className="relative rounded-xl border-[3px] border-ink bg-lime px-3 py-1.5 text-sm font-bold text-on-bright shadow-[3px_3px_0_var(--ink)]">
        Share the love!
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[9px] border-t-[12px] border-x-transparent border-t-ink" />
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-lime" />
      </span>
      <Button size="icon" variant="secondary" tabIndex={-1}>
        <Zap aria-hidden />
      </Button>
    </div>
  );
}
