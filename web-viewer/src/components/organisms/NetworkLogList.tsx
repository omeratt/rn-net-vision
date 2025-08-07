/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import type { UnifiedLogFiltersReturn } from '../../hooks';
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
  filters?: UnifiedLogFiltersReturn;
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
  filters,
  onClear,
  onSelectLog,
  selectedLog,
  onSortedLogsChange,
  onClearSelection,
  highlightedLogId,
  highlightState = 'idle',
}: NetworkLogListProps): VNode => {
  const { activeDeviceId, getDeviceName } = useDevices();

  // Use shared filters from parent if available, otherwise create own filters
  // This maintains backward compatibility while allowing the new unified approach
  const fallbackFilters = useNetworkLogFilters(logs);
  const activeFilters = filters || fallbackFilters;

  const sort = useNetworkLogSort(
    activeFilters.filteredLogs,
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
