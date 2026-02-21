import { ProvideLinksToolSchema } from "../../../lib/inkeep-qa-schema";
import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getLLMText, source } from "@/lib/source";

export const runtime = "nodejs";

const MAX_CONTEXT_CHARS = 20000;

async function buildDocsContext() {
  const pages = source.getPages();
  const sections: string[] = [];

  for (const page of pages) {
    const text = await getLLMText(page);
    sections.push(`URL: ${page.url}\n${text}`);
  }

  const context = sections.join("\n\n---\n\n");
  return context.length > MAX_CONTEXT_CHARS
    ? context.slice(0, MAX_CONTEXT_CHARS)
    : context;
}

export async function POST(req: Request) {
  const reqJson = await req.json();
  const context = await buildDocsContext();

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    system: `You are an AI assistant for Better Auth Plugins documentation.
Answer questions about the plugins in this docs site and general Better Auth usage.
Keep responses focused on Better Auth and these plugins.

Use the documentation context below as ground truth when relevant.

When talking about a specific plugin or feature, provide links to the relevant documentation pages using the "provideLinks" tool.

---
${context}`,
    messages: await convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
