import { OpenAITranslationClient } from "../realtime/openai-translation-client.js";

export async function voiceToText(
  client: OpenAITranslationClient,
  audio: Blob,
  targetLanguage: string,
  sourceLanguage = "auto"
) {
  const transcript = await client.transcribeAudio(audio, sourceLanguage);
  return client.translateText(transcript, targetLanguage);
}
