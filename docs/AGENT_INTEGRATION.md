# Agent Integration

## OpenClaw

Load the manifest from:

```ts
import { createOpenClawSkillManifest } from "translate-skill-for-ai";
```

Register tool handlers for:

- `start_translation_mode`
- `update_translation_mode`
- `stop_translation_mode`
- `translate_telegram_voice_note`

## Hermes

Load the manifest from:

```ts
import { createHermesSkillManifest } from "translate-skill-for-ai";
```

Map Hermes commands to the same handlers.

## Prompt Guidance

Tell the agent:

```text
When a user asks for translation mode, call the translation tools.
Do not translate voice inside the normal response. Let the skill manage media and mode state.
```

## Common User Phrases

| User phrase | Tool action |
| --- | --- |
| "Turn on translation mode, Spanish" | `start_translation_mode`, `targetLanguage: "es"` |
| "Voice reply please" | `update_translation_mode`, `mode: "voice_to_voice"` |
| "Text only" | `update_translation_mode`, `mode: "voice_to_text"` |
| "Stop translating" | `stop_translation_mode` |
