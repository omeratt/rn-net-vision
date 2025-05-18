/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';

interface NetworkLogProps {
  log: NetVisionLog;
  isSelected?: boolean;
  onClick?: () => void;
}

export const NetworkLog = ({
  log,
  isSelected,
  onClick,
}: NetworkLogProps): VNode => {
  const getStatusColor = (status: number): string => {
    if (status < 300) return 'text-green-500 dark:text-green-400';
    if (status < 400) return 'text-blue-500 dark:text-blue-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getStatusBadgeColor = (status: number): string => {
    if (status < 300) return 'bg-green-100 dark:bg-green-900/40';
    if (status < 400) return 'bg-blue-100 dark:bg-blue-900/40';
    return 'bg-red-100 dark:bg-red-900/40';
  };

  const getMethodColor = (method: string): string => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PUT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const getDurationColor = (duration: number): string => {
    if (duration < 100) return 'text-green-600 dark:text-green-400';
    if (duration < 500) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Extract domain from URL for display
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url.split('/')[0];
    }
  };

  // Get the path part of the URL
  const getPath = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch (e) {
      const parts = url.split('/');
      return parts.slice(1).join('/');
    }
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 border border-transparent 
        ${
          isSelected
            ? 'ring-2 shadow-lg ring-indigo-300/85 dark:ring-indigo-400/85 border-indigo-200 dark:border-indigo-700/40 dark:shadow-indigo-900/60 scale-[1.01]'
            : 'shadow-md shadow-gray-200/60 hover:shadow-lg hover:shadow-gray-200/80 dark:shadow-indigo-900/40 dark:hover:shadow-indigo-900/60 hover:scale-[1.005]'
        }
        group
      `}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center justify-center px-2 py-1 rounded-md font-mono font-medium text-xs ${getMethodColor(log.method)}`}
            >
              {log.method}
            </span>
            <span
              className={`inline-flex items-center justify-center w-10 h-6 rounded-md font-mono font-bold text-xs ${getStatusBadgeColor(log.status)} ${getStatusColor(log.status)}`}
            >
              {log.status}
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {getDomain(log.url)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`font-mono text-xs px-2 py-1 rounded ${getDurationColor(log.duration)} bg-opacity-10 dark:bg-opacity-20`}
            >
              {formatDuration(log.duration)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
        </div>

        <div className="pl-2 border-l-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors duration-200">
          <p className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-full font-mono">
            {getPath(log.url)}
          </p>
        </div>
      </div>
    </div>
  );
};
