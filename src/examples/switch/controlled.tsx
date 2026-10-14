"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";

export default function SwitchControlled() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Switch
        aria-labelledby="switch-maintenance"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <div>
        <p id="switch-maintenance" className="font-semibold">
          Maintenance mode
        </p>
        <p className="font-mono text-xs text-ink-muted">
          state: {enabled ? "on" : "off"}
        </p>
      </div>
    </div>
  );
}
