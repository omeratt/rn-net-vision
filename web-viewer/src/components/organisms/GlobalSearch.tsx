/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../../types';
import { SearchInput } from '../molecules/SearchInput';
import { SearchResults } from '../molecules/SearchResults';
import {
  useSearchState,
  useSearchKeyboard,
  useSearchResults,
  useSearchSelection,
  type SearchResult,
} from '../../hooks';

interface GlobalSearchProps {
  logs: NetVisionLog[];
  onLogSelect: (log: NetVisionLog) => void;
  onScrollToLog?: (logId: string) => void;
  onSearchClose?: () => void; // New prop to handle focus restoration
}

export const GlobalSearch = ({
  logs,
  onLogSelect,
  onScrollToLog,
  onSearchClose,
}: GlobalSearchProps): VNode => {
  // Use our search state hook
  const searchState = useSearchState({ onSearchClose });

  // Get search results based on current query
  const { searchResults, isLoading } = useSearchResults(
    logs,
    searchState.query
  );

  // Manage selection behavior (resets to first result on query change)
  useSearchSelection({
    searchResults,
    selectedIndex: searchState.selectedIndex,
    setSelectedIndex: searchState.setSelectedIndex,
    query: searchState.query,
  });

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      onLogSelect(result.log);
      if (onScrollToLog) {
        // Pass the generated log ID
        const logId = result.log.id;
        onScrollToLog(logId);
      }

      // Phase 3: Enhanced closing animation with delay
      setTimeout(() => {
        searchState.handleClose();
      }, 200); // Brief delay to let the log selection animation start
    },
    [onLogSelect, onScrollToLog, searchState]
  );

  useSearchKeyboard({
    isOpen: searchState.isOpen,
    onClose: searchState.handleClose,
    results: searchResults,
    selectedIndex: searchState.selectedIndex,
    onSelectedIndexChange: searchState.setSelectedIndex,
    onSelectResult: handleResultClick,
  });

  return (
    <div className="relative">
      <SearchInput
        value={searchState.query}
        onChange={searchState.handleQueryChange}
        isOpen={searchState.isOpen}
        onFocus={searchState.handleOpen}
        onBlur={searchState.handleClose}
        placeholder="Search logs..."
        isLoading={isLoading}
      />

      <SearchResults
        isOpen={searchState.isOpen}
        query={searchState.query}
        results={searchResults}
        selectedIndex={searchState.selectedIndex}
        onResultClick={handleResultClick}
      />
    </div>
  );
};
