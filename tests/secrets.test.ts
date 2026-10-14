/**
 * This repo is public. Fail the build if a credential or a real env file is
 * ever committed, before it reaches GitHub or npm.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const tracked = Bun.spawnSync(["git", "ls-files", "-z"]).stdout.toString().split("\0").filter(Boolean);

const credentialPatterns: [string, RegExp][] = [
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["GitHub token", /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["npm token", /\bnpm_[A-Za-z0-9]{36}\b/],
  ["Razorpay key", /\brzp_(live|test)_[A-Za-z0-9]{10,}\b/],
  ["Stripe secret key", /\bsk_(live|test)_[A-Za-z0-9]{20,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["npm auth in .npmrc", /_authToken\s*=/],
];

describe("committed files", () => {
  test("git can list them", () => {
    expect(tracked.length).toBeGreaterThan(0);
  });

  test("no real .env files are committed (only .env.example)", () => {
    const envFiles = tracked.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".env.example"));
    expect(envFiles).toEqual([]);
  });

  test("no credentials appear in any committed text file", () => {
    const hits: string[] = [];
    for (const file of tracked) {
      if (/\.(png|jpe?g|gif|ico|woff2?|ttf|otf|lockb)$/i.test(file)) continue;
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue; // deleted in the working tree
      }
      for (const [label, pattern] of credentialPatterns) {
        if (pattern.test(text)) hits.push(`${file}: ${label}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test(".env.example holds no values, only empty placeholders", () => {
    const assignments = readFileSync(".env.example", "utf8")
      .split("\n")
      .filter((line) => /^[A-Z_]+=/.test(line));
    expect(assignments.length).toBeGreaterThan(0);
    for (const line of assignments) expect(line).toMatch(/^[A-Z_]+=\s*(#.*)?$/);
  });
});
