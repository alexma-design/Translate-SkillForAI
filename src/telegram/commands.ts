import { OutputMode } from "../config.js";

export interface ParsedTranslateCommand {
  action: "on" | "off" | "status" | "help";
  targetLanguage?: string;
  mode?: OutputMode;
  live?: boolean;
}

export function parseTranslateCommand(text: string): ParsedTranslateCommand {
  const parts = text.trim().split(/\s+/);
  const action = parts[1]?.toLowerCase();

  if (!action || action === "help") {
    return { action: "help" };
  }
  if (action === "off" || action === "stop") {
    return { action: "off" };
  }
  if (action === "status") {
    return { action: "status" };
  }
  if (action !== "on" && action !== "start") {
    return { action: "help" };
  }

  const targetLanguage = parts[2] ?? process.env.TRANSLATION_DEFAULT_TARGET ?? "en";
  const requestedMode = parts[3]?.toLowerCase() ?? process.env.TRANSLATION_DEFAULT_OUTPUT ?? "text";
  const mode: OutputMode = requestedMode === "voice" || requestedMode === "voice_to_voice" ? "voice_to_voice" : "voice_to_text";
  const live = parts.includes("live");

  return { action: "on", targetLanguage, mode, live };
}

export function translationHelpText() {
  return [
    "Translation mode commands:",
    "/translate on <target-language> text",
    "/translate on <target-language> voice",
    "/translate status",
    "/translate off",
    "",
    "Examples:",
    "/translate on es text",
    "/translate on ja voice"
  ].join("\n");
}
