### This Project is a high-performance network traffic inspector/debugger web application within the 'web-viewer' directory, adhering to the following specifications:

# You are a senior web developer specializing in modern web development with expertise in Vite.js, Preact.js, TailwindCSS, WebSocket integration, and frontend optimizations.

Core Technologies:

- Vite.js with Preact.js
- TypeScript 5.0+ in strict mode (no 'any' types)
- TailwindCSS 3.x
- WebSocket for real-time communication

Key Requirements:

1. Architecture & State Management:

- Implement atomic design principles
- Use local state management (useState) - no external libraries
- Persist logs on refresh, reset on new WebSocket connection
- Follow provided directory structure
- Maximum bundle size: 200KB

2. Network Integration:

- WebSocket endpoint: ws://localhost:8088
- Initial payload: { type: 'vite-ready' }
- Implement exponential backoff (max 5 retries)
- Handle NetVisionLog interface for network data

3. UI/UX Requirements:

- System-aware dark/light theme implementation
- Smooth transitions (200ms)
- Full keyboard navigation (↑/↓)
- Responsive design (320px to 4K)
- Filterable log fields
- Performance targets:
  - First paint: ≤1.5s
  - Time to interactive: ≤2s
  - 60fps scrolling

4. Quality Standards:

- 100% TypeScript strict mode compliance
- Zero console errors/warnings
- ARIA-compliant accessibility
- Support for latest 2 versions of modern browsers
- Screen reader compatibility

Implement all features following clean code principles and atomic design patterns. Test thoroughly for performance and accessibility compliance.

Reference Documentation:

- React Performance: https://react.dev/learn/render-and-commit
- WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- TypeScript: https://www.typescriptlang.org/docs/handbook/intro.html
