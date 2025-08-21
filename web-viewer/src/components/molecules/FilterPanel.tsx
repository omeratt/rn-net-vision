/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { VNode, ComponentChildren } from 'preact';
import { FilterInput } from '../atoms/FilterInput';
import { UrlFilterButton } from '../atoms/UrlFilterButton';

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
  // Counts for URL filter suffix
  totalCount?: number;
  filteredCount?: number | null;
  deltaNew?: number;
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
  totalCount,
  filteredCount: filteredLogsCount = null,
  deltaNew = 0,
}: FilterPanelProps): VNode => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col p-3 sm:p-4 transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Left side: Filter controls */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium flex-shrink-0"
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
          <div className="hidden sm:flex flex-wrap gap-3 flex-1 min-w-0">
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
              className="min-w-[200px] max-w-[300px] flex-1"
              totalCount={totalCount}
              filteredCount={filter ? filteredLogsCount : null}
              deltaNew={deltaNew}
            />

            <FilterInput
              type="select"
              placeholder="Status"
              value={statusFilter}
              onChange={onStatusFilterChange}
              options={uniqueStatusOptions}
              multiSelect={true}
              aria-label="Filter logs by status code"
              className="min-w-[120px] flex-shrink-0"
            />

            <FilterInput
              type="select"
              placeholder="Method"
              value={methodFilter}
              onChange={onMethodFilterChange}
              options={uniqueMethodOptions}
              multiSelect={true}
              aria-label="Filter logs by HTTP method"
              className="min-w-[100px] flex-shrink-0"
            />

            <FilterInput
              type="select"
              placeholder="Sort by"
              value={sortBy}
              onChange={onSortByChange}
              options={sortByOptions}
              multiSelect={false}
              aria-label="Sort logs by field"
              className="min-w-[110px] flex-shrink-0"
            />

            {/* URL Filter Button */}
            <UrlFilterButton className="flex-shrink-0" />
          </div>
        </div>

        {/* Right side: Action buttons - always stay in top right, aligned with first row */}
        {actions && (
          <div className="flex items-center flex-shrink-0 ml-2 self-start h-12">
            {actions}
          </div>
        )}
      </div>

      {/* Mobile filters, only visible when toggled */}
      {isFilterOpen && (
        <div className="sm:hidden flex flex-col gap-3 mb-3 p-4 transition-all duration-300">
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
            totalCount={totalCount}
            filteredCount={filter ? filteredLogsCount : null}
            deltaNew={deltaNew}
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
