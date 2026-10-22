import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/** A closed starburst through 2n points, centered in a 100×100 box. */
function burst(n: number, outer: number, inner: number) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const r = i % 2 ? inner : outer;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
}

const BIG_BURST = burst(16, 50, 36);
const SMALL_BURST = burst(12, 50, 34);

/**
 * A vintage print palette, not the library's brights: newsprint paper, faint
 * ink rays, a golden yellow, and one brick red. Set on the section as custom
 * properties, so it's one place to retune.
 */
const PALETTE = {
  "--comic-paper": "oklch(0.965 0.022 85)",
  "--comic-ray": "oklch(0.925 0.03 80)",
  "--comic-yellow": "oklch(0.87 0.12 88)",
  "--comic-red": "oklch(0.58 0.16 32)",
} as CSSProperties;

const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 11%, transparent) 1.3px, transparent 1.8px)",
  backgroundSize: "10px 10px",
};

/** Sound effects stuck around the cover: word, spot, tone, tilt, and when it pops in. */
const STICKERS = [
  { word: "Zap!", className: "top-[18%] left-[3%] @7xl:left-[7%]", fill: "var(--comic-yellow)", text: "var(--ink)", tilt: -12, at: 1.1 },
  { word: "Pow!", className: "top-[26%] right-[3%] @7xl:right-[7%]", fill: "var(--comic-red)", text: "var(--comic-paper)", tilt: 10, at: 1.3 },
  { word: "Wham!", className: "bottom-[12%] left-[5%] @7xl:left-[10%]", fill: "var(--paper-raised)", text: "var(--ink)", tilt: 8, at: 1.5 },
];

/**
 * Comic cover hero: the top of the page as a comic-book cover. A sunburst of
 * speed lines and halftone dots behind a masthead, a narration caption, a
 * headline that ends in a KA-BOOM! starburst, the pitch in a speech bubble,
 * two inked buttons, and sound effects stuck round the edges. Everything
 * pops in once; the rays turn slowly. No JavaScript: a server component, with
 * CSS animation that holds still for reduced motion.
 */
export function ComicHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  return (
    <section className="@container relative isolate overflow-hidden border-b-4 border-ink text-ink" style={{ ...PALETTE, backgroundColor: "var(--comic-paper)" }}>
      <style href="comic-hero" precedence="default">{`
        @keyframes comic-hero-rays { to { rotate: 360deg; } }
        @keyframes comic-hero-pop {
          0% { opacity: 0; transform: scale(.3) rotate(calc(var(--tilt, 0deg) - 20deg)); }
          60% { opacity: 1; transform: scale(1.12) rotate(calc(var(--tilt, 0deg) + 4deg)); }
          100% { opacity: 1; transform: scale(1) rotate(var(--tilt, 0deg)); }
        }
        @keyframes comic-hero-slide { from { opacity: 0; transform: translateY(24px) rotate(var(--tilt, 0deg)); } to { opacity: 1; transform: rotate(var(--tilt, 0deg)); } }
        @keyframes comic-hero-throb { 0%, 100% { scale: 1; } 50% { scale: 1.06; } }
        .comic-hero-rays { animation: comic-hero-rays 90s linear infinite; }
        .comic-hero-pop { animation: comic-hero-pop .5s cubic-bezier(.2,.9,.3,1.3) var(--at, 0s) both; }
        .comic-hero-slide { animation: comic-hero-slide .45s cubic-bezier(.2,.9,.3,1.1) var(--at, 0s) both; }
        .comic-hero-throb { animation: comic-hero-throb 1.6s ease-in-out 1.2s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .comic-hero-rays, .comic-hero-pop, .comic-hero-slide, .comic-hero-throb { animation: none; }
          .comic-hero-pop, .comic-hero-slide { transform: rotate(var(--tilt, 0deg)); }
        }
      `}</style>

      {/* The sunburst: alternating rays from just below the headline, turning slowly, with halftone over them. */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="comic-hero-rays absolute top-1/2 left-1/2 aspect-square w-[260%] -translate-1/2 @3xl:w-[180%]"
          style={{ background: "repeating-conic-gradient(var(--comic-ray) 0deg 7.5deg, var(--comic-paper) 7.5deg 15deg)" }}
        />
        <div className="absolute inset-0" style={DOTS} />
      </div>

      {/* The masthead strip across the top of the cover. */}
      <div aria-hidden className="flex items-stretch justify-between border-b-4 border-ink" style={{ backgroundColor: "var(--comic-red)", color: "var(--comic-paper)" }}>
        <span className="border-r-4 border-ink bg-ink px-3 py-1.5 font-display text-base tracking-tight text-paper @3xl:px-5 @3xl:text-2xl">
          ACME COMICS
        </span>
        <span className="flex items-center gap-3 px-3 font-mono text-xs font-bold tracking-widest uppercase @3xl:px-5 @3xl:text-sm">
          <span className="hidden @md:inline">Launch special</span>
          <span className="border-2 border-ink bg-paper-raised px-1.5 py-0.5 text-ink">No. 1</span>
        </span>
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-10 pb-16 text-center @3xl:pt-16 @3xl:pb-24">
        {/* Narration caption. */}
        <p
          className="comic-hero-slide border-[3px] border-ink px-3 py-1 font-mono text-xs font-bold tracking-wide uppercase shadow-[4px_4px_0_var(--ink)] @3xl:text-sm"
          style={{ "--tilt": "-2deg", "--at": "0.05s", backgroundColor: "var(--comic-yellow)" } as CSSProperties}
        >
          Meanwhile, at Acme HQ…
        </p>

        <Heading className="mt-6 flex flex-col items-center font-display leading-[0.95] tracking-tight">
          <span
            className="comic-hero-slide text-5xl @md:text-6xl @3xl:text-8xl @5xl:text-9xl"
            style={{ "--at": "0.2s", textShadow: "4px 4px 0 var(--comic-red)" } as CSSProperties}
          >
            Your launch
          </span>
          <span className="mt-2 flex flex-wrap items-center justify-center gap-x-4 @3xl:mt-3">
            <span
              className="comic-hero-slide text-5xl @md:text-6xl @3xl:text-8xl @5xl:text-9xl"
              style={{ "--at": "0.35s", textShadow: "4px 4px 0 var(--comic-red)" } as CSSProperties}
            >
              goes
            </span>
            {/* The punchline on a big starburst. */}
            <span className="comic-hero-pop relative grid place-items-center px-10 py-8 @3xl:px-16 @3xl:py-12" style={{ "--tilt": "-6deg", "--at": "0.55s" } as CSSProperties}>
              <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible" className="comic-hero-throb absolute inset-0 size-full drop-shadow-[6px_6px_0_var(--ink)]">
                <path d={BIG_BURST} className="stroke-ink" fill="var(--comic-yellow)" strokeWidth={4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="relative text-4xl @md:text-5xl @3xl:text-7xl @5xl:text-8xl" style={{ color: "var(--comic-red)", textShadow: "3px 3px 0 var(--ink)" }}>KA-BOOM!</span>
            </span>
          </span>
        </Heading>

        {/* The pitch, said out loud: a speech bubble with its tail pointing up at the headline. */}
        <div className="comic-hero-slide relative mt-10 max-w-xl" style={{ "--at": "0.8s", "--tilt": "1deg" } as CSSProperties}>
          <span aria-hidden className="absolute -top-[22px] left-12 block size-0 border-r-[22px] border-b-[24px] border-r-transparent border-b-ink" />
          <span aria-hidden className="absolute -top-[13px] left-[52px] block size-0 border-r-[14px] border-b-[15px] border-r-transparent border-b-paper-raised" />
          <p className="rounded-2xl border-4 border-ink bg-paper-raised px-5 py-4 text-lg leading-snug font-medium shadow-[6px_6px_0_var(--ink)] @3xl:px-7 @3xl:py-5 @3xl:text-xl">
            Acme turns your launch page into the front cover: loud, inked, and impossible to scroll past.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="comic-hero-pop inline-flex h-14 items-center gap-2 border-4 border-ink bg-ink px-7 font-display text-lg text-paper uppercase shadow-[6px_6px_0_var(--comic-red)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--comic-red)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none"
            style={{ "--tilt": "-2deg", "--at": "1s" } as CSSProperties}
          >
            Start the story <ArrowRight aria-hidden className="size-5" />
          </a>
          <a
            href="#"
            className="comic-hero-pop inline-flex h-14 items-center rounded-full border-4 border-ink bg-paper-raised px-7 font-display text-lg uppercase shadow-[6px_6px_0_var(--ink)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none"
            style={{ "--tilt": "2deg", "--at": "1.1s" } as CSSProperties}
          >
            See the code
          </a>
        </div>
      </div>

      {/* Sound effects stuck round the edges, only on wide covers where there's room beside the headline. */}
      {STICKERS.map((s) => (
        <span
          key={s.word}
          aria-hidden
          className={`comic-hero-pop absolute hidden size-24 place-items-center @6xl:grid @7xl:size-28 ${s.className}`}
          style={{ "--tilt": `${s.tilt}deg`, "--at": `${s.at}s` } as CSSProperties}
        >
          <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[4px_4px_0_var(--ink)]">
            <path d={SMALL_BURST} className="stroke-ink" fill={s.fill} strokeWidth={4} strokeLinejoin="round" />
          </svg>
          <span className="relative font-display text-lg @5xl:text-xl" style={{ color: s.text }}>{s.word}</span>
        </span>
      ))}
    </section>
  );
}
