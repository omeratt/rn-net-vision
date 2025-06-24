/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { VNode, ComponentChildren } from 'preact';
import { FilterInput } from '../atoms/FilterInput';

interface FilterPanelProps {
  // Filter state
  filter: string;
  statusFilter: string[];
  methodFilter: string[];
  sortBy: string;

  // Filter handlers
  onTextFilterChange: (value: string | string[]) => void;
  onStatusFilterChange: (value: string | string[]) => void;
  onMethodFilterChange: (value: string | string[]) => void;
  onSortByChange: (value: string | string[]) => void;

  // Options
  uniqueStatusOptions: Array<{ value: string; label: string }>;
  uniqueMethodOptions: Array<{ value: string; label: string }>;
  sortByOptions: Array<{ value: string; label: string }>;

  // Action buttons slot
  actions?: ComponentChildren;
}

export const FilterPanel = ({
  filter,
  statusFilter,
  methodFilter,
  sortBy,
  onTextFilterChange,
  onStatusFilterChange,
  onMethodFilterChange,
  onSortByChange,
  uniqueStatusOptions,
  uniqueMethodOptions,
  sortByOptions,
  actions,
}: FilterPanelProps): VNode => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 p-3 sm:p-4 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(200,200,255,0.08)] transition-all duration-300">
      <div className="flex flex-wrap justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium"
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
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filters
          </button>

          {/* Desktop filters */}
          <div className="hidden sm:flex flex-wrap gap-3 flex-1">
            <FilterInput
              type="text"
              placeholder="Filter by URL..."
              value={filter}
              onChange={onTextFilterChange}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              aria-label="Filter logs by URL"
              className="min-w-[300px] flex-1"
            />

            <FilterInput
              type="select"
              placeholder="Status"
              value={statusFilter}
              onChange={onStatusFilterChange}
              options={uniqueStatusOptions}
              multiSelect={true}
              aria-label="Filter logs by status code"
              className="min-w-[140px]"
            />

            <FilterInput
              type="select"
              placeholder="Method"
              value={methodFilter}
              onChange={onMethodFilterChange}
              options={uniqueMethodOptions}
              multiSelect={true}
              aria-label="Filter logs by HTTP method"
              className="min-w-[120px]"
            />

            <FilterInput
              type="select"
              placeholder="Sort by"
              value={sortBy}
              onChange={onSortByChange}
              options={sortByOptions}
              multiSelect={false}
              aria-label="Sort logs by field"
              className="min-w-[130px]"
            />
          </div>
        </div>

        {/* Action buttons slot */}
        {actions && <div className="flex items-center">{actions}</div>}
      </div>

      {/* Mobile filters, only visible when toggled */}
      {isFilterOpen && (
        <div className="sm:hidden flex flex-col gap-3 mb-3 p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-lg transition-all duration-300">
          <FilterInput
            type="text"
            placeholder="Filter by URL..."
            value={filter}
            onChange={onTextFilterChange}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            aria-label="Filter logs by URL"
          />

          <FilterInput
            type="select"
            placeholder="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={uniqueStatusOptions}
            multiSelect={true}
            aria-label="Filter logs by status code"
          />

          <FilterInput
            type="select"
            placeholder="Method"
            value={methodFilter}
            onChange={onMethodFilterChange}
            options={uniqueMethodOptions}
            multiSelect={true}
            aria-label="Filter logs by HTTP method"
          />

          <FilterInput
            type="select"
            placeholder="Sort by"
            value={sortBy}
            onChange={onSortByChange}
            options={sortByOptions}
            multiSelect={false}
            aria-label="Sort logs by field"
          />
        </div>
      )}
    </div>
  );
};
