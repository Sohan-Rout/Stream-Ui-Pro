/**
 * Deployment configuration from environment variables, validated once.
 *
 * Personal links (payment pages) and per-deployment values (the site URL)
 * live in the environment, not in this public repo, so forks and preview
 * deploys can set their own. See `.env.example` for every variable.
 *
 * Misconfiguration fails the build with a clear message rather than
 * shipping broken links.
 */

type Source = Record<string, string | undefined>;

const DEFAULT_SITE_URL = "https://streamui.org";
const LOCALHOST = /^(localhost|127\.0\.0\.1|\[::1\])$/;

function parseUrl(name: string, raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${name} must be a full URL like https://example.com, got "${raw}".`);
  }
  // Plain http is only acceptable for local development.
  if (url.protocol !== "https:" && !(url.protocol === "http:" && LOCALHOST.test(url.hostname))) {
    throw new Error(`${name} must use https, got "${raw}".`);
  }
  return url;
}

/** An optional https link; empty or unset means "not configured". */
function optionalLink(source: Source, name: string) {
  const raw = source[name]?.trim() ?? "";
  return raw ? parseUrl(name, raw).href : "";
}

export function parseEnv(source: Source) {
  const rawSiteUrl = source.NEXT_PUBLIC_SITE_URL?.trim();
  return {
    /** Canonical origin, without a trailing slash. */
    siteUrl: rawSiteUrl ? parseUrl("NEXT_PUBLIC_SITE_URL", rawSiteUrl).origin : DEFAULT_SITE_URL,
    funding: {
      githubSponsors: optionalLink(source, "FUNDING_GITHUB_SPONSORS_URL"),
      openCollective: optionalLink(source, "FUNDING_OPEN_COLLECTIVE_URL"),
      kofi: optionalLink(source, "FUNDING_KOFI_URL"),
    },
  };
}

export const env = parseEnv(process.env);
