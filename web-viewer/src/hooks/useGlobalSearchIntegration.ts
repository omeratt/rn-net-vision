import { useCallback, useRef } from 'preact/hooks';
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
  // Optional bridge to a virtualized list scroll method
  const virtuosoScrollRef = useRef<{
    scrollToLogById: (logId: string) => void;
  } | null>(null);
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
    // Prefer virtualized list scroll if available
    if (virtuosoScrollRef.current?.scrollToLogById) {
      virtuosoScrollRef.current.scrollToLogById(logId);
      return;
    }

    // Find the log element by unique ID and scroll to it
    const logElement = document.querySelector(`[data-log-id="${logId}"]`);
    if (!logElement) {
      console.warn('Could not find log element with ID:', logId);
      return;
    }

    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      // Find the scrollable container - try multiple selectors in order of preference
      let container =
        logElement.closest('[data-log-scroll-container]') || // Our specific container
        logElement.closest('.overflow-y-auto'); // Generic scrollable container

      if (!container) {
        // Alternative: look for parent containers that might be scrollable
        container =
          logElement.closest('[data-scroll-container]') ||
          logElement.closest('.h-full.overflow-y-auto') ||
          logElement.closest('div[style*="overflow"]');
      }

      if (container) {
        // Wait for layout to stabilize
        requestAnimationFrame(() => {
          const containerRect = container.getBoundingClientRect();
          const logRect = logElement.getBoundingClientRect();

          // Calculate the exact position needed to put the log at the top
          const currentScrollTop = container.scrollTop;
          const logOffsetFromContainerTop = logRect.top - containerRect.top;
          const targetScrollTop =
            currentScrollTop + logOffsetFromContainerTop - 70; // 70px padding for better visibility

          // Scroll with smooth behavior
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          });
        });
      } else {
        // Enhanced fallback with better positioning
        logElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 50); // Small delay to ensure DOM stability
  }, []);

  return {
    selectLogByUniqueId,
    scrollToLogByUniqueId,
    virtuosoScrollRef,
  };
};
