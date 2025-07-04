/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { getPath } from '../../utils/urlUtils';
import { TimestampBadge } from '../atoms/TimestampBadge';

interface UrlPathDisplayProps {
  url: string;
  timestamp: string;
  isSelected: boolean;
}

export const UrlPathDisplay = ({
  url,
  timestamp,
  isSelected,
}: UrlPathDisplayProps): VNode => {
  const urlPath = getPath(url);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`pl-2 xs:pl-3 sm:pl-4 border-l-2 border-indigo-400 dark:border-indigo-500 transition-all duration-300 group-hover:border-purple-500 dark:group-hover:border-purple-400 bg-gradient-to-r from-indigo-100/30 via-blue-50/15 to-transparent dark:from-indigo-900/20 dark:via-blue-900/15 rounded-r-lg group-hover:from-purple-200/40 group-hover:via-indigo-200/25 dark:group-hover:from-indigo-800/40 dark:group-hover:via-purple-800/25 group-hover:shadow-sm w-full overflow-hidden ${
          isSelected
            ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-r from-purple-200/30 via-indigo-100/20 to-transparent dark:from-indigo-700/30 dark:via-purple-700/20 shadow-sm'
            : ''
        }`}
      >
        <div className="flex items-center justify-between gap-3 w-full">
          <p
            className={`text-gray-700 dark:text-gray-300 text-xs xs:text-sm font-mono break-all leading-relaxed transition-all duration-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 group-hover:font-medium flex-1 min-w-0 ${
              isSelected
                ? 'text-indigo-800 dark:text-indigo-200 font-medium'
                : ''
            }`}
            title={urlPath}
          >
            {urlPath}
          </p>
          <TimestampBadge timestamp={timestamp} isSelected={isSelected} />
        </div>
      </div>
    </div>
  );
};
