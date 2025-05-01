# 🧠 Agent Instructions for `rn-net-vision` UI

## 📁 Project Structure

Work only inside the `web-viewer` folder:

```
rn-net-vision/
├── android/
├── ios/
├── lib/
├── metro/
├── server/
├── web-viewer/              ◀️ Only work inside this directory
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── dist/
│   ├── index.html
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── package.json
└── README.md
```

---

## 🧠 Project Overview

This project (`rn-net-vision`) is a React Native network debugger.  
The frontend is built using **Vite + React + TypeScript**, and communicates with a local WebSocket server to **receive real-time intercepted network requests** from a native mobile app (Android/iOS).

### Incoming WebSocket Payload Type

```ts
type NetVisionLog = {
  type: 'network-log';
  method: string;
  url: string;
  duration: number; // ms
  status: number;
  headers: Record<string, string[]>;
  requestBody?: string;
  responseBody?: string;
  cookies?: Record<string, string>;
};
```

---

## 🎨 UI Goals

Build a **modern, techy, clean and responsive UI**:

- ✅ Tailwind CSS
- ✅ Supports **dark mode** and **light mode**
- ✅ Uses animations (Framer Motion or Tailwind transitions)
- ✅ Clear visual hierarchy (method, URL, duration, status)
- ✅ Feels like a DevTools network inspector
- ✅ Mobile-friendly and responsive

---

## ⚙️ Functionality

- Connect to a WebSocket server and listen to incoming logs
- Persist logs across refresh using `localStorage` or `indexedDB`
- Provide a **Clear Logs** button to reset logs
- Display all available fields from the logs:
  • HTTP method
  • URL
  • Status code
  • Response time (duration)
  • Request / Response headers
  • Cookies if available
  • Request/Response bodies (if provided)

---

## 🧱 Architecture

- Separate business logic from UI using custom hooks:
  - `useWebSocket`, `useLogs`
- Use **TypeScript** with strict typing
- Optimize for **performance**:
  - No unnecessary re-renders
  - Use memoization and virtualized lists if needed

---

## ✨ UX Guidelines

- Use soft transitions and animations
- Color-code status codes (2xx green, 4xx/5xx red, etc.)
- Expandable/collapsible log entries
- Keyboard-accessible and fast interactions

---

## 🔧 Stack Summary

- [x] Vite + React + TypeScript
- [x] Tailwind CSS
- [x] Framer Motion (optional)
- [x] Custom hooks for logic separation
