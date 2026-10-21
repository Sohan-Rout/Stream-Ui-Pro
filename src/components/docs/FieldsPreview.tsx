/**
 * The animated tiles on /components for the form-field categories (Inputs,
 * Textareas, Selects, Checkboxes, Radio Groups, Switches, Sliders), and the
 * compact comic specimens for their Comic cards. Each tile is a 6s CSS loop
 * of decorative, inert markup, with a still frame for reduced motion.
 */
import type { CSSProperties } from "react";
import {
  ComicBadge,
  ComicCheckbox,
  ComicInput,
  ComicRadio,
  ComicRadioGroup,
  ComicSelect,
  ComicSwitch,
  ComicTextarea,
  Input,
  Select,
  Slider,
  Textarea,
} from "@streamuilib/react";
import { BURST, Burst, comicBox, DOTS, LOOP, Stage } from "./tile";

/* ---------- Inputs ---------- */

/** A classic field sits filled in; the comic one types a hero name, then a NICE! burst slaps on. */
export function InputsPreview() {
  return (
    <Stage
      name="inputs-preview"
      css={`
        @keyframes inputs-type { 0%, 8% { width: 0; } 45%, 88% { width: 14ch; } 96%, 100% { width: 0; } }
        @keyframes inputs-caret { 50% { opacity: 0; } }
        @keyframes inputs-lift {
          0%, 6%, 92%, 100% { translate: 0 0; box-shadow: 4px 4px 0 var(--ink); }
          10%, 88% { translate: -2px -2px; box-shadow: 6px 6px 0 var(--ink); }
        }
        @keyframes inputs-nice {
          0%, 48% { opacity: 0; transform: scale(0) rotate(-40deg); }
          53% { opacity: 1; transform: scale(1.3) rotate(14deg); }
          57%, 84% { opacity: 1; transform: scale(1) rotate(10deg); }
          90%, 100% { opacity: 0; transform: scale(0) rotate(40deg); }
        }
        .inputs-preview .ip-type { animation: inputs-type ${LOOP}s steps(14) infinite; }
        .inputs-preview .ip-caret { animation: inputs-caret .7s steps(1) infinite; }
        .inputs-preview .ip-field { animation: inputs-lift ${LOOP}s ease-out infinite; }
        .inputs-preview .ip-nice { animation: inputs-nice ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .inputs-preview .ip-type, .inputs-preview .ip-caret, .inputs-preview .ip-field, .inputs-preview .ip-nice { animation: none; }
          .inputs-preview .ip-type { width: 14ch; }
        }
      `}
    >
      <div className="absolute inset-x-[8%] top-[10%] -rotate-1">
        <Input readOnly tabIndex={-1} defaultValue="you@example.com" aria-label="Email" />
      </div>
      <div className={`ip-field absolute inset-x-[8%] top-[52%] flex h-12 items-center px-3 font-semibold ${comicBox}`} style={DOTS}>
        <span className="ip-type inline-block overflow-hidden whitespace-nowrap" style={{ width: "14ch" }}>
          Captain Brutal
        </span>
        <span className="ip-caret ml-0.5 inline-block h-6 w-[3px] bg-ink" />
      </div>
      <span className="ip-nice absolute top-[30%] right-[3%] z-10">
        <ComicBadge shape="burst" tone="pink" size="sm" tilt={0}>
          Nice!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/** The Comic card inside Inputs. */
export function ComicInputPreview() {
  return (
    <label className="flex w-64 flex-col gap-2">
      <span className="font-bold">Hero name</span>
      <ComicInput placeholder="Captain Brutal" />
    </label>
  );
}

/* ---------- Textareas ---------- */

const LINES = ["Dear villain,", "please stop", "stealing our cat."];

/** A speech bubble writes itself a line at a time, then a BLAH! bubble pops back. */
export function TextareasPreview() {
  return (
    <Stage
      name="textareas-preview"
      css={`
        @keyframes textareas-line { 0% { width: 0; } 14%, 80% { width: var(--w); } 88%, 100% { width: 0; } }
        @keyframes textareas-blah {
          0%, 58% { opacity: 0; transform: scale(0) translateY(10px); }
          63% { opacity: 1; transform: scale(1.2) translateY(0); }
          67%, 82% { opacity: 1; transform: scale(1); }
          88%, 100% { opacity: 0; transform: scale(0); }
        }
        @keyframes textareas-wobble { 0%, 100% { rotate: -1.5deg; } 50% { rotate: 1deg; } }
        .textareas-preview .tp-line { animation: textareas-line ${LOOP}s steps(16) var(--at) infinite both; }
        .textareas-preview .tp-blah { animation: textareas-blah ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        .textareas-preview .tp-bubble { animation: textareas-wobble 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .textareas-preview .tp-line, .textareas-preview .tp-blah, .textareas-preview .tp-bubble { animation: none; }
          .textareas-preview .tp-line { width: var(--w); }
        }
      `}
    >
      <div className="tp-bubble absolute top-[6%] left-[4%] w-[62%] pb-4">
        <div className={`h-28 px-3.5 py-2.5 font-medium leading-snug ${comicBox}`} style={DOTS}>
          {LINES.map((l, i) => (
            <span
              key={l}
              className="tp-line block overflow-hidden whitespace-nowrap"
              style={{ "--w": `${l.length}ch`, "--at": `${i * 0.75}s`, width: `${l.length}ch` } as CSSProperties}
            >
              {l}
            </span>
          ))}
        </div>
        <span className="absolute bottom-[1px] left-7 block size-0 border-t-[18px] border-r-[18px] border-t-ink border-r-transparent" />
        <span className="absolute bottom-[7px] left-[31.5px] block size-0 border-t-[11px] border-r-[11px] border-t-paper-raised border-r-transparent" />
      </div>
      <div className="absolute right-[4%] bottom-[8%] w-[34%] rotate-2">
        <Textarea readOnly tabIndex={-1} rows={2} defaultValue="Classic reply." aria-label="Reply" className="text-sm" />
      </div>
      <span className="tp-blah absolute top-[2%] right-[6%] origin-bottom-left">
        <ComicBadge shape="bubble" tone="lime" size="md" tilt={-4}>
          Blah!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/** The Comic card inside Textareas. */
export function ComicTextareaPreview() {
  return (
    <label className="flex w-72 flex-col gap-2">
      <span className="font-bold">Say something!</span>
      <ComicTextarea rows={2} placeholder="What should we build next?" />
    </label>
  );
}

/* ---------- Selects ---------- */

const POWERS = ["Flight", "Speed", "Strength"];

/** The comic select drops open, the highlight runs down the list, it picks Speed, and PICKED! pops. */
export function SelectsPreview() {
  return (
    <Stage
      name="selects-preview"
      css={`
        @keyframes selects-list {
          0%, 12% { opacity: 0; transform: translateY(-8px) scaleY(.4); }
          17%, 56% { opacity: 1; transform: translateY(0) scaleY(1); }
          61%, 100% { opacity: 0; transform: translateY(-8px) scaleY(.4); }
        }
        @keyframes selects-hl { 0%, 24% { top: 0; } 32%, 100% { top: 33.33%; } }
        @keyframes selects-a { 0%, 58% { opacity: 1; } 60%, 94% { opacity: 0; } 97%, 100% { opacity: 1; } }
        @keyframes selects-b { 0%, 58% { opacity: 0; } 60%, 94% { opacity: 1; } 97%, 100% { opacity: 0; } }
        @keyframes selects-arrow { 0%, 10% { rotate: 0deg; } 16%, 56% { rotate: 180deg; } 62%, 100% { rotate: 360deg; } }
        @keyframes selects-pop {
          0%, 60% { opacity: 0; transform: scale(0) rotate(-30deg); }
          65% { opacity: 1; transform: scale(1.25) rotate(10deg); }
          69%, 88% { opacity: 1; transform: scale(1) rotate(6deg); }
          94%, 100% { opacity: 0; transform: scale(0); }
        }
        .selects-preview .sp-list { animation: selects-list ${LOOP}s cubic-bezier(.2,.9,.3,1.2) infinite both; transform-origin: top; }
        .selects-preview .sp-hl { animation: selects-hl ${LOOP}s cubic-bezier(.5,0,.3,1.4) infinite; }
        .selects-preview .sp-a { animation: selects-a ${LOOP}s linear infinite; }
        .selects-preview .sp-b { animation: selects-b ${LOOP}s linear infinite; }
        .selects-preview .sp-arrow { animation: selects-arrow ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite; }
        .selects-preview .sp-pop { animation: selects-pop ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .selects-preview .sp-list, .selects-preview .sp-hl, .selects-preview .sp-a, .selects-preview .sp-b, .selects-preview .sp-arrow, .selects-preview .sp-pop { animation: none; }
          .selects-preview .sp-list, .selects-preview .sp-a, .selects-preview .sp-pop { opacity: 0; }
        }
      `}
    >
      <div className="absolute top-[8%] left-[4%] w-[40%] rotate-1">
        <Select tabIndex={-1} aria-label="Plan" defaultValue="pro">
          <option value="pro">Pro</option>
        </Select>
      </div>
      <div className="absolute top-[8%] left-[50%] w-[46%]">
        <div className={`relative flex h-11 items-center pl-3 font-semibold ${comicBox}`} style={DOTS}>
          <span className="sp-a absolute">Flight</span>
          <span className="sp-b absolute opacity-0">Speed</span>
          <span className="absolute right-1.5 grid size-8 place-items-center">
            <Burst className="sp-arrow absolute inset-0 size-full fill-lime" />
            <svg viewBox="0 0 24 24" className="relative size-4 text-on-bright" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sp-list relative mt-2 h-[5.5rem] overflow-hidden ${comicBox}`}>
          <span className="sp-hl absolute inset-x-0 h-1/3 border-y-[3px] border-ink bg-pink" style={DOTS} />
          {POWERS.map((p) => (
            <span key={p} className="relative flex h-1/3 items-center px-3 text-sm font-bold">
              {p}
            </span>
          ))}
        </div>
      </div>
      <span className="sp-pop absolute top-[48%] left-[12%]">
        <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
          Picked!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/** The Comic card inside Selects. */
export function ComicSelectPreview() {
  return (
    <label className="flex w-60 flex-col gap-2">
      <span className="font-bold">Pick a power</span>
      <ComicSelect defaultValue="flight">
        <option value="flight">Flight</option>
        <option value="speed">Speed</option>
      </ComicSelect>
    </label>
  );
}

/* ---------- Checkboxes ---------- */

const TODOS = [
  { text: "Iron the cape", at: 0.5 },
  { text: "Rescue the cat", at: 1.4 },
  { text: "Foil the villain", at: 2.3 },
];

/** A to-do list ticks itself off: each mark draws in with a burst flash, then DONE! slams on. */
export function CheckboxesPreview() {
  return (
    <Stage
      name="checkboxes-preview"
      css={`
        @keyframes checkboxes-mark { 0% { stroke-dashoffset: 1; } 5%, 76% { stroke-dashoffset: 0; } 82%, 100% { stroke-dashoffset: 1; } }
        @keyframes checkboxes-box {
          0% { background-color: var(--paper-raised); scale: 1; }
          2% { scale: 1.25; }
          5%, 76% { background-color: var(--lime); scale: 1; }
          82%, 100% { background-color: var(--paper-raised); }
        }
        @keyframes checkboxes-flash {
          0% { opacity: 0; transform: scale(.3) rotate(-30deg); }
          3% { opacity: 1; transform: scale(1.05); }
          10%, 100% { opacity: 0; transform: scale(1.35) rotate(20deg); }
        }
        @keyframes checkboxes-strike { 0% { width: 0; } 7%, 76% { width: 100%; } 82%, 100% { width: 0; } }
        @keyframes checkboxes-done {
          0%, 52% { opacity: 0; transform: scale(2.4) rotate(-20deg); }
          56% { opacity: 1; transform: scale(.9) rotate(12deg); }
          59%, 84% { opacity: 1; transform: scale(1) rotate(10deg); }
          90%, 100% { opacity: 0; transform: scale(.6) rotate(10deg); }
        }
        .checkboxes-preview .cbp-mark { animation: checkboxes-mark ${LOOP}s ease-out var(--at) infinite both; }
        .checkboxes-preview .cbp-box { animation: checkboxes-box ${LOOP}s ease-out var(--at) infinite both; }
        .checkboxes-preview .cbp-flash { animation: checkboxes-flash ${LOOP}s ease-out var(--at) infinite both; }
        .checkboxes-preview .cbp-strike { animation: checkboxes-strike ${LOOP}s ease-out var(--at) infinite both; }
        .checkboxes-preview .cbp-done { animation: checkboxes-done ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .checkboxes-preview .cbp-mark, .checkboxes-preview .cbp-box, .checkboxes-preview .cbp-flash, .checkboxes-preview .cbp-strike, .checkboxes-preview .cbp-done { animation: none; }
          .checkboxes-preview .cbp-mark { stroke-dashoffset: 0; }
          .checkboxes-preview .cbp-box { background-color: var(--lime); }
          .checkboxes-preview .cbp-flash { opacity: 0; }
          .checkboxes-preview .cbp-strike { width: 100%; }
        }
      `}
    >
      <div className="absolute top-1/2 left-[10%] flex -translate-y-1/2 flex-col gap-4">
        {TODOS.map((t) => {
          const at = { "--at": `${t.at}s` } as CSSProperties;
          return (
            <div key={t.text} className="flex items-center gap-3">
              <span className="cbp-box relative grid size-7 shrink-0 -rotate-3 place-items-center rounded-[7px_3px_8px_3px/3px_8px_3px_7px] border-[3px] border-ink bg-paper-raised shadow-[3px_3px_0_var(--ink)]" style={at}>
                <Burst className="cbp-flash absolute -inset-3 -z-10 size-[calc(100%+1.5rem)] fill-pink opacity-0" style={at} />
                <svg viewBox="0 0 24 24" className="size-5 overflow-visible">
                  <path className="cbp-mark" d="M4 13 L10 18 L21 4" pathLength={1} strokeDasharray={1} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={at} />
                </svg>
              </span>
              <span className="relative font-bold">
                {t.text}
                <span className="cbp-strike absolute top-1/2 left-0 h-[3px] bg-ink" style={at} />
              </span>
            </div>
          );
        })}
      </div>
      <span className="cbp-done absolute top-[18%] right-[6%]">
        <ComicBadge shape="seal" tone="orange" size="md" tilt={0}>
          Done!
        </ComicBadge>
      </span>
    </Stage>
  );
}

/** The Comic card inside Checkboxes. */
export function ComicCheckboxPreview() {
  return (
    <div className="flex flex-col gap-3">
      <ComicCheckbox label="Iron the cape" defaultChecked />
      <ComicCheckbox label="Rescue the cat" />
    </div>
  );
}

/* ---------- Radio groups ---------- */

const SIZES = [
  { label: "S", left: "20%" },
  { label: "M", left: "50%" },
  { label: "L", left: "80%" },
];

/** The ink star hops from option to option, each blob filling lime as it lands. */
export function RadioGroupsPreview() {
  const third = LOOP / 3;
  return (
    <Stage
      name="radios-preview"
      css={`
        @keyframes radios-hop {
          0%, 20% { left: 20%; top: 50%; }
          26.5% { left: 35%; top: 28%; }
          33.33%, 53.33% { left: 50%; top: 50%; }
          59.8% { left: 65%; top: 28%; }
          66.66%, 86.66% { left: 80%; top: 50%; }
          93.3% { left: 50%; top: 24%; }
          100% { left: 20%; top: 50%; }
        }
        @keyframes radios-spin { from { rotate: 0deg; } to { rotate: 360deg; } }
        @keyframes radios-fill {
          0%, 33% { fill: var(--lime); }
          34%, 100% { fill: var(--paper-raised); }
        }
        @keyframes radios-squash { 0%, 6%, 100% { scale: 1; } 1.5% { scale: 1.18 .86; } 3.5% { scale: .94 1.06; } }
        .radios-preview .rp-star { animation: radios-hop ${LOOP}s cubic-bezier(.4,0,.3,1) infinite, radios-spin ${third}s linear infinite; }
        .radios-preview .rp-blob path { animation: radios-fill ${LOOP}s steps(1) var(--at) infinite both; }
        .radios-preview .rp-blob { animation: radios-squash ${LOOP}s ease-out var(--at) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .radios-preview .rp-star, .radios-preview .rp-blob path, .radios-preview .rp-blob { animation: none; }
          .radios-preview .rp-star { left: 50%; top: 50%; }
          .radios-preview .rp-blob[data-i="1"] path { fill: var(--lime); }
        }
      `}
    >
      <span className="absolute top-[4%] left-1/2 -translate-x-1/2 -rotate-2 border-[3px] border-ink bg-lime px-2.5 py-1 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[3px_3px_0_var(--ink)]">
        Pick a size
      </span>
      {SIZES.map((s, i) => (
        <div key={s.label} className="absolute top-1/2 flex -translate-1/2 flex-col items-center gap-2" style={{ left: s.left }}>
          <svg
            viewBox="0 0 100 100"
            overflow="visible"
            data-i={i}
            className="rp-blob size-14 drop-shadow-[3px_3px_0_var(--ink)]"
            style={{ "--at": `${(i * LOOP) / 3 - 0.08 - LOOP}s` } as CSSProperties}
          >
            <path d="M50 3C77 2 97 20 96 47C95 74 76 97 49 96C22 95 3 77 4 50C5 23 23 4 50 3Z" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={7} />
          </svg>
          <span className="absolute top-full mt-2 font-mono text-sm font-bold">{s.label}</span>
        </div>
      ))}
      <svg viewBox="0 0 100 100" className="rp-star absolute z-10 size-7 -translate-1/2 fill-ink" style={{ left: "50%", top: "50%" }}>
        <path d={BURST} />
      </svg>
    </Stage>
  );
}

/** The Comic card inside Radio Groups. */
export function ComicRadioGroupPreview() {
  return (
    <ComicRadioGroup legend="Size" orientation="horizontal">
      <ComicRadio name="comic-size-preview" value="s" label="Small" />
      <ComicRadio name="comic-size-preview" value="m" label="Medium" defaultChecked />
    </ComicRadioGroup>
  );
}

/* ---------- Switches ---------- */

const ROWS = [
  { label: "Sound effects", at: 0.4 },
  { label: "Hero mode", at: 1.1 },
  { label: "Cape physics", at: 1.8 },
];

/** Three comic switches flip on in a wave, thumbs rolling, each shouting ON!, then all flip back. */
export function SwitchesPreview() {
  return (
    <Stage
      name="switches-preview"
      css={`
        @keyframes switches-track { 0%, 100% { background-color: var(--paper-sunken); } 4%, 66% { background-color: var(--lime); } 72% { background-color: var(--paper-sunken); } }
        @keyframes switches-thumb {
          0% { left: -0.25rem; rotate: 0deg; }
          5%, 66% { left: calc(100% - 1.9rem); rotate: 154deg; }
          72%, 100% { left: -0.25rem; rotate: 0deg; }
        }
        @keyframes switches-thumb-fill { 0%, 100% { fill: var(--paper-raised); } 4%, 66% { fill: var(--pink); } 72% { fill: var(--paper-raised); } }
        @keyframes switches-on { 0%, 3% { opacity: 0; } 5%, 66% { opacity: 1; } 68%, 100% { opacity: 0; } }
        @keyframes switches-off { 0%, 3% { opacity: 1; } 5%, 68% { opacity: 0; } 72%, 100% { opacity: 1; } }
        @keyframes switches-pop {
          0% { opacity: 0; transform: scale(.3) rotate(-25deg); }
          4% { opacity: 1; transform: translateY(-4px) scale(1.2) rotate(8deg); }
          8% { transform: translateY(-6px) scale(1) rotate(5deg); }
          18% { opacity: 1; transform: translateY(-10px) rotate(5deg); }
          24%, 100% { opacity: 0; transform: translateY(-14px) rotate(5deg); }
        }
        .switches-preview .swp-track { animation: switches-track ${LOOP}s ease-out var(--at) infinite both; }
        .switches-preview .swp-thumb { animation: switches-thumb ${LOOP}s cubic-bezier(.3,1.2,.4,1) var(--at) infinite both; }
        .switches-preview .swp-thumb path { animation: switches-thumb-fill ${LOOP}s ease-out var(--at) infinite both; }
        .switches-preview .swp-on { animation: switches-on ${LOOP}s linear var(--at) infinite both; }
        .switches-preview .swp-off { animation: switches-off ${LOOP}s linear var(--at) infinite both; }
        .switches-preview .swp-pop { animation: switches-pop ${LOOP}s cubic-bezier(.2,.9,.3,1.3) var(--at) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .switches-preview .swp-track, .switches-preview .swp-thumb, .switches-preview .swp-thumb path, .switches-preview .swp-on, .switches-preview .swp-off, .switches-preview .swp-pop { animation: none; }
          .switches-preview .swp-track { background-color: var(--lime); }
          .switches-preview .swp-thumb { left: calc(100% - 1.9rem); rotate: 154deg; }
          .switches-preview .swp-thumb path { fill: var(--pink); }
          .switches-preview .swp-off, .switches-preview .swp-pop { opacity: 0; }
        }
      `}
    >
      <div className="absolute top-1/2 left-[42%] flex -translate-1/2 flex-col gap-3.5">
        {ROWS.map((r) => {
          const at = { "--at": `${r.at}s` } as CSSProperties;
          return (
            <div key={r.label} className="flex items-center gap-3">
              <span className="swp-track relative inline-flex h-9 w-[4.75rem] shrink-0 items-center rounded-full border-[3px] border-ink bg-paper-sunken shadow-[3px_3px_0_var(--ink)]" style={{ ...DOTS, ...at }}>
                <span className="swp-on absolute left-2.5 font-mono text-[10px] font-bold uppercase text-on-bright opacity-0" style={at}>
                  On!
                </span>
                <span className="swp-off absolute right-2.5 font-mono text-[10px] font-bold uppercase text-ink-muted" style={at}>
                  Off
                </span>
                <svg viewBox="0 0 100 100" overflow="visible" className="swp-thumb absolute top-1/2 -left-1 size-9 -translate-y-1/2" style={at}>
                  <path d={BURST} fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth={7} strokeLinejoin="round" style={at} />
                </svg>
              </span>
              <span className="w-28 font-bold">{r.label}</span>
              <span className="swp-pop absolute -right-12 border-[3px] border-ink bg-paper-raised px-1.5 py-0.5 font-mono text-xs font-bold opacity-0 shadow-[2px_2px_0_var(--ink)]" style={at}>
                Zap!
              </span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/** The Comic card inside Switches. */
export function ComicSwitchPreview() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch defaultChecked /> Sound effects
      </label>
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch /> Dark lair mode
      </label>
    </div>
  );
}

/* ---------- Sliders ---------- */

/** The starburst thumb slides up, overshoots to 100, and settles, the bubble counting along. */
export function SlidersPreview() {
  return (
    <Stage
      name="sliders-preview"
      css={`
        @property --slv { syntax: "<integer>"; inherits: true; initial-value: 20; }
        @keyframes sliders-v {
          0%, 8% { --slv: 20; }
          38% { --slv: 100; }
          46%, 62% { --slv: 72; }
          84%, 100% { --slv: 20; }
        }
        @keyframes sliders-max {
          0%, 34% { opacity: 0; transform: scale(0) rotate(-30deg); }
          38% { opacity: 1; transform: scale(1.25) rotate(10deg); }
          42%, 50% { opacity: 1; transform: scale(1) rotate(8deg); }
          56%, 100% { opacity: 0; transform: scale(0); }
        }
        .sliders-preview .slp-root { animation: sliders-v ${LOOP}s cubic-bezier(.45,0,.3,1) infinite; counter-reset: slv var(--slv); }
        .sliders-preview .slp-fill { width: calc(1rem + (100% - 2rem) * var(--slv) / 100); }
        .sliders-preview .slp-at { left: calc(1rem + (100% - 2rem) * var(--slv) / 100); }
        .sliders-preview .slp-thumb svg { rotate: calc(var(--slv) * 2.7deg); }
        .sliders-preview .slp-bubble::before { content: counter(slv) "%"; }
        .sliders-preview .slp-max { animation: sliders-max ${LOOP}s cubic-bezier(.2,.9,.3,1.3) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .sliders-preview .slp-root, .sliders-preview .slp-max { animation: none; }
          .sliders-preview .slp-root { --slv: 72; }
          .sliders-preview .slp-max { opacity: 0; }
        }
      `}
    >
      <div className="slp-root absolute inset-x-[10%] top-[44%] h-9">
        <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-ink bg-paper-sunken shadow-[3px_3px_0_var(--ink)]">
          <div className="slp-fill h-full border-r-[3px] border-ink bg-pink" style={DOTS} />
        </div>
        <span className="slp-thumb slp-at absolute top-1/2 size-9 -translate-1/2">
          <Burst className="size-full fill-paper-raised drop-shadow-[2px_2px_0_var(--ink)]" />
        </span>
        <span className="slp-bubble slp-at absolute -top-9 -translate-x-1/2 rounded-lg border-[3px] border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap shadow-[2px_2px_0_var(--ink)] after:absolute after:top-full after:left-1/2 after:-mt-px after:-ml-1.5 after:border-x-[6px] after:border-t-[7px] after:border-x-transparent after:border-t-ink" />
      </div>
      <span className="slp-max absolute top-[2%] left-[4%]">
        <ComicBadge shape="burst" tone="lime" size="sm" tilt={0}>
          Max!
        </ComicBadge>
      </span>
      <div className="absolute inset-x-[10%] bottom-[10%]">
        <Slider value={40} tabIndex={-1} aria-label="Classic" readOnly />
      </div>
    </Stage>
  );
}
