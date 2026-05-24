import { createServer } from "node:http";
import { loadRuntimeConfig } from "../config.js";
import { OpenAITranslationClient } from "./openai-translation-client.js";

export function startWebRtcTokenServer(port = Number(process.env.PORT ?? 8787)) {
  const config = loadRuntimeConfig();
  const client = new OpenAITranslationClient(config);

  const server = createServer(async (request, response) => {
    if (request.method !== "POST" || request.url !== "/translation-session") {
      response.writeHead(404).end("Not found");
      return;
    }

    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}") as { targetLanguage?: string; voice?: string };
        const session = await client.createRealtimeSession({
          targetLanguage: payload.targetLanguage ?? "en",
          voice: payload.voice
        });
        response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(session));
      } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" }).end(
          JSON.stringify({ error: error instanceof Error ? error.message : String(error) })
        );
      }
    });
  });

  server.listen(port, () => {
    console.log(`Realtime translation token server listening on http://localhost:${port}`);
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWebRtcTokenServer();
}
