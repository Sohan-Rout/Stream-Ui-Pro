"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@streamuilib/react";

export const legalPages = [
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms of use", href: "/legal/terms" },
  { label: "Cookie policy", href: "/legal/cookies" },
];

export function LegalNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Legal pages"
      className="border-b-2 border-ink bg-paper px-5 py-5 sm:px-10 lg:w-64 lg:shrink-0 lg:border-r-2 lg:border-b-0 lg:px-6 lg:py-14"
    >
      <p className="font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">Legal</p>
      <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col">
        {legalPages.map((page) => {
          const current = pathname === page.href;
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "block border-2 px-3 py-1.5 text-sm font-semibold transition-colors",
                  current
                    ? "border-ink bg-lime text-on-bright shadow-brutal-sm"
                    : "border-transparent hover:border-ink",
                )}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
