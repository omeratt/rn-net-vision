/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { SearchResult, FieldMatch } from '../../hooks';
import { HighlightedText } from '../atoms/HighlightedText';
import { NavigationIndicator } from '../atoms/NavigationIndicator';
import { getFieldStyling, getFieldIcon, formatFieldLabel } from '../../utils';

interface ResultItemProps {
  result: SearchResult;
  index: number;
  selectedIndex: number;
  isLast: boolean;
  isFirst: boolean;
  query: string;
  onClick: (result: SearchResult) => void;
}

export const ResultItem = ({
  result,
  index,
  selectedIndex,
  isLast,
  isFirst,
  query,
  onClick,
}: ResultItemProps): VNode => {
  const isSelected = index === selectedIndex;

  return (
    <div
      className={`relative p-4 border-b border-gray-200/40 dark:border-gray-700/40 cursor-pointer transition-all duration-200 hover:bg-gray-300/80 dark:hover:bg-gray-700/60 ${
        isSelected
          ? 'bg-indigo-50/80 dark:bg-indigo-900/30 ring-2 ring-indigo-400/50 dark:ring-indigo-500/50'
          : ''
      } ${isLast ? 'border-b-0 rounded-b-xl' : ''} ${
        isFirst ? 'rounded-t-xl' : ''
      }`}
      onClick={() => {
        onClick(result);
      }}
    >
      {/* Navigation indicator for selected result */}
      <NavigationIndicator isSelected={isSelected} position="left" />

      <div className="space-y-4">
        {/* Always show URL first with method, status, date and time */}
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shadow-sm ${getFieldStyling(
                'url'
              )}`}
            >
              <span>{getFieldIcon('url')}</span>
              {formatFieldLabel('url')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {result.log.method} • {result.log.status}
              {' • '}
              {new Date(parseInt(result.log.timestamp, 10)).toLocaleString()}
            </span>
          </div>
          <div className="text-gray-900 dark:text-gray-100 text-sm">
            {(() => {
              // Check if URL has a match to highlight
              const urlMatch = result.matches.find(
                (match: FieldMatch) => match.field === 'url'
              );
              if (urlMatch) {
                return (
                  <HighlightedText
                    text={result.log.url}
                    query={query}
                    isUrl={true}
                  />
                );
              }

              // Show full URL without truncation when no match
              return <HighlightedText text={result.log.url} query={query} />;
            })()}
          </div>
        </div>

        {/* Show other field matches (excluding URL, method, status) */}
        {result.matches
          .filter(
            (match: FieldMatch) =>
              !['url', 'method', 'status'].includes(match.field)
          )
          .map((match: FieldMatch, matchIndex: number) => (
            <div key={`${match.field}-${matchIndex}`} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shadow-sm ${getFieldStyling(
                    match.field
                  )}`}
                >
                  <span>{getFieldIcon(match.field)}</span>
                  {formatFieldLabel(match.field)}
                </span>
              </div>
              <HighlightedText
                text={match.preview || match.value}
                query={query}
                match={match}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
