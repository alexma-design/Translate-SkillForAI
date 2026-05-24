import {
  TranslationModeConfig,
  UpdateTranslationModeConfig,
  translationModeSchema,
  updateTranslationModeSchema
} from "../config.js";

export class TranslationSessionManager {
  private readonly sessions = new Map<string, TranslationModeConfig>();

  start(input: unknown): TranslationModeConfig {
    const config = translationModeSchema.parse(input);
    this.sessions.set(config.chatId, config);
    return config;
  }

  update(input: unknown): TranslationModeConfig {
    const update: UpdateTranslationModeConfig = updateTranslationModeSchema.parse(input);
    const current = this.sessions.get(update.chatId);
    if (!current) {
      throw new Error(`Translation mode is not active for chat ${update.chatId}.`);
    }
    const next = { ...current, ...update };
    this.sessions.set(next.chatId, next);
    return next;
  }

  stop(chatId: string | number): boolean {
    return this.sessions.delete(String(chatId));
  }

  get(chatId: string | number): TranslationModeConfig | undefined {
    return this.sessions.get(String(chatId));
  }

  isActive(chatId: string | number): boolean {
    return this.sessions.has(String(chatId));
  }
}
