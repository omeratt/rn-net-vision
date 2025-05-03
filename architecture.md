# 📊 RN Net Vision - Architecture Overview (Updated)

## 🔍 Components Overview

| Component         | IP Address                   | Port(s)                      | Protocol(s)      | Description                                                            |
| ----------------- | ---------------------------- | ---------------------------- | ---------------- | ---------------------------------------------------------------------- |
| Metro Middleware  | `localhost`                  | `8081`                       | HTTP             | Serves JS bundle, intercepts `/net-vision-trigger` and spawns debugger |
| start-debugger.js | (Local Process)              | -                            | Node.js          | Spawns debug-server and Vite viewer (dev or production mode)           |
| debug-server.js   | `localhost`                  | `8088`, `8089`, `3232`       | WebSocket, HTTP  | Handles request relay, shutdown logic, ready-check server              |
| Vite Viewer (UI)  | `localhost`                  | `5173`                       | HTTP             | Web frontend to visualize network traffic                              |
| Native App        | `10.0.2.2` or Real Device IP | WebSocket (Client to `8088`) | WebSocket Client | Sends network traffic to debugger with full metadata                   |

## 🌐 Communication Flows

| #   | Source → Target              | Transport         | Description                                                             |
| --- | ---------------------------- | ----------------- | ----------------------------------------------------------------------- |
| 1   | Dev Menu → Metro             | HTTP Fetch        | Triggers `/net-vision-trigger`                                          |
| 2   | Metro → start-debugger       | Node Spawn        | Spawns `debug-server` + Vite (via `npm run dev` / `npm run production`) |
| 3   | Native App → debug-server    | WebSocket         | Sends JSON-encoded logs (`type: network-log`)                           |
| 4   | debug-server → Vite Viewer   | WebSocket         | Forwards logs to web dashboard                                          |
| 5   | Vite Viewer → debug-server   | WebSocket Message | Sends `vite-ready`, used to track viewer tab open/close                 |
| 6   | Native App → Shutdown Server | HTTP POST         | Calls `http://localhost:8089/shutdown` on debugger exit                 |
| 7   | debug-server → shutdown      | Node Process      | Closes all related ports when viewer tab is truly closed                |

## 🧱 Message Format: `network-log`

```ts
type NetVisionLog = {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  timestamp: string; // ← added (local server time, ISO string)

  requestHeaders: Record<string, string[]>;
  responseHeaders: Record<string, string[]>;

  requestBody?: string | Record<string, any> | any[];
  responseBody?: string | Record<string, any> | any[];

  cookies?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
};
```

## 🔧 Key Ports Summary

| Port | Purpose                           |
| ---- | --------------------------------- |
| 8081 | Metro Bundler                     |
| 8088 | WebSocket Debugger                |
| 8089 | HTTP Shutdown Handler             |
| 3232 | Ready-check (debug-server status) |
| 5173 | Vite Web Viewer (UI)              |

## ⚠️ Development Tips

- Always verify host ↔ emulator/real device routing (`10.0.2.2`, `localhost`, `adb reverse`)
- Avoid sending internal NetVision requests (e.g., `/net-vision-trigger`) to the debugger
- Use the `type: network-log` field to filter messages in the viewer
- In production, only the `dist/` of the Vite UI is shipped, not the `src/`
