/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useLogCountSuffix } from '../../hooks/useLogCountSuffix';

interface LogCountSuffixProps {
  totalCount?: number;
  filteredCount?: number | null;
  deltaNew?: number;
}

export const LogCountSuffix = ({
  totalCount,
  filteredCount = null,
  deltaNew = 0,
}: LogCountSuffixProps): VNode | null => {
  const {
    displayFiltered,
    displayTotal,
    isFilteredCounts,
    animateDelta,
    fadeKey,
    formatNumber,
  } = useLogCountSuffix({ totalCount, filteredCount, deltaNew });

  if (totalCount === undefined && filteredCount === null) return null;

  return (
    <div
      className="absolute inset-y-0 right-0 flex items-center pr-2"
      aria-live="polite"
      title={isFilteredCounts ? 'Filtered logs / Total logs' : 'Total logs'}
    >
      <div className="h-6 w-px bg-gray-300/60 dark:bg-gray-600/60 mr-2" />
      <div
        key={fadeKey}
        className="relative flex items-center text-xs rounded-2xl px-2 py-1 bg-[var(--chip-bg,#0f1421)] text-[var(--chip-fg,#CFD6E5)] border border-[var(--chip-border,#26314a)] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_-1px_rgba(0,0,0,0.4)] transition-opacity duration-200 animate-count-fade-in tabular-nums"
      >
        {isFilteredCounts ? (
          <span className="whitespace-nowrap tabular-nums">
            <span className="opacity-100">
              {formatNumber(displayFiltered || 0)}
            </span>
            <span className="opacity-40 mx-1">/</span>
            <span className="opacity-65">{formatNumber(displayTotal)}</span>
          </span>
        ) : (
          <span className="whitespace-nowrap tabular-nums">
            {formatNumber(displayTotal)}
          </span>
        )}
        {animateDelta > 0 && (
          <span className="absolute -top-2 -right-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-400/40 rounded-full px-1 pointer-events-none select-none animate-pop-fade tabular-nums">
            +{formatNumber(animateDelta)}
          </span>
        )}
      </div>
    </div>
  );
};
