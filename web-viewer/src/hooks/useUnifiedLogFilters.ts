import { useState, useMemo } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export interface UnifiedLogFiltersReturn {
  // Filter state
  filter: string;
  statusFilter: string[];
  methodFilter: string[];

  // Filter handlers
  handleTextFilterChange: (value: string | string[]) => void;
  handleStatusFilterChange: (value: string | string[]) => void;
  handleMethodFilterChange: (value: string | string[]) => void;

  // Filter options for UI
  uniqueMethodOptions: { value: string; label: string }[];
  uniqueStatusOptions: { value: string; label: string }[];

  // Single source of truth for filtered logs
  filteredLogs: NetVisionLog[];
}

/**
 * Unified filtering hook that applies ALL filters in one place
 * This ensures GlobalSearch and NetworkLogList operate on the same dataset
 */
export const useUnifiedLogFilters = (
  logs: NetVisionLog[],
  activeDeviceId: string | null
): UnifiedLogFiltersReturn => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [methodFilter, setMethodFilter] = useState<string[]>([]);

  // Helper functions for handling filter changes
  const handleStatusFilterChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setStatusFilter(value);
    }
  };

  const handleMethodFilterChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setMethodFilter(value);
    }
  };

  const handleTextFilterChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setFilter(value);
    }
  };

  // Generate filter options based on all logs (not filtered ones)
  const uniqueMethodOptions = useMemo(() => {
    const methods = new Set(logs.map((log) => log.method));
    const methodsArray = Array.from(methods);
    return methodsArray.map((method) => ({ value: method, label: method }));
  }, [logs]);

  const uniqueStatusOptions = useMemo(() => {
    const statuses = new Set(logs.map((log) => log.status.toString()));
    const statusesArray = Array.from(statuses).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );

    const getStatusLabel = (status: string) => {
      const code = parseInt(status, 10);
      if (code < 200) return `${status} - Informational`;
      if (code < 300) return `${status} - Success`;
      if (code < 400) return `${status} - Redirect`;
      if (code < 500) return `${status} - Client Error`;
      return `${status} - Server Error`;
    };

    return statusesArray.map((status) => ({
      value: status,
      label: getStatusLabel(status),
    }));
  }, [logs]);

  // Apply ALL filters in one place - single source of truth
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Device filter (highest priority)
      if (activeDeviceId && log.deviceId !== activeDeviceId) {
        return false;
      }

      // 2. URL text filter
      if (filter && !log.url.toLowerCase().includes(filter.toLowerCase())) {
        return false;
      }

      // 3. Status filter
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(log.status.toString())
      ) {
        return false;
      }

      // 4. Method filter
      if (methodFilter.length > 0 && !methodFilter.includes(log.method)) {
        return false;
      }

      return true;
    });
  }, [logs, activeDeviceId, filter, statusFilter, methodFilter]);

  return {
    // Filter state
    filter,
    statusFilter,
    methodFilter,

    // Filter handlers
    handleTextFilterChange,
    handleStatusFilterChange,
    handleMethodFilterChange,

    // Filter options for UI
    uniqueMethodOptions,
    uniqueStatusOptions,

    // Single source of truth for filtered logs
    filteredLogs,
  };
};
