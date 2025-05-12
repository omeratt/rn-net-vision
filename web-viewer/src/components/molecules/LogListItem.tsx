/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import {
  formatDuration,
  getMethodColor,
  getStatusColor,
} from '../../utils/networkUtils';

interface LogListItemProps {
  log: NetVisionLog;
  isSelected: boolean;
  onClick: () => void;
}

export const LogListItem = ({
  log,
  isSelected,
  onClick,
}: LogListItemProps): VNode => {
  const { method, url, status, duration } = log;
  const methodColor = getMethodColor(method);
  const statusColor = getStatusColor(status);

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono font-medium ${methodColor}`}>
              {method}
            </span>
            <span className={`text-sm ${statusColor}`}>{status}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {url}
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
};
