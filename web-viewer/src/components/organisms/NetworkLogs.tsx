/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useEffect } from 'preact/hooks';
import type { NetVisionLog } from '../../types';
import { LogListItem } from '../molecules/LogListItem';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { useNetworkLogs } from '../../hooks/useNetworkLogs';

interface NetworkLogsProps {
  logs: NetVisionLog[];
  onClear: () => void;
}

export const NetworkLogs = ({ logs, onClear }: NetworkLogsProps): VNode => {
  const {
    selectedLog,
    setSelectedLog,
    filteredLogs,
    filters,
    updateFilters,
    handleKeyNavigation,
  } = useNetworkLogs(logs);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-100 dark:bg-gray-900">
      {/* Left Panel - Log List */}
      <div className="w-1/2 overflow-hidden flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filter by URL..."
              value={filters.search}
              onInput={(e) =>
                updateFilters({ search: (e.target as HTMLInputElement).value })
              }
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={filters.status}
              onChange={(e) =>
                updateFilters({
                  status: (e.target as HTMLSelectElement).value as any,
                })
              }
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="success">Success (2xx)</option>
              <option value="redirect">Redirect (3xx)</option>
              <option value="error">Error (4xx/5xx)</option>
            </select>
            <select
              value={filters.method}
              onChange={(e) =>
                updateFilters({ method: (e.target as HTMLSelectElement).value })
              }
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <button
              onClick={onClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {filteredLogs.length} requests
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {filteredLogs.map((log) => (
            <LogListItem
              key={log.timestamp}
              log={log}
              isSelected={selectedLog === log}
              onClick={() => setSelectedLog(log)}
            />
          ))}
          {filteredLogs.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No logs match your filters
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Log Details */}
      <div className="w-1/2 overflow-hidden">
        <LogDetailsPanel log={selectedLog} />
      </div>
    </div>
  );
};
