/**
 * Hook encapsulating logic for the log count suffix (filtered/total + delta animation).
 */
import { useEffect, useRef, useState } from 'preact/hooks';

export interface UseLogCountSuffixParams {
  totalCount?: number;
  filteredCount?: number | null;
  deltaNew?: number;
  aggregationWindowMs?: number;
  deltaDisplayDurationMs?: number;
}

export interface UseLogCountSuffixReturn {
  displayFiltered: number | null;
  displayTotal: number | undefined;
  isFilteredCounts: boolean;
  animateDelta: number;
  fadeKey: number;
  formatNumber: (n: number | undefined | null) => string;
}

export const useLogCountSuffix = ({
  totalCount,
  filteredCount = null,
  deltaNew = 0,
  aggregationWindowMs = 250,
  deltaDisplayDurationMs = 550,
}: UseLogCountSuffixParams): UseLogCountSuffixReturn => {
  const prevCountsRef = useRef<{
    filtered: number | null;
    total: number | undefined;
  } | null>(null);
  const [animateDelta, setAnimateDelta] = useState(0);
  const deltaTimerRef = useRef<number | null>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [displayFiltered, setDisplayFiltered] = useState<number | null>(
    filteredCount
  );
  const [displayTotal, setDisplayTotal] = useState<number | undefined>(
    totalCount
  );

  const formatNumber = (n: number | undefined | null) => {
    if (n === undefined || n === null) return '0';
    return n.toLocaleString();
  };

  const isFilteredCounts =
    filteredCount !== null &&
    filteredCount !== undefined &&
    totalCount !== undefined &&
    filteredCount !== totalCount;

  useEffect(() => {
    const prev = prevCountsRef.current;
    const changed =
      !prev || prev.filtered !== filteredCount || prev.total !== totalCount;
    if (changed) {
      setFadeKey((k) => k + 1);
      setDisplayFiltered(filteredCount);
      setDisplayTotal(totalCount);
      prevCountsRef.current = { filtered: filteredCount, total: totalCount };
    }
  }, [filteredCount, totalCount]);

  useEffect(() => {
    if (!deltaNew) return;
    setAnimateDelta((d) => d + deltaNew);
    if (deltaTimerRef.current) window.clearTimeout(deltaTimerRef.current);
    deltaTimerRef.current = window.setTimeout(() => {
      setTimeout(() => setAnimateDelta(0), deltaDisplayDurationMs);
    }, aggregationWindowMs);
    return () => {
      if (deltaTimerRef.current) window.clearTimeout(deltaTimerRef.current);
    };
  }, [deltaNew, aggregationWindowMs, deltaDisplayDurationMs]);

  return {
    displayFiltered,
    displayTotal,
    isFilteredCounts,
    animateDelta,
    fadeKey,
    formatNumber,
  };
};
