"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, Progress } from "@streamui/react";

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
      <Progress value={value} aria-labelledby="upload-label" />
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
