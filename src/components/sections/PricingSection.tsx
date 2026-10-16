"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn, Badge, Button } from "@streamuilib/react";

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

/** Three-tier pricing with a monthly/yearly switch. */
export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <section className="@container bg-paper">
      <header className="flex flex-col gap-6 border-b-2 border-ink p-8 @3xl:flex-row @3xl:items-end @3xl:justify-between @3xl:p-12">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Pricing</p>
          <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight @3xl:text-4xl">
            Pay for what you ship.
          </h2>
        </div>
        <div role="group" aria-label="Billing period" className="flex self-start border-2 border-ink shadow-brutal-sm">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={billing === b}
              onClick={() => setBilling(b)}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm font-bold capitalize transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
                billing === b ? "bg-ink text-paper" : "bg-paper-raised hover:bg-lime-soft",
              )}
            >
              {b}
              {b === "yearly" && <span className="ml-1.5 font-mono text-xs">−20%</span>}
            </button>
          ))}
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-0.5 bg-ink @3xl:grid-cols-3">
        {plans.map((p) => (
          <li key={p.name} className={cn("flex flex-col gap-6 p-8", p.featured ? "bg-lime-soft" : "bg-paper")}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
              {p.featured && <Badge tone="pink">Most popular</Badge>}
            </div>
            <p className="text-ink-muted">{p.blurb}</p>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl tracking-tight">${p.price[billing]}</span>
              <span className="font-mono text-xs text-ink-muted">/ seat / month</span>
            </p>
            <ul className="flex flex-1 flex-col gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span aria-hidden className="grid size-5 shrink-0 place-items-center border-2 border-ink bg-paper-raised">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={p.featured ? "primary" : "secondary"} className="w-full">
              {p.cta}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
