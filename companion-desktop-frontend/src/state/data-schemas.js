// LocalStorage keys (companion naming)
export const LS_AI_IDENTITY_CONFIG = "companion_ai_identity_config";
export const LS_CHAT_HISTORY = "companion_chat_history";
export const LS_MEMORIES = "companion_memories";

export function getLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearCompanionStorage() {
  localStorage.removeItem(LS_AI_IDENTITY_CONFIG);
  localStorage.removeItem(LS_CHAT_HISTORY);
  localStorage.removeItem(LS_MEMORIES);
}

// ---- Typed-ish helpers (JS) ----

export function getIdentityConfig() {
  return getLocalStorage(LS_AI_IDENTITY_CONFIG, null);
}

export function setIdentityConfig(cfg) {
  setLocalStorage(LS_AI_IDENTITY_CONFIG, cfg);
}

export function getChatHistory() {
  return getLocalStorage(LS_CHAT_HISTORY, []);
}

export function setChatHistory(history) {
  setLocalStorage(LS_CHAT_HISTORY, history);
}

export function appendChatMessage(message) {
  const history = getChatHistory();
  history.push(message);
  setChatHistory(history);
}

export function getMemories() {
  return getLocalStorage(LS_MEMORIES, []);
}

export function setMemories(memories) {
  setLocalStorage(LS_MEMORIES, memories);
}


