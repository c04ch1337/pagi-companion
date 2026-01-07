import { getChatHistory, getIdentityConfig } from "../state/data-schemas.js";

// Backend endpoint: ws://localhost:8585/ws/v1/companion

function buildSystemInstruction(cfg) {
  if (!cfg) return "";

  const sliderLines = Object.entries(cfg.sliders || {})
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return [
    "SYSTEM INSTRUCTION:",
    `Companion name: ${cfg.name}`,
    `Relationship type: ${cfg.relationshipType}`,
    `Archetype: ${cfg.archetype}`,
    sliderLines ? `Sliders:\n${sliderLines}` : "",
    cfg.systemPromptText ? `System prompt notes:\n${cfg.systemPromptText}` : "",
    "---",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHistoryContext(history, n = 10) {
  const last = history.slice(-n);
  return last
    .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
    .join("\n");
}

export function createWebSocketClient({ url, apiKey, onEvent }) {
  const wsUrl = apiKey ? `${url}?api_key=${encodeURIComponent(apiKey)}` : url;
  const ws = new WebSocket(wsUrl);

  ws.addEventListener("message", (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      onEvent?.(msg);
    } catch {
      // ignore
    }
  });

  return {
    ws,
    sendMessage({ userPrompt, sessionId, resources = [] }) {
      const cfg = getIdentityConfig();
      const history = getChatHistory();

      const systemInstruction = buildSystemInstruction(cfg);
      const historyContext = buildHistoryContext(history, 12);

      const fullPrompt = [systemInstruction, historyContext, `USER: ${userPrompt}`]
        .filter(Boolean)
        .join("\n\n");

      ws.send(
        JSON.stringify({
          action: "send_message",
          payload: {
            prompt: fullPrompt,
            session_id: sessionId,
            resources,
          },
        })
      );
    },
    close() {
      ws.close();
    },
  };
}


