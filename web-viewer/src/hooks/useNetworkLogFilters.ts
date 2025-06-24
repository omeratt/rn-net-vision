import { useState, useMemo } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export const useNetworkLogFilters = (logs: NetVisionLog[]) => {
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

  // Generate filter options
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

  // Apply filters
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        filter === '' || log.url.toLowerCase().includes(filter.toLowerCase());

      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.includes(log.status.toString());

      const matchesMethod =
        methodFilter.length === 0 || methodFilter.includes(log.method);

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [logs, filter, statusFilter, methodFilter]);

  return {
    // State
    filter,
    statusFilter,
    methodFilter,

    // Handlers
    handleStatusFilterChange,
    handleMethodFilterChange,
    handleTextFilterChange,

    // Options
    uniqueMethodOptions,
    uniqueStatusOptions,

    // Results
    filteredLogs,
  };
};
