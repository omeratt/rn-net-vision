/**
 * Search field utilities for GlobalSearch component
 * Provides field styling, icons, and formatting functions
 */

// Helper function to get field-specific styling classes
export const getFieldStyling = (field: string): string => {
  const fieldStyles: Record<string, string> = {
    // High priority fields - vibrant colors
    url: 'bg-blue-100/90 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50',
    method:
      'bg-green-100/90 dark:bg-green-900/40 text-green-800 dark:text-green-200 border border-green-200/50 dark:border-green-700/50',
    status:
      'bg-purple-100/90 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border border-purple-200/50 dark:border-purple-700/50',

    // Body fields - warm colors
    requestBody:
      'bg-orange-100/90 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border border-orange-200/50 dark:border-orange-700/50',
    responseBody:
      'bg-red-100/90 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200/50 dark:border-red-700/50',

    // Header fields - cool colors
    requestHeaders:
      'bg-cyan-100/90 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200 border border-cyan-200/50 dark:border-cyan-700/50',
    responseHeaders:
      'bg-teal-100/90 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border border-teal-200/50 dark:border-teal-700/50',

    // Utility fields - neutral colors
    cookies:
      'bg-amber-100/90 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-700/50',
    duration:
      'bg-slate-100/90 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50',
    timestamp:
      'bg-gray-100/90 dark:bg-gray-900/40 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50',
  };

  return (
    fieldStyles[field] ||
    'bg-gray-100/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200'
  );
};

// Helper function to get field-specific emoji icons
export const getFieldIcon = (field: string): string => {
  const fieldIcons: Record<string, string> = {
    url: '🌐',
    method: '⚡',
    status: '📊',
    requestBody: '📤',
    responseBody: '📥',
    requestHeaders: '📋',
    responseHeaders: '📄',
    cookies: '🍪',
    duration: '⏱️',
    timestamp: '🕐',
  };

  return fieldIcons[field] || '📝';
};

// Helper function to format field names with proper labels
export const formatFieldLabel = (field: string): string => {
  const fieldLabels: Record<string, string> = {
    url: 'URL',
    method: 'METHOD',
    status: 'STATUS',
    requestBody: 'REQUEST BODY',
    responseBody: 'RESPONSE BODY',
    requestHeaders: 'REQUEST HEADERS',
    responseHeaders: 'RESPONSE HEADERS',
    cookies: 'COOKIES',
    duration: 'DURATION',
    timestamp: 'TIMESTAMP',
  };

  return fieldLabels[field] || field.toUpperCase();
};
