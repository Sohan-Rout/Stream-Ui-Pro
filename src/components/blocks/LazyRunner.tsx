"use client";

import dynamic from "next/dynamic";

/**
 * The 404 page's runner game, loaded only when a 404 actually renders. The
 * not-found page sits in the root layout, so a static import would ship the
 * game to every page. The placeholder holds the board's shape while it loads.
 */
export const LazyRunner = dynamic(() => import("@/components/demos/RunnerLab").then((m) => m.RunnerGame), {
  loading: () => <div aria-hidden className="mt-11 aspect-3/1 w-full border-2 border-ink bg-paper shadow-brutal-lg" />,
});
