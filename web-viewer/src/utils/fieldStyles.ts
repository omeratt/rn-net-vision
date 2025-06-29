/**
 * Consistent styling constants for field components
 */

export const fieldStyles = {
  container: {
    base: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    withHeader:
      'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
  },
  header: {
    base: 'bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700',
    json: 'bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700',
  },
  content: {
    code: 'bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-800 dark:text-gray-200 transition-all duration-200 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto overflow-x-auto',
    text: 'text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 break-words overflow-wrap-anywhere hyphens-auto max-h-96 overflow-y-auto p-1',
    url: 'text-sm text-blue-600 dark:text-blue-400 font-mono transition-all duration-200 break-words overflow-wrap-anywhere hyphens-auto p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded border border-blue-200/50 dark:border-blue-800/50 whitespace-normal word-break-break-word min-w-0 w-full',
    json: 'p-4 text-sm font-mono max-h-96 overflow-auto text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed',
    keyValueList:
      'divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto',
    keyValueItem:
      'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150',
  },
  label: {
    base: 'text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300',
    error:
      'text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400',
    keyValueHeader:
      'text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide',
    jsonHeader:
      'text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide',
  },
  keyValue: {
    name: 'font-medium text-gray-900 dark:text-gray-100 text-xs truncate',
    value:
      'text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-words overflow-wrap-anywhere leading-relaxed',
  },
} as const;
