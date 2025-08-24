/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import type { UnifiedLogFiltersReturn } from '../../hooks';
import { NetworkLog } from '../molecules/NetworkLog';
import { FilterPanel } from '../molecules/FilterPanel';
import { ActionButtons } from '../molecules/ActionButtons';
import { ScrollFadeContainer } from '../atoms/ScrollFadeContainer';
import { useDevices } from '../../context/DeviceContext';
import { useUrlFilter } from '../../context/UrlFilterContext';
import { useNetworkLogFilters, useNetworkLogSort } from '../../hooks';
import { useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { forwardRef } from 'preact/compat';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AnimatedVirtualLog,
  useAnimatedVirtualLogs,
} from '../../hooks/useAnimatedVirtualLogs';

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
  const { getActiveFiltersCount } = useUrlFilter();

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

  // Animated list (enter / exit / reorder)
  const EXIT_ANIM_MS = 260; // must be >= motion exit transition duration
  const { animatedLogs, markEntered, enableLayout } = useAnimatedVirtualLogs(
    sort.sortedLogs,
    { exitDurationMs: EXIT_ANIM_MS }
  );
  const prefersReduced = useReducedMotion();

  // Track if user is actively scrolling to temporarily suppress heavy layout animations
  const scrollingRef = useRef(false);
  const lastScrollTs = useRef(0);
  useEffect(() => {
    const scrollerEl = document.querySelector(
      '[data-log-scroll-container="true"]'
    );
    if (!scrollerEl) return;
    let raf: number | null = null;
    const handleScroll = () => {
      scrollingRef.current = true;
      lastScrollTs.current = performance.now();
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // After ~120ms of no scroll events, re-enable animations
        const loop = () => {
          if (performance.now() - lastScrollTs.current > 120) {
            scrollingRef.current = false;
          } else {
            raf = requestAnimationFrame(loop);
          }
        };
        loop();
      });
    };
    scrollerEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollerEl.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Large batch detection: if many items change at once, disable enter springs
  const largeBatch = animatedLogs.length > 400; // heuristic

  const renderItem = useCallback(
    (index: number, data: AnimatedVirtualLog) => {
      const log = data;
      if (!log) return null as any;
      const logId = log.id;
      const entering = log.__phase === 'entering';
      const exiting = log.__phase === 'exiting';
      const layout =
        enableLayout && !exiting && !prefersReduced && !scrollingRef.current;
      const MotionDiv = motion.div;
      return (
        <MotionDiv
          key={logId}
          layout={true}
          layoutId={layout ? `netvision-log-${logId}` : undefined}
          data-log-timestamp={log.timestamp}
          data-log-id={logId}
          className="px-6 py-1.5 w-full max-w-full overflow-hidden will-change-transform will-change-opacity"
          initial={
            entering && !prefersReduced
              ? largeBatch
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.985 }
              : false
          }
          animate={
            exiting && !prefersReduced
              ? {
                  opacity: 0,
                  y: -6,
                  scale: 0.94,
                  backgroundColor: 'rgba(255,99,71,0.08)',
                  transition: { duration: 0.24, ease: 'easeInOut' },
                }
              : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.24, ease: 'easeIn' },
                }
          }
          transition={
            entering && !prefersReduced
              ? largeBatch
                ? { duration: 0.18, ease: 'easeOut' }
                : { type: 'spring', stiffness: 520, damping: 42, mass: 0.55 }
              : { type: 'spring', stiffness: 400, damping: 34, mass: 0.65 }
          }
          onAnimationComplete={() => entering && markEntered(logId)}
        >
          {
            (
              <NetworkLog
                key={log.id}
                log={log}
                isSelected={isLogSelected(log)}
                isHighlighted={highlightedLogId === logId}
                highlightState={highlightState}
                onClick={() => onSelectLog(log, index)}
                activeDeviceId={activeDeviceId}
                isExiting={exiting}
              />
            ) as any
          }
        </MotionDiv>
      );
    },
    [
      isLogSelected,
      highlightedLogId,
      highlightState,
      onSelectLog,
      activeDeviceId,
      markEntered,
      enableLayout,
      prefersReduced,
      largeBatch,
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
            activeFilters.methodFilter.length ||
            getActiveFiltersCount() > 0
              ? activeFilters.filteredLogs.length
              : null
          }
          deltaNew={rawAppendDelta}
        />
      </div>

      {/* Virtualized Log List */}
      <div className="flex-1 overflow-hidden">
        {animatedLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match your filters
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            className="h-full overflow-x-hidden"
            totalCount={animatedLogs.length}
            overscan={80}
            components={{
              Scroller: Scroller as any,
            }}
            data={animatedLogs}
            itemContent={renderItem}
          />
        )}
      </div>
    </div>
  );
};
