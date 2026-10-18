/** The npm / shadcn install switch. */
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallTabs } from "@/components/blocks/InstallTabs";
import { installOptions, shadcnAdd } from "@/registry/shadcn";
import { siteConfig } from "@/lib/site";

afterEach(cleanup);

test("shows the npm command first, and the shadcn command for the item when switched", async () => {
  render(<InstallTabs options={installOptions("button")} />);
  const code = () => document.querySelector("code")!.textContent;
  expect(screen.getByRole("button", { name: "npm" }).getAttribute("aria-pressed")).toBe("true");
  expect(code()).toContain(siteConfig.installCommand);

  await userEvent.click(screen.getByRole("button", { name: "shadcn" }));
  expect(screen.getByRole("button", { name: "shadcn" }).getAttribute("aria-pressed")).toBe("true");
  expect(code()).toContain(shadcnAdd("button"));
  expect(code()).toContain(`${siteConfig.url}/r/button.json`);
});
