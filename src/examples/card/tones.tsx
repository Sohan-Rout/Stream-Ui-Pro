import { Card, CardContent, CardTitle, type CardTone } from "@streamuilib/react";

const tones: CardTone[] = ["paper", "lime", "pink", "blue", "violet", "orange"];

export default function CardTones() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
      {tones.map((tone) => (
        <Card key={tone} tone={tone}>
          <CardContent>
            <CardTitle as="h4" className="font-mono text-sm">
              {tone}
            </CardTitle>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
