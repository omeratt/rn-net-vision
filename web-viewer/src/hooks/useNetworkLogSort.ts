import { useState, useMemo, useEffect, useRef } from 'preact/hooks';
import type { NetVisionLog } from '../types';

const SORT_PREFERENCE_KEY = 'netvision-sort-preference';
const SORT_BY_PREFERENCE_KEY = 'netvision-sort-by-preference';

type SortDirection = 'asc' | 'desc';
type SortBy = 'timestamp' | 'duration' | 'url';

export const useNetworkLogSort = (
  filteredLogs: NetVisionLog[],
  onClearSelection?: () => void,
  onSortedLogsChange?: (sortedLogs: NetVisionLog[]) => void
) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const savedSort = localStorage.getItem(SORT_PREFERENCE_KEY);
    return savedSort === 'asc' ? 'asc' : 'desc';
  });

  const [sortBy, setSortBy] = useState<SortBy>(() => {
    const savedSortBy = localStorage.getItem(SORT_BY_PREFERENCE_KEY);
    return (savedSortBy as SortBy) || 'timestamp';
  });

  // Store scroll position to maintain it during sorting
  const scrollPositionRef = useRef<number>(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Save and restore scroll position
  const saveScrollPosition = () => {
    if (listContainerRef.current) {
      scrollPositionRef.current = listContainerRef.current.scrollTop;
    }
  };

  const restoreScrollPosition = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  // Sort options
  const sortByOptions = useMemo(
    () => [
      { value: 'timestamp', label: 'Timestamp' },
      { value: 'duration', label: 'Duration' },
      { value: 'url', label: 'URL (A-Z)' },
    ],
    []
  );

  // Get tooltip text for toggle button
  const getToggleTooltipText = () => {
    return `Sort ${sortBy === 'url' ? 'alphabetically' : 'by ' + sortBy} (${
      sortDirection === 'asc'
        ? sortBy === 'url'
          ? 'A-Z'
          : 'ascending'
        : sortBy === 'url'
          ? 'Z-A'
          : 'descending'
    })`;
  };

  // Handlers
  const handleSortByChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      // Clear selection first to prevent auto-scrolling
      if (onClearSelection) {
        onClearSelection();
      }
      saveScrollPosition();
      setSortBy(value as SortBy);
    }
  };

  const toggleSortDirection = () => {
    // Clear selection first to prevent auto-scrolling
    if (onClearSelection) {
      onClearSelection();
    }
    saveScrollPosition();
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Apply sorting
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'timestamp':
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          comparison = dateA - dateB;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'url':
          comparison = a.url.localeCompare(b.url);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredLogs, sortDirection, sortBy]);

  // Persist preferences to localStorage
  useEffect(() => {
    localStorage.setItem(SORT_PREFERENCE_KEY, sortDirection);
  }, [sortDirection]);

  useEffect(() => {
    localStorage.setItem(SORT_BY_PREFERENCE_KEY, sortBy);
  }, [sortBy]);

  // Restore scroll position after sorting changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      restoreScrollPosition();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [sortBy, sortDirection]);

  // Notify parent of sorted logs changes for keyboard navigation
  useEffect(() => {
    if (onSortedLogsChange) {
      onSortedLogsChange(sortedLogs);
    }
  }, [sortedLogs, onSortedLogsChange]);

  return {
    // State
    sortDirection,
    sortBy,
    listContainerRef,

    // Options
    sortByOptions,

    // Handlers
    handleSortByChange,
    toggleSortDirection,
    getToggleTooltipText,

    // Results
    sortedLogs,
  };
};
