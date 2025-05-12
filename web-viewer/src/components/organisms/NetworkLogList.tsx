/** @jsxImportSource preact */
import { useState, useMemo } from 'preact/hooks';
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { NetworkLog } from '../molecules/NetworkLog';
import { Button } from '../atoms/Button';

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
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const uniqueMethods = useMemo(() => {
    const methods = new Set(logs.map((log) => log.method));
    return ['all', ...Array.from(methods)];
  }, [logs]);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
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
      }),
    [logs, filter, statusFilter, methodFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(200,200,255,0.08)]">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Filter by URL..."
            value={filter}
            onInput={(e) => {
              setFilter((e.target as HTMLInputElement).value);
            }}
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter((e.target as HTMLSelectElement).value);
            }}
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            {uniqueMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <Button variant="secondary" onClick={onClear}>
          Clear Logs
        </Button>
      </div>

      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match your filters
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <NetworkLog
              key={log.timestamp + log.url}
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
