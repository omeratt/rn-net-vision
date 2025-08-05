/** @jsxImportSource preact */
import { VNode, RefObject } from 'preact';
import { useCallback, useEffect } from 'react';
import type { NetVisionLog, HighlightState } from '../../types';
import { NetworkLogList } from './NetworkLogList';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { SplitHandle } from '../atoms/SplitHandle';
import { ScrollFadeContainer } from '../atoms';
import {
  useLogSelection,
  useSplitPanel,
  useSortedLogs,
  useGlobalSearchIntegration,
  useNetworkLogsRefs,
} from '../../hooks';

interface NetworkLogsProps {
  logs: NetVisionLog[];
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
      className="flex flex-col sm:flex-row h-full overflow-hidden rounded-lg shadow-lg safe-area-container focus:outline-none"
      tabIndex={0}
    >
      <div
        style={{ width: `${splitPanel.splitPosition}%` }}
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-900/20  transition-[width] ease-out mobile-no-scroll-x"
      >
        <ScrollFadeContainer
          className="p-2 sm:p-4 h-full overflow-y-auto"
          fadeHeight={20}
        >
          <NetworkLogList
            logs={filteredLogs}
            onClear={handleClear}
            onSelectLog={selection.handleSelectLog}
            selectedLog={selection.selectedLog}
            onSortedLogsChange={sortedLogs.handleSortedLogsChange}
            onClearSelection={selection.handleClearSelection}
            highlightedLogId={highlightedLogId}
            highlightState={highlightState}
          />
        </ScrollFadeContainer>
      </div>

      <SplitHandle
        splitRef={splitPanel.splitRef}
        isDragging={splitPanel.isDragging}
        isResizing={splitPanel.isResizing}
        setIsResizing={splitPanel.setIsResizing}
      />

      <div
        style={{ width: `${100 - splitPanel.splitPosition}%` }}
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-800/20  transition-[width] ease-out mobile-no-scroll-x"
      >
        <LogDetailsPanel log={selection.selectedLog} />
      </div>
    </div>
  );
};
