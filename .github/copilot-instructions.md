# 🤖 GitHub Copilot Instructions for RN Net Vision Global Search Feature

## 📋 Mission Overview

You are the AI development assistant for implementing the **Global Search Feature** in the RN Net Vision web-viewer project. Your primary directive is to follow the comprehensive PRD located at `/web-viewer/GLOBAL_SEARCH_PRD.md` and systematically implement this feature according to the defined phases.

---

## 🎯 Core Directives

### 1. Primary Reference Document

- **ALWAYS** refer to `/web-viewer/GLOBAL_SEARCH_PRD.md` as your single source of truth
- **NEVER** deviate from the specifications without explicit user approval
- **UPDATE** the PRD acceptance criteria as features are completed
- **MONITOR** progress by tracking checked/unchecked items in the PRD

### 2. Mission Execution Rules

- ✅ **One mission at a time** - Complete current phase before moving to next
- ✅ **Update PRD status** - Check off completed acceptance criteria
- ✅ **Follow atomic design** - Atoms → Molecules → Organisms hierarchy
- ✅ **Maintain design system** - Use glassmorphism, Framer Motion, TailwindCSS
- ✅ **TypeScript first** - Strict typing for all components and hooks

### 3. Current Mission Status Tracking

**PHASE 1: Core Search Infrastructure 🚀**

```
Status: 🔄 IN PROGRESS
Timeline: 1.5 weeks
Priority: CRITICAL

Current Sub-Tasks:
- [ ] Set up component structure and basic files
- [ ] Implement keyboard shortcut detection
- [ ] Create basic search input with positioning
- [ ] Add simple text search functionality

Acceptance Criteria Progress: 0/7 completed
```

**NEXT PHASES:**

- Phase 2: Advanced Search & Animations (PENDING)
- Phase 3: Advanced Navigation & UX Polish (PENDING)
- Phase 4: Advanced Features & Optimization (PENDING)

---

## 🏗️ Implementation Guidelines

### Component Architecture (From PRD)

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

### File Structure to Follow

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

### Design Requirements

- **Icons**: Use beautiful modern icons (🔗 URL, 📄 requestBody, 💿 responseBody, 📝 headers)
- **Layout**: Full URLs, status/duration in top-right corner, only matching fields shown
- **Animations**: Framer Motion with specific easing curves from PRD
- **Theme**: Support dark/light modes with glassmorphism effects

---

## 📊 Phase 1 Detailed Tasks

### ✅ Current Phase Acceptance Criteria

When implementing, check these off in the PRD:

```markdown
- [ ] Search input appears in header center, aligned with existing design
- [ ] CMD/CTRL + K focuses the search input
- [ ] ESC key clears focus and closes search
- [ ] Text input searches URL and method fields
- [ ] Results show matched logs with basic highlighting
- [ ] Clicking result selects log in main list
- [ ] Search works in both light and dark themes
```

### 🔨 Implementation Order

1. **SearchIcon.tsx** (Atom) - Beautiful search icon component
2. **KeyboardShortcut.tsx** (Atom) - CMD/CTRL + K detection
3. **SearchInput.tsx** (Molecule) - Basic input with icon and shortcut
4. **BasicSearchResults.tsx** (Molecule) - Simple results display
5. **GlobalSearch.tsx** (Organism) - Main orchestrating component
6. **Integration** - Add to Header.tsx as specified in PRD

---

## 🚨 Critical Rules & Constraints

### DO's ✅

- **Follow PRD specifications exactly**
- **Use existing design system** (glassmorphism, gradients)
- **Implement TypeScript interfaces** as defined in PRD
- **Test each component** before moving to next
- **Update PRD checkboxes** when tasks complete
- **Maintain performance requirements** (< 300ms search, 60 FPS animations)
- **Follow atomic design principles** strictly

### DON'Ts ❌

- **Never skip ahead** to future phases
- **Don't change any existing code in the search input animations since its already working perfectly**
- **Don't modify PRD structure** without permission
- **Don't use different icons** than specified
- **Don't change the component hierarchy**
- **Don't implement features not in current phase**
- **Don't ignore accessibility requirements**

---

## 📈 Progress Reporting Format

When completing tasks, update the PRD and report using this format:

```markdown
## ✅ Task Completed: [Component Name]

**Phase**: 1 - Core Search Infrastructure
**Component**: SearchIcon.tsx (Atom)
**Status**: COMPLETED ✅

**Changes Made**:

- Created beautiful search icon with hover states
- Added dark/light theme support
- Implemented proper TypeScript interfaces

**PRD Updates**:

- Updated component file structure ✅
- Added to atoms export index ✅

**Next Task**: KeyboardShortcut.tsx (Atom)
**Overall Phase Progress**: 1/7 acceptance criteria completed
```

---

## 🔧 Integration Points

### Header Integration (From PRD)

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

### Search Algorithm (Phase 1 Subset)

```typescript
// Start with simple URL and method search
const basicSearchFields = (log: NetVisionLog, query: string) => {
  const matches: FieldMatch[] = [];
  const searchTerm = query.toLowerCase();

  // URL search (priority: 10)
  if (log.url.toLowerCase().includes(searchTerm)) {
    matches.push({
      field: 'url',
      value: log.url,
      preview: log.url, // Full URL for Phase 1
    });
  }

  // Method search (priority: 8)
  if (log.method.toLowerCase().includes(searchTerm)) {
    matches.push({
      field: 'method',
      value: log.method,
      preview: log.method,
    });
  }

  return matches;
};
```

---

## 🎯 Success Metrics Monitoring

Track these metrics during development:

**Phase 1 Targets**:

- Component creation time: < 2 hours per component
- Search response time: < 100ms (basic search)
- Bundle size increase: < 5KB for Phase 1
- Test coverage: > 80% for completed components

**Quality Gates**:

- All TypeScript errors resolved ✅
- All components follow design system ✅
- Keyboard accessibility working ✅
- Dark/light theme support ✅

---

## 📞 Communication Protocol

### When to Ask for Clarification

- PRD specifications are unclear or conflicting
- Technical constraints not addressed in PRD
- User requests changes to defined specifications
- Integration issues with existing codebase

### When to Proceed Independently

- Implementation details within PRD specifications
- Code structure and organization decisions
- Performance optimizations within requirements
- Bug fixes that don't change functionality

### Progress Updates

- Report completion after each component
- Update PRD acceptance criteria checkboxes
- Highlight any deviations or issues found
- Propose solutions for technical challenges

---

## 🚀 Quick Start Checklist

Before starting any work:

1. ✅ Read the complete PRD at `/web-viewer/GLOBAL_SEARCH_PRD.md`
2. ✅ Understand the current phase requirements
3. ✅ Check existing codebase structure
4. ✅ Identify integration points in Header.tsx
5. ✅ Set up proper TypeScript interfaces
6. ✅ Begin with Atoms, then Molecules, then Organisms

**Ready to start Phase 1! 🚀**

---

_This instruction file should be referenced before every development session. Update the mission status as progress is made._
