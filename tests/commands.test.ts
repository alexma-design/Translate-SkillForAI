import { describe, expect, it } from "vitest";
import { parseTranslateCommand } from "../src/telegram/commands.js";

describe("parseTranslateCommand", () => {
  it("parses text mode", () => {
    expect(parseTranslateCommand("/translate on es text")).toEqual({
      action: "on",
      targetLanguage: "es",
      mode: "voice_to_text",
      live: false
    });
  });

  it("parses voice mode", () => {
    expect(parseTranslateCommand("/translate on ja voice")).toEqual({
      action: "on",
      targetLanguage: "ja",
      mode: "voice_to_voice",
      live: false
    });
  });

  it("parses stop", () => {
    expect(parseTranslateCommand("/translate off")).toEqual({ action: "off" });
  });
});
