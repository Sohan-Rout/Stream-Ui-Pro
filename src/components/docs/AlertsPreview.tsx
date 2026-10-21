import type { CSSProperties } from "react";
import { ComicAlert } from "@streamuilib/react";

/** One 6s loop. */
const LOOP = 6;

const STACK = [
  { tone: "info", title: "New message", at: 0.2, top: "2%", left: "4%", rot: -1.5 },
  { tone: "success", title: "Saved!", at: 1.0, top: "36%", left: "14%", rot: 1 },
  { tone: "danger", title: "Card failed", at: 1.9, top: "70%", left: "2%", rot: -1 },
] as const;

/**
 * The Alerts tile on /components: comic alerts pop in one after another like
 * incoming notifications, the danger one slamming in with a shake that jolts
 * the board, and then they all swoosh away. Pure CSS; a still stack for
 * reduced motion.
 */
export function AlertsPreview() {
  return (
    <div className="alerts-preview relative h-44 w-full max-w-md">
      <style href="alerts-preview" precedence="default">{`
        @keyframes alerts-in {
          0% { opacity: 0; transform: translateX(-40px) scale(.6) rotate(-6deg); }
          5% { opacity: 1; transform: translateX(6px) scale(1.06) rotate(var(--rot)); }
          9%, 70% { opacity: 1; transform: translateX(0) scale(1) rotate(var(--rot)); }
          78%, 100% { opacity: 0; transform: translateX(120%) scale(.9) rotate(8deg); }
        }
        @keyframes alerts-shake {
          0%, 6%, 15%, 100% { translate: 0 0; }
          8% { translate: -5px 0; }
          10% { translate: 5px 0; }
          12% { translate: -3px 0; }
          14% { translate: 2px 0; }
        }
        @keyframes alerts-jolt {
          0%, 31%, 37%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-3px, 2px); }
          35% { transform: translate(3px, -1px); }
        }
        .alerts-preview .ap-item { animation: alerts-in ${LOOP}s cubic-bezier(.2,.9,.3,1.1) var(--at) infinite both; }
        .alerts-preview .ap-shake { animation: alerts-shake ${LOOP}s ease-in-out var(--at) infinite; }
        .alerts-preview .ap-board { animation: alerts-jolt ${LOOP}s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .alerts-preview .ap-item, .alerts-preview .ap-shake, .alerts-preview .ap-board { animation: none; }
          .alerts-preview .ap-item { transform: rotate(var(--rot)); }
        }
      `}</style>
      <div className="ap-board absolute inset-0">
        {STACK.map((a) => (
          <div
            key={a.tone}
            aria-hidden
            className="ap-item absolute w-[78%] origin-left"
            style={{ top: a.top, left: a.left, "--at": `${a.at}s`, "--rot": `${a.rot}deg` } as CSSProperties}
          >
            <div className={a.tone === "danger" ? "ap-shake" : undefined} style={{ "--at": `${a.at}s` } as CSSProperties}>
              {/* role="none": a picture of alerts, not live announcements. */}
              <ComicAlert role="none" tone={a.tone} title={a.title} className="[&_.sui-comic-alert-burst]:scale-[.62] [&_.sui-comic-alert-burst]:-mr-3 [&_p]:text-xs [&_.rounded-2xl]:px-3 [&_.rounded-2xl]:py-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The Comic card inside Alerts: one alert, small enough for the card. */
export function ComicAlertPreview() {
  return (
    <ComicAlert role="none" tone="warning" title="Almost out of seats" className="w-full max-w-sm">
      9 of 10 seats used.
    </ComicAlert>
  );
}
