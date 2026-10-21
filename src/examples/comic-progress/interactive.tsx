"use client";

import { useState } from "react";
import { ComicButton, ComicProgress } from "@streamuilib/react";

export default function ComicProgressInteractive() {
  const [step, setStep] = useState(1);
  return (
    <div className="flex w-full max-w-md flex-col gap-6 pt-3">
      <ComicProgress value={step} max={5} tone="violet" aria-label="Onboarding" doneLabel="Hooray!" />
      <div className="flex items-center gap-3">
        <ComicButton size="sm" tone="paper" pop={false} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </ComicButton>
        <ComicButton size="sm" pop={step >= 4 ? "YES!" : "NEXT!"} onClick={() => setStep((s) => Math.min(5, s + 1))}>
          Next
        </ComicButton>
        <span className="font-mono text-sm">Step {step} of 5</span>
      </div>
    </div>
  );
}
