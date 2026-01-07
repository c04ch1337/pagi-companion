# BACKEND_INTEGRATION_SUMMARY

This document is a high-level architectural review of the **PAGI Companion** backend stack, focused on integration points for a new research-focused frontend.

It reflects two supported runtime “profiles”:

1) **Docker Compose profile (recommended / current core stack)** – primary entry is the **Go Agent Planner**.
2) **Bare-metal dev harness (legacy demo stack)** – primary entry is the **Go BFF**.

---

## 1) Services & Languages

### Core (Docker Compose profile)

| Service | Directory | Language | Purpose |
|---|---|---:|---|
| Agent Planner | `backend-go-agent-planner/` | Go | Primary HTTP entrypoint for agent runs (RAG + tools + audit + notifications). |
| Model Gateway | `backend-go-model-gateway/` | Go | gRPC gateway for LLM calls (provider switching). |
| Memory Service | `backend-python-memory/` | Python | HTTP + gRPC memory/RAG service (Chroma-backed in compose). |
| Rust Sandbox | `backend-rust-sandbox/` | Rust | Tool execution service (HTTP + gRPC). |
| Notification Service | `backend-go-notification-service/` | Go | Redis pub/sub consumer for async notifications. |

### Legacy / Dev Harness

| Service | Directory | Language | Purpose |
|---|---|---:|---|
| Go BFF | `backend-go-bff/` | Go | Fan-out aggregator for demo UI. |
| Python Agent | `backend-python-agent/` | Python | Demo agent planning service (calls model gateway). |

### Research Companion Core (library)

| Component | Directory | Language | Purpose |
|---|---|---:|---|
| `pagi-companion-core` | `pagi-companion-core/` | Rust | Research “CompanionAgent” core: persistent semantic state + persistent identity + episodic RAG + psychological dynamics + Tactical LLM interface. |

> Note: `pagi-companion-core` is currently a **library**; it is exercised via the bare-metal runner wired into the Rust sandbox.

---

## 2) Primary entry point for a frontend client

### Recommended: Agent Planner (Compose profile)

External HTTP entrypoint is the **Go Agent Planner**.

Endpoints (host port 8585):

- `GET /health`
- `GET /metrics` (Prometheus)
- `POST /plan` (main execution)
- `POST /run` (alias)

These routes are defined in `backend-go-agent-planner/main.go`.

### Legacy: Go BFF (dev harness profile)

External HTTP entrypoint is the **Go BFF** (host port 8002).

Endpoints:

- `GET /health`
- `POST /api/v1/echo`
- `GET /api/v1/agi/dashboard-data`

---

## 3) Authentication / Authorization

### Agent Planner API Key (optional)

The Agent Planner supports an optional API key gate:

- Header: `X-API-Key: <key>`
- Or: `Authorization: Bearer <key>`

If `PAGI_API_KEY` is unset, auth is effectively disabled (dev-mode). If set, requests to non-health endpoints require the key.

---

## 4) External Interface Mapping (critical for frontend)

### A) Agent Planner (Go) – **primary frontend target**

**Base URL (compose):** `http://localhost:8585`

#### `POST /plan` (or `/run`)

**Request (JSON):**

```json
{
  "prompt": "string",
  "session_id": "string",
  "resources": [
    { "type": "string", "uri": "string" }
  ]
}
```

**Response (JSON):**

```json
{ "result": "string" }
```

**Behavioral notes:**

- `session_id` is the primary handle for memory/session continuity.
- If `PAGI_API_KEY` is set, requests must include the API key.

#### `GET /health`

Returns `{ "status": "ok" }`.

---

### B) Memory Service (Python)

**Base URL (compose):** `http://localhost:8003`

HTTP endpoints:

- `GET /health`
- `GET /memory/latest?session_id=...`
- `POST /memory/store`
- `POST /memory/playbook`

> In the Compose profile, the Agent Planner talks to the Memory Service primarily via **gRPC** for RAG + session history.

---

### C) Rust Sandbox (Rust)

**Base URL (compose/harness):** `http://localhost:8001`

HTTP endpoints:

- `GET /health`
- `POST /execute-tool`
- `POST /api/v1/execute_tool` (compat)

Additionally, it exposes a **gRPC ToolService** on port `50053` (compose).

---

### D) Model Gateway (Go)

Primary interface is **gRPC** on port `50051`.

There is also a small HTTP test endpoint:

- `GET /api/v1/vector-test`

---

## 5) Agentic “AGI Core” integration summary

There are two relevant “agent” layers in this repo:

### 5.1 Go Agent Planner (compose profile)

Frontend sends a single request to **Agent Planner** (`POST /plan`), which orchestrates:

- RAG/session history from Memory Service
- LLM plan generation via Model Gateway
- Tool execution via Rust Sandbox
- Optional async notifications via Redis

Frontend receives the final response synchronously as `{ result: "..." }`.

### 5.2 Rust Companion Core (research profile)

`pagi-companion-core` is currently **not** exposed as an HTTP API. It is exercised via a bare-metal runner integrated into `backend-rust-sandbox` (guarded by `RUN_COMPANION_RUNNER=1`).

For a frontend to use the Companion Core, you would typically add one of:

- a dedicated HTTP/gRPC service around the core
- an IPC/TCP “companion daemon” process (bare-metal friendly)

---

## Practical guidance for a new frontend

1) **If you’re integrating with the existing Compose stack:** target `http://localhost:8585/plan`.
2) **If you’re integrating with the research Companion Core:** decide a transport boundary first (HTTP/gRPC/TCP/IPC), because it’s library-first today.

