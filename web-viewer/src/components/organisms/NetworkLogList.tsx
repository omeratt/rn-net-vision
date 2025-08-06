/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { NetworkLog } from '../molecules/NetworkLog';
import { FilterPanel } from '../molecules/FilterPanel';
import { ActionButtons } from '../molecules/ActionButtons';
import { useDevices } from '../../context/DeviceContext';
import {
  useNetworkLogFilters,
  useNetworkLogSort,
  useSelectedLog,
} from '../../hooks';

interface NetworkLogListProps {
  logs: NetVisionLog[];
  onClear: () => void;
  onSelectLog: (log: NetVisionLog, index: number) => void;
  selectedLog: NetVisionLog | null;
  onSortedLogsChange?: (sortedLogs: NetVisionLog[]) => void;
  onClearSelection?: () => void;
  highlightedLogId?: string | null;
  highlightState?: 'idle' | 'blinking' | 'fading';
}

export const NetworkLogList = ({
  logs,
  onClear,
  onSelectLog,
  selectedLog,
  onSortedLogsChange,
  onClearSelection,
  highlightedLogId,
  highlightState = 'idle',
}: NetworkLogListProps): VNode => {
  const { activeDeviceId, getDeviceName } = useDevices();

  // Use custom hooks
  const filters = useNetworkLogFilters(logs);
  const sort = useNetworkLogSort(
    filters.filteredLogs,
    onClearSelection,
    onSortedLogsChange
  );
  const selection = useSelectedLog(selectedLog);

  // Generate clear button text based on active device
  const clearButtonText = activeDeviceId
    ? `Clear ${getDeviceName(activeDeviceId)} Logs`
    : 'Clear All Logs';

  return (
    <div className="space-y-4">
      <FilterPanel
        filter={filters.filter}
        statusFilter={filters.statusFilter}
        methodFilter={filters.methodFilter}
        sortBy={sort.sortBy}
        onTextFilterChange={filters.handleTextFilterChange}
        onStatusFilterChange={filters.handleStatusFilterChange}
        onMethodFilterChange={filters.handleMethodFilterChange}
        onSortByChange={sort.handleSortByChange}
        uniqueStatusOptions={filters.uniqueStatusOptions}
        uniqueMethodOptions={filters.uniqueMethodOptions}
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
      />

      <div className="space-y-3" ref={sort.listContainerRef}>
        {sort.sortedLogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No logs match your filters
          </div>
        ) : (
          sort.sortedLogs.map((log: NetVisionLog, index: number) => {
            // Use the generated log ID for consistent highlighting
            const logId = log.id;

            return (
              <NetworkLog
                key={log.id} // Use the generated ID as key for optimal performance
                log={log}
                isSelected={selection.isLogSelected(log)}
                isHighlighted={highlightedLogId === logId}
                highlightState={highlightState}
                onClick={() => onSelectLog(log, index)}
                activeDeviceId={activeDeviceId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
