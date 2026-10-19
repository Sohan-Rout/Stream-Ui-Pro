"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@streamuilib/react";

type Billing = "monthly" | "yearly";

/** Each plan is a full card of one bright; the featured one lifts and tilts. */
const plans = [
  {
    name: "Starter",
    blurb: "For side projects and trying things out.",
    price: { monthly: 0, yearly: 0 },
    features: ["1 project", "7-day history", "Community support"],
    cta: "Start free",
    tone: "bg-orange",
  },
  {
    name: "Pro",
    blurb: "For teams shipping every day.",
    price: { monthly: 24, yearly: 19 },
    features: ["Unlimited projects", "90-day history", "Smart alerts", "Email support"],
    cta: "Start trial",
    tone: "bg-lime",
    featured: true,
  },
  {
    name: "Enterprise",
    blurb: "For orgs with security reviews.",
    price: { monthly: 59, yearly: 49 },
    features: ["Everything in Pro", "SSO and audit logs", "Data residency", "Dedicated support"],
    cta: "Contact sales",
    tone: "bg-pink",
  },
];

/**
 * Color-block pricing: three full-bright plan cards with thick ink borders
 * and hard shadows, the featured one lifted and tilted with a sticker, and a
 * monthly/yearly switch. Hover lifts only when motion is allowed.
 */
export function BoldPricingSection() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section className="@container bg-paper bg-dots text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 @3xl:gap-14 @3xl:px-10 @3xl:py-20">
        <header className="flex flex-col items-center gap-6 text-center">
          <p className="border-2 border-ink bg-paper-raised px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase shadow-brutal-sm">
            Pricing
          </p>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight @3xl:text-6xl">
            Pick a plan. <span className="bg-ink px-2 text-paper">Ship louder.</span>
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
                  billing === b ? "bg-ink text-paper" : "hover:bg-lime-soft",
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

        <ul className="grid grid-cols-1 items-start gap-8 @3xl:grid-cols-3 @3xl:gap-6 @5xl:gap-8">
          {plans.map((p) => (
            <li
              key={p.name}
              className={cn(
                "relative flex flex-col gap-6 border-4 border-ink p-7 text-on-bright @3xl:p-5 @5xl:p-7 transition-[translate,box-shadow] duration-150 hover:-translate-x-1 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-0",
                p.tone,
                p.featured
                  ? "shadow-[12px_12px_0_0_var(--ink)] hover:shadow-[16px_16px_0_0_var(--ink)] @3xl:-translate-y-4 @3xl:-rotate-1 @3xl:hover:-translate-y-5"
                  : "shadow-[8px_8px_0_0_var(--ink)] hover:shadow-[12px_12px_0_0_var(--ink)]",
              )}
            >
              {p.featured && (
                <span className="absolute -top-4 right-5 rotate-3 border-4 border-ink bg-pink px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase shadow-brutal-sm">
                  Most popular
                </span>
              )}
              <div>
                <h3 className="inline-block bg-ink px-2.5 py-1 font-mono text-sm font-bold tracking-widest text-paper uppercase">{p.name}</h3>
                <p className="mt-4 text-base font-medium">{p.blurb}</p>
              </div>
              <p className="flex items-end gap-2 border-y-4 border-ink py-5">
                <span className="font-display text-6xl leading-none tracking-tight @3xl:text-5xl @5xl:text-7xl">${p.price[billing]}</span>
                <span className="pb-1 font-mono text-xs font-bold uppercase">
                  / seat
                  <br />/ month
                </span>
              </p>
              <ul className="flex flex-1 flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium">
                    <span aria-hidden className="grid size-6 shrink-0 place-items-center border-2 border-ink bg-paper-raised">
                      <Check className="size-3.5" strokeWidth={3.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="group inline-flex h-13 items-center justify-center gap-2 border-4 border-ink bg-ink px-3 font-mono text-sm font-bold whitespace-nowrap text-paper uppercase transition-colors duration-150 hover:bg-paper-raised hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                {p.cta}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
