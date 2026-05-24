import { OpenAITranslationClient, RealtimeEphemeralSession, RealtimeSessionRequest } from "./openai-translation-client.js";

export class RealtimeTranslationSessionManager {
  private readonly sessions = new Map<string, RealtimeEphemeralSession>();

  constructor(private readonly client: OpenAITranslationClient) {}

  async create(chatId: string | number, request: RealtimeSessionRequest): Promise<RealtimeEphemeralSession> {
    const session = await this.client.createRealtimeSession(request);
    this.sessions.set(String(chatId), session);
    return session;
  }

  get(chatId: string | number): RealtimeEphemeralSession | undefined {
    return this.sessions.get(String(chatId));
  }

  forget(chatId: string | number): boolean {
    return this.sessions.delete(String(chatId));
  }
}
