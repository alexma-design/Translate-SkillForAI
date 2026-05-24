---
name: translation-mode
description: Turn on voice-to-text or voice-to-voice translation mode for an AI agent, especially from Telegram commands or voice notes.
---

# Translation Mode Skill

Use this skill when the user asks to activate, stop, or update translation mode.

## Commands

Call `start_translation_mode` when the user wants translation on.

```json
{
  "chatId": "<telegram chat id or session id>",
  "mode": "voice_to_text",
  "sourceLanguage": "auto",
  "targetLanguage": "es",
  "live": false
}
```

Call `update_translation_mode` when the user changes language or output.

```json
{
  "chatId": "<telegram chat id or session id>",
  "mode": "voice_to_voice"
}
```

Call `stop_translation_mode` when the user asks to stop translation.

```json
{
  "chatId": "<telegram chat id or session id>"
}
```

Call `translate_telegram_voice_note` for Telegram voice notes when translation mode is active.

```json
{
  "chatId": "<telegram chat id>",
  "fileId": "<telegram file id>",
  "output": "text",
  "sourceLanguage": "auto",
  "targetLanguage": "es"
}
```

## Rules

- Use `sourceLanguage: "auto"` unless the user explicitly chooses an input language.
- Use `voice_to_text` for captions or text replies.
- Use `voice_to_voice` for spoken translated replies.
- Telegram bot mode handles voice notes. Use live mode only when a real audio stream exists.
- Never ask the user for API keys in chat. The host app must provide keys through environment variables.
