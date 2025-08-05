/** @jsxImportSource preact */
import { VNode } from 'preact';
import { createPortal } from 'preact/compat';
import type { SearchResult } from '../../hooks';
import { ResultItem } from './ResultItem';
import { searchResultsScrollbarStyles } from '../../utils';

interface SearchResultsProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
}

export const SearchResults = ({
  isOpen,
  query,
  results,
  selectedIndex,
  onResultClick,
}: SearchResultsProps): VNode | null => {
  if (!isOpen) return null;

  // No results state
  if (query.length >= 2 && results.length === 0) {
    return createPortal(
      <div
        className="fixed left-1/2 -translate-x-1/2 w-[clamp(18rem,60%,47rem)] p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300/40 dark:border-gray-600/40 rounded-xl shadow-2xl z-[60]"
        style={{ top: '132px' } as any}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm">No logs found for</div>
          <div className="font-medium mt-1">"{query}"</div>
          <div className="text-xs mt-2 text-gray-400 dark:text-gray-500">
            Try searching for URLs, methods, or status codes
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Results state
  if (results.length > 0) {
    return (
      <>
        {/* Inject custom scrollbar styles */}
        <style
          dangerouslySetInnerHTML={{ __html: searchResultsScrollbarStyles }}
        />
        {createPortal(
          <div
            className="search-results-container fixed left-1/2 -translate-x-1/2 w-[clamp(18rem,60%,47rem)] max-h-96 overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300/40 dark:border-gray-600/40 rounded-xl shadow-2xl z-[60]"
            style={
              {
                top: '132px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(156 163 175 / 0.5) transparent',
              } as any
            }
          >
            {results.map((result: SearchResult, index: number) => {
              // Create unique key using same pattern as highlighting system
              const uniqueKey = `${result.log.timestamp}-${result.log.url}-${result.log.method}`;

              return (
                <ResultItem
                  key={uniqueKey}
                  result={result}
                  index={index}
                  selectedIndex={selectedIndex}
                  isLast={index === results.length - 1}
                  isFirst={index === 0}
                  query={query}
                  onClick={onResultClick}
                />
              );
            })}
          </div>,
          document.body
        )}
      </>
    );
  }

  return null;
};
