import { RuntimeConfig } from "../config.js";
import WebSocket from "ws";

export interface LiveTranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
  voice?: string;
  onTranscriptDelta?: (text: string) => void;
  onInputTranscriptDelta?: (text: string) => void;
  onAudioDelta?: (base64Pcm16: string) => void;
  onError?: (error: unknown) => void;
  onClosed?: () => void;
}

export class WebSocketTranslator {
  private socket?: WebSocket;

  constructor(private readonly config: RuntimeConfig) {}

  connect(options: LiveTranslationOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL("wss://api.openai.com/v1/realtime/translations");
      url.searchParams.set("model", this.config.realtimeModel);

      this.socket = new WebSocket(url, {
        headers: {
          Authorization: `Bearer ${this.config.openaiApiKey}`,
          ...(this.config.safetyIdentifier
            ? { "OpenAI-Safety-Identifier": this.config.safetyIdentifier }
            : {})
        }
      });

      this.socket.on("open", () => {
        this.send({
          type: "session.update",
          session: {
            audio: {
              output: {
                language: options.targetLanguage,
                voice: options.voice ?? this.config.defaultVoice
              }
            }
          }
        });
        resolve();
      });

      this.socket.on("message", (event) => {
        try {
          const data = JSON.parse(event.toString()) as { type?: string; delta?: string; error?: unknown };
          if (data.type === "session.output_transcript.delta" && data.delta) {
            options.onTranscriptDelta?.(data.delta);
          }
          if (data.type === "session.input_transcript.delta" && data.delta) {
            options.onInputTranscriptDelta?.(data.delta);
          }
          if (data.type === "session.output_audio.delta" && data.delta) {
            options.onAudioDelta?.(data.delta);
          }
          if (data.type === "session.closed") {
            options.onClosed?.();
            this.socket?.close();
          }
          if (data.type === "error") {
            options.onError?.(data.error ?? data);
          }
        } catch (error) {
          options.onError?.(error);
        }
      });

      this.socket.on("error", (error) => {
        options.onError?.(error);
        reject(error);
      });
    });
  }

  appendPcm16Audio(base64Audio: string): void {
    this.send({ type: "session.input_audio_buffer.append", audio: base64Audio });
  }

  close(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.send({ type: "session.close" });
      return;
    }
    this.socket?.close();
    this.socket = undefined;
  }

  private send(payload: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("Realtime translation socket is not open.");
    }
    this.socket.send(JSON.stringify(payload));
  }
}
