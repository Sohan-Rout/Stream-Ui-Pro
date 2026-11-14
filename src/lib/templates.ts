import type { StaticImageData } from "next/image";
import { env } from "./env";
import saasHero from "@/assets/templates/saas/hero.jpg";
import saasFeatures from "@/assets/templates/saas/features.jpg";
import saasTestimonials from "@/assets/templates/saas/testimonials.jpg";
import saasPricing from "@/assets/templates/saas/pricing.jpg";
import saasFaq from "@/assets/templates/saas/faq.jpg";
import saasFooter from "@/assets/templates/saas/footer.jpg";
import agencyHero from "@/assets/templates/agency/hero.jpg";
import agencyResults from "@/assets/templates/agency/results.jpg";
import agencyPricing from "@/assets/templates/agency/pricing.jpg";
import agencyChannels from "@/assets/templates/agency/channels.jpg";
import agencyTestimonials from "@/assets/templates/agency/testimonials.jpg";
import agencyBlog from "@/assets/templates/agency/blog.jpg";
import agencyContact from "@/assets/templates/agency/contact.jpg";
import fintechHero from "@/assets/templates/fintech/hero.jpg";
import fintechAccounts from "@/assets/templates/fintech/accounts.jpg";
import fintechSupport from "@/assets/templates/fintech/support.jpg";
import fintechSavings from "@/assets/templates/fintech/savings.jpg";
import fintechSecurity from "@/assets/templates/fintech/security.jpg";
import fintechPricing from "@/assets/templates/fintech/pricing.jpg";
import fintechCta from "@/assets/templates/fintech/cta.jpg";

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  /** The design style it's built in, shown on its card and page. Templates don't all share one look. */
  style: string;
  /** Whether it's built from the stream/ui component library (so the Sections page can point to it). */
  fromLibrary: boolean;
  /** One-time price in US dollars. */
  price: number;
  /** The live demo. Empty means it isn't deployed yet, and the preview page 404s. */
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
 * The paid templates, newest first: the first one is featured on the home
 * page and wears the New badge. Each has its own design style; not all are
 * built from the component library. Their source lives in a private repo;
 * this site only shows screenshots and links to the live demo and the checkout.
 */
export const templates: Template[] = [
  {
    slug: "fintech",
    name: "Fintech",
    tagline: "A quiet, minimalist site for a money app, in solid black: a live balance, a card that flips, a support chat, savings goals, security, and pricing.",
    style: "Minimal, dark",
    fromLibrary: false,
    price: 39,
    demoUrl: env.demo.fintech,
    checkoutUrl: env.checkout.fintech,
    gallery: [
      { src: fintechHero, alt: "The hero: a two-line headline beside an app window with a rising balance, a trend line, and transaction toasts" },
      { src: fintechAccounts, alt: "Accounts: a glazed white debit card, a live transaction feed, and this month's cash flow" },
      { src: fintechSupport, alt: "Support: a chat window where a customer and an agent trade messages" },
      { src: fintechSavings, alt: "Savings: a monthly goal picker beside a goal estimate chart and money moving in and out" },
      { src: fintechSecurity, alt: "Security: four frames for face unlock, passkey, card freeze, and alerts" },
      { src: fintechPricing, alt: "Pricing: four plan cards in a window, the featured plan in white" },
      { src: fintechCta, alt: "The call to action: a Get started button with the tagline repeated around it like sun rays" },
    ],
    shots: [
      { src: fintechHero, alt: "Fintech hero: a headline beside an app window with a rising balance and transaction toasts" },
      { src: fintechAccounts, alt: "A glazed white debit card with a live transaction feed and cash flow" },
      { src: fintechSavings, alt: "A savings goal picker with a goal estimate chart" },
      { src: fintechSecurity, alt: "Four security frames: face unlock, passkey, card freeze, and alerts" },
    ],
    includes: [
      "An app window with a balance that keeps rising, a trend line, and toasts",
      "Accounts, support, savings, and security sections that animate themselves",
      "Reviews, four-plan pricing, and a sun-ray call to action",
      "Pauses off-screen, holds still for reduced motion, smooth in Safari",
      "All copy and numbers in one config file",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind v4", "TypeScript"],
    sections: [
      { name: "Notice and navbar", text: "A one-line notice strip, then your logo and full-width dropdown menus, with a rounded Open an account button." },
      { name: "Hero", text: "A two-line headline and an app window: the balance ticks up, a white trend line moves, and received and debited toasts stack up." },
      { name: "Case study", text: "A customer story: a headline, a quote, the person's name and role, and a link to read more." },
      { name: "Accounts", text: "A glazed white debit card that turns over to show the CVV, a live transaction feed, cash flow, and three animated highlights." },
      { name: "Support", text: "A support chat that plays itself: typing dots, messages, an attachment, and a composer with a send button." },
      { name: "Savings", text: "A goal picker whose amount steps up and down, a goal estimate chart that follows it, and inflow and outflow toasts." },
      { name: "Security", text: "Four frames that animate on their own: face unlock, a passkey being typed, a card freezing, and alerts counting up." },
      { name: "Reviews", text: "A heading beside a grid of brand wordmarks, then three review cards with photo placeholders." },
      { name: "Pricing", text: "Four plans in a window, the featured one in white, with a line to talk to sales." },
      { name: "Call to action and footer", text: "A Get started button with your tagline turning around it like sun rays, then the footer with four link columns." },
    ],
    faq: [
      { question: "What do I get?", answer: "The full source code as a zip: a standalone Next.js project with a step-by-step README. Install it, edit site.config.ts, and deploy." },
      { question: "Can I use it for client work?", answer: "Yes. Build unlimited sites for yourself or your clients. You can't resell or redistribute the template itself." },
      { question: "Is it a subscription?", answer: "No. You pay once and keep it, including updates to this version." },
      { question: "What do I need to run it?", answer: "Node.js 20.9 or newer (or Bun) and any package manager. It deploys to any host that runs Next.js, including Vercel and Netlify." },
      { question: "Are the numbers real?", answer: "No. Acme, the people, reviews, balances, rates, and prices are placeholders. Replace them with true figures and add the disclosures your regulator requires before you launch." },
    ],
    seo: {
      title: "Fintech: Dark Next.js Landing Page Template",
      description: "A dark, minimalist fintech landing page template for Next.js and Tailwind: live balance, cards, support chat, savings, security, pricing. One-time price.",
      keywords: ["fintech landing page template", "Next.js fintech template", "banking website template", "minimalist landing page template", "dark landing page template", "Tailwind landing page", "React website template"],
    },
  },
  {
    slug: "agency",
    name: "Studio",
    tagline: "A loud, cartoon-style site for a design studio or agency: animated results, pricing, every channel, a wall of love, a blog, and contact.",
    style: "Neobrutalism",
    fromLibrary: true,
    price: 39,
    demoUrl: env.demo.agency,
    checkoutUrl: env.checkout.agency,
    gallery: [
      { src: agencyHero, alt: "The hero: a headline with a yellow pill beside an art board of floating design cards" },
      { src: agencyResults, alt: "A results row: a campaign email with open and click-through cards on black" },
      { src: agencyPricing, alt: "Two plan cards with an annual and monthly switch and a Most picked sticker" },
      { src: agencyChannels, alt: "A 3D phone on black surrounded by real platform logos" },
      { src: agencyTestimonials, alt: "The wall of love: a carousel of quote cards, the side ones blurred" },
      { src: agencyBlog, alt: "Blog cards in a sideways row, each with a cover drawn in code" },
      { src: agencyContact, alt: "The call to action on black, with a spinning Let's talk sticker" },
    ],
    shots: [
      { src: agencyHero, alt: "Studio hero: a headline with a yellow pill beside an art board of floating design cards" },
      { src: agencyResults, alt: "A results row with a campaign email and stat cards" },
      { src: agencyChannels, alt: "A 3D phone surrounded by platform logos" },
      { src: agencyBlog, alt: "Blog cards with covers drawn in code" },
    ],
    includes: [
      "Hero with a floating art board and client strip",
      "Results rows whose cards pop in as you scroll",
      "Pricing, channels with real brand logos, and a wall of love",
      "A blog row, a call to action, and a footer",
      "All copy in one config file",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind v4", "TypeScript"],
    sections: [
      { name: "Navbar", text: "Your name, the links, and a round Contact us button with a dotted arrow that swings on hover." },
      { name: "Hero", text: "A headline with a yellow pill, your logo badge, client avatars and rating, and an art board of floating design cards." },
      { name: "Numbers", text: "Four big stats on black that count up as they come into view." },
      { name: "Services", text: "Six services with hand-drawn icons, halftone corners, and waves." },
      { name: "Results", text: "A launch report, a campaign email, and an automation flow whose cards pop in as you scroll, then gently float." },
      { name: "Pricing", text: "Two plans with an annual / monthly switch; the prices fade across, and the featured plan wears a sticker." },
      { name: "Channels", text: "A 3D phone on black with real platform logos bursting around it." },
      { name: "Wall of love", text: "An endless carousel of quotes; the middle card in focus, the edges softly blurred." },
      { name: "Blog", text: "Tall post cards in a sideways row, each with a cover drawn in code that springs open on hover." },
      { name: "Contact and footer", text: "A big call to action with a spinning sticker, then link columns and your name set huge." },
    ],
    faq: [
      { question: "What do I get?", answer: "The full source code as a zip: a standalone Next.js project with a step-by-step README. Install it, edit site.config.ts, and deploy." },
      { question: "Can I use it for client work?", answer: "Yes. Build unlimited sites for yourself or your clients. You can't resell or redistribute the template itself." },
      { question: "Is it a subscription?", answer: "No. You pay once and keep it, including updates to this version." },
      { question: "What do I need to run it?", answer: "Node.js 20.9 or newer (or Bun) and any package manager. It deploys to any host that runs Next.js, including Vercel and Netlify." },
      { question: "Are the brand logos included?", answer: "Yes, the platform logos come from Simple Icons. They're trademarks of their owners, so show only the platforms you actually work on." },
    ],
    seo: {
      title: "Studio: Next.js Agency Landing Page Template",
      description: "A neobrutalism agency landing page template for Next.js and Tailwind: animated results, pricing, testimonials, blog, contact. Full source, one-time price.",
      keywords: ["agency landing page template", "Next.js agency template", "design studio website template", "neobrutalism template", "Tailwind landing page", "React website template", "portfolio landing page"],
    },
  },
  {
    slug: "saas",
    name: "SaaS Launch",
    tagline: "A complete landing page for a software product, in the comic look: interactive hero, device mockups, pricing, FAQ, and more.",
    style: "Neobrutalism, comic",
    fromLibrary: true,
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
