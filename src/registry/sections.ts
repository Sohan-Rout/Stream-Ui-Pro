import type { ComponentType } from "react";
import type { SectionSlug } from "@/components/blocks/SectionThumbs";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";

export type SectionDoc = {
  slug: SectionSlug;
  name: string;
  description: string;
  file: string;
  Component: ComponentType;
  uses: string[];
  notes: string[];
};

export const sections: SectionDoc[] = [
  {
    slug: "hero",
    name: "Hero",
    description: "A split hero with a pitch, two calls to action, and a product glimpse.",
    file: "src/components/sections/HeroSection.tsx",
    Component: HeroSection,
    uses: ["Button", "Badge"],
    notes: ["Stacks on narrow containers; splits into two columns from 48rem.", "Swap the chart card for a screenshot or illustration."],
  },
  {
    slug: "features",
    name: "Features",
    description: "Six features in a ruled grid, each with a toned icon tile.",
    file: "src/components/sections/FeaturesSection.tsx",
    Component: FeaturesSection,
    uses: ["lucide-react"],
    notes: ["One, two, or three columns depending on the container width.", "Keep feature copy to one sentence so rows stay even."],
  },
  {
    slug: "pricing",
    name: "Pricing",
    description: "Three plans with a monthly/yearly switch and a highlighted tier.",
    file: "src/components/sections/PricingSection.tsx",
    Component: PricingSection,
    uses: ["Button", "Badge"],
    notes: ["The billing switch is a pressed-button group, announced as a toggle.", "Prices live in one array; edit plans there."],
  },
  {
    slug: "testimonials",
    name: "Testimonials",
    description: "Three customer quotes with names and roles.",
    file: "src/components/sections/TestimonialsSection.tsx",
    Component: TestimonialsSection,
    uses: ["Avatar"],
    notes: ["Each quote is a figure with blockquote and figcaption.", "Replace the sample quotes with real ones before shipping."],
  },
  {
    slug: "faq",
    name: "FAQ",
    description: "An accordion of common questions next to a contact line.",
    file: "src/components/sections/FaqSection.tsx",
    Component: FaqSection,
    uses: ["lucide-react"],
    notes: ["Built on native <details>, so it works without JavaScript.", "The first item starts open."],
  },
  {
    slug: "footer",
    name: "Footer",
    description: "A newsletter signup and three columns of links.",
    file: "src/components/sections/FooterSection.tsx",
    Component: FooterSection,
    uses: ["Input", "Button"],
    notes: ["Each link column is its own labelled nav landmark.", "Point the form action at your email provider."],
  },
];

export function getSection(slug: string) {
  return sections.find((s) => s.slug === slug);
}
