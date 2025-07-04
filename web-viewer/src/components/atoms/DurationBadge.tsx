/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { formatDuration, getDurationColor } from '../../utils/durationUtils';

interface DurationBadgeProps {
  duration: number;
  isSelected: boolean;
}

export const DurationBadge = ({
  duration,
  isSelected,
}: DurationBadgeProps): VNode => {
  const durationText = formatDuration(duration);
  const durationColor = getDurationColor(duration);

  return (
    <span
      className={`font-mono text-xs px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg border border-white/30 shadow-md transition-all duration-350 group-hover:shadow-xl group-hover:border-indigo-400/60 group-hover:bg-gradient-to-r group-hover:from-white/80 group-hover:to-indigo-50/60 dark:group-hover:from-gray-700/80 dark:group-hover:to-indigo-900/60 ${durationColor} bg-white/60 dark:bg-gray-800/60 ${
        isSelected
          ? 'shadow-lg border-indigo-500/50 bg-gradient-to-r from-white/70 to-indigo-50/50 dark:from-gray-600/70 dark:to-indigo-800/50 font-semibold tracking-wide'
          : ''
      } flex-shrink-0`}
    >
      {durationText}
    </span>
  );
};
