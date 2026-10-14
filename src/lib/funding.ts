import { siteConfig } from "./site";

export type FundingPlatform = {
  id: keyof typeof siteConfig.funding;
  name: string;
  url: string;
  blurb: string;
  cta: string;
  tone: "lime" | "pink" | "blue";
};

const all: FundingPlatform[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    url: siteConfig.funding.razorpay,
    blurb: "Best from India. Pay with UPI, cards, net banking, or wallets.",
    cta: "Pay with Razorpay",
    tone: "blue",
  },
  {
    id: "openCollective",
    name: "Open Collective",
    url: siteConfig.funding.openCollective,
    blurb: "Monthly or one-time, with a public ledger of every expense. Companies can get invoices.",
    cta: "Back on Open Collective",
    tone: "lime",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    url: siteConfig.funding.kofi,
    blurb: "A quick one-off tip by card or PayPal, from anywhere in the world.",
    cta: "Tip on Ko-fi",
    tone: "pink",
  },
];

/** Platforms with a link set in siteConfig.funding. */
export const fundingPlatforms = all.filter((p) => p.url !== "");
