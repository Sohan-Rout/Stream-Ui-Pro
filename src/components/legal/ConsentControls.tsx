"use client";

import { Button } from "@streamuilib/react";
import { setConsent, useConsent } from "@/lib/consent";

const labels = {
  all: "Accepted: best scores are saved on this device.",
  essential: "Essential only: nothing optional is saved.",
} as const;

/** Shows the current choice and lets the visitor change it in place. */
export function ConsentControls() {
  const consent = useConsent();
  return (
    <div className="flex flex-col gap-4 border-2 border-ink bg-paper-raised p-5 shadow-brutal sm:flex-row sm:items-center sm:justify-between">
      <p aria-live="polite" className="text-sm font-semibold">
        {consent === undefined
          ? "Checking your choice…"
          : consent === null
            ? "You haven't chosen yet."
            : labels[consent]}
      </p>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="secondary"
          aria-pressed={consent === "essential"}
          onClick={() => setConsent("essential")}
        >
          Essential only
        </Button>
        <Button size="sm" aria-pressed={consent === "all"} onClick={() => setConsent("all")}>
          Accept
        </Button>
      </div>
    </div>
  );
}
