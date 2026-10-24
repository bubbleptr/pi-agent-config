import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MARKER = "<!-- pi-agent-config -->";

type Defaults = {
  defaultProvider: string;
  defaultModel: string;
  defaultThinkingLevel: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
  // Same "+name" / "-name" deltas as settings.json `defaultTools`, which a
  // package cannot write into another machine's settings.
  defaultTools: string[];
  theme: string;
};

const defaults = JSON.parse(readFileSync(join(root, "defaults.json"), "utf8")) as Defaults;
const agents = readFileSync(join(root, "AGENTS.md"), "utf8");

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    if (event.reason !== "startup" && event.reason !== "new") return;

    ctx.ui.setTheme(defaults.theme);
    pi.setThinkingLevel(defaults.defaultThinkingLevel);

    const tools = new Set(pi.getActiveTools());
    for (const entry of defaults.defaultTools) {
      if (entry.startsWith("-")) tools.delete(entry.slice(1));
      else tools.add(entry.replace(/^\+/, ""));
    }
    pi.setActiveTools([...tools]);

    const model = ctx.modelRegistry.find(defaults.defaultProvider, defaults.defaultModel);
    if (model) {
      await pi.setModel(model);
    }
  });

  pi.on("before_agent_start", async (event) => {
    const contextPaths =
      event.systemPromptOptions?.contextFiles?.map((file) => file.path) ?? [];
    const alreadyInContext = contextPaths.some(
      (path) => path.endsWith("/AGENTS.md") && path.includes("/.pi/agent/"),
    );
    if (alreadyInContext || event.systemPrompt.includes(MARKER)) return;

    return {
      systemPrompt: `${event.systemPrompt}\n\n${MARKER}\n${agents}`,
    };
  });
}
