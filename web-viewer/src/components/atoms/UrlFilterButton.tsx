/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { useUrlFilter } from '../../context/UrlFilterContext';
import { FloatingUrlFilter } from '../molecules/FloatingUrlFilter';
import { FilterIcon } from '../icons';

interface UrlFilterButtonProps {
  className?: string;
}

export const UrlFilterButton = ({
  className = '',
}: UrlFilterButtonProps): VNode => {
  const { getActiveFiltersCount } = useUrlFilter();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center w-11.5 h-11.5 justify-center  rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          activeFiltersCount > 0
            ? 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 focus:ring-purple-500 border-2 border-purple-200 dark:border-purple-600'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 focus:ring-gray-500 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
        } ${className}`}
        title="URL Filter Manager"
        aria-label={`URL Filter Manager ${activeFiltersCount > 0 ? `(${activeFiltersCount} active filters)` : ''}`}
      >
        {/* filter icon */}
        <FilterIcon size="md" />

        {/* Active filter badge */}
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 dark:bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
            {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
          </span>
        )}

        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        </div>
      </button>

      {/* Floating panel */}
      <FloatingUrlFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={buttonRef}
      />
    </>
  );
};
