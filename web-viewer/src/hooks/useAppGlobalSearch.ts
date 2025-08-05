import { useRef, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

interface UseAppGlobalSearchProps {
  onHighlight: (logId: string) => void;
}

/**
 * Hook for managing global search integration at the app level
 * Handles communication between GlobalSearch and NetworkLogs components
 */
export const useAppGlobalSearch = ({
  onHighlight,
}: UseAppGlobalSearchProps) => {
  // Ref to access NetworkLogs component methods
  const networkLogsRef = useRef<{
    selectLogByUniqueId: (logId: string) => void;
    scrollToLogByUniqueId: (logId: string) => void;
  }>(null);

  // Create unique log identifier
  const createLogId = useCallback((log: NetVisionLog) => {
    return `${log.timestamp}-${log.url}-${log.method}`;
  }, []);

  // Enhanced log selection handler for global search
  const handleLogSelect = useCallback(
    (log: NetVisionLog) => {
      const logId = createLogId(log);

      // Use the NetworkLogs component's selection method if available
      if (networkLogsRef.current?.selectLogByUniqueId) {
        networkLogsRef.current.selectLogByUniqueId(logId);
      }

      // Use the enhanced scroll method with unique ID
      if (networkLogsRef.current?.scrollToLogByUniqueId) {
        networkLogsRef.current.scrollToLogByUniqueId(logId);
      }

      // Trigger highlight
      onHighlight(logId);
    },
    [createLogId, onHighlight]
  );

  // Enhanced scroll to log handler
  const handleScrollToLog = useCallback((logId: string) => {
    // Use the NetworkLogs component's scroll method if available
    if (networkLogsRef.current?.scrollToLogByUniqueId) {
      networkLogsRef.current.scrollToLogByUniqueId(logId);
    }
  }, []);

  // Register NetworkLogs methods
  const registerNetworkLogsMethods = useCallback(
    (
      selectMethod: (logId: string) => void,
      scrollMethod: (logId: string) => void
    ) => {
      networkLogsRef.current = {
        selectLogByUniqueId: selectMethod,
        scrollToLogByUniqueId: scrollMethod,
      };
    },
    []
  );

  return {
    handleLogSelect,
    handleScrollToLog,
    registerNetworkLogsMethods,
  };
};
