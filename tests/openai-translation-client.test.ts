import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenAITranslationClient } from "../src/realtime/openai-translation-client.js";
import { RuntimeConfig } from "../src/config.js";

const config: RuntimeConfig = {
  openaiApiKey: "test-key",
  realtimeModel: "gpt-realtime-translate",
  transcriptionModel: "gpt-4o-mini-transcribe",
  textModel: "gpt-4.1-mini",
  speechModel: "gpt-4o-mini-tts",
  defaultVoice: "alloy",
  safetyIdentifier: "hashed-user-id"
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OpenAITranslationClient", () => {
  it("creates realtime translation client secrets with the documented endpoint and payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ value: "ephemeral-token" })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new OpenAITranslationClient(config);
    const session = await client.createRealtimeSession({
      targetLanguage: "es",
      voice: "marin"
    });

    expect(session.value).toBe("ephemeral-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/realtime/translations/client_secrets",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
          "OpenAI-Safety-Identifier": "hashed-user-id"
        }),
        body: JSON.stringify({
          session: {
            model: "gpt-realtime-translate",
            audio: {
              output: {
                language: "es",
                voice: "marin"
              }
            }
          }
        })
      })
    );
  });

  it("uses the Responses API for voice-note text translation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output_text: "hola" })
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new OpenAITranslationClient(config);
    await expect(client.translateText("hello", "es")).resolves.toBe("hola");
    expect(fetchMock).toHaveBeenCalledWith("https://api.openai.com/v1/responses", expect.any(Object));
  });
});
