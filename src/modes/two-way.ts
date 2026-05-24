import { TranslationModeConfig } from "../config.js";

export interface TwoWayTranslationConfig {
  participantA: TranslationModeConfig;
  participantB: TranslationModeConfig;
}

export function createTwoWayTranslationConfig(input: {
  chatA: string | number;
  chatB: string | number;
  languageA: string;
  languageB: string;
  mode?: TranslationModeConfig["mode"];
}): TwoWayTranslationConfig {
  const mode = input.mode ?? "voice_to_voice";
  return {
    participantA: {
      chatId: String(input.chatA),
      mode,
      sourceLanguage: "auto",
      targetLanguage: input.languageB,
      live: true
    },
    participantB: {
      chatId: String(input.chatB),
      mode,
      sourceLanguage: "auto",
      targetLanguage: input.languageA,
      live: true
    }
  };
}
