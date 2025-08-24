/** @jsxImportSource preact */
// @ts-nocheck
import { motion } from 'framer-motion';
import { useLogCountSuffix } from '../../hooks/useLogCountSuffix';
import { useAnimatedAutoWidth } from '../../hooks/useAnimatedAutoWidth';
import { DeltaBadge } from './delta/DeltaBadge';

export interface LogCountSuffixProps {
  totalCount?: number;
  filteredCount?: number | null;
  deltaNew?: number;
}

export const LogCountSuffix = ({
  totalCount,
  filteredCount = null,
  deltaNew = 0,
}: LogCountSuffixProps) => {
  const {
    displayFiltered,
    displayTotal,
    isFilteredCounts,
    animateDelta,
    formatNumber,
  } = useLogCountSuffix({ totalCount, filteredCount, deltaNew });

  const { ref, width, animateProps } = useAnimatedAutoWidth([
    displayFiltered,
    displayTotal,
    isFilteredCounts,
  ]);

  if (totalCount === undefined && filteredCount === null) return null;

  return (
    <div
      className="absolute inset-y-0 right-0 flex items-center pr-2"
      aria-live="polite"
      title={isFilteredCounts ? 'Filtered logs / Total logs' : 'Total logs'}
    >
      <div className="h-6 w-px bg-gray-300/60 dark:bg-gray-600/60 mr-2" />
      <motion.div
        ref={ref}
        {...animateProps}
        style={width != null ? { width } : undefined}
        className="relative flex items-center text-xs rounded-2xl px-2 py-1 bg-[var(--chip-bg,#0f1421)] text-[var(--chip-fg,#CFD6E5)] border border-[var(--chip-border,#26314a)] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_-1px_rgba(0,0,0,0.4)] tabular-nums overflow-visible"
      >
        {isFilteredCounts ? (
          <CountsFiltered
            filtered={displayFiltered || 0}
            total={displayTotal}
            formatNumber={formatNumber}
          />
        ) : (
          <CountsTotal total={displayTotal} formatNumber={formatNumber} />
        )}
        <DeltaBadge value={animateDelta} formatNumber={formatNumber} />
      </motion.div>
    </div>
  );
};

interface CountsFilteredProps {
  filtered: number;
  total?: number;
  formatNumber: (n: number | undefined | null) => string;
}
const CountsFiltered = ({
  filtered,
  total,
  formatNumber,
}: CountsFilteredProps) => (
  <div className="flex items-baseline gap-1 whitespace-nowrap">
    <span className="opacity-100 animate-number-scale inline-block">
      {formatNumber(filtered)}
    </span>
    <span className="opacity-40 mx-0.5 select-none">/</span>
    <span className="opacity-65 animate-number-scale inline-block">
      {formatNumber(total)}
    </span>
  </div>
);

interface CountsTotalProps {
  total?: number;
  formatNumber: (n: number | undefined | null) => string;
}
const CountsTotal = ({ total, formatNumber }: CountsTotalProps) => (
  <div className="inline-block animate-number-scale whitespace-nowrap">
    {formatNumber(total)}
  </div>
);
