/** The npm / shadcn install switch. */
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallTabs } from "@/components/blocks/InstallTabs";
import { installOptions, shadcnAdd, shadcnBrowse } from "@/registry/shadcn";
import { siteConfig } from "@/lib/site";

afterEach(cleanup);

const code = () => document.querySelector("code")!.textContent;

test("shows the bun command first, and the shadcn command for the item when switched", async () => {
  render(<InstallTabs options={installOptions(shadcnAdd("button"))} />);
  expect(screen.getByRole("button", { name: "bun" }).getAttribute("aria-pressed")).toBe("true");
  expect(code()).toContain(siteConfig.installCommand);

  await userEvent.click(screen.getByRole("button", { name: "shadcn" }));
  expect(screen.getByRole("button", { name: "shadcn" }).getAttribute("aria-pressed")).toBe("true");
  expect(code()).toContain(shadcnAdd("button"));
  expect(code()).toContain(`${siteConfig.url}/r/button.json`);
});


test("the landing page's shadcn command lists the whole registry", async () => {
  render(<InstallTabs options={installOptions(shadcnBrowse())} />);
  await userEvent.click(screen.getByRole("button", { name: "shadcn" }));
  expect(code()).toBe(`$${shadcnBrowse()}`);
  expect(code()).toContain(`${siteConfig.url}/r/registry.json`);
});

test("Open in v0 links to the item's registry JSON on this site", async () => {
  const { openInV0Url, registryItemUrl } = await import("@/registry/shadcn");
  const url = new URL(openInV0Url("flappy-hero"));
  expect(url.origin + url.pathname).toBe("https://v0.dev/chat/api/open");
  expect(url.searchParams.get("url")).toBe(registryItemUrl("flappy-hero"));
});
