import { Suspense } from "react";
import { SiGithub } from "react-icons/si";
import { Star } from "lucide-react";
import { buttonStyles, cn } from "@streamuilib/react";
import { siteConfig } from "@/lib/site";
import { formatStars, getStarCount } from "@/lib/github";

/** The header's GitHub link, with the live star count when GitHub answers. */
export function GitHubButton() {
  return (
    <Suspense fallback={<IconOnly />}>
      <WithStars />
    </Suspense>
  );
}

function IconOnly() {
  return (
    <a
      href={siteConfig.githubUrl}
      aria-label="stream/ui on GitHub"
      className={buttonStyles({ variant: "secondary", size: "icon", className: "size-10" })}
    >
      <SiGithub aria-hidden />
    </a>
  );
}

async function WithStars() {
  const stars = await getStarCount();
  if (stars === null) return <IconOnly />;
  return (
    <a
      href={siteConfig.githubUrl}
      aria-label={`stream/ui on GitHub, ${stars} ${stars === 1 ? "star" : "stars"}`}
      className={cn(buttonStyles({ variant: "secondary", size: "sm" }), "h-10 gap-0 px-0")}
    >
      <span className="grid h-full w-10 place-items-center">
        <SiGithub aria-hidden className="size-4" />
      </span>
      {/* The count hides on phones, where the header has no room for it. */}
      <span className="hidden h-full items-center gap-1.5 border-l-2 border-ink bg-lime px-2.5 font-mono text-sm font-bold text-on-bright sm:flex">
        <Star aria-hidden className="size-3.5 fill-current" />
        {formatStars(stars)}
      </span>
    </a>
  );
}
