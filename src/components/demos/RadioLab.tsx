"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { cn } from "@streamuilib/react";
import { renderTrack, SAMPLE_RATE, type TrackSpec } from "@/lib/audio/synth";

/** The box, in px: a wide front and a chunky depth. Scaled down to fit narrow screens. */
const W = 560;
const H = 250;
const D = 96;

const FM_MIN = 88;
const FM_MAX = 108;

/** The stations on the dial, each with its own little loop. */
const STATIONS: { f: number; name: string; spec: TrackSpec }[] = [
  {
    f: 90.5,
    name: "STREAM FM",
    spec: {
      bpm: 128,
      leadWave: "square",
      lead: [72, null, 76, 79, 76, null, 72, null, 74, null, 77, 81, 77, null, 74, null, 76, null, 79, 84, 79, null, 76, null, 77, 76, 74, 72, 74, null, null, null],
      bass: [48, null, 48, null, 55, null, 48, null, 50, null, 50, null, 57, null, 50, null],
      kick: [0, 4, 8, 12],
      hat: [2, 6, 10, 14],
      loops: 1,
    },
  },
  {
    f: 95.9,
    name: "LO-FI INK",
    spec: {
      bpm: 84,
      leadWave: "triangle",
      lead: [64, null, null, 67, null, 69, null, null, 67, null, 64, null, 62, null, null, null, 60, null, null, 64, null, 67, null, null, 69, null, 67, null, 64, null, null, null],
      bass: [40, null, null, null, 45, null, null, null, 43, null, null, null, 38, null, null, null],
      kick: [0, 10],
      hat: [4, 12],
      loops: 1,
    },
  },
  {
    f: 101.3,
    name: "OFFSET 101",
    spec: {
      bpm: 150,
      leadWave: "saw",
      lead: [69, 72, 76, 72, 69, 72, 76, 81, 79, 76, 72, 76, 79, 76, 72, null, 71, 74, 77, 74, 71, 74, 77, 83, 81, 77, 74, 77, 81, 77, 74, null],
      bass: [45, null, 45, 57, 45, null, 45, 57, 43, null, 43, 55, 41, null, 41, 53],
      kick: [0, 4, 8, 12],
      hat: [2, 6, 10, 14, 15],
      loops: 1,
    },
  },
  {
    f: 106.7,
    name: "PAPER JAMS",
    spec: {
      bpm: 110,
      leadWave: "sine",
      lead: [76, 79, null, 76, 74, null, 72, null, 74, 76, null, 79, 81, null, null, null, 79, 76, null, 74, 72, null, 69, null, 71, 72, null, 74, 76, null, null, null],
      bass: [48, null, null, 48, 53, null, null, 53, 55, null, null, 55, 43, null, 47, null],
      kick: [0, 6, 8],
      hat: [4, 12],
      loops: 1,
    },
  },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

/** How strongly each station comes in at frequency `f`: 1 dead on, 0 past the window. */
function strengths(f: number) {
  const window = 0.6; // MHz either side
  return STATIONS.map((s) => clamp(1 - Math.abs(f - s.f) / window, 0, 1));
}

/** The audio: every station looping at once, plus static, mixed by the tuning. */
type Engine = { ctx: AudioContext; master: GainNode; hiss: GainNode; stations: GainNode[] };

function startEngine(): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.connect(ctx.destination);

  // Static: looped white noise through a band-pass, like an untuned radio.
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noise;
  noiseSrc.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 0.6;
  const hiss = ctx.createGain();
  hiss.gain.value = 0;
  noiseSrc.connect(band).connect(hiss).connect(master);
  noiseSrc.start();

  // Each station: its loop, rendered once, through a radio-ish band and its own gain.
  const stations = STATIONS.map((s) => {
    const samples = renderTrack(s.spec);
    const buf = ctx.createBuffer(1, samples.length, SAMPLE_RATE);
    buf.copyToChannel(samples as Float32Array<ArrayBuffer>, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 180; // a small speaker's thin low end
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(hp).connect(g).connect(master);
    src.start();
    return g;
  });
  return { ctx, master, hiss, stations };
}

/**
 * A dial knob: drag up or down (or sideways), scroll, or use the arrow keys.
 * It's a slider to assistive tech, with the value read out in words.
 */
function Knob({
  label,
  value,
  min,
  max,
  step,
  big,
  valueText,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  big: number;
  valueText: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const drag = useRef<{ y: number; x: number; v: number } | null>(null);
  const set = (v: number) => onChange(clamp(round1(v), min, max));
  const turn = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        aria-disabled={disabled || undefined}
        onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, x: e.clientX, v: value };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const d = drag.current.y - e.clientY + (e.clientX - drag.current.x);
          set(drag.current.v + (d / 140) * (max - min));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onWheel={(e: WheelEvent) => !disabled && set(value - Math.sign(e.deltaY) * step)}
        onKeyDown={(e: KeyboardEvent) => {
          if (disabled) return;
          const by = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: big, PageDown: -big }[e.key];
          if (by !== undefined) {
            e.preventDefault();
            set(value + by);
          } else if (e.key === "Home") set(min);
          else if (e.key === "End") set(max);
        }}
        className={cn(
          "relative grid size-14 cursor-grab touch-none place-items-center rounded-full border-4 border-ink bg-paper-raised shadow-[0_5px_0_var(--ink)] active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue",
          disabled && "cursor-not-allowed opacity-70",
        )}
        style={{ backgroundImage: "repeating-conic-gradient(var(--paper-raised) 0 10deg, var(--paper-sunken) 10deg 20deg)" }}
      >
        <span aria-hidden className="absolute inset-2 rounded-full border-[3px] border-ink bg-lime" style={{ rotate: `${turn}deg` }}>
          <span className="absolute top-0.5 left-1/2 block h-3.5 w-1.5 -translate-x-1/2 rounded-full bg-ink" />
        </span>
      </div>
      <span aria-hidden className="font-mono text-[10px] font-bold tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

/** One speaker: a ringed grille with a cone that pumps while music plays. */
function Speaker({ pumping, power }: { pumping: number; power: boolean }) {
  return (
    <div aria-hidden className="relative grid size-40 place-items-center rounded-full border-4 border-ink bg-ink shadow-[inset_0_0_0_6px_var(--paper-raised)]">
      <span
        className="absolute inset-3 rounded-full"
        style={{ backgroundImage: "radial-gradient(var(--paper-raised) 1.6px, transparent 2.2px)", backgroundSize: "9px 9px", opacity: 0.35 }}
      />
      <span
        className={cn("radio-lab-cone relative grid size-22 place-items-center rounded-full border-4 border-ink bg-blue", power && pumping > 0.15 && "radio-lab-pump")}
        style={{ "--pump": 0.04 + pumping * 0.06 } as CSSProperties}
      >
        <span className="size-10 rounded-full border-4 border-ink bg-orange" />
      </span>
    </div>
  );
}

/**
 * Retro radio: a 90s boombox in real CSS 3D (front, top, and side faces in a
 * preserve-3d box) that tilts toward your pointer. Power it on, turn the
 * tuning knob across the FM dial, and four stations of synthesized chiptune
 * fade in out of the static. The antenna stays up, leaning out at 45°.
 * Knobs drag, scroll, or take the arrow keys; it all works with a keyboard.
 */
export function RadioLab() {
  const [power, setPower] = useState(false);
  const [freq, setFreq] = useState(92.4);
  const [volume, setVolume] = useState(6);
  const [tilt, setTilt] = useState({ x: -10, y: -24 });
  const [scale, setScale] = useState(1);
  const engine = useRef<Engine | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const levels = strengths(freq);
  const best = Math.max(...levels);
  const tuned = STATIONS[levels.indexOf(best)];
  const locked = best > 0.6;

  // Fit the box to narrow screens.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / (W + 80)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mix the stations and static to the dial and the volume.
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    const t = e.ctx.currentTime;
    e.master.gain.setTargetAtTime(power ? (volume / 10) * 0.7 : 0, t, 0.05);
    e.stations.forEach((g, i) => g.gain.setTargetAtTime(levels[i] ** 1.6 * 0.9, t, 0.06));
    e.hiss.gain.setTargetAtTime(0.05 + (1 - best) * 0.3, t, 0.06);
  }, [power, volume, levels, best]);

  // Close the audio when the lab goes away.
  useEffect(() => () => void engine.current?.ctx.close(), []);

  const togglePower = useCallback(() => {
    // The audio starts on the first press: browsers only allow sound after a user gesture.
    // No Web Audio (old browsers, tests): the radio still works, silently.
    if (!engine.current && typeof AudioContext !== "undefined") engine.current = startEngine();
    const next = !power;
    if (next) void engine.current?.ctx.resume();
    setPower(next);
  }, [power]);

  const onStageMove = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -10 - dy * 14, y: -24 + dx * 30 });
  };

  const needle = ((freq - FM_MIN) / (FM_MAX - FM_MIN)) * 100;
  const display = power ? `${freq.toFixed(1)} FM` : "";
  const readout = !power ? "" : locked ? tuned.name : best > 0.15 ? `${tuned.name}?` : "· · static · ·";

  return (
    <div className="flex w-full flex-col items-center gap-3 text-ink">
      <style href="radio-lab" precedence="default">{`
        @keyframes radio-lab-pump { 0%, 100% { scale: 1; } 30% { scale: calc(1 + var(--pump)); } }
        .radio-lab-pump { animation: radio-lab-pump 0.47s cubic-bezier(.3,0,.4,1) infinite; }
        .radio-lab-box { transition: transform 180ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .radio-lab-pump { animation: none; }
          .radio-lab-box { transition: none; }
        }
      `}</style>

      <div
        ref={stageRef}
        onPointerMove={onStageMove}
        onPointerLeave={() => setTilt({ x: -10, y: -24 })}
        className="flex w-full justify-center py-6"
        style={{ perspective: "1400px", height: (H + 190) * scale }}
      >
        <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top center", marginTop: 150 * scale }}>
          <div
            className="radio-lab-box relative"
            style={{ width: W, height: H, transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            {/* Top face: a cassette slot and buttons. */}
            <div
              aria-hidden
              className="absolute border-4 border-ink bg-pink"
              style={{ width: W, height: D, top: (H - D) / 2, transform: `rotateX(90deg) translateZ(${H / 2}px)`, backgroundImage: "linear-gradient(color-mix(in oklab, var(--ink) 12%, transparent), transparent)" }}
            >
              <span className="absolute top-1/2 left-1/2 block h-6 w-44 -translate-1/2 rounded-full border-4 border-ink bg-ink/80" />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="absolute top-1/2 block h-6 w-8 -translate-y-1/2 border-[3px] border-ink bg-paper-raised" style={{ left: 30 + i * 38 }} />
              ))}
            </div>
            {/* Right side: vents. */}
            <div
              aria-hidden
              className="absolute border-4 border-ink bg-pink"
              style={{
                width: D,
                height: H,
                left: (W - D) / 2,
                transform: `rotateY(90deg) translateZ(${W / 2}px)`,
                backgroundImage: "linear-gradient(90deg, color-mix(in oklab, var(--ink) 22%, transparent), color-mix(in oklab, var(--ink) 22%, transparent)), repeating-linear-gradient(var(--ink) 0 4px, transparent 4px 16px)",
                backgroundSize: "100% 100%, 50% 60%",
                backgroundPosition: "0 0, center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* Left side, for when it tilts the other way. */}
            <div
              aria-hidden
              className="absolute border-4 border-ink bg-pink"
              style={{ width: D, height: H, left: (W - D) / 2, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, backgroundImage: "linear-gradient(color-mix(in oklab, var(--ink) 22%, transparent), color-mix(in oklab, var(--ink) 22%, transparent))" }}
            />

            {/* The handle, over the middle of the box. */}
            <div aria-hidden className="absolute left-1/2 block h-16 w-64 -translate-x-1/2 rounded-t-[2rem] border-[10px] border-b-0 border-ink" style={{ top: -60, transform: "translateZ(0px)" }} />

            {/* The antenna: always up, leaning out from the back-right corner at 45°. */}
            <div aria-hidden className="absolute right-10 origin-bottom" style={{ bottom: H, transform: `translateZ(${-D / 2 + 10}px) rotate(45deg)` }}>
              <span className="absolute -bottom-1 -left-2 block h-3 w-6 rounded-t-md border-[3px] border-ink bg-ink" />
              <span className="block h-44 w-2 border-x-2 border-t-2 border-ink bg-paper-sunken" style={{ backgroundImage: "linear-gradient(transparent 0 32%, var(--ink) 32% 34%, transparent 34% 64%, var(--ink) 64% 66%, transparent 66%)" }} />
              <span className="absolute -top-2 -left-1 block size-4 rounded-full border-[3px] border-ink bg-orange" />
            </div>

            {/* The front face, with every control on it. */}
            <div
              className="absolute inset-0 rounded-[10px] border-4 border-ink bg-pink"
              style={{ transform: `translateZ(${D / 2}px)`, backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 10%, transparent) 1.2px, transparent 1.7px)", backgroundSize: "10px 10px" }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Speaker pumping={power ? levels.reduce((a, b) => Math.max(a, b), 0) : 0} power={power} />

                <div className="flex w-44 flex-col items-center gap-3">
                  {/* The dial window: FM scale, the needle, and an LCD readout. */}
                  <div className={cn("relative h-24 w-full overflow-hidden rounded-md border-4 border-ink", power ? "bg-lime" : "bg-paper-sunken")}>
                    <div aria-hidden className="absolute inset-x-2 top-1.5 flex justify-between font-mono text-[9px] font-bold">
                      {[88, 92, 96, 100, 104, 108].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                    <div aria-hidden className="absolute inset-x-2 top-5 h-3" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 7.2px)" }} />
                    {/* Station marks on the dial. */}
                    {STATIONS.map((s) => (
                      <span key={s.f} aria-hidden className="absolute top-[34px] block size-2 -translate-x-1/2 rounded-full border-2 border-ink bg-pink" style={{ left: `calc(0.5rem + (100% - 1rem) * ${(s.f - FM_MIN) / (FM_MAX - FM_MIN)})` }} />
                    ))}
                    <span
                      aria-hidden
                      className="absolute top-1 block h-11 w-1 -translate-x-1/2 bg-[oklch(0.58_0.2_28)] transition-[left] duration-100 motion-reduce:transition-none"
                      style={{ left: `calc(0.5rem + (100% - 1rem) * ${needle / 100})` }}
                    />
                    <div className="absolute inset-x-2 bottom-1.5 flex items-baseline justify-between font-mono text-xs font-bold">
                      <span aria-hidden>{display}</span>
                      <span aria-live="polite" className={cn("truncate", !locked && "opacity-70")}>
                        {readout}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <Knob
                      label="Tune"
                      value={freq}
                      min={FM_MIN}
                      max={FM_MAX}
                      step={0.1}
                      big={1}
                      valueText={`${freq.toFixed(1)} FM${locked ? `, ${tuned.name}` : ", static"}`}
                      onChange={setFreq}
                    />
                    <button
                      type="button"
                      aria-pressed={power}
                      aria-label="Power"
                      onClick={togglePower}
                      className={cn(
                        "mb-5 grid size-11 cursor-pointer place-items-center rounded-md border-4 border-ink font-mono text-[10px] font-bold transition-[translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue motion-reduce:transition-none",
                        power ? "translate-y-1 bg-orange shadow-[0_1px_0_var(--ink)]" : "bg-paper-raised shadow-[0_5px_0_var(--ink)]",
                      )}
                    >
                      <span aria-hidden className={cn("size-2.5 rounded-full border-2 border-ink", power ? "bg-lime" : "bg-paper-sunken")} />
                    </button>
                    <Knob
                      label="Vol"
                      value={volume}
                      min={0}
                      max={10}
                      step={1}
                      big={2}
                      valueText={`Volume ${volume} of 10`}
                      onChange={setVolume}
                    />
                  </div>
                </div>

                <Speaker pumping={power ? best : 0} power={power} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
        <span className="text-ink-muted">Drag, scroll, or arrow-key the knobs. Stations at 90.5, 95.9, 101.3, 106.7.</span>
      </div>
    </div>
  );
}
