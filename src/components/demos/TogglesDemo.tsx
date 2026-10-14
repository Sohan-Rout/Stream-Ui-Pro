"use client";

import { useId, useState } from "react";
import { Switch, Checkbox } from "@streamui/react";

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
      <Checkbox
        label="Send me release notes"
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
        className="flex border-t-2 border-dashed border-ink-faint pt-5"
      />
    </div>
  );
}
