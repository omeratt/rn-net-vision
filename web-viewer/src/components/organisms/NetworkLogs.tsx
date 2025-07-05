/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useCallback } from 'react';
import type { NetVisionLog } from '../../types';
import { NetworkLogList } from './NetworkLogList';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { SplitHandle } from '../atoms/SplitHandle';
import { ScrollFadeContainer } from '../atoms';
import { useDevices } from '../../context/DeviceContext';
import { useFilteredLogs } from '../../hooks/useFilteredLogs';
import { useLogSelection, useSplitPanel, useSortedLogs } from '../../hooks';

interface NetworkLogsProps {
  logs: NetVisionLog[];
  onClear: (deviceId?: string | null) => void;
}

export const NetworkLogs = ({ logs, onClear }: NetworkLogsProps): VNode => {
  const { activeDeviceId } = useDevices();

  // Use the filtered logs hook for device filtering
  const filteredLogs = useFilteredLogs(logs, activeDeviceId);

  // Use custom hooks for logic separation
  const sortedLogs = useSortedLogs();
  const selection = useLogSelection(sortedLogs.sortedLogs);
  const splitPanel = useSplitPanel();

  // Create a device-aware clear function
  const handleClear = useCallback(() => {
    onClear(activeDeviceId);
  }, [onClear, activeDeviceId]);

  return (
    <div
      ref={selection.containerRef}
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
