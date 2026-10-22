"use client";

import { IntentLink as Link } from "@/components/ui/IntentLink";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex h-full border-l-2 border-ink">
      {items.map((item) => (
        <li key={item.href} className="h-full border-r-2 border-ink">
          <Link
            href={item.href}
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            className="flex h-full items-center px-5 text-sm font-semibold transition-colors duration-150 hover:bg-lime hover:text-on-bright aria-[current=page]:bg-lime aria-[current=page]:text-on-bright"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
