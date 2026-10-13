"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STEP = 10;

export function ProgressDemo() {
  const [value, setValue] = useState(60);

  return (
    <div className="w-full max-w-xs">
      <div className="mb-2 flex items-baseline justify-between">
        <span id="upload-label" className="font-bold">
          Uploading assets
        </span>
        <span className="font-mono text-sm tabular-nums">{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="upload-label"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-6 border-2 border-ink bg-paper-sunken shadow-brutal-sm"
      >
        <div
          className="h-full border-r-2 border-ink bg-pink transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-5 flex gap-3">
        <Button
          size="icon"
          variant="secondary"
          className="size-10"
          aria-label="Decrease progress"
          disabled={value <= 0}
          onClick={() => setValue((v) => Math.max(0, v - STEP))}
        >
          <Minus aria-hidden />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="size-10"
          aria-label="Increase progress"
          disabled={value >= 100}
          onClick={() => setValue((v) => Math.min(100, v + STEP))}
        >
          <Plus aria-hidden />
        </Button>
      </div>
    </div>
  );
}
