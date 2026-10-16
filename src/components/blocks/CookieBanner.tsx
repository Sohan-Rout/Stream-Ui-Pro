"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { Button } from "@streamuilib/react";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * Bottom-of-page storage notice, shown until the visitor picks an option.
 *
 * On the landing page it opens as a modal <dialog>: the browser blurs and
 * inerts the page behind it (the ::backdrop) and keeps focus inside, so the
 * hero waits for an answer. Elsewhere it opens non-modally and the docs stay
 * usable. Escape counts as "Essential only", the privacy-preserving answer.
 */
export function CookieBanner({ analytics = false }: { analytics?: boolean }) {
  const consent = useConsent();
  const modal = usePathname() === "/";

  const open = useCallback(
    (dialog: HTMLDialogElement | null) => {
      if (!dialog || dialog.open) return;
      if (modal) {
        dialog.showModal();
        // React's autoFocus doesn't reach a dialog opened from code.
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      } else dialog.show();
    },
    [modal],
  );

  // undefined: still hydrating. A choice: already answered.
  if (consent !== null) return null;

  return (
    <dialog
      // Re-mount when switching between modal and non-modal pages.
      key={modal ? "modal" : "inline"}
      ref={open}
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      onCancel={(e) => {
        e.preventDefault();
        setConsent("essential");
      }}
      className="fixed inset-x-0 top-auto bottom-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-3xl border-2 border-ink bg-paper-raised p-0 text-ink shadow-brutal-lg backdrop:bg-paper/40 backdrop:backdrop-blur-md sm:bottom-6"
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center border-2 border-ink bg-pink shadow-brutal"
        >
          <Cookie className="size-6 text-on-bright" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="cookie-title" className="font-display text-xl tracking-tight">
            Cookies? Just crumbs.
          </h2>
          <p id="cookie-body" className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {analytics
              ? "No ads, and nothing runs before you choose. Accept lets us count visits with Google Analytics and save your Labs best scores on this device."
              : "No tracking, no ads, no analytics. With your OK we save your Labs best scores on this device."}{" "}
            <Link
              href="/legal/cookies"
              className="font-semibold text-ink underline decoration-2 underline-offset-4"
            >
              Cookie policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setConsent("essential")}>
            Essential only
          </Button>
          <Button data-autofocus className="flex-1" onClick={() => setConsent("all")}>
            Accept
          </Button>
        </div>
      </div>
    </dialog>
  );
}

/** Clears the saved choice so the banner asks again. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => setConsent(null)}>
      Cookie settings
    </button>
  );
}
