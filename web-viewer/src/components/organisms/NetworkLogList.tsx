/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import type { UnifiedLogFiltersReturn } from '../../hooks';
import { NetworkLog } from '../molecules/NetworkLog';
import { FilterPanel } from '../molecules/FilterPanel';
import { ActionButtons } from '../molecules/ActionButtons';
import { ScrollFadeContainer } from '../atoms';
import { useDevices } from '../../context/DeviceContext';
import { useNetworkLogFilters, useNetworkLogSort } from '../../hooks';

interface NetworkLogListProps {
  logs: NetVisionLog[];
  filters?: UnifiedLogFiltersReturn;
  onClear: () => void;
  onSelectLog: (log: NetVisionLog, index: number) => void;
  selectedLogId: string | null; // id-based selection
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
  selectedLogId,
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
  // selection now id-based; simple helper inline
  const isLogSelected = (log: NetVisionLog) => log.id === selectedLogId;

  // Generate clear button text based on active device
  const clearButtonText = activeDeviceId
    ? `Clear ${getDeviceName(activeDeviceId)} Logs`
    : 'Clear All Logs';

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
        />
      </div>

      {/* Scrollable Log List */}
      <div className="flex-1 overflow-hidden">
        <ScrollFadeContainer
          className="h-full overflow-y-auto px-2 sm:px-4 pb-2 sm:pb-4 pt-6"
          fadeHeight={80}
          scrollProps={{ 'data-log-scroll-container': 'true' }}
        >
          <div className="space-y-3" ref={sort.listContainerRef}>
            {sort.sortedLogs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No logs match your filters
              </div>
            ) : (
              sort.sortedLogs.map((log: NetVisionLog, index: number) => {
                const logId = log.id;
                return (
                  <NetworkLog
                    key={log.id}
                    log={log}
                    isSelected={isLogSelected(log)}
                    isHighlighted={highlightedLogId === logId}
                    highlightState={highlightState}
                    onClick={() => onSelectLog(log, index)}
                    activeDeviceId={activeDeviceId}
                  />
                );
              })
            )}
          </div>
        </ScrollFadeContainer>
      </div>
    </div>
  );
};
