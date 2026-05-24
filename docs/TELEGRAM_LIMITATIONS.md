# Telegram Limitations

Telegram bot chats are excellent for voice-note translation, but they are not the same as live microphone streaming.

## Works Well

- User sends a voice note.
- Bot downloads the audio file.
- Bot replies with translated text.
- Bot replies with translated voice.

## Needs A Separate Live Bridge

- Simultaneous call-like translation.
- Continuous microphone streaming.
- Two users speaking at the same time.

For these, send the user to a web page or call bridge that streams audio to OpenAI Realtime Translation.
