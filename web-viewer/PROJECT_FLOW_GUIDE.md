# NetVision Web Viewer - Project Flow Guide

## 🎯 What is this project?

**NetVision Web Viewer** is a **real-time network monitoring dashboard** built with **Vite + Preact** that displays HTTP network requests from React Native applications. Think of it as a **developer tool similar to Chrome DevTools Network tab**, but specifically designed for debugging React Native app network traffic.

---

## 🖼️ How it looks and feels

### **Overall Appearance**

- **Modern glassmorphism design** with blur effects and gradient overlays
- **Split-panel layout** (like VS Code) - left panel shows request list, right panel shows details
- **Dark/light theme support** with smooth transitions
- **Responsive design** that works on desktop and mobile

### **Visual Style**

- **Gradient backgrounds** with indigo/purple/pink colors
- **Frosted glass effect** using backdrop-blur and transparency
- **Smooth animations** powered by Framer Motion
- **Modern typography** with gradient text effects
- **Status indicators** with pulsing animations and color coding

---

## 🎨 Layout & Design Structure

### **Header Section** (Top)

```
┌─────────────────────────────────────────────────────────────┐
│ [🔷 NetVision Logo] [🟢 Connected] [📱 Device] [🌙 Theme] │
└─────────────────────────────────────────────────────────────┘
```

- **Logo**: Gradient "NetVision" text with animated network icon
- **Connection Status**: Green/red pill showing server connection
- **Device Selector**: Dropdown to filter by specific devices
- **Theme Toggle**: Dark/light mode switcher

### **Main Content Area** (Split Panel)

```
┌─────────────────────┬──────────────────────────────┐
│   NETWORK LOG LIST  │    REQUEST DETAILS PANEL    │
│                     │                              │
│ [GET] /api/users    │  📋 Summary:                │
│ [POST] /auth/login  │  • URL: /api/users          │
│ [DELETE] /user/123  │  • Method: GET              │
│                     │  • Status: 200              │
│ Filter: [🔍______]  │  • Duration: 45ms           │
│ Clear: [🗑️ Clear]   │                              │
│                     │  📤 Request Headers         │
│ ▼ Resizable Handle  │  📥 Response Body           │
└─────────────────────┴──────────────────────────────┘
```

**Left Panel - Network Log List:**

- Filterable list of HTTP requests
- Color-coded by HTTP method (GET=blue, POST=green, etc.)
- Shows URL, status, duration, timestamp
- Clear button to remove logs

**Right Panel - Request Details:**

- Full request/response information
- Headers, body, cookies
- Formatted JSON viewer
- Copy buttons for easy debugging

---

## 🧩 Component Architecture (How it's built)

The project follows **Atomic Design** principles with 3 component levels:

### **🔸 Atoms** (Basic building blocks)

- `Button.tsx` - Styled buttons with variants
- `StatusBadge.tsx` - Colored pills for HTTP status codes
- `MethodBadge.tsx` - Colored badges for HTTP methods (GET, POST, etc.)
- `Toast.tsx` - Notification popups
- `JsonViewer.tsx` - Formatted JSON display

### **🔸 Molecules** (Component combinations)

- `ThemeToggle.tsx` - Dark/light mode switcher
- `LogDetailsPanel.tsx` - Right panel showing request details
- `NetworkLog.tsx` - Individual request row in the list
- `FilterPanel.tsx` - Search and filter controls

### **🔸 Organisms** (Complex UI sections)

- `Header.tsx` - Top navigation bar with logo, status, controls
- `NetworkLogs.tsx` - Main split-panel container
- `NetworkLogList.tsx` - Left panel with request list

---

## 🔄 How the app works (Data Flow)

### **1. Data Source**

```
React Native App → WebSocket → Web Viewer
```

- React Native apps send network logs via WebSocket
- Web viewer receives real-time updates
- Logs are stored in browser localStorage

### **2. State Management**

- **WebSocket Hook**: Manages connection and receives log data
- **Device Context**: Tracks connected devices and filtering
- **Theme Context**: Handles dark/light mode
- **Local Storage**: Persists logs between browser sessions

### **3. User Interactions**

1. **Select Device**: Filter logs by specific device
2. **Click Request**: View detailed request/response info
3. **Toggle Theme**: Switch between dark/light modes
4. **Clear Logs**: Remove all or device-specific logs
5. **Resize Panels**: Drag the split handle to adjust layout

---

## 💻 Technical Stack

- **Framework**: Preact (React-compatible, smaller bundle)
- **Build Tool**: Vite (fast development server)
- **Styling**: TailwindCSS (utility-first CSS)
- **Language**: TypeScript (type safety)
- **Animation**: Framer Motion (smooth transitions)
- **State**: React Context + Custom Hooks

---

## 🎮 What users see and do

### **Developer's Workflow:**

1. **Start React Native app** with NetVision integrated
2. **Open web viewer** in browser (usually http://localhost:3000)
3. **See real-time network requests** as they happen in the app
4. **Click on any request** to see full details (headers, body, etc.)
5. **Filter by device** if testing multiple devices
6. **Copy request/response data** for debugging
7. **Clear logs** when needed

### **Visual Experience:**

- **Smooth, modern interface** that feels like a professional dev tool
- **Real-time updates** with subtle animations
- **Easy-to-scan request list** with color coding
- **Detailed inspection panel** for thorough debugging
- **Responsive design** that works on any screen size

---

This web viewer is essentially a **beautiful, modern alternative to Chrome DevTools** specifically designed for React Native network debugging, with a focus on developer experience and visual appeal.
