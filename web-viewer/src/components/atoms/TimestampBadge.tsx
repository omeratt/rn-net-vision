/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { formatTimestamp } from '../../utils/timeUtils';

interface TimestampBadgeProps {
  timestamp: string;
  isSelected: boolean;
  className?: string;
}

export const TimestampBadge = ({
  timestamp,
  isSelected,
  className = '',
}: TimestampBadgeProps): VNode => {
  const formattedTime = formatTimestamp(timestamp);

  return (
    <span
      className={`text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100/60 dark:bg-gray-700/60 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg border border-white/30 transition-all duration-350 group-hover:bg-gradient-to-r group-hover:from-gray-200/80 group-hover:to-indigo-100/60 dark:group-hover:from-gray-600/80 dark:group-hover:to-indigo-800/60 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:shadow-md group-hover:font-semibold group-hover:border-indigo-400/60 flex-shrink-0 ${
        isSelected
          ? 'bg-gradient-to-r from-gray-200/50 to-indigo-100/30 dark:from-gray-500/50 dark:to-indigo-700/30 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium tracking-wide border-indigo-500/50'
          : ''
      } ${className}`}
    >
      {formattedTime}
    </span>
  );
};
