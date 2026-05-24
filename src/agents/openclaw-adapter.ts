import { genericTranslationTools } from "./generic-tool-schema.js";

export function createOpenClawSkillManifest() {
  return {
    name: "translation-mode",
    description: "Turns on voice-to-text or voice-to-voice translation mode for agent sessions.",
    tools: genericTranslationTools.map((tool) => ({
      name: tool.name,
      description: tool.description
    }))
  };
}
