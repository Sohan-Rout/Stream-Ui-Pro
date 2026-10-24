"use client";

import { ScreenBuddy } from "@/components/demos/ScreenBuddyLab";
import { Ghosty } from "@/components/demos/GhostLab";
import { Byte } from "@/components/demos/ByteLab";

/**
 * The hero's stage: the three Critter Club regulars, live. Screen buddy holds
 * the middle; Ghosty and Byte sit in front. Each one is its own button: tap
 * them and they react.
 */
export function CritterStage() {
  return (
    <div className="relative flex flex-col items-center">
      <ScreenBuddy size={190} label="Screen buddy, the mascot" />
      <div className="-mt-8 flex items-end justify-center gap-0 sm:-mt-12">
        <Ghosty size={130} />
        <Byte size={150} />
      </div>
    </div>
  );
}
