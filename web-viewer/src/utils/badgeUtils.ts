/**
 * Utility functions for badge styling and colors
 */

export const getStatusColor = (status: number): string => {
  if (status < 300) return 'text-green-500 dark:text-green-400';
  if (status < 400) return 'text-blue-500 dark:text-blue-400';
  return 'text-red-500 dark:text-red-400';
};

export const getStatusBadgeColor = (status: number): string => {
  if (status < 300) return 'bg-green-100 dark:bg-green-900/40';
  if (status < 400) return 'bg-blue-100 dark:bg-blue-900/40';
  return 'bg-red-100 dark:bg-red-900/40';
};

export const getMethodColor = (method: string): string => {
  switch (method) {
    case 'GET':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'POST':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'PUT':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'PATCH':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getDevicePlatformColor = (platform: string): string => {
  return platform === 'ios'
    ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/40 dark:to-blue-900/40 text-blue-800 dark:text-blue-300'
    : 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-900/40 text-green-800 dark:text-green-300';
};
