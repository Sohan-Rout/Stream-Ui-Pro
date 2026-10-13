"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";

export function TogglesDemo() {
  const id = useId();
  const [agree, setAgree] = useState(true);

  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <span id={`${id}-notify`} className="font-semibold">
          Push notifications
        </span>
        <Switch aria-labelledby={`${id}-notify`} defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span id={`${id}-beta`} className="font-semibold">
          Beta features
        </span>
        <Switch aria-labelledby={`${id}-beta`} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span id={`${id}-off`} className="font-semibold text-ink-muted">
          Disabled
        </span>
        <Switch aria-labelledby={`${id}-off`} disabled />
      </div>
      <label className="flex cursor-pointer items-center gap-3 border-t-2 border-dashed border-ink-faint pt-5">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "grid size-6 place-items-center border-2 border-ink shadow-brutal-sm transition-colors duration-150 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue",
            agree ? "bg-yellow text-on-bright" : "bg-paper-raised",
          )}
        >
          {agree && <Check className="size-4" strokeWidth={3.5} />}
        </span>
        <span className="font-semibold">Ship it loud</span>
      </label>
    </div>
  );
}
