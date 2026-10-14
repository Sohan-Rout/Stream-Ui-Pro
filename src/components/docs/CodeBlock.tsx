import { highlight } from "@/lib/highlight";
import { CodeFrame, type CodeFrameProps } from "./CodeFrame";

export type CodeBlockProps = Omit<CodeFrameProps, "html"> & { lang?: "tsx" | "bash" };

/** Server wrapper: highlights on the server, hands HTML to the client frame. */
export async function CodeBlock({ code, lang = "tsx", ...rest }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return <CodeFrame html={html} code={code} {...rest} />;
}
