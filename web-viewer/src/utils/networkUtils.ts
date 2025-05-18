import { NetVisionLog } from '../types';

export const formatDuration = (duration: number): string => {
  if (duration < 1000) {
    return `${duration}ms`;
  }
  return `${(duration / 1000).toFixed(2)}s`;
};

export const getStatusColor = (status: number): string => {
  if (status < 300) {
    return 'text-green-600 dark:text-green-400';
  }
  if (status < 400) {
    return 'text-yellow-600 dark:text-yellow-400';
  }
  return 'text-red-600 dark:text-red-400';
};

export const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'text-blue-700 dark:text-blue-400';
    case 'POST':
      return 'text-green-700 dark:text-green-400';
    case 'PUT':
      return 'text-yellow-700 dark:text-yellow-400';
    case 'DELETE':
      return 'text-red-700 dark:text-red-400';
    case 'PATCH':
      return 'text-purple-700 dark:text-purple-400';
    default:
      return 'text-gray-700 dark:text-gray-400';
  }
};

export const formatData = (data: unknown): string => {
  if (typeof data === 'string') {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If it's not JSON, return as is
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
};

export const LOGS_STORAGE_KEY = 'netvision-logs';

/**
 *
 * Retrieves logs from localStorage.
 * If parsing fails, it returns an empty array and logs the error to the console.
 * @returns {NetVisionLog[]} - Returns the logs stored in localStorage.
 *
 */
export const getLocalStorageLogs = (): NetVisionLog[] => {
  try {
    const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    return savedLogs ? JSON.parse(savedLogs) : [];
  } catch (error) {
    console.error('Failed to parse saved logs:', error);
    return [];
  }
};
