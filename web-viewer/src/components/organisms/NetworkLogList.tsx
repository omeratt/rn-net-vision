/** @jsxImportSource preact */
import { useState, useMemo, useEffect } from 'preact/hooks';
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { NetworkLog } from '../molecules/NetworkLog';
import { Button } from '../atoms/Button';
import { FilterInput } from '../atoms/FilterInput';
import { useDevices } from '../../context/DeviceContext';

const SORT_PREFERENCE_KEY = 'netvision-sort-preference';

type SortDirection = 'asc' | 'desc';

interface NetworkLogListProps {
  logs: NetVisionLog[];
  onClear: () => void;
  onSelectLog: (log: NetVisionLog, index: number) => void;
  selectedLog: NetVisionLog | null;
  onSortedLogsChange?: (sortedLogs: NetVisionLog[]) => void;
}

export const NetworkLogList = ({
  logs,
  onClear,
  onSelectLog,
  selectedLog,
  onSortedLogsChange,
}: NetworkLogListProps): VNode => {
  const { activeDeviceId, getDeviceName } = useDevices();

  // Remove activeDeviceId since device filtering is handled in parent component
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const savedSort = localStorage.getItem(SORT_PREFERENCE_KEY);
    return savedSort === 'asc' ? 'asc' : 'desc';
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Helper function to check if two logs are the same
  const isLogSelected = (log: NetVisionLog): boolean => {
    if (!selectedLog) return false;
    return (
      selectedLog.timestamp === log.timestamp &&
      selectedLog.url === log.url &&
      selectedLog.method === log.method &&
      selectedLog.status === log.status
    );
  };

  // Generate clear button text based on active device
  const clearButtonText = activeDeviceId
    ? `Clear ${getDeviceName(activeDeviceId)} Logs`
    : 'Clear All Logs';

  useEffect(() => {
    localStorage.setItem(SORT_PREFERENCE_KEY, sortDirection);
  }, [sortDirection]);

  const uniqueMethodOptions = useMemo(() => {
    const methods = new Set(logs.map((log) => log.method));
    const methodsArray = Array.from(methods);
    return [
      { value: 'all', label: 'All Methods' },
      ...methodsArray.map((method) => ({ value: method, label: method })),
    ];
  }, [logs]);

  const filteredAndSortedLogs = useMemo(() => {
    console.log(`[NetworkLogList] Filtering with total logs: ${logs.length}`);

    const filtered = logs.filter((log) => {
      // Device filtering is already handled in NetworkLogs component

      // Just do text, status, and method filtering here
      const matchesSearch =
        filter === '' || log.url.toLowerCase().includes(filter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'success' && log.status < 300) ||
        (statusFilter === 'redirect' &&
          log.status >= 300 &&
          log.status < 400) ||
        (statusFilter === 'error' && log.status >= 400);

      const matchesMethod =
        methodFilter === 'all' || log.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [logs, filter, statusFilter, methodFilter, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Notify parent of sorted logs changes for keyboard navigation
  useEffect(() => {
    if (onSortedLogsChange) {
      onSortedLogsChange(filteredAndSortedLogs);
    }
  }, [filteredAndSortedLogs, onSortedLogsChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 p-3 sm:p-4 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(200,200,255,0.08)] transition-all duration-300">
        <div className="flex flex-wrap justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              Filters
            </button>
            <div className="hidden sm:flex flex-wrap gap-3">
              <FilterInput
                type="text"
                placeholder="Filter by URL..."
                value={filter}
                onChange={setFilter}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                aria-label="Filter logs by URL"
                className="min-w-[200px]"
              />

              <FilterInput
                type="select"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'success', label: 'Success (2xx)' },
                  { value: 'redirect', label: 'Redirect (3xx)' },
                  { value: 'error', label: 'Error (4xx/5xx)' },
                ]}
                aria-label="Filter logs by status code"
                className="min-w-[140px]"
              />

              <FilterInput
                type="select"
                value={methodFilter}
                onChange={setMethodFilter}
                options={uniqueMethodOptions}
                aria-label="Filter logs by HTTP method"
                className="min-w-[120px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSortDirection}
              title={`Sort by timestamp (${sortDirection === 'asc' ? 'oldest first' : 'newest first'})`}
              className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 ease-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ease-out ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}
              >
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="M11 4h10" />
                <path d="M11 8h7" />
                <path d="M11 12h4" />
              </svg>
            </button>
            <Button variant="secondary" onClick={onClear}>
              {clearButtonText}
            </Button>
          </div>
        </div>

        {/* Mobile filters, only visible when toggled */}
        {isFilterOpen && (
          <div className="sm:hidden flex flex-col gap-3 mb-3 p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-lg transition-all duration-300">
            <FilterInput
              type="text"
              placeholder="Filter by URL..."
              value={filter}
              onChange={setFilter}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              aria-label="Filter logs by URL"
            />

            <FilterInput
              type="select"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'success', label: 'Success (2xx)' },
                { value: 'redirect', label: 'Redirect (3xx)' },
                { value: 'error', label: 'Error (4xx/5xx)' },
              ]}
              aria-label="Filter logs by status code"
            />

            <FilterInput
              type="select"
              value={methodFilter}
              onChange={setMethodFilter}
              options={uniqueMethodOptions}
              aria-label="Filter logs by HTTP method"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredAndSortedLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match your filters
          </div>
        ) : (
          filteredAndSortedLogs.map((log, index) => (
            <NetworkLog
              key={`${log.timestamp}-${log.url}-${log.status}-${log.method}-${log.deviceId || 'no-device'}-${index}`}
              log={log}
              isSelected={isLogSelected(log)}
              onClick={() => onSelectLog(log, index)}
              activeDeviceId={activeDeviceId}
            />
          ))
        )}
      </div>
    </div>
  );
};
