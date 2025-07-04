/**
 * Utility functions for duration formatting and styling
 */

export const formatDuration = (duration: number): string => {
  if (duration < 1000) return `${duration}ms`;
  return `${(duration / 1000).toFixed(2)}s`;
};

export const getDurationColor = (duration: number): string => {
  if (duration < 100) return 'text-green-600 dark:text-green-400';
  if (duration < 500) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};
