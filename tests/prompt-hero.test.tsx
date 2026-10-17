/** The prompt-box hero: sending, keyboard rules, and example chips. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptHeroSection } from "@/components/sections/PromptHeroSection";
import { PixelPromptHeroSection } from "@/components/sections/PixelPromptHeroSection";

afterEach(cleanup);

const box = () => screen.getByRole("textbox", { name: "Describe what you want to build" });
const send = () => screen.getByRole("button", { name: /Generate/ }) as HTMLButtonElement;

/** Records submissions instead of navigating. */
function trackSubmits() {
  const sent: string[] = [];
  const form = box().closest("form")!;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sent.push(new FormData(form).get("prompt") as string);
  });
  return sent;
}

// Both prompt heroes share the same behavior; only the look differs.
describe.each([
  ["PromptHeroSection", PromptHeroSection],
  ["PixelPromptHeroSection", PixelPromptHeroSection],
])("%s", (_, PromptHeroSection) => {
  test("send stays disabled until there's real text", async () => {
    render(<PromptHeroSection />);
    expect(send().disabled).toBe(true);
    await userEvent.type(box(), "   ");
    expect(send().disabled).toBe(true);
    await userEvent.type(box(), "a blog");
    expect(send().disabled).toBe(false);
  });

  test("Enter sends the prompt; Shift+Enter adds a line instead", async () => {
    render(<PromptHeroSection />);
    const sent = trackSubmits();
    await userEvent.type(box(), "a blog{Shift>}{Enter}{/Shift}with tags");
    expect(sent).toEqual([]);
    expect((box() as HTMLTextAreaElement).value).toBe("a blog\nwith tags");
    await userEvent.type(box(), "{Enter}");
    expect(sent).toEqual(["a blog\nwith tags"]);
  });

  test("Enter on an empty box sends nothing", async () => {
    render(<PromptHeroSection />);
    const sent = trackSubmits();
    await userEvent.type(box(), "{Enter}");
    expect(sent).toEqual([]);
  });

  test("Enter while an IME is composing doesn't send", () => {
    render(<PromptHeroSection />);
    const sent = trackSubmits();
    fireEvent.change(box(), { target: { value: "日本" } });
    fireEvent.keyDown(box(), { key: "Enter", isComposing: true });
    expect(sent).toEqual([]);
  });

  test("an example chip fills the box and focuses it for editing", async () => {
    render(<PromptHeroSection />);
    const chip = within(screen.getByRole("list", { name: "Try an example" })).getAllByRole("button")[1];
    await userEvent.click(chip);
    expect((box() as HTMLTextAreaElement).value).toBe(chip.textContent);
    expect(document.activeElement).toBe(box());
    expect(send().disabled).toBe(false);
  });

  test("the prompt is a named field of a GET form, ready to point at an app", () => {
    render(<PromptHeroSection />);
    const form = box().closest("form")!;
    expect(form.method).toBe("get");
    expect(box().getAttribute("name")).toBe("prompt");
  });
});
