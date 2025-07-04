/**
 * Consistent styling constants for field components
 */

export const fieldStyles = {
  container: {
    base: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm overflow-hidden backdrop-blur-sm',
    withHeader:
      'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm overflow-hidden backdrop-blur-sm',
  },
  header: {
    base: 'bg-gray-50/50 dark:bg-gray-800/30 px-3 py-2 border-b border-gray-200/30 dark:border-gray-700/30',
    json: 'bg-gray-50/50 dark:bg-gray-800/30 px-3 py-2 border-b border-gray-200/30 dark:border-gray-700/30',
  },
  content: {
    code: 'bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-800 dark:text-gray-200 transition-all duration-200 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto overflow-x-auto',
    text: 'text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 break-words overflow-wrap-anywhere hyphens-auto max-h-96 overflow-y-auto p-1',
    url: 'text-sm text-blue-600 dark:text-blue-400 font-mono transition-all duration-200 break-words overflow-wrap-anywhere hyphens-auto p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded border border-blue-200/50 dark:border-blue-800/50 whitespace-normal word-break-break-word min-w-0 w-full',
    json: 'p-4 text-sm font-mono max-h-96 overflow-auto text-gray-800 dark:text-gray-200 whitespace-pre leading-relaxed',
    keyValueList: 'max-h-80 overflow-y-auto',
    keyValueItem:
      'px-4 py-3 transition-all duration-300 group relative hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 border-b border-gray-100/60 dark:border-gray-700/60 last:border-b-0',
  },
  label: {
    base: 'text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300',
    error:
      'text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400',
    keyValueHeader:
      'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide',
    jsonHeader:
      'text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide',
  },
  keyValue: {
    name: 'font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1.5 tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300',
    value:
      'text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-lg break-words overflow-wrap-anywhere leading-relaxed transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-md group-hover:ring-1 group-hover:ring-blue-200/50 dark:group-hover:ring-blue-400/20 group-hover:text-gray-800 dark:group-hover:text-gray-200 border border-gray-200/40 dark:border-gray-600/40 group-hover:border-blue-300/50 dark:group-hover:border-blue-500/30 group-hover:scale-[1.01] transform-gpu',
  },
} as const;
