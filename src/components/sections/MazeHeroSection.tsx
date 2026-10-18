import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/** Seconds for one lap of a corridor. */
const LAP = 10;
const BOTS = ["bg-pink", "bg-blue", "bg-orange"];

/** The chomper: a pie whose mouth snaps open and shut as it runs. */
function Chomper() {
  const mouth = (a: number) =>
    `M5 5 L${5 + 4 * Math.cos(a)} ${5 - 4 * Math.sin(a)} A4 4 0 1 0 ${5 + 4 * Math.cos(a)} ${5 + 4 * Math.sin(a)} Z`;
  return (
    <span className="relative block size-9">
      {[
        ["maze-hero-open", 0.75],
        ["maze-hero-shut", 0.12],
      ].map(([cls, a]) => (
        <svg key={cls} viewBox="0 0 10 10" className={`${cls} absolute inset-0 size-full`}>
          <path d={mouth(a as number)} className="fill-lime stroke-ink" strokeWidth={1} strokeLinejoin="round" />
          <circle cx={5.4} cy={3.1} r={0.6} className="fill-ink" />
        </svg>
      ))}
    </span>
  );
}

function Bot({ tone }: { tone: string }) {
  return (
    <span className={`flex size-7 items-start justify-center gap-1 rounded-t-full border-2 border-ink pt-1.5 ${tone}`}>
      {[0, 1].map((i) => (
        <span key={i} className="grid size-2 place-items-center rounded-full bg-paper-raised ring-2 ring-ink">
          <span className="block size-1 translate-x-px rounded-full bg-ink" />
        </span>
      ))}
    </span>
  );
}

/** A corridor: a dot trail eaten behind the chomper, bots on its tail, pellets at the ends. */
function Corridor({ reverse, delay }: { reverse?: boolean; delay: number }) {
  return (
    <div
      aria-hidden
      className="relative h-14 overflow-hidden border-y-4 border-ink bg-paper"
      style={{ transform: reverse ? "scaleX(-1)" : undefined }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--ink) 3px, transparent 3.5px)",
          backgroundSize: "32px 100%",
          backgroundPosition: "16px center",
        }}
      />
      <div className="maze-hero-eaten absolute inset-y-0 left-0 bg-paper" style={{ animationDelay: `${delay}s` }} />
      {[0, 1].map((end) => (
        <span
          key={end}
          className={`maze-hero-pellet absolute top-1/2 -mt-2.5 block size-5 rounded-full border-2 border-ink bg-pink ${end ? "right-3" : "left-3"}`}
        />
      ))}
      <div className="absolute inset-0">
        <div className="maze-hero-runner absolute inset-y-0 left-0 flex items-center" style={{ animationDelay: `${delay}s` }}>
          <Chomper />
        </div>
        {BOTS.map((tone, i) => (
          <div
            key={tone}
            className="maze-hero-runner absolute inset-y-0 flex items-center"
            // Same lap as the chomper, a fixed distance behind it.
            style={{ left: `${-(i + 1) * 3}rem`, animationDelay: `${delay}s` } as CSSProperties}
          >
            <Bot tone={tone} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Maze hero: an arcade start screen. Corridors run along the top and bottom,
 * where a chomper eats a dot trail with bots on its tail; between them, a
 * score bar, a READY! cue, and the headline. CSS only, still for reduced
 * motion. Original characters, in the spirit of arcade maze games.
 */
export function MazeHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  return (
    <section className="@container relative overflow-hidden bg-violet-soft text-ink">
      <style href="maze-hero" precedence="default">{`
        @keyframes maze-hero-run { from { transform: translateX(-3rem); } to { transform: translateX(calc(100cqw + 3rem)); } }
        @keyframes maze-hero-eat { from { width: 0; } to { width: 100%; } }
        @keyframes maze-hero-chomp { 50% { opacity: 0; } }
        @keyframes maze-hero-blink { 50% { opacity: 0.2; } }
        .maze-hero-runner { animation: maze-hero-run ${LAP}s linear infinite; }
        .maze-hero-eaten { animation: maze-hero-eat ${LAP}s linear infinite; }
        .maze-hero-open { animation: maze-hero-chomp 0.3s steps(1, end) infinite; }
        .maze-hero-shut { animation: maze-hero-chomp 0.3s steps(1, end) infinite reverse; }
        .maze-hero-pellet, .maze-hero-ready { animation: maze-hero-blink 0.8s steps(1, end) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .maze-hero-runner, .maze-hero-eaten, .maze-hero-open, .maze-hero-shut, .maze-hero-pellet, .maze-hero-ready { animation: none; }
          .maze-hero-runner { transform: translateX(45cqw); }
          .maze-hero-eaten { width: 45%; }
          .maze-hero-shut { opacity: 0; }
        }
      `}</style>

      <Corridor delay={0} />

      <div className="relative flex flex-col items-center px-4 py-14 text-center @3xl:py-20">
        {/* Arcade score bar. */}
        <div className="flex w-full max-w-2xl justify-between font-mono text-xs font-bold tracking-widest uppercase @3xl:text-sm">
          <span>
            1UP <span className="tabular-nums">004200</span>
          </span>
          <span>
            High score <span className="tabular-nums">013370</span>
          </span>
        </div>

        <p className="maze-hero-ready mt-10 font-mono text-lg font-bold tracking-widest text-pink uppercase @3xl:text-xl">
          Ready!
        </p>
        <Heading className="mt-4 max-w-3xl font-display text-5xl leading-none tracking-tight text-balance @3xl:text-7xl">
          Clear the board. <span className="bg-lime px-2 text-on-bright">Ship</span> the build.
        </Heading>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
          Acme eats through flaky tests, slow deploys, and surprise outages, so the only thing chasing you
          is the next release.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-13 items-center gap-2 border-2 border-ink bg-lime px-6 font-mono text-sm font-bold text-on-bright uppercase shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Insert coin <ArrowRight aria-hidden className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-13 items-center border-2 border-ink bg-paper-raised px-6 font-mono text-sm font-bold uppercase shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            See the code
          </a>
        </div>
      </div>

      <Corridor reverse delay={-LAP / 2} />
    </section>
  );
}
