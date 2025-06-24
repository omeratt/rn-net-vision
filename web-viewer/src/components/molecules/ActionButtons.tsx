/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { Tooltip } from '../atoms/Tooltip';

interface ActionButtonsProps {
  // Sort button
  sortTooltipText: string;
  onToggleSort: () => void;
  sortDirection: 'asc' | 'desc';

  // Clear button
  clearButtonText: string;
  onClear: () => void;
}

export const ActionButtons = ({
  sortTooltipText,
  onToggleSort,
  sortDirection,
  clearButtonText,
  onClear,
}: ActionButtonsProps): VNode => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Tooltip content={sortTooltipText}>
        <button
          onClick={onToggleSort}
          aria-label={sortTooltipText}
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
      </Tooltip>

      <Tooltip content={clearButtonText}>
        <button
          onClick={onClear}
          className="flex items-center justify-center w-9 h-9 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 ease-out border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
          aria-label={clearButtonText}
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
};
