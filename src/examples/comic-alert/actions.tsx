"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { ComicAlert, ComicButton } from "@streamuilib/react";

export default function ComicAlertActions() {
  const [n, setN] = useState(0);
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-7 pt-3">
      {/* A new key remounts it, so it pops in again. */}
      <ComicAlert
        key={n}
        tone="warning"
        title="Deploy blocked"
        sfx="Whoa!"
        action={
          <>
            <ComicButton size="sm" tone="orange" pop="FIXED!">
              Fix it
            </ComicButton>
            <ComicButton size="sm" tone="paper" pop={false} onClick={() => setN((x) => x + 1)}>
              Replay
            </ComicButton>
          </>
        }
      >
        A required check is failing on main.
      </ComicAlert>
      <ComicAlert tone="info" icon={<Rocket className="size-6" strokeWidth={2.5} />} title="Launch day" sfx={false}>
        Your own icon, and no sound effect.
      </ComicAlert>
    </div>
  );
}
