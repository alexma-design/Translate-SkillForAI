# Agent Instructions

This repository provides a reusable translation mode skill for AI agents.

## Use The Skill When

- A user asks to turn on translation mode.
- A user asks for voice-to-text translation.
- A user asks for voice-to-voice translation.
- A Telegram voice note arrives while translation mode is active.
- A user asks to switch target language, output mode, or voice.

## Behavior

Use the exported tool contract instead of translating inside the normal assistant prompt.

Available tools:

- `start_translation_mode`
- `update_translation_mode`
- `stop_translation_mode`
- `translate_telegram_voice_note`

## Mode Mapping

- "text only", "captions", "voice to text" -> `voice_to_text`
- "spoken translation", "voice reply", "voice to voice" -> `voice_to_voice`
- "detect language", "auto" -> `sourceLanguage: "auto"`

## Telegram

Telegram bot chat mode translates voice notes, not live phone-call audio. For true simultaneous live translation, start a Realtime Translation session and use a browser, call bridge, or media worker that can stream microphone audio.

## Secrets

Never commit API keys. Read `OPENAI_API_KEY` and `TELEGRAM_BOT_TOKEN` from the runtime environment.
