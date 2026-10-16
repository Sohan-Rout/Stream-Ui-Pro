import { siteConfig } from "./site";

export type FundingConfig = typeof siteConfig.funding;

export type FundingPlatform = {
  id: "githubSponsors" | "razorpay";
  name: string;
  /** Link to pay or sponsor; empty if only a QR code is configured. */
  url: string;
  /** Image URL of a payment QR code, if any. */
  qr: string;
  blurb: string;
  cta: string;
  tone: "pink" | "blue";
};

/** Platforms with a link or QR code configured, in display order. */
export function configuredPlatforms(funding: FundingConfig): FundingPlatform[] {
  const platforms: FundingPlatform[] = [
    {
      id: "githubSponsors",
      name: "GitHub Sponsors",
      url: funding.githubSponsors.trim(),
      qr: "",
      blurb: "Monthly or one-time, straight from your GitHub account. GitHub takes no fee, so all of it goes to the project.",
      cta: "Sponsor on GitHub",
      tone: "pink",
    },
    {
      id: "razorpay",
      name: "UPI via Razorpay",
      url: funding.razorpay.trim(),
      qr: funding.razorpayQr.trim(),
      blurb: "For supporters in India. Scan the code with any UPI app, like Google Pay, PhonePe, or Paytm.",
      cta: "Pay with Razorpay",
      tone: "blue",
    },
  ];
  return platforms.filter((p) => p.url !== "" || p.qr !== "");
}

/** Platforms configured through the FUNDING_* environment variables. */
export const fundingPlatforms = configuredPlatforms(siteConfig.funding);
