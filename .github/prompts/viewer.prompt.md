# RN Net Vision - Web Viewer Technical Specification

## Project Requirements

Build a React Native network traffic inspector with these specifications:

### Technical Stack

- Use only Typescript for new files
- Vite for build tooling
- React 18+ with TypeScript (strict mode)
- Keep vite and preact for thin client size and performance
- TailwindCSS for styling
- WebSocket connection to `ws://localhost:8088`

### Core Functionality

1. Real-time Network Monitoring

   - Connect to WebSocket endpoint
   - Parse and display incoming traffic logs
   - Clear logs on debugger restart
   - Send `{ type: 'vite-ready' }` on connection

2. UI Requirements
   - Responsive Design as possible
   - Flipper-inspired modern interface
   - System-aware dark/light theme with useContext or modern concepts
   - Request/response inspection panels
   - Status code indicators (2xx: green, 4xx/5xx: red)
   - Smooth transitions (200ms duration)
   - Keyboard navigation (↑/↓)

### Data Structure

```typescript
interface NetVisionLog {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  timestamp: string;
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
│   ├── components/  # Reusable UI components
│   ├── hooks/      # useSocket, useDarkMode
│   ├── store/      # LegendState or Zustand or Context+useReducer
│   ├── utils/      # Helper functions
│   ├── styles/     # TailwindCSS theme config
│   └── App.tsx
```

### Performance Requirements

- Implement virtualization for log lists
- Optimize render cycles and state updates
- Efficient memory management
- Responsive across viewport sizes
- Very Clean Code
- Divide Logic And UI By implement hooks and utils function

### Theme Tokens

```typescript
colors: {
  bg: {
    DEFAULT: 'white',
    dark: '#121212'
  },
  text: {
    DEFAULT: '#1f1f1f',
    dark: '#f5f5f5'
  },
  accent: '#4ade80'
}
```
