# RN Net Vision - Web Viewer Technical Specification

## Overview

Build a modern, performant web-based network traffic inspector for React Native applications, drawing inspiration from Flipper Network Debugger while maintaining a cleaner, more modern approach.

## Technical Stack

- TypeScript 5.0+ (strict mode enabled)
- Type 'any' not permitted
- Vite with Preact for optimal performance
- Yarn package management
- TailwindCSS 3.x for styling
- WebSocket client for real-time communication
- After each edit, ask yourself - "is it clean, optimal and atomic design?" if not adjust it

## Core Architecture

### Component Design

- Strict separation between UI components and business logic
- Implementation of modern React patterns (hooks, functional components)
- Atomic design methodology for component structure
- Zero runtime type checking for optimal performance

### Network Protocol

### User Interface

- Atomic Design
- Allow filter by all Log Fields
- Responsive layout
- Flipper-inspired modern UI
- System-aware dark/light theme with modern tailwind concept
- Smooth transitions (200ms)
- Keyboard navigation support (↑/↓)
- Smooth Animations
- Global and modern palette using tailwind
- Use Dark mode and Light mode across all app
- Dark Mode and Light mode with Modern concept of implementation

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
  requestBody?: string | Record<string, unknown> | unknown[];
  responseBody?: string | Record<string, unknown> | unknown[];
  cookies?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
}
```

### WebSocket Integration

- Connection endpoint: ws://localhost:8088
- Initial handshake payload: `{ type: 'vite-ready' }`
- Implement exponential backoff reconnection (5 retry maximum)
- Custom hook for WebSocket state management

### Performance Requirements

1. Bundle size: Maximum 200KB
2. Performance metrics:
   - First paint: 1.5s or less
   - Time to interactive: 2s or less
   - Smooth scrolling at 60fps

### State Management

- Component state: React useState
- Network logs: Custom optimized storage solution with persistence
- No external state management libraries permitted
- logs should reset every new socket connection but persist on refresh

### Directory Structure

```
web-viewer/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── App.tsx
├── tests/
├── tsconfig.json
└── package.json
```

## Quality Requirements

1. TypeScript Compliance:

   - Strict mode enabled
   - No type assertions
   - Complete type coverage

2. Browser Compatibility:

   - Support latest 2 versions of modern browsers
   - Responsive design (320px to 4K)
   - Zero console errors/warnings

3. Testing:

   - Minimum 90% unit test coverage
   - E2E tests for critical paths
   - Performance benchmark tests

4. Accessibility:
   - Full keyboard navigation
   - ARIA compliance
   - Screen reader support

## References

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
