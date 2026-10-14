import { codeToHtml } from "shiki";

/** Syntax-highlights code to HTML on the server; cached across renders. */
export async function highlight(code: string, lang: "tsx" | "bash" = "tsx") {
  "use cache";
  return codeToHtml(code, { lang, theme: "github-light" });
}
