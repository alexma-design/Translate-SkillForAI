import { describe, expect, it } from "vitest";
import { TranslationSessionManager } from "../src/modes/session-manager.js";

describe("TranslationSessionManager", () => {
  it("starts, updates, and stops sessions", () => {
    const sessions = new TranslationSessionManager();
    sessions.start({
      chatId: 123,
      mode: "voice_to_text",
      sourceLanguage: "auto",
      targetLanguage: "es"
    });

    expect(sessions.get(123)?.targetLanguage).toBe("es");
    sessions.update({ chatId: 123, mode: "voice_to_voice" });
    expect(sessions.get(123)?.mode).toBe("voice_to_voice");
    expect(sessions.stop(123)).toBe(true);
    expect(sessions.isActive(123)).toBe(false);
  });
});
