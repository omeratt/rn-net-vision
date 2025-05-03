# Agent Instructions for RN Net Vision – Updated

## 🧠 Project Overview

This UI runs as a Vite-based web viewer and connects via WebSocket to `ws://localhost:8088`.  
It listens for network logs sent from a React Native application via a native interceptor.

The viewer allows developers to **inspect, navigate, and filter network traffic** – like Flipper – but with a **smoother, more modern design** and faster experience.

---

## 🎯 Goals

- Build a clear, modern, responsive UI for viewing network logs
- Support dark/light mode **throughout**
- Recreate and modernize **Flipper-like navigation** (keyboard navigation, scroll focus)
- Animate transitions and highlights with subtle, performant motion
- Build entirely with **TailwindCSS**, **React**, **TypeScript**
- Use a fixed **color palette**, Tailwind config extension
- Maintain clean, scalable component architecture with separation of concerns
- Persist logs in memory (not localStorage); logs should reset if debugger restarts

---

## 🔌 Socket Layer

Create a `useSocket.ts` hook that:

- Connects to `ws://localhost:8088`
- Listens for messages of shape:

```ts
type NetVisionLog = {
  type: 'network-log';
  method: string;
  url: string;
  duration: number; // in ms
  status: number;
  timestamp: string; // ISO string, generated on server side
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

- Stores logs in a **global store** (e.g., Zustand or Context + useReducer)
- Exposes methods to:
  - `clearLogs()`
  - `getLogs()`
  - `scrollTo(logId: string)`

---

## ⚙️ Folder Structure

Only touch files inside: `web-viewer/`

Suggested structure:

```
web-viewer/
├── src/
│   ├── components/      # UI components (LogItem, Header, Footer, etc.)
│   ├── hooks/           # useSocket.ts, useDarkMode.ts, useScrollFocus.ts
│   ├── store/           # logsStore.ts or global context
│   ├── utils/           # formatTimestamp.ts, parseHeaders.ts
│   ├── styles/          # tailwind.config.ts + theme tokens
│   └── App.tsx
├── dist/                # Built version from Vite
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🌗 Theming

- Add dark/light mode toggle
- Default to OS preference (`prefers-color-scheme`)
- Use Tailwind’s `dark:` variant system
- Define semantic tokens in Tailwind config, e.g.:

```ts
theme: {
  colors: {
    bg: {
      DEFAULT: 'white',
      dark: '#121212',
    },
    text: {
      DEFAULT: '#1f1f1f',
      dark: '#f5f5f5',
    },
    accent: '#4ade80', // green-400
    ...
  }
}
```

---

## 🎨 Design Principles

- Clean layout
- Fixed-width log viewer with scrollable list
- Focused item gets soft highlight
- Use Tailwind transitions (`transition-all`, `duration-200`)
- Animate log addition (fade-in or slide)
- Keyboard nav: Up/down arrows change selection

---

## ✅ Final Notes

- **Always use TypeScript**
- **Always separate logic/UI** (e.g., socket logic goes in hook, not in component)
- Keep performance in mind – no unnecessary renders or big state changes
- Keep every file short, focused, composable

Good luck, and enjoy building RN Net Vision 🎯

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
  responseHeaders: Record<string, string[]>;
  requestHeaders: Record<string, string[]>;
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
