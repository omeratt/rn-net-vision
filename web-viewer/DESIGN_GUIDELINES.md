# RN Net Vision - Design Guidelines

> **Comprehensive Design System & Component Architecture Guide**
>
> Based on the web-viewer Vite project analysis - A modern, component-based design system built with Preact, TypeScript, and TailwindCSS.

---

## 📋 Table of Contents

- [🎯 Design Philosophy](#-design-philosophy)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🎨 Design System](#-design-system)
- [🧩 Component Architecture](#-component-architecture)
- [📱 Responsive Design](#-responsive-design)
- [🌗 Theme System](#-theme-system)
- [✨ Animation & Motion](#-animation--motion)
- [🎭 Component Library](#-component-library)
- [🔧 Development Guidelines](#-development-guidelines)
- [📊 Performance Considerations](#-performance-considerations)

---

## 🎯 Design Philosophy

### Core Principles

1. **Modern Glassmorphism**: Utilizes backdrop-blur, transparency, and layered gradients
2. **Component-Driven**: Atomic Design methodology (Atoms → Molecules → Organisms)
3. **Dark-First**: Built with dark mode as a first-class citizen
4. **Performance-Oriented**: Optimized animations and efficient re-renders
5. **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML

### Visual Language

- **Clean & Minimal**: Emphasis on content with subtle visual enhancements
- **Progressive Enhancement**: Graceful degradation across devices
- **Consistent Spacing**: 4px base unit system via Tailwind
- **Contextual Colors**: Semantic color system based on HTTP methods and status codes

---

## 🏗️ Architecture Overview

### Technology Stack

```typescript
// Core Framework
Framework: Preact (React-compatible, lighter bundle)
Language: TypeScript (strict type safety)
Styling: TailwindCSS v4 (utility-first CSS)
Build Tool: Vite (fast HMR and bundling)
Animation: Framer Motion (performance-optimized animations)
State: Context API + Custom Hooks
```

### Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Component combinations
│   └── organisms/      # Complex UI sections
├── context/           # Global state management
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
├── utils/            # Helper functions & styling
└── app.tsx          # Root application component
```

---

## 🎨 Design System

### Color Palette

#### Primary Colors

```css
/* Brand Colors */
--primary-indigo: #6366f1 /* Primary brand color */ --primary-purple: #8b5cf6
  /* Secondary brand accent */ --primary-pink: #ec4899 /* Tertiary accent */
  /* Semantic Colors */ --success: #10b981 /* Success states */
  --warning: #f59e0b /* Warning states */ --error: #ef4444 /* Error states */
  --info: #3b82f6 /* Information states */;
```

#### HTTP Method Colors

```css
--method-get: #3b82f6 /* Blue - GET requests */ --method-post: #10b981
  /* Green - POST requests */ --method-put: #8b5cf6 /* Purple - PUT requests */
  --method-delete: #ef4444 /* Red - DELETE requests */ --method-patch: #f59e0b
  /* Yellow - PATCH requests */;
```

#### Status Code Colors

```css
--status-success: #10b981 /* 2xx responses */ --status-redirect: #3b82f6
  /* 3xx responses */ --status-error: #ef4444 /* 4xx/5xx responses */;
```

### Typography

#### Font Stack

```css
/* Primary Font */
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  Oxygen,
  Ubuntu,
  Cantarell,
  'Open Sans',
  'Helvetica Neue',
  sans-serif;

/* Monospace (Code/Data) */
font-family: 'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace;
```

#### Typography Scale

```css
/* Headers */
.text-2xl    /* 24px - Main titles */
.text-xl     /* 20px - Section headers */
.text-lg     /* 18px - Sub-headers */

/* Body Text */
.text-base   /* 16px - Primary body text */
.text-sm     /* 14px - Secondary text */
.text-xs     /* 12px - Captions, badges */
```

### Spacing System

Based on 4px increments:

```css
.p-1   /* 4px */    .p-2   /* 8px */     .p-3   /* 12px */
.p-4   /* 16px */   .p-6   /* 24px */    .p-8   /* 32px */
.p-12  /* 48px */   .p-16  /* 64px */    .p-24  /* 96px */
```

### Border Radius

```css
.rounded-lg    /* 8px - Cards, containers */
.rounded-xl    /* 12px - Buttons, inputs */
.rounded-full  /* 50% - Badges, avatars */
```

---

## 🧩 Component Architecture

### Atomic Design Methodology

#### Atoms (Basic Building Blocks)

```typescript
// Example: Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: ComponentChildren;
}

// Features:
// - Gradient backgrounds with hover effects
// - Shimmer animation on hover
// - Scale transforms for interaction feedback
// - Focus ring for accessibility
```

**Key Atoms:**

- `Button` - Interactive elements with hover effects
- `Badge` - Status indicators (Method, Status, Duration)
- `Input` - Form controls with focus states
- `Toast` - Notification system
- `StatusIndicator` - Connection status visualization

#### Molecules (Component Combinations)

```typescript
// Example: BadgeRow Component
interface BadgeRowProps {
  method: string;
  status: number;
  duration: number;
  deviceId?: string;
  isSelected: boolean;
}

// Combines multiple atoms:
// - MethodBadge + StatusBadge + DurationBadge + DeviceBadge
```

**Key Molecules:**

- `BadgeRow` - Groups related badges
- `CollapsibleSection` - Expandable content areas
- `ThemeToggle` - Dark/light mode switcher
- `NetworkLogContainer` - Individual log entry
- `ModernDeviceSelector` - Device selection dropdown

#### Organisms (Complex UI Sections)

```typescript
// Example: Header Component
interface HeaderProps {
  isConnected: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Combines multiple molecules and atoms
// - Logo + ConnectionStatus + DeviceSelector + ThemeToggle
```

**Key Organisms:**

- `Header` - App navigation and controls
- `NetworkLogs` - Main log display area
- `NetworkLogList` - Virtualized log list

### Component Patterns

#### 1. Hover Effects

```css
/* Subtle scale and shadow on hover */
.hover:scale-105 .hover:shadow-xl
.group-hover:text-indigo-600
.group-hover:bg-gradient-to-r
```

#### 2. Focus States

```css
/* Accessible focus rings */
.focus:outline-none
.focus:ring-4 .focus:ring-indigo-500/50
.focus:ring-offset-2
```

#### 3. Loading States

```css
/* Shimmer and pulse animations */
.animate-pulse
.animate-shimmer
```

#### 4. Transitions

```css
/* Smooth transitions for all interactions */
.transition-all .duration-300 .ease-out
```

---

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Tailwind Breakpoints */
xs: '475px'    /* Extra small devices */
sm: '640px'    /* Small devices */
md: '768px'    /* Medium devices */
lg: '1024px'   /* Large devices */
xl: '1280px'   /* Extra large devices */
```

### Mobile-First Approach

#### Component Adaptation

```typescript
// Responsive badge sizing
className = 'px-2 py-1 xs:px-3 xs:py-1.5';

// Responsive grid layouts
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

// Responsive text sizing
className = 'text-sm xs:text-base md:text-lg';
```

#### Container Queries

```css
/* Using @tailwindcss/container-queries */
@container (min-width: 300px) {
  .badge-row {
    flex-direction: row;
  }
}
```

### Layout Patterns

#### 1. Header Layout

- **Mobile**: Stacked navigation with collapsible menu
- **Desktop**: Horizontal navigation with all controls visible

#### 2. Main Content

- **Mobile**: Single column, full-width cards
- **Desktop**: Split-panel layout with details sidebar

#### 3. Badges and Controls

- **Mobile**: Reduced padding, smaller text
- **Desktop**: Full-size with hover effects

---

## 🌗 Theme System

### Implementation Strategy

#### 1. CSS Custom Properties

```css
:root {
  --theme-transition-duration: 300ms;
  --theme-transition-timing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

#### 2. Tailwind Dark Mode

```typescript
// Using class-based dark mode
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    Content adapts to theme
  </p>
</div>
```

#### 3. Context-Based Theme Management

```typescript
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
```

### Theme-Aware Components

#### Gradient Overlays

```css
/* Light mode gradients */
.bg-gradient-to-r.from-indigo-50.to-blue-50

/* Dark mode gradients */
.dark:from-indigo-900/30.dark:to-blue-900/30
```

#### Glass Effects

```css
/* Light mode glass */
.bg-white/90.backdrop-blur-xl

/* Dark mode glass */
.dark:bg-gray-800/90.dark:backdrop-blur-xl
```

#### Border Adaptations

```css
/* Adaptive borders with transparency */
.border-gray-200/60.dark: border-gray-700/60;
```

---

## ✨ Animation & Motion

### Animation Philosophy

1. **Purposeful**: Animations guide user attention and provide feedback
2. **Performance-First**: CSS transforms over layout changes
3. **Subtle**: Enhance without distracting
4. **Accessible**: Respect `prefers-reduced-motion`

### Animation Patterns

#### 1. Micro-interactions

```css
/* Hover scale effects */
.transform.hover:scale-105.transition-transform.duration-200

/* Focus ring animations */
.focus:ring-4.transition-all.duration-150
```

#### 2. Loading States

```css
/* Pulse animation for loading */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer effect for skeleton loading */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

#### 3. State Transitions

```css
/* Collapsible content */
.transition-all.duration-300.ease-out
.max-h-0.opacity-0 /* Collapsed */
.max-h-screen.opacity-100 /* Expanded */
```

#### 4. Theme Transitions

```css
/* Smooth theme switching */
* {
  transition:
    background-color var(--theme-transition-duration)
      var(--theme-transition-timing),
    border-color var(--theme-transition-duration) var(--theme-transition-timing),
    color var(--theme-transition-duration) var(--theme-transition-timing);
}
```

### Performance Optimization

#### GPU Acceleration

```css
/* Force GPU acceleration for smooth animations */
.transform-gpu
.backface-visibility-hidden
.perspective-1000
```

#### Animation Cleanup

```typescript
// Disable transitions during theme changes
useEffect(() => {
  document.body.classList.add('theme-transitioning');
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 300);
}, [isDarkMode]);
```

---

## 🎭 Component Library

### Atom Components

#### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Features:
// - Gradient backgrounds
// - Shimmer hover effect
// - Scale feedback
// - Focus accessibility
```

#### Badge Components

```typescript
// MethodBadge - HTTP method indicators
// StatusBadge - Response status codes
// DurationBadge - Request timing
// DeviceBadge - Device identification
// TimestampBadge - Time formatting

// Color system based on semantic meaning
const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-blue-100 text-blue-800';
    case 'POST':
      return 'bg-green-100 text-green-800';
    // ...
  }
};
```

#### Input Components

```typescript
interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: SelectOption[];
  type?: 'text' | 'select';
  icon?: VNode;
}

// Features:
// - Icon support
// - Dropdown options
// - Focus states
// - Search filtering
```

### Molecule Components

#### CollapsibleSection

```typescript
interface CollapsibleSectionProps {
  title: string;
  variant: 'section' | 'field';
  isCollapsed: boolean;
  toggle: () => void;
  children: ComponentChildren;
}

// Features:
// - Smooth expand/collapse
// - Chevron rotation
// - Section variants
// - Accessible controls
```

#### ModernDeviceSelector

```typescript
interface DeviceSelectorProps {
  isConnected: boolean;
}

// Features:
// - Dropdown portal
// - Device status indicators
// - Platform icons (iOS/Android)
// - Smooth animations
```

### Organism Components

#### Header

```typescript
interface HeaderProps {
  isConnected: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Layout:
// - Logo with animated icon
// - Connection status
// - Device selector
// - Theme toggle
// - Debug panel trigger
```

#### NetworkLogs

```typescript
// Features:
// - Virtual scrolling
// - Filter panel
// - Log selection
// - Detail sidebar
// - Responsive layout
```

---

## 🔧 Development Guidelines

### File Organization

```
src/components/
├── atoms/
│   ├── Button.tsx
│   ├── Badge.tsx
│   └── index.ts          # Export all atoms
├── molecules/
│   ├── BadgeRow.tsx
│   ├── ThemeToggle.tsx
│   └── index.ts          # Export all molecules
└── organisms/
    ├── Header.tsx
    ├── NetworkLogs.tsx
    └── index.ts          # Export all organisms
```

### Component Structure

```typescript
/** @jsxImportSource preact */
import type { VNode } from 'preact';

interface ComponentProps {
  // Props with defaults
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  // Required props
  children: ComponentChildren;
}

export const Component = ({
  variant = 'default',
  size = 'md',
  children,
}: ComponentProps): VNode => {
  // Component logic here

  return (
    <div className={`base-classes ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};
```

### Styling Conventions

#### 1. Utility Classes Organization

```typescript
const baseClasses = [
  'relative',
  'overflow-hidden', // Layout
  'px-4',
  'py-2',
  'rounded-xl', // Spacing & borders
  'transition-all',
  'duration-300', // Animations
  'focus:outline-none',
  'focus:ring-4', // Accessibility
].join(' ');
```

#### 2. Variant Patterns

```typescript
const variantClasses = {
  primary: [
    'bg-gradient-to-r',
    'from-blue-600',
    'to-indigo-600',
    'text-white',
    'shadow-lg',
    'hover:from-blue-700',
    'hover:to-indigo-700',
    'dark:from-blue-500',
    'dark:to-indigo-500',
  ].join(' '),
  secondary: [
    // Secondary variant styles
  ].join(' '),
};
```

#### 3. Responsive Modifiers

```typescript
// Always mobile-first
const responsiveClasses = [
  'text-sm',
  'xs:text-base',
  'md:text-lg', // Text scaling
  'px-2',
  'xs:px-3',
  'md:px-4', // Padding scaling
  'grid-cols-1',
  'md:grid-cols-2', // Layout changes
].join(' ');
```

### State Management

#### 1. Context for Global State

```typescript
// Theme, device selection, toast notifications
const GlobalContext = createContext<GlobalState | null>(null);
```

#### 2. Custom Hooks for Logic

```typescript
// useWebSocket - WebSocket connection management
// useTheme - Theme switching logic
// useFilteredLogs - Log filtering and searching
// useLogSelection - Selected log state
```

#### 3. Local State for Components

```typescript
// Component-specific state (open/closed, focus, etc.)
const [isOpen, setIsOpen] = useState(false);
const [isFocused, setIsFocused] = useState(false);
```

---

## 📊 Performance Considerations

### Bundle Optimization

#### Code Splitting

```typescript
// Dynamic imports for large components
const LazyComponent = lazy(() => import('./components/HeavyComponent'));

// Route-based splitting
const routes = [{ path: '/', component: lazy(() => import('./pages/Home')) }];
```

#### Tree Shaking

```typescript
// Named imports only
import { Button } from './components/atoms';

// Avoid default imports for utility functions
import { getMethodColor, getStatusColor } from './utils/badgeUtils';
```

### Runtime Performance

#### Virtual Scrolling

```typescript
// For large log lists
import { VirtualList } from '@tanstack/react-virtual';

// Only render visible items
const virtualizer = useVirtualizer({
  count: logs.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
});
```

#### Memo for Expensive Components

```typescript
// Memoize complex calculations
const MemoizedLogEntry = memo(LogEntry, (prev, next) => {
  return prev.log.id === next.log.id && prev.isSelected === next.isSelected;
});
```

#### CSS Optimizations

```css
/* GPU acceleration for animations */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Efficient transitions */
.transition-transform /* Better than transition-all */
```

### Accessibility

#### ARIA Labels

```typescript
// Descriptive labels for interactive elements
<button
  aria-label="Toggle dark mode"
  aria-pressed={isDarkMode}
>
```

#### Keyboard Navigation

```typescript
// Handle keyboard events
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    toggle();
  }
};
```

#### Focus Management

```typescript
// Focus trap for modals
import { useFocusTrap } from './hooks/useFocusTrap';

const modalRef = useFocusTrap(isOpen);
```

---

## 🚀 Implementation Examples

### Creating a New Atom Component

```typescript
// src/components/atoms/NewBadge.tsx
/** @jsxImportSource preact */
import type { VNode } from 'preact';

interface NewBadgeProps {
  variant?: 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: string;
}

export const NewBadge = ({
  variant = 'success',
  size = 'md',
  children,
}: NewBadgeProps): VNode => {
  const baseClasses = [
    'inline-flex', 'items-center', 'justify-center',
    'font-semibold', 'rounded-lg', 'border',
    'transition-all', 'duration-300', 'ease-out',
  ].join(' ');

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    success: [
      'bg-green-100', 'text-green-800', 'border-green-200',
      'dark:bg-green-900/30', 'dark:text-green-300', 'dark:border-green-700',
    ].join(' '),
    warning: [
      'bg-yellow-100', 'text-yellow-800', 'border-yellow-200',
      'dark:bg-yellow-900/30', 'dark:text-yellow-300', 'dark:border-yellow-700',
    ].join(' '),
    error: [
      'bg-red-100', 'text-red-800', 'border-red-200',
      'dark:bg-red-900/30', 'dark:text-red-300', 'dark:border-red-700',
    ].join(' '),
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};
```

### Creating a New Molecule Component

```typescript
// src/components/molecules/StatusPanel.tsx
/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { NewBadge } from '../atoms/NewBadge';
import { StatusIndicator } from '../atoms/StatusIndicator';

interface StatusPanelProps {
  status: 'online' | 'offline' | 'error';
  message: string;
  details?: string;
}

export const StatusPanel = ({
  status,
  message,
  details,
}: StatusPanelProps): VNode => {
  const getVariant = () => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'warning';
      case 'error': return 'error';
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <StatusIndicator isOnline={status === 'online'} />
        <NewBadge variant={getVariant()}>
          {status.toUpperCase()}
        </NewBadge>
      </div>

      <p className="text-gray-900 dark:text-gray-100 font-medium">
        {message}
      </p>

      {details && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {details}
        </p>
      )}
    </div>
  );
};
```

---

## 📈 Future Enhancements

### Planned Improvements

1. **Animation Library Integration**

   - Framer Motion for complex animations
   - Spring-based transitions

2. **Advanced Theming**

   - Multiple theme variants
   - User-customizable colors
   - High contrast mode

3. **Component Variations**

   - Size variations for all components
   - Additional badge types
   - More input variants

4. **Performance Optimizations**

   - Web Workers for heavy computations
   - Service Worker for caching
   - Progressive enhancement

5. **Accessibility Enhancements**
   - Screen reader optimizations
   - High contrast themes
   - Reduced motion support

---

## 🔗 References

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Preact Documentation](https://preactjs.com/guide/v10/getting-started)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Animation Performance](https://web.dev/animations-guide/)

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Maintainer**: RN Net Vision Team
