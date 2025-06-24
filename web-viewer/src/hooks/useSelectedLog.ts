import type { NetVisionLog } from '../types';

export const useSelectedLog = (selectedLog: NetVisionLog | null) => {
  // Helper function to check if two logs are the same
  const isLogSelected = (log: NetVisionLog): boolean => {
    if (!selectedLog) return false;
    return (
      selectedLog.timestamp === log.timestamp &&
      selectedLog.url === log.url &&
      selectedLog.method === log.method &&
      selectedLog.status === log.status
    );
  };

  return {
    isLogSelected,
  };
};
