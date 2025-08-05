import { useEffect } from 'preact/hooks';
import type { SearchResult } from './useSearchResults';
import { useKeyboardNavigation } from './useKeyboardNavigation';

interface UseSearchKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  results?: SearchResult[];
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  onSelectResult?: (result: SearchResult) => void;
}

/**
 * Hook for handling keyboard interactions in global search
 * Handles: ESC key to close search, arrow key navigation, Enter key selection
 */
export const useSearchKeyboard = ({
  isOpen,
  onClose,
  results = [],
  selectedIndex = -1,
  onSelectedIndexChange,
  onSelectResult,
}: UseSearchKeyboardProps): void => {
  // Use the dedicated keyboard navigation hook
  const navigation = useKeyboardNavigation({
    results,
    selectedIndex,
    onSelectedIndexChange: onSelectedIndexChange || (() => {}),
    onSelectResult: onSelectResult || (() => {}),
  });

  // Enhanced keyboard handler for Phase 3: Arrow navigation + Enter selection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          onClose(); // This will clear focus, close search, and reset query
          break;

        case 'ArrowDown':
          if (results.length > 0 && onSelectedIndexChange) {
            event.preventDefault();
            event.stopPropagation();
            navigation.handleArrowDown();
          }
          break;

        case 'ArrowUp':
          if (results.length > 0 && onSelectedIndexChange) {
            event.preventDefault();
            event.stopPropagation();
            navigation.handleArrowUp();
          }
          break;

        case 'Enter':
          if (
            results.length > 0 &&
            selectedIndex >= 0 &&
            selectedIndex < results.length &&
            onSelectResult
          ) {
            event.preventDefault();
            event.stopPropagation();
            navigation.handleEnterKey();
          }
          break;
      }
    };

    // Only add listener when search is open to avoid unnecessary event handling
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, {
        capture: true, // Use capture phase to ensure we get the event first
        passive: false, // We need to preventDefault
      });

      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [
    isOpen,
    onClose,
    results,
    selectedIndex,
    onSelectedIndexChange,
    onSelectResult,
    navigation,
  ]);
};
