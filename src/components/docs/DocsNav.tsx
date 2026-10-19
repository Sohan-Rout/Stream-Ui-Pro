"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@streamuilib/react";

export type NavGroup = {
  title: string;
  href: string;
  items: { label: string; href: string }[];
};

function NavList({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8">
      {groups.map((g) => (
        <div key={g.href}>
          <Link
            href={g.href}
            aria-current={pathname === g.href ? "page" : undefined}
            className="font-mono text-xs font-bold tracking-widest uppercase underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2"
          >
            {g.title}
          </Link>
          {g.items.length > 0 && (
            <ul className="mt-3 flex flex-col border-l-2 border-ink">
              {g.items.map((item) => {
                // A variant page like /sections/hero/prompt keeps "Hero" highlighted.
                const here = pathname === item.href;
                const active = here || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={here ? "page" : active ? "true" : undefined}
                      className={cn(
                        "-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-150",
                        active
                          ? "border-ink bg-lime font-bold text-on-bright"
                          : "border-transparent text-ink-muted hover:border-ink hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function DocsSidebar({ groups }: { groups: NavGroup[] }) {
  return (
    <aside aria-label="Library" className="hidden w-60 shrink-0 border-r-2 border-ink lg:block">
      <nav className="sticky top-16 max-h-[calc(100dvh-4rem)] scrollbar-none overflow-y-auto p-6">
        <NavList groups={groups} />
      </nav>
    </aside>
  );
}

/** Small screens: the same navigation in a disclosure above the content. */
export function DocsMobileNav({ groups }: { groups: NavGroup[] }) {
  return (
    <details className="group border-b-2 border-ink lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 font-mono text-xs font-bold tracking-widest uppercase [&::-webkit-details-marker]:hidden">
        Browse the library
        <ChevronDown aria-hidden className="size-4 transition-transform duration-150 group-open:rotate-180" />
      </summary>
      <nav aria-label="Library" className="border-t-2 border-ink px-5 py-6">
        <NavList groups={groups} />
      </nav>
    </details>
  );
}
