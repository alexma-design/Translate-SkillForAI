import { OpenAITranslationClient } from "../realtime/openai-translation-client.js";

export async function voiceToVoice(
  client: OpenAITranslationClient,
  audio: Blob,
  targetLanguage: string,
  sourceLanguage = "auto",
  voice?: string
) {
  const translatedText = await client.translateVoiceNoteToText(audio, targetLanguage, sourceLanguage);
  const speech = await client.textToSpeech(translatedText, voice);
  return { translatedText, speech };
}
