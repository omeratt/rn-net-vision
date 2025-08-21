/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import type { UnifiedLogFiltersReturn } from '../../hooks';
import { NetworkLog } from '../molecules/NetworkLog';
import { FilterPanel } from '../molecules/FilterPanel';
import { ActionButtons } from '../molecules/ActionButtons';
import { ScrollFadeContainer } from '../atoms/ScrollFadeContainer';
import { useDevices } from '../../context/DeviceContext';
import { useNetworkLogFilters, useNetworkLogSort } from '../../hooks';
import { useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { forwardRef } from 'preact/compat';

// (Header/Footer spacers removed; we use internal padding in scroller for stable align:'start')

interface NetworkLogListProps {
  logs: NetVisionLog[]; // already filtered logs passed in
  rawTotalCount?: number; // total unfiltered device logs
  rawAppendDelta?: number; // latest raw append diff
  filters?: UnifiedLogFiltersReturn;
  onClear: () => void;
  onSelectLog: (log: NetVisionLog, index: number) => void;
  selectedLogId: string | null; // id-based selection
  onSortedLogsChange?: (sortedLogs: NetVisionLog[]) => void;
  onClearSelection?: () => void;
  highlightedLogId?: string | null;
  highlightState?: 'idle' | 'blinking' | 'fading';
  onScrollMethodReady?: (scrollToLogById: (logId: string) => void) => void;
}

export const NetworkLogList = ({
  logs,
  rawTotalCount,
  rawAppendDelta = 0,
  filters,
  onClear,
  onSelectLog,
  selectedLogId,
  onSortedLogsChange,
  onClearSelection,
  highlightedLogId,
  highlightState = 'idle',
  onScrollMethodReady,
}: NetworkLogListProps): VNode => {
  const { activeDeviceId, getDeviceName } = useDevices();

  // Use shared filters from parent if available, otherwise create own filters
  // This maintains backward compatibility while allowing the new unified approach
  const fallbackFilters = useNetworkLogFilters(logs);
  const activeFilters = filters || fallbackFilters;
  // No local delta logic; rely on rawAppendDelta from upstream raw log source

  const sort = useNetworkLogSort(
    activeFilters.filteredLogs,
    onClearSelection,
    onSortedLogsChange
  );
  // selection now id-based; simple helper inline
  const isLogSelected = useCallback(
    (log: NetVisionLog) => log.id === selectedLogId,
    [selectedLogId]
  );

  // Generate clear button text based on active device
  const clearButtonText = activeDeviceId
    ? `Clear ${getDeviceName(activeDeviceId)} Logs`
    : 'Clear All Logs';

  // Virtuoso ref for imperative scrolling
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  // When a scroll is initiated by global search, suppress the next selection-based auto scroll
  const suppressNextSelectionAutoScroll = useRef<boolean>(false);

  // Provide a simple scroll-by-id API upward for global search integration
  useEffect(() => {
    if (!onScrollMethodReady) return;
    const scrollToLogById = (logId: string) => {
      const index = sort.sortedLogs.findIndex((l) => l.id === logId);
      if (index >= 0 && virtuosoRef.current) {
        // Mark that this scroll originated from Global Search to avoid double-scroll
        suppressNextSelectionAutoScroll.current = true;

        virtuosoRef.current?.scrollToIndex({
          index,
          align: 'start',
          behavior: 'smooth',
          offset: -50,
        });
      }
    };
    onScrollMethodReady(scrollToLogById);
  }, [onScrollMethodReady, sort.sortedLogs]);

  // Custom scroller wrapped with ScrollFadeContainer: the inner scrollable div receives Virtuoso's ref
  const Scroller = useMemo(
    () =>
      forwardRef<HTMLDivElement, any>(function ScrollerImpl(props, ref) {
        const {
          className: incomingClass,
          style,
          children,
          ...rest
        } = props || {};
        // Re-introduce vertical padding directly on scroller (not via Header spacer) so align calculations are stable
        const className = `h-full w-full max-w-full px-2 sm:px-4 pt-6 pb-2 sm:pb-4 ${
          incomingClass || ''
        }`;
        return (
          <ScrollFadeContainer
            // Class applies to the INNER scrollable element
            className={className}
            fadeHeight={80}
            // Forward Virtuoso's scroller ref to the inner scrollable div
            scrollRef={ref as any}
            // Pass through props to the inner scrollable div
            scrollProps={{
              ...rest,
              style,
              'data-log-scroll-container': 'true',
            }}
          >
            {children}
          </ScrollFadeContainer>
        );
      }),
    []
  );

  // Stable item renderer to avoid nested component definition warnings
  const renderItem = useCallback(
    (index: number) => {
      const log = sort.sortedLogs[index];
      if (!log) return null as any;
      const logId = log.id;
      return (
        <div
          className="px-6  py-1.5 w-full max-w-full overflow-hidden"
          data-log-timestamp={log.timestamp}
          data-log-id={logId}
        >
          <NetworkLog
            key={log.id}
            log={log}
            isSelected={isLogSelected(log)}
            isHighlighted={highlightedLogId === logId}
            highlightState={highlightState}
            onClick={() => onSelectLog(log, index)}
            activeDeviceId={activeDeviceId}
          />
        </div>
      ) as any;
    },
    [
      sort.sortedLogs,
      isLogSelected,
      highlightedLogId,
      highlightState,
      onSelectLog,
      activeDeviceId,
    ]
  );

  // Ensure keyboard navigation keeps the selected item in view
  useEffect(() => {
    if (!selectedLogId || !virtuosoRef.current) return;
    const index = sort.sortedLogs.findIndex((l) => l.id === selectedLogId);
    if (index < 0) return;
    // If the selection change was triggered by Global Search scroll, skip this one
    if (suppressNextSelectionAutoScroll.current) {
      suppressNextSelectionAutoScroll.current = false;
      return;
    }
    // Use Virtuoso's scrollIntoView to scroll only if needed, smoothly
    virtuosoRef.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      calculateViewLocation: ({
        itemBottom,
        itemTop,
        locationParams: { behavior, align, ...rest },
        viewportBottom,
        viewportTop,
      }) => {
        if (itemTop < viewportTop) {
          return { ...rest, behavior, align: align ?? 'start', offset: -50 };
        }
        if (itemBottom > viewportBottom) {
          return { ...rest, behavior, align: align ?? 'end', offset: 50 };
        }
        return null;
      },
    });
  }, [selectedLogId, sort.sortedLogs]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Filter Panel - No shadows or borders */}
      <div className="flex-shrink-0 p-2 sm:p-4">
        <FilterPanel
          filter={activeFilters.filter}
          statusFilter={activeFilters.statusFilter}
          methodFilter={activeFilters.methodFilter}
          sortBy={sort.sortBy}
          onTextFilterChange={activeFilters.handleTextFilterChange}
          onStatusFilterChange={activeFilters.handleStatusFilterChange}
          onMethodFilterChange={activeFilters.handleMethodFilterChange}
          onSortByChange={sort.handleSortByChange}
          uniqueStatusOptions={activeFilters.uniqueStatusOptions}
          uniqueMethodOptions={activeFilters.uniqueMethodOptions}
          sortByOptions={sort.sortByOptions}
          actions={
            <ActionButtons
              sortTooltipText={sort.getToggleTooltipText()}
              onToggleSort={sort.toggleSortDirection}
              sortDirection={sort.sortDirection}
              clearButtonText={clearButtonText}
              onClear={onClear}
            />
          }
          totalCount={rawTotalCount ?? logs.length}
          filteredCount={
            activeFilters.filter ||
            activeFilters.statusFilter.length ||
            activeFilters.methodFilter.length
              ? logs.length
              : null
          }
          deltaNew={rawAppendDelta}
        />
      </div>

      {/* Virtualized Log List */}
      <div className="flex-1 overflow-hidden">
        {sort.sortedLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match your filters
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            className="h-full overflow-x-hidden"
            totalCount={sort.sortedLogs.length}
            overscan={80}
            components={{
              Scroller: Scroller as any,
            }}
            itemContent={renderItem}
          />
        )}
      </div>
    </div>
  );
};
