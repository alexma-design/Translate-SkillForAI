import { genericTranslationTools } from "./generic-tool-schema.js";

export function createHermesSkillManifest() {
  return {
    id: "translation-mode",
    displayName: "Translation Mode",
    capabilities: genericTranslationTools.map((tool) => ({
      command: tool.name,
      summary: tool.description
    }))
  };
}
