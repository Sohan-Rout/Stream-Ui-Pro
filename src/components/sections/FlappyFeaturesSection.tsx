import type { LucideIcon } from "lucide-react";
import { Bell, Gauge, GitBranch, Globe, Lock, Zap } from "lucide-react";

type Feature = { icon: LucideIcon; title: string; body: string };

const features: Feature[] = [
  { icon: Zap, title: "Instant previews", body: "Every pull request gets a live URL in under a minute." },
  { icon: GitBranch, title: "Branch timelines", body: "See what changed on each branch, commit by commit." },
  { icon: Bell, title: "Smart alerts", body: "Get pinged when a metric moves, not every time it twitches." },
  { icon: Gauge, title: "Performance budgets", body: "Fail the build when a page gets slower than you allow." },
  { icon: Lock, title: "SSO and audit logs", body: "SAML, SCIM, and a full trail of who did what." },
  { icon: Globe, title: "Edge regions", body: "Run in 30 regions and pick where your data lives." },
];

/** The pipe's cap: wider than the body, with the feature's icon and title. */
function Cap({ f }: { f: Feature }) {
  return (
    <div className="relative z-10 -mx-2 flex items-center gap-3 border-4 border-ink bg-pink px-3 py-2.5 shadow-brutal-sm">
      <span className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-paper-raised text-ink">
        <f.icon aria-hidden className="size-4.5" strokeWidth={2.25} />
      </span>
      <h3 className="font-display text-base leading-tight tracking-tight text-on-bright">{f.title}</h3>
    </div>
  );
}

/** The pipe's body: pink with a light stripe down the left, holding the description. */
function Body({ f, from }: { f: Feature; from: "top" | "bottom" }) {
  return (
    <div className={`relative flex flex-1 border-x-4 border-ink bg-pink ${from === "top" ? "-mb-1" : "-mt-1"}`}>
      <span aria-hidden className="ml-2.5 w-2.5 shrink-0 bg-pink-soft" />
      <p className="px-4 py-5 text-sm leading-relaxed font-medium text-on-bright">{f.body}</p>
    </div>
  );
}

/** A top pipe hangs down from the ceiling (its cap at the bottom); a bottom pipe stands on the ground. */
function PipeCard({ f, from }: { f: Feature; from: "top" | "bottom" }) {
  return (
    <li className={`flex flex-col ${from === "top" ? "justify-end" : "justify-start"}`}>
      {from === "bottom" && <Cap f={f} />}
      <Body f={f} from={from} />
      {from === "top" && <Cap f={f} />}
    </li>
  );
}

/** A comic cloud, outlined, with a hard shadow. */
function Cloud({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 26" className={`absolute h-auto ${className}`}>
      <path d="M8 24 a8 8 0 0 1 4 -14 a12 12 0 0 1 22 -4 a10 10 0 0 1 18 6 a7 7 0 0 1 2 12 Z" transform="translate(3 2)" fill="var(--ink)" />
      <path d="M8 24 a8 8 0 0 1 4 -14 a12 12 0 0 1 22 -4 a10 10 0 0 1 18 6 a7 7 0 0 1 2 12 Z" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** The bird from the Flappy hero: an orange block with an eye, a pink beak, and a flapping violet wing. */
function Bird() {
  return (
    <div className="relative size-11">
      <span
        className="absolute top-3.5 -right-3 block size-0 border-y-[7px] border-l-[13px] border-y-transparent border-l-pink"
        style={{ filter: "drop-shadow(2px 0 0 var(--ink)) drop-shadow(-0.5px 0 0 var(--ink))" }}
      />
      <span className="absolute inset-0 block rounded-md border-4 border-ink bg-orange shadow-brutal-sm" />
      <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full border-2 border-ink bg-paper-raised">
        <span className="block size-1.5 rounded-full bg-ink" />
      </span>
      <span className="flappy-feat-wing absolute top-5 left-1 block h-3 w-5 rounded-sm border-2 border-ink bg-violet" />
    </div>
  );
}

/**
 * Flappy features: six features as pink pipe cards. The top three hang from
 * the ceiling, the bottom three stand on a scrolling grass floor, and the
 * bird flaps through the gap between them, past drifting clouds. Pure CSS;
 * everything holds still for reduced motion.
 */
export function FlappyFeaturesSection() {
  const top = features.slice(0, 3);
  const bottom = features.slice(3);
  return (
    <section className="@container relative overflow-hidden bg-blue-soft text-ink">
      <style href="flappy-features" precedence="default">{`
        @keyframes flappy-feat-fly { from { transform: translateX(-80px); } to { transform: translateX(calc(100cqw + 80px)); } }
        @keyframes flappy-feat-bob { 0%, 100% { transform: translateY(-14px) rotate(-10deg); } 50% { transform: translateY(14px) rotate(14deg); } }
        @keyframes flappy-feat-flap { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-5px) scaleY(.6); } }
        @keyframes flappy-feat-drift { from { transform: translateX(0); } to { transform: translateX(-100cqw); } }
        @keyframes flappy-feat-ground { to { background-position-x: -32px; } }
        .flappy-feat-flyer { animation: flappy-feat-fly 9s linear infinite; }
        .flappy-feat-bobber { animation: flappy-feat-bob 1.1s ease-in-out infinite; }
        .flappy-feat-wing { animation: flappy-feat-flap .28s ease-in-out infinite; }
        .flappy-feat-clouds { animation: flappy-feat-drift 40s linear infinite; }
        .flappy-feat-ground { animation: flappy-feat-ground .6s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .flappy-feat-flyer, .flappy-feat-bobber, .flappy-feat-wing, .flappy-feat-clouds, .flappy-feat-ground { animation: none; }
          .flappy-feat-flyer { transform: translateX(40cqw); }
        }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-10 @3xl:px-10 @3xl:pt-16">
        <header className="flex flex-col items-start justify-between gap-5 @3xl:flex-row @3xl:items-end">
          <div className="flex flex-col items-start gap-4">
            <p className="border-2 border-ink bg-paper-raised px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase shadow-brutal-sm">
              Features
            </p>
            <h2 className="max-w-xl font-display text-4xl leading-[1.05] tracking-tight @3xl:text-5xl">
              Six features. <span className="bg-orange px-2">Zero crashes.</span>
            </h2>
          </div>
          <p className="border-4 border-ink bg-paper-raised px-3 py-1.5 font-mono text-sm font-bold shadow-brutal">
            SCORE <span className="tabular-nums">006</span>
          </p>
        </header>
      </div>

      {/* The ceiling the top pipes hang from: the grass floor, upside down. */}
      <div
        aria-hidden
        className="flappy-feat-ground h-5 border-y-4 border-ink bg-lime"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, oklch(0 0 0 / 0.16) 0 3px, transparent 3px 16px)", backgroundSize: "32px 100%" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 @3xl:px-10">
        <div className="relative">
          <ul className="grid grid-cols-1 gap-6 @3xl:grid-cols-3 @3xl:gap-10">
            {top.map((f) => (
              <PipeCard key={f.title} f={f} from="top" />
            ))}
          </ul>

          {/* The bird's lane: clouds drift behind, and the bird flies the width of the section through the gap. */}
          <div aria-hidden className="relative h-28 @3xl:h-32">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[100cqw] -translate-x-1/2 overflow-hidden">
              <div className="flappy-feat-clouds flex h-full w-[200cqw]">
                {[0, 1].map((i) => (
                  <div key={i} className="relative h-full w-[100cqw]">
                    <Cloud className="top-3 left-[8%] w-20" />
                    <Cloud className="top-14 left-[38%] w-14" />
                    <Cloud className="top-5 left-[70%] w-24" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flappy-feat-flyer absolute top-1/2 left-0 -mt-5">
              <div className="flappy-feat-bobber">
                <Bird />
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-6 @3xl:grid-cols-3 @3xl:gap-10">
            {bottom.map((f) => (
              <PipeCard key={f.title} f={f} from="bottom" />
            ))}
          </ul>
        </div>
      </div>

      {/* The grass floor the bottom pipes stand on, with hatching that scrolls. */}
      <div
        aria-hidden
        className="flappy-feat-ground relative h-14 border-t-4 border-ink bg-lime"
        style={{ backgroundImage: "repeating-linear-gradient(-45deg, oklch(0 0 0 / 0.16) 0 3px, transparent 3px 16px)", backgroundSize: "32px 100%" }}
      />
    </section>
  );
}
