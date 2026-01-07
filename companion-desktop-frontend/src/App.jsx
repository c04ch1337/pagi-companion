import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  appendChatMessage,
  clearCompanionStorage,
  getChatHistory,
  getIdentityConfig,
  setChatHistory,
  setIdentityConfig,
} from "./state/data-schemas.js";
import { createWebSocketClient } from "./services/websocket-client.js";

function uuid() {
  return globalThis.crypto?.randomUUID?.() ?? String(Date.now());
}

function defaultIdentityConfig() {
  return {
    sessionId: uuid(),
    name: "Companion",
    relationshipType: "Partner",
    archetype: "Supportive",
    sliders: {
      warmth: 0.8,
      directness: 0.6,
      playfulness: 0.7,
    },
    systemPromptText: "",
    createdAt: Date.now(),
  };
}

function Onboarding({ onInitialize }) {
  const [cfg, setCfg] = useState(defaultIdentityConfig);

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>Onboarding</h2>
      <label style={{ display: "block", marginBottom: 8 }}>
        Companion Name
        <input
          value={cfg.name}
          onChange={(e) => setCfg({ ...cfg, name: e.target.value })}
          style={{ display: "block", width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Relationship Type
        <select
          value={cfg.relationshipType}
          onChange={(e) => setCfg({ ...cfg, relationshipType: e.target.value })}
          style={{ display: "block", width: "100%" }}
        >
          <option>Partner</option>
          <option>Friend</option>
          <option>Mentor</option>
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Archetype
        <select
          value={cfg.archetype}
          onChange={(e) => setCfg({ ...cfg, archetype: e.target.value })}
          style={{ display: "block", width: "100%" }}
        >
          <option>Supportive</option>
          <option>Playful</option>
          <option>Direct</option>
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        System Prompt Notes
        <textarea
          value={cfg.systemPromptText}
          onChange={(e) => setCfg({ ...cfg, systemPromptText: e.target.value })}
          rows={6}
          style={{ display: "block", width: "100%" }}
        />
      </label>

      <button onClick={() => onInitialize(cfg)}>Initialize</button>
    </div>
  );
}

function PersonalitySettings({ cfg, onSave }) {
  const [draft, setDraft] = useState(cfg);
  useEffect(() => setDraft(cfg), [cfg]);

  // Very simple archetype→prompt mapping.
  useEffect(() => {
    const archetypePrompt =
      draft.archetype === "Playful"
        ? "Be playful, teasing, and upbeat."
        : draft.archetype === "Direct"
          ? "Be concise, direct, and pragmatic."
          : "Be warm, supportive, and encouraging.";

    setDraft((d) => ({
      ...d,
      systemPromptText: `${archetypePrompt}\n\n${d.systemPromptText || ""}`.trim(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.archetype]);

  function setSlider(name, value) {
    setDraft({
      ...draft,
      sliders: {
        ...draft.sliders,
        [name]: value,
      },
    });
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Personality Settings</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        Archetype
        <select
          value={draft.archetype}
          onChange={(e) => setDraft({ ...draft, archetype: e.target.value })}
          style={{ display: "block", width: "100%" }}
        >
          <option>Supportive</option>
          <option>Playful</option>
          <option>Direct</option>
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Warmth: {draft.sliders?.warmth ?? 0}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={draft.sliders?.warmth ?? 0}
          onChange={(e) => setSlider("warmth", Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Directness: {draft.sliders?.directness ?? 0}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={draft.sliders?.directness ?? 0}
          onChange={(e) => setSlider("directness", Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Playfulness: {draft.sliders?.playfulness ?? 0}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={draft.sliders?.playfulness ?? 0}
          onChange={(e) => setSlider("playfulness", Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        System Prompt Editor
        <textarea
          value={draft.systemPromptText}
          onChange={(e) => setDraft({ ...draft, systemPromptText: e.target.value })}
          rows={8}
          style={{ display: "block", width: "100%" }}
        />
      </label>

      <button onClick={() => onSave(draft)}>Save Changes</button>
    </div>
  );
}

function Chat({ cfg }) {
  const [history, setHistory] = useState(() => getChatHistory());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("disconnected");
  const [activeAssistantId, setActiveAssistantId] = useState(null);
  const clientRef = useRef(null);

  const wsUrl = useMemo(() => "ws://localhost:8585/ws/v1/companion", []);

  useEffect(() => {
    const client = createWebSocketClient({
      url: wsUrl,
      apiKey: localStorage.getItem("PAGI_API_KEY") || "",
      onEvent: (ev) => {
        if (ev.event === "ack") {
          setStatus("processing");
          return;
        }

        if (ev.event === "error") {
          setStatus("error");
          return;
        }

        if (ev.event === "agi_response") {
          setStatus("connected");
          const fullText = ev.data?.result ?? "";
          const id = uuid();
          setActiveAssistantId(id);

          // Create a placeholder assistant message, then pseudo-stream characters.
          setHistory((h) => {
            const next = [...h, { id, role: "assistant", text: "", ts: Date.now() }];
            setChatHistory(next);
            return next;
          });

          let i = 0;
          const timer = setInterval(() => {
            i += 4;
            setHistory((h) => {
              const next = h.map((m) =>
                m.id === id ? { ...m, text: fullText.slice(0, i) } : m
              );
              setChatHistory(next);
              return next;
            });

            if (i >= fullText.length) {
              clearInterval(timer);
              setActiveAssistantId(null);
              // Placeholder: Memory logic hook.
              // e.g., if (fullText.length > 300) open memory modal.
            }
          }, 30);
        }
      },
    });

    clientRef.current = client;
    setStatus("connected");
    return () => client.close();
  }, [wsUrl]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg = { id: uuid(), role: "user", text, ts: Date.now() };
    appendChatMessage(userMsg);
    setHistory(getChatHistory());

    clientRef.current?.sendMessage({ userPrompt: text, sessionId: cfg.sessionId });
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Chat</h3>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
        Status: {status}
        {activeAssistantId ? " (streaming…)" : ""}
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          height: 320,
          overflow: "auto",
          background: "#fafafa",
          marginBottom: 8,
        }}
      >
        {history.map((m) => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <strong>{m.role}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
          placeholder="Type a message…"
          style={{ flex: 1 }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default function App() {
  const [cfg, setCfg] = useState(() => getIdentityConfig());

  function reset() {
    clearCompanionStorage();
    setCfg(null);
  }

  function init(newCfg) {
    setIdentityConfig(newCfg);
    setChatHistory([]);
    setCfg(newCfg);
  }

  function saveSettings(nextCfg) {
    setIdentityConfig(nextCfg);
    setCfg(nextCfg);
  }

  if (!cfg) {
    return <Onboarding onInitialize={init} />;
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <header style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0, flex: 1 }}>Companion</h1>
        <button onClick={reset}>Reset / New Match</button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Chat cfg={cfg} />
        <PersonalitySettings cfg={cfg} onSave={saveSettings} />
      </div>
    </div>
  );
}


