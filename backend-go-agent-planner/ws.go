package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"backend-go-agent-planner/agent"
	"backend-go-agent-planner/internal/logger"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type wsClientMessage struct {
	Action  string          `json:"action"`
	Payload json.RawMessage `json:"payload"`
}

type wsEvent struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(_ *http.Request) bool {
		// Research/dev: allow all origins. If deploying beyond localhost, lock this down.
		return true
	},
}

// companionWebSocketHandler exposes a websocket transport suitable for a desktop frontend.
//
// Route: GET /ws/v1/companion
//
// Message contract:
// - Client -> Server: {"action":"send_message","payload": {"prompt":"...","session_id":"...","resources":[]}}
// - Server -> Client events:
//   - {"event":"ack","data": {"request_id":"...","trace_id":"..."}}
//   - {"event":"agi_response","data": {"request_id":"...","trace_id":"...","result":"..."}}
//   - {"event":"error","data": {"request_id":"...","trace_id":"...","message":"..."}}
func companionWebSocketHandler(planner *agent.Planner) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// NOTE: API key auth is enforced by the existing middleware chain.
		// This handler assumes the request is already authorized.
		conn, err := wsUpgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		defer conn.Close()

		// Basic keepalive.
		_ = conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		conn.SetPongHandler(func(string) error {
			_ = conn.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		sendCh := make(chan wsEvent, 16)
		done := make(chan struct{})

		// Write loop.
		go func() {
			defer close(done)
			for ev := range sendCh {
				_ = conn.SetWriteDeadline(time.Now().Add(15 * time.Second))
				if err := conn.WriteJSON(ev); err != nil {
					return
				}
			}
		}()

		// Read loop.
		for {
			var msg wsClientMessage
			if err := conn.ReadJSON(&msg); err != nil {
				close(sendCh)
				<-done
				return
			}

			requestID := uuid.New().String()
			traceID := uuid.New().String()
			ctx := context.WithValue(r.Context(), logger.TraceIDKey, traceID)

			sendCh <- wsEvent{Event: "ack", Data: map[string]string{"request_id": requestID, "trace_id": traceID}}

			switch msg.Action {
			case "send_message":
				var payload PlanRequest
				if err := json.Unmarshal(msg.Payload, &payload); err != nil {
					sendCh <- wsEvent{Event: "error", Data: map[string]string{"request_id": requestID, "trace_id": traceID, "message": "invalid payload"}}
					continue
				}

				if payload.Prompt == "" || payload.SessionID == "" {
					sendCh <- wsEvent{Event: "error", Data: map[string]string{"request_id": requestID, "trace_id": traceID, "message": "prompt and session_id are required"}}
					continue
				}

				result, err := planner.AgentLoop(ctx, payload.Prompt, payload.SessionID, payload.Resources)
				if err != nil {
					sendCh <- wsEvent{Event: "error", Data: map[string]string{"request_id": requestID, "trace_id": traceID, "message": err.Error()}}
					continue
				}

				sendCh <- wsEvent{Event: "agi_response", Data: map[string]string{"request_id": requestID, "trace_id": traceID, "result": result}}
			default:
				sendCh <- wsEvent{Event: "error", Data: map[string]string{"request_id": requestID, "trace_id": traceID, "message": "unknown action"}}
			}
		}
	}
}
