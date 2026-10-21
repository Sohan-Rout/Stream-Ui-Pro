import { CardDescription, CardTitle, ComicCard } from "@streamuilib/react";

const tones = ["paper", "lime", "pink", "blue", "violet", "orange"] as const;

export default function ComicCardTones() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-x-8 gap-y-12 pt-6 sm:grid-cols-3">
      {tones.map((tone, i) => (
        <ComicCard key={tone} tone={tone} caption={`Panel ${i + 1}`} sfx={i === 2 ? "Zap!" : undefined} tilt={i % 2 ? 1 : -1}>
          <CardTitle className="capitalize">{tone}</CardTitle>
          <CardDescription>A soft panel, with its caption in the matching bright.</CardDescription>
        </ComicCard>
      ))}
    </div>
  );
}
