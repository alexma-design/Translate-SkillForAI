import { Context, Telegraf } from "telegraf";
import { OpenAITranslationClient } from "../realtime/openai-translation-client.js";
import { TranslationSessionManager } from "../modes/session-manager.js";

async function telegramFileToBlob(bot: Telegraf, fileId: string): Promise<Blob> {
  const link = await bot.telegram.getFileLink(fileId);
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error(`Failed to download Telegram voice note: ${response.status} ${await response.text()}`);
  }
  return response.blob();
}

export async function handleTelegramVoiceNote(options: {
  ctx: Context;
  bot: Telegraf;
  sessions: TranslationSessionManager;
  client: OpenAITranslationClient;
}) {
  const chatId = options.ctx.chat?.id;
  if (!chatId) {
    return;
  }

  const session = options.sessions.get(chatId);
  if (!session) {
    return;
  }

  const message = options.ctx.message as { voice?: { file_id?: string } } | undefined;
  const fileId = message?.voice?.file_id;
  if (!fileId) {
    return;
  }

  await options.ctx.reply("Translating...");
  const audio = await telegramFileToBlob(options.bot, fileId);
  const translatedText = await options.client.translateVoiceNoteToText(
    audio,
    session.targetLanguage,
    session.sourceLanguage
  );

  if (session.mode === "voice_to_text") {
    await options.ctx.reply(translatedText);
    return;
  }

  const speech = await options.client.textToSpeech(translatedText, session.voice);
  await options.ctx.replyWithVoice({ source: Buffer.from(await speech.arrayBuffer()), filename: "translation.ogg" });
}
