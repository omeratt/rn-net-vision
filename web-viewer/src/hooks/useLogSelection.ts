import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'preact/hooks';
import type { NetVisionLog } from '../types';

/**
 * Single-source-of-truth log selection hook.
 * Stores only the selectedLogId; derives the object and index when needed.
 */
export const useLogSelection = (sortedLogs: NetVisionLog[]) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs to avoid stale closures in global key handler
  const sortedLogsRef = useRef<NetVisionLog[]>(sortedLogs);
  const selectedLogIdRef = useRef<string | null>(selectedLogId);
  const hasAutoSelectedRef = useRef(false);

  // Keep refs current
  useEffect(() => {
    sortedLogsRef.current = sortedLogs;
  }, [sortedLogs]);
  useEffect(() => {
    selectedLogIdRef.current = selectedLogId;
  }, [selectedLogId]);

  // Derive selected log & index
  const selectedLog = useMemo(
    () =>
      selectedLogId
        ? sortedLogs.find((l) => l.id === selectedLogId) || null
        : null,
    [sortedLogs, selectedLogId]
  );
  const selectedIndex = useMemo(() => {
    if (!selectedLogId) return -1;
    return sortedLogs.findIndex((l) => l.id === selectedLogId);
  }, [sortedLogs, selectedLogId]);

  // Clear selection if the selected log disappeared (e.g., pruning)
  useEffect(() => {
    if (selectedLogId && selectedIndex === -1) {
      setSelectedLogId(null);
    }
  }, [selectedIndex, selectedLogId]);

  // (Optional) initial auto-select first log exactly once when logs first arrive
  useEffect(() => {
    if (
      !hasAutoSelectedRef.current &&
      !selectedLogId &&
      sortedLogs.length > 0
    ) {
      hasAutoSelectedRef.current = true;
      setSelectedLogId(sortedLogs[0].id);
    }
  }, [sortedLogs, selectedLogId]);

  // Global keyboard navigation (ArrowUp / ArrowDown)
  useEffect(() => {
    const abortController = new AbortController();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events if the container or its children have focus
      const container = containerRef.current;
      if (!container || !container.contains(document.activeElement)) return;
      const currentLogs = sortedLogsRef.current;
      if (!currentLogs.length) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const delta = e.key === 'ArrowUp' ? -1 : 1;
        navigate(delta);
      }
    };
    document.addEventListener('keydown', handleKeyDown, {
      signal: abortController.signal,
      passive: false,
    });
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus container when logs first appear (don't steal focus from inputs)
  useEffect(() => {
    if (
      sortedLogs.length > 0 &&
      containerRef.current &&
      !document.activeElement?.matches('input, textarea, select')
    ) {
      containerRef.current.focus();
    }
  }, [sortedLogs.length]);

  const selectById = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedLogId(null);
      return;
    }
    // Only set if exists in current logs (defensive)
    if (sortedLogsRef.current.some((l) => l.id === id)) {
      setSelectedLogId(id);
      if (!document.activeElement?.matches('input, textarea, select')) {
        containerRef.current?.focus();
      }
    }
  }, []);

  const handleSelectLog = useCallback(
    (log: NetVisionLog, _visualIndex: number) => {
      selectById(log.id);
    },
    [selectById]
  );

  const clearSelection = useCallback(() => {
    setSelectedLogId(null);
  }, []);

  const navigate = useCallback((delta: -1 | 1) => {
    const logs = sortedLogsRef.current;
    if (!logs.length) return;
    const currentId = selectedLogIdRef.current;
    const currentIndex = currentId
      ? logs.findIndex((l) => l.id === currentId)
      : -1;
    const nextIndex =
      currentIndex === -1
        ? delta === 1
          ? 0
          : logs.length - 1
        : (currentIndex + delta + logs.length) % logs.length;
    setSelectedLogId(logs[nextIndex].id);
  }, []);

  return {
    // State
    selectedLogId,
    selectedLog,
    selectedIndex,
    containerRef,
    // Handlers
    handleSelectLog,
    clearSelection,
    selectById,
    navigate,
  };
};
