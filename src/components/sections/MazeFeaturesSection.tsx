import type { LucideIcon } from "lucide-react";
import { Bell, Gauge, GitBranch, Globe, Lock, Zap } from "lucide-react";

const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Zap, title: "Instant previews", body: "Every pull request gets a live URL in under a minute." },
  { icon: GitBranch, title: "Branch timelines", body: "See what changed on each branch, commit by commit." },
  { icon: Bell, title: "Smart alerts", body: "Get pinged when a metric moves, not every time it twitches." },
  { icon: Gauge, title: "Performance budgets", body: "Fail the build when a page gets slower than you allow." },
  { icon: Lock, title: "SSO and audit logs", body: "SAML, SCIM, and a full trail of who did what." },
  { icon: Globe, title: "Edge regions", body: "Run in 30 regions and pick where your data lives." },
];

/** Bot colors, cycled across the cards and the chase. */
const BOTS = ["bg-pink", "bg-blue", "bg-orange"];

/** Seconds for one lap of the corridor. */
const LAP = 9;

/** The chomper: a pie whose mouth snaps shut and open as it runs. */
function Chomper() {
  const mouth = (a: number) =>
    `M5 5 L${5 + 4 * Math.cos(a)} ${5 - 4 * Math.sin(a)} A4 4 0 1 0 ${5 + 4 * Math.cos(a)} ${5 + 4 * Math.sin(a)} Z`;
  return (
    <span className="relative block size-9">
      <svg viewBox="0 0 10 10" className="maze-feat-open absolute inset-0 size-full">
        <path d={mouth(0.75)} className="fill-lime stroke-ink" strokeWidth={1} strokeLinejoin="round" />
        <circle cx={5.4} cy={3.1} r={0.6} className="fill-ink" />
      </svg>
      <svg viewBox="0 0 10 10" className="maze-feat-shut absolute inset-0 size-full">
        <path d={mouth(0.12)} className="fill-lime stroke-ink" strokeWidth={1} strokeLinejoin="round" />
        <circle cx={5.4} cy={3.1} r={0.6} className="fill-ink" />
      </svg>
    </span>
  );
}

/** A bot: a rounded-top body with eyes looking ahead. */
function Bot({ tone, small }: { tone: string; small?: boolean }) {
  return (
    <span
      className={`flex items-start justify-center gap-1 rounded-t-full border-2 border-ink ${tone} ${small ? "size-7 pt-1.5" : "size-11 pt-2.5"}`}
    >
      {[0, 1].map((i) => (
        <span key={i} className={`grid place-items-center rounded-full bg-paper-raised ring-2 ring-ink ${small ? "size-2" : "size-3"}`}>
          <span className={`block translate-x-px rounded-full bg-ink ${small ? "size-1" : "size-1.5"}`} />
        </span>
      ))}
    </span>
  );
}

/**
 * Maze feature grid: a corridor where the chomper eats a dot trail with
 * three bots on its tail, over features set in maze rooms. Each card wears
 * a bot as its icon. The chase is CSS and holds still for reduced motion.
 */
export function MazeFeaturesSection() {
  return (
    <section className="@container bg-paper-sunken text-ink">
      <style href="maze-features" precedence="default">{`
        @keyframes maze-feat-run { from { transform: translateX(-3rem); } to { transform: translateX(calc(100cqw + 3rem)); } }
        @keyframes maze-feat-eat { from { width: 0; } to { width: 100%; } }
        @keyframes maze-feat-chomp { 50% { opacity: 0; } }
        .maze-feat-runner { animation: maze-feat-run ${LAP}s linear infinite; }
        .maze-feat-eaten { animation: maze-feat-eat ${LAP}s linear infinite; }
        .maze-feat-open { animation: maze-feat-chomp 0.3s steps(1, end) infinite; }
        .maze-feat-shut { animation: maze-feat-chomp 0.3s steps(1, end) infinite reverse; }
        @media (prefers-reduced-motion: reduce) {
          .maze-feat-runner, .maze-feat-eaten, .maze-feat-open, .maze-feat-shut { animation: none; }
          .maze-feat-runner { transform: translateX(40cqw); }
          .maze-feat-eaten { width: 40%; }
          .maze-feat-shut { opacity: 0; }
        }
      `}</style>

      <header className="flex flex-col gap-4 p-8 @3xl:flex-row @3xl:items-end @3xl:justify-between @3xl:p-12">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Features · Level 1</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight tracking-tight text-balance @3xl:text-4xl">
            Eat through your backlog.
          </h2>
        </div>
        <p className="max-w-sm leading-relaxed text-ink-muted">
          Six features standing between a merge and production. Clear the board and ship.
        </p>
      </header>

      {/* The corridor: a dot trail, eaten behind the chomper, with the bots giving chase. */}
      <div aria-hidden className="relative h-14 overflow-hidden border-y-4 border-ink bg-paper">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(var(--ink) 3px, transparent 3.5px)",
            backgroundSize: "32px 100%",
            backgroundPosition: "16px center",
          }}
        />
        <div className="maze-feat-eaten absolute inset-y-0 left-0 bg-paper" />
        <div className="absolute inset-0">
          <div className="maze-feat-runner absolute inset-y-0 left-0 flex items-center">
            <Chomper />
          </div>
          {BOTS.map((tone, i) => (
            <div
              key={tone}
              className="maze-feat-runner absolute inset-y-0 flex items-center"
              // Same lap as the chomper, a fixed distance behind it.
              style={{ left: `${-(i + 1) * 3}rem` }}
            >
              <Bot tone={tone} small />
            </div>
          ))}
        </div>
      </div>

      {/* The rooms: the violet between cards reads as maze walls. */}
      <ul className="grid grid-cols-1 gap-3 bg-violet-soft p-3 @xl:grid-cols-2 @4xl:grid-cols-3">
        {features.map((f, i) => (
          <li key={f.title} className="relative flex flex-col gap-4 border-4 border-ink bg-paper-raised p-6">
            <span className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-xs font-bold text-ink-muted">
              <span aria-hidden className="block size-2 bg-ink" />
              +10
            </span>
            <div className="flex items-center gap-3">
              <Bot tone={BOTS[i % BOTS.length]} />
              <f.icon aria-hidden className="size-5" />
            </div>
            <h3 className="font-display text-lg tracking-tight">{f.title}</h3>
            <p className="leading-relaxed text-ink-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
