/**
 * Search-related CSS styles for GlobalSearch component
 * Provides reusable CSS strings for search result styling
 */

// Custom scrollbar styles for search results container
export const searchResultsScrollbarStyles = `
  .search-results-container::-webkit-scrollbar {
    width: 6px;
  }
  .search-results-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .search-results-container::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  .search-results-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  .dark .search-results-container::-webkit-scrollbar-thumb {
    background-color: rgba(107, 114, 128, 0.5);
  }
  .dark .search-results-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.7);
  }
`;
