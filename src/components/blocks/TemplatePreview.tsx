"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Monitor, ShoppingBag, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import { buttonStyles, cn } from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";

type Device = "desktop" | "tablet" | "phone";

const DEVICES: { id: Device; label: string; icon: LucideIcon; frame: string }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, frame: "w-full" },
  { id: "tablet", label: "Tablet", icon: Tablet, frame: "w-full max-w-3xl border-x-2 border-ink" },
  { id: "phone", label: "Phone", icon: Smartphone, frame: "w-full max-w-sm border-x-2 border-ink" },
];

/** Keys that open developer tools or the page source: F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U. */
function isInspectKey(e: KeyboardEvent) {
  const mod = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();
  return e.key === "F12" || (mod && e.shiftKey && ["i", "j", "c"].includes(key)) || (mod && key === "u") || (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(key));
}

/**
 * A template's live demo, full window on this site: a top bar with the way
 * back, device sizes, and Buy, over the demo in a frame. Right-click and the
 * developer-tools shortcuts are turned off here (the demo turns them off
 * inside its frame too). That's a deterrent, not a lock: the browser's own
 * menus still reach the tools, and the demo is a built site, not its source.
 */
export function TemplatePreview({ name, demoUrl, checkoutUrl, price }: { name: string; demoUrl: string; checkoutUrl: string; price: number }) {
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => isInspectKey(e) && e.preventDefault();
    document.addEventListener("contextmenu", block);
    document.addEventListener("keydown", keys);
    // The page underneath (header, footer) stays put while the preview covers it.
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("keydown", keys);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const frame = DEVICES.find((d) => d.id === device)!.frame;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-ink bg-paper px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/#templates" aria-label="Back to stream/ui" className={buttonStyles({ variant: "secondary", size: "icon" })}>
            <ArrowLeft aria-hidden />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight tracking-tight">{name}</p>
            <p className="font-mono text-xs text-ink-muted">Live preview</p>
          </div>
        </div>

        <div role="group" aria-label="Preview size" className="hidden border-2 border-ink md:flex">
          {DEVICES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={device === id}
              aria-label={label}
              title={label}
              onClick={() => setDevice(id)}
              className="grid size-10 place-items-center transition-colors duration-150 not-first:border-l-2 not-first:border-ink hover:bg-paper-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-pressed:bg-lime aria-pressed:text-on-bright"
            >
              <Icon aria-hidden className="size-4.5" />
            </button>
          ))}
        </div>

        {checkoutUrl ? (
          <a href={checkoutUrl} className={buttonStyles({ size: "md" })}>
            <ShoppingBag aria-hidden /> Buy · ${price}
          </a>
        ) : (
          <span aria-disabled className={cn(buttonStyles({ size: "md" }), "pointer-events-none opacity-60")}>
            <Clock aria-hidden /> Coming soon
          </span>
        )}
      </div>

      <div className="flex flex-1 justify-center overflow-hidden bg-paper-sunken bg-dots">
        <iframe src={demoUrl} title={`${name} live preview`} className={cn("h-full bg-paper transition-[max-width] duration-300 motion-reduce:transition-none", frame)} />
      </div>
    </div>
  );
}
