import { CardDescription, CardTitle, ComicBadge, ComicButton, ComicCard } from "@streamuilib/react";

export default function ComicCardBasic() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-10 pt-6 sm:grid-cols-2">
      <ComicCard caption="Meanwhile, in prod…" sfx="Kapow!">
        <CardTitle>Deploys ship in seconds</CardTitle>
        <CardDescription>Push to main and every pull request gets a live URL before the coffee is ready.</CardDescription>
      </ComicCard>
      <ComicCard tone="pink" caption="Chapter 2" tilt={1.5}>
        <CardTitle>Alerts that mean it</CardTitle>
        <CardDescription>Get pinged when a metric really moves, not every time it twitches.</CardDescription>
        <div className="mt-3 flex items-center gap-3">
          <ComicButton size="sm" tone="lime">
            Turn on
          </ComicButton>
          <ComicBadge shape="bubble" tone="paper" size="sm" tilt={-4}>
            New!
          </ComicBadge>
        </div>
      </ComicCard>
    </div>
  );
}
