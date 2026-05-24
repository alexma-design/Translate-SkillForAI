import { z } from "zod";

export const outputModeSchema = z.enum(["voice_to_text", "voice_to_voice"]);
export type OutputMode = z.infer<typeof outputModeSchema>;

export const languageSchema = z.string().min(2).max(16);
export type LanguageCode = z.infer<typeof languageSchema>;

export const translationModeSchema = z.object({
  chatId: z.union([z.string(), z.number()]).transform(String),
  mode: outputModeSchema.default("voice_to_text"),
  sourceLanguage: z.union([z.literal("auto"), languageSchema]).default("auto"),
  targetLanguage: languageSchema,
  voice: z.string().optional(),
  live: z.boolean().default(false)
});

export type TranslationModeConfig = z.infer<typeof translationModeSchema>;

export const updateTranslationModeSchema = z.object({
  chatId: z.union([z.string(), z.number()]).transform(String),
  mode: outputModeSchema.optional(),
  sourceLanguage: z.union([z.literal("auto"), languageSchema]).optional(),
  targetLanguage: languageSchema.optional(),
  voice: z.string().optional(),
  live: z.boolean().optional()
});

export type UpdateTranslationModeConfig = z.infer<typeof updateTranslationModeSchema>;

export const translateTelegramVoiceNoteSchema = z.object({
  chatId: z.union([z.string(), z.number()]).transform(String),
  fileId: z.string().min(1),
  output: z.enum(["text", "voice"]).default("text"),
  sourceLanguage: z.union([z.literal("auto"), languageSchema]).default("auto"),
  targetLanguage: languageSchema,
  voice: z.string().optional()
});

export type TranslateTelegramVoiceNoteInput = z.infer<typeof translateTelegramVoiceNoteSchema>;

export interface RuntimeConfig {
  openaiApiKey: string;
  telegramBotToken?: string;
  realtimeModel: string;
  transcriptionModel: string;
  textModel: string;
  speechModel: string;
  defaultVoice: string;
  safetyIdentifier?: string;
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const openaiApiKey = env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required at runtime and must not be committed.");
  }

  return {
    openaiApiKey,
    telegramBotToken: env.TELEGRAM_BOT_TOKEN,
    realtimeModel: env.OPENAI_REALTIME_TRANSLATION_MODEL ?? "gpt-realtime-translate",
    transcriptionModel: env.OPENAI_TRANSCRIPTION_MODEL ?? "gpt-4o-mini-transcribe",
    textModel: env.OPENAI_TEXT_MODEL ?? "gpt-4.1-mini",
    speechModel: env.OPENAI_SPEECH_MODEL ?? "gpt-4o-mini-tts",
    defaultVoice: env.OPENAI_TRANSLATION_VOICE ?? "alloy",
    safetyIdentifier: env.OPENAI_SAFETY_IDENTIFIER
  };
}
