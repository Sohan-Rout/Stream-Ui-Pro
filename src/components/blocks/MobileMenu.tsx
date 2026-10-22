"use client";

import { useEffect, useState } from "react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn, buttonStyles } from "@streamuilib/react";

type NavItem = { label: string; href: string };

export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className={buttonStyles({ variant: "secondary", size: "icon", className: "size-10" })}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={cn(
          "absolute inset-x-0 top-full border-y-2 border-ink bg-paper",
          open ? "block" : "hidden",
        )}
      >
        <ul className="divide-y-2 divide-ink">
          {items.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="flex items-center justify-between px-5 py-4 text-lg font-bold hover:bg-lime hover:text-on-bright aria-[current=page]:bg-lime aria-[current=page]:text-on-bright"
              >
                {item.label}
                <span className="font-mono text-xs text-ink-muted">
                  0{i + 1}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
