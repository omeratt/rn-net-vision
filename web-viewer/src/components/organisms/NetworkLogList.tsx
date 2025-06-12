/** @jsxImportSource preact */
import { useState, useMemo, useEffect } from 'preact/hooks';
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { NetworkLog } from '../molecules/NetworkLog';
import { Button } from '../atoms/Button';

const SORT_PREFERENCE_KEY = 'netvision-sort-preference';

type SortDirection = 'asc' | 'desc';

interface NetworkLogListProps {
  logs: NetVisionLog[];
  onClear: () => void;
  onSelectLog: (log: NetVisionLog, index: number) => void;
  selectedLog: NetVisionLog | null;
  selectedIndex: number;
}

export const NetworkLogList = ({
  logs,
  onClear,
  onSelectLog,
  selectedLog,
  selectedIndex,
}: NetworkLogListProps): VNode => {
  // Remove activeDeviceId since device filtering is handled in parent component
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const savedSort = localStorage.getItem(SORT_PREFERENCE_KEY);
    return savedSort === 'asc' ? 'asc' : 'desc';
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SORT_PREFERENCE_KEY, sortDirection);
  }, [sortDirection]);

  const uniqueMethods = useMemo(() => {
    const methods = new Set(logs.map((log) => log.method));
    return ['all', ...Array.from(methods)];
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(200,200,255,0.08)] transition-all duration-300">
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
            <div className="hidden sm:flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Filter by URL..."
                value={filter}
                onInput={(e) => {
                  setFilter((e.target as HTMLInputElement).value);
                }}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter((e.target as HTMLSelectElement).value);
                }}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="success">Success (2xx)</option>
                <option value="redirect">Redirect (3xx)</option>
                <option value="error">Error (4xx/5xx)</option>
              </select>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter((e.target as HTMLSelectElement).value);
                }}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {uniqueMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSortDirection}
              title={`Sort by timestamp (${sortDirection === 'asc' ? 'oldest first' : 'newest first'})`}
              className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
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
                className={`transition-transform duration-300 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`}
              >
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="M11 4h10" />
                <path d="M11 8h7" />
                <path d="M11 12h4" />
              </svg>
            </button>
            <Button variant="secondary" onClick={onClear}>
              Clear Logs
            </Button>
          </div>
        </div>

        {/* Mobile filters, only visible when toggled */}
        {isFilterOpen && (
          <div className="sm:hidden flex flex-col gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md transition-all">
            <input
              type="text"
              placeholder="Filter by URL..."
              value={filter}
              onInput={(e) => {
                setFilter((e.target as HTMLInputElement).value);
              }}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter((e.target as HTMLSelectElement).value);
              }}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="success">Success (2xx)</option>
              <option value="redirect">Redirect (3xx)</option>
              <option value="error">Error (4xx/5xx)</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter((e.target as HTMLSelectElement).value);
              }}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {uniqueMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
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
              isSelected={selectedLog === log || index === selectedIndex}
              onClick={() => onSelectLog(log, index)}
            />
          ))
        )}
      </div>
    </div>
  );
};
