import { useState, useMemo } from 'preact/hooks';
import type { NetVisionLog } from '../types';

// Re-export interfaces that will be used by the component
export interface SearchResult {
  log: NetVisionLog;
  matches: FieldMatch[];
  score: number;
}

export interface FieldMatch {
  field:
    | 'url'
    | 'method'
    | 'status'
    | 'requestBody'
    | 'responseBody'
    | 'requestHeaders'
    | 'responseHeaders'
    | 'cookies'
    | 'duration'
    | 'timestamp';
  value: string;
  highlightStart: number;
  highlightEnd: number;
  preview: string;
  previewHighlightStart: number;
  previewHighlightEnd: number;
  priority: number;
}

// Helper function to safely convert any value to searchable string
const getSearchableString = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') return value;

  if (typeof value === 'number') return value.toString();

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

// Helper function to create preview text with truncation and calculate highlight positions
const createPreviewWithHighlight = (
  text: string,
  matchStart: number,
  matchLength: number,
  maxLength: number = 100
): {
  preview: string;
  previewHighlightStart: number;
  previewHighlightEnd: number;
} => {
  const start = Math.max(0, matchStart - 20);
  const end = Math.min(text.length, matchStart + matchLength + 20);

  let preview = text.slice(start, end);
  let previewHighlightStart = matchStart - start;
  let previewHighlightEnd = previewHighlightStart + matchLength;

  // Add leading ellipsis and adjust positions
  if (start > 0) {
    preview = '...' + preview;
    previewHighlightStart += 3; // Account for "..."
    previewHighlightEnd += 3;
  }

  // Add trailing ellipsis (no position adjustment needed)
  if (end < text.length) {
    preview = preview + '...';
  }

  // If still too long, truncate further but ensure highlight is visible
  if (preview.length > maxLength) {
    // If highlight would be cut off, prioritize showing the highlighted part
    if (previewHighlightEnd > maxLength - 3) {
      // Recalculate to show highlight
      const highlightMidpoint = previewHighlightStart + matchLength / 2;
      const newStart = Math.max(
        0,
        Math.floor(highlightMidpoint - maxLength / 2)
      );
      const newEnd = Math.min(preview.length, newStart + maxLength - 6); // Reserve space for "..." on both ends

      const truncatedPreview = preview.slice(newStart, newEnd);
      previewHighlightStart = Math.max(0, previewHighlightStart - newStart);
      previewHighlightEnd = Math.min(
        truncatedPreview.length,
        previewHighlightEnd - newStart
      );

      preview =
        (newStart > 0 ? '...' : '') +
        truncatedPreview +
        (newEnd < preview.length ? '...' : '');

      if (newStart > 0) {
        previewHighlightStart += 3;
        previewHighlightEnd += 3;
      }
    } else {
      // Simple truncation from the end
      preview = preview.slice(0, maxLength - 3) + '...';
    }
  }

  return {
    preview,
    previewHighlightStart: Math.max(0, previewHighlightStart),
    previewHighlightEnd: Math.max(0, previewHighlightEnd),
  };
};

// Expanded search function - Phase 2: Search all log fields
const searchLogFields = (log: NetVisionLog, query: string): FieldMatch[] => {
  const matches: FieldMatch[] = [];
  const searchTerm = query.toLowerCase();

  // Field priority for relevance scoring (from PRD)
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

  // Search URL field
  const urlValue = getSearchableString(log.url);
  const urlMatch = urlValue.toLowerCase().indexOf(searchTerm);
  if (urlMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(urlValue, urlMatch, searchTerm.length);
    matches.push({
      field: 'url',
      value: urlValue,
      highlightStart: urlMatch,
      highlightEnd: urlMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.url,
    });
  }

  // Search method field
  const methodValue = getSearchableString(log.method);
  const methodMatch = methodValue.toLowerCase().indexOf(searchTerm);
  if (methodMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(methodValue, methodMatch, searchTerm.length);
    matches.push({
      field: 'method',
      value: methodValue,
      highlightStart: methodMatch,
      highlightEnd: methodMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.method,
    });
  }

  // Search status field
  const statusValue = getSearchableString(log.status);
  const statusMatch = statusValue.toLowerCase().indexOf(searchTerm);
  if (statusMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(statusValue, statusMatch, searchTerm.length);
    matches.push({
      field: 'status',
      value: statusValue,
      highlightStart: statusMatch,
      highlightEnd: statusMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.status,
    });
  }

  // Search request body
  if (log.requestBody) {
    const requestBodyValue = getSearchableString(log.requestBody);
    const requestBodyMatch = requestBodyValue.toLowerCase().indexOf(searchTerm);
    if (requestBodyMatch !== -1) {
      const { preview, previewHighlightStart, previewHighlightEnd } =
        createPreviewWithHighlight(
          requestBodyValue,
          requestBodyMatch,
          searchTerm.length
        );
      matches.push({
        field: 'requestBody',
        value: requestBodyValue,
        highlightStart: requestBodyMatch,
        highlightEnd: requestBodyMatch + searchTerm.length,
        preview,
        previewHighlightStart,
        previewHighlightEnd,
        priority: fieldPriority.requestBody,
      });
    }
  }

  // Search response body
  if (log.responseBody) {
    const responseBodyValue = getSearchableString(log.responseBody);
    const responseBodyMatch = responseBodyValue
      .toLowerCase()
      .indexOf(searchTerm);
    if (responseBodyMatch !== -1) {
      const { preview, previewHighlightStart, previewHighlightEnd } =
        createPreviewWithHighlight(
          responseBodyValue,
          responseBodyMatch,
          searchTerm.length
        );
      matches.push({
        field: 'responseBody',
        value: responseBodyValue,
        highlightStart: responseBodyMatch,
        highlightEnd: responseBodyMatch + searchTerm.length,
        preview,
        previewHighlightStart,
        previewHighlightEnd,
        priority: fieldPriority.responseBody,
      });
    }
  }

  // Search request headers
  const requestHeadersValue = getSearchableString(log.requestHeaders);
  const requestHeadersMatch = requestHeadersValue
    .toLowerCase()
    .indexOf(searchTerm);
  if (requestHeadersMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(
        requestHeadersValue,
        requestHeadersMatch,
        searchTerm.length
      );
    matches.push({
      field: 'requestHeaders',
      value: requestHeadersValue,
      highlightStart: requestHeadersMatch,
      highlightEnd: requestHeadersMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.requestHeaders,
    });
  }

  // Search response headers
  const responseHeadersValue = getSearchableString(log.responseHeaders);
  const responseHeadersMatch = responseHeadersValue
    .toLowerCase()
    .indexOf(searchTerm);
  if (responseHeadersMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(
        responseHeadersValue,
        responseHeadersMatch,
        searchTerm.length
      );
    matches.push({
      field: 'responseHeaders',
      value: responseHeadersValue,
      highlightStart: responseHeadersMatch,
      highlightEnd: responseHeadersMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.responseHeaders,
    });
  }

  // Search cookies
  if (log.cookies) {
    const cookiesValue = getSearchableString(log.cookies);
    const cookiesMatch = cookiesValue.toLowerCase().indexOf(searchTerm);
    if (cookiesMatch !== -1) {
      const { preview, previewHighlightStart, previewHighlightEnd } =
        createPreviewWithHighlight(
          cookiesValue,
          cookiesMatch,
          searchTerm.length
        );
      matches.push({
        field: 'cookies',
        value: cookiesValue,
        highlightStart: cookiesMatch,
        highlightEnd: cookiesMatch + searchTerm.length,
        preview,
        previewHighlightStart,
        previewHighlightEnd,
        priority: fieldPriority.cookies,
      });
    }
  }

  // Search duration field
  const durationValue = getSearchableString(log.duration);
  const durationMatch = durationValue.toLowerCase().indexOf(searchTerm);
  if (durationMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(
        durationValue,
        durationMatch,
        searchTerm.length
      );
    matches.push({
      field: 'duration',
      value: durationValue,
      highlightStart: durationMatch,
      highlightEnd: durationMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.duration,
    });
  }

  // Search timestamp field
  const timestampValue = getSearchableString(log.timestamp);
  const timestampMatch = timestampValue.toLowerCase().indexOf(searchTerm);
  if (timestampMatch !== -1) {
    const { preview, previewHighlightStart, previewHighlightEnd } =
      createPreviewWithHighlight(
        timestampValue,
        timestampMatch,
        searchTerm.length
      );
    matches.push({
      field: 'timestamp',
      value: timestampValue,
      highlightStart: timestampMatch,
      highlightEnd: timestampMatch + searchTerm.length,
      preview,
      previewHighlightStart,
      previewHighlightEnd,
      priority: fieldPriority.timestamp,
    });
  }

  // Sort matches by priority (highest first) and return only the top 3 matches per log
  return matches.sort((a, b) => b.priority - a.priority).slice(0, 3);
};

// Calculate relevance score for search results using match priorities
const calculateScore = (matches: FieldMatch[]): number => {
  return matches.reduce((score, match) => {
    return score + match.priority;
  }, 0);
};

interface UseSearchResultsReturn {
  searchResults: SearchResult[];
  isLoading: boolean;
}

/**
 * Hook for computing search results from logs and query
 * Handles: Search algorithm, loading states, result ranking and limiting
 */
export const useSearchResults = (
  logs: NetVisionLog[],
  query: string
): UseSearchResultsReturn => {
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced search with loading states for heavy operations
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim() || query.length < 2) {
      setIsLoading(false);
      return [];
    }

    // Show loading for queries that might be heavy (3+ chars triggers full field search)
    const isHeavySearch = query.trim().length >= 3;

    // Trigger loading state immediately for heavy searches
    if (isHeavySearch) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    const results: SearchResult[] = [];

    logs.forEach((log) => {
      const matches = searchLogFields(log, query.trim());
      if (matches.length > 0) {
        results.push({
          log,
          matches,
          score: calculateScore(matches),
        });
      }
    });

    // Sort by relevance score (highest first), then by timestamp (latest first) for same scores
    const sortedResults = results.sort((a, b) => {
      // Primary sort: by score (highest first)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort: by timestamp (latest first) for logs with same score
      return Number(b.log.timestamp) - Number(a.log.timestamp);
    });
    // Removed .slice(0, 10) - no limit now!

    // Hide loading once results are processed (with small delay for better UX)
    if (isHeavySearch) {
      setTimeout(() => setIsLoading(false), 150);
    }

    return sortedResults;
  }, [logs, query]);

  return {
    searchResults,
    isLoading,
  };
};
