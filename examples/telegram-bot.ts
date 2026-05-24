import { createTelegramTranslationBot } from "../src/telegram/bot-adapter.js";

const app = createTelegramTranslationBot();

process.once("SIGINT", () => app.stop("SIGINT"));
process.once("SIGTERM", () => app.stop("SIGTERM"));

await app.launch();
console.log("Telegram translation bot is running.");
