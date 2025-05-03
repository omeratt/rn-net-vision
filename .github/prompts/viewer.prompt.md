# RN Net Vision - Web Viewer Technical Specification

## Overview
Build a high-performance React Native network traffic inspector with TypeScript and modern web technologies.

## Technical Requirements

### Core Technology Stack
- TypeScript in strict mode (no `any` types permitted)
- Vite + Preact for optimal bundle size
- Yarn package manager
- TailwindCSS for styling
- WebSocket connection to `ws://localhost:8088`

### Development Guidelines
1. TypeScript Implementation
   - Strict mode enabled
   - Complete type coverage required
   - JS configuration files excluded from TypeScript conversion
   - Thorough type checking before file completion

2. State Management
   - Use local `useState` hooks for component-specific state
   - Avoid global state management
   - Implement Context API for theme management

3. Performance Optimization
   - Minimize unnecessary re-renders
   - Implement component memoization where beneficial
   - Use React DevTools for performance monitoring
   - Implement virtualization for log lists

## Functional Requirements

### Network Monitoring
1. WebSocket Integration
   - Connect to `ws://localhost:8088`
   - Send `{ type: 'vite-ready' }` on connection
   - Handle connection state management
   - Implement automatic reconnection

2. Traffic Logging
   - Real-time log parsing and display
   - Automatic log clearing on debugger restart
   - Request/response detail viewing
   - HTTP status code visualization
     - 2xx: Green
     - 4xx/5xx: Red

### User Interface
1. Design System
   - Responsive layout
   - Flipper-inspired modern UI
   - System-aware dark/light theme
   - Smooth transitions (200ms)
   - Keyboard navigation support (↑/↓)

2. Component Architecture
```typescript
interface NetVisionLog {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  timestamp: string; // Iso string
  requestHeaders: Record<string, string[]>;
  responseHeaders: Record<string, string[]>;
  requestBody?: string | Record<string, any> | any[];
  responseBody?: string | Record<string, any> | any[];
  cookies?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
}
```

### Project Structure
```
web-viewer/
├── src/
│   ├── components/  # UI components
│   ├── hooks/      # Custom hooks
│   ├── utils/      # Helper functions
│   ├── styles/     # TailwindCSS config
│   └── App.tsx     # Main application
```

### Theme Configuration
```typescript
interface ThemeColors {
  bg: {
    DEFAULT: 'white';
    dark: '#121212';
  };
  text: {
    DEFAULT: '#1f1f1f';
    dark: '#f5f5f5';
  };
  accent: '#4ade80';
}
```

## Quality Standards
- Clean, maintainable code
- Separation of concerns (UI/Logic)
- Comprehensive error handling
- Performance optimization
- Cross-browser compatibility
- Responsive design implementation