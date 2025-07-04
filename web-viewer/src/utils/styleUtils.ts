/**
 * Common styling utilities for components
 */

export const getBaseBadgeClasses = (isSelected: boolean): string => {
  return `
    inline-flex items-center justify-center rounded-lg font-mono font-semibold text-xs 
    border border-white/30 shadow-lg transition-all duration-350 
    group-hover:shadow-2xl group-hover:border-indigo-400/60 
    group-hover:bg-gradient-to-r group-hover:from-white/80 group-hover:to-indigo-50/60 
    dark:group-hover:from-gray-700/80 dark:group-hover:to-indigo-900/60 
    ${
      isSelected
        ? 'shadow-xl border-indigo-500/50 bg-gradient-to-r from-white/70 to-indigo-50/50 dark:from-gray-600/70 dark:to-indigo-800/50 font-bold tracking-wide'
        : ''
    } 
    flex-shrink-0
  `;
};

export const getContainerClasses = (isSelected: boolean): string => {
  return `
    network-log-item relative bg-white/25 dark:bg-gray-800/25 rounded-xl cursor-pointer 
    border border-white/40 dark:border-gray-600/40 backdrop-blur-md
    before:rounded-xl after:rounded-xl w-full min-w-0
    ${
      isSelected
        ? 'ring-2 ring-indigo-500/60 dark:ring-indigo-400/70 border-indigo-500/70 dark:border-indigo-400/70 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-400/25 bg-gradient-to-br from-white/40 to-indigo-50/30 dark:from-gray-700/40 dark:to-indigo-900/30 backdrop-blur-lg selected-log'
        : 'hover:bg-gradient-to-br hover:from-white/45 hover:to-purple-50/25 dark:hover:from-gray-800/45 dark:hover:to-purple-900/25 hover:border-indigo-400/60 dark:hover:border-indigo-400/70'
    }
    group
  `;
};
