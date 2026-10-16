import { ArrowRight } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@streamui/react";

export default function CardBasic() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Pro plan</CardTitle>
          <Badge tone="pink">popular</Badge>
        </div>
        <CardDescription>For teams shipping every day.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          $19<span className="text-sm font-normal text-ink-muted"> / seat / month</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Start trial <ArrowRight aria-hidden />
        </Button>
      </CardFooter>
    </Card>
  );
}
