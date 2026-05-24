# Architecture

```text
Agent
  -> translation tool contract
  -> session manager
  -> Telegram adapter or live media adapter
  -> OpenAI APIs
```

## Telegram Voice Note Flow

```text
Telegram voice note
  -> bot downloads OGG/Opus file
  -> transcribe speech
  -> translate transcript to target language
  -> reply as text or synthesized voice
```

This is reliable for bot chats because Telegram bots receive discrete voice files.

## Live Realtime Flow

```text
Microphone stream
  -> WebRTC or WebSocket transport
  -> /v1/realtime/translations
  -> translated transcript deltas
  -> translated audio deltas
```

Use live mode when your agent has a browser page, call bridge, or media worker. Telegram bot chats alone do not provide continuous microphone streaming.

## Layers

- `src/agents`: manifests and schemas agents can understand.
- `src/modes`: mode/session state and high-level translation functions.
- `src/telegram`: Telegram command and voice-note integration.
- `src/realtime`: OpenAI Realtime Translation session helpers.
