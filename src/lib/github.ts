import { cacheLife } from "next/cache";
import { siteConfig } from "./site";

/** "owner/repo" from the configured GitHub URL. */
const REPO = new URL(siteConfig.githubUrl).pathname.replace(/^\/|\/$/g, "");

/**
 * The repo's star count, fetched at most about once an hour. Returns null when
 * GitHub can't be reached or rate-limits us, so callers fall back to a plain
 * icon instead of a broken number. Set GITHUB_TOKEN (any token, no scopes) for
 * a higher rate limit; it's optional.
 */
export async function getStarCount(): Promise<number | null> {
  "use cache";
  cacheLife("hours");
  const token = process.env.GITHUB_TOKEN?.trim();
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "streamui.org",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const { stargazers_count } = (await res.json()) as { stargazers_count?: unknown };
    return typeof stargazers_count === "number" ? stargazers_count : null;
  } catch {
    return null;
  }
}

/** 950 → "950", 1234 → "1.2k", 15000 → "15k". */
export function formatStars(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}
