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

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'shadow-lg dark:shadow-[0_4px_12px_rgba(200,200,255,0.1)]'
          : 'shadow-sm hover:shadow-md dark:shadow-[0_2px_8px_rgba(200,200,255,0.05)] dark:hover:shadow-[0_4px_12px_rgba(200,200,255,0.08)]'
      }`}
    >
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
        <span className="text-gray-500 dark:text-gray-400">
          {formatDuration(log.duration)}
        </span>
      </div>
    </div>
  );
};
