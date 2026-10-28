import type { StaticImageData } from "next/image";
import { env } from "./env";
import saasHero from "@/assets/templates/saas/hero.jpg";
import saasFeatures from "@/assets/templates/saas/features.jpg";
import saasTestimonials from "@/assets/templates/saas/testimonials.jpg";
import saasPricing from "@/assets/templates/saas/pricing.jpg";

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  /** One-time price in US dollars. */
  price: number;
  demoUrl: string;
  /** The store's checkout link, from the environment. Empty means not on sale yet. */
  checkoutUrl: string;
  /** The cover first, then a few more screens. */
  shots: { src: StaticImageData; alt: string }[];
  includes: string[];
  stack: string[];
};

/**
 * The paid templates. Their source lives in a private repo; this site only
 * shows screenshots and links to the live demo and the checkout.
 */
export const templates: Template[] = [
  {
    slug: "saas",
    name: "SaaS Launch",
    tagline: "A complete landing page for a software product, in the comic look: interactive hero, device mockups, pricing, FAQ, and more.",
    price: 29,
    demoUrl: "https://saas-var-1.vercel.app",
    checkoutUrl: env.checkout.saas,
    shots: [
      { src: saasHero, alt: "SaaS Launch hero: a big headline beside 3D keycaps and comic speech bubbles" },
      { src: saasFeatures, alt: "A feature row with browser and phone mockups" },
      { src: saasTestimonials, alt: "The wall of love: testimonial notes pinned on a grid" },
      { src: saasPricing, alt: "Pricing on a black band with three plan cards" },
    ],
    includes: [
      "Hero with clickable 3D keycaps",
      "Feature rows with browser and phone mockups",
      "Testimonials, pricing, and FAQ",
      "Footer, 404 page, and a social preview image",
      "All copy in one config file",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind v4", "TypeScript"],
  },
];

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}
