import { RuntimeConfig } from "../config.js";

export interface RealtimeSessionRequest {
  targetLanguage: string;
  sourceLanguage?: string;
  voice?: string;
  outputMode?: "voice_to_text" | "voice_to_voice";
}

export interface RealtimeEphemeralSession {
  client_secret?: {
    value: string;
    expires_at?: number;
  };
  id?: string;
}

export class OpenAITranslationClient {
  constructor(private readonly config: RuntimeConfig) {}

  async createRealtimeSession(request: RealtimeSessionRequest): Promise<RealtimeEphemeralSession> {
    const response = await fetch("https://api.openai.com/v1/realtime/translations/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.config.realtimeModel,
        audio: {
          output: {
            language: request.targetLanguage,
            voice: request.voice ?? this.config.defaultVoice,
            format: request.outputMode === "voice_to_text" ? "none" : "pcm16"
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create realtime translation session: ${response.status} ${await response.text()}`);
    }

    return response.json() as Promise<RealtimeEphemeralSession>;
  }

  async transcribeAudio(audio: Blob, sourceLanguage = "auto"): Promise<string> {
    const formData = new FormData();
    formData.append("file", audio, "voice-note.ogg");
    formData.append("model", this.config.transcriptionModel);
    if (sourceLanguage !== "auto") {
      formData.append("language", sourceLanguage);
    }

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to transcribe audio: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as { text?: string };
    return data.text ?? "";
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.config.textModel,
        input: [
          {
            role: "system",
            content:
              "Translate the user's text faithfully. Preserve meaning, tone, names, numbers, and formatting. Return only the translation."
          },
          {
            role: "user",
            content: `Target language: ${targetLanguage}\n\nText:\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to translate text: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };

    return data.output_text ?? data.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("") ?? "";
  }

  async translateVoiceNoteToText(audio: Blob, targetLanguage: string, sourceLanguage = "auto"): Promise<string> {
    const transcript = await this.transcribeAudio(audio, sourceLanguage);
    return this.translateText(transcript, targetLanguage);
  }

  async textToSpeech(text: string, voice?: string): Promise<Blob> {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.config.speechModel,
        voice: voice ?? this.config.defaultVoice,
        input: text,
        response_format: "opus"
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create translated speech: ${response.status} ${await response.text()}`);
    }

    return response.blob();
  }
}
