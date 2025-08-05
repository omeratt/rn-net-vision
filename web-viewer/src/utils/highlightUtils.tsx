/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { FieldMatch } from '../hooks/useSearchResults';

/**
 * Text highlighting utilities for search results
 * Provides functions for highlighting matched text with proper styling
 */

// Enhanced highlighting with text truncation support
export const highlightText = (text: string, match: FieldMatch): VNode => {
  // Use preview text and precomputed highlight positions
  const displayText = match.preview || text;
  const adjustedStart = match.previewHighlightStart;
  const adjustedEnd = match.previewHighlightEnd;

  // Ensure valid highlight positions
  if (
    adjustedStart >= adjustedEnd ||
    adjustedStart < 0 ||
    adjustedEnd > displayText.length
  ) {
    // If positions are invalid, return text without highlighting
    return <span className="truncate block max-w-full">{displayText}</span>;
  }

  const before = displayText.slice(0, adjustedStart);
  const highlighted = displayText.slice(adjustedStart, adjustedEnd);
  const after = displayText.slice(adjustedEnd);

  // Don't render empty highlights
  if (!highlighted.trim()) {
    return <span className="truncate block max-w-full">{displayText}</span>;
  }

  return (
    <span className="truncate block max-w-full">
      {before}
      <mark className="bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800/70 dark:to-yellow-700/70 text-gray-900 dark:text-yellow-100 rounded-sm px-0.5 font-medium shadow-sm">
        {highlighted}
      </mark>
      {after}
    </span>
  );
};

// Helper function to highlight URL text specifically (used in search results)
export const highlightUrlText = (
  fullUrl: string,
  searchTerm: string
): VNode => {
  const matchIndex = fullUrl.toLowerCase().indexOf(searchTerm.toLowerCase());

  if (matchIndex !== -1) {
    const before = fullUrl.slice(0, matchIndex);
    const highlighted = fullUrl.slice(
      matchIndex,
      matchIndex + searchTerm.length
    );
    const after = fullUrl.slice(matchIndex + searchTerm.length);

    return (
      <span className="block max-w-full break-all">
        {before}
        <mark className="bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800/70 dark:to-yellow-700/70 text-gray-900 dark:text-yellow-100 rounded-sm px-0.5 font-medium shadow-sm">
          {highlighted}
        </mark>
        {after}
      </span>
    );
  }

  // Show URL without highlighting if no match found
  return <span className="block max-w-full break-all">{fullUrl}</span>;
};
