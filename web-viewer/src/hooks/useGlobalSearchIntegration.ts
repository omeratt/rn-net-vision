import { useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

interface UseGlobalSearchIntegrationProps {
  sortedLogs: NetVisionLog[];
  filteredLogs: NetVisionLog[];
  handleSortedLogsChange: (logs: NetVisionLog[]) => void;
  handleSelectLog: (log: NetVisionLog, index: number) => void;
}

/**
 * Hook for handling global search integration with NetworkLogs
 * Provides methods for selecting and scrolling to logs by unique ID
 */
export const useGlobalSearchIntegration = ({
  sortedLogs,
  filteredLogs,
  handleSortedLogsChange,
  handleSelectLog,
}: UseGlobalSearchIntegrationProps) => {
  const selectLogByUniqueId = useCallback(
    (logId: string) => {
      // Parse the unique ID to extract timestamp, URL, and method
      const parts = logId.split('-');
      if (parts.length >= 3) {
        const timestamp = parts[0];
        const url = parts.slice(1, -1).join('-'); // Handle URLs with dashes
        const method = parts[parts.length - 1];

        // First try sortedLogs (the currently displayed sorted order)
        let logIndex = sortedLogs.findIndex(
          (log) =>
            log.timestamp.toString() === timestamp &&
            log.url === url &&
            log.method === method
        );
        let foundLog = null;

        if (logIndex !== -1) {
          foundLog = sortedLogs[logIndex];
        } else {
          // Fallback: try filteredLogs
          logIndex = filteredLogs.findIndex(
            (log) =>
              log.timestamp.toString() === timestamp &&
              log.url === url &&
              log.method === method
          );

          if (logIndex !== -1) {
            foundLog = filteredLogs[logIndex];

            // Update sortedLogs to be in sync
            handleSortedLogsChange(filteredLogs);
          }
        }

        if (foundLog) {
          handleSelectLog(foundLog, logIndex);
        } else {
          console.warn('Could not find log with unique ID:', logId);
        }
      } else {
        console.warn('Invalid log ID format:', logId);
      }
    },
    [sortedLogs, filteredLogs, handleSortedLogsChange, handleSelectLog]
  );

  const scrollToLogByUniqueId = useCallback((logId: string) => {
    // Find the log element by unique ID and scroll to it
    const logElement = document.querySelector(`[data-log-id="${logId}"]`);
    if (logElement) {
      logElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } else {
      console.warn('Could not find log element with ID:', logId);
    }
  }, []);

  return {
    selectLogByUniqueId,
    scrollToLogByUniqueId,
  };
};
