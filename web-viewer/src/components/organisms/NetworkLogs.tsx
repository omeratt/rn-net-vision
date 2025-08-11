/** @jsxImportSource preact */
import { VNode, RefObject } from 'preact';
import { useCallback, useEffect } from 'react';
import type { NetVisionLog, HighlightState } from '../../types';
import type { UnifiedLogFiltersReturn } from '../../hooks';
import { NetworkLogList } from './NetworkLogList';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { SplitHandle } from '../atoms/SplitHandle';
import {
  useLogSelection,
  useSplitPanel,
  useSortedLogs,
  useGlobalSearchIntegration,
  useNetworkLogsRefs,
} from '../../hooks';

interface NetworkLogsProps {
  logs: NetVisionLog[];
  filters?: UnifiedLogFiltersReturn;
  onClear: (deviceId?: string | null) => void;
  logContainerRef?: RefObject<HTMLDivElement>;
  highlightedLogId?: string | null;
  highlightState?: HighlightState;
  onLogSelectionChange?: (
    selectMethod: (logId: string) => void, // Changed parameter type to logId for both methods
    scrollMethod: (logId: string) => void
  ) => void;
}

export const NetworkLogs = ({
  logs,
  filters,
  onClear,
  logContainerRef,
  highlightedLogId,
  highlightState = 'idle',
  onLogSelectionChange,
}: NetworkLogsProps): VNode => {
  // Note: logs are already filtered by device in app.tsx, no need to filter again
  const filteredLogs = logs;

  // Use custom hooks for logic separation
  const sortedLogs = useSortedLogs();
  const selection = useLogSelection(sortedLogs.sortedLogs);
  const splitPanel = useSplitPanel();

  // Global search integration hook
  const globalSearch = useGlobalSearchIntegration({
    sortedLogs: sortedLogs.sortedLogs,
    filteredLogs,
    handleSortedLogsChange: sortedLogs.handleSortedLogsChange,
    handleSelectLog: selection.handleSelectLog,
  });

  // Container refs management hook
  const containerRefs = useNetworkLogsRefs({
    selectionContainerRef: selection.containerRef,
    logContainerRef,
  });

  // Create a clear function (logs are already filtered by device)
  const handleClear = useCallback(() => {
    onClear(null); // Clear all logs since we're already filtered
  }, [onClear]);

  // Expose methods to parent component
  useEffect(() => {
    if (onLogSelectionChange) {
      onLogSelectionChange(
        globalSearch.selectLogByUniqueId,
        globalSearch.scrollToLogByUniqueId
      );
    }
  }, [
    onLogSelectionChange,
    globalSearch.selectLogByUniqueId,
    globalSearch.scrollToLogByUniqueId,
  ]);

  return (
    <div
      ref={containerRefs.setContainerRef}
      className="flex flex-col sm:flex-row h-full min-h-full overflow-hidden rounded-lg shadow-lg safe-area-container focus:outline-none"
      tabIndex={0}
    >
      <div
        style={{ width: `${splitPanel.splitPosition}%` }}
        className="h-full sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-900/20 transition-[width] ease-out mobile-no-scroll-x flex flex-col"
      >
        <NetworkLogList
          logs={filteredLogs}
          filters={filters}
          onClear={handleClear}
          onSelectLog={selection.handleSelectLog}
          selectedLog={selection.selectedLog}
          onSortedLogsChange={sortedLogs.handleSortedLogsChange}
          onClearSelection={selection.handleClearSelection}
          highlightedLogId={highlightedLogId}
          highlightState={highlightState}
        />
      </div>

      <SplitHandle
        splitRef={splitPanel.splitRef}
        isDragging={splitPanel.isDragging}
        isResizing={splitPanel.isResizing}
        setIsResizing={splitPanel.setIsResizing}
      />

      <div
        style={{ width: `${100 - splitPanel.splitPosition}%` }}
        className="h-full sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-800/20 transition-[width] ease-out mobile-no-scroll-x"
      >
        <LogDetailsPanel log={selection.selectedLog} />
      </div>
    </div>
  );
};
