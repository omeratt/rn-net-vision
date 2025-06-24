import { useState, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export const useSortedLogs = () => {
  const [sortedLogs, setSortedLogs] = useState<NetVisionLog[]>([]);

  // Create a stable callback for sorted logs changes
  const handleSortedLogsChange = useCallback(
    (newSortedLogs: NetVisionLog[]) => {
      setSortedLogs(newSortedLogs);
    },
    []
  );

  return {
    // State
    sortedLogs,

    // Handlers
    handleSortedLogsChange,
  };
};
