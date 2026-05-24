# Translate-SkillForAI

Portable translation mode skill for AI agents. It lets an agent turn translation mode on and off, choose voice-to-text or voice-to-voice output, and handle Telegram voice notes or live OpenAI Realtime Translation sessions.

This repo intentionally contains no API keys.

## What It Does

- Lets an agent activate translation mode with tool calls.
- Supports `voice_to_text` for translated captions/replies.
- Supports `voice_to_voice` for translated speech replies.
- Supports Telegram voice-note translation as the practical bot MVP.
- Provides Realtime Translation session helpers for live browser/WebRTC or WebSocket bridges.
- Includes generic, Hermes, and OpenClaw-style manifests.

## Install

```bash
npm install
cp .env.example .env
```

Add runtime secrets to `.env` or your deployment environment:

```bash
OPENAI_API_KEY=...
TELEGRAM_BOT_TOKEN=...
```

## Agent Tool Contract

Agents should use these commands:

```ts
start_translation_mode({
  chatId: "telegram-chat-id",
  mode: "voice_to_text",
  sourceLanguage: "auto",
  targetLanguage: "es",
  live: false
})
```

```ts
update_translation_mode({
  chatId: "telegram-chat-id",
  mode: "voice_to_voice",
  targetLanguage: "ja"
})
```

```ts
stop_translation_mode({ chatId: "telegram-chat-id" })
```

```ts
translate_telegram_voice_note({
  chatId: "telegram-chat-id",
  fileId: "telegram-file-id",
  output: "voice",
  sourceLanguage: "auto",
  targetLanguage: "es"
})
```

## Telegram Bot MVP

Run:

```bash
npm run dev:telegram
```

Telegram commands:

```text
/translate on es text
/translate on es voice
/translate status
/translate off
```

When translation mode is on, every Telegram voice note in that chat is translated.

## Live Translation

True simultaneous translation needs a live audio transport. The repo includes helpers for OpenAI Realtime Translation sessions:

```bash
npm run dev:token-server
```

Use this when your agent can send the user to a browser page, call bridge, or media worker that streams microphone audio to OpenAI Realtime Translation.

## Recommended Agent Behavior

When the user says:

> Turn on translation mode, Spanish, voice to text.

The agent should call:

```ts
start_translation_mode({
  chatId,
  mode: "voice_to_text",
  sourceLanguage: "auto",
  targetLanguage: "es",
  live: false
})
```

When the user says:

> Switch to voice.

The agent should call:

```ts
update_translation_mode({
  chatId,
  mode: "voice_to_voice"
})
```

## Security

- Do not commit `.env`.
- Do not expose `OPENAI_API_KEY` to browser clients.
- For browser live mode, issue ephemeral Realtime sessions from a server.
- Restrict Telegram bot access at your deployment layer if the bot is private.

## License

MIT
