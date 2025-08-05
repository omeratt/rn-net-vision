# 🔍 Global Search Feature - Product Requirements Document

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🎨 Design Specifications](#-design-specifications)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [📊 Feature Breakdown by Phases](#-feature-breakdown-by-phases)
- [✅ Acceptance Criteria](#-acceptance-criteria)
- [🔧 Implementation Guidelines](#-implementation-guidelines)
- [📱 User Experience Flow](#-user-experience-flow)

---

## 🎯 Overview

### Problem Statement

Users need an efficient way to search through network logs across all fields (headers, request/response bodies, URLs, cookies, methods, status codes) without manually scrolling through large datasets.

### Solution

A global search component with modal-like experience featuring:

- Keyboard shortcut activation (CMD/CTRL + K)
- Smooth animations and blur overlay
- Real-time search across all log fields
- Intelligent result highlighting and navigation
- Professional UX with elegant transitions

### Target Users

- React Native developers debugging network requests
- QA engineers analyzing API behavior
- DevOps teams monitoring network traffic

---

## 🎨 Design Specifications

### Visual Design Language

Following the existing **glassmorphism design system** with:

- Backdrop blur effects and transparency
- Gradient overlays (indigo/purple/pink)
- Smooth animations powered by Framer Motion
- Dark/light theme support
- Modern typography with gradient text effects

### Component Hierarchy

```
GlobalSearch (Organism)
├── SearchInput (Molecule)
│   ├── SearchIcon (Atom)
│   ├── LoaderSpinner (Atom)
│   └── KeyboardShortcut (Atom)
├── SearchResults (Molecule)
│   ├── ResultItem (Molecule)
│   │   ├── FieldLabel (Atom)
│   │   ├── HighlightedText (Atom)
│   │   └── LogPreview (Atom)
│   └── NavigationIndicator (Atom)
└── BlurOverlay (Atom)
```

### Animation States

1. **Default State**: Input centered in header (normal size)
2. **Focused State**: Input scales and moves to top-center with blur overlay
3. **Loading State**: Elegant loader on right side of input
4. **Results State**: Results dropdown with smooth reveal
5. **Closing State**: Reverse animation back to default

---

## 🏗️ Technical Architecture

### Core Components

#### 1. GlobalSearch (Organism)

```typescript
interface GlobalSearchProps {
  logs: NetVisionLog[];
  onLogSelect: (log: NetVisionLog) => void;
  onScrollToLog: (logId: string) => void;
}

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  selectedIndex: number;
  isLoading: boolean;
}
```

#### 2. SearchInput (Molecule)

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  isOpen: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
}
```

#### 3. SearchResult Interface

```typescript
interface SearchResult {
  log: NetVisionLog;
  matches: FieldMatch[];
  score: number; // Relevance score
}

interface FieldMatch {
  field: LogField;
  value: string;
  highlightStart: number;
  highlightEnd: number;
  preview: string; // Truncated text with context
}

type LogField =
  | 'url'
  | 'method'
  | 'status'
  | 'requestHeaders'
  | 'responseHeaders'
  | 'requestBody'
  | 'responseBody'
  | 'cookies'
  | 'duration'
  | 'timestamp';
```

### Search Algorithm

#### Multi-Field Search Logic

```typescript
const searchLogFields = (log: NetVisionLog, query: string): FieldMatch[] => {
  const matches: FieldMatch[] = [];
  const searchTerm = query.toLowerCase();

  // Field priority for relevance scoring
  const fieldPriority = {
    url: 10,
    method: 8,
    status: 8,
    requestBody: 6,
    responseBody: 6,
    requestHeaders: 4,
    responseHeaders: 4,
    cookies: 3,
    duration: 2,
    timestamp: 1,
  };

  // Search each field
  Object.entries(fieldPriority).forEach(([field, priority]) => {
    const fieldValue = getFieldValue(log, field);
    const matchIndex = fieldValue.toLowerCase().indexOf(searchTerm);

    if (matchIndex !== -1) {
      matches.push({
        field: field as LogField,
        value: fieldValue,
        highlightStart: matchIndex,
        highlightEnd: matchIndex + searchTerm.length,
        preview: createPreview(fieldValue, matchIndex, searchTerm.length),
        priority,
      });
    }
  });

  return matches.sort((a, b) => b.priority - a.priority);
};
```

#### Performance Optimization

```typescript
// Debounced search with worker thread for heavy operations
const useSearchWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker('/searchWorker.js');
    return () => workerRef.current?.terminate();
  }, []);

  const searchLogs = useMemo(
    () =>
      debounce((logs: NetVisionLog[], query: string) => {
        if (query.length < 2) return [];

        // For large datasets, use web worker
        if (logs.length > 1000) {
          workerRef.current?.postMessage({ logs, query });
        } else {
          // Direct search for smaller datasets
          return performSearch(logs, query);
        }
      }, 300),
    []
  );
};
```

---

## 📊 Feature Breakdown by Phases

## Phase 1: Core Search Infrastructure 🚀

**Timeline**: 1.5 weeks  
**Priority**: Critical

### Features

- Basic search input in header center
- Keyboard shortcut (CMD/CTRL + K) activation
- Simple text search across URL and method fields
- Basic result display without animations

### Components to Build

```typescript
// Phase 1 Components
├── atoms/
│   ├── SearchIcon.tsx
│   └── KeyboardShortcut.tsx
├── molecules/
│   ├── SearchInput.tsx
│   └── BasicSearchResults.tsx
└── organisms/
    └── GlobalSearch.tsx (basic version)
```

### Acceptance Criteria

- [x] Search input appears in header center, aligned with existing design
- [x] CMD/CTRL + K focuses the search input
- [x] ESC key clears focus and closes search
- [x] Text input searches URL and method fields
- [x] Results show matched logs with basic highlighting
- [x] Clicking result selects log in main list
- [x] Search works in both light and dark themes

**✅ PHASE 1 COMPLETED (7/7) - 100%**

**🎯 BONUS: Advanced features from Phase 2 already implemented:**

- [x] Modal-like experience with blur overlay
- [x] Smooth Framer Motion animations with ultra-smooth easing
- [x] Enhanced result display with field labels and status info
- [x] Performance optimization (10 result limit, 2-char minimum)
- [x] Portal rendering for proper z-index management
- [x] Precise positioning calculations for dropdown alignment

---

## Phase 2: Advanced Search & Animations ✨

**Timeline**: 2 weeks  
**Priority**: High

### Features

- Full-field search (headers, request/response bodies, cookies)
- Modal-like experience with blur overlay
- Smooth Framer Motion animations
- Loading states and performance optimization
- Enhanced result display with field labels

### Components to Build

```typescript
// Phase 2 Components
├── atoms/
│   ├── BlurOverlay.tsx
│   ├── LoaderSpinner.tsx
│   ├── FieldLabel.tsx
│   └── HighlightedText.tsx
├── molecules/
│   ├── SearchModal.tsx
│   ├── ResultItem.tsx
│   └── SearchResults.tsx
└── hooks/
    ├── useSearchWorker.ts
    ├── useGlobalSearch.ts
    └── useSearchAnimations.ts
```

### Animation Specifications

```typescript
// Framer Motion animations
const searchAnimations = {
  default: {
    scale: 1,
    y: 0,
    width: '300px',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  focused: {
    scale: 1.05,
    y: -100,
    width: '500px',
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  overlay: {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.3 },
  },
};
```

### Acceptance Criteria

- [x] Search includes all log fields (headers, bodies, cookies, etc.) **[✅ COMPLETED]**
- [x] Smooth animation when focusing input (scale + position change)
- [x] Blur overlay appears behind focused input using portal
- [x] Loading spinner shows during heavy search operations **[✅ COMPLETED]**
- [x] Results display field labels (e.g., "responseBody", "url")
- [x] Highlighted text shows matched portions
- [x] Text truncation with "..." for long matches **[✅ COMPLETED]**
- [x] Performance remains smooth with 1000+ logs

**📊 PHASE 2 PROGRESS: 8/8 COMPLETED (100%) ✅**

**✅ All Features Implemented:**

- Ultra-smooth animations with custom easing [0.25, 0.1, 0.25, 1]
- Full modal experience with backdrop blur
- Portal rendering with precise positioning
- Field labels and status information
- Gradient highlighting with perfect contrast
- Optimized performance (10 result limit)
- **NEW:** Complete search across all log fields (URL, method, status, headers, bodies, cookies, duration, timestamp)
- **NEW:** Loading spinner with elegant design for heavy search operations
- **NEW:** Smart text truncation with ellipsis and preview generation

**🎯 Phase 2 Complete - Ready for Phase 3!**

---

## Phase 3: Advanced Navigation & UX Polish 🎯

**Timeline**: 1.5 weeks  
**Priority**: Medium

### Features

- Keyboard navigation (up/down arrows)
- Enter key selection
- Multiple match display per log
- Result ranking and relevance scoring
- Smooth scroll to selected log
- Enhanced visual feedback

### Components to Build

```typescript
// Phase 3 Components
├── atoms/
│   ├── NavigationIndicator.tsx
│   └── RelevanceScore.tsx
├── molecules/
│   ├── MultiMatchResult.tsx
│   └── KeyboardNavigator.tsx
└── hooks/
    ├── useKeyboardNavigation.ts
    ├── useResultRanking.ts
    └── useScrollToResult.ts
```

### Navigation Logic

```typescript
const useKeyboardNavigation = (results: SearchResult[]) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          selectResult(results[selectedIndex]);
          break;
        case 'Escape':
          closeSearch();
          break;
      }
    },
    [results, selectedIndex]
  );

  return { selectedIndex, handleKeyDown };
};
```

### Acceptance Criteria

- [x] Arrow keys navigate through search results
- [x] Selected result has visual highlight
- [x] Enter key selects highlighted result
- [x] Multiple matches per log show separately **[✅ COMPLETED - Advanced implementation with field labels, icons, and previews]**
- [x] Results ranked by relevance (URL > method > body) **[✅ COMPLETED - Priority-based scoring system implemented]**
- [x] Smooth scroll to selected log in main list **[✅ COMPLETED - Integrated with log selection system]**
- [x] Selected log highlights in main list **[✅ COMPLETED - Yellow highlight with fade animation]**
- [x] Search closes with smooth animation after selection **[✅ COMPLETED - Enhanced 200ms delay for better UX]**

**📊 PHASE 3 PROGRESS: 8/8 COMPLETED (100%) ✅**

**🎉 ALL PHASE 3 FEATURES IMPLEMENTED:**

- ✅ Complete keyboard navigation with visual feedback
- ✅ Advanced multiple field matching with beautiful UI
- ✅ Intelligent relevance scoring and ranking
- ✅ Seamless integration with main log list selection
- ✅ Elegant yellow highlighting with 3-second auto-fade
- ✅ Smooth animations and enhanced user experience
- ✅ Perfect scroll-to-log functionality with smooth behavior
- ✅ Enhanced closing animation with timing optimization

**🎯 Phase 3 Complete - Ready for Phase 4!**

---

## Phase 4: Advanced Features & Optimization 🚀

**Timeline**: 1 week  
**Priority**: Low

### Features

- Search history and suggestions
- Advanced search operators (exact match, regex)
- Export search results
- Search performance analytics
- Accessibility improvements

### Components to Build

```typescript
// Phase 4 Components
├── atoms/
│   ├── SearchSuggestion.tsx
│   └── ExportButton.tsx
├── molecules/
│   ├── SearchHistory.tsx
│   ├── AdvancedFilters.tsx
│   └── SearchAnalytics.tsx
└── hooks/
    ├── useSearchHistory.ts
    ├── useAdvancedSearch.ts
    └── useSearchAnalytics.ts
```

### Acceptance Criteria

- [ ] Recent searches stored and suggested
- [ ] Quote marks enable exact match search
- [ ] Regex search with `/pattern/` syntax
- [ ] Export filtered results to JSON/CSV
- [ ] Search performance metrics displayed
- [ ] Full keyboard accessibility
- [ ] Screen reader compatibility
- [ ] High contrast theme support

---

## 🎯 Search Result UI Logic (Detailed Explanation)

### Text Truncation Logic

When displaying matched text, we need to show context but keep results compact:

```typescript
// Example: If user searches "video" in a long response body
const originalText =
  'This is a very long response body containing video content data and many other fields that continue...';
const searchTerm = 'video';
const matchIndex = originalText.indexOf(searchTerm); // Index where "video" starts

// Create preview with context
const createPreview = (
  text: string,
  matchIndex: number,
  searchLength: number
) => {
  const beforeContext = 15; // Show 15 chars before match
  const afterContext = 15; // Show 15 chars after match

  const start = Math.max(0, matchIndex - beforeContext);
  const end = Math.min(text.length, matchIndex + searchLength + afterContext);

  let preview = text.substring(start, end);

  // Add "..." if text was truncated
  if (start > 0) preview = '...' + preview;
  if (end < text.length) {
    const remainingChars = text.length - end;
    preview = preview + ` +${remainingChars} chars`;
  }

  return preview;
};

// Result: "...response body containing video content data +45 chars"
```

### Visual Selection States

1. **Normal State**: Default appearance with subtle border
2. **Hover State**: Light blue background on mouse hover
3. **Selected State**:
   - Blue glowing border
   - Slightly elevated shadow
   - Blue background tint
   - This is the result that will be selected when user presses Enter

### Multiple Matches in Same Log

When a single log matches multiple fields, show only the matching fields with beautiful formatting:

**Example: Search for "upload"**

```
┌─ POST https://api.example.com/upload ──────────────────┐ 201 • 1.2s
│   🔗 https://api.example.com/upload                   │ ← URL matched
│   📄 requestBody: "uploading video file..." +234     │ ← Body matched
└───────────────────────────────────────────────────────┘
```

**Example: Search for "video" (3+ matches)**

```
┌─ PUT https://api.example.com/media/video/123 ──────────┐ 200 • 850ms
│   🔗 https://api.example.com/media/video/123           │ ← URL matched
│   � requestBody: "video update data..." +234         │ ← Body matched
│   � requestHeaders: "content-type: video/mp4..." +45 │ ← Headers matched
│   ✨ +2 more fields matched                           │ ← Additional matches
└───────────────────────────────────────────────────────┘
```

### Beautiful Field Icons & Meanings

| Icon | Field           | Description                                             |
| ---- | --------------- | ------------------------------------------------------- |
| 🔗   | url             | The complete request URL (https://api.example.com/path) |
| �    | requestBody     | Data sent to server in request                          |
| �    | responseBody    | Data received from server in response                   |
| �    | requestHeaders  | Request headers (Authorization, Content-Type, etc.)     |
| �    | responseHeaders | Response headers (Set-Cookie, Cache-Control, etc.)      |
| 🍪   | cookies         | Cookie values and session data                          |
| 🔧   | method          | HTTP method (GET, POST, PUT, DELETE)                    |
| ⏱️   | duration        | Request timing (shown in top-right corner)              |
| 📅   | timestamp       | When request occurred                                   |

### Visual Design Principles

**1. Only Show Matching Fields**

- If search term appears in URL and requestBody, only show those 2 fields
- Don't clutter with non-matching fields
- Maximum 3 matching fields per result

**2. Status & Duration Positioning**

```
┌─ GET https://api.example.com/videos/123 ──────────────┐ 200 • 245ms
│   🔗 https://api.example.com/videos/123               │     ↑
│   💿 responseBody: "...video content..." +156        │     │
└──────────────────────────────────────────────────────┘     │
                                                              │
                                    Log metadata (not search match)
```

**3. Visual Hierarchy**

- **Full URL** always shown for context (even if not matching)
- **Matching fields** indented below URL
- **Status & Duration** floating in bottom-right corner
- **Clear separation** between search matches and log metadata

---

## 🎨 Search Results Design Summary

### Key Visual Improvements

**1. Beautiful Modern Icons**

- 🔗 for URLs (link/chain concept)
- 📄 for request body (document)
- 💿 for response body (data storage)
- 📝 for headers (text/notes)
- 🍪 for cookies (classic cookie icon)

**2. Smart Field Display**

- **Only show fields that match** the search term
- **Full URLs displayed** for complete context
- **Maximum 3 matches** per result to avoid clutter
- **Additional matches indicator** (✨ +2 more fields matched)

**3. Elegant Status Positioning**

- **Status & Duration** float in top-right corner
- **Visual separation** from search matches
- **Clear indication** these are log metadata, not search results
- **Consistent formatting**: `200 • 245ms`

**4. Clean Visual Hierarchy**

```
┌─ METHOD https://full.url.com/path ──────────────────────┐ STATUS • TIME
│   🔗 Full URL always shown for context                 │     ↑
│   📄 Only matching fields displayed below              │     │
│   💿 With beautiful icons and proper alignment         │     │
│   ✨ Additional matches indicator if needed            │     │
└─────────────────────────────────────────────────────────┘     │
                                                               │
                                                        Log metadata
```

**5. Enhanced User Experience**

- **Reduced cognitive load** - only relevant information
- **Better scanning** - clear visual separation
- **Professional appearance** - modern icons and spacing
- **Contextual clarity** - users understand what matched vs. log info

---

## 📱 User Experience Flow

### 1. Initial State

```
Header: [Logo] [Connection] [🔍 Search Input] [Device] [Theme] [Debug]
                              ↑ centered, normal size
```

### 2. Activation (CMD/CTRL + K)

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Search across all logs...]  [⌘K]                      │ ← Focused input
├─────────────────────────────────────────────────────────────┤    (top center, scaled)
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Blurred background
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    (like FloatingDeviceDebug)
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
```

### 3. Search Results

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Search: "video"]  [⚡ loading...]                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─ GET /api/videos/123 ─────────────────────────────────┐   │
│ │ 📄 responseBody: "...video content data..." +5 chars │   │ ← Match 1 (normal)
│ │ 📊 status: 200 • ⏱️ 245ms                            │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌─ POST /upload ───────────────────────────────────────┐   │ ← Highlighted border
│ │ 📤 requestBody: "video metadata upload..." +12 chars │   │ ← Match 2 (SELECTED)
│ │ 📊 status: 201 • ⏱️ 1.2s                             │   │   (blue glow)
│ └───────────────────────────────────────────────────────┘   │
│ ┌─ DELETE /api/videos/456 ──────────────────────────────┐   │
│ │ 🌐 url: "/api/videos/456"                             │   │ ← Match 3 (normal)
│ │ 📊 status: 204 • ⏱️ 89ms                              │   │
│ └───────────────────────────────────────────────────────┘   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
                            ↑ Up/Down arrows to navigate
                            ↑ Enter to select highlighted result
```

**Explanation of Search Result Elements:**

1. **"(selected)" / Blue highlight**: The currently highlighted result that user can select with Enter key
2. **"+X chars"**: Indicates truncated text - shows there are X more characters after the displayed preview
3. **Field labels**: 📄 responseBody, 📤 requestBody, 🌐 url - shows which field matched the search
4. **Highlighted text**: The word "video" would be highlighted in yellow within the preview text

### 4. Selection & Scroll

```
Animation sequence:
1. Search modal closes with reverse animation
2. Header returns to normal state
3. Main log list scrolls to selected log
4. Selected log highlights with glow effect
```

---

## 🔧 Implementation Guidelines

### File Structure

```
src/components/
├── atoms/
│   ├── SearchIcon.tsx
│   ├── LoaderSpinner.tsx
│   ├── BlurOverlay.tsx
│   ├── FieldLabel.tsx
│   ├── HighlightedText.tsx
│   └── KeyboardShortcut.tsx
├── molecules/
│   ├── SearchInput.tsx
│   ├── SearchResults.tsx
│   ├── ResultItem.tsx
│   └── SearchModal.tsx
├── organisms/
│   └── GlobalSearch.tsx
└── hooks/
    ├── useGlobalSearch.ts
    ├── useSearchWorker.ts
    ├── useKeyboardNavigation.ts
    └── useSearchAnimations.ts
```

### Performance Requirements

- Search response time: < 300ms for 1000 logs
- Animation frame rate: 60 FPS
- Memory usage: < 50MB additional for search index
- Bundle size impact: < 15KB gzipped

### Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast theme support
- Focus management and trapping

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🎨 Design Token Specifications

### Colors

```css
/* Search-specific colors */
--search-overlay: rgba(0, 0, 0, 0.3);
--search-backdrop-blur: blur(8px);
--search-highlight: #fbbf24; /* Yellow for text highlighting */
--search-field-label: #6366f1; /* Indigo for field labels */

/* Result states */
--result-hover: rgba(99, 102, 241, 0.1);
--result-selected: rgba(99, 102, 241, 0.2);
--result-border: rgba(99, 102, 241, 0.3);
```

### Animations

```css
/* Custom easing curves */
--search-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--search-duration: 400ms;
--search-overlay-duration: 300ms;

/* Transform origins */
--search-transform-origin: center top;
```

### Typography

```css
/* Search-specific text styles */
.search-input {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.search-field-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-highlight {
  background-color: var(--search-highlight);
  color: #000;
  padding: 0 2px;
  border-radius: 2px;
}
```

---

## 📈 Success Metrics

### User Experience Metrics

- Search usage frequency (target: 70% of sessions)
- Average search completion time (target: < 5 seconds)
- Search abandonment rate (target: < 15%)

### Performance Metrics

- Search latency (target: < 300ms)
- Animation frame rate (target: 60 FPS)
- Memory usage increase (target: < 50MB)

### Development Metrics

- Code coverage (target: > 90%)
- Bundle size increase (target: < 15KB)
- Lighthouse performance score (target: > 90)

---

## 🔗 Integration Points

### Header Component Integration

```typescript
// Update Header.tsx to include GlobalSearch
export const Header = ({ /* existing props */ }): VNode => {
  return (
    <header>
      {/* Existing logo and status */}

      {/* New: Global Search in center */}
      <GlobalSearch
        logs={logs}
        onLogSelect={handleLogSelect}
        onScrollToLog={handleScrollToLog}
      />

      {/* Existing controls */}
    </header>
  );
};
```

### Main Log List Integration

```typescript
// Update NetworkLogs.tsx for search integration
export const NetworkLogs = ({ logs, selectedLogId }): VNode => {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToLog = useCallback((logId: string) => {
    const element = listRef.current?.querySelector(`[data-log-id="${logId}"]`);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, []);

  return (
    <div>
      <GlobalSearch onScrollToLog={scrollToLog} />
      <div ref={listRef}>
        {/* Log list with data-log-id attributes */}
      </div>
    </div>
  );
};
```

---

## 🚀 Next Steps

### Immediate Actions (Week 1)

1. Set up component structure and basic files
2. Implement keyboard shortcut detection
3. Create basic search input with positioning
4. Add simple text search functionality

### Phase 1 Development (Week 2-3)

1. Complete core search infrastructure
2. Implement basic result display
3. Add result selection and navigation
4. Write comprehensive tests

### Phase 2 Development (Week 4-5)

1. Add advanced animations with Framer Motion
2. Implement blur overlay and portal
3. Create loading states and performance optimization
4. Enhance result display with field labels

### Future Considerations

- Mobile responsiveness optimization
- Advanced search operators
- Search result caching
- Integration with browser history

---

**Document Version**: 1.0  
**Last Updated**: July 5, 2025  
**Author**: RN Net Vision Team  
**Review Status**: Draft - Pending Technical Review
