import {
  translateTelegramVoiceNoteSchema,
  translationModeSchema,
  updateTranslationModeSchema
} from "../config.js";

export const genericTranslationTools = [
  {
    name: "start_translation_mode",
    description:
      "Enable translation mode for a Telegram chat or live media session. Use this when the user asks to turn on translation.",
    inputSchema: translationModeSchema
  },
  {
    name: "update_translation_mode",
    description:
      "Change translation mode settings, such as target language, output mode, voice, or live mode.",
    inputSchema: updateTranslationModeSchema
  },
  {
    name: "stop_translation_mode",
    description: "Disable translation mode for a chat or session.",
    inputSchema: {
      parse(input: unknown) {
        if (!input || typeof input !== "object" || !("chatId" in input)) {
          throw new Error("chatId is required.");
        }
        return { chatId: String((input as { chatId: string | number }).chatId) };
      }
    }
  },
  {
    name: "translate_telegram_voice_note",
    description:
      "Translate a Telegram voice note into text or translated speech. Use after translation mode is enabled or for one-off translation.",
    inputSchema: translateTelegramVoiceNoteSchema
  }
] as const;

export type GenericTranslationToolName = (typeof genericTranslationTools)[number]["name"];
