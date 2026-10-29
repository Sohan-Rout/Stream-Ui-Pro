"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock, Monitor, Plus, ShoppingBag, Smartphone, Tablet, type LucideIcon } from "lucide-react";
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

function Buy({ checkoutUrl, price, className }: { checkoutUrl: string; price: number; className?: string }) {
  return checkoutUrl ? (
    <a href={checkoutUrl} className={buttonStyles({ size: "md", className })}>
      <ShoppingBag aria-hidden /> Buy · ${price}
    </a>
  ) : (
    <span aria-disabled className={cn(buttonStyles({ size: "md" }), "pointer-events-none opacity-60", className)}>
      <Clock aria-hidden /> Coming soon
    </span>
  );
}

/** The round floating button: a plus that turns into an × while what it opens is showing. */
function Fab({ open, label, controls, onClick, className }: { open: boolean; label: string; controls?: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "fixed right-5 bottom-5 z-10 size-14 place-items-center rounded-full border-2 border-ink bg-lime text-on-bright shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-brutal-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0 active:shadow-brutal-sm motion-reduce:transition-none",
        className,
      )}
    >
      <Plus aria-hidden className={cn("size-6 transition-transform duration-300 ease-out motion-reduce:transition-none", open && "rotate-[135deg]")} strokeWidth={2.5} />
    </button>
  );
}

/**
 * A template's live demo, full window on this site, with the controls kept
 * out of its way: on larger screens a floating dock at the bottom (back,
 * device sizes, Buy) that can be tucked into a round button; on phones just
 * the round button, which rotates and opens a drawer with the same controls.
 * Right-click and the developer-tools shortcuts are turned off here (the demo
 * turns them off inside its frame too). That's a deterrent, not a lock.
 */
export function TemplatePreview({ slug, name, demoUrl, checkoutUrl, price }: { slug: string; name: string; demoUrl: string; checkoutUrl: string; price: number }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [dockHidden, setDockHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => {
      if (isInspectKey(e)) e.preventDefault();
      if (e.key === "Escape") setDrawerOpen(false);
    };
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
    <div className="fixed inset-0 z-50 flex justify-center overflow-hidden bg-paper-sunken bg-dots">
      <iframe src={demoUrl} title={`${name} live preview`} className={cn("h-full bg-paper transition-[max-width] duration-300 motion-reduce:transition-none", frame)} />

      {/* Larger screens: the floating dock. */}
      <div
        role="toolbar"
        aria-label="Preview controls"
        inert={dockHidden}
        className={cn(
          "fixed bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 border-2 border-ink bg-paper p-2 shadow-brutal-lg transition-[translate,opacity] duration-200 ease-out md:flex motion-reduce:transition-none",
          dockHidden && "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <Link href={`/templates/${slug}`} aria-label={`Back to ${name}`} className={buttonStyles({ variant: "secondary", size: "icon", className: "size-10" })}>
          <ArrowLeft aria-hidden />
        </Link>
        <div className="px-2">
          <p className="font-display text-base leading-tight tracking-tight whitespace-nowrap">{name}</p>
          <p className="font-mono text-xs text-ink-muted">Live preview</p>
        </div>
        <div role="group" aria-label="Preview size" className="flex border-2 border-ink">
          {DEVICES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={device === id}
              aria-label={label}
              title={label}
              onClick={() => setDevice(id)}
              className="grid size-9 place-items-center transition-colors duration-150 not-first:border-l-2 not-first:border-ink hover:bg-paper-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-pressed:bg-lime aria-pressed:text-on-bright"
            >
              <Icon aria-hidden className="size-4.5" />
            </button>
          ))}
        </div>
        <Buy checkoutUrl={checkoutUrl} price={price} className="h-10" />
        <button
          type="button"
          aria-label="Hide preview controls"
          title="Hide"
          onClick={() => setDockHidden(true)}
          className="grid size-10 place-items-center border-2 border-ink bg-paper-raised transition-colors duration-150 hover:bg-paper-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ChevronDown aria-hidden className="size-4.5" />
        </button>
      </div>
      {/* Larger screens: once the dock is tucked away, a round button brings it back. */}
      <Fab open={false} label="Show preview controls" onClick={() => setDockHidden(false)} className={dockHidden ? "hidden md:grid" : "hidden"} />

      {/* Phones: the round button and its drawer. */}
      <div
        id="preview-drawer"
        role="dialog"
        aria-label="Preview controls"
        inert={!drawerOpen}
        className={cn(
          "fixed inset-x-3 bottom-24 z-10 flex flex-col gap-4 border-2 border-ink bg-paper p-5 shadow-brutal-lg transition-[translate,opacity] duration-200 ease-out md:hidden motion-reduce:transition-none",
          drawerOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div>
          <p className="font-display text-xl leading-tight tracking-tight">{name}</p>
          <p className="font-mono text-xs text-ink-muted">Live preview</p>
        </div>
        <Buy checkoutUrl={checkoutUrl} price={price} className="w-full justify-center" />
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/templates/${slug}`} className={buttonStyles({ variant: "secondary", size: "sm", className: "justify-center" })}>
            <ArrowLeft aria-hidden /> Details
          </Link>
          <Link href="/templates" className={buttonStyles({ variant: "secondary", size: "sm", className: "justify-center" })}>
            All templates <ArrowUpRight aria-hidden />
          </Link>
        </div>
      </div>
      <Fab open={drawerOpen} label={drawerOpen ? "Close preview controls" : "Open preview controls"} controls="preview-drawer" onClick={() => setDrawerOpen((o) => !o)} className="grid md:hidden" />
    </div>
  );
}
