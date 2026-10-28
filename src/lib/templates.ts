import type { StaticImageData } from "next/image";
import { env } from "./env";
import saasHero from "@/assets/templates/saas/hero.jpg";
import saasFeatures from "@/assets/templates/saas/features.jpg";
import saasTestimonials from "@/assets/templates/saas/testimonials.jpg";
import saasPricing from "@/assets/templates/saas/pricing.jpg";
import saasFaq from "@/assets/templates/saas/faq.jpg";
import saasFooter from "@/assets/templates/saas/footer.jpg";

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  /** One-time price in US dollars. */
  price: number;
  demoUrl: string;
  /** The store's checkout link, from the environment. Empty means not on sale yet. */
  checkoutUrl: string;
  /** The cover first, then a few more screens (the home page card shows these). */
  shots: Shot[];
  /** Every screen, for the template's own page. */
  gallery: Shot[];
  includes: string[];
  stack: string[];
  /** Each section of the template, for the "What's inside" list. */
  sections: { name: string; text: string }[];
  faq: { question: string; answer: string }[];
  /** Search copy: the title leads with the phrase people search for; the description stays ≤ 160 characters. */
  seo: { title: string; description: string; keywords: string[] };
};

export type Shot = { src: StaticImageData; alt: string };

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
    gallery: [
      { src: saasHero, alt: "The hero: a big headline beside 3D keycaps and comic speech bubbles" },
      { src: saasFeatures, alt: "A feature row with browser and phone mockups in 3D" },
      { src: saasTestimonials, alt: "The wall of love: testimonial notes pinned on a grid" },
      { src: saasPricing, alt: "Pricing on a black band with a monthly and yearly switch" },
      { src: saasFaq, alt: "The FAQ, with an answer shown as a speech bubble" },
      { src: saasFooter, alt: "The footer, with link columns and the name in silver" },
    ],
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
    sections: [
      { name: "Navbar", text: "Edge-to-edge bar with your logo, dotted icons, colored hovers, and a phone menu." },
      { name: "Hero", text: "A big headline beside 3D keycaps you can click or type, comic speech bubbles, and roaming cursors." },
      { name: "Trusted by", text: "A black band of client logos gliding past, with comic halftone corners." },
      { name: "Features", text: "Three rows with browser and phone mockups in 3D and floating cards. Drop in your own screenshots, videos, or components." },
      { name: "Wall of love", text: "Testimonial notes pinned and taped up, gliding past in three rows that pause under the pointer." },
      { name: "Pricing", text: "Plan cards on a black band, with a monthly / yearly switch and a highlighted plan." },
      { name: "FAQ", text: "Questions as numbered cards; each answer pops in as a speech bubble from your logo." },
      { name: "Footer", text: "Link columns under sticker headings, and your name set huge in brushed silver." },
      { name: "And the rest", text: "A matching 404 page, a favicon, a generated social preview image, a sitemap, and SEO metadata." },
    ],
    faq: [
      { question: "What do I get?", answer: "The full source code as a zip: a standalone Next.js project with a step-by-step README. Install it, edit site.config.ts, and deploy." },
      { question: "Can I use it for client work?", answer: "Yes. Build unlimited sites for yourself or your clients. You can't resell or redistribute the template itself." },
      { question: "Is it a subscription?", answer: "No. You pay once and keep it, including updates to this version." },
      { question: "What do I need to run it?", answer: "Node.js 20.9 or newer (or Bun) and any package manager. It deploys to any host that runs Next.js, including Vercel and Netlify." },
      { question: "Do I need to know stream/ui?", answer: "No. The template installs the stream/ui package from npm on its own, and everything you'd change is in one config file." },
    ],
    seo: {
      title: "SaaS Launch: Next.js SaaS Landing Page Template",
      description: "A neobrutalism SaaS landing page template for Next.js and Tailwind: hero, device mockups, testimonials, pricing, FAQ. Full source, one-time price.",
      keywords: ["SaaS landing page template", "Next.js landing page template", "Next.js SaaS template", "neobrutalism template", "Tailwind landing page", "React landing page template", "startup landing page"],
    },
  },
];

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}
