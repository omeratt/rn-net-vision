/** @jsxImportSource preact */
import { useMemo } from 'preact/hooks';
import type { NetVisionLog } from '../types';

/**
 * Custom hook to filter logs by device ID
 */
export const useFilteredLogs = (
  logs: NetVisionLog[],
  deviceId: string | null
) => {
  return useMemo(() => {
    if (!deviceId) {
      // No device filter, return all logs
      console.log(
        `[useFilteredLogs] No device selected, showing all ${logs.length} logs`
      );
      return logs;
    }

    // Filter logs by the selected device ID
    const filteredLogs = logs.filter((log) => {
      // Check if log has device info and matches selected device
      const hasDeviceId =
        typeof log.deviceId === 'string' && log.deviceId.length > 0;
      const isMatch = hasDeviceId && log.deviceId === deviceId;

      return isMatch;
    });

    console.log(
      `[useFilteredLogs] Filtered to ${filteredLogs.length} logs for device: ${deviceId} out of ${logs.length} total logs`
    );

    // Debug: show which device IDs are in the logs
    const uniqueDeviceIds = [
      ...new Set(logs.map((log) => log.deviceId).filter(Boolean)),
    ];
    console.log(
      '[useFilteredLogs] Available device IDs in logs:',
      uniqueDeviceIds
    );

    return filteredLogs;
  }, [logs, deviceId]);
};
