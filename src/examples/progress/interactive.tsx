"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

export default function ProgressInteractive() {
  const [step, setStep] = useState(2);
  const total = 5;

  return (
    <div className="w-full max-w-xs">
      <p id="onboarding-label" className="mb-2 font-bold">
        Onboarding: step {step} of {total}
      </p>
      <Progress value={step} max={total} tone="blue" aria-labelledby="onboarding-label" />
      <div className="mt-5 flex gap-3">
        <Button
          size="icon"
          variant="secondary"
          className="size-10"
          aria-label="Previous step"
          disabled={step <= 0}
          onClick={() => setStep((s) => s - 1)}
        >
          <Minus aria-hidden />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="size-10"
          aria-label="Next step"
          disabled={step >= total}
          onClick={() => setStep((s) => s + 1)}
        >
          <Plus aria-hidden />
        </Button>
      </div>
    </div>
  );
}
