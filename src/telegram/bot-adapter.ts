import { Telegraf } from "telegraf";
import { loadRuntimeConfig, RuntimeConfig } from "../config.js";
import { TranslationSessionManager } from "../modes/session-manager.js";
import { OpenAITranslationClient } from "../realtime/openai-translation-client.js";
import { parseTranslateCommand, translationHelpText } from "./commands.js";
import { handleTelegramVoiceNote } from "./voice-note-handler.js";

export interface TelegramTranslationBot {
  bot: Telegraf;
  sessions: TranslationSessionManager;
  launch: () => Promise<void>;
  stop: (reason?: string) => void;
}

export function createTelegramTranslationBot(config: RuntimeConfig = loadRuntimeConfig()): TelegramTranslationBot {
  if (!config.telegramBotToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is required to run the Telegram bot.");
  }

  const bot = new Telegraf(config.telegramBotToken);
  const sessions = new TranslationSessionManager();
  const client = new OpenAITranslationClient(config);

  bot.command("translate", async (ctx) => {
    const command = parseTranslateCommand(ctx.message.text);
    const chatId = String(ctx.chat.id);

    if (command.action === "help") {
      await ctx.reply(translationHelpText());
      return;
    }

    if (command.action === "off") {
      sessions.stop(chatId);
      await ctx.reply("Translation mode is off.");
      return;
    }

    if (command.action === "status") {
      const session = sessions.get(chatId);
      await ctx.reply(
        session
          ? `Translation mode is on: ${session.mode}, target ${session.targetLanguage}.`
          : "Translation mode is off."
      );
      return;
    }

    sessions.start({
      chatId,
      mode: command.mode,
      sourceLanguage: "auto",
      targetLanguage: command.targetLanguage,
      live: command.live ?? false
    });
    await ctx.reply(`Translation mode is on: ${command.mode}, target ${command.targetLanguage}.`);
  });

  bot.on("voice", async (ctx) => {
    try {
      await handleTelegramVoiceNote({ ctx, bot, sessions, client });
    } catch (error) {
      await ctx.reply(error instanceof Error ? error.message : "Translation failed.");
    }
  });

  return {
    bot,
    sessions,
    launch: () => bot.launch(),
    stop: (reason?: string) => bot.stop(reason)
  };
}
