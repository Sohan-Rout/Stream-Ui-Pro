import { siteConfig } from "./site";

export type FundingPlatform = {
  id: keyof typeof siteConfig.funding;
  name: string;
  url: string;
  blurb: string;
  cta: string;
  tone: "lime" | "pink";
};

/** Every supported platform; `url` is filled from config. */
const all: FundingPlatform[] = [
  {
    id: "openCollective",
    name: "Open Collective",
    url: "",
    blurb: "Monthly or one-time, with a public ledger of every expense. Companies can get invoices.",
    cta: "Back on Open Collective",
    tone: "lime",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    url: "",
    blurb: "A quick one-off tip by card or PayPal, from anywhere in the world.",
    cta: "Tip on Ko-fi",
    tone: "pink",
  },
];

/** Platforms that have a link set, in display order. */
export function configuredPlatforms(funding: Record<FundingPlatform["id"], string>) {
  return all.map((p) => ({ ...p, url: funding[p.id].trim() })).filter((p) => p.url !== "");
}

/** Platforms with a link set in siteConfig.funding. */
export const fundingPlatforms = configuredPlatforms(siteConfig.funding);
