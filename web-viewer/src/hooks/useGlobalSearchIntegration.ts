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
      // Find log by the generated UUID (guaranteed unique!)
      let logIndex = sortedLogs.findIndex((log) => log.id === logId);
      let foundLog = null;

      if (logIndex !== -1) {
        foundLog = sortedLogs[logIndex];
      } else {
        // Fallback: try filteredLogs in case log not in current sort order
        logIndex = filteredLogs.findIndex((log) => log.id === logId);

        if (logIndex !== -1) {
          foundLog = filteredLogs[logIndex];
          // Update sortedLogs to be in sync
          handleSortedLogsChange(filteredLogs);
        }
      }

      if (foundLog) {
        handleSelectLog(foundLog, logIndex);
      } else {
        console.warn('Could not find log with ID:', logId);
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
