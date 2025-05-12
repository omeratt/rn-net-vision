import { useState, useCallback, useMemo } from 'preact/hooks';
import type { NetVisionLog } from '../types';

interface LogFilters {
  search: string;
  method: string;
  status: 'all' | 'success' | 'redirect' | 'error';
}

export const useNetworkLogs = (logs: NetVisionLog[]) => {
  const [selectedLog, setSelectedLog] = useState<NetVisionLog | null>(null);
  const [filters, setFilters] = useState<LogFilters>({
    search: '',
    method: 'all',
    status: 'all',
  });

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter by search term
      if (
        filters.search &&
        !log.url.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filter by HTTP method
      if (filters.method !== 'all' && log.method !== filters.method) {
        return false;
      }

      // Filter by status code
      if (filters.status !== 'all') {
        const status = log.status;
        switch (filters.status) {
          case 'success':
            return status >= 200 && status < 300;
          case 'redirect':
            return status >= 300 && status < 400;
          case 'error':
            return status >= 400;
          default:
            return true;
        }
      }

      return true;
    });
  }, [logs, filters]);

  const updateFilters = useCallback((newFilters: Partial<LogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!filteredLogs.length) return;

      const currentIndex = selectedLog
        ? filteredLogs.findIndex((log) => log === selectedLog)
        : -1;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            setSelectedLog(filteredLogs[currentIndex - 1]);
          } else if (currentIndex === -1 && filteredLogs.length > 0) {
            setSelectedLog(filteredLogs[filteredLogs.length - 1]);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < filteredLogs.length - 1) {
            setSelectedLog(filteredLogs[currentIndex + 1]);
          } else if (currentIndex === -1 && filteredLogs.length > 0) {
            setSelectedLog(filteredLogs[0]);
          }
          break;
      }
    },
    [filteredLogs, selectedLog]
  );

  return {
    selectedLog,
    setSelectedLog,
    filteredLogs,
    filters,
    updateFilters,
    handleKeyNavigation,
  };
};
