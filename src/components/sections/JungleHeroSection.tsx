import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/**
 * A jungle palette rather than the library brights: mint sky, layered greens,
 * bark brown, and banana yellow. Set on the section as custom properties, so
 * it's one place to retune.
 */
const PALETTE = {
  "--jungle-sky": "oklch(0.94 0.045 170)",
  "--jungle-hill": "oklch(0.8 0.07 160)",
  "--jungle-leaf": "oklch(0.66 0.12 148)",
  "--jungle-leaf-dark": "oklch(0.52 0.1 152)",
  "--jungle-bark": "oklch(0.52 0.075 55)",
  "--jungle-grass": "oklch(0.74 0.14 135)",
  "--jungle-dirt": "oklch(0.64 0.08 62)",
  "--jungle-banana": "oklch(0.88 0.14 95)",
  "--jungle-fur": "oklch(0.46 0.045 45)",
  "--jungle-fur-dark": "oklch(0.36 0.04 45)",
  "--jungle-face": "oklch(0.76 0.05 60)",
} as CSSProperties;

/** One jump-and-grab cycle, in seconds; the ape's leap peaks as the banana reaches it. */
const CYCLE = 3;
const PEAK = 0.68; // fraction of the cycle

/** Rolling hills: the ridge line (outlined) and the same ridge closed into a shape (filled), so tiles join without seams. */
const RIDGE = "M0 50 C 60 10, 140 10, 200 50 C 260 85, 340 15, 400 50";
const HILLS = `${RIDGE} L400 100 L0 100 Z`;

/** A curved banana with brown tips, in a 80×50 box. */
function Banana({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 50" overflow="visible" className={className} style={style} aria-hidden>
      <path
        d="M8 14 C 14 40, 58 46, 74 12 C 62 26, 26 30, 12 10 Z"
        fill="var(--jungle-banana)"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M8 14 L4 8" stroke="var(--jungle-bark)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="75" cy="11" r="2.5" fill="var(--jungle-bark)" />
    </svg>
  );
}

/** A palm: a ringed, slightly leaning trunk under a crown of leaves. */
function Palm({ left, height, lean }: { left: string; height: number; lean: number }) {
  return (
    <div className="absolute bottom-0 w-20 origin-bottom" style={{ left, height, rotate: `${lean}deg` }}>
      <span
        className="absolute bottom-0 left-1/2 block h-full w-4 -translate-x-1/2 border-x-[3px] border-ink"
        style={{ background: "repeating-linear-gradient(var(--jungle-bark) 0 14px, var(--ink) 14px 17px)" }}
      />
      <svg viewBox="0 0 100 60" overflow="visible" className="absolute -top-8 left-1/2 w-32 -translate-x-1/2">
        <g stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round">
          <path d="M50 30 C 30 8, 8 12, 0 34 C 18 24, 34 26, 50 30 Z" fill="var(--jungle-leaf-dark)" />
          <path d="M50 30 C 70 8, 92 12, 100 34 C 82 24, 66 26, 50 30 Z" fill="var(--jungle-leaf-dark)" />
          <path d="M50 30 C 38 0, 62 0, 50 30 Z" fill="var(--jungle-leaf)" />
          <path d="M50 30 C 28 30, 14 44, 12 58 C 26 44, 38 38, 50 30 Z" fill="var(--jungle-leaf)" />
          <path d="M50 30 C 72 30, 86 44, 88 58 C 74 44, 62 38, 50 30 Z" fill="var(--jungle-leaf)" />
        </g>
      </svg>
    </div>
  );
}

/** The trees on one half of the scrolling strip; the strip draws it twice so the loop never jumps. */
const PALMS = [
  { left: "6%", height: 150, lean: -4 },
  { left: "31%", height: 190, lean: 3 },
  { left: "58%", height: 135, lean: -2 },
  { left: "80%", height: 175, lean: 5 },
];

/** A tapered limb from (x1, y1) to (x2, y2), w1 wide at the root and w2 at the end, with round ends. */
function limb(x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  const p = (x: number, y: number, w: number, side: 1 | -1) => `${(x + (nx * w * side) / 2).toFixed(1)} ${(y + (ny * w * side) / 2).toFixed(1)}`;
  return `M${p(x1, y1, w1, 1)} L${p(x2, y2, w2, 1)} A${w2 / 2} ${w2 / 2} 0 0 0 ${p(x2, y2, w2, -1)} L${p(x1, y1, w1, -1)} A${w1 / 2} ${w1 / 2} 0 0 0 ${p(x1, y1, w1, 1)} Z`;
}

const FAR_ARM = limb(64, 66, 48, 86, 10, 8);
const FAR_LEG = limb(58, 96, 44, 120, 12, 10);
const NEAR_LEG = limb(64, 98, 78, 120, 12, 10);
const NEAR_ARM = limb(70, 66, 92, 78, 10, 8);

/**
 * The runner: a monkey sprinting upright to the right. A long curly tail, big
 * round ears, a heart-shaped face with big eyes and a grin, long arms
 * pumping against the legs, and the tails of a banana-yellow headband
 * flapping behind.
 */
function Ape() {
  const fur = "var(--jungle-fur)";
  const back = "var(--jungle-fur-dark)";
  const face = "var(--jungle-face)";
  return (
    <svg viewBox="0 0 130 130" overflow="visible" className="size-full" aria-hidden>
      <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        {/* The tail: an ink line with fur down its middle, curling up at the tip. */}
        <g className="jungle-hero-tail" style={{ transformOrigin: "50px 94px" }}>
          <path d="M50 94 C 26 100, 8 86, 12 66 C 16 48, 36 48, 36 62 C 36 72, 24 72, 25 64" fill="none" strokeWidth="11" />
          <path d="M50 94 C 26 100, 8 86, 12 66 C 16 48, 36 48, 36 62 C 36 72, 24 72, 25 64" fill="none" stroke={fur} strokeWidth="4.5" />
        </g>

        {/* Far limbs, in shadow. */}
        <g className="jungle-hero-limb-b" style={{ transformOrigin: "58px 96px" }}>
          <path d={FAR_LEG} fill={back} />
          <ellipse cx="41" cy="122" rx="9" ry="5" fill={face} />
        </g>
        <g className="jungle-hero-limb-a" style={{ transformOrigin: "64px 66px" }}>
          <path d={FAR_ARM} fill={back} />
          <circle cx="47" cy="88" r="5" fill={face} />
        </g>

        {/* Body and belly. */}
        <ellipse cx="62" cy="82" rx="18" ry="22" fill={fur} transform="rotate(12 62 82)" />
        <ellipse cx="67" cy="86" rx="10" ry="14" fill={face} strokeWidth="3" transform="rotate(12 67 86)" />

        {/* Near leg. */}
        <g className="jungle-hero-limb-a" style={{ transformOrigin: "64px 98px" }}>
          <path d={NEAR_LEG} fill={fur} />
          <ellipse cx="82" cy="122" rx="9" ry="5" fill={face} />
        </g>

        {/* Headband tails, flapping behind the head. */}
        <g className="jungle-hero-flap" style={{ transformOrigin: "56px 30px" }}>
          <path d="M57 30 L36 21 L40 30 L34 37 Z" fill="var(--jungle-banana)" strokeWidth="3" />
        </g>

        {/* Head: a big ear, the round head, a heart-shaped face, eyes, nose, and a grin. */}
        <circle cx="51" cy="44" r="11" fill={fur} />
        <circle cx="51" cy="44" r="5.5" fill={face} strokeWidth="3" />
        <circle cx="72" cy="40" r="22" fill={fur} />
        <path d="M66 32 C 64 21, 79 19, 82 28 C 85 19, 100 22, 97 33 C 103 40, 100 55, 86 57 C 73 58, 63 50, 66 40 C 64 37, 64 34, 66 32 Z" fill={face} strokeWidth="3" />
        <circle cx="76" cy="33" r="5" fill="var(--paper-raised)" strokeWidth="2.5" />
        <circle cx="90" cy="33" r="5" fill="var(--paper-raised)" strokeWidth="2.5" />
        <circle cx="77.8" cy="33.6" r="2.4" fill="var(--ink)" stroke="none" />
        <circle cx="91.8" cy="33.6" r="2.4" fill="var(--ink)" stroke="none" />
        <circle cx="86" cy="43" r="1.4" fill="var(--ink)" stroke="none" />
        <circle cx="91" cy="43" r="1.4" fill="var(--ink)" stroke="none" />
        <path d="M78 48 C 83 54, 92 54, 97 47" fill="none" strokeWidth="3" />
        <path d="M54 30 C 62 17, 84 13, 95 21 L93 26 C 84 20, 66 22, 57 35 Z" fill="var(--jungle-banana)" strokeWidth="3" />

        {/* Near arm, pumping forward. */}
        <g className="jungle-hero-limb-b" style={{ transformOrigin: "70px 66px" }}>
          <path d={NEAR_ARM} fill={fur} />
          <circle cx="94" cy="79" r="5.5" fill={face} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Jungle run hero: a monkey runs through a parallax jungle (hills, palms,
 * hanging vines, and the ground scrolling at their own speeds), leaping to
 * grab a banana every few seconds.
 * The headline and buttons sit in the sky above it. No JavaScript: a server
 * component, with CSS animation that holds still for reduced motion.
 */
export function JungleHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const peakAt = `${(PEAK * 100).toFixed(1)}%`;
  return (
    <section
      className="@container relative isolate overflow-hidden border-b-4 border-ink text-ink"
      style={{ ...PALETTE, backgroundColor: "var(--jungle-sky)" }}
    >
      <style href="jungle-hero" precedence="default">{`
        @keyframes jungle-hero-scroll { to { translate: -50% 0; } }
        @keyframes jungle-hero-stride { 0%, 100% { rotate: -22deg; } 50% { rotate: 22deg; } }
        @keyframes jungle-hero-flap { 0%, 100% { rotate: 0deg; } 50% { rotate: -14deg; } }
        @keyframes jungle-hero-tail { 0%, 100% { rotate: -6deg; } 50% { rotate: 8deg; } }
        @keyframes jungle-hero-bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
        @keyframes jungle-hero-leap {
          0%, ${((PEAK - 0.16) * 100).toFixed(1)}%, 100% { translate: 0 0; rotate: 0deg; }
          ${peakAt} { translate: 0 calc(var(--leap) * -1); rotate: -8deg; }
          ${((PEAK + 0.16) * 100).toFixed(1)}% { translate: 0 0; rotate: 0deg; }
        }
        @keyframes jungle-hero-banana {
          0% { left: 108%; opacity: 1; }
          ${peakAt} { left: calc(var(--ape-x) + 3rem); opacity: 1; }
          ${((PEAK + 0.001) * 100).toFixed(1)}%, 100% { left: calc(var(--ape-x) + 3rem); opacity: 0; }
        }
        @keyframes jungle-hero-plus {
          0%, ${peakAt} { opacity: 0; translate: 0 0; scale: .5; }
          ${((PEAK + 0.04) * 100).toFixed(1)}% { opacity: 1; scale: 1.2; }
          ${((PEAK + 0.22) * 100).toFixed(1)}% { opacity: 1; translate: 0 -24px; scale: 1; }
          ${((PEAK + 0.28) * 100).toFixed(1)}%, 100% { opacity: 0; translate: 0 -30px; }
        }
        @keyframes jungle-hero-sway { 0%, 100% { rotate: -3deg; } 50% { rotate: 3deg; } }
        .jungle-hero-hills { animation: jungle-hero-scroll 36s linear infinite; }
        .jungle-hero-palms { animation: jungle-hero-scroll 14s linear infinite; }
        .jungle-hero-ground { animation: jungle-hero-scroll 5s linear infinite; }
        .jungle-hero-runner { animation: jungle-hero-leap ${CYCLE}s cubic-bezier(.3,0,.4,1) infinite; }
        .jungle-hero-body { animation: jungle-hero-bob .32s ease-in-out infinite; }
        .jungle-hero-limb-a { animation: jungle-hero-stride .32s ease-in-out infinite; }
        .jungle-hero-limb-b { animation: jungle-hero-stride .32s ease-in-out -.16s infinite; }
        .jungle-hero-banana { animation: jungle-hero-banana ${CYCLE}s linear infinite; }
        .jungle-hero-plus { animation: jungle-hero-plus ${CYCLE}s ease-out infinite; }
        .jungle-hero-flap { animation: jungle-hero-flap .2s ease-in-out infinite; }
        .jungle-hero-tail { animation: jungle-hero-tail .64s ease-in-out infinite; }
        .jungle-hero-vine { animation: jungle-hero-sway 5s ease-in-out infinite; transform-origin: top center; }
        @media (prefers-reduced-motion: reduce) {
          .jungle-hero-hills, .jungle-hero-palms, .jungle-hero-ground, .jungle-hero-runner, .jungle-hero-body,
          .jungle-hero-limb-a, .jungle-hero-limb-b, .jungle-hero-banana, .jungle-hero-plus, .jungle-hero-flap, .jungle-hero-tail, .jungle-hero-vine { animation: none; }
          .jungle-hero-banana { left: 60%; }
          .jungle-hero-plus { opacity: 0; }
        }
      `}</style>

      {/* The scene, behind the copy: everything decorative. */}
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--ape-x": "16%", "--leap": "6.5rem" } as CSSProperties}>
        {/* A low sun. */}
        <span className="absolute top-[42%] left-[9%] hidden size-20 rounded-full border-4 border-ink @3xl:block @3xl:size-24" style={{ backgroundColor: "var(--jungle-banana)" }} />

        {/* Far hills, slowest. */}
        <div className="jungle-hero-hills absolute bottom-16 flex h-40 w-[200%] @3xl:bottom-20 @3xl:h-48">
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 400 100" preserveAspectRatio="none" className="h-full w-1/2">
              <path d={HILLS} fill="var(--jungle-hill)" />
              <path d={RIDGE} fill="none" stroke="var(--ink)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          ))}
        </div>

        {/* Palms, middle speed. */}
        <div className="jungle-hero-palms absolute bottom-16 flex h-56 w-[200%] @3xl:bottom-20">
          {[0, 1].map((k) => (
            <div key={k} className="relative h-full w-1/2">
              {PALMS.map((p) => (
                <Palm key={p.left} {...p} />
              ))}
            </div>
          ))}
        </div>

        {/* Vines hanging from the top edge, swaying; only on wide scenes, where they clear the headline. */}
        {[3, 10, 90, 97].map((x, i) => (
          <span
            key={x}
            className="jungle-hero-vine absolute top-0 hidden w-2 border-x-[3px] border-ink @6xl:block"
            style={{ left: `${x}%`, height: `${[30, 16, 20, 34][i]}%`, backgroundColor: "var(--jungle-leaf)", animationDelay: `${-i * 1.3}s` }}
          >
            <span className="absolute -bottom-3 -left-3 block size-6 rounded-full border-[3px] border-ink" style={{ backgroundColor: "var(--jungle-leaf-dark)" }} />
          </span>
        ))}

        {/* The ground, fastest: grass on top, hatched dirt below. */}
        <div className="jungle-hero-ground absolute bottom-0 flex h-16 w-[200%] @3xl:h-20">
          {[0, 1].map((k) => (
            <div
              key={k}
              className="h-full w-1/2 border-t-4 border-ink"
              style={{
                backgroundColor: "var(--jungle-dirt)",
                backgroundImage:
                  "linear-gradient(var(--jungle-grass) 0 14px, var(--ink) 14px 17px, transparent 17px), repeating-linear-gradient(-45deg, transparent 0 14px, color-mix(in oklab, var(--ink) 18%, transparent) 14px 17px)",
              }}
            />
          ))}
        </div>

        {/* The runner, on the grass. */}
        <div className="absolute bottom-[3.25rem] size-28 @3xl:bottom-[4.25rem] @3xl:size-36" style={{ left: "var(--ape-x)" }}>
          <div className="jungle-hero-runner size-full origin-bottom">
            <div className="jungle-hero-body size-full">
              <Ape />
            </div>
          </div>
        </div>

        {/* The banana it leaps for, and the +1 when it lands in hand. */}
        <Banana
          className="jungle-hero-banana absolute bottom-[12rem] w-14 -rotate-12 @3xl:bottom-[14.5rem] @3xl:w-16"
          style={{ left: "60%" }}
        />
        <span
          className="jungle-hero-plus absolute bottom-[13.5rem] border-[3px] border-ink bg-paper-raised px-1.5 font-mono text-sm font-bold opacity-0 shadow-[3px_3px_0_var(--ink)] @3xl:bottom-[16rem]"
          style={{ left: "calc(var(--ape-x) + 3.5rem)" }}
        >
          +1
        </span>

      </div>

      {/* The copy, in the sky. Bottom padding keeps it clear of the jungle. */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-80 text-center @3xl:pt-24 @3xl:pb-96">
        <Heading className="font-display text-4xl leading-[1.02] tracking-tight @md:text-5xl @3xl:text-7xl">
          Go{" "}
          <span className="inline-block -rotate-2 border-4 border-ink px-3 shadow-[6px_6px_0_var(--ink)]" style={{ backgroundColor: "var(--jungle-banana)" }}>
            bananas
          </span>{" "}
          on launch day.
        </Heading>
        <p className="mt-6 max-w-xl text-lg leading-relaxed @3xl:text-xl">
          Acme swings your launch page from idea to live, vine to vine, without dropping a single banana.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-13 items-center gap-2 border-4 border-ink bg-ink px-6 font-mono text-sm font-bold text-paper uppercase shadow-[5px_5px_0_var(--jungle-leaf-dark)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--jungle-leaf-dark)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none"
          >
            Start swinging <ArrowRight aria-hidden className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-13 items-center border-4 border-ink bg-paper-raised px-6 font-mono text-sm font-bold uppercase shadow-[5px_5px_0_var(--ink)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none"
          >
            See the code
          </a>
        </div>
      </div>
    </section>
  );
}
