/**
 * Common styling utilities for components
 */

export const getBaseBadgeClasses = (isSelected: boolean): string => {
  return `
    inline-flex items-center justify-center rounded-lg font-mono font-semibold text-xs 
    border border-white/30 shadow-lg
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
    network-log-item relative cursor-pointer w-full min-w-0
    rounded-xl backdrop-blur-md
    bg-gray-100/85 dark:bg-gray-800/90
    border border-gray-200/40 dark:border-gray-700/50
    shadow-[3px_3px_4px_rgba(0,0,0,0.15),-3px_-3px_4px_rgba(255,255,255,0.9)] 
    dark:shadow-[3px_3px_4px_rgba(0,0,0,0.4),-3px_-3px_4px_rgba(255,255,255,0.05)]
    before:rounded-xl after:rounded-xl
    ${
      isSelected
        ? 'ring-2 ring-indigo-500/60 dark:ring-indigo-400/70 border-indigo-500/70 dark:border-indigo-400/70 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-400/25 bg-gradient-to-br from-white/40 to-indigo-50/30 dark:from-gray-700/40 dark:to-indigo-900/30 backdrop-blur-lg selected-log'
        : 'hover:shadow-[4px_4px_12px_rgba(0,0,0,0.2),-4px_-4px_12px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_12px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.08)] hover:bg-gray-50/95 dark:hover:bg-gray-700/95 hover:border-indigo-400/60 dark:hover:border-indigo-400/70 hover:transform hover:translate-y-[-1px] transition-all duration-200'
    }
    group
  `;
};
