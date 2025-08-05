import { useEffect } from 'preact/hooks';
import type { SearchResult } from './useSearchResults';

interface UseSearchSelectionProps {
  searchResults: SearchResult[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  query: string;
}

/**
 * Helper function to scroll the search results container to the top
 */
const scrollToTop = () => {
  setTimeout(() => {
    const container = document.querySelector('.search-results-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 0);
};

/**
 * Hook for managing search result selection behavior
 * Handles: Auto-selection of first result, resetting on query change, scrolling to view
 */
export const useSearchSelection = ({
  searchResults,
  selectedIndex,
  setSelectedIndex,
  query,
}: UseSearchSelectionProps): void => {
  // Reset to first result when query changes
  useEffect(() => {
    if (searchResults.length > 0) {
      setSelectedIndex(0);
      // Scroll to top when resetting to first result
      scrollToTop();
    } else {
      setSelectedIndex(-1);
    }
  }, [query, searchResults.length, setSelectedIndex]);

  // Handle out-of-bounds selection
  useEffect(() => {
    if (selectedIndex >= searchResults.length && searchResults.length > 0) {
      const newIndex = Math.max(0, searchResults.length - 1);
      setSelectedIndex(newIndex);

      // If we're resetting to the first result (index 0), scroll to top
      if (newIndex === 0) {
        scrollToTop();
      }
    }
  }, [selectedIndex, searchResults.length, setSelectedIndex]);
};
