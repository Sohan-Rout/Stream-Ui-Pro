"use client";

import { ScreenBuddy } from "@/components/demos/ScreenBuddyLab";
import { Ghosty } from "@/components/demos/GhostLab";
import { Byte } from "@/components/demos/ByteLab";
import { Mochi } from "@/components/demos/MochiLab";
import { Quackers } from "@/components/demos/DuckLab";

/**
 * The hero's stage: the Critter Club regulars, live. Screen buddy holds the
 * top with Quackers beside it, facing in; Ghosty, Mochi, and Byte sit in a
 * row in front. Each one is its own
 * button: tap them and they react.
 */
export function CritterStage() {
  return (
    // The row is wider than a phone; scale the whole group down there rather than squeeze it.
    <div className="relative -my-10 flex origin-center scale-[0.72] flex-col items-center sm:my-0 sm:scale-100 lg:-my-6 lg:scale-[0.78] xl:my-0 xl:scale-100">
      <div className="flex items-end justify-center">
        <ScreenBuddy size={170} label="Screen buddy, the mascot" />
        <div className="-ml-10 -translate-y-2">
          <Quackers size={120} />
        </div>
      </div>
      <div className="-mt-12 flex items-end justify-center">
        <div className="-mr-6">
          <Ghosty size={118} />
        </div>
        <div className="relative z-10 -mb-3">
          <Mochi size={104} />
        </div>
        <div className="-ml-8">
          <Byte size={136} />
        </div>
      </div>
    </div>
  );
}
