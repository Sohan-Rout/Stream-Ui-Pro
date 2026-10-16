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

/** What each variable should look like, for error messages. */
const EXAMPLES: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: "https://streamui.org",
  FUNDING_GITHUB_SPONSORS_URL: "https://github.com/sponsors/your-org",
  FUNDING_OPEN_COLLECTIVE_URL: "https://opencollective.com/your-collective",
  FUNDING_KOFI_URL: "https://ko-fi.com/your-name",
};

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function invalid(name: string, raw: string, reason: string) {
  const example = EXAMPLES[name] ?? "https://example.com";
  return new Error(
    `${name} ${reason}, got "${raw}". Use a full link like ${example}. ` +
      `Fix it in your host's environment variables (Vercel: Project Settings → Environment Variables), ` +
      `or remove it to hide that link.`,
  );
}

function parseUrl(name: string, raw: string) {
  // A link pasted without its scheme ("ko-fi.com/me") is clearly meant as https.
  const candidate = HAS_SCHEME.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw invalid(name, raw, "is not a valid URL");
  }
  // Plain http is only acceptable for local development.
  if (url.protocol !== "https:" && !(url.protocol === "http:" && LOCALHOST.test(url.hostname))) {
    throw invalid(name, raw, "must use https");
  }
  // A bare word ("streamuilib") parses as a host, but it's a username, not a link.
  if (!url.hostname.includes(".") && !LOCALHOST.test(url.hostname)) {
    throw invalid(name, raw, "must be a full URL with a domain");
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
