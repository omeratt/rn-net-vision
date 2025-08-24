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
  /** Duration of the numeric interpolation when counts change */
  countTransitionDurationMs?: number;
  /** Maximum time the +delta badge can remain visible continuously (guards against infinite stream keeping it stuck) */
  maxDeltaVisibleMs?: number;
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
  aggregationWindowMs = 400,
  deltaDisplayDurationMs = 550,
  countTransitionDurationMs = 300,
  maxDeltaVisibleMs = 2500,
}: UseLogCountSuffixParams): UseLogCountSuffixReturn => {
  const prevCountsRef = useRef<{
    filtered: number | null;
    total: number | undefined;
  } | null>(null);
  const [animateDelta, setAnimateDelta] = useState(0);
  const deltaTimerRef = useRef<number | null>(null);
  // Track previous total count to infer new logs even if deltaNew prop value repeats (e.g., always 1)
  const prevTotalForDeltaRef = useRef<number | undefined>(totalCount);
  // Track last totalCount we applied a delta for, and whether deltaNew already consumed for that total
  const lastProcessedTotalRef = useRef<number | undefined>(totalCount);
  const consumedDeltaForTotalRef = useRef<boolean>(false);
  // Skip delta animation on the very first run (initial historical load)
  const firstRunRef = useRef<boolean>(true);
  // Track first delta timestamp & hard hide timer
  const firstDeltaTsRef = useRef<number | null>(null);
  const hardHideTimerRef = useRef<number | null>(null);
  const vanishTimerRef = useRef<number | null>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [displayFiltered, setDisplayFiltered] = useState<number | null>(
    filteredCount
  );
  const [displayTotal, setDisplayTotal] = useState<number | undefined>(
    totalCount
  );
  // Animated numerical states (tweened)
  const [animFiltered, setAnimFiltered] = useState<number | null>(
    filteredCount
  );
  const [animTotal, setAnimTotal] = useState<number | undefined>(totalCount);
  const filteredAnimRef = useRef<number | null>(null);
  const totalAnimRef = useRef<number | null>(null);
  const lastAnimFilteredRef = useRef<number | null>(animFiltered);
  const lastAnimTotalRef = useRef<number | undefined>(animTotal);

  // Keep refs in sync with animated values
  useEffect(() => {
    lastAnimFilteredRef.current = animFiltered;
  }, [animFiltered]);
  useEffect(() => {
    lastAnimTotalRef.current = animTotal;
  }, [animTotal]);

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
      // Kick off smooth interpolation for both values
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const startTs = performance.now();
      const startFiltered = lastAnimFilteredRef.current;
      const targetFiltered = filteredCount;
      const startTotal = lastAnimTotalRef.current;
      const targetTotal = totalCount;

      // Cancel any in-flight animations
      if (filteredAnimRef.current)
        cancelAnimationFrame(filteredAnimRef.current);
      if (totalAnimRef.current) cancelAnimationFrame(totalAnimRef.current);

      const animate = () => {
        const now = performance.now();
        const progress = Math.min(
          1,
          (now - startTs) / Math.max(1, countTransitionDurationMs)
        );
        const eased = easeOutCubic(progress);

        if (targetFiltered === null || targetFiltered === undefined) {
          setAnimFiltered(targetFiltered as any);
        } else if (startFiltered === null || startFiltered === undefined) {
          setAnimFiltered(Math.round(targetFiltered * eased));
        } else {
          const val = startFiltered + (targetFiltered - startFiltered) * eased;
          setAnimFiltered(Math.round(val));
        }

        if (targetTotal === undefined) {
          setAnimTotal(targetTotal);
        } else if (startTotal === undefined) {
          setAnimTotal(Math.round(targetTotal * eased));
        } else {
          const valT = startTotal + (targetTotal - startTotal) * eased;
          setAnimTotal(Math.round(valT));
        }

        if (progress < 1) {
          const id = requestAnimationFrame(animate);
          filteredAnimRef.current = id;
          totalAnimRef.current = id;
        }
      };
      requestAnimationFrame(animate);
    }
    // We intentionally exclude animated state from deps to prevent restarting animation each frame.
  }, [filteredCount, totalCount, countTransitionDurationMs]);

  /**
   * Delta accumulation logic:
   * - We want the +N badge to reflect only NEW logs arriving from the socket.
   * - Parent supplies deltaNew (count of new logs in this render). However when many logs arrive one-by-one
   *   with the same deltaNew value (often 1) the previous implementation's effect (deps [deltaNew]) would not rerun.
   * - We also watch totalCount increases (which correspond to new logs, not filter changes) to infer additional events.
   * - To avoid double counting when both deltaNew and totalCount diff are present we take the maximum of the two.
   */
  useEffect(() => {
    if (firstRunRef.current) {
      // Establish baseline without animating existing logs
      prevTotalForDeltaRef.current = totalCount;
      lastProcessedTotalRef.current = totalCount;
      consumedDeltaForTotalRef.current = true;
      firstRunRef.current = false;
      return;
    }

    let increment = 0;
    const prevTotal = prevTotalForDeltaRef.current;

    // Establish baseline without animating (initial load)
    if (prevTotal === undefined && totalCount !== undefined) {
      prevTotalForDeltaRef.current = totalCount;
      lastProcessedTotalRef.current = totalCount;
      consumedDeltaForTotalRef.current = true; // prevent deltaNew for baseline
      return; // no +badge on initial existing logs
    }

    // Detect real new logs via totalCount increase
    if (
      totalCount !== undefined &&
      prevTotal !== undefined &&
      totalCount > prevTotal
    ) {
      increment = totalCount - prevTotal;
      prevTotalForDeltaRef.current = totalCount;
      lastProcessedTotalRef.current = totalCount;
      consumedDeltaForTotalRef.current = true; // mark that this total already produced a delta
    }

    let effectiveDelta = 0;
    if (increment > 0) {
      effectiveDelta = increment;
    } else if (deltaNew && deltaNew > 0) {
      // Only use deltaNew if we didn't already consume a delta for the current totalCount
      if (
        totalCount === lastProcessedTotalRef.current &&
        consumedDeltaForTotalRef.current
      ) {
        return; // duplicate representation of same logs, ignore
      }
      effectiveDelta = deltaNew;
      if (totalCount !== undefined) {
        lastProcessedTotalRef.current = totalCount;
        consumedDeltaForTotalRef.current = true;
      }
    } else {
      return; // nothing to do
    }

    setAnimateDelta((d) => d + effectiveDelta);

    // Start hard hide timer once per continuous visibility period (not reset by new logs)
    if (firstDeltaTsRef.current == null) {
      firstDeltaTsRef.current = performance.now();
      if (hardHideTimerRef.current)
        window.clearTimeout(hardHideTimerRef.current);
      hardHideTimerRef.current = window.setTimeout(() => {
        setAnimateDelta(0);
        firstDeltaTsRef.current = null;
        // Allow future logs to show again
      }, maxDeltaVisibleMs);
    }

    // Reset aggregation (quiet) timer; only schedule vanish after no new logs for aggregationWindowMs
    if (deltaTimerRef.current) window.clearTimeout(deltaTimerRef.current);
    deltaTimerRef.current = window.setTimeout(() => {
      // After quiet period, hide after display duration (vanish timer)
      if (vanishTimerRef.current) window.clearTimeout(vanishTimerRef.current);
      vanishTimerRef.current = window.setTimeout(() => {
        setAnimateDelta(0);
        firstDeltaTsRef.current = null;
        // Clear hard hide timer because we vanish earlier
        if (hardHideTimerRef.current) {
          window.clearTimeout(hardHideTimerRef.current);
          hardHideTimerRef.current = null;
        }
      }, deltaDisplayDurationMs);
    }, aggregationWindowMs);
    return () => {
      if (deltaTimerRef.current) window.clearTimeout(deltaTimerRef.current);
      // Do not clear hardHideTimerRef here so it can enforce the max.
      if (vanishTimerRef.current) window.clearTimeout(vanishTimerRef.current);
    };
  }, [
    totalCount,
    deltaNew,
    aggregationWindowMs,
    deltaDisplayDurationMs,
    maxDeltaVisibleMs,
  ]);

  return {
    displayFiltered: animFiltered ?? displayFiltered,
    displayTotal: animTotal ?? displayTotal,
    isFilteredCounts,
    animateDelta,
    fadeKey,
    formatNumber,
  };
};
