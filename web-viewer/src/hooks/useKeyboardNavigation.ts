import { useCallback } from 'preact/hooks';
import type { SearchResult } from './useSearchResults';

interface UseKeyboardNavigationProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onSelectResult: (result: SearchResult) => void;
}

interface UseKeyboardNavigationReturn {
  handleArrowDown: () => void;
  handleArrowUp: () => void;
  handleEnterKey: () => void;
  scrollToSelectedResult: (index: number) => void;
}

/**
 * Hook for managing keyboard navigation through search results
 * Handles: Arrow key navigation, Enter key selection, auto-scrolling
 */
export const useKeyboardNavigation = ({
  results,
  selectedIndex,
  onSelectedIndexChange,
  onSelectResult,
}: UseKeyboardNavigationProps): UseKeyboardNavigationReturn => {
  const scrollToSelectedResult = useCallback((index: number) => {
    // Use setTimeout to ensure the DOM has updated with the new selection
    setTimeout(() => {
      const container = document.querySelector('.search-results-container');
      const selectedItem = container?.children[index] as HTMLElement;

      if (container && selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();

        // Check if item is outside the visible area
        if (itemRect.top < containerRect.top) {
          // Scroll up - item is above visible area
          selectedItem.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else if (itemRect.bottom > containerRect.bottom) {
          // Scroll down - item is below visible area
          selectedItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
      }
    }, 0);
  }, []);

  const handleArrowDown = useCallback(() => {
    if (results.length > 0) {
      const newIndex =
        selectedIndex < results.length - 1 ? selectedIndex + 1 : 0;
      onSelectedIndexChange(newIndex);
      scrollToSelectedResult(newIndex);
    }
  }, [
    results.length,
    selectedIndex,
    onSelectedIndexChange,
    scrollToSelectedResult,
  ]);

  const handleArrowUp = useCallback(() => {
    if (results.length > 0) {
      const newIndex =
        selectedIndex > 0 ? selectedIndex - 1 : results.length - 1;
      onSelectedIndexChange(newIndex);
      scrollToSelectedResult(newIndex);
    }
  }, [
    results.length,
    selectedIndex,
    onSelectedIndexChange,
    scrollToSelectedResult,
  ]);

  const handleEnterKey = useCallback(() => {
    if (
      results.length > 0 &&
      selectedIndex >= 0 &&
      selectedIndex < results.length
    ) {
      onSelectResult(results[selectedIndex]);
    }
  }, [results, selectedIndex, onSelectResult]);

  return {
    handleArrowDown,
    handleArrowUp,
    handleEnterKey,
    scrollToSelectedResult,
  };
};
