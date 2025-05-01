# 📊 RN Net Vision - Architecture Overview

## 🔍 Components Overview

| Component         | IP Address                   | Port(s)                              | Protocol(s)               | Description                                        |
| ----------------- | ---------------------------- | ------------------------------------ | ------------------------- | -------------------------------------------------- |
| Metro Middleware  | `localhost`                  | `8081`                               | HTTP                      | Serves JS bundle, intercepts `/net-vision-trigger` |
| start-debugger.js | (Local Process)              | -                                    | Node.js Spawn             | Spawns debug-server and Vite viewer                |
| debug-server.js   | `localhost`                  | `4242` (UDP) <br> `8088` (WebSocket) | UDP Broadcast + WebSocket | Handles discovery and WebSocket communication      |
| Vite Viewer       | `localhost`                  | `5173`                               | HTTP                      | Web frontend to visualize requests                 |
| Native App        | `10.0.2.2` or Real Device IP | Dynamic (client WebSocket)           | WebSocket Client          | Sends network traffic to debugger                  |
| Shutdown Server   | `localhost`                  | `8089`                               | HTTP POST                 | Receives shutdown requests from native             |

---

## 🌐 Communication Flows

| #   | Source → Target               | Transport         | Description                                      |
| --- | ----------------------------- | ----------------- | ------------------------------------------------ |
| 1   | Dev Menu → Metro              | HTTP Fetch        | Triggers `/net-vision-trigger` to start debugger |
| 2   | Metro → start-debugger        | Local Spawn       | Spawns debug-server and Vite viewer              |
| 3   | start-debugger → debug-server | Internal          | Starts UDP and WebSocket servers                 |
| 4   | debug-server → Native App     | UDP Broadcast     | Sends discovery packet every 2s on `4242`        |
| 5   | Native App → debug-server     | WebSocket Connect | Connects to WebSocket server on `8088`           |
| 6   | debug-server → Vite Viewer    | WebSocket Message | Pushes network request events                    |
| 7   | Native App → Shutdown Server  | HTTP POST         | Sends shutdown request to `8089`                 |
| 8   | Vite Viewer → debug-server    | WebSocket Message | Sends `vite-ready` when ready                    |

---

## 🔍 Key Ports Summary

- **8081** — Metro Bundler (React Native Dev Server)
- **4242** — UDP Broadcast (Discovery)
- **8088** — WebSocket Debugger (Network events)
- **8089** — Shutdown server (HTTP POST)
- **5173** — Vite Web Frontend

---

## 🚀 Notes

- **Localhost (127.0.0.1)** is valid only from the Metro/Vite/DebugServer side.
- **10.0.2.2** is Android emulator's way to access the host's localhost.
- Real devices will require proper dynamic discovery.
- **UDP discovery** automatically handles IP detection without manual input.
- **Shutdown stability** is critical to avoid stale open ports on restart.

---

# 📅 Always Debug Strategically

When encountering any bug or miscommunication:

- Locate where in this architecture the failure occurs.
- Identify the IP and port in use.
- Verify protocol (HTTP/WS/UDP).

This discipline will make debugging faster and cleaner every time. ✨
