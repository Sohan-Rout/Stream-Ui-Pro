"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@streamuilib/react";

type Billing = "monthly" | "yearly";

const plans = [
  {
    name: "Starter",
    blurb: "For side projects and trying things out.",
    price: { monthly: 0, yearly: 0 },
    features: ["1 project", "7-day history", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    blurb: "For teams shipping every day.",
    price: { monthly: 24, yearly: 19 },
    features: ["Unlimited projects", "90-day history", "Smart alerts", "Email support"],
    cta: "Start trial",
    featured: true,
  },
  {
    name: "Enterprise",
    blurb: "For orgs with security reviews.",
    price: { monthly: 59, yearly: 49 },
    features: ["Everything in Pro", "SSO and audit logs", "Data residency", "Dedicated support"],
    cta: "Contact sales",
  },
];

/** The mole's head and paws, peeking over the top of its sign. Gold moles wear a crown. */
function Mole({ gold, bonked, onBonk, plan }: { gold: boolean; bonked: boolean; onBonk: () => void; plan: string }) {
  const fur = gold ? "bg-lime" : "bg-violet";
  return (
    <button
      type="button"
      onClick={onBonk}
      aria-label={`Bonk the ${plan} mole`}
      className={cn(
        "relative mx-auto block w-28 origin-bottom cursor-pointer transition-transform duration-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none @3xl:w-32",
        bonked && "scale-y-75",
      )}
    >
      {gold && (
        <span
          aria-hidden
          className="absolute -top-5 left-1/2 z-10 block h-6 w-14 -translate-x-1/2 bg-ink [clip-path:polygon(0_100%,0_15%,25%_55%,50%_0,75%_55%,100%_15%,100%_100%)]"
        >
          <span className="absolute inset-[3px] bottom-0 block bg-orange [clip-path:polygon(0_100%,0_15%,25%_55%,50%_0,75%_55%,100%_15%,100%_100%)]" />
        </span>
      )}
      <span aria-hidden className={cn("relative block h-20 rounded-t-full border-4 border-b-0 border-ink @3xl:h-24", fur)}>
        <span className="absolute top-[36%] left-[26%] font-mono text-sm leading-none font-bold">{bonked ? "×" : "●"}</span>
        <span className="absolute top-[36%] right-[26%] font-mono text-sm leading-none font-bold">{bonked ? "×" : "●"}</span>
        <span className="absolute bottom-1 left-1/2 block h-6 w-14 -translate-x-1/2 rounded-full border-[3px] border-ink bg-paper-raised">
          <span className="absolute top-0.5 left-1/2 block size-3 -translate-x-1/2 rounded-full bg-pink ring-[3px] ring-ink" />
        </span>
      </span>
      {/* Paws gripping the sign. */}
      <span aria-hidden className={cn("absolute -bottom-3 -left-3 z-20 block size-6 rounded-full border-[3px] border-ink", fur)} />
      <span aria-hidden className={cn("absolute -right-3 -bottom-3 z-20 block size-6 rounded-full border-[3px] border-ink", fur)} />
    </button>
  );
}

/**
 * Whack-a-mole pricing: each plan is a sign held up by a mole popping out of
 * its hole on a grass field, the featured one by a crowned gold mole. They
 * pop up one after another, nudge up on hover, and squash with X eyes when
 * you bonk them. Motion holds still for reduced motion.
 */
export function WhackPricingSection() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const [bonked, setBonked] = useState<string | null>(null);
  const [bonks, setBonks] = useState(0);

  function bonk(plan: string) {
    setBonked(plan);
    setBonks((n) => n + 1);
    setTimeout(() => setBonked((b) => (b === plan ? null : b)), 380);
  }

  return (
    <section className="@container overflow-hidden bg-lime-soft bg-dots text-ink">
      <style href="whack-pricing" precedence="default">{`
        @keyframes whack-pricing-pop {
          0% { transform: translateY(105%); }
          55% { transform: translateY(-7%); }
          75% { transform: translateY(3%); }
          100% { transform: translateY(0); }
        }
        @keyframes whack-pricing-plus {
          from { opacity: 1; transform: translate(-50%, 0); }
          to { opacity: 0; transform: translate(-50%, -36px); }
        }
        .whack-pricing-rise { animation: whack-pricing-pop 0.7s cubic-bezier(0.2, 0.9, 0.3, 1) calc(var(--i) * 160ms + 150ms) both; }
        .whack-pricing-plus { animation: whack-pricing-plus 0.5s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .whack-pricing-rise, .whack-pricing-plus { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 pt-12 pb-6 @3xl:px-10 @3xl:pt-20">
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="border-2 border-ink bg-paper-raised px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase shadow-brutal-sm">
            Pricing{bonks > 0 && <span className="ml-2 text-ink-muted">· {bonks} bonked</span>}
          </p>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight @3xl:text-6xl">
            Whack the plan <span className="bg-violet px-2">that fits.</span>
          </h2>
          <div role="group" aria-label="Billing period" className="flex border-4 border-ink bg-paper-raised shadow-brutal">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                onClick={() => setBilling(b)}
                className={cn(
                  "cursor-pointer px-5 py-2.5 font-mono text-sm font-bold uppercase transition-colors duration-150 not-first:border-l-4 not-first:border-ink focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-blue",
                  billing === b ? "bg-ink text-paper" : "hover:bg-violet-soft",
                )}
              >
                {b}
                {b === "yearly" && (
                  <span className={cn("ml-2 border-2 px-1 text-xs", billing === b ? "border-lime bg-lime text-on-bright" : "border-ink")}>−20%</span>
                )}
              </button>
            ))}
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-14 @3xl:grid-cols-3 @3xl:gap-8">
          {plans.map((p, i) => (
            <li key={p.name} className="relative flex flex-col">
              {/* The hole's dark pit sits behind the sign... */}
              <span aria-hidden className="absolute inset-x-0 bottom-2 block h-12 rounded-[50%] border-4 border-ink bg-ink" />
              {/* ...everything above it rises out of the hole, and the dirt rim is drawn in front. */}
              {/* The clip ends inside the rim, so a rising sign never shows below its curve. */}
              <div className="group relative mb-6 flex flex-1 flex-col overflow-hidden pt-8">
                <div className="whack-pricing-rise flex flex-1 flex-col" style={{ "--i": i } as CSSProperties}>
                  <div className="flex flex-1 flex-col transition-transform duration-150 group-hover:-translate-y-2 motion-reduce:transition-none">
                    <div className="relative">
                      {bonked === p.name && (
                        <span aria-hidden className="whack-pricing-plus absolute -top-6 left-1/2 z-30 border-2 border-ink bg-lime px-1.5 font-mono text-xs font-bold">
                          +1
                        </span>
                      )}
                      <Mole gold={!!p.featured} bonked={bonked === p.name} onBonk={() => bonk(p.name)} plan={p.name} />
                    </div>
                    <div
                      className={cn(
                        "relative mx-3 flex flex-1 flex-col gap-5 border-4 border-ink px-6 pt-6 pb-10 shadow-[8px_8px_0_0_var(--ink)] @3xl:px-4 @5xl:px-6",
                        p.featured ? "bg-paper-raised" : "bg-paper",
                      )}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="inline-block bg-ink px-2.5 py-1 font-mono text-sm font-bold tracking-widest text-paper uppercase">{p.name}</h3>
                          {p.featured && (
                            <span className="rotate-3 border-2 border-ink bg-pink px-2 py-0.5 font-mono text-xs font-bold tracking-wider uppercase shadow-brutal-sm">
                              Most popular
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-ink-muted">{p.blurb}</p>
                      </div>
                      <p className="flex items-end gap-2">
                        <span className="font-display text-6xl leading-none tracking-tight @3xl:text-5xl @5xl:text-6xl">${p.price[billing]}</span>
                        <span className="pb-1 font-mono text-xs font-bold text-ink-muted uppercase">
                          / seat
                          <br />/ month
                        </span>
                      </p>
                      <ul className="flex flex-1 flex-col gap-2.5">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm font-medium">
                            <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center border-2 border-ink", p.featured ? "bg-lime" : "bg-violet-soft")}>
                              <Check className="size-3" strokeWidth={3.5} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        className={cn(
                          "group/cta inline-flex h-12 items-center justify-center gap-2 border-4 border-ink px-3 font-mono text-sm font-bold whitespace-nowrap uppercase @3xl:text-xs @5xl:text-sm shadow-brutal-sm transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none",
                          p.featured ? "bg-lime text-on-bright" : "bg-paper-raised",
                        )}
                      >
                        {p.cta}
                        <ArrowRight aria-hidden className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <span aria-hidden className="absolute -inset-x-1 bottom-0 z-20 block h-8 rounded-b-[50%] border-4 border-t-0 border-ink bg-orange" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
