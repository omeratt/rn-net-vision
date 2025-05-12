/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { Button } from '../atoms/Button';

interface NetworkLogProps {
  log: NetVisionLog;
}

export const NetworkLog = ({ log }: NetworkLogProps): VNode => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: number): string => {
    if (status < 300) return 'text-green-500 dark:text-green-400';
    if (status < 400) return 'text-blue-500 dark:text-blue-400';
    return 'text-red-500 dark:text-red-400';
  };

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatData = (data: unknown): string => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`font-mono font-bold ${getStatusColor(log.status)}`}>
            {log.status}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {log.method}
          </span>
          <span className="text-gray-600 dark:text-gray-400 truncate max-w-md">
            {log.url}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 dark:text-gray-400">
            {formatDuration(log.duration)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Request Headers
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.requestHeaders, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Response Headers
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.responseHeaders, null, 2)}
              </pre>
            </div>
          </div>

          {(log.requestBody || log.responseBody) && (
            <div className="grid grid-cols-2 gap-4">
              {log.requestBody && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Request Body
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    {formatData(log.requestBody)}
                  </pre>
                </div>
              )}
              {log.responseBody && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Response Body
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    {formatData(log.responseBody)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
